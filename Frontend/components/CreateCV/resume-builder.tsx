"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/store"
import Sidebar from "@/components/CreateCV/sidebar"
import ResumeTemplateDoubleColumn from "@/components/CreateCV/ResumeTemplates/resume-template-double-column"
import ResumeTemplateElegant from "@/components/CreateCV/ResumeTemplates/resume-template-elegant" 
import { cn } from "@/lib/utils"
import { useTranslations } from 'next-intl'
import { useAutoSave } from "@/lib/hooks/useAutoSave"
import AutoSaveIndicator from "@/components/CreateCV/AutoSaveIndicator"
import { Check, Save, Loader2, AlertCircle, Upload } from "lucide-react"
import { Button } from "@/components/CreateCV/ui/button"
import { cvService } from "@/lib/api/cvService"

interface ResumeBuilderProps {
  cvId?: number;
  utilisateurId?: number;
  autoSaveEnabled?: boolean;
}

export default function ResumeBuilder({ 
  cvId, 
  utilisateurId,
  autoSaveEnabled = true 
}: ResumeBuilderProps = {}) {
  const dispatch = useDispatch()
  const t = useTranslations('cv')
  const { template, fontSize, fontFamily } = useSelector((state: RootState) => state.settings)
  const { header, sections } = useSelector((state: RootState) => state.resume)
  const activeSection = useSelector((state: RootState) => state.resume.activeSection)
  const resumeRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>
  
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const [currentCvId, setCurrentCvId] = useState<number | undefined>(cvId)
  
  // Auto-save hook
  const { saveStatus, lastSaved, forceSave } = useAutoSave({
    delay: 5000, // Sauvegarde après 2 secondes d'inactivité
    enabled: autoSaveEnabled,
    cvId: currentCvId,
    utilisateurId,
    onSave: () => {
      console.log('CV sauvegardé avec succès');
    },
    onError: (error) => {
      console.error('Erreur lors de la sauvegarde:', error);
    },
  })

  const handleAddSectionClick = (column: "left" | "right") => {
    dispatch({
      type: "resume/setAddSectionModal",
      payload: { isOpen: true, column },
    })
  }

  const handleSaveToDatabase = async () => {
    if (!utilisateurId) {
      setSaveMessage({ type: 'error', text: 'Utilisateur non connecté' })
      setTimeout(() => setSaveMessage(null), 3000)
      return
    }

    setIsSaving(true)
    setSaveMessage(null)

    try {
      // Préparer les données du CV
      const cvData = {
        nom: header.name || 'Mon CV',
        description: header.title || 'CV professionnel',
        templateType: template,
        categorie: 'personnel',
        contenuJson: {
          header,
          sections,
          settings: {
            template,
            fontSize,
            fontFamily,
          }
        },
        estActif: true,
        utilisateurId: utilisateurId
      }

      let response
      if (currentCvId) {
        // Mise à jour d'un CV existant
        response = await cvService.updateCvModele(currentCvId, cvData)
        setSaveMessage({ type: 'success', text: 'CV mis à jour avec succès !' })
      } else {
        // Création d'un nouveau CV
        response = await cvService.createCvModele(cvData)
        const newCvId = response.data.id
        setCurrentCvId(newCvId)
        
        // Mettre à jour l'URL avec le nouvel ID
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href)
          url.searchParams.set('cvId', newCvId.toString())
          window.history.replaceState({}, '', url)
        }
        
        setSaveMessage({ type: 'success', text: 'CV créé avec succès !' })
      }

      setTimeout(() => setSaveMessage(null), 3000)
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error)
      setSaveMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Erreur lors de la sauvegarde du CV' 
      })
      setTimeout(() => setSaveMessage(null), 5000)
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    const handleAddSectionEvent = (event: Event) => {
      const customEvent = event as CustomEvent
      if (customEvent.detail && customEvent.detail.column) {
        handleAddSectionClick(customEvent.detail.column)
      }
    }

    window.addEventListener("addSection", handleAddSectionEvent)

    return () => {
      window.removeEventListener("addSection", handleAddSectionEvent)
    }
  }, [])

  const renderTemplate = () => {
    switch (template) {
      case "elegant":
        return <ResumeTemplateElegant resumeRef={resumeRef} />
      // case "timeline":
      //   return <ResumeTemplateTimeline resumeRef={resumeRef} />
      case "double-column":
      default:
        return <ResumeTemplateDoubleColumn resumeRef={resumeRef} />
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Barre d'actions avec auto-save et sauvegarde manuelle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          {autoSaveEnabled && (
            <AutoSaveIndicator 
              status={saveStatus} 
              lastSaved={lastSaved}
            />
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={handleSaveToDatabase}
            disabled={isSaving || !utilisateurId}
            variant="default"
            size="default"
            className={cn("flex items-center gap-2 font-semibold px-4 py-2 rounded-md shadow-sm", "bg-amber-500 text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-300")}
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {t ? t('saving') ?? 'Saving...' : 'Saving...'}
              </>
            ) : (
              <>
                <Upload size={18} />
                {currentCvId ? t('updateLabel') ?? 'Update' : t('publishMarketplace') ?? 'Publish to marketplace'}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Messages de sauvegarde */}
      {saveMessage && (
        <div className={`p-4 rounded-lg ${
          saveMessage.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {saveMessage.type === 'success' ? (
              <Check size={18} className="flex-shrink-0" />
            ) : (
              <AlertCircle size={18} className="flex-shrink-0" />
            )}
            <p className="font-medium">{saveMessage.text}</p>
          </div>
        </div>
      )}

      {/* Toast discret "Sauvegardé" à chaque fin de sauvegarde
      {autoSaveEnabled && saveStatus === 'saved' && (
        <div className="fixed bottom-4 right-4 z-50 bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check size={16} /> Sauvegardé
        </div>
      )} */}

      <div className="flex flex-col md:flex-row gap-3 md:gap-8">
        <Sidebar resumeRef={resumeRef} />

        <div className="resume-editor-wrapper flex flex-row flex-wrap items-center justify-center relative z-[1] w-full md:w-[890px]">
          <div className={cn("resume-renderer-page browser-resume-page browserResumePage relative h-full pt-4 px-4 pb-0 lg:pt-9 lg:px-9", activeSection?.id && 'resume-editor-overlay')}>
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  )
}
