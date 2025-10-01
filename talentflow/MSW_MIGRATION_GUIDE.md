# 🔄 MSW Migration Guide

## Overview
This guide shows how to migrate from localStorage-based mock data to MSW (Mock Service Worker) for a more realistic API simulation.

## ✅ Completed Steps

### 1. **MSW Installation & Setup**
```bash
npm install msw --save-dev
```

### 2. **MSW Configuration Files Created**
- `src/mocks/browser.ts` - MSW worker setup
- `src/mocks/handlers.ts` - API handlers with mock data
- `src/services/api.ts` - Centralized API service layer

### 3. **Main.tsx Updated**
- Added MSW initialization
- Preserved existing service worker cleanup (except MSW)

## 🚀 Migration Steps for Each Component

### **Step 1: Import API Service**
```typescript
// Add this import to any component using localStorage
import { apiService } from '../services/api'
```

### **Step 2: Replace localStorage Calls**

#### **Before (localStorage):**
```typescript
// Loading data
const data = JSON.parse(localStorage.getItem('key') || '[]')

// Saving data  
localStorage.setItem('key', JSON.stringify(data))
```

#### **After (MSW API):**
```typescript
// Loading data
const response = await apiService.getData()
const data = response.data

// Saving data
await apiService.createData(newData)
```

### **Step 3: Update Component Logic**

#### **Example: JobSearchPage.tsx**
```typescript
// BEFORE: localStorage-based
useEffect(() => {
  const loadJobs = () => {
    setTimeout(() => {
      const jobs = JSON.parse(localStorage.getItem('mockJobs') || '[]')
      setJobs(jobs)
    }, 800)
  }
  loadJobs()
}, [])

// AFTER: API-based
useEffect(() => {
  const loadJobs = async () => {
    try {
      const response = await apiService.getJobs()
      setJobs(response.data)
    } catch (error) {
      console.error('Error loading jobs:', error)
    }
  }
  loadJobs()
}, [])
```

## 📋 Components to Migrate

### **High Priority (Core Functionality)**
1. ✅ **JobSearchPage.tsx** - Job browsing and applications
2. **JobsPage.tsx** - Recruiter job management
3. **CreateJobPage.tsx** - Job creation
4. **EmployeeApplicationsPage.tsx** - Application tracking
5. **EmployeeAssessmentsPage.tsx** - Assessment management
6. **CandidatesPage.tsx** - Candidate management
7. **AssessmentBuilder.tsx** - Assessment creation

### **Medium Priority**
8. **AssessmentsPage.tsx** - Assessment listing
9. **AssessmentPage.tsx** - Taking assessments
10. **EmployeeDashboard.tsx** - Dashboard stats

## 🔧 API Endpoints Available

### **Jobs API**
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get specific job
- `POST /api/jobs` - Create job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### **Applications API**
- `GET /api/applications?userId=:id` - Get user applications
- `POST /api/applications` - Create application
- `PUT /api/applications/:id` - Update application

### **Assessments API**
- `GET /api/assessments?recruiterId=:id` - Get recruiter assessments
- `GET /api/assessments?jobId=:id` - Get job assessments
- `POST /api/assessments` - Create assessment
- `PUT /api/assessments/:id` - Update assessment

### **Candidates API**
- `GET /api/candidates?search=:term&status=:status` - Get candidates
- `POST /api/candidates` - Create candidate
- `PUT /api/candidates/:id` - Update candidate
- `DELETE /api/candidates/:id` - Delete candidate

## 🎯 Migration Pattern for Each Component

### **1. Data Loading Pattern**
```typescript
// OLD
useEffect(() => {
  const data = JSON.parse(localStorage.getItem('key') || '[]')
  setData(data)
}, [])

// NEW
useEffect(() => {
  const loadData = async () => {
    try {
      const response = await apiService.getData()
      setData(response.data)
    } catch (error) {
      console.error('Error loading data:', error)
      setData([])
    }
  }
  loadData()
}, [])
```

### **2. Data Creation Pattern**
```typescript
// OLD
const handleCreate = (newData) => {
  const existing = JSON.parse(localStorage.getItem('key') || '[]')
  existing.push(newData)
  localStorage.setItem('key', JSON.stringify(existing))
  setData(existing)
}

// NEW
const handleCreate = async (newData) => {
  try {
    const response = await apiService.createData(newData)
    setData(prev => [...prev, response.data])
  } catch (error) {
    console.error('Error creating data:', error)
    alert('Failed to create item')
  }
}
```

### **3. Data Update Pattern**
```typescript
// OLD
const handleUpdate = (id, updates) => {
  const existing = JSON.parse(localStorage.getItem('key') || '[]')
  const updated = existing.map(item => 
    item.id === id ? { ...item, ...updates } : item
  )
  localStorage.setItem('key', JSON.stringify(updated))
  setData(updated)
}

// NEW
const handleUpdate = async (id, updates) => {
  try {
    const response = await apiService.updateData(id, updates)
    setData(prev => prev.map(item => 
      item.id === id ? response.data : item
    ))
  } catch (error) {
    console.error('Error updating data:', error)
    alert('Failed to update item')
  }
}
```

### **4. Data Deletion Pattern**
```typescript
// OLD
const handleDelete = (id) => {
  const existing = JSON.parse(localStorage.getItem('key') || '[]')
  const filtered = existing.filter(item => item.id !== id)
  localStorage.setItem('key', JSON.stringify(filtered))
  setData(filtered)
}

// NEW
const handleDelete = async (id) => {
  try {
    await apiService.deleteData(id)
    setData(prev => prev.filter(item => item.id !== id))
  } catch (error) {
    console.error('Error deleting data:', error)
    alert('Failed to delete item')
  }
}
```

## 🧪 Testing MSW Integration

### **1. Start Development Server**
```bash
npm run dev
```

### **2. Check Browser Console**
- Look for "MSW: Mocking enabled" message
- Check Network tab for intercepted requests

### **3. Verify API Calls**
- Open browser DevTools
- Navigate to pages that use API
- Check Network tab shows requests to `/api/*` endpoints

## 🚨 Common Issues & Solutions

### **Issue 1: MSW Not Starting**
**Solution:** Check that `enableMocking()` is called before React render

### **Issue 2: API Calls Not Intercepted**
**Solution:** Verify handlers are properly exported and imported

### **Issue 3: CORS Errors**
**Solution:** MSW should handle this automatically, check handler setup

### **Issue 4: Data Not Persisting**
**Solution:** MSW uses in-memory storage, data resets on page refresh

## 🔄 Next Steps

1. **Migrate remaining components** using the patterns above
2. **Add error handling** to all API calls
3. **Implement loading states** for better UX
4. **Add optimistic updates** where appropriate
5. **Test all functionality** thoroughly

## 📚 Benefits of MSW Migration

- ✅ **Realistic API simulation** - Actual HTTP requests
- ✅ **Better testing** - Can test network conditions
- ✅ **Easier backend integration** - Just change API_BASE_URL
- ✅ **Network debugging** - See actual requests in DevTools
- ✅ **Performance testing** - Simulate slow/failed requests
- ✅ **Production ready** - Easy to switch to real API

## 🎉 Success Criteria

- [ ] All components use API service instead of localStorage
- [ ] MSW intercepts all API requests
- [ ] Data operations work correctly (CRUD)
- [ ] Error handling is implemented
- [ ] Loading states are shown
- [ ] No localStorage dependencies remain (except auth)
