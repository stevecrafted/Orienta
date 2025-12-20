"use client"

import { Link } from "@/lib/navigation"
import "../Style/Acceuil.css" 

import Header from "@/components/BasicComponents/Header"
import { useTranslations } from 'next-intl'

export default function Accueil() {
    const t = useTranslations('home')
    const tf = useTranslations('footer')
    
    return (
        <div>
            <Header />
            
            {/* <!-- ========================= LINKEDIN STYLE HERO ========================= --> */}
            <section className="linkedin-hero">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1>{t('hero.title')}</h1>
                        <h2>{t('hero.subtitle')}</h2>
                        <p>{t('why.description')}</p>
                        
                        <div className="hero-buttons">
                            <Link href="/CreateCv" className="btn-primary">
                                {t('hero.createCV')}
                            </Link>
                            <Link href="/ListeCandidats" className="btn-secondary">
                                {t('nav.candidates')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* <!-- ========================= CORE FEATURES GRID ========================= --> */}
            <section className="core-features">
                <div className="features-container">
                    <h2>{t('features.title')}</h2>
                    <p>{t('why.description')}</p>
                    
                    <div className="features-grid">
                        <Link href="/CreateCv" className="feature-card">
                            <div className="feature-icon cv-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                    <polyline points="14 2 14 8 20 8"/>
                                    <line x1="16" y1="13" x2="8" y2="13"/>
                                    <line x1="16" y1="17" x2="8" y2="17"/>
                                    <polyline points="10 9 9 9 8 9"/>
                                </svg>
                            </div>
                            <h3>{t('features.createCV.title')}</h3>
                            <p>{t('features.createCV.description')}</p>
                            <div className="feature-stats">
                                <span>4 modèles disponibles</span>
                                <span>Sauvegarde automatique</span>
                            </div>
                        </Link>

                        <Link href="/JobResearch" className="feature-card">
                            <div className="feature-icon job-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8"/>
                                    <path d="m21 21-4.35-4.35"/>
                                </svg>
                            </div>
                            <h3>{t('features.searchJob.title')}</h3>
                            <p>{t('features.searchJob.description')}</p>
                            <div className="feature-stats">
                                <span>Filtres intelligents</span>
                                <span>Alertes personnalisées</span>
                            </div>
                        </Link>

                        <Link href="/FormationsPoste" className="feature-card">
                            <div className="feature-icon training-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                                    <line x1="12" y1="7" x2="12" y2="21"/>
                                </svg>
                            </div>
                            <h3>{t('features.searchTraining.title')}</h3>
                            <p>{t('features.searchTraining.description')}</p>
                            <div className="feature-stats">
                                <span>Certifications reconnues</span>
                                <span>Parcours personnalisés</span>
                            </div>
                        </Link>

                        <Link href="/ListeCandidats" className="feature-card">
                            <div className="feature-icon marketplace-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
                                    <line x1="9" y1="9" x2="9.01" y2="9"/>
                                    <line x1="15" y1="9" x2="15.01" y2="9"/>
                                </svg>
                            </div>
                            <h3>{t('recruiter.title')}</h3>
                            <p>{t('recruiter.description')}</p>
                            <div className="feature-stats">
                                <span>1000+ profils actifs</span>
                                <span>50+ domaines d'expertise</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* <!-- ========================= STATS SECTION ========================= --> */}
            <section className="stats-section">
                <div className="stats-container">
                        <div className="stat-item">
                        <div className="stat-number">1000+</div>
                        <div className="stat-label">{t('stats.candidates')}</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">50+</div>
                        <div className="stat-label">{t('stats.domains')}</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">95%</div>
                        <div className="stat-label">{t('stats.satisfaction')}</div>
                    </div>
                </div>
            </section>

            {/* <!-- ========================= CALL TO ACTION ========================= --> */}
            <section className="cta-section">
                <div className="cta-container">
                    <h2>{t('cta.title')}</h2>
                    <p>{t('cta.subtitle')}</p>
                    
                    <div className="cta-buttons">
                        <Link href="/CreateCv" className="btn-primary-large">
                            {t('cta.startFree')}
                        </Link>
                        <Link href="/Login" className="btn-outline-large">
                            {t('cta.login')}
                        </Link>
                    </div>
                </div>
            </section>

            {/* <!-- ========================= FOOTER ========================= --> */}
            <footer>
                    <p>
                    <a href="/about">{tf('about')}</a> |
                    <a href="/contact">{tf('contact')}</a> |
                    <a href="/privacy">{tf('privacy')}</a>
                </p>
            </footer>
        </div>
    )
}
