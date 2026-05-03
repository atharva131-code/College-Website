import { createContext } from 'react'

export const AuthContext = createContext(null)

export const getSavedAuth = () => {
  try {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    if (token && user) {
      return { user: JSON.parse(user), token }
    }
  } catch {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
  return { user: null, token: null }
}