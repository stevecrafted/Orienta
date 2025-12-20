"use client"

import React from "react"
import { useTranslations } from 'next-intl'

interface SectionMixedProps {
  jobDescription: string
  setJobDescription: (value: string) => void
}

export default function SectionMixed({ jobDescription, setJobDescription }: SectionMixedProps) {
  const t = useTranslations('analysis')

  return (
    <section id="section-mixed" className="section active" aria-labelledby="mixed-section-title">

      <div className="field">
        <label htmlFor="description">{t('jobDescription')}</label>
        <textarea
          id="description"
          name="description"
          placeholder={t('jobDescriptionPlaceholder')}
          rows={8}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          required
        />
        <div className="small-muted">{t('jobDescriptionHelp')}</div>
      </div>
    </section>
  )
}
