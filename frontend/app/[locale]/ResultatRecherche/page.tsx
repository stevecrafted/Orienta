"use client"

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import Header from '@/components/BasicComponents/Header'
import '../Style/ResultatRecherche.scoped.css'
import type { JobResearchResponse, JobResult, CvProfile } from '@/lib/api/jobResearchService'

export default function ResultatRecherche() {
    const tJob = useTranslations('jobResearch')
    const tRes = useTranslations('results')
    const router = useRouter()
    const [result, setResult] = useState<JobResearchResponse | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [filter, setFilter] = useState<'all' | 'remote' | 'onsite'>('all')
    const [notification, setNotification] = useState<string | null>(null)

    useEffect(() => {
        // Charger les résultats depuis sessionStorage
        const storedResult = sessionStorage.getItem('jobResearchResult')
        
        if (storedResult) {
            try {
                const parsed: JobResearchResponse = JSON.parse(storedResult)
                setResult(parsed)
            } catch (err) {
                console.error("Erreur lors du parsing des résultats:", err)
            }
        }
        
        setLoading(false)
    }, [])

    /**
     * Copie la requête Google dans le presse-papier
     */
    const handleCopyQuery = () => {
        if (result?.googleQuery) {
            navigator.clipboard.writeText(result.googleQuery)
            showNotification("Requête copiée dans le presse-papier !")
        }
    }

    /**
     * Ouvre la recherche Google dans une nouvelle fenêtre
     */
    const handleSearchGoogle = () => {
        if (result?.googleQuery) {
            const url = `https://www.google.com/search?q=${encodeURIComponent(result.googleQuery)}`
            window.open(url, '_blank')
        }
    }

    /**
     * Ouvre l'URL d'une offre d'emploi
     */
    const handleOpenJob = (url: string) => {
        window.open(url, '_blank')
    }

    /**
     * Sauvegarde une offre (non implémenté pour le moment)
     */
    const handleSaveJob = (job: JobResult) => {
        showNotification("Fonctionnalité bientôt disponible !")
    }

    /**
     * Affiche une notification temporaire
     */
    const showNotification = (message: string) => {
        setNotification(message)
        setTimeout(() => setNotification(null), 3000)
    }

    /**
     * Filtre les résultats selon le type
     */
    const filteredJobs = result?.jobResults.filter(job => {
        if (filter === 'remote') return job.isRemote
        if (filter === 'onsite') return !job.isRemote
        return true
    }) || []

    if (loading) {
        return (
            <div className="resultat-recherche-page">
                <Header />
                <div className="container">
                    <div className="loading">{tRes('loadingResults')}</div>
                </div>
            </div>
        )
    }

    if (!result) {
        return (
            <div className="resultat-recherche-page">
                <Header />
                <div className="container">
                    <div className="no-results">
                        <h2>{tJob('noResultsHeader')}</h2>
                        <p>{tJob('pleaseSearch')}</p>
                        <button onClick={() => router.push('/JobResearch')} className="btn-primary">
                            {tJob('performSearchButton')}
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="resultat-recherche-page">
            <Header />

            <div className="container">
                {/* Notification */}
                {notification && (
                    <div className="notification">
                        {notification}
                    </div>
                )}

                {/* En-tête avec profil */}
                <div className="results-header">
                    <h1>{tJob('resultsTitle')}</h1>
                    <ProfileSummary profile={result.extractedProfile} />
                </div>

                {/* Requête Google générée */}
                <div className="query-display">
                    <h2>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        {tJob('optimizedQueryTitle')}
                    </h2>
                    
                    <h4>{tJob('querySuggestion')}</h4>

                    <div className="query-box">
                        <code>{result.googleQuery}</code>
                    </div>

                    <div className="query-actions">
                        
                        <button onClick={handleSearchGoogle} className="btn-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" x2="21" y1="14" y2="3" />
                            </svg>
                            {tJob('searchOnGoogle')}
                        </button>
                    </div>
                </div>

                {/* Filtres */}
                <div className="filters">
                    <button 
                        className={filter === 'all' ? 'active' : ''} 
                        onClick={() => setFilter('all')}
                    >
                        {tJob('filters.all')} ({result.jobResults.length})
                    </button>
                    <button 
                        className={filter === 'remote' ? 'active' : ''} 
                        onClick={() => setFilter('remote')}
                    >
                        {tJob('remote')} ({result.jobResults.filter(j => j.isRemote).length})
                    </button>
                    <button 
                        className={filter === 'onsite' ? 'active' : ''} 
                        onClick={() => setFilter('onsite')}
                    >
                        {tJob('onsite')} ({result.jobResults.filter(j => !j.isRemote).length})
                    </button>
                </div>

                {/* Liste des offres */}
                <div className="jobs-grid">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map((job, index) => (
                            <JobCard 
                                key={index} 
                                job={job} 
                                onOpen={() => handleOpenJob(job.url)}
                                onSave={() => handleSaveJob(job)}
                            />
                        ))
                    ) : (
                        <div className="no-jobs">
                            {tJob('noJobsFiltered')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

/**
 * Composant pour afficher le résumé du profil
 */
function ProfileSummary({ profile }: { profile: CvProfile }) {
    const tJob = useTranslations('jobResearch')

    return (
        <div className="profile-summary">
            <div className="profile-header">
                <div className="profile-avatar">
                    {profile.name.charAt(0).toUpperCase()}
                </div>
                <div className="profile-info">
                    <h3>{profile.name}</h3>
                    <p className="profile-title">{profile.title || tJob('defaultProfileTitle')}</p>
                </div>
            </div>
            
            <div className="profile-details">
                {profile.yearsOfExperience !== undefined && (
                    <div className="detail-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                            <line x1="16" x2="16" y1="2" y2="6" />
                            <line x1="8" x2="8" y1="2" y2="6" />
                            <line x1="3" x2="21" y1="10" y2="10" />
                        </svg>
                        {profile.yearsOfExperience} {profile.yearsOfExperience > 1 ? tJob('yearsPlural') : tJob('yearsSingular')} d'expérience
                    </div>
                )}
                {profile.location && (
                    <div className="detail-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        {profile.location}
                    </div>
                )}
                {profile.skills && profile.skills.length > 0 && (
                    <div className="detail-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                        </svg>
                        {profile.skills.length} compétences
                    </div>
                )}
            </div>
        </div>
    )
}

/**
 * Composant pour afficher une carte d'offre d'emploi
 */
function JobCard({ job, onOpen, onSave }: { 
    job: JobResult, 
    onOpen: () => void,
    onSave: () => void 
}) {
    return (
        <div className="job-card">
            <div className="job-header">
                <h3>{job.title}</h3>
                {job.isRemote && (
                    <span className="badge-remote">Remote</span>
                )}
            </div>
            
            <div className="job-company">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                {job.company}
            </div>
            
            <div className="job-location">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                </svg>
                {job.location}
            </div>
            
            <p className="job-description">{job.description}</p>
            
            <div className="job-actions">
                <button onClick={onOpen} className="btn-open">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" x2="21" y1="14" y2="3" />
                    </svg>
                    Ouvrir
                </button>
                {/* <button onClick={onSave} className="btn-save" disabled>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                        <polyline points="17 21 17 13 7 13 7 21" />
                        <polyline points="7 3 7 8 15 8" />
                    </svg>
                    Sauvegarder
                </button> */}
            </div>
        </div>
    )
}
