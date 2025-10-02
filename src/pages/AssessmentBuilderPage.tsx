import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { 
  Briefcase, 
  Users, 
  FileText, 
  Calendar, 
  Bell, 
  Settings, 
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Eye,
  Clock
} from 'lucide-react'
import Button from '../components/Button'

const AssessmentBuilderPage: React.FC = () => {
  const { user, logout } = useAuth()
  const { theme, setTheme, actualTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [assessment, setAssessment] = useState({
    title: '',
    description: '',
    type: 'technical',
    duration: 60,
    passingScore: 70,
    questions: [] as any[]
  })
  const [currentQuestion, setCurrentQuestion] = useState({
    type: 'multiple-choice',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    points: 5,
    timeLimit: 120
  })

  const toggleTheme = () => {
    setTheme(actualTheme === 'dark' ? 'light' : 'dark')
  }

  const addQuestion = () => {
    if (currentQuestion.question.trim()) {
      setAssessment(prev => ({
        ...prev,
        questions: [...prev.questions, { ...currentQuestion, id: Date.now().toString() }]
      }))
      setCurrentQuestion({
        type: 'multiple-choice',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        points: 5,
        timeLimit: 120
      })
    }
  }

  const removeQuestion = (index: number) => {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }))
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }))
  }

  const saveAssessment = () => {
    // Save assessment logic
    console.log('Saving assessment:', assessment)
  }

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white ">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-gray-900 ">TalentFlow</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              <Link
                to="/recruiter"
                className="text-gray-600  hover:bg-gray-50 :bg-gray-700 group flex items-center px-2 py-2 text-base font-medium rounded-md"
              >
                <Briefcase className="mr-4 h-6 w-6" />
                Dashboard
              </Link>
              <Link
                to="/jobs"
                className="text-gray-600  hover:bg-gray-50 :bg-gray-700 group flex items-center px-2 py-2 text-base font-medium rounded-md"
              >
                <Briefcase className="mr-4 h-6 w-6" />
                Jobs
              </Link>
              <Link
                to="/candidates"
                className="text-gray-600  hover:bg-gray-50 :bg-gray-700 group flex items-center px-2 py-2 text-base font-medium rounded-md"
              >
                <Users className="mr-4 h-6 w-6" />
                Candidates
              </Link>
              <Link
                to="/assessments"
                className="bg-primary text-white group flex items-center px-2 py-2 text-base font-medium rounded-md"
              >
                <FileText className="mr-4 h-6 w-6" />
                Assessments
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white  border-r border-gray-200 ">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-xl font-bold text-gray-900 ">TalentFlow</h1>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                <Link
                  to="/recruiter"
                  className="text-gray-600  hover:bg-gray-50 :bg-gray-700 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <Briefcase className="mr-3 h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  to="/recruiter/jobs"
                  className="text-gray-600  hover:bg-gray-50 :bg-gray-700 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <Briefcase className="mr-3 h-5 w-5" />
                  Jobs
                </Link>
                <Link
                  to="/recruiter/candidates"
                  className="text-gray-600  hover:bg-gray-50 :bg-gray-700 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <Users className="mr-3 h-5 w-5" />
                  Candidates
                </Link>
                <Link
                  to="/recruiter/assessments"
                  className="bg-primary text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <FileText className="mr-3 h-5 w-5" />
                  Assessments
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white  border-b border-gray-200 ">
          <button
            className="px-4 border-r border-gray-200  text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <Link
                to="/assessments"
                className="flex items-center text-gray-500 hover:text-gray-700 :text-gray-300"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Assessments
              </Link>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button
                className="bg-white  p-1 rounded-full text-gray-400 hover:text-gray-500 :text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                onClick={toggleTheme}
              >
                {actualTheme === 'dark' ? (
                  <Sun className="h-6 w-6" />
                ) : (
                  <Moon className="h-6 w-6" />
                )}
              </button>
              <button className="ml-3 bg-white  p-1 rounded-full text-gray-400 hover:text-gray-500 :text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <Bell className="h-6 w-6" />
              </button>
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 ">
                      {user?.name}
                    </p>
                    <p className="text-xs font-medium text-gray-500 ">
                      {user?.role}
                    </p>
                  </div>
                </div>
              </div>
              <button
                className="ml-3 bg-white  p-1 rounded-full text-gray-400 hover:text-gray-500 :text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                onClick={logout}
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 ">
                  Create New Assessment
                </h1>
                <p className="mt-1 text-sm text-gray-500 ">
                  Build a comprehensive assessment for your candidates
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Assessment Settings */}
                <div className="lg:col-span-1">
                  <div className="bg-white  shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900  mb-4">
                      Assessment Settings
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 ">
                          Title
                        </label>
                        <input
                          type="text"
                          value={assessment.title}
                          onChange={(e) => setAssessment(prev => ({ ...prev, title: e.target.value }))}
                          className="mt-1 block w-full border border-gray-300  rounded-md px-3 py-2 bg-white  text-gray-900  focus:outline-none focus:ring-primary focus:border-primary"
                          placeholder="Enter assessment title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 ">
                          Description
                        </label>
                        <textarea
                          value={assessment.description}
                          onChange={(e) => setAssessment(prev => ({ ...prev, description: e.target.value }))}
                          rows={3}
                          className="mt-1 block w-full border border-gray-300  rounded-md px-3 py-2 bg-white  text-gray-900  focus:outline-none focus:ring-primary focus:border-primary"
                          placeholder="Enter assessment description"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 ">
                          Type
                        </label>
                        <select
                          value={assessment.type}
                          onChange={(e) => setAssessment(prev => ({ ...prev, type: e.target.value }))}
                          className="mt-1 block w-full border border-gray-300  rounded-md px-3 py-2 bg-white  text-gray-900  focus:outline-none focus:ring-primary focus:border-primary"
                        >
                          <option value="technical">Technical</option>
                          <option value="behavioral">Behavioral</option>
                          <option value="cognitive">Cognitive</option>
                          <option value="personality">Personality</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 ">
                          Duration (minutes)
                        </label>
                        <input
                          type="number"
                          value={assessment.duration}
                          onChange={(e) => setAssessment(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                          className="mt-1 block w-full border border-gray-300  rounded-md px-3 py-2 bg-white  text-gray-900  focus:outline-none focus:ring-primary focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 ">
                          Passing Score (%)
                        </label>
                        <input
                          type="number"
                          value={assessment.passingScore}
                          onChange={(e) => setAssessment(prev => ({ ...prev, passingScore: parseInt(e.target.value) }))}
                          className="mt-1 block w-full border border-gray-300  rounded-md px-3 py-2 bg-white  text-gray-900  focus:outline-none focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Question Builder */}
                <div className="lg:col-span-2">
                  <div className="bg-white  shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900  mb-4">
                      Add Questions
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 ">
                          Question Type
                        </label>
                        <select
                          value={currentQuestion.type}
                          onChange={(e) => setCurrentQuestion(prev => ({ ...prev, type: e.target.value }))}
                          className="mt-1 block w-full border border-gray-300  rounded-md px-3 py-2 bg-white  text-gray-900  focus:outline-none focus:ring-primary focus:border-primary"
                        >
                          <option value="multiple-choice">Multiple Choice</option>
                          <option value="text">Text Answer</option>
                          <option value="code">Code Challenge</option>
                          <option value="rating">Rating Scale</option>
                          <option value="integer">Integer Answer</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 ">
                          Question
                        </label>
                        <textarea
                          value={currentQuestion.question}
                          onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question: e.target.value }))}
                          rows={3}
                          className="mt-1 block w-full border border-gray-300  rounded-md px-3 py-2 bg-white  text-gray-900  focus:outline-none focus:ring-primary focus:border-primary"
                          placeholder="Enter your question here"
                        />
                      </div>

                      {currentQuestion.type === 'multiple-choice' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 ">
                            Options
                          </label>
                          <div className="space-y-2 mt-2">
                            {currentQuestion.options.map((option, index) => (
                              <div key={index} className="flex items-center">
                                <input
                                  type="radio"
                                  name="correctAnswer"
                                  checked={currentQuestion.correctAnswer === index}
                                  onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: index }))}
                                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                                />
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => {
                                    const newOptions = [...currentQuestion.options]
                                    newOptions[index] = e.target.value
                                    setCurrentQuestion(prev => ({ ...prev, options: newOptions }))
                                  }}
                                  className="ml-3 flex-1 border border-gray-300  rounded-md px-3 py-2 bg-white  text-gray-900  focus:outline-none focus:ring-primary focus:border-primary"
                                  placeholder={`Option ${index + 1}`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 ">
                            Points
                          </label>
                          <input
                            type="number"
                            value={currentQuestion.points}
                            onChange={(e) => setCurrentQuestion(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                            className="mt-1 block w-full border border-gray-300  rounded-md px-3 py-2 bg-white  text-gray-900  focus:outline-none focus:ring-primary focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 ">
                            Time Limit (seconds)
                          </label>
                          <input
                            type="number"
                            value={currentQuestion.timeLimit}
                            onChange={(e) => setCurrentQuestion(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                            className="mt-1 block w-full border border-gray-300  rounded-md px-3 py-2 bg-white  text-gray-900  focus:outline-none focus:ring-primary focus:border-primary"
                          />
                        </div>
                      </div>

                      <Button onClick={addQuestion} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Question
                      </Button>
                    </div>
                  </div>

                  {/* Questions List */}
                  {assessment.questions.length > 0 && (
                    <div className="mt-8 bg-white  shadow rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900  mb-4">
                        Questions ({assessment.questions.length})
                      </h3>
                      <div className="space-y-4">
                        {assessment.questions.map((question, index) => (
                          <div key={question.id} className="flex items-center justify-between p-4 border border-gray-200  rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 ">
                                {question.question}
                              </h4>
                              <p className="text-sm text-gray-500 ">
                                {question.type} • {question.points} points • {question.timeLimit}s
                              </p>
                            </div>
                            <button
                              onClick={() => removeQuestion(index)}
                              className="ml-4 text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Save Button */}
                  <div className="mt-8 flex justify-end">
                    <Button onClick={saveAssessment} className="px-8">
                      <Save className="h-4 w-4 mr-2" />
                      Save Assessment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AssessmentBuilderPage
