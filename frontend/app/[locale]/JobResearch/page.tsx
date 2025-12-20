"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Header from '@/components/BasicComponents/Header'
import dynamic from 'next/dynamic'

const HtmlLoaderClient = dynamic(() => import('@/components/Loading/HtmlLoader'), { ssr: false })
import FileUploadZone from '@/components/AnalyseCV/FileUploadZone'
import CvPreview from '@/components/AnalyseCV/CvPreview'
import '../Style/JobResearch.scoped.css'
import { jobResearchService, type JobResearchResponse } from '@/lib/api/jobResearchService'

export default function JobResearch() {
    const t = useTranslations('jobResearch')
    const router = useRouter()
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [location, setLocation] = useState<string>("Antananarivo")
    const [includeRemote, setIncludeRemote] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    /**
     * Gère la sélection d'un fichier
     */
    const handleFileSelect = (file: File) => {
        setSelectedFile(file)
        setError(null)
    }

    /**
     * Gère le clic sur "Supprimer" dans la preview
     */
    const handleRemoveFile = () => {
        setSelectedFile(null)
    }

    /**
     * Gère la soumission du formulaire
     */
    const handleSubmit = async () => {
        if (!selectedFile) {
            setError(t('selectFile'))
            return
        }

        setLoading(true)
        setError(null)

        try {
            // Appeler le service de recherche d'emploi
            const result: JobResearchResponse = await jobResearchService.analyzeAndSearchJobs(
                selectedFile,
                location,
                includeRemote
            )

            // Stocker le résultat dans sessionStorage pour la page de résultats
            sessionStorage.setItem('jobResearchResult', JSON.stringify(result))

            // Rediriger vers la page de résultats
            router.push('/ResultatRecherche')

        } catch (err: any) {
            console.error("Erreur lors de la recherche d'emploi:", err)
            setError(
                err.response?.data?.error || 
                err.message || 
                t('selectFile')
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="job-research-page">
            {loading && <HtmlLoaderClient />}
            <Header />
            
            <div className="container">
                <main className="card" role="main" aria-labelledby="page-title">
                    <h1 id="page-title">{t('title')}</h1>
                    <p className="subtitle">
                        {t('selectFile')}
                    </p>

                    {/* Zone de téléchargement de fichier */}
                    <div className="upload-section">
                        {!selectedFile ? (
                            <FileUploadZone 
                                onFileSelect={handleFileSelect}
                                accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
                            />
                        ) : (
                            <CvPreview 
                                file={selectedFile}
                                onRemove={handleRemoveFile}
                            />
                        )}
                    </div>

                    {/* Options de recherche */}
                    {selectedFile && (
                        <div className="search-options">
                            <h2>{t('location')}</h2>
                            
                            <div className="option-group">
                                <label htmlFor="location">{t('location')}</label>
                                <input
                                    id="location"
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder={t('locationPlaceholder')}
                                    className="location-input"
                                />
                            </div>

                            <div className="option-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={includeRemote}
                                        onChange={(e) => setIncludeRemote(e.target.checked)}
                                    />
                                    <span>{t('includeRemote')}</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Message d'erreur */}
                    {error && (
                        <div className="error-message" role="alert">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="20" 
                                height="20" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Bouton de soumission */}
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedFile || loading}
                        className="submit-button"
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                {t('searching')}
                            </>
                        ) : (
                            <>
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="20" 
                                    height="20" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="2"
                                >
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.35-4.35" />
                                </svg>
                                {t('search')}
                            </>
                        )}
                    </button>

                    {/* Information supplémentaire */}
                    <div className="info-box">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4" />
                            <path d="M12 8h.01" />
                        </svg>
                        <div>
                            <strong>{t('howItWorksTitle')}</strong>
                            <p>{t('howItWorksDesc')}</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
