import { User } from '../types'

// Mock users for development
const mockUsers: User[] = [
  {
    id: '1',
    email: 'candidate@test.com',
    name: 'Jacob Jones',
    role: 'candidate',
    department: 'Engineering',
    position: 'UI/UX Designer',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '2',
    email: 'recruiter@test.com',
    name: 'Sarah Wilson',
    role: 'recruiter',
    department: 'HR',
    position: 'Senior Recruiter',
    company: 'TechCorp',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '3',
    email: 'john@example.com',
    name: 'John Doe',
    role: 'candidate',
    department: 'Engineering',
    position: 'Frontend Developer',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '4',
    email: 'jane@example.com',
    name: 'Jane Smith',
    role: 'recruiter',
    department: 'HR',
    position: 'Senior Recruiter',
    company: 'StartupXYZ',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
]

interface LoginResponse {
  user: User
  token: string
}

interface SignupResponse {
  user: User
  token: string
}

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

class AuthService {
  private async mockRequest<T>(data: T, shouldFail: boolean = false): Promise<T> {
    await delay(500 + Math.random() * 1000) // 500-1500ms delay
    
    if (shouldFail && Math.random() < 0.1) { // 10% chance of failure
      throw new Error('Network error (simulated)')
    }
    
    return data
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    console.log('Mock login attempt:', email)
    
    const user = mockUsers.find(u => u.email === email)
    if (!user) {
      throw new Error('Invalid credentials')
    }

    // For demo purposes, accept any password
    const token = `mock-jwt-token-${Date.now()}`
    
    return this.mockRequest({
      user,
      token
    })
  }

  async signup(name: string, email: string, password: string, role: string): Promise<SignupResponse> {
    console.log('Mock signup attempt:', email, role)
    
    // Check if user already exists
    if (mockUsers.find(u => u.email === email)) {
      throw new Error('User already exists')
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: role as 'candidate' | 'recruiter' | 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Add to mock users
    mockUsers.push(newUser)
    
    const token = `mock-jwt-token-${Date.now()}`
    
    return this.mockRequest({
      user: newUser,
      token
    })
  }

  async getCurrentUser(): Promise<User> {
    console.log('Mock getCurrentUser called')
    
    const token = localStorage.getItem('token')
    if (!token || !token.startsWith('mock-jwt-token')) {
      throw new Error('Invalid token')
    }

    // For demo, return the first mock user
    // In a real app, you'd decode the token to get user ID
    const user = mockUsers[0]
    if (!user) {
      throw new Error('User not found')
    }

    return this.mockRequest(user)
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    console.log('Mock updateProfile called:', userData)
    
    const token = localStorage.getItem('token')
    if (!token || !token.startsWith('mock-jwt-token')) {
      throw new Error('Invalid token')
    }

    // For demo, update the first mock user
    const user = mockUsers[0]
    if (!user) {
      throw new Error('User not found')
    }

    const updatedUser = { ...user, ...userData, updatedAt: new Date().toISOString() }
    const userIndex = mockUsers.findIndex(u => u.id === user.id)
    if (userIndex !== -1) {
      mockUsers[userIndex] = updatedUser
    }

    return this.mockRequest(updatedUser)
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    console.log('Mock changePassword called')
    return this.mockRequest(undefined)
  }

  async forgotPassword(email: string): Promise<void> {
    console.log('Mock forgotPassword called:', email)
    return this.mockRequest(undefined)
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    console.log('Mock resetPassword called')
    return this.mockRequest(undefined)
  }

  logout(): void {
    localStorage.removeItem('token')
    console.log('Mock logout called')
  }
}

export const authService = new AuthService()