"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from 'next-intl'
import MethodSelector from "@/components/AnalyseCV/MethodSelector"
import SectionMixed from "@/components/AnalyseCV/SectionMixed"
import FileUploadZone from "@/components/AnalyseCV/FileUploadZone"
import CvPreview from "@/components/AnalyseCV/CvPreview"
import { analysisService, CvAnalysisRequest } from "@/lib/api"
import dynamic from 'next/dynamic'

const HtmlLoaderClient = dynamic(() => import('@/components/Loading/HtmlLoader'), { ssr: false })

export default function AnalyseForm() {
  const t = useTranslations('analysis')
  const [method, setMethod] = useState<"url" | "mixed">("mixed")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("") 
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      let response

      // Mixed analysis
      if (!jobDescription) {
        setError(t('fillJobDescription'))
        setLoading(false)
        return
      }

      if (cvFile) {
        response = await analysisService.analyzeCvWithFile(cvFile, jobDescription)
      } else {
        const request: CvAnalysisRequest = {
          cvText: "CV text extracted from saved CV", // In production, fetch from backend 
          jobDescription,
        }
        response = await analysisService.analyzeCv(request)
      }

      if (response.error) {
        setError(response.error)
      } else if (response.data) {
        // Store result and navigate to result page
        sessionStorage.setItem('cvAnalysisResult', JSON.stringify(response.data))
        router.push('/ResultatAnalyse')
      }
    } catch (err) {
      setError(t('error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loading && <HtmlLoaderClient />}
    <form id="analyse-form" onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
      <input type="hidden" name="method" id="method-field" value={method} />

      <SectionMixed
        jobDescription={jobDescription}
        setJobDescription={setJobDescription}
      />

      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>{t('chooseCV')}</legend>


        <div id="cv-upload-area" className="field">
          {!cvFile ? (
            <FileUploadZone
              onFileSelect={(file) => setCvFile(file)}
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              disabled={loading}
            />
          ) : (
            <CvPreview
              file={cvFile}
              onRemove={() => setCvFile(null)}
            />
          )}
        </div>

        <div id="cv-saved-area" className="field" style={{ display: 'none' }}>
          <label htmlFor="saved-cv">CV sauvegardé</label>
          <select id="saved-cv" name="saved_cv">
            <option value="">-- Aucun sélectionné --</option>
            <option value="CV_steve_2025.pdf">CV_steve_2025.pdf (mis à jour le 2025-11-16)</option>
          </select>
          <div className="small-muted">Sélectionnez un CV sauvegardé (simulé).</div>
        </div>
      </fieldset>

      {error && (
        <div className="message-area error" style={{
          padding: '12px',
          borderRadius: '8px',
          background: '#fee',
          color: '#c00',
          marginTop: '16px'
        }}>
          {error}
        </div>
      )}

      <div className="footer">
        <div className="small-muted">{t('aiHelper')}</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="submit" className="btn" id="analyse-btn" disabled={loading}>
            {loading ? t('analyzing') : t('analyze')}
          </button>
          <button type="reset" className="btn secondary" id="reset-btn" disabled={loading}>
            {t('reset')}
          </button>
        </div>
      </div>

    </form>
    </>
  )
}
