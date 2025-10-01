class StorageService {
  private prefix = 'talentflow_'

  private getKey(key: string): string {
    return `${this.prefix}${key}`
  }

  setItem(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value)
      localStorage.setItem(this.getKey(key), serializedValue)
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  getItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key))
      if (item === null) {
        return defaultValue || null
      }
      return JSON.parse(item)
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return defaultValue || null
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(this.getKey(key))
  }

  clear(): void {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key)
      }
    })
  }

  // Specific methods for common data
  setUserPreferences(preferences: any): void {
    this.setItem('user_preferences', preferences)
  }

  getUserPreferences(): any {
    return this.getItem('user_preferences', {})
  }

  setDashboardLayout(layout: any): void {
    this.setItem('dashboard_layout', layout)
  }

  getDashboardLayout(): any {
    return this.getItem('dashboard_layout', {})
  }

  setRecentJobs(jobs: string[]): void {
    this.setItem('recent_jobs', jobs)
  }

  getRecentJobs(): string[] {
    return this.getItem('recent_jobs', []) || []
  }

  setDraftAssessment(assessment: any): void {
    this.setItem('draft_assessment', assessment)
  }

  getDraftAssessment(): any {
    return this.getItem('draft_assessment', null)
  }

  clearDraftAssessment(): void {
    this.removeItem('draft_assessment')
  }

  setNotifications(notifications: any[]): void {
    this.setItem('notifications', notifications)
  }

  getNotifications(): any[] {
    return this.getItem('notifications', []) || []
  }

  markNotificationAsRead(notificationId: string): void {
    const notifications = this.getNotifications()
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification
    )
    this.setNotifications(updatedNotifications)
  }

  setTheme(theme: string): void {
    this.setItem('theme', theme)
  }

  getTheme(): string {
    return this.getItem('theme', 'system') || 'system'
  }
}

export const storageService = new StorageService()
