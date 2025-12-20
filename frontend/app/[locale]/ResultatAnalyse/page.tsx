"use client"

import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import Header from '@/components/BasicComponents/Header'
import { CvAnalysisResponse } from '@/lib/api'
import { Link } from '@/lib/navigation'

export default function Page() {
    const tRes = useTranslations('results')
    const tAnalysis = useTranslations('analysis')
    const [result, setResult] = useState<CvAnalysisResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Get analysis result from session storage
        const savedResult = sessionStorage.getItem('cvAnalysisResult')
        if (savedResult) {
            setResult(JSON.parse(savedResult))
        } else {
            // No result found, redirect to analysis page
            router.push('/AnalyseCv')
        }
        setLoading(false)
    }, [router])

    if (loading) {
        return (
            <div>
                <Header />
                <div style={{ padding: '40px', textAlign: 'center' }}>
                    {tRes('loadingResults')}
                </div>
            </div>
        )
    }

    if (!result) {
        return null
    }

    return (
        <div>
            <Header />
            
            <div className="ma-page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
                {/* Match Score Section */}
                <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '12px',
                    padding: '30px',
                    color: 'white',
                    marginBottom: '30px',
                    textAlign: 'center'
                }}>
                    <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>{tAnalysis('resultTitle')}</h1>
                    <div style={{ fontSize: '48px', fontWeight: 'bold', margin: '20px 0' }}>
                        {result.matchPercentage}%
                    </div>
                    <p style={{ fontSize: '18px', opacity: 0.9 }}>{result.overallFeedback}</p>
                </div>

                <div className="ma-page-main-content" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    {/* Left Panel: Job Details */}
                    <div className="ma-page-left-panel" style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '30px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        <div className="ma-page-job-header" style={{ marginBottom: '30px' }}>
                            <h2 style={{ fontSize: '24px', marginBottom: '10px', color: '#1f2937' }}>
                                {tAnalysis('jobDetails')}
                            </h2>
                        </div>
                               
                        <div className="ma-page-job-description">
                            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px', color: '#374151' }}>
                                {tAnalysis('description')}
                            </h3>
                            <p style={{ lineHeight: '1.6', color: '#6b7280', marginBottom: '25px' }}>
                                {result.jobDescription}
                            </p>
                                
                            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px', color: '#374151' }}>
                                {tAnalysis('matchingSkills', { count: result.matchingSkills.length })}
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '25px' }}>
                                {result.matchingSkills.map((skill, index) => (
                                    <span key={index} style={{
                                        background: '#d1fae5',
                                        color: '#065f46',
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        fontSize: '14px'
                                    }}>
                                        ✓ {skill}
                                    </span>
                                ))}
                            </div>

                            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px', color: '#374151' }}>
                                {tAnalysis('improvementsTitle')}
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {Object.entries(result.improvements).map(([key, value], index) => (
                                    <li key={index} style={{
                                        background: '#f3f4f6',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        marginBottom: '10px'
                                    }}>
                                        <strong style={{ color: '#1f2937' }}>{key}:</strong>
                                        <span style={{ color: '#6b7280', marginLeft: '8px' }}>{value}</span>
                                    </li>
                                ))}
                            </ul>

                                    <Link href="/CreateCv">
                                <button style={{
                                    width: '100%',
                                    background: '#2d63ff',
                                    color: 'white',
                                    padding: '14px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    marginTop: '20px'
                                }}>
                                    {tAnalysis('editCvButton')}
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Panel: Missing Skills & Formations */}
                    <div className="ma-page-right-panel">
                        <div style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '30px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            marginBottom: '20px'
                        }}>
                            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#1f2937' }}>
                                {tAnalysis('missingSkillsTitle', { count: result.missingSkills.length })}
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {result.missingSkills.map((skill, index) => (
                                    <li key={index} style={{
                                        padding: '12px',
                                        borderBottom: '1px solid #e5e7eb',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        <span style={{
                                            width: '8px',
                                            height: '8px',
                                            background: '#ef4444',
                                            borderRadius: '50%'
                                        }}></span>
                                        <span style={{ color: '#374151' }}>{skill}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '30px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            textAlign: 'center'
                        }}>
                            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#1f2937' }}>
                                {tAnalysis('boostTitle')}
                            </h3>
                            
                            <p style={{ color: '#6b7280', marginBottom: '24px', lineHeight: '1.6' }}>
                                {tAnalysis('boostDesc')}
                            </p>

                            <Link href="/FormationsPoste?from=analyse">
                                <button style={{
                                    background: '#10b981',
                                    color: 'white',
                                    padding: '14px 24px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    width: '100%',
                                    transition: 'background 0.3s ease'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#059669'}
                                onMouseOut={(e) => e.currentTarget.style.background = '#10b981'}>
                                    {tAnalysis('boostButton')}
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
