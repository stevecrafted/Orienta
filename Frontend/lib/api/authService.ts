import { apiClient } from './apiClient'

export interface AuthUser {
  id: number
  email: string
  nom?: string
  prenom?: string
}

export interface AuthResponse {
  token: string
  utilisateur: AuthUser
}

export const authService = {
  register: (payload: { nom: string; prenom: string; email: string; password: string; telephone?: string }) =>
    apiClient.post<AuthResponse>('/auth/register', payload),
  login: (payload: { email: string; password: string }) =>
    apiClient.post<AuthResponse>('/auth/login', payload),
}
