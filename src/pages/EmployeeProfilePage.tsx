import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Upload,
  Save,
  Edit,
  Plus,
  Trash2,
  ExternalLink,
  Github,
  Linkedin,
  Globe
} from 'lucide-react'
import Button from '../components/Button'

const EmployeeProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth()
  const { actualTheme } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    bio: user?.bio || '',
    phone: user?.phone || '',
    location: user?.location || '',
    skills: user?.skills || [],
    experience: user?.experience || 0,
    resume: user?.resume || '',
    linkedin: user?.linkedin || '',
    github: user?.github || '',
    website: user?.website || '',
    education: user?.education || [],
    workHistory: user?.workHistory || []
  })

  const [newSkill, setNewSkill] = useState('')
  const [newEducation, setNewEducation] = useState({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    gpa: ''
  })
  const [newWorkHistory, setNewWorkHistory] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: '',
    achievements: []
  })

  const handleSave = () => {
    updateUser(profile)
    setIsEditing(false)
    // Here you would typically save to backend
    console.log('Profile saved:', profile)
  }

  const addSkill = () => {
    if (newSkill.trim()) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (index: number) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  const addEducation = () => {
    if (newEducation.institution && newEducation.degree) {
      setProfile(prev => ({
        ...prev,
        education: [...prev.education, { 
          ...newEducation, 
          id: Date.now().toString(),
          gpa: newEducation.gpa ? parseFloat(newEducation.gpa) : undefined
        }]
      }))
      setNewEducation({
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: ''
      })
    }
  }

  const addWorkHistory = () => {
    if (newWorkHistory.company && newWorkHistory.position) {
      setProfile(prev => ({
        ...prev,
        workHistory: [...prev.workHistory, { ...newWorkHistory, id: Date.now().toString() }]
      }))
      setNewWorkHistory({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
        achievements: []
      })
    }
  }

  const removeEducation = (id: string) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }))
  }

  const removeWorkHistory = (id: string) => {
    setProfile(prev => ({
      ...prev,
      workHistory: prev.workHistory.filter(work => work.id !== id)
    }))
  }

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real app, you would upload this to a server
      // For now, we'll just store the filename
      setProfile(prev => ({
        ...prev,
        resume: file.name
      }))
      alert(`Resume "${file.name}" uploaded successfully!`)
    }
  }

  return (
    <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                <p className="text-gray-600">Manage your professional profile and preferences</p>
              </div>
              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Picture & Basic Info */}
              <div className="lg:col-span-1">
                <div className="text-center">
                  <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-4xl font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                  <p className="text-gray-600">{user?.position || user?.role}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>

                {/* Contact Information */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="flex-1 border-none bg-transparent text-gray-600"
                      />
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="Phone number"
                        className="flex-1 border-none bg-transparent text-gray-600 disabled:bg-transparent"
                      />
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="Location"
                        className="flex-1 border-none bg-transparent text-gray-600 disabled:bg-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Social Links</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Linkedin className="h-5 w-5 text-gray-400 mr-3" />
                      <input
                        type="url"
                        value={profile.linkedin}
                        onChange={(e) => setProfile(prev => ({ ...prev, linkedin: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="LinkedIn URL"
                        className="flex-1 border-none bg-transparent text-gray-600 disabled:bg-transparent"
                      />
                    </div>
                    <div className="flex items-center">
                      <Github className="h-5 w-5 text-gray-400 mr-3" />
                      <input
                        type="url"
                        value={profile.github}
                        onChange={(e) => setProfile(prev => ({ ...prev, github: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="GitHub URL"
                        className="flex-1 border-none bg-transparent text-gray-600 disabled:bg-transparent"
                      />
                    </div>
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 text-gray-400 mr-3" />
                      <input
                        type="url"
                        value={profile.website}
                        onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="Personal website"
                        className="flex-1 border-none bg-transparent text-gray-600 disabled:bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Bio */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">About Me</h3>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!isEditing}
                    rows={4}
                    placeholder="Tell us about yourself, your experience, and what you're looking for..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>

                {/* Skills */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                        {isEditing && (
                          <button
                            onClick={() => removeSkill(index)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a skill"
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      />
                      <Button onClick={addSkill}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Experience */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Experience</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={profile.experience}
                      onChange={(e) => setProfile(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
                      disabled={!isEditing}
                      className="w-32 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                  
                  {/* Work History */}
                  <div className="space-y-4">
                    {profile.workHistory.map((work, index) => (
                      <div key={work.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{work.position}</h4>
                            <p className="text-gray-600">{work.company}</p>
                            <p className="text-sm text-gray-500">{work.startDate} - {work.endDate}</p>
                            <p className="text-sm text-gray-700 mt-2">{work.description}</p>
                          </div>
                          {isEditing && (
                            <button
                              onClick={() => removeWorkHistory(work.id)}
                              className="ml-4 text-red-600 hover:text-red-800"
                              title="Remove work experience"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {isEditing && (
                    <div className="mt-4 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Add Work Experience</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          value={newWorkHistory.position}
                          onChange={(e) => setNewWorkHistory(prev => ({ ...prev, position: e.target.value }))}
                          placeholder="Job Title"
                          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="text"
                          value={newWorkHistory.company}
                          onChange={(e) => setNewWorkHistory(prev => ({ ...prev, company: e.target.value }))}
                          placeholder="Company"
                          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="text"
                          value={newWorkHistory.startDate}
                          onChange={(e) => setNewWorkHistory(prev => ({ ...prev, startDate: e.target.value }))}
                          placeholder="Start Date (MM/YYYY)"
                          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="text"
                          value={newWorkHistory.endDate}
                          onChange={(e) => setNewWorkHistory(prev => ({ ...prev, endDate: e.target.value }))}
                          placeholder="End Date (MM/YYYY)"
                          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <textarea
                        value={newWorkHistory.description}
                        onChange={(e) => setNewWorkHistory(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Job description"
                        rows={3}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                      />
                      <Button onClick={addWorkHistory}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Experience
                      </Button>
                    </div>
                  )}
                </div>

                {/* Education */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Education</h3>
                  <div className="space-y-4">
                    {profile.education.map((edu, index) => (
                      <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{edu.degree} in {edu.field}</h4>
                            <p className="text-gray-600">{edu.institution}</p>
                            <p className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</p>
                            {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                          </div>
                          {isEditing && (
                            <button
                              onClick={() => removeEducation(edu.id)}
                              className="ml-4 text-red-600 hover:text-red-800"
                              title="Remove education"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {isEditing && (
                    <div className="mt-4 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Add Education</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          value={newEducation.institution}
                          onChange={(e) => setNewEducation(prev => ({ ...prev, institution: e.target.value }))}
                          placeholder="Institution"
                          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="text"
                          value={newEducation.degree}
                          onChange={(e) => setNewEducation(prev => ({ ...prev, degree: e.target.value }))}
                          placeholder="Degree"
                          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="text"
                          value={newEducation.field}
                          onChange={(e) => setNewEducation(prev => ({ ...prev, field: e.target.value }))}
                          placeholder="Field of Study"
                          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="text"
                          value={newEducation.gpa}
                          onChange={(e) => setNewEducation(prev => ({ ...prev, gpa: e.target.value }))}
                          placeholder="GPA (optional)"
                          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="text"
                          value={newEducation.startDate}
                          onChange={(e) => setNewEducation(prev => ({ ...prev, startDate: e.target.value }))}
                          placeholder="Start Date (YYYY)"
                          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="text"
                          value={newEducation.endDate}
                          onChange={(e) => setNewEducation(prev => ({ ...prev, endDate: e.target.value }))}
                          placeholder="End Date (YYYY)"
                          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <Button onClick={addEducation}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Education
                      </Button>
                    </div>
                  )}
                </div>

                {/* Resume Upload */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Resume</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Upload your resume</p>
                    <p className="text-sm text-gray-500 mb-4">PDF, DOC, or DOCX (Max 10MB)</p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      id="resume-upload"
                      onChange={handleResumeUpload}
                    />
                    <label
                      htmlFor="resume-upload"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </label>
                    {profile.resume && (
                      <div className="mt-2 text-sm text-green-600">
                        Current resume: {profile.resume}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default EmployeeProfilePage
