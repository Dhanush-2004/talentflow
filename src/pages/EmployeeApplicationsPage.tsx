import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { Calendar, CheckCircle, Clock, XCircle, ArrowLeft, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { apiService } from '../services/api';

interface Application {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedAt: string;
  status: 'Applied' | 'Under Review' | 'Interview Scheduled' | 'Assessment Required' | 'Assessment Completed' | 'Rejected' | 'Hired';
  assessmentCompleted: boolean;
  assessmentScore: number | null;
  notes: string;
}

const EmployeeApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const loadApplications = async () => {
      setLoading(true);
      
      try {
        // Load applications from API
        const response = await apiService.getApplications(user?.id);
        
        // Ensure we always set an array
        const apps = Array.isArray(response.data) ? response.data : [];
        setApplications(apps);
      } catch (error) {
        console.error('Error loading applications:', error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadApplications();
    }
  }, [user?.id]);

  const getStatusColor = (status: string) => {
    const colors = {
      'Applied': 'bg-gray-100 text-gray-800',
      'Under Review': 'bg-blue-100 text-blue-800',
      'Interview Scheduled': 'bg-yellow-100 text-yellow-800',
      'Assessment Required': 'bg-purple-100 text-purple-800',
      'Assessment Completed': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Hired': 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleTakeAssessment = async (application: Application) => {
    if (!application.assessmentCompleted) {
      try {
        // Simulate taking assessment
        const score = Math.floor(Math.random() * 40) + 60; // Random score between 60-100
        
        // Update application via API
        const updates = {
          assessmentCompleted: true,
          assessmentScore: score,
          status: 'Assessment Completed' as Application['status']
        };
        
        await apiService.updateApplication(application.id, updates);
        
        // Update local state
        setApplications(prevApps => 
          prevApps.map(app => 
            app.id === application.id 
              ? { ...app, ...updates }
              : app
          )
        );
        
        showToast('success', 'Assessment Completed', `Assessment completed! Your score: ${score}%`);
      } catch (error) {
        console.error('Error updating assessment:', error);
        showToast('error', 'Update Failed', 'Failed to update assessment. Please try again.');
      }
    } else {
      showToast('info', 'Already Completed', `You already completed the assessment. Your score: ${application.assessmentScore}%`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Hired': return <CheckCircle className="h-4 w-4" />;
      case 'Interview Scheduled': return <Calendar className="h-4 w-4" />;
      case 'Assessment Required': 
      case 'Assessment Completed': return <FileText className="h-4 w-4" />;
      case 'Under Review': return <Clock className="h-4 w-4" />;
      case 'Applied': return <Clock className="h-4 w-4" />;
      case 'Rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Applied': return 'Application Submitted';
      case 'Under Review': return 'Under Review';
      case 'Interview Scheduled': return 'Interview Scheduled';
      case 'Assessment Required': return 'Assessment Required';
      case 'Assessment Completed': return 'Assessment Completed';
      case 'Hired': return 'Offer Accepted';
      case 'Rejected': return 'Not Selected';
      default: return status;
    }
  };

  const getStats = () => {
    // Ensure applications is always an array
    const apps = Array.isArray(applications) ? applications : [];
    
    const total = apps.length;
    const pending = apps.filter(app => app.status === 'Applied' || app.status === 'Under Review').length;
    const interviews = apps.filter(app => app.status === 'Interview Scheduled').length;
    const assessments = apps.filter(app => app.status === 'Assessment Required' || app.status === 'Assessment Completed').length;
    const hired = apps.filter(app => app.status === 'Hired').length;
    const rejected = apps.filter(app => app.status === 'Rejected').length;

    return { total, pending, interviews, assessments, hired, rejected };
  };

  const stats = getStats();

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link to="/employee">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Applications</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Track the status of your job applications.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-semibold">{stats.total}</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Interviews</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.interviews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Assessments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.assessments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Hired</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.hired}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading applications...</p>
          </div>
        ) : !Array.isArray(applications) || applications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Applications Yet</h3>
            <p className="text-gray-500 mb-4">Start applying to jobs to see your applications here.</p>
            <Link to="/employee/jobs">
              <Button>Browse Jobs</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {Array.isArray(applications) && applications.map((application) => (
              <div key={application.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {application.jobTitle}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        {getStatusText(application.status)}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">{application.company}</p>
                    <p className="text-sm text-gray-500">
                      Applied on {new Date(application.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {(application.status === 'Assessment Required' || application.status === 'Assessment Completed') && (
                      <Button 
                        variant={application.assessmentCompleted ? "outline" : "primary"}
                        size="sm"
                        onClick={() => handleTakeAssessment(application)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        {application.assessmentCompleted ? `Score: ${application.assessmentScore}%` : 'Take Assessment'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {Array.isArray(applications) && applications.length > 0 && (
        <div className="mt-6 text-center">
          <Link to="/employee/jobs">
            <Button variant="outline">
              Browse More Jobs
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default EmployeeApplicationsPage;
