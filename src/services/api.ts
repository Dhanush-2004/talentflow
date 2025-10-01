import { mockApiService } from './mockApiService'

// const API_BASE_URL = '/api' // Not used since using direct localStorage approach

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Since using direct localStorage approach, directly use mock service to avoid console errors
    console.log(`Using mock API service: ${options.method || 'GET'} ${endpoint}`)
    return this.fallbackToMock(endpoint, options) as Promise<ApiResponse<T>>
  }

  private async fallbackToMock<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const method = options.method || 'GET'
    const body = options.body ? JSON.parse(options.body as string) : undefined

    console.log(`Mock API fallback: ${method} ${endpoint}`, body)

    try {
      // Jobs endpoints
      if (endpoint === '/jobs' && method === 'GET') {
        return await mockApiService.getJobs() as ApiResponse<T>
      }
      if (endpoint === '/jobs' && method === 'POST') {
        return await mockApiService.createJob(body) as ApiResponse<T>
      }
      if (endpoint.startsWith('/jobs/') && method === 'PUT') {
        const id = endpoint.split('/')[2]
        return await mockApiService.updateJob(id, body) as ApiResponse<T>
      }
      if (endpoint.startsWith('/jobs/') && method === 'DELETE') {
        const id = endpoint.split('/')[2]
        return await mockApiService.deleteJob(id) as ApiResponse<T>
      }

      // Applications endpoints
      if (endpoint.startsWith('/applications') && method === 'GET') {
        const url = new URL(endpoint, window.location.origin)
        const userId = url.searchParams.get('userId')
        // Handle undefined userId by not filtering
        return await mockApiService.getApplications(userId || undefined) as ApiResponse<T>
      }
      if (endpoint === '/applications' && method === 'POST') {
        return await mockApiService.createApplication(body) as ApiResponse<T>
      }
      if (endpoint.startsWith('/applications/') && method === 'PUT') {
        const id = endpoint.split('/')[2]
        return await mockApiService.updateApplication(id, body) as ApiResponse<T>
      }

      // Assessments endpoints
      if (endpoint.startsWith('/assessments') && method === 'GET') {
        const url = new URL(endpoint, window.location.origin)
        const recruiterId = url.searchParams.get('recruiterId')
        return await mockApiService.getAssessments(recruiterId || undefined) as ApiResponse<T>
      }
      if (endpoint === '/assessments' && method === 'POST') {
        return await mockApiService.createAssessment(body) as ApiResponse<T>
      }
      if (endpoint.startsWith('/assessments/') && method === 'PUT') {
        const id = endpoint.split('/')[2]
        return await mockApiService.updateAssessment(id, body) as ApiResponse<T>
      }

      // Candidates endpoints
      if (endpoint === '/candidates' && method === 'GET') {
        return await mockApiService.getCandidates() as ApiResponse<T>
      }
      if (endpoint === '/candidates' && method === 'POST') {
        return await mockApiService.createCandidate(body) as ApiResponse<T>
      }
      if (endpoint.startsWith('/candidates/') && method === 'PUT') {
        const id = endpoint.split('/')[2]
        return await mockApiService.updateCandidate(id, body) as ApiResponse<T>
      }
      if (endpoint.startsWith('/candidates/') && method === 'DELETE') {
        const id = endpoint.split('/')[2]
        return await mockApiService.deleteCandidate(id) as ApiResponse<T>
      }

      throw new Error(`Mock endpoint not found: ${method} ${endpoint}`)
    } catch (error) {
      console.error('Mock API fallback failed:', error)
      throw error
    }
  }

  // Jobs API
  async getJobs(): Promise<ApiResponse<any[]>> {
    return this.request('/jobs')
  }

  async getJob(id: string): Promise<ApiResponse<any>> {
    return this.request(`/jobs/${id}`)
  }

  async createJob(jobData: any): Promise<ApiResponse<any>> {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    })
  }

  async updateJob(id: string, jobData: any): Promise<ApiResponse<any>> {
    return this.request(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    })
  }

  async deleteJob(id: string): Promise<ApiResponse<void>> {
    return this.request(`/jobs/${id}`, {
      method: 'DELETE',
    })
  }

  // Applications API
  async getApplications(userId?: string): Promise<ApiResponse<any[]>> {
    const endpoint = userId ? `/applications?userId=${userId}` : '/applications'
    return this.request(endpoint)
  }

  async createApplication(applicationData: any): Promise<ApiResponse<any>> {
    return this.request('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    })
  }

  async updateApplication(id: string, applicationData: any): Promise<ApiResponse<any>> {
    return this.request(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(applicationData),
    })
  }

  // Assessments API
  async getAssessments(recruiterId?: string, jobId?: string): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams()
    if (recruiterId) params.append('recruiterId', recruiterId)
    if (jobId) params.append('jobId', jobId)
    
    const endpoint = params.toString() ? `/assessments?${params}` : '/assessments'
    return this.request(endpoint)
  }

  async createAssessment(assessmentData: any): Promise<ApiResponse<any>> {
    return this.request('/assessments', {
      method: 'POST',
      body: JSON.stringify(assessmentData),
    })
  }

  async updateAssessment(id: string, assessmentData: any): Promise<ApiResponse<any>> {
    return this.request(`/assessments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(assessmentData),
    })
  }

  // Candidates API
  async getCandidates(search?: string, status?: string): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (status) params.append('status', status)
    
    const endpoint = params.toString() ? `/candidates?${params}` : '/candidates'
    return this.request(endpoint)
  }

  async createCandidate(candidateData: any): Promise<ApiResponse<any>> {
    return this.request('/candidates', {
      method: 'POST',
      body: JSON.stringify(candidateData),
    })
  }

  async updateCandidate(id: string, candidateData: any): Promise<ApiResponse<any>> {
    return this.request(`/candidates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(candidateData),
    })
  }

  async deleteCandidate(id: string): Promise<ApiResponse<void>> {
    return this.request(`/candidates/${id}`, {
      method: 'DELETE',
    })
  }
}

export const apiService = new ApiService()
