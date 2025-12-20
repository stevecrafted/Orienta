"use client"

import { Link } from "@/lib/navigation"
import "./Style/Acceuil.css" 
import { useTranslations } from 'next-intl'

import Header from "@/components/BasicComponents/Header"

export default function Accueil() {
    const t = useTranslations('home')
    
    return (
        <div>
            <Header></Header>
            
            {/* <!-- ========================= SECTION 1 — HERO ========================= --> */}
            < section className="hero" >
                <h1>{t('hero.title')}</h1>
                <p>{t('hero.subtitle')}</p>

                <div className="hero-buttons"> 
                    <Link href="/CreateCv" className="btn btn-blue">{t('hero.createCV')}</Link>
                    <Link href="/JobResearch"  className="btn btn-blue">{t('hero.searchJob')}</Link>
                    <Link href="/AnalyseCv"  className="btn btn-blue">{t('hero.searchTraining')}</Link>
                </div>
            </section >
            
            {/* <!-- ========================= SECTION 2 — FEATURES (ESSENTIALS) ========================= --> */}
            <section className="features">
                <h2>{t('features.title')}</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🧩</div>
                        <h3>{t('features.createCV.title')}</h3>
                        <p>{t('features.createCV.description')}</p>
                        <Link href="/CreateCv" className="feature-link">{t('features.createCV.link')}</Link>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🧠</div>
                        <h3>{t('features.searchTraining.title')}</h3>
                        <p>{t('features.searchTraining.description')}</p>
                        <Link href="/AnalyseCv" className="feature-link">{t('features.searchTraining.link')}</Link>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔎</div>
                        <h3>{t('features.searchJob.title')}</h3>
                        <p>{t('features.searchJob.description')}</p>
                        <Link href="/JobResearch" className="feature-link">{t('features.searchJob.link')}</Link>
                    </div>
                </div>
            </section>

            {/* <!-- ========================= SECTION RECRUTEUR ========================= --> */}
            <section className="recruiter-section">
                <div className="recruiter-header">
                    <span className="recruiter-badge">🎯 {t('recruiter.badge')}</span>
                    <h2>{t('recruiter.title')}</h2>
                    <p>{t('recruiter.description')}</p>
                </div>

                <div className="recruiter-features">
                    <div className="recruiter-feature">
                        <div className="recruiter-icon">🔍</div>
                        <h3>{t('recruiter.feature1.title')}</h3>
                        <p>{t('recruiter.feature1.description')}</p>
                    </div>
                    <div className="recruiter-feature">
                        <div className="recruiter-icon">🤖</div>
                        <h3>{t('recruiter.feature2.title')}</h3>
                        <p>{t('recruiter.feature2.description')}</p>
                    </div>
                    <div className="recruiter-feature">
                        <div className="recruiter-icon">📊</div>
                        <h3>{t('recruiter.feature3.title')}</h3>
                        <p>{t('recruiter.feature3.description')}</p>
                    </div>
                </div>

                <div className="recruiter-cta">
                    <Link href="/ListeCandidats" className="btn btn-purple recruiter-primary-btn">{t('recruiter.cta')}</Link> 
                </div>
            </section>

            {/* <!-- ========================= SECTION 3 — HOW IT WORKS ========================= --> */}
            < section className="how-it-works" >
                <h2>{t('howItWorks.title')}</h2>

                <div className="steps">

                    <div className="step">
                        <div className="step-number">1</div>
                        <p>{t('howItWorks.step1')}</p>
                    </div>

                    <div className="step">
                        <div className="step-number">2</div>
                        <p>{t('howItWorks.step2')}</p>
                    </div>

                    <div className="step">
                        <div className="step-number">3</div>
                        <p>{t('howItWorks.step3')}</p>
                    </div>

                </div>
            </section >
 
            < section className="why-section" >
                <h2>{t('why.title')}</h2> 
                
                <p>{t('why.description')}</p>
            </section >

            {/* <!-- ========================= SECTION 6 — FOOTER ========================= --> */}
            < footer >
                <p>
                    <a href="/about">{t('cta.login')}</a> |
                    <a href="/contact">Contact</a> |
                    <a href="/privacy">{t('cta.login')}</a>
                </p>
            </footer >
        </div>
    )
}