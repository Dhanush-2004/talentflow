// Temporary fallback API service using localStorage directly
// This ensures the application works while we fix MSW issues

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

class MockApiService {
  private delay(ms: number = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Jobs API
  async getJobs(): Promise<ApiResponse<any[]>> {
    await this.delay();
    try {
      const jobs = JSON.parse(localStorage.getItem('msw_jobs') || '[]');
      return {
        success: true,
        data: jobs.filter((job: any) => job.status === 'active')
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to load jobs'
      };
    }
  }

  async createJob(jobData: any): Promise<ApiResponse<any>> {
    await this.delay();
    try {
      const jobs = JSON.parse(localStorage.getItem('msw_jobs') || '[]');
      const newJob = {
        id: `job_${Date.now()}`,
        ...jobData,
        applicationsCount: 0,
        postedAt: new Date().toISOString().split('T')[0],
        status: 'active'
      };
      jobs.push(newJob);
      localStorage.setItem('msw_jobs', JSON.stringify(jobs));
      return {
        success: true,
        data: newJob
      };
    } catch (error) {
      throw new Error('Failed to create job');
    }
  }

  async updateJob(id: string, jobData: any): Promise<ApiResponse<any>> {
    await this.delay();
    try {
      const jobs = JSON.parse(localStorage.getItem('msw_jobs') || '[]');
      const index = jobs.findIndex((job: any) => job.id === id);
      if (index === -1) {
        throw new Error('Job not found');
      }
      jobs[index] = { ...jobs[index], ...jobData };
      localStorage.setItem('msw_jobs', JSON.stringify(jobs));
      return {
        success: true,
        data: jobs[index]
      };
    } catch (error) {
      throw new Error('Failed to update job');
    }
  }

  async deleteJob(id: string): Promise<ApiResponse<void>> {
    await this.delay();
    try {
      const jobs = JSON.parse(localStorage.getItem('msw_jobs') || '[]');
      const filteredJobs = jobs.filter((job: any) => job.id !== id);
      localStorage.setItem('msw_jobs', JSON.stringify(filteredJobs));
      return {
        success: true,
        data: undefined as any
      };
    } catch (error) {
      throw new Error('Failed to delete job');
    }
  }

  // Applications API
  async getApplications(userId?: string): Promise<ApiResponse<any[]>> {
    await this.delay();
    try {
      const applications = JSON.parse(localStorage.getItem('msw_applications') || '[]');
      const filtered = userId && userId !== 'undefined' && userId !== 'null'
        ? applications.filter((app: any) => app.userId === userId)
        : applications;
      
      return {
        success: true,
        data: filtered
      };
    } catch (error) {
      console.error('Mock API: Error loading applications:', error);
      return {
        success: false,
        data: [],
        message: 'Failed to load applications'
      };
    }
  }

  async createApplication(applicationData: any): Promise<ApiResponse<any>> {
    await this.delay();
    try {
      const applications = JSON.parse(localStorage.getItem('msw_applications') || '[]');
      const newApplication = {
        id: `app_${Date.now()}`,
        ...applicationData,
        appliedAt: new Date().toISOString(),
        status: 'Applied',
        assessmentCompleted: false,
        assessmentScore: null
      };
      applications.push(newApplication);
      localStorage.setItem('msw_applications', JSON.stringify(applications));
      return {
        success: true,
        data: newApplication
      };
    } catch (error) {
      throw new Error('Failed to create application');
    }
  }

  async updateApplication(id: string, updates: any): Promise<ApiResponse<any>> {
    await this.delay();
    try {
      const applications = JSON.parse(localStorage.getItem('msw_applications') || '[]');
      const index = applications.findIndex((app: any) => app.id === id);
      if (index === -1) {
        throw new Error('Application not found');
      }
      applications[index] = { ...applications[index], ...updates };
      localStorage.setItem('msw_applications', JSON.stringify(applications));
      return {
        success: true,
        data: applications[index]
      };
    } catch (error) {
      throw new Error('Failed to update application');
    }
  }

  // Assessments API
  async getAssessments(recruiterId?: string): Promise<ApiResponse<any[]>> {
    await this.delay();
    try {
      const assessments = JSON.parse(localStorage.getItem('msw_assessments') || '[]');
      const filtered = recruiterId && recruiterId !== 'undefined' && recruiterId !== 'null'
        ? assessments.filter((assessment: any) => assessment.recruiterId === recruiterId)
        : assessments;
      
      return {
        success: true,
        data: filtered
      };
    } catch (error) {
      console.error('Mock API: Error loading assessments:', error);
      return {
        success: false,
        data: [],
        message: 'Failed to load assessments'
      };
    }
  }

  async createAssessment(assessmentData: any): Promise<ApiResponse<any>> {
    await this.delay();
    try {
      const assessments = JSON.parse(localStorage.getItem('msw_assessments') || '[]');
      const newAssessment = {
        id: `assessment_${Date.now()}`,
        ...assessmentData,
        createdAt: new Date().toISOString()
      };
      assessments.push(newAssessment);
      localStorage.setItem('msw_assessments', JSON.stringify(assessments));
      return {
        success: true,
        data: newAssessment
      };
    } catch (error) {
      throw new Error('Failed to create assessment');
    }
  }

  async updateAssessment(id: string, updates: any): Promise<ApiResponse<any>> {
    await this.delay();
    try {
      const assessments = JSON.parse(localStorage.getItem('msw_assessments') || '[]');
      const index = assessments.findIndex((assessment: any) => assessment.id === id);
      if (index === -1) {
        throw new Error('Assessment not found');
      }
      assessments[index] = { ...assessments[index], ...updates };
      localStorage.setItem('msw_assessments', JSON.stringify(assessments));
      return {
        success: true,
        data: assessments[index]
      };
    } catch (error) {
      throw new Error('Failed to update assessment');
    }
  }

  // Candidates API
  async getCandidates(): Promise<ApiResponse<any[]>> {
    await this.delay();
    try {
      const candidates = JSON.parse(localStorage.getItem('msw_candidates') || '[]');
      return {
        success: true,
        data: candidates
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to load candidates'
      };
    }
  }

  async createCandidate(candidateData: any): Promise<ApiResponse<any>> {
    await this.delay();
    try {
      const candidates = JSON.parse(localStorage.getItem('msw_candidates') || '[]');
      const newCandidate = {
        id: `candidate_${Date.now()}`,
        ...candidateData,
        createdAt: new Date().toISOString()
      };
      candidates.push(newCandidate);
      localStorage.setItem('msw_candidates', JSON.stringify(candidates));
      return {
        success: true,
        data: newCandidate
      };
    } catch (error) {
      throw new Error('Failed to create candidate');
    }
  }

  async updateCandidate(id: string, updates: any): Promise<ApiResponse<any>> {
    await this.delay();
    try {
      const candidates = JSON.parse(localStorage.getItem('msw_candidates') || '[]');
      const index = candidates.findIndex((candidate: any) => candidate.id === id);
      if (index === -1) {
        throw new Error('Candidate not found');
      }
      candidates[index] = { ...candidates[index], ...updates };
      localStorage.setItem('msw_candidates', JSON.stringify(candidates));
      return {
        success: true,
        data: candidates[index]
      };
    } catch (error) {
      throw new Error('Failed to update candidate');
    }
  }

  async deleteCandidate(id: string): Promise<ApiResponse<void>> {
    await this.delay();
    try {
      const candidates = JSON.parse(localStorage.getItem('msw_candidates') || '[]');
      const filteredCandidates = candidates.filter((candidate: any) => candidate.id !== id);
      localStorage.setItem('msw_candidates', JSON.stringify(filteredCandidates));
      return {
        success: true,
        data: undefined as any
      };
    } catch (error) {
      throw new Error('Failed to delete candidate');
    }
  }
}

export const mockApiService = new MockApiService();
