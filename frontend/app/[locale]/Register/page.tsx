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
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const res = await authService.register({ email, password, nom, prenom, telephone })
    setLoading(false)
    if (res.error || !res.data) {
      setError(res.error || 'Erreur de création de compte')
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
      <main className="ma-main-container" style={{ maxWidth: 520, margin: '0 auto' }}>
        <h1>{t('title')}</h1>
        <form onSubmit={onSubmit}>
          <div className="field"><label>{t('name')}</label><input value={nom} onChange={e=>setNom(e.target.value)} required /></div>
          <div className="field"><label>{t('name')}</label><input value={prenom} onChange={e=>setPrenom(e.target.value)} required /></div>
          <div className="field"><label>{t('email')}</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
          <div className="field"><label>Téléphone</label><input value={telephone} onChange={e=>setTelephone(e.target.value)} /></div>
          <div className="field"><label>{t('password')}</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></div>
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
          <div style={{ marginTop: 16 }}>
            <button type="submit" className="ma-page2-btn-register" disabled={loading}>
              {loading ? t('submitting') : t('submit')}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
