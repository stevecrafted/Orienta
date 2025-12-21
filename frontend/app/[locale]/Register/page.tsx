"use client"

import { useState } from 'react'
import Header from '@/components/BasicComponents/Header'
import { authService } from '@/lib/api/authService'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import '../Style/Auth.css'

export default function RegisterPage() {
  const t = useTranslations('auth.register')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [lastName, setLastName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const res = await authService.register({ 
      email, 
      password, 
      nom: lastName, 
      prenom: firstName, 
      telephone: phone 
    })
    setLoading(false)
    if (res.error || !res.data) {
      setError(res.error || 'Account creation error')
      return
    }
    try {
      localStorage.setItem('accessToken', res.data.token)
      localStorage.setItem('currentUser', JSON.stringify(res.data.utilisateur))
    } catch {}
    router.push('/')
  }

  return (
    <div>
      <Header />
      <main className="ma-auth-box" style={{ maxWidth: 900, margin: '40px auto', minHeight: 720 }}>
        <div className="ma-auth-content">
          <div className="ma-auth-brand">
            <div className="ma-auth-logo">
              <span className="ma-auth-logo-icon">🌟</span>
            </div>
            <p className="ma-auth-brand-name">Orienta</p>
          </div>
          
          <div className="ma-auth-content-main">
            <h1 className="ma-auth-title">
              Join Our Community
            </h1>
            
            <p className="ma-auth-subtitle">
              Create your account to manage your applications, track your training 
              and receive personalized recommendations.
            </p>
            
            <ul className="ma-auth-features">
              <li className="ma-auth-feature-item">
                <div className="ma-auth-feature-check">✓</div>
                <span>Complete profile management</span>
              </li>
              <li className="ma-auth-feature-item">
                <div className="ma-auth-feature-check">✓</div>
                <span>Personalized recommendations</span>
              </li>
              <li className="ma-auth-feature-item">
                <div className="ma-auth-feature-check">✓</div>
                <span>Access to all features</span>
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
            <p>Enter your information</p>
          </div>
          <form onSubmit={onSubmit} style={{width:'100%'}}>
            <div style={{marginBottom:18}}>
              <label style={{display:'block', marginBottom:6}}>{t('lastName')}</label>
              <div className="ma-auth-input-container">
                <input 
                  className="ma-auth-input"
                  value={lastName} 
                  onChange={e=>setLastName(e.target.value)} 
                  required 
                />
              </div>
            </div>
            <div style={{marginBottom:18}}>
              <label style={{display:'block', marginBottom:6}}>{t('firstName')}</label>
              <div className="ma-auth-input-container">
                <input 
                  className="ma-auth-input"
                  value={firstName} 
                  onChange={e=>setFirstName(e.target.value)} 
                  required 
                />
              </div>
            </div>
            <div style={{marginBottom:18}}>
              <label style={{display:'block', marginBottom:6}}>{t('email')}</label>
              <div className="ma-auth-input-container">
                <input 
                  type="email" 
                  className="ma-auth-input"
                  value={email} 
                  onChange={e=>setEmail(e.target.value)} 
                  required 
                />
              </div>
            </div>
            <div style={{marginBottom:18}}>
              <label style={{display:'block', marginBottom:6}}>Phone</label>
              <div className="ma-auth-input-container">
                <input 
                  className="ma-auth-input"
                  value={phone} 
                  onChange={e=>setPhone(e.target.value)} 
                />
              </div>
            </div>
            <div style={{marginBottom:18}}>
              <label style={{display:'block', marginBottom:6}}>{t('password')}</label>
              <div className="ma-auth-input-container">
                <input 
                  type="password" 
                  className="ma-auth-input"
                  value={password} 
                  onChange={e=>setPassword(e.target.value)} 
                  required 
                />
              </div>
            </div>
            {error && <div style={{ color: 'var(--error,#e74c3c)', marginTop: 8 }}>{error}</div>}
            <div style={{marginTop:24}}>
              <button type="submit" className="ma-auth-submit-btn" disabled={loading}>
                {loading ? t('submitting') : t('submit')}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}