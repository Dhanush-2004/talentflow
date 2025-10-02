import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRedirect from './components/RoleBasedRedirect';

// Page Imports
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Recruiter Portal Imports
import RecruiterPortal from './pages/RecruiterPortal';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CreateJobPage from './pages/CreateJobPage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import CandidatesPage from './pages/CandidatesPage';
import CandidateDetailPage from './pages/CandidateDetailPage';
import AssessmentsPage from './pages/AssessmentsPage';
import AssessmentPage from './pages/AssessmentPage';
import AssessmentDetailPage from './pages/AssessmentDetailPage';
import AssessmentResultsPage from './pages/AssessmentResultsPage';
import CreateAssessmentPage from './pages/CreateAssessmentPage';
import RecruiterProfilePage from './pages/RecruiterProfilePage';

// Other Imports
import CandidatePortal from './pages/CandidatePortal';
import JobSearchPage from './pages/JobSearchPage';
import EmployeeProfilePage from './pages/EmployeeProfilePage';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeApplicationsPage from './pages/EmployeeApplicationsPage';
import EmployeeAssessmentsPage from './pages/EmployeeAssessmentsPage';
import { Navigate } from 'react-router-dom';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen bg-orange-50">
            <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* --- Role-based Redirect --- */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <RoleBasedRedirect />
                </ProtectedRoute>
              }
            />

            {/* --- Recruiter Portal (Nested Routes) --- */}
            <Route
              path="/recruiter"
              element={
                <ProtectedRoute>
                  <RecruiterPortal />
                </ProtectedRoute>
              }
            >
              <Route index element={<RecruiterDashboard />} />
              <Route path="dashboard" element={<RecruiterDashboard />} />
              <Route path="jobs" element={<JobsPage />} />
              <Route path="jobs/create" element={<CreateJobPage />} />
              <Route path="jobs/:id" element={<JobDetailPage />} />
              <Route path="candidates" element={<CandidatesPage />} />
              <Route path="candidates/:id" element={<CandidateDetailPage />} />
              <Route path="assessments" element={<AssessmentsPage />} />
              <Route path="assessments/create" element={<CreateAssessmentPage />} />
              <Route path="assessments/:id" element={<AssessmentDetailPage />} />
              <Route path="assessments/:id/results" element={<AssessmentResultsPage />} />
              <Route path="profile" element={<RecruiterProfilePage />} />
            </Route>

            {/* Redirect legacy candidate paths */}
            <Route path="/candidate/*" element={<Navigate to="/employee/dashboard" replace />} />

            {/* --- Employee Portal (Nested Routes) --- */}
            <Route
              path="/employee"
              element={
                <ProtectedRoute>
                  <CandidatePortal />
                </ProtectedRoute>
              }
            >
              <Route index element={<EmployeeDashboard />} />
              <Route path="dashboard" element={<EmployeeDashboard />} />
              <Route path="jobs" element={<JobSearchPage />} />
              <Route path="applications" element={<EmployeeApplicationsPage />} />
              <Route path="assessments" element={<EmployeeAssessmentsPage />} />
              <Route path="assessment/:id" element={<AssessmentPage />} />
              <Route path="profile" element={<EmployeeProfilePage />} />
            </Route>
            
            </Routes>
          </div>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

