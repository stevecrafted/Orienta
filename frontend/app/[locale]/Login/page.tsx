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
    // Retour à la page précédente
    router.back()
  }

  return (
    <div>
      <Header />
      <main className="ma-main-container" style={{ maxWidth: 480, margin: '0 auto' }}>
        <h1>{t('title')}</h1>
        <form onSubmit={onSubmit}>
          <div className="field">
            <label>{t('email')}</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label>{t('password')}</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          </div>
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <button type="submit" className="ma-page2-btn-register" disabled={loading}>
              {loading ? t('submitting') : t('submit')}
            </button>
            <button type="button" className="ma-page2-btn-open" onClick={()=>router.push('/Register')}>{t('createAccount')}</button>
          </div>
        </form>
      </main>
    </div>
  )
}
