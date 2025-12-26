"use client"

import { useEffect, useMemo, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Header from '@/components/BasicComponents/Header'
import '../Style/FormationsPoste.scoped.css'
import type { CvAnalysisResponse, FormationRecommendation } from '@/lib/api/analysisService'
import { savedPostService } from '@/lib/api/savedPostService' 

// Types for localStorage MVP
type SavedFormation = FormationRecommendation & { savedAt: string }

type SavedPost = {
  id: string
  backendPostId?: number
  jobDescription: string
  salary?: number
  missingSkills?: string[]
  formations: SavedFormation[]
  createdAt: string
}

const LS_KEY = 'savedPositions'

function loadSavedPosts(): SavedPost[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveSavedPosts(posts: SavedPost[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(LS_KEY, JSON.stringify(posts))
}

function FormationsPosteContent() {
  const t = useTranslations('formations')
  const tc = useTranslations('common')
  const params = useSearchParams()
  const router = useRouter()

  const from = params.get('from') // 'analyse' when coming from results
  const savedId = params.get('savedId') // when opening an already-saved post

  const [analysis, setAnalysis] = useState<CvAnalysisResponse | null>(null)
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([])
  const [currentSaved, setCurrentSaved] = useState<SavedPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState<string | null>(null)
  const [openedUrls, setOpenedUrls] = useState<Set<string>>(new Set())

  // Load sources (sessionStorage for analysis + localStorage for saved posts)
  useEffect(() => {
    setSavedPosts(loadSavedPosts())

    // If opening a saved post by id
    if (savedId) {
      const posts = loadSavedPosts()
      const found = posts.find(p => p.id === savedId) || null
      setCurrentSaved(found)
      setLoading(false)
      return
    }

    // If coming from analysis
    if (from === 'analyse') {
      const raw = sessionStorage.getItem('cvAnalysisResult')
      if (raw) {
        try {
          const parsed: CvAnalysisResponse = JSON.parse(raw)
          setAnalysis(parsed)
        } catch { }
      }
    }
    setLoading(false)
  }, [from, savedId])

  // Post meta (title/desc/missing) come from either saved or analysis 
  const jobDescription = useMemo(() => currentSaved?.jobDescription || analysis?.jobDescription || '', [currentSaved, analysis])
  const missingSkills = useMemo(() => currentSaved?.missingSkills || analysis?.missingSkills || [], [currentSaved, analysis])

  // Source formations: saved or recommendations from analysis
  const formations: FormationRecommendation[] = useMemo(() => {
    if (currentSaved) {
      // Afficher uniquement les formations non encore sauvegardées est inutile ici,
      // car dans le contexte d'un poste sauvegardé, on montre la liste associée.
      return currentSaved.formations
    }
    // Si on vient de l'analyse, afficher les recommandations et masquer celles déjà sauvegardées s'il y en a en local
    const recs = analysis?.recommendedFormations || []
    const saved = loadSavedPosts()
      .flatMap(p => p.formations.map(f => f.id))
    return recs.filter(r => !saved.includes(r.id))
  }, [currentSaved, analysis])

  // Group formations by targeted skills
  const formationsBySkill = useMemo(() => {
    const grouped: Record<string, FormationRecommendation[]> = {}

    formations.forEach(f => {
      const skills = f.targetedSkills || ['Autres compétences']
      skills.forEach(skill => {
        if (!grouped[skill]) {
          grouped[skill] = []
        }
        grouped[skill].push(f)
      })
    })

    return grouped
  }, [formations])

  async function ensureSavedPost(): Promise<SavedPost> {
    // Check user login
    const currentUserRaw = localStorage.getItem('currentUser')
    if (!currentUserRaw) {
      alert("Vous devez créer un compte ou vous connecter pour sauvegarder ce poste.")
      router.push('/Login')
      throw new Error('User not logged in')
    }

    // Si currentSaved existe, on réutilise
    if (currentSaved && currentSaved.backendPostId) {
      return currentSaved
    }

    // Sinon, on essaye de retrouver via savedId
    if (savedId) {
      const posts = loadSavedPosts()
      const found = posts.find(p => p.id === savedId)
      if (found) {
        setCurrentSaved(found)
        return found
      }
    }

    // Si pas trouvé, créer un nouveau poste backend
    const now = new Date().toISOString()
    const newPostLocalId = crypto.randomUUID()
    let backendPostId: number | undefined = undefined

    try {
      const res = await savedPostService.createPostForUser(1, {
        description: jobDescription || ''
      })
      backendPostId = (res.data as any)?.id
    } catch (e) {
      console.error(e)
    }

    const newPost: SavedPost = {
      id: newPostLocalId,
      backendPostId,
      jobDescription: jobDescription || '',
      missingSkills,
      formations: [],
      createdAt: now,
    }

    const updated = [...savedPosts, newPost]
    setSavedPosts(updated)
    saveSavedPosts(updated)
    setCurrentSaved(newPost)

    // Mettre à jour l'URL avec savedId
    const qs = new URLSearchParams({ savedId: newPost.id }).toString()
    window.history.replaceState({}, '', `/FormationsPoste?${qs}`)

    return newPost
  }

  async function handleSaveFormation(f: FormationRecommendation) {
    console.log("🔵 Sauvegarde de la formation:", f.titre)
    const post = await ensureSavedPost()
    console.log("📌 Poste à utiliser - Local ID:", post.id, "Backend ID:", post.backendPostId)

    // Avoid duplicates by id+url+titre combo
    const exists = post.formations.some(x => (x.id === f.id) || (x.url && x.url === f.url) || x.titre === f.titre)
    if (exists) {
      console.log("⚠️ Formation déjà sauvegardée, ignorée")
      return
    }

    const toSave: SavedFormation = { ...f, savedAt: new Date().toISOString() }
    const updatedPost: SavedPost = { ...post, formations: [...post.formations, toSave] }
    const updatedAll = savedPosts.map(p => p.id === post.id ? updatedPost : p)

    setSavedPosts(updatedAll)
    saveSavedPosts(updatedAll)
    setCurrentSaved(updatedPost)
    console.log("💾 Formation sauvegardée localement")

    // Afficher la notification
    setNotification(`✅ Formation "${f.titre}" sauvegardée avec succès!`)
    setTimeout(() => setNotification(null), 3000)

    // Après sauvegarde locale, si on est en mode 'analyse' (pas encore savedId),
    // retirer la formation de la liste des recommandations en mémoire pour la masquer immédiatement
    if (!currentSaved && analysis) {
      try {
        const raw = sessionStorage.getItem('cvAnalysisResult')
        if (raw) {
          const parsed: CvAnalysisResponse = JSON.parse(raw)
          parsed.recommendedFormations = parsed.recommendedFormations.filter(x => x.id !== toSave.id)
          sessionStorage.setItem('cvAnalysisResult', JSON.stringify(parsed))
          setAnalysis(parsed)
        }
      } catch { }
    }

    // Backend sync (best-effort)
    try {
      if (updatedPost.backendPostId) {
        console.log("🌐 Synchronisation avec le backend - Poste ID:", updatedPost.backendPostId)
        await savedPostService.addFormationToPost(updatedPost.backendPostId, {
          id: toSave.id,
          titreFormation: toSave.titre,
          isCertified: !!toSave.isCertified,
          duration: toSave.duration || '',
          isGratuit: toSave.isGratuit ? 'oui' : 'non',
        })
        console.log("✅ Formation synchronisée avec le backend")
      } else {
        console.warn("⚠️ Pas de backendPostId, synchronisation ignorée")
      }
    } catch (e) {
      console.error("❌ Erreur lors de la synchronisation backend:", e)
    }
  }

  function handleOpenFormation(f: FormationRecommendation) {
    if (f.url) {
      window.open(f.url, '_blank')
      setOpenedUrls(prev => new Set(Array.from(prev).concat([f.url!])))
    }
  }

  async function handleSavePostMeta() {
    const post = await ensureSavedPost()
    const updatedPost: SavedPost = {
      ...post,
      jobDescription,
      missingSkills,
    }
    const updatedAll = savedPosts.map(p => p.id === post.id ? updatedPost : p)
    setSavedPosts(updatedAll)
    saveSavedPosts(updatedAll)
  }

  if (loading) {
    return (
      <div>
        <Header />
        <main className="ma-main-container">
          <p style={{ textAlign: 'center', padding: 40 }}>{tc('loading')}</p>
        </main>
      </div>
    )
  }

  return (
    <div>
      <Header />

      {/* Notification Toast */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#10b981',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 9999,
          animation: 'slideIn 0.3s ease-out',
          fontWeight: 500
        }}>
          {notification}
        </div>
      )}

      <main className="ma-main-container">
        <div className="ma-page2-grid">
          {/* Left: formations list */}
          <div className="ma-page2-left-panel">
            <h2 className="ma-page2-section-title">{t('recommendedBySkill')}</h2>

            {formations.length === 0 ? (
              <p style={{ color: '#666' }}>{t('noFormations')}</p>
            ) : (
              Object.entries(formationsBySkill).map(([skill, skillFormations]) => (
                <div key={skill} style={{ marginBottom: '32px' }}>
                  {/* Skill Header */}
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#667eea',
                    marginBottom: '16px',
                    paddingBottom: '8px',
                    borderBottom: '2px solid #e0e7ff'
                  }}>
                    🎯 {skill}
                  </h3>

                  {/* Formations for this skill */}
                  {skillFormations.map((f, idx) => {
                    const isOpened = f.url && openedUrls.has(f.url)
                    return (
                      <div key={`${f.id}-${idx}`} className="ma-page2-formation-card" style={{
                        opacity: isOpened ? 0.7 : 1,
                        border: isOpened ? '2px solid #10b981' : undefined,
                        position: 'relative'
                      }}>
                        {isOpened && (
                          <div style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: '#10b981',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600
                          }}>
                            ✓ {t('alreadyOpened')}
                          </div>
                        )}
                        <div className="ma-page2-formation-left">
                          <div className="ma-page2-formation-logo">{(f.plateforme || 'UP').slice(0, 2)}</div>
                          <div className="ma-page2-formation-info">
                            <h4>{f.titre}</h4>

                            {f.plateforme && <div style={{ color: '#888', fontSize: 12 }}>📚 {f.plateforme}</div>}
                            {f.url && (
                              <div style={{
                                color: '#667eea',
                                fontSize: 11,
                                marginTop: 4,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: '100%'
                              }}>
                                🔗 {f.url}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="ma-page2-formation-actions">
                          <button className="ma-page2-btn-open" onClick={() => handleOpenFormation(f)}>{t('open')}</button>
                          {/* <button className="ma-page2-btn-save" onClick={() => handleSaveFormation(f)}>Sauvegarder</button> */}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))
            )}
          </div>

          {/* Right: job info + salary */}
          <div className="ma-page2-right-panel">
            <h2 className="ma-page2-section-title">{t('postTitle')}</h2>

            <div className="ma-page2-job-header">
              <div className="ma-page2-job-badges">
                {currentSaved && <span className="ma-page2-badge ma-page2-badge-featured">{t('saved')}</span>}
                <span className="ma-page2-badge ma-page2-badge-fulltime">{t('profileTargeted')}</span>
              </div>
              {/* <p className="ma-page2-salary">
                <button
                  onClick={handleSavePostMeta}
                  className="ma-page2-btn-register"
                  style={{ marginLeft: 12 }}
                >Enregistrer le poste</button>
              </p> */}
            </div>

            <h3 className="ma-page2-section-title">{t('missingSkillsHeader')}</h3>
            {missingSkills && missingSkills.length > 0 ? (
              <ul className="ma-page2-competences-list">
                {missingSkills.map((s, i) => (<li key={i}>{s}</li>))}
              </ul>
            ) : (
              <p style={{ color: '#666' }}>{t('noMissingSkills')}</p>
            )}

            <div className="ma-page2-save-box">
              <p>{t('saveBoxDesc')}</p>
              <button className="ma-page2-btn-register" onClick={handleSavePostMeta}>{t('saveBoxButton')} <span>→</span></button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Chargement...</div>
      </div>
    }>
      <FormationsPosteContent />
    </Suspense>
  )
}
