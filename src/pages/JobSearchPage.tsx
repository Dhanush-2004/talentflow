import React, { useState, useEffect } from 'react'
import { 
  Send,
  Search,
  MapPin,
  Clock,
  Filter,
  Calendar,
  DollarSign,
  Briefcase,
  ChevronDown,
  CheckCircle
} from 'lucide-react'
import Button from '../components/Button'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/Toast'
import { apiService } from '../services/api'

const JobSearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedJobType, setSelectedJobType] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    jobType: [] as string[],
    seniority: [] as string[],
    salary: 50,
    remote: false,
    onsite: false
  })
  const [jobs, setJobs] = useState<any[]>([])
  const [allJobs, setAllJobs] = useState<any[]>([]) // Store all jobs for filtering
  const [loading, setLoading] = useState(true)

  const { user } = useAuth()
  const { showToast } = useToast()

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true)
      
      try {
        // Load jobs from API
        const jobsResponse = await apiService.getJobs()
        const activeJobs = jobsResponse.data
        
        // Load existing applications to check if user has already applied
        const applicationsResponse = await apiService.getApplications(user?.id)
        const userApplications = applicationsResponse.data
        
        const mappedJobs = activeJobs.map((job: any) => ({
            id: job.id,
            company: job.company,
            companyLogo: job.company?.charAt(0) || 'C',
            title: job.title,
          posted: `Posted ${new Date(job.postedAt).toLocaleDateString()}`,
            description: job.description,
            tags: [job.type || 'Full time', job.location || 'Remote'],
          salary: job.salary ? `$${job.salary.min.toLocaleString()}-${job.salary.max.toLocaleString()}/${job.salary.period}` : 'Salary not specified',
          location: job.location,
          type: job.type,
          experience: job.experience || 'Not specified',
          hasApplied: userApplications.some((app: any) => app.jobId === job.id),
          jobId: job.id
        }))
        
        setAllJobs(mappedJobs) // Store all jobs
        setJobs(mappedJobs) // Initially show all jobs
      } catch (error) {
        console.error('Error loading jobs:', error)
        setJobs([])
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) {
      loadJobs()
    }
  }, [user?.id])

  // Filter jobs based on search query and filters
  useEffect(() => {
    const filteredJobs = allJobs.filter((job: any) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.tags.some((tag: string) => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Location filter
      if (selectedLocation && !job.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
        return false;
      }

      // Job type filter
      if (selectedJobType && job.type !== selectedJobType) {
        return false;
      }

      // Filter by job type (existing)
      if (filters.jobType.length > 0 && !filters.jobType.includes(job.type)) {
        return false;
      }
      
      // Filter by location (existing)
      if (filters.remote && job.location.toLowerCase().includes('remote')) {
        return true;
      }
      if (filters.onsite && !job.location.toLowerCase().includes('remote')) {
        return true;
      }
      if (!filters.remote && !filters.onsite) {
        return true; // Show all if neither is selected
      }
      
      return false;
    });
    
    setJobs(filteredJobs);
  }, [searchQuery, selectedLocation, selectedJobType, filters, allJobs])

  const handleApplyJob = async (job: any) => {
    if (!user) {
      showToast('error', 'Login Required', 'Please log in to apply for jobs');
      return;
    }

    if (job.hasApplied) {
      showToast('info', 'Already Applied', 'You have already applied for this job');
      return;
    }

    // Create application
    const application = {
      id: `app_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      appliedAt: new Date().toISOString(),
      status: 'Applied',
      assessmentCompleted: false,
      assessmentScore: null,
      notes: ''
    }

    try {
      // Submit application via API
      await apiService.createApplication(application)

      // Update job to show as applied in both filtered and all jobs
      setJobs(prevJobs => 
        prevJobs.map(j => 
          j.id === job.id ? { ...j, hasApplied: true } : j
        )
      )
      setAllJobs(prevJobs => 
        prevJobs.map(j => 
          j.id === job.id ? { ...j, hasApplied: true } : j
        )
      )

      showToast('success', 'Application Submitted', `Successfully applied for ${job.title} at ${job.company}!`);
    } catch (error) {
      console.error('Error applying for job:', error);
      showToast('error', 'Application Failed', 'Failed to submit application. Please try again.');
    }
  }

  // Get unique locations and job types for filter dropdowns
  const uniqueLocations = [...new Set(allJobs.map(job => job.location))].filter(Boolean)
  const uniqueJobTypes = [...new Set(allJobs.map(job => job.type))].filter(Boolean)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Find Your Dream Job</h1>
              <p className="text-gray-600 mt-1">{jobs.length} jobs available</p>
            </div>
            
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

              <div className="flex gap-2">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">All Locations</option>
                  {uniqueLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                
                <select
                  value={selectedJobType}
                  onChange={(e) => setSelectedJobType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">All Types</option>
                  {uniqueJobTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                
                  <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                  <Filter className="h-4 w-4" />
                  Filters
                  <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Work Type</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.remote}
                      onChange={(e) => setFilters(prev => ({ ...prev, remote: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Remote</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.onsite}
                      onChange={(e) => setFilters(prev => ({ ...prev, onsite: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                      <span className="ml-2 text-sm text-gray-700">On-site</span>
                    </label>
                </div>
              </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Salary: ${filters.salary}k
                    </label>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    step="10"
                    value={filters.salary}
                    onChange={(e) => setFilters(prev => ({ ...prev, salary: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedLocation('')
                      setSelectedJobType('')
                      setFilters({
                        jobType: [],
                        seniority: [],
                        salary: 50,
                        remote: false,
                        onsite: false
                      })
                    }}
                    className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Job Listings */}
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading jobs...</p>
                </div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 p-6 h-full flex flex-col">
                    {/* Job Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-lg">{job.companyLogo}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                            {job.title}
                          </h3>
                          <p className="text-gray-600 font-medium">{job.company}</p>
                        </div>
                      </div>
                      
                    </div>

                    {/* Job Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        {job.type}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                        {job.salary}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {job.posted}
                      </div>
                    </div>

                    {/* Job Description */}
                    <div className="flex-1 mb-4">
                      <p className="text-gray-600 text-sm line-clamp-3 h-16 overflow-hidden">
                        {job.description}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4 h-8">
                      {job.tags.slice(0, 3).map((tag: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                      {job.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{job.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Apply Button */}
                    <div className="pt-4 border-t border-gray-100">
                      {job.hasApplied ? (
                        <Button disabled className="w-full bg-green-50 text-green-700 border-green-200 hover:bg-green-50">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Applied
                        </Button>
                      ) : (
                        <Button onClick={() => handleApplyJob(job)} className="w-full bg-blue-600 hover:bg-blue-700">
                          <Send className="h-4 w-4 mr-2" />
                          Apply Now
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobSearchPage