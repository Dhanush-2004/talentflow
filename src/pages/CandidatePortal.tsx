import React, { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Search, 
  Eye, 
  Bookmark, 
  Heart, 
  MapPin, 
  Clock, 
  Building, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Calendar,
  FileText,
  User,
  Bell,
  Settings,
  Briefcase,
  Users,
  BarChart3,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import Button from '../components/Button'

const CandidatePortal: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    // Only redirect if we're done loading and the user is definitely not a candidate/employee
    if (user && user.role !== 'candidate') {
      navigate('/recruiter/dashboard')
    }
  }, [user, navigate])

  // Show loading spinner while authentication is being checked
  if (!user) {
    navigate('/login')
    return null
  }

  // If user is not a candidate/employee, redirect to appropriate dashboard
  if (user.role !== 'candidate') {
    navigate('/recruiter/dashboard')
    return null
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navLinks = [
    { to: '/employee', text: 'Dashboard', icon: <BarChart3 className="h-5 w-5" /> },
    { to: '/employee/jobs', text: 'Browse Jobs', icon: <Briefcase className="h-5 w-5" /> },
    { to: '/employee/applications', text: 'My Applications', icon: <FileText className="h-5 w-5" /> },
    { to: '/employee/assessments', text: 'Assessments', icon: <TrendingUp className="h-5 w-5" /> },
    { to: '/employee/profile', text: 'Profile', icon: <User className="h-5 w-5" /> },
  ]

  return (
    <div className="flex h-screen bg-orange-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white ">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
            </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <div>
                <h1 className="text-xl font-bold text-blue-600 ">TalentFlow</h1>
                <div className="text-xs text-gray-500 mt-1">Employee Portal</div>
              </div>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              <div className="text-xs text-gray-400 mb-2 px-3">Navigation</div>
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/employee'}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 p-3 rounded-lg transition-colors text-sm font-medium ${
                      isActive
                        ? 'bg-blue-50 text-blue-600  '
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900  :bg-gray-700 :text-white'
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  {link.icon}
                  <span>{link.text}</span>
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200  p-4">
            <div className="w-full">
              <Link to="/employee/profile" className="block mb-4">
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 :bg-gray-700 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">{user?.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 ">{user?.name}</p>
                    <p className="text-xs text-gray-500 ">Employee</p>
                  </div>
                </div>
              </Link>
              <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white  border-r border-gray-200 ">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-6">
                <div>
                  <h1 className="text-2xl font-bold text-blue-600 ">TalentFlow</h1>
                  <div className="text-xs text-gray-500 mt-1">Employee Portal</div>
                </div>
              </div>
              <nav className="mt-5 flex-1 px-4 bg-white  space-y-2">
                <div className="text-xs text-gray-400 mb-2 px-3">Navigation</div>
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/employee'}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 p-3 rounded-lg transition-colors text-sm font-medium ${
                        isActive
                          ? 'bg-blue-50 text-blue-600  '
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900  :bg-gray-700 :text-white'
                      }`
                    }
                  >
                    {link.icon}
                    <span>{link.text}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200  p-4">
              <Link to="/employee/profile" className="block mb-4 w-full">
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 :bg-gray-700 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">{user?.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 ">{user?.name}</p>
                    <p className="text-xs text-gray-500 ">Employee</p>
                  </div>
                </div>
              </Link>
              <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500  hover:text-gray-900 :text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <main className="flex-1 overflow-y-auto">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Child routes like the dashboard, jobs page, etc., will be rendered here */}
        <Outlet />
            </div>
          </div>
      </main>
      </div>
    </div>
  )
}

export default CandidatePortal
