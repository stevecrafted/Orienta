"use client"

import { Provider } from "react-redux"
import { store } from "@/lib/store"
import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import Header from "@/components/BasicComponents/Header"
import ViewCvComponent from "@/components/CreateCV/ViewCvComponent"

function ViewCvContent() {
  const searchParams = useSearchParams()
  const [cvId, setCvId] = useState<number | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Récupérer l'ID du CV depuis les paramètres URL
    const cvIdParam = searchParams.get('id')
    if (cvIdParam) {
      setCvId(parseInt(cvIdParam, 10))
      setLoading(false)
    } else {
      console.error('Aucun ID de CV fourni')
      setLoading(false)
    }
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!cvId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Erreur</h2>
          <p className="text-gray-600">Aucun ID de CV fourni</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafbfd]">
      <Header />

      <main className="container mx-auto py-6 px-4">
        <ViewCvComponent cvId={cvId} />
      </main>
    </div>
  )
}

export default function ViewCvPage() {
  return (
    <Provider store={store}>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      }>
        <ViewCvContent />
      </Suspense>
    </Provider>
  )
}
