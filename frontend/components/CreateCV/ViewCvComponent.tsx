"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { useTranslations } from 'next-intl'
import { useDispatch } from "react-redux"
import { cvService } from "@/lib/api/cvService"
import { Loader2, Download, AlertCircle } from "lucide-react"
import ResumeTemplateDoubleColumn from "@/components/CreateCV/ResumeTemplates/resume-template-double-column"
import ResumeTemplateElegant from "@/components/CreateCV/ResumeTemplates/resume-template-elegant"
import html2canvas from "html2canvas-pro"
import jsPDF from "jspdf"
import { Button } from "@/components/CreateCV/ui/button"
import { loadResumeState } from "@/lib/features/resume/resumeSlice"

interface ViewCvComponentProps {
  cvId: number
  isReadOnly?: boolean // Nouveau prop pour mode lecture seule
}

export default function ViewCvComponent({ cvId, isReadOnly = true }: ViewCvComponentProps) {
  const dispatch = useDispatch()
  const tCandidates = useTranslations('candidates')
  const resumeRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cvData, setCvData] = useState<any>(null)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    const loadCvData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await cvService.getCvModeleById(cvId)
        const cvModele = response.data
        
        if (!cvModele) {
          setError("CV non trouvé")
          return
        }

        setCvData(cvModele)

        if (cvModele.contenuJson) {
          const contenuJson = typeof cvModele.contenuJson === 'string' 
            ? JSON.parse(cvModele.contenuJson) 
            : cvModele.contenuJson

          dispatch(loadResumeState({
            header: contenuJson.header,
            sections: contenuJson.sections,
          }))
        }
      } catch (err: any) {
        console.error("Erreur lors du chargement du CV:", err)
        setError(err.response?.data?.message || "Erreur lors du chargement du CV")
      } finally {
        setLoading(false)
      }
    }

    if (cvId) {
      loadCvData()
    }
  }, [cvId, dispatch])

  const handleExportPDF = async () => {
    if (!resumeRef.current) return

    setIsExporting(true)

    try {
      const resumeElement = resumeRef.current
      const clone = resumeElement.cloneNode(true) as HTMLElement

      clone.style.width = "794px"
      clone.style.height = "1123px"
      clone.style.padding = "40px"
      clone.style.position = "absolute"
      clone.style.top = "-9999px"
      clone.style.left = "-9999px"

      const buttons = clone.querySelectorAll("button")
      buttons.forEach((button) => button.remove())

      const hoverElements = clone.querySelectorAll(".group, .hover\\:bg-gray-50")
      hoverElements.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.classList.remove("group", "hover:bg-gray-50")
        }
      })

      const elementsWithColor = clone.querySelectorAll("*")
      elementsWithColor.forEach((el) => {
        if (el instanceof HTMLElement) {
          if (el.style.color && el.style.color.includes("oklch")) {
            el.style.color = "#000000"
          }
          if (el.style.backgroundColor && el.style.backgroundColor.includes("oklch")) {
            el.style.backgroundColor = "#ffffff"
          }
          if (el.style.borderColor && el.style.borderColor.includes("oklch")) {
            el.style.borderColor = "#cccccc"
          }
        }
      })

      document.body.appendChild(clone)

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      })

      document.body.removeChild(clone)

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

      const fileName = cvData?.nom ? `${cvData.nom.toLowerCase().replace(/\s+/g, "_")}_cv.pdf` : "cv.pdf"
      pdf.save(fileName)
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error)
      alert("Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.")
    } finally {
      setIsExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Chargement du CV...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">Erreur</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  const template = cvData?.templateType || "double-column"

  const renderTemplate = () => {
    switch (template) {
      case "elegant":
        return <ResumeTemplateElegant resumeRef={resumeRef} />
      case "double-column":
      default:
        return <ResumeTemplateDoubleColumn resumeRef={resumeRef} />
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header avec info et bouton télécharger */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {cvData?.nom || "Visualisation du CV"}
            </h1>
            {cvData?.description && (
              <p className="text-gray-600">{cvData.description}</p>
            )} 
          </div>
          <div className="flex items-center">
          <Button
            onClick={handleExportPDF}
            disabled={isExporting}
            variant="default"
            size="lg"
            className="flex items-center justify-center font-semibold"
          >
            {isExporting ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Génération du PDF...
              </>
            ) : (
              <>
                <Download size={18} className="mr-2" />
                Télécharger en PDF
              </>
            )}
          </Button>
          {(() => {
            try {
              const contenu = typeof cvData?.contenuJson === 'string' ? JSON.parse(cvData.contenuJson) : cvData?.contenuJson
              const email = contenu?.header?.email
              if (email) {
                const subject = encodeURIComponent(`Opportunity from Hirion - ${cvData?.nom || ''}`)
                const body = encodeURIComponent(`Hello ${contenu?.header?.name || ''},\n\nI saw your profile on Hirion and would like to discuss a potential opportunity with you.\n\nRegards, `)
                return (
                  <a
                    href={`mailto:${email}?subject=${subject}&body=${body}`}
                    className="ml-3 inline-flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-lg"
                  >
                    {tCandidates('contact')}
                  </a>
                )
              }
            } catch (e) { }
            return null
          })()}
          </div>
        </div>
      </div>

      {/* CV Display */}
      <div className="flex justify-center">
        <div 
          className="resume-editor-wrapper w-full md:w-[890px]"
          // Désactiver les interactions si mode lecture seule
          style={isReadOnly ? { pointerEvents: 'none' } : {}}
        >
          <div className="resume-renderer-page browser-resume-page browserResumePage relative h-full pt-4 px-4 pb-0 lg:pt-9 lg:px-9 bg-white rounded-lg shadow-lg">
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  )
}