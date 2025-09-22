import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = Cookies.get('token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // Verify token and get user info
      verifyToken()
    } else {
      setLoading(false)
    }
  }, [])

  const verifyToken = async () => {
    try {
      const response = await api.get('/api/admin/profile')
      setUser(response.data)
    } catch (error) {
      console.error('Token verification failed:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password, role = 'STUDENT') => {
    try {
      const endpoint = role === 'ADMIN' ? '/api/auth/login' : '/api/auth/login'
      const response = await api.post(endpoint, { email, password })
      
      const { token, user: userData } = response.data
      
      // Store token in cookie
      Cookies.set('token', token, { expires: 7 }) // 7 days
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      setUser(userData)
      
      // Navigate based on role
      if (userData.role === 'ADMIN') {
        navigate('/admin')
      } else {
        navigate('/student')
      }
      
      return { success: true }
    } catch (error) {
      console.error('Login failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      }
    }
  }

  const register = async (name, email, password, role = 'STUDENT') => {
    try {
      const endpoint = role === 'ADMIN' ? '/api/auth/admin/register' : '/api/auth/register'
      const response = await api.post(endpoint, { name, email, password })
      
      const { token, user: userData } = response.data
      
      // Store token in cookie
      Cookies.set('token', token, { expires: 7 }) // 7 days
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      setUser(userData)
      
      // Navigate based on role
      if (userData.role === 'ADMIN') {
        navigate('/admin')
      } else {
        navigate('/student')
      }
      
      return { success: true }
    } catch (error) {
      console.error('Registration failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      }
    }
  }

  const logout = () => {
    Cookies.remove('token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    navigate('/')
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isStudent: user?.role === 'STUDENT'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
