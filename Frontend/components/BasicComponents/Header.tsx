"use client"

import React, { useEffect, useState } from "react"
import "../../app/[locale]/Style/Header.scoped.css"
import { Link } from "@/lib/navigation"
import { usePathname } from "next/navigation"
import LanguageSwitcher from "./LanguageSwitcher"
import { useLocale, useTranslations } from "next-intl"

export default function Header() {
    const pathname = usePathname()
    const locale = useLocale()
    const t = useTranslations('nav')
    const tCommon = useTranslations('common')
    const tCandidates = useTranslations('candidates')
    const [auth, setAuth] = useState<{ token: string | null; user: any | null }>({ token: null, user: null })
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const [showMobileMenu, setShowMobileMenu] = useState(false) 

    useEffect(() => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
            const userRaw = typeof window !== 'undefined' ? localStorage.getItem('user') : null
            setAuth({ token, user: userRaw ? JSON.parse(userRaw) : null })
        } catch { }
    }, [pathname])

    const logout = () => {
        try {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('currentUser')
        } catch { }
        setAuth({ token: null, user: null })
        setShowProfileMenu(false)
        window.location.href = `/${locale}`
    }

    // handleSearch supprimé (aucun filtre / page ListePostes retirée)

    const isActivePath = (path: string) => pathname === path

    // Afficher la navigation sur toutes les pages sauf la page d'accueil
    const shouldShowNav = pathname !== "/en" && pathname !== "/fr" && pathname !== "/mg"

    return (
        <div>
            <header className="mitady-asa-header">
                <div className="mitady-asa-logo">
                    <Link href="/">
                        <span className="logo-text">Orienta</span>
                    </Link>
                </div>

                {/* Barre de recherche retirée (aucun filtre) */}

                {/* Actions du header */}
                <div className="mitady-asa-actions">
                    {/* Sélecteur de langue */}
                    <LanguageSwitcher />

                    {/* Menu profil utilisateur */}
                    {auth.token ? (
                        <div className="profile-dropdown-container">
                            <button
                                className="mitady-asa-icon-button profile-button"
                                aria-label="Profile"
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                            >
                                <svg className="mitady-asa-user-icon" viewBox="0 0 24 24">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </button>

                            {showProfileMenu && (
                                <div className="profile-dropdown">
                                    <div className="profile-header">
                                        <p className="profile-name">{auth.user?.prenom || 'Utilisateur'}</p>
                                        <p className="profile-email">{auth.user?.email}</p>
                                    </div>
                                    <div className="profile-menu">
                                        <Link href="/ListeCandidats" onClick={() => setShowProfileMenu(false)}>
                                            <div className="profile-menu-item">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                                    <circle cx="9" cy="7" r="4"></circle>
                                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                                </svg>
                                                {tCandidates('marketplace')}
                                            </div>
                                        </Link>
                                        {/* <Link href="/MesCandidatsSauvegardes" onClick={() => setShowProfileMenu(false)}>
                                            <div className="profile-menu-item">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                                </svg>
                                                {tCandidates('savedCandidates')}
                                            </div>
                                        </Link>
                                        <Link href="/PostesImportants" onClick={() => setShowProfileMenu(false)}>
                                            <div className="profile-menu-item">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                                </svg>
                                                {t('savedJobs')}
                                            </div>
                                        </Link> */}
                                        <Link href="/CreateCv" onClick={() => setShowProfileMenu(false)}>
                                            <div className="profile-menu-item">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                    <polyline points="14 2 14 8 20 8"></polyline>
                                                </svg>
                                                {tCandidates('myCV')}
                                            </div>
                                        </Link>
                                        <div className="profile-menu-divider"></div>
                                        <button className="profile-menu-item logout-item" onClick={logout}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                                <polyline points="16 17 21 12 16 7"></polyline>
                                                <line x1="21" y1="12" x2="9" y2="12"></line>
                                            </svg>
                                            {tCommon('logout')}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link href="/Login">
                                <button className="btn-secondary">{tCommon('login')}</button>
                            </Link>
                            <Link href="/Register">
                                <button className="btn-primary">{tCommon('register')}</button>
                            </Link>
                        </div>
                    )}

                    {/* Menu hamburger mobile */}
                    <button
                        className="mobile-menu-button"
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        aria-label="Menu"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2}>
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </header>

            {/* Navigation principale */}
            {shouldShowNav && (
                <nav className={`main-navigation ${showMobileMenu ? 'mobile-open' : ''}`}>
                    <div className="nav-links">
                        <Link href="/CreateCv">
                            <button className={`nav-link ${pathname.includes('/CreateCv') ? 'active' : ''}`}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="12" y1="18" x2="12" y2="12"></line>
                                    <line x1="9" y1="15" x2="15" y2="15"></line>
                                </svg>
                                {t('createCV')}
                            </button>
                        </Link>


                        <Link href="/JobResearch">
                            <button className={`nav-link ${pathname.includes('/JobResearch') ? 'active' : ''}`}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.35-4.35"></path>
                                </svg>
                                {t('jobSearch')}
                            </button>
                        </Link>

                        <Link href="/AnalyseCv">
                            <button className={`nav-link ${pathname.includes('/AnalyseCv') ? 'active' : ''}`}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                                </svg>
                                {t('training')}
                            </button>
                        </Link>

                        <Link href="/ListeCandidats">
                            <button className={`nav-link ${pathname.includes('/ListeCandidats') ? 'active' : ''} nav-link-featured`}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                                🌟 {t('candidates')}
                            </button>
                        </Link>

                        {/* {auth.token && (
                            <Link href="/PostesImportants">
                                <button className={`nav-link ${pathname.includes('/PostesImportants') ? 'active' : ''}`}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                    {t('savedJobs')}
                                </button>
                            </Link>
                        )} */}
                    </div>
                </nav>
            )}
        </div>
    )
}
