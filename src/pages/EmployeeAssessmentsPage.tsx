import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { Calendar, CheckCircle, Clock, XCircle, ArrowLeft, Play, FileText, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

interface Assessment {
  id: string;
  title: string;
  company: string;
  jobTitle: string;
  jobId: string;
  assignedAt: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'expired';
  timeLimit: number; // in minutes
  questions: number;
  score?: number;
  maxScore?: number;
  duration: number;
  description: string;
  passingScore: number;
}

const EmployeeAssessmentsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssessments = async () => {
      setLoading(true);
      
      try {
        // Load user applications to see which jobs they applied for
        const applicationsResponse = await apiService.getApplications(user?.id);
        const userApplications = applicationsResponse.data;
        
        // Load all assessments created by recruiters
        const assessmentsResponse = await apiService.getAssessments();
        const allAssessments = assessmentsResponse.data;
        
        // Filter assessments for jobs the user applied for and are published
        const relevantAssessments = allAssessments.filter((assessment: any) => {
          const isActive = assessment.status === 'active';
          const hasApplied = userApplications.some((app: any) => app.jobId === assessment.jobId);
          
          return isActive && hasApplied;
        });
        
        // Map to the expected format and check completion status
        const mappedAssessments: Assessment[] = relevantAssessments.map((assessment: any) => {
          const userApp = userApplications.find((app: any) => app.jobId === assessment.jobId);
          const isCompleted = userApp?.assessmentCompleted || false;
          const score = userApp?.assessmentScore || null;
          
          return {
            id: assessment.id,
            title: assessment.title,
            company: assessment.company,
            jobTitle: assessment.jobTitle,
            jobId: assessment.jobId,
            assignedAt: userApp?.appliedAt || assessment.createdAt,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
            status: isCompleted ? 'completed' : 'pending',
            timeLimit: assessment.duration,
            questions: assessment.questions.length,
            score: score,
            maxScore: assessment.questions.reduce((sum: number, q: any) => sum + q.points, 0),
            duration: assessment.duration,
            description: assessment.description,
            passingScore: assessment.passingScore
          };
        });
        
        setAssessments(mappedAssessments);
      } catch (error) {
        console.error('Error loading assessments:', error);
        setAssessments([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadAssessments();
    }
  }, [user?.id]);

  const handleTakeAssessment = (assessment: Assessment) => {
    if (assessment.status === 'completed') {
      alert(`You have already completed this assessment. Your score: ${assessment.score}%`);
      return;
    }

    // Navigate to the assessment page
    navigate(`/employee/assessment/${assessment.id}`);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Play className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'expired': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Not Started';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'expired': return 'Expired';
      default: return status;
    }
  };

  const getStats = () => {
    const total = assessments.length;
    const pending = assessments.filter(assessment => assessment.status === 'pending').length;
    const inProgress = assessments.filter(assessment => assessment.status === 'in_progress').length;
    const completed = assessments.filter(assessment => assessment.status === 'completed').length;
    const expired = assessments.filter(assessment => assessment.status === 'expired').length;

    return { total, pending, inProgress, completed, expired };
  };

  const stats = getStats();


  const isExpired = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

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
        <h1 className="text-3xl font-bold text-gray-900 ">My Assessments</h1>
        <p className="text-gray-600  mt-2">Complete your assigned assessments to showcase your skills.</p>
        
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white  rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 ">Total Assessments</p>
              <p className="text-2xl font-bold text-gray-900 ">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white  rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 ">Pending</p>
              <p className="text-2xl font-bold text-gray-900 ">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white  rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 ">Completed</p>
              <p className="text-2xl font-bold text-gray-900 ">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white  rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 ">Avg Score</p>
              <p className="text-2xl font-bold text-gray-900 ">
                {stats.completed > 0 ? Math.round(assessments.filter(a => a.score).reduce((acc, a) => acc + (a.score || 0), 0) / stats.completed) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Assessments List */}
      <div className="bg-white  rounded-xl shadow-sm border border-gray-200 ">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading assessments...</p>
          </div>
        ) : assessments.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900  mb-2">No Assessments Yet</h3>
            <p className="text-gray-500 mb-4">You'll receive assessments from recruiters after applying to jobs.</p>
            <Link to="/employee/jobs">
              <Button>Browse Jobs</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 ">
            {assessments.map((assessment) => (
              <div key={assessment.id} className="p-6 hover:bg-gray-50 :bg-gray-700/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 ">
                        {assessment.title}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assessment.status)}`}>
                        {getStatusIcon(assessment.status)}
                        {getStatusText(assessment.status)}
                      </span>
                    </div>
                    <div className="text-gray-600  mb-2">
                      <p className="font-medium">{assessment.company}</p>
                      <p className="text-sm">{assessment.jobTitle}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                      <span>{assessment.questions} questions</span>
                      <span>{assessment.timeLimit} minutes</span>
                      <span>Due: {new Date(assessment.dueDate).toLocaleDateString()}</span>
                    </div>
                    {assessment.score && (
                      <div className="text-sm">
                        <span className="text-green-600 font-medium">Score: {assessment.score}%</span>
                      </div>
                    )}
                    {isExpired(assessment.dueDate) && assessment.status !== 'completed' && (
                      <div className="text-sm text-red-600 font-medium mt-1">
                        This assessment has expired
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {assessment.status === 'pending' && !isExpired(assessment.dueDate) && (
                      <Button onClick={() => handleTakeAssessment(assessment)} className="bg-blue-600 hover:bg-blue-700">
                        <Play className="h-4 w-4 mr-2" />
                        Take Assessment
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {assessments.length > 0 && (
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

export default EmployeeAssessmentsPage;
