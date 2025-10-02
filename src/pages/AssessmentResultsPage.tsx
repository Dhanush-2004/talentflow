import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import { 
  ArrowLeft, 
  Users, 
  TrendingUp, 
  TrendingDown,
  CheckCircle, 
  XCircle,
  AlertCircle,
  BarChart3,
  Download,
  Filter,
  Calendar,
  Target,
  Award,
  Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { apiService } from '../services/api';

interface AssessmentResult {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  jobId: string;
  jobTitle: string;
  company: string;
  assessmentScore: number;
  assessmentCompleted: boolean;
  appliedAt: string;
  completedAt?: string;
  status: string;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  passingScore: number;
  jobId: string;
  jobTitle: string;
  company: string;
  recruiterId: string;
}

const AssessmentResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('score');

  useEffect(() => {
    const loadResults = async () => {
      if (!id) {
        console.log('No assessment ID provided');
        setLoading(false);
        return;
      }
      
      console.log('Loading assessment results for ID:', id);
      setLoading(true);
      
      // Add timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.log('Loading timeout reached');
        setLoading(false);
        showToast('error', 'Timeout', 'Loading took too long. Please try again.');
      }, 10000); // 10 second timeout
      
      try {
        // Load assessment data
        const assessmentsResponse = await apiService.getAssessments();
        const foundAssessment = assessmentsResponse.data.find((a: any) => a.id === id);
        
        if (!foundAssessment) {
          console.log('Assessment not found');
          showToast('error', 'Assessment Not Found', 'The requested assessment could not be found.');
          navigate('/recruiter/assessments');
          return;
        }

        // Check if user owns this assessment
        if (foundAssessment.recruiterId !== user?.id) {
          showToast('error', 'Access Denied', 'You do not have permission to view these results.');
          navigate('/recruiter/assessments');
          return;
        }

        setAssessment(foundAssessment);

        // Load related applications with assessment results
        const applicationsResponse = await apiService.getApplications();
        
        const assessmentResults = applicationsResponse.data.filter((app: any) => 
          app.jobId === foundAssessment.jobId && app.assessmentCompleted
        );

        setResults(assessmentResults);
        
        // If no results found, show a message but don't treat it as an error
        if (assessmentResults.length === 0) {
          showToast('info', 'No Results', 'No candidates have completed this assessment yet.');
        }

      } catch (error) {
        console.error('Error loading results:', error);
        showToast('error', 'Load Failed', 'Failed to load assessment results.');
        // Set empty states to prevent blank screen
        setAssessment(null);
        setResults([]);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    loadResults();
  }, [id, user?.id, navigate, showToast]);

  const filteredResults = results.filter(result => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'passed') return result.assessmentScore >= (assessment?.passingScore || 70);
    if (filterStatus === 'failed') return result.assessmentScore < (assessment?.passingScore || 70);
    return true;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return b.assessmentScore - a.assessmentScore;
      case 'name':
        return a.userName.localeCompare(b.userName);
      case 'date':
        return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime();
      default:
        return 0;
    }
  });

  const getScoreColor = (score: number, passingScore: number) => {
    if (score >= passingScore) {
      return 'text-green-600 bg-green-100  ';
    }
    return 'text-red-600 bg-red-100  ';
  };

  const getScoreIcon = (score: number, passingScore: number) => {
    if (score >= passingScore) {
      return <CheckCircle className="h-4 w-4" />;
    }
    return <XCircle className="h-4 w-4" />;
  };

  const calculateStats = () => {
    const total = results.length;
    const passed = results.filter(r => r.assessmentScore >= (assessment?.passingScore || 0)).length;
    const averageScore = total > 0 ? results.reduce((sum, r) => sum + r.assessmentScore, 0) / total : 0;
    const highestScore = total > 0 ? Math.max(...results.map(r => r.assessmentScore)) : 0;
    const lowestScore = total > 0 ? Math.min(...results.map(r => r.assessmentScore)) : 0;

    return { total, passed, averageScore, highestScore, lowestScore };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-sm text-gray-500 ">Loading assessment results...</p>
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

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Debug Info - Remove this in production */}
      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-sm font-medium text-yellow-800">Debug Info:</h3>
        <p className="text-xs text-yellow-700">Assessment ID: {id}</p>
        <p className="text-xs text-yellow-700">User ID: {user?.id}</p>
        <p className="text-xs text-yellow-700">Assessment: {assessment ? 'Found' : 'Not Found'}</p>
        <p className="text-xs text-yellow-700">Results Count: {results.length}</p>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Link to="/recruiter/assessments">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assessments
            </Button>
          </Link>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </Button>
            <Link to={`/recruiter/assessments/${assessment.id}`}>
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Assessment
              </Button>
            </Link>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900  mb-2">
            Assessment Results
          </h1>
          <p className="text-gray-600  mb-4">
            {assessment.title} • {assessment.jobTitle} at {assessment.company}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 ">
              Passing Score: <span className="font-medium">{assessment.passingScore || 70}%</span>
            </span>
            <span className="text-sm text-gray-500 ">
              Total Completions: <span className="font-medium">{stats.total}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white  rounded-lg shadow-sm border border-gray-200  p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 ">Total Completions</p>
              <p className="text-2xl font-semibold text-gray-900 ">
                {stats.total}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white  rounded-lg shadow-sm border border-gray-200  p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 ">Passed</p>
              <p className="text-2xl font-semibold text-gray-900 ">
                {stats.passed}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white  rounded-lg shadow-sm border border-gray-200  p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 ">Average Score</p>
              <p className="text-2xl font-semibold text-gray-900 ">
                {stats.averageScore.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white  rounded-lg shadow-sm border border-gray-200  p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Award className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 ">Highest Score</p>
              <p className="text-2xl font-semibold text-gray-900 ">
                {stats.highestScore}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white  rounded-lg shadow-sm border border-gray-200  p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700  mb-2">
              Filter Results
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300  rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent  "
            >
              <option value="all">All Results</option>
              <option value="passed">Passed ({stats.passed})</option>
              <option value="failed">Failed ({stats.total - stats.passed})</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700  mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300  rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent  "
            >
              <option value="score">Score (High to Low)</option>
              <option value="name">Name (A to Z)</option>
              <option value="date">Date (Newest First)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white  rounded-lg shadow-sm border border-gray-200 ">
        <div className="px-6 py-4 border-b border-gray-200 ">
          <h2 className="text-lg font-semibold text-gray-900 ">
            Candidate Results ({sortedResults.length})
          </h2>
        </div>
        
        {sortedResults.length === 0 ? (
          <div className="p-12 text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 ">No results found</h3>
            <p className="mt-1 text-sm text-gray-500 ">
              {filterStatus === 'all' 
                ? 'No candidates have completed this assessment yet.'
                : `No candidates ${filterStatus} the assessment.`
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 ">
              <thead className="bg-gray-50 ">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">
                    Completed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">
                    Application Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white  divide-y divide-gray-200 ">
                {sortedResults.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50 :bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 ">
                          {result.userName}
                        </div>
                        <div className="text-sm text-gray-500 ">
                          {result.userEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(result.assessmentScore, assessment.passingScore || 70)}`}>
                          {getScoreIcon(result.assessmentScore, assessment.passingScore || 70)}
                          <span className="ml-1">{result.assessmentScore}%</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        result.assessmentScore >= (assessment.passingScore || 70)
                          ? 'bg-green-100 text-green-800  '
                          : 'bg-red-100 text-red-800  '
                      }`}>
                        {result.assessmentScore >= (assessment.passingScore || 70) ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(result.appliedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800  ">
                        {result.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentResultsPage;
