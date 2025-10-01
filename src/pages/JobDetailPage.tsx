import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  MapPin,
  Clock,
  DollarSign,
  ArrowLeft,
  Share,
  Bookmark,
  Users,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'
import Button from '../components/Button'

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadJob = () => {
      setLoading(true)
      
      setTimeout(() => {
        try {
          // Load jobs from localStorage
          const allJobs = JSON.parse(localStorage.getItem('mockJobs') || '[]')
          const foundJob = allJobs.find((j: any) => j.id === id)
          
          if (foundJob) {
            setJob(foundJob)
          } else {
            // Fallback to mock data if not found
            setJob({
              id: id || '1',
              title: 'Senior Frontend Developer',
              company: 'TechCorp',
              location: 'San Francisco, CA',
              type: 'Full-time',
              salary: { min: 120000, max: 150000, currency: 'USD', period: 'year' },
              status: 'active',
              postedAt: '2024-01-15',
              applicationsCount: 24,
              tags: ['React', 'TypeScript', 'Frontend'],
              description: `We are looking for a senior frontend developer to join our team. You will be responsible for building and maintaining our web applications using modern technologies.

## Responsibilities:
- Develop and maintain web applications using React and TypeScript
- Collaborate with design and backend teams
- Write clean, maintainable code
- Participate in code reviews
- Mentor junior developers

## Requirements:
- 5+ years of experience in frontend development
- Strong knowledge of React, TypeScript, and modern JavaScript
- Experience with state management libraries (Redux, Zustand)
- Knowledge of testing frameworks (Jest, React Testing Library)
- Experience with build tools (Webpack, Vite)
- Strong communication skills

## Nice to have:
- Experience with Next.js or other React frameworks
- Knowledge of GraphQL
- Experience with micro-frontends
- Knowledge of accessibility best practices`,
              requirements: [
                '5+ years of experience in frontend development',
                'Strong knowledge of React, TypeScript, and modern JavaScript',
                'Experience with state management libraries (Redux, Zustand)',
                'Knowledge of testing frameworks (Jest, React Testing Library)',
                'Experience with build tools (Webpack, Vite)',
                'Strong communication skills'
              ],
              benefits: [
                'Competitive salary and equity',
                'Health, dental, and vision insurance',
                '401(k) with company matching',
                'Flexible work arrangements',
                'Professional development budget',
                'Team building events'
              ]
            })
          }
        } catch (error) {
          console.error('Error loading job:', error)
        } finally {
          setLoading(false)
        }
      }, 800)
    }

    if (id) {
      loadJob()
    }
  }, [id])

  const formatSalary = (salary: { min: number; max: number; currency: string; period?: string }) => {
    return `$${salary.min.toLocaleString()}-${salary.max.toLocaleString()}/${salary.period || 'year'}`
  }

  const handleDeleteJob = () => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        const allJobs = JSON.parse(localStorage.getItem('mockJobs') || '[]')
        const updatedJobs = allJobs.filter((j: any) => j.id !== id)
        localStorage.setItem('mockJobs', JSON.stringify(updatedJobs))
        
        alert('Job deleted successfully!')
        // Navigate back to jobs page
        window.location.href = '/recruiter/jobs'
      } catch (error) {
        console.error('Error deleting job:', error)
        alert('Failed to delete job')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Job not found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          The job you're looking for doesn't exist or has been removed.
        </p>
        <div className="mt-6">
          <Link to="/recruiter/jobs">
            <Button>Back to Jobs</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link 
            to="/recruiter/jobs" 
            className="inline-flex items-center text-blue-600 hover:text-blue-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Link>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Bookmark className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Job Details Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Job Header */}
        <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {job.title}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                {job.company}
              </p>
              
              {/* Job Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <DollarSign className="h-5 w-5 mr-2" />
                  <span>{formatSalary(job.salary)}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Users className="h-5 w-5 mr-2" />
                  <span>{job.applicationsCount || 0} applications</span>
                </div>
              </div>

              {/* Tags */}
              {job.tags && job.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag: string, index: number) => (
                    <span 
                      key={index}
                      className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2 ml-4">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600 hover:text-red-700"
                onClick={handleDeleteJob}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Job Content */}
        <div className="px-6 py-6">
          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Job Description
            </h2>
            <div className="prose max-w-none text-gray-600 dark:text-gray-400">
              {job.description.split('\n').map((line: string, index: number) => {
                if (line.startsWith('## ')) {
                  return (
                    <h3 key={index} className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                      {line.replace('## ', '')}
                    </h3>
                  )
                } else if (line.startsWith('- ')) {
                  return (
                    <li key={index} className="mb-1">
                      {line.replace('- ', '')}
                    </li>
                  )
                } else if (line.trim() === '') {
                  return <br key={index} />
                } else {
                  return (
                    <p key={index} className="mb-3">
                      {line}
                    </p>
                  )
                }
              })}
            </div>
          </div>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Requirements
              </h2>
              <ul className="space-y-2">
                {job.requirements.map((req: string, index: number) => (
                  <li key={index} className="flex items-start text-gray-600 dark:text-gray-400">
                    <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Benefits
              </h2>
              <ul className="space-y-2">
                {job.benefits.map((benefit: string, index: number) => (
                  <li key={index} className="flex items-start text-gray-600 dark:text-gray-400">
                    <span className="flex-shrink-0 w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Job Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Applications
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {job.applicationsCount || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Eye className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Views
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {(job.applicationsCount || 0) * 3}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Posted
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(job.postedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetailPage