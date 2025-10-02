import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { apiService } from '../services/api'
import { 
  Briefcase, 
  FileText, 
  Calendar, 
  Bell, 
  Users,
  TrendingUp
} from 'lucide-react'

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    appliedJobs: 0,
    interviews: 0,
    assessments: 0,
    notifications: 0
  })
  const [recentJobs, setRecentJobs] = useState<any[]>([])

  useEffect(() => {
    // Load stats from API
    const loadStats = async () => {
      try {
        const applicationsResponse = await apiService.getApplications(user?.id)
        const userApplications = applicationsResponse.data || []
        
        const interviews = userApplications.filter((app: any) => 
          app.status === 'Interview Scheduled' || app.status === 'Interview Completed'
        ).length
        
        const assessments = userApplications.filter((app: any) => 
          app.status === 'Assessment Required' || app.status === 'Assessment Completed'
        ).length
        
        setStats({
          appliedJobs: userApplications.length,
          interviews,
          assessments,
          notifications: userApplications.filter((app: any) => 
            app.status === 'Applied' || app.status === 'Under Review'
          ).length
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    }

    if (user?.id) {
      loadStats()
    }
  }, [user?.id])

  useEffect(() => {
    // Load recent applications
    const loadRecentJobs = async () => {
      try {
        const applicationsResponse = await apiService.getApplications(user?.id)
        const userApplications = applicationsResponse.data || []
        
        // Sort by applied date and take recent 5
        const sorted = userApplications
          .sort((a: any, b: any) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
          .slice(0, 5)
        
        setRecentJobs(sorted)
      } catch (error) {
        console.error('Error loading recent jobs:', error)
        setRecentJobs([])
      }
    }

    if (user?.id) {
      loadRecentJobs()
    }
  }, [user?.id])

  const upcomingEvents = [
    {
      id: '1',
      title: 'Interview with TechCorp',
      date: 'Today, 2:00 PM',
      type: 'Interview'
    },
    {
      id: '2',
      title: 'Assessment for React Developer',
      date: 'Tomorrow',
      type: 'Assessment'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-100 text-blue-800'
      case 'Interview Scheduled':
        return 'bg-purple-100 text-purple-800'
      case 'Assessment Required':
        return 'bg-yellow-100 text-yellow-800'
      case 'Assessment Completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
                <h1 className="text-2xl font-bold text-gray-900 ">
                  Welcome back, {user?.name}!
                </h1>
                <p className="mt-1 text-sm text-gray-500 ">
                  Here's what's happening with your job applications today.
                </p>
              </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white  overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                <Briefcase className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500  truncate">
                            Applied Jobs
                          </dt>
                  <dd className="text-2xl font-bold text-gray-900 ">
                            {stats.appliedJobs}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white  overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500  truncate">
                            Interviews
                          </dt>
                  <dd className="text-2xl font-bold text-gray-900 ">
                            {stats.interviews}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white  overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500  truncate">
                            Assessments
                          </dt>
                  <dd className="text-2xl font-bold text-gray-900 ">
                            {stats.assessments}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white  overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                <Bell className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500  truncate">
                            Notifications
                          </dt>
                  <dd className="text-2xl font-bold text-gray-900 ">
                            {stats.notifications}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
                <div className="bg-white  shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 ">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 ">
                Recent Applications
                    </h3>
              <Link
                to="/employee/applications"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200 ">
            {recentJobs.length > 0 ? (
              recentJobs.map((job) => (
                <div key={job.id} className="p-6">
                  <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900 ">
                        {job.jobTitle}
                              </h4>
                              <p className="text-sm text-gray-500 ">
                        {job.company}
                              </p>
                      <p className="text-xs text-gray-400  mt-1">
                        Applied {new Date(job.appliedAt).toLocaleDateString()}
                              </p>
                            </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                                {job.status}
                              </span>
                            </div>
                          </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 ">
                  No applications yet
                </h3>
                <p className="mt-1 text-sm text-gray-500 ">
                  Start applying to jobs to see them here.
                </p>
                <div className="mt-6">
                        <Link
                          to="/employee/jobs"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                    Browse Jobs
                        </Link>
                      </div>
                    </div>
            )}
                  </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white  shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 ">
            <h3 className="text-lg font-medium text-gray-900 ">
                      Upcoming Events
                    </h3>
          </div>
          <div className="divide-y divide-gray-200 ">
                        {upcomingEvents.map((event) => (
              <div key={event.id} className="p-6">
                <div className="flex items-center">
                            <div className="flex-shrink-0">
                    {event.type === 'Interview' ? (
                      <Users className="h-8 w-8 text-purple-600" />
                    ) : (
                      <FileText className="h-8 w-8 text-green-600" />
                    )}
                            </div>
                            <div className="ml-4 flex-1">
                              <h4 className="text-sm font-medium text-gray-900 ">
                                {event.title}
                              </h4>
                              <p className="text-sm text-gray-500 ">
                      {event.date}
                              </p>
                            </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

      {/* Quick Actions */}
      <div className="bg-white  shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 ">
          <h3 className="text-lg font-medium text-gray-900 ">
            Quick Actions
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/employee/jobs"
              className="relative rounded-lg border border-gray-300  bg-white  px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 :border-gray-500 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
            >
              <div className="flex-shrink-0">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900 ">
                  Browse Jobs
                </p>
                <p className="text-sm text-gray-500 ">
                  Find new opportunities
                </p>
              </div>
            </Link>

            <Link
              to="/employee/applications"
              className="relative rounded-lg border border-gray-300  bg-white  px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 :border-gray-500 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
            >
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900 ">
                  My Applications
                </p>
                <p className="text-sm text-gray-500 ">
                  Track your applications
                </p>
              </div>
            </Link>

            <Link
              to="/employee/assessments"
              className="relative rounded-lg border border-gray-300  bg-white  px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 :border-gray-500 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
            >
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900 ">
                  Assessments
                </p>
                <p className="text-sm text-gray-500 ">
                  Take skill assessments
                </p>
                </div>
            </Link>

            <Link
              to="/employee/profile"
              className="relative rounded-lg border border-gray-300  bg-white  px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 :border-gray-500 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
            >
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900 ">
                  Profile
                </p>
                <p className="text-sm text-gray-500 ">
                  Update your profile
                </p>
            </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeDashboard
