"use client"

import { useState } from 'react'
import Header from '@/components/BasicComponents/Header'
import { authService } from '@/lib/api/authService'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import '../Style/Auth.css'

export default function LoginPage() {
  const t = useTranslations('auth.login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const res = await authService.login({ email, password })
    setLoading(false)
    if (res.error || !res.data) {
      setError(res.error || t('invalidCredentials'))
      return
    }
    try {
      localStorage.setItem('accessToken', res.data.token)
      localStorage.setItem('currentUser', JSON.stringify(res.data.utilisateur))
    } catch {}
    // Return to previous page
    router.back()
  }

  return (
    <div>
      <Header />
      <main className="ma-auth-box" style={{ maxWidth: 900, margin: '40px auto' }}>
        <div className="ma-auth-content">
          <div className="ma-auth-brand">
            <div className="ma-auth-logo">
              <span className="ma-auth-logo-icon">🚀</span>
            </div>
            <p className="ma-auth-brand-name">Orienta</p>
          </div>
          
          <div className="ma-auth-content-main">
            <h1 className="ma-auth-title">
              Find Jobs and Training Faster
            </h1>
            
            <p className="ma-auth-subtitle">
              Import your CV, get AI-powered matches and recommended training to boost your career.
            </p>
            
            <ul className="ma-auth-features">
              <li className="ma-auth-feature-item">
                <div className="ma-auth-feature-check">✓</div>
                <span>Smart AI-powered matching</span>
              </li>
              <li className="ma-auth-feature-item">
                <div className="ma-auth-feature-check">✓</div>
                <span>Personalized training recommendations</span>
              </li>
              <li className="ma-auth-feature-item">
                <div className="ma-auth-feature-check">✓</div>
                <span>Track your applications</span>
              </li>
            </ul>
          </div>
          
          <div className="ma-auth-indicators">
            <div className="ma-auth-indicator ma-auth-indicator-active"></div>
            <div className="ma-auth-indicator ma-auth-indicator-inactive"></div>
            <div className="ma-auth-indicator ma-auth-indicator-inactive"></div>
          </div>
        </div>
        
        <div className="ma-auth-form-section">
          <div className="ma-auth-form-header">
            <h3>{t('title')}</h3>
            <p>Sign in to continue</p>
          </div>
          <form onSubmit={onSubmit} style={{width:'100%'}}>
            <div style={{marginBottom:12}}>
              <label style={{display:'block', marginBottom:6}}>{t('email')}</label>
              <div className="ma-auth-input-container">
                <input 
                  type="email" 
                  className="ma-auth-input"
                  value={email} 
                  onChange={(e)=>setEmail(e.target.value)} 
                  required 
                />
              </div>
            </div>
            <div style={{marginBottom:12}}>
              <label style={{display:'block', marginBottom:6}}>{t('password')}</label>
              <div className="ma-auth-input-container">
                <input 
                  type="password" 
                  className="ma-auth-input"
                  value={password} 
                  onChange={(e)=>setPassword(e.target.value)} 
                  required 
                />
              </div>
            </div>
            {error && <div style={{ color: 'var(--error,#e74c3c)', marginTop: 8 }}>{error}</div>}
            <div style={{marginTop:12}}>
              <button type="submit" className="ma-auth-submit-btn" disabled={loading}>
                {loading ? t('submitting') : t('submit')}
              </button>
            </div>
            <div style={{marginTop:12, width:'100%', textAlign:'center'}}>
              <button type="button" className="ma-page2-btn-open" onClick={()=>router.push('/Register')}>
                {t('createAccount')}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}