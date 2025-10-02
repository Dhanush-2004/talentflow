import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import { 
  ArrowLeft, 
  FileText, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Calendar,
  Target
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { apiService } from '../services/api';

interface Question {
  id: string;
  type: 'multiple-choice' | 'text' | 'rating';
  question: string;
  options?: string[];
  correctAnswer?: number;
  points: number;
  timeLimit: number;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  type: string;
  duration: number;
  questions: Question[];
  passingScore: number;
  jobId: string;
  jobTitle: string;
  company: string;
  recruiterId: string;
  status: 'draft' | 'active';
  createdAt: string;
}

const AssessmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    const loadAssessment = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Load assessment data
        const assessmentsResponse = await apiService.getAssessments();
        const foundAssessment = assessmentsResponse.data.find((a: any) => a.id === id);
        
        if (!foundAssessment) {
          showToast('error', 'Assessment Not Found', 'The requested assessment could not be found.');
          navigate('/recruiter/assessments');
          return;
        }

        // Check if user owns this assessment
        if (foundAssessment.recruiterId !== user?.id) {
          showToast('error', 'Access Denied', 'You do not have permission to view this assessment.');
          navigate('/recruiter/assessments');
          return;
        }

        setAssessment(foundAssessment);

        // Load related applications
        const applicationsResponse = await apiService.getApplications();
        const relatedApplications = applicationsResponse.data.filter((app: any) => 
          app.jobId === foundAssessment.jobId
        );
        setApplications(relatedApplications);

      } catch (error) {
        console.error('Error loading assessment:', error);
        showToast('error', 'Load Failed', 'Failed to load assessment details.');
      } finally {
        setLoading(false);
      }
    };

    loadAssessment();
  }, [id, user?.id, navigate, showToast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800  ';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800  ';
      default:
        return 'bg-gray-100 text-gray-800  ';
    }
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'multiple-choice':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'text':
        return <FileText className="h-4 w-4 text-green-600" />;
      case 'rating':
        return <Target className="h-4 w-4 text-purple-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'multiple-choice':
        return 'Multiple Choice';
      case 'text':
        return 'Text Response';
      case 'rating':
        return 'Rating Scale';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 ">Assessment not found</h3>
        <p className="mt-1 text-sm text-gray-500 ">
          The assessment you're looking for doesn't exist or has been removed.
        </p>
        <div className="mt-6">
          <Link to="/recruiter/assessments">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assessments
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const completedApplications = applications.filter(app => app.assessmentCompleted);
  const totalPoints = assessment.questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Link to="/recruiter/assessments">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assessments
            </Button>
          </Link>
          
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900  mb-2">
              {assessment.title}
            </h1>
            <p className="text-gray-600  mb-4">
              {assessment.description}
            </p>
            <div className="flex items-center gap-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assessment.status)}`}>
                {assessment.status}
              </span>
              <span className="text-sm text-gray-500 ">
                For: {assessment.jobTitle} at {assessment.company}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white  rounded-lg shadow-sm border border-gray-200  p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 ">Questions</p>
              <p className="text-2xl font-semibold text-gray-900 ">
                {assessment.questions.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white  rounded-lg shadow-sm border border-gray-200  p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 ">Duration</p>
              <p className="text-2xl font-semibold text-gray-900 ">
                {assessment.duration} min
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white  rounded-lg shadow-sm border border-gray-200  p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 ">Completions</p>
              <p className="text-2xl font-semibold text-gray-900 ">
                {completedApplications.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white  rounded-lg shadow-sm border border-gray-200  p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 ">Passing Score</p>
              <p className="text-2xl font-semibold text-gray-900 ">
                {assessment.passingScore}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <div className="bg-white  rounded-lg shadow-sm border border-gray-200  mb-8">
        <div className="px-6 py-4 border-b border-gray-200 ">
          <h2 className="text-lg font-semibold text-gray-900 ">Assessment Questions</h2>
          <p className="text-sm text-gray-500  mt-1">
            Total Points: {totalPoints} | Average Time per Question: {Math.round(assessment.duration / assessment.questions.length)} min
          </p>
        </div>
        
        <div className="p-6">
          {assessment.questions.map((question, index) => (
            <div key={question.id} className="border border-gray-200  rounded-lg p-4 mb-4 last:mb-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getQuestionTypeIcon(question.type)}
                  <span className="text-sm font-medium text-gray-500 ">
                    Question {index + 1} • {getQuestionTypeLabel(question.type)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 ">
                  <span>{question.points} pts</span>
                  <span>•</span>
                  <span>{question.timeLimit}s</span>
                </div>
              </div>
              
              <p className="text-gray-900  mb-3 font-medium">
                {question.question}
              </p>
              
              {question.type === 'multiple-choice' && question.options && (
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div 
                      key={optionIndex}
                      className={`flex items-center p-2 rounded ${
                        optionIndex === question.correctAnswer 
                          ? 'bg-green-50 border border-green-200  ' 
                          : 'bg-gray-50 border border-gray-200  '
                      }`}
                    >
                      <span className="text-sm font-medium text-gray-500  mr-3">
                        {String.fromCharCode(65 + optionIndex)}
                      </span>
                      <span className="text-gray-900  flex-1">{option}</span>
                      {optionIndex === question.correctAnswer && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {question.type === 'text' && (
                <div className="bg-gray-50  rounded p-3">
                  <p className="text-sm text-gray-500 ">Text response required</p>
                </div>
              )}
              
              {question.type === 'rating' && (
                <div className="bg-gray-50  rounded p-3">
                  <p className="text-sm text-gray-500 ">Rating scale (1-5)</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Completions */}
      {completedApplications.length > 0 && (
        <div className="bg-white  rounded-lg shadow-sm border border-gray-200 ">
          <div className="px-6 py-4 border-b border-gray-200 ">
            <h2 className="text-lg font-semibold text-gray-900 ">Recent Completions</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {completedApplications.slice(0, 5).map((application) => (
                <div key={application.id} className="flex items-center justify-between p-4 bg-gray-50  rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 ">
                      {application.userName}
                    </p>
                    <p className="text-sm text-gray-500 ">
                      {application.userEmail}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 ">
                      {application.assessmentScore}%
                    </p>
                    <p className="text-sm text-gray-500 ">
                      <Calendar className="h-3 w-3 inline mr-1" />
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentDetailPage;
