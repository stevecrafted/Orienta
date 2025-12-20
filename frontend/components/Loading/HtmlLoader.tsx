"use client"

import React, { useEffect, useState } from "react"

export default function HtmlLoader({ fullscreen = true }: { fullscreen?: boolean }) {
  const [html, setHtml] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/loading/loading.html')
      .then((r) => r.text())
      .then((t) => {
        if (!cancelled) setHtml(t)
      })
      .catch(() => setHtml(null))

    return () => { cancelled = true }
  }, [])

  if (!html) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-400 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div
      className={fullscreen ? "fixed inset-0 z-50 flex items-center justify-center bg-white/75" : ""}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
