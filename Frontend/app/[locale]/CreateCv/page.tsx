"use client"

import { Provider } from "react-redux"
import { store } from "@/lib/store"
import ResumeBuilder from "@/components/CreateCV/resume-builder" 
import AddSectionModal from "@/components/CreateCV/Common/Dialogs/add-section-modal"
import TemplatesModal from "@/components/CreateCV/Common/Dialogs/templates-modal"
import Header from "@/components/BasicComponents/Header"
import LoadCvHandler from "@/components/CreateCV/LoadCvHandler"
import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

function CreateCvContent() {
  const searchParams = useSearchParams()
  const [userId, setUserId] = useState<number | undefined>()
  const [cvId, setCvId] = useState<number | undefined>()

  useEffect(() => {
    // Récupérer l'ID utilisateur depuis localStorage ou le contexte d'authentification
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setUserId(user.id)
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error)
      }
    }

    // Récupérer l'ID du CV depuis les paramètres URL si édition
    const cvIdParam = searchParams.get('cvId')
    if (cvIdParam) {
      setCvId(parseInt(cvIdParam, 10))
    }
  }, [searchParams])

  return (
    <LoadCvHandler cvId={cvId}>
      <div className="min-h-screen bg-[#fafbfd]">
        <Header />

        <main className="container mx-auto py-6 px-4">
          <ResumeBuilder 
            utilisateurId={userId}
            cvId={cvId}
            autoSaveEnabled={true}
          />
        </main>

        <AddSectionModal />
        <TemplatesModal />
      </div>
    </LoadCvHandler>
  )
}

export default function CreateCvPage() {
  return (
    <Provider store={store}>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      }>
        <CreateCvContent />
      </Suspense>
    </Provider>
  )
}
