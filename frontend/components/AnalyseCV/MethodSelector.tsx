"use client"

import React from "react"
import { useTranslations } from 'next-intl'

type Props = {
  selected: "url" | "mixed"
  onChange: (s: "url" | "mixed") => void
}

export default function MethodSelector({ selected, onChange }: Props) {
  const t = useTranslations('analysis')

  return (
    <div className="field">
      <label id="choose-method-label">{t('chooseMethod')}</label>
      <div className="method-cards" role="tablist" aria-labelledby="choose-method-label">
        <div
          className={`method-card ${selected === "mixed" ? "active" : ""}`}
          id="card-mixed"
          tabIndex={0}
          role="tab"
          aria-selected={selected === "mixed"}
          aria-controls="section-mixed"
          onClick={() => onChange("mixed")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onChange("mixed")
          }}
        >
          <div className="method-title">{t('methodMixedTitle')}</div>
          <div className="small-muted">{t('methodMixedDesc')}</div>
        </div>
      </div>
    </div>
  )
}
