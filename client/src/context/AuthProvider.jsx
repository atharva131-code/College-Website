import { useState, useContext } from 'react'
import { AuthContext, getSavedAuth } from './AuthContext.js'

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getSavedAuth)

  const login = (userData, userToken) => {
    localStorage.setItem('token', userToken)
    localStorage.setItem('user', JSON.stringify(userData))
    setAuth({ user: userData, token: userToken })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setAuth({ user: null, token: null })
  }

  return (
    <AuthContext.Provider
      value={{
        user: auth.user,
        token: auth.token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}