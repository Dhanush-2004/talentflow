import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/Toast'
import { apiService } from '../services/api'
import { 
  Briefcase, 
  Users, 
  FileText, 
  Calendar, 
  Bell, 
  Settings, 
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Search,
  Filter,
  Plus,
  Clock,
  CheckCircle,
  Play,
  User,
  ChevronDown
} from 'lucide-react'
import Button from '../components/Button'

const AssessmentsPage: React.FC = () => {
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [assessments, setAssessments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Load assessments from localStorage
  useEffect(() => {
    const loadAssessments = async () => {
      setLoading(true)
      
      try {
        // Load assessments created by the current recruiter
        const assessmentsResponse = await apiService.getAssessments(user?.id)
        const recruiterAssessments = assessmentsResponse.data
        
        // Load applications to count completions
        const applicationsResponse = await apiService.getApplications()
        const applications = applicationsResponse.data
        
        const assessmentsWithStats = recruiterAssessments.map((assessment: any) => ({
          ...assessment,
          completedBy: applications.filter((app: any) => 
            app.jobId === assessment.jobId && app.assessmentCompleted
          ).length,
          status: assessment.status,
          isActive: assessment.status === 'active'
        }))
        
        setAssessments(assessmentsWithStats)
      } catch (error) {
        console.error('Error loading assessments:', error)
        setAssessments([])
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) {
      loadAssessments()
    }
  }, [user?.id])

  const refreshAssessments = async () => {
    setLoading(true)
    
    try {
      const assessmentsResponse = await apiService.getAssessments(user?.id)
      const recruiterAssessments = assessmentsResponse.data
      
      const applicationsResponse = await apiService.getApplications()
      const applications = applicationsResponse.data
      
      const assessmentsWithStats = recruiterAssessments.map((assessment: any) => ({
        ...assessment,
        completedBy: applications.filter((app: any) => 
          app.jobId === assessment.jobId && app.assessmentCompleted
        ).length,
        status: assessment.status,
        isActive: assessment.status === 'active'
      }))
      
      setAssessments(assessmentsWithStats)
      showToast('success', 'Refreshed', 'Assessment list has been updated')
    } catch (error) {
      console.error('Error loading assessments:', error)
      setAssessments([])
      showToast('error', 'Refresh Failed', 'Failed to refresh assessment list')
    } finally {
      setLoading(false)
    }
  }

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || assessment.type === filterType
    
    return matchesSearch && matchesType
  })

  // Handler functions for View and Results buttons
  const handleViewAssessment = (assessment: any) => {
    // Navigate to assessment detail page
    navigate(`/recruiter/assessments/${assessment.id}`)
  }

  const handleViewResults = (assessment: any) => {
    // Navigate to assessment results page
    navigate(`/recruiter/assessments/${assessment.id}/results`)
  }


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'technical':
        return 'bg-blue-100 text-blue-800'
      case 'cognitive':
        return 'bg-purple-100 text-purple-800'
      case 'behavioral':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assessments</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create and manage skill assessments for your candidates
          </p>
          
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search assessments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="technical">Technical</option>
              <option value="cognitive">Cognitive</option>
              <option value="behavioral">Behavioral</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Assessments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{assessments.length}</p>
            </div>
            <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">TA</span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {assessments.filter(a => a.status === 'active').length}
              </p>
            </div>
            <div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <span className="text-green-600 dark:text-green-400 text-sm font-medium">AC</span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Drafts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {assessments.filter(a => a.status === 'draft').length}
              </p>
            </div>
            <div className="h-8 w-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">DR</span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Completions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {assessments.reduce((sum, a) => sum + a.completedBy, 0)}
              </p>
            </div>
            <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 dark:text-purple-400 text-sm font-medium">TC</span>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="technical">Technical</option>
                <option value="cognitive">Cognitive</option>
                <option value="behavioral">Behavioral</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={refreshAssessments} disabled={loading}>
              <Clock className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Link to="/recruiter/assessments/create">
              <Button className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Create Assessment
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Assessment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssessments.map((assessment) => (
          <div key={assessment.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {assessment.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {assessment.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(assessment.status)}`}>
                    {assessment.status}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(assessment.type)}`}>
                    {assessment.type}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Questions:</span>
                <span className="text-gray-900 dark:text-white">{assessment.questions?.length || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                <span className="text-gray-900 dark:text-white">{assessment.duration} min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Completions:</span>
                <span className="text-gray-900 dark:text-white">{assessment.completedBy}</span>
              </div>
            </div>
            
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-700">Passing: {assessment.passingScore}%</span>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => handleViewAssessment(assessment)}
              >
                <FileText className="h-4 w-4 mr-2" />
                View
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => handleViewResults(assessment)}
              >
                <Users className="h-4 w-4 mr-2" />
                Results
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredAssessments.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <FileText className="h-12 w-12" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No assessments found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first assessment.'
            }
          </p>
          {!searchTerm && filterType === 'all' && (
            <div className="mt-6">
              <Link to="/recruiter/assessments/create">
                <Button className="inline-flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assessment
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AssessmentsPage