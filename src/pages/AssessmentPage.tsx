import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { 
  ArrowLeft, Clock, CheckCircle, Play, FileText, AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { apiService } from '../services/api';

// Interfaces should be in a shared types file
interface Question {
    id: string;
    type: 'multiple-choice' | 'text' | 'rating' | 'integer';
    question: string;
    options?: string[];
    correctAnswer?: number;
    points: number;
    timeLimit?: number;
}

interface Assessment {
    id: string;
    title: string;
    description: string;
    type: string;
    duration: number; // in minutes
    questions: Question[];
    passingScore: number;
    jobId: string;
    jobTitle: string;
    company: string;
    recruiterId: string;
    status: 'draft' | 'active';
}

const AssessmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const loadAssessment = () => {
      setLoading(true);
      
      setTimeout(() => {
        try {
          // Load assessment from localStorage
          const allAssessments = JSON.parse(localStorage.getItem('msw_assessments') || '[]');
          const foundAssessment = allAssessments.find((ass: any) => ass.id === id);
          
          if (foundAssessment) {
            setAssessment(foundAssessment);
            setTimeRemaining(foundAssessment.duration * 60);
          } else {
            console.error('Assessment not found');
            navigate('/employee/assessments');
          }
        } catch (error) {
          console.error('Error loading assessment:', error);
          navigate('/employee/assessments');
        } finally {
          setLoading(false);
        }
      }, 800);
    };

    if (id) {
      loadAssessment();
    }
  }, [id, navigate]);

  useEffect(() => {
    let timer: any;
    
    if (isStarted && timeRemaining > 0 && !isCompleted) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitAssessment();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(timer);
  }, [isStarted, timeRemaining, isCompleted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < (assessment?.questions.length || 0) - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmitAssessment = async () => {
    if (!assessment) return;

    // Calculate score
    let totalScore = 0;
    let maxScore = 0;
    
    assessment.questions.forEach(question => {
      maxScore += question.points;
      
      if (question.type === 'multiple-choice' && answers[question.id] !== undefined) {
        if (answers[question.id] === question.correctAnswer) {
          totalScore += question.points;
        }
      } else if (question.type === 'text' || question.type === 'rating') {
        // For text and rating questions, give partial credit based on completion
        if (answers[question.id] && answers[question.id].toString().trim() !== '') {
          totalScore += question.points * 0.8; // 80% credit for completing
        }
      }
    });

    const finalScore = Math.round((totalScore / maxScore) * 100);
    const passed = finalScore >= assessment.passingScore;
    
    setScore(finalScore);
    setIsCompleted(true);

    // Update application via API
    try {
      const applicationsResponse = await apiService.getApplications();
      const applications = applicationsResponse.data;
      const userApplication = applications.find((app: any) => 
        app.userId === user?.id && app.jobId === assessment.jobId
      );
      
      if (userApplication) {
        await apiService.updateApplication(userApplication.id, {
          assessmentCompleted: true,
          assessmentScore: finalScore,
          status: passed ? 'Assessment Completed' : 'Assessment Failed'
        });
      }
    } catch (error) {
      console.error('Failed to update application:', error);
    }

    // Show result message
    setTimeout(() => {
      const resultMessage = passed 
        ? `Congratulations! You passed the assessment with a score of ${finalScore}%.`
        : `Assessment completed with a score of ${finalScore}%. You need ${assessment.passingScore}% to pass.`;
      showToast(passed ? 'success' : 'warning', passed ? 'Assessment Passed' : 'Assessment Failed', resultMessage);
    }, 1000);
  };

  const handleStart = () => {
    setIsStarted(true);
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
        <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 ">Assessment not found</h3>
        <p className="mt-1 text-sm text-gray-500 ">
          The assessment you're looking for doesn't exist or has been removed.
        </p>
        <div className="mt-6">
          <Link to="/employee/assessments">
            <Button>Back to Assessments</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/employee/assessments" className="inline-flex items-center text-blue-600 hover:text-blue-500">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assessments
          </Link>
                </div>

        <div className="bg-white  rounded-lg shadow-sm border border-gray-200  p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900  mb-4">
              {assessment.title}
            </h1>
            <p className="text-lg text-gray-600  mb-8">
              {assessment.description}
            </p>
            
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50  rounded-lg p-4">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 ">Duration</h3>
                <p className="text-gray-600 ">{assessment.duration} minutes</p>
              </div>
              <div className="bg-green-50  rounded-lg p-4">
                <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 ">Questions</h3>
                <p className="text-gray-600 ">{assessment.questions.length} questions</p>
                </div>
              <div className="bg-purple-50  rounded-lg p-4">
                <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 ">Passing Score</h3>
                <p className="text-gray-600 ">{assessment.passingScore}%</p>
              </div>
            </div>

            <div className="bg-yellow-50  border border-yellow-200  rounded-lg p-4 mb-8">
              <h3 className="font-semibold text-yellow-800  mb-2">Instructions:</h3>
              <ul className="text-left text-yellow-700  space-y-1">
                <li>• You have {assessment.duration} minutes to complete this assessment</li>
                <li>• Answer all questions to the best of your ability</li>
                <li>• You can navigate between questions using the Previous/Next buttons</li>
                <li>• Once you submit, you cannot retake the assessment</li>
                <li>• Make sure you have a stable internet connection</li>
              </ul>
            </div>

            <Button onClick={handleStart} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
              <Play className="h-5 w-5 mr-2" />
              Start Assessment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white  rounded-lg shadow-sm border border-gray-200  p-8">
                <div className="text-center">
            <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 ${
              score && score >= assessment.passingScore 
                ? 'bg-green-100 ' 
                : 'bg-red-100 '
            }`}>
              {score && score >= assessment.passingScore ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <AlertCircle className="h-8 w-8 text-red-600" />
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900  mb-4">
              Assessment Completed!
            </h1>
            
            <div className="text-6xl font-bold mb-4">
              <span className={score && score >= assessment.passingScore ? 'text-green-600' : 'text-red-600'}>
                {score}%
              </span>
            </div>
            
            <p className="text-lg text-gray-600  mb-8">
              {score && score >= assessment.passingScore 
                ? `Congratulations! You passed the assessment.`
                : `You need ${assessment.passingScore}% to pass. Better luck next time!`
              }
            </p>

            <div className="space-y-4">
              <Link to="/employee/assessments">
                <Button variant="outline" className="mr-4">
                  Back to Assessments
                </Button>
              </Link>
              <Link to="/employee/applications">
                <Button>
                  View Applications
                </Button>
              </Link>
            </div>
                </div>
            </div>
        </div>
    );
  }

  const currentQ = assessment.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / assessment.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white  rounded-lg shadow-sm border border-gray-200  p-4 mb-6">
        <div className="flex items-center justify-between">
            <div>
            <h1 className="text-xl font-semibold text-gray-900 ">
              {assessment.title}
            </h1>
            <p className="text-sm text-gray-600 ">
              Question {currentQuestion + 1} of {assessment.questions.length}
            </p>
            </div>
            <div className="flex items-center space-x-4">
            <div className="flex items-center text-red-600">
                <Clock className="h-5 w-5 mr-2" />
              <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="bg-gray-200  rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
              </div>

      {/* Question */}
      <div className="bg-white  rounded-lg shadow-sm border border-gray-200  p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900  mb-4">
            {currentQ.question}
          </h2>
          <div className="text-sm text-gray-500 ">
            Points: {currentQ.points} | Type: {currentQ.type}
            </div>
        </div>

        <div className="space-y-4">
          {currentQ.type === 'multiple-choice' && currentQ.options && (
                    <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <label key={index} className="flex items-center p-3 border border-gray-200  rounded-lg hover:bg-gray-50 :bg-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${currentQ.id}`}
                    value={index}
                    checked={answers[currentQ.id] === index}
                    onChange={() => handleAnswerChange(currentQ.id, index)}
                    className="mr-3"
                  />
                  <span className="text-gray-900 ">{option}</span>
                            </label>
                        ))}
                    </div>
                )}

                {currentQ.type === 'text' && (
            <textarea
              value={answers[currentQ.id] || ''}
              onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
              placeholder="Enter your answer here..."
              rows={6}
              className="w-full p-3 border border-gray-300  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  "
            />
          )}

          {currentQ.type === 'rating' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 ">Rate from 1 to 5:</p>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleAnswerChange(currentQ.id, rating)}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-semibold ${
                      answers[currentQ.id] === rating
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300  text-gray-700  hover:border-blue-300'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentQ.type === 'integer' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 ">Enter a number:</p>
              <input
                type="number"
                value={answers[currentQ.id] || ''}
                onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                placeholder="Enter your answer..."
                className="w-full p-3 border border-gray-300  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  "
              />
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white  rounded-lg shadow-sm border border-gray-200  p-4">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          
          <div className="flex space-x-2">
                {currentQuestion === assessment.questions.length - 1 ? (
              <Button onClick={handleSubmitAssessment} className="bg-green-600 hover:bg-green-700">
                Submit Assessment
              </Button>
                ) : (
              <Button onClick={handleNext}>
                Next
              </Button>
                )}
          </div>
            </div>
        </div>
    </div>
  );
};

export default AssessmentPage;
