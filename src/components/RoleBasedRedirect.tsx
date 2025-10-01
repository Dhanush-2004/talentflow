import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from './LoadingSpinner'

interface RoleBasedRedirectProps {
  children?: React.ReactNode
}

const RoleBasedRedirect: React.FC<RoleBasedRedirectProps> = ({ children }) => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) {
      switch (user.role) {
        case 'recruiter':
          navigate('/recruiter/dashboard')
          break
        case 'candidate':
          navigate('/employee/dashboard')
          break
        case 'admin':
          navigate('/admin')
          break
        default:
          // Instead of defaulting to employee dashboard, redirect to login
          console.warn('Unknown user role:', user.role)
          navigate('/login')
          break
      }
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return <>{children}</>
}

export default RoleBasedRedirect