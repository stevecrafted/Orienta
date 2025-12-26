"use client"

import Link from "next/link"
import "../Style/AnalyseCv.scoped.css"
import AnalyseForm from "@/components/AnalyseCV/AnalyseForm"
import Header from "@/components/BasicComponents/Header"
import { useTranslations } from 'next-intl'

export default function AnalyseCv() {
    const t = useTranslations('analysis')
    
    return (
        <div className="analyse-page">
            <Header></Header>
            
            <div className="container">

                <main className="card" role="main" aria-labelledby="page-title">
                    <h1 id="page-title">{t('title')}</h1>

                    <AnalyseForm />

                </main>
            </div>
        </div>
    )
}
