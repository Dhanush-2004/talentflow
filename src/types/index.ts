export interface User {
  id: string
  email: string
  name: string
  role: 'candidate' | 'recruiter' | 'admin'
  avatar?: string
  department?: string
  position?: string
  bio?: string
  phone?: string
  location?: string
  skills?: string[]
  experience?: number
  education?: Education[]
  workHistory?: WorkHistory[]
  resume?: string
  linkedin?: string
  github?: string
  website?: string
  // Recruiter specific fields
  company?: string
  companySize?: string
  industry?: string
  hiringManager?: boolean
  createdAt: string
  updatedAt: string
}

export interface Job {
  id: string
  title: string
  slug: string
  company: string
  description: string
  requirements: string[]
  benefits: string[]
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'internship'
  salary?: {
    min: number
    max: number
    currency: string
  }
  status: 'active' | 'archived' | 'draft'
  postedBy: string
  postedAt: string
  applicationsCount: number
  tags: string[]
  order: number
  createdAt: string
  updatedAt: string
}

// Note and Timeline interfaces
export interface Note {
  id: string
  content: string
  authorId: string
  authorName: string
  mentions: string[] // user IDs mentioned in the note
  createdAt: string
}

export interface TimelineEvent {
  id: string
  type: 'stage_change' | 'note_added' | 'assessment_completed' | 'interview_scheduled'
  description: string
  fromStage?: 'applied' | 'screening' | 'interview' | 'assessment' | 'final-review' | 'hired' | 'rejected'
  toStage?: 'applied' | 'screening' | 'interview' | 'assessment' | 'final-review' | 'hired' | 'rejected'
  authorId: string
  authorName: string
  createdAt: string
}

export interface Candidate {
  id: string
  name: string
  email: string
  phone?: string
  resume?: string
  avatar?: string
  location: string
  experience: number
  skills: string[]
  education: Education[]
  workHistory: WorkHistory[]
  currentStage: 'applied' | 'screening' | 'interview' | 'assessment' | 'final-review' | 'hired' | 'rejected'
  appliedAt: string
  jobId: string
  notes: Note[]
  timeline: TimelineEvent[]
  createdAt: string
  updatedAt: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate?: string
  gpa?: number
}

export interface WorkHistory {
  id: string
  company: string
  position: string
  startDate: string
  endDate?: string
  description: string
  achievements: string[]
}

export interface Assessment {
  id: string
  title: string
  description: string
  type: 'technical' | 'behavioral' | 'cognitive' | 'personality'
  duration: number // in minutes
  questions: Question[]
  passingScore: number
  createdBy: string
  createdAt: string
  isActive: boolean
}

export interface Question {
  id: string
  type: 'multiple-choice' | 'text' | 'code' | 'rating' | 'integer'
  question: string
  options?: string[]
  correctAnswer?: string | number
  points: number
  timeLimit?: number // in seconds
}

export interface AssessmentResult {
  id: string
  assessmentId: string
  candidateId: string
  score: number
  totalScore: number
  percentage: number
  answers: Answer[]
  completedAt: string
  timeSpent: number // in minutes
}

export interface Answer {
  questionId: string
  answer: string | number
  isCorrect: boolean
  timeSpent: number // in seconds
}

export interface Application {
  id: string
  jobId: string
  candidateId: string
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected'
  appliedAt: string
  resume?: string
  coverLetter?: string
  assessmentResults?: string[]
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  createdAt: string
  actionUrl?: string
}

export interface DashboardStats {
  totalJobs: number
  activeJobs: number
  totalCandidates: number
  newApplications: number
  assessmentsCompleted: number
  interviewsScheduled: number
}
