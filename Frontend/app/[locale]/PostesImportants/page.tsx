"use client"

import '../Style/PostesImportants.scoped.css'
import Header from '@/components/BasicComponents/Header'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

// LocalStorage MVP types
 type SavedFormation = {
   id: string
   titre: string
   url?: string
   isCertified: boolean
   duration: string
   isGratuit: boolean
   plateforme?: string
 }
 
 type SavedPost = {
   id: string 
   jobDescription: string
   salary?: number
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

export default function Page() {
    const t = useTranslations('savedPosts')
    const [posts, setPosts] = useState<SavedPost[]>([])
    const [loading, setLoading] = useState(true)
 
    useEffect(() => {
        setPosts(loadSavedPosts())
        setLoading(false)
    }, [])
 
    const getInitial = (name: string) => name.charAt(0).toUpperCase()
 
    const getRandomColor = (index: number) => {
        const colors = ['#ea4c89', '#ff4444', '#000', '#4285f4', '#34a853', '#9c27b0', '#ff9800']
        return colors[index % colors.length]
    }
 
    if (loading) {
        return (
            <div>
                <Header />
                <main className="ma-main-container">
                    <h1 className="ma-page1-title">{t('title')}</h1>
                    <p style={{ textAlign: 'center', padding: '40px' }}>{t('loading')}</p>
                </main>
            </div>
        )
    }
 
    return (
        <div>
            <Header />
            <main className="ma-main-container">
                <h1 className="ma-page1-title">{t('title')}</h1>

                {posts.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '40px' }}>
                        {t('noSaved')}
                    </p>
                ) : (
                    posts.map((poste, index) => (
                        <div key={poste.id} className="ma-page1-job-card">
                            <div className="ma-page1-job-left">
                                <div 
                                    className="ma-page1-company-logo" 
                                    style={{ background: getRandomColor(index) }}
                                > 
                                </div>
                                <div className="ma-page1-job-info"> 
                                    <div className="ma-page1-job-meta">
                                        <span>{poste.salary ? `${poste.salary} € ${t('perMonth')}` : t('salaryNA')}</span>
                                        <span>{poste.formations.length} {t('formationsSaved')}</span>
                                    </div>
                                    <p style={{ marginTop: '8px', color: '#666', fontSize: '14px', maxWidth: 800 }}>
                                        {poste.jobDescription}
                                    </p>
                                </div>
                            </div>
                            <Link href={`/FormationsPoste?savedId=${poste.id}`}>
                                <button className="ma-page1-view-btn">
                                    {t('viewFormations')} <span>→</span>
                                </button>
                            </Link>
                        </div>
                    ))
                )}
            </main>
        </div>
    )
}
