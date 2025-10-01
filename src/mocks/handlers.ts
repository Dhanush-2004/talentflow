// MSW is disabled for production deployment
// All handlers are commented out since MSW is not being used

/*
import { http, HttpResponse } from 'msw'

// Initialize mock data from localStorage or use defaults
const initializeMockData = () => {
  // Check if localStorage is available (browser environment)
  if (typeof window === 'undefined' || !window.localStorage) {
    // Fallback to default data if localStorage is not available
    return {
      jobs: [],
      applications: [],
      assessments: [],
      candidates: []
    }
  }

  // Try to load from localStorage first (for persistence)
  const storedJobs = localStorage.getItem('msw_jobs')
  const storedApplications = localStorage.getItem('msw_applications')
  const storedAssessments = localStorage.getItem('msw_assessments')
  const storedCandidates = localStorage.getItem('msw_candidates')

  return {
    jobs: storedJobs ? JSON.parse(storedJobs) : [
      {
        id: '1',
        title: 'Frontend Developer',
        company: 'TechCorp',
        location: 'San Francisco, CA',
        type: 'Full-time',
        salary: { min: 80, max: 120, currency: 'USD', period: 'year' },
        postedAt: '2024-01-15',
        experience: '3+ years',
        description: 'We are looking for a skilled Frontend Developer to join our team.',
        applicationsCount: 25,
        status: 'active',
        recruiterId: 'recruiter_1'
      },
      {
        id: '2',
        title: 'Backend Developer',
        company: 'DataFlow',
        location: 'Remote',
        type: 'Full-time',
        salary: { min: 90, max: 130, currency: 'USD', period: 'year' },
        postedAt: '2024-01-14',
        experience: '4+ years',
        description: 'Join our backend team to build scalable APIs and services.',
        applicationsCount: 18,
        status: 'active',
        recruiterId: 'recruiter_1'
      }
    ],
    applications: storedApplications ? JSON.parse(storedApplications) : [],
    assessments: storedAssessments ? JSON.parse(storedAssessments) : [],
    candidates: storedCandidates ? JSON.parse(storedCandidates) : []
  }
}

const mockData = initializeMockData()

// Helper function to save data to localStorage
const saveToStorage = (key: string, data: any) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem(`msw_${key}`, JSON.stringify(data))
  }
}

export const handlers = [
  // Jobs API
  http.get('/api/jobs', () => {
    console.log('MSW: GET /api/jobs called')
    return HttpResponse.json({
      success: true,
      data: mockData.jobs.filter(job => job.status === 'active')
    })
  }),

  http.get('/api/jobs/:id', ({ params }) => {
    const job = mockData.jobs.find(j => j.id === params.id)
    if (!job) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json({
      success: true,
      data: job
    })
  }),

  http.post('/api/jobs', async ({ request }) => {
    console.log('MSW: POST /api/jobs called')
    const newJob = await request.json()
    console.log('MSW: New job data:', newJob)
    const job = {
      id: `job_${Date.now()}`,
      ...newJob,
      applicationsCount: 0,
      postedAt: new Date().toISOString().split('T')[0]
    }
    mockData.jobs.push(job)
    saveToStorage('jobs', mockData.jobs)
    
    return HttpResponse.json({
      success: true,
      data: job
    }, { status: 201 })
  }),

  http.put('/api/jobs/:id', async ({ params, request }) => {
    const updates = await request.json()
    const index = mockData.jobs.findIndex(j => j.id === params.id)
    
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    
    mockData.jobs[index] = { ...mockData.jobs[index], ...updates }
    saveToStorage('jobs', mockData.jobs)
    
    return HttpResponse.json({
      success: true,
      data: mockData.jobs[index]
    })
  }),

  http.delete('/api/jobs/:id', ({ params }) => {
    const index = mockData.jobs.findIndex(j => j.id === params.id)
    
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    
    mockData.jobs.splice(index, 1)
    saveToStorage('jobs', mockData.jobs)
    
    return HttpResponse.json({
      success: true,
      message: 'Job deleted successfully'
    })
  }),

  // Applications API
  http.get('/api/applications', ({ request }) => {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    
    let applications = mockData.applications
    if (userId) {
      applications = applications.filter(app => app.userId === userId)
    }
    
    return HttpResponse.json({
      success: true,
      data: applications
    })
  }),

  http.post('/api/applications', async ({ request }) => {
    const application = await request.json()
    const newApplication = {
      id: `app_${Date.now()}`,
      ...application,
      appliedAt: new Date().toISOString().split('T')[0],
      status: 'Applied'
    }
    
    mockData.applications.push(newApplication)
    saveToStorage('applications', mockData.applications)
    
    return HttpResponse.json({
      success: true,
      data: newApplication
    }, { status: 201 })
  }),

  http.put('/api/applications/:id', async ({ params, request }) => {
    const updates = await request.json()
    const index = mockData.applications.findIndex(app => app.id === params.id)
    
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    
    mockData.applications[index] = { ...mockData.applications[index], ...updates }
    saveToStorage('applications', mockData.applications)
    
    return HttpResponse.json({
      success: true,
      data: mockData.applications[index]
    })
  }),

  // Assessments API
  http.get('/api/assessments', ({ request }) => {
    console.log('MSW: GET /api/assessments called')
    const url = new URL(request.url)
    const recruiterId = url.searchParams.get('recruiterId')
    const jobId = url.searchParams.get('jobId')
    
    console.log('MSW: Query params:', { recruiterId, jobId })
    console.log('MSW: All assessments:', mockData.assessments)
    
    let assessments = mockData.assessments
    if (recruiterId) {
      assessments = assessments.filter(assessment => assessment.recruiterId === recruiterId)
      console.log('MSW: Filtered by recruiter:', assessments)
    }
    if (jobId) {
      assessments = assessments.filter(assessment => assessment.jobId === jobId)
      console.log('MSW: Filtered by job:', assessments)
    }
    
    return HttpResponse.json({
      success: true,
      data: assessments
    })
  }),

  http.post('/api/assessments', async ({ request }) => {
    console.log('MSW: POST /api/assessments called')
    const assessment = await request.json()
    console.log('MSW: Assessment data received:', assessment)
    
    const newAssessment = {
      id: `assessment_${Date.now()}`,
      ...assessment,
      createdAt: new Date().toISOString()
      // Don't override status - use the one from request
    }
    
    console.log('MSW: Created assessment:', newAssessment)
    mockData.assessments.push(newAssessment)
    saveToStorage('assessments', mockData.assessments)
    
    return HttpResponse.json({
      success: true,
      data: newAssessment
    }, { status: 201 })
  }),

  http.put('/api/assessments/:id', async ({ params, request }) => {
    const updates = await request.json()
    const index = mockData.assessments.findIndex(assessment => assessment.id === params.id)
    
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    
    mockData.assessments[index] = { ...mockData.assessments[index], ...updates }
    
    return HttpResponse.json({
      success: true,
      data: mockData.assessments[index]
    })
  }),

  // Candidates API
  http.get('/api/candidates', ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search')
    const status = url.searchParams.get('status')
    
    let candidates = mockData.candidates
    if (search) {
      candidates = candidates.filter(candidate => 
        candidate.name.toLowerCase().includes(search.toLowerCase()) ||
        candidate.email.toLowerCase().includes(search.toLowerCase()) ||
        candidate.position.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (status && status !== 'all') {
      candidates = candidates.filter(candidate => candidate.status === status)
    }
    
    return HttpResponse.json({
      success: true,
      data: candidates
    })
  }),

  http.post('/api/candidates', async ({ request }) => {
    const candidate = await request.json()
    const newCandidate = {
      id: `candidate_${Date.now()}`,
      ...candidate,
      appliedAt: new Date().toISOString().split('T')[0]
    }
    
    mockData.candidates.push(newCandidate)
    
    return HttpResponse.json({
      success: true,
      data: newCandidate
    }, { status: 201 })
  }),

  http.put('/api/candidates/:id', async ({ params, request }) => {
    const updates = await request.json()
    const index = mockData.candidates.findIndex(candidate => candidate.id === params.id)
    
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    
    mockData.candidates[index] = { ...mockData.candidates[index], ...updates }
    
    return HttpResponse.json({
      success: true,
      data: mockData.candidates[index]
    })
  }),

  http.delete('/api/candidates/:id', ({ params }) => {
    const index = mockData.candidates.findIndex(candidate => candidate.id === params.id)
    
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    
    mockData.candidates.splice(index, 1)
    
    return HttpResponse.json({
      success: true,
      message: 'Candidate deleted successfully'
    })
  })
]

export { handlers }
*/
