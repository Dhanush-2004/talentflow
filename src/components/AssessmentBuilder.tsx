import React, { useState, useEffect } from 'react';
import Button from './Button';
import { Plus, Trash2, Save, Eye, Briefcase } from 'lucide-react';
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
  id?: string;
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
  createdAt?: string;
  status: 'draft' | 'active';
}

const AssessmentBuilder: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [availableJobs, setAvailableJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const [assessment, setAssessment] = useState<Assessment>({
    title: '',
    description: '',
    type: 'technical',
    duration: 60,
    questions: [],
    passingScore: 70,
    jobId: '',
    jobTitle: '',
    company: '',
    recruiterId: user?.id || '',
    status: 'draft'
  });

  // Load available jobs for the recruiter and update recruiterId
  useEffect(() => {
    const loadJobs = async () => {
      try {
        // Load jobs from API and filter by recruiterId
        const response = await apiService.getJobs();
        const recruiterJobs = response.data.filter((job: any) => 
          job.recruiterId === user?.id
        );
        setAvailableJobs(recruiterJobs);
        
        // Update recruiterId in assessment state
        setAssessment(prev => ({
          ...prev,
          recruiterId: user?.id || ''
        }));
      } catch (error) {
        console.error('Error loading jobs:', error);
        setAvailableJobs([]);
      }
    };

    if (user?.id) {
      loadJobs();
    }
  }, [user?.id]);

  const handleJobSelection = (job: any) => {
    setSelectedJob(job);
    setAssessment(prev => ({
      ...prev,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      title: `${job.title} Assessment`,
      description: `Technical assessment for ${job.title} position at ${job.company}`
    }));
  };

  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: '',
    type: 'multiple-choice',
    question: '',
    options: [''],
    correctAnswer: 0,
    points: 5,
    timeLimit: 120
  });

  const addQuestion = () => {
    if (!currentQuestion.question.trim()) {
      showToast('warning', 'Question Required', 'Please enter a question before adding it to the assessment.');
      return;
    }

    // Validate multiple-choice questions have a correct answer selected
    if (currentQuestion.type === 'multiple-choice') {
      if (currentQuestion.correctAnswer === undefined || currentQuestion.correctAnswer === null) {
        showToast('warning', 'Correct Answer Required', 'Please select the correct answer for this multiple-choice question.');
        return;
      }
      
      // Validate that all options are filled
      const hasEmptyOptions = currentQuestion.options?.some(option => !option.trim());
      if (hasEmptyOptions) {
        showToast('warning', 'Options Required', 'Please fill in all options before adding the question.');
        return;
      }
    }

    const newQuestion: Question = {
      ...currentQuestion,
      id: Date.now().toString()
    };

    setAssessment(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));

    // Reset form
    setCurrentQuestion({
      id: '',
      type: 'multiple-choice',
      question: '',
      options: [''],
      correctAnswer: 0,
      points: 5,
      timeLimit: 120
    });
  };

  const removeQuestion = (questionId: string) => {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const updateQuestionOption = (index: number, value: string) => {
    const newOptions = [...(currentQuestion.options || [])];
    newOptions[index] = value;
    setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: [...(prev.options || []), '']
    }));
  };

  const removeOption = (index: number) => {
    if ((currentQuestion.options?.length || 0) <= 1) return;
    const newOptions = (currentQuestion.options || []).filter((_, i) => i !== index);
    setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
  };

  const saveAssessment = async (status: 'draft' | 'active' = 'draft') => {
    try {
      // Validate required fields
      if (!assessment.title.trim()) {
        showToast('warning', 'Title Required', 'Please enter an assessment title');
        return;
      }
      if (!assessment.jobId) {
        showToast('warning', 'Job Required', 'Please select a job for this assessment');
        return;
      }
      if (assessment.questions.length === 0) {
        showToast('warning', 'Questions Required', 'Please add at least one question');
        return;
      }

      // Validate that all multiple-choice questions have correct answers
      const multipleChoiceQuestions = assessment.questions.filter(q => q.type === 'multiple-choice');
      const questionsWithoutCorrectAnswers = multipleChoiceQuestions.filter(q => 
        q.correctAnswer === undefined || q.correctAnswer === null
      );
      
      if (questionsWithoutCorrectAnswers.length > 0) {
        showToast('warning', 'Correct Answers Required', `Please select correct answers for all multiple-choice questions. ${questionsWithoutCorrectAnswers.length} question(s) are missing correct answers.`);
        return;
      }

      // Prepare assessment data for API
      const assessmentData = {
        ...assessment,
        status
      };


      // Save via API
      await apiService.createAssessment(assessmentData);

      showToast('success', 'Assessment Saved', `Assessment ${status === 'active' ? 'published' : 'saved as draft'} successfully!`);
      
      // Reset form if published
      if (status === 'active') {
        setAssessment({
          title: '',
          description: '',
          type: 'technical',
          duration: 60,
          questions: [],
          passingScore: 70,
          jobId: '',
          jobTitle: '',
          company: '',
          recruiterId: user?.id || '',
          status: 'draft'
        });
        setSelectedJob(null);
        setCurrentQuestion({
          id: '',
          type: 'multiple-choice',
          question: '',
          options: [''],
          correctAnswer: 0,
          points: 5,
          timeLimit: 120
        });
      }
    } catch (error) {
      console.error('Error saving assessment:', error);
      showToast('error', 'Save Failed', 'Failed to save assessment');
    }
  };

  const previewAssessment = () => {
    // In a real app, you'd navigate to a preview page
    console.log('Assessment Preview:', assessment);
    showToast('info', 'Preview', 'Preview functionality - check console for assessment data');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Assessment Builder</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Create custom assessments for candidates.</p>
      </div>

      {/* Job Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Select Job</h2>
        {availableJobs.length === 0 ? (
          <div className="text-center py-8">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No jobs available. Create a job first to create assessments.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => handleJobSelection(job)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedJob?.id === job.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                }`}
              >
                <h3 className="font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{job.company}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">{job.location}</p>
                <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                  job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        )}
        {selectedJob && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Selected: <strong>{selectedJob.title}</strong> at {selectedJob.company}
            </p>
          </div>
        )}
      </div>

      {/* Assessment Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Assessment Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={assessment.title}
              onChange={(e) => setAssessment(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Assessment title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type
            </label>
            <select
              value={assessment.type}
              onChange={(e) => setAssessment(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="technical">Technical</option>
              <option value="behavioral">Behavioral</option>
              <option value="cognitive">Cognitive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={assessment.duration}
              onChange={(e) => setAssessment(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Passing Score (%)
            </label>
            <input
              type="number"
              value={assessment.passingScore}
              onChange={(e) => setAssessment(prev => ({ ...prev, passingScore: parseInt(e.target.value) || 70 }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={assessment.description}
            onChange={(e) => setAssessment(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Assessment description"
          />
        </div>
      </div>

      {/* Question Builder */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add Question</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Question Type
            </label>
            <select
              value={currentQuestion.type}
              onChange={(e) => setCurrentQuestion(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="multiple-choice">Multiple Choice</option>
              <option value="text">Text Answer</option>
              <option value="rating">Rating Scale</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Question *
            </label>
            <textarea
              value={currentQuestion.question}
              onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter your question"
            />
          </div>

          {currentQuestion.type === 'multiple-choice' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Options <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Select the correct answer by clicking the radio button next to the right option
              </p>
              <div className="space-y-2">
                {currentQuestion.options?.map((option, index) => (
                  <div key={index} className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                    currentQuestion.correctAnswer === index 
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={currentQuestion.correctAnswer === index}
                        onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: index }))}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span className={`text-sm font-medium ${
                        currentQuestion.correctAnswer === index 
                          ? 'text-green-700 dark:text-green-300' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {currentQuestion.correctAnswer === index ? '✓ Correct Answer' : 'Select as correct'}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateQuestionOption(index, e.target.value)}
                      className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 ${
                        currentQuestion.correctAnswer === index
                          ? 'border-green-300 dark:border-green-600 bg-white dark:bg-gray-700 focus:ring-green-500'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-blue-500'
                      }`}
                      placeholder={`Option ${index + 1}`}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeOption(index)}
                      disabled={(currentQuestion.options?.length || 0) <= 1}
                      className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addOption} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
              
              {currentQuestion.correctAnswer === undefined && (
                <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    ⚠️ Please select the correct answer before adding this question
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Points
              </label>
              <input
                type="number"
                value={currentQuestion.points}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, points: parseInt(e.target.value) || 5 }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Limit (seconds)
              </label>
              <input
                type="number"
                value={currentQuestion.timeLimit}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 120 }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <Button onClick={addQuestion} disabled={!currentQuestion.question.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>
      </div>

      {/* Questions List */}
      {assessment.questions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Questions ({assessment.questions.length})
          </h2>
          <div className="space-y-4">
            {assessment.questions.map((question, index) => (
              <div key={question.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        {question.type}
                      </span>
                      <span className="text-sm text-gray-500">
                        {question.points} points • {question.timeLimit}s
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      {index + 1}. {question.question}
                    </h4>
                    {question.type === 'multiple-choice' && question.options && (
                      <div className="space-y-2">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className={`flex items-center gap-2 p-2 rounded-md ${
                            question.correctAnswer === optIndex 
                              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                              : 'bg-gray-50 dark:bg-gray-800'
                          }`}>
                            <input
                              type="radio"
                              disabled
                              checked={question.correctAnswer === optIndex}
                              className="text-green-600"
                            />
                            <span className={`text-sm ${
                              question.correctAnswer === optIndex 
                                ? 'font-semibold text-green-700 dark:text-green-300' 
                                : 'text-gray-600 dark:text-gray-400'
                            }`}>
                              {option}
                              {question.correctAnswer === optIndex && (
                                <span className="ml-2 text-xs bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                                  ✓ Correct Answer
                                </span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeQuestion(question.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          onClick={() => saveAssessment('draft')} 
          disabled={!assessment.title || assessment.questions.length === 0 || !assessment.jobId}
        >
          <Save className="h-4 w-4 mr-2" />
          Save as Draft
        </Button>
        <Button 
          onClick={() => saveAssessment('active')} 
          disabled={!assessment.title || assessment.questions.length === 0 || !assessment.jobId}
        >
          <Save className="h-4 w-4 mr-2" />
          Publish Assessment
        </Button>
        <Button variant="outline" onClick={previewAssessment}>
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
      </div>
    </div>
  );
};

export default AssessmentBuilder;
