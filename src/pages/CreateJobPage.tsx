import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { ArrowLeft, Save, Eye, MapPin } from 'lucide-react';
import Button from '../components/Button';
import { apiService } from '../services/api';
//

interface JobFormData {
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salaryMin: string;
  salaryMax: string;
  salaryCurrency: string;
  description: string;
  requirements: string[];
  benefits: string[];
  tags: string[];
  status: 'draft' | 'active';
}

const CreateJobPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalJobId, setOriginalJobId] = useState<string | null>(null);

  // Check if we're in edit mode
  useEffect(() => {
    const editJobId = searchParams.get('edit');
    if (editJobId) {
      setIsEditMode(true);
      setOriginalJobId(editJobId);
      loadJobForEdit(editJobId);
    }
  }, [searchParams]);

  const loadJobForEdit = (jobId: string) => {
    try {
      const jobs = JSON.parse(localStorage.getItem('msw_jobs') || '[]');
      const job = jobs.find((j: any) => j.id === jobId);
      
      if (job) {
        setFormData({
          title: job.title || '',
          company: job.company || '',
          location: job.location || '',
          type: job.type?.toLowerCase() || 'full-time',
          salaryCurrency: job.salary?.currency || 'USD',
          salaryMin: job.salary?.min?.toString() || '',
          salaryMax: job.salary?.max?.toString() || '',
          description: job.description || '',
          requirements: job.requirements || [''],
          benefits: job.benefits || [''],
          tags: job.tags || [''],
          status: job.status || 'draft'
        });
      }
    } catch (error) {
      console.error('Error loading job for edit:', error);
    }
  };

  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    company: user?.company || 'TechCorp',
    location: '',
    type: 'full-time',
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'USD',
    description: '',
    requirements: [''],
    benefits: [''],
    tags: [''],
    status: 'draft'
  });

  const handleInputChange = (field: keyof JobFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // array handlers omitted for brevity in this minimal version

  const handleSubmit = async (status: 'draft' | 'active') => {
    setLoading(true);
    try {

      const jobData = {
        ...formData,
        status,
        // Filter out empty strings before submitting
        requirements: formData.requirements.filter(r => r.trim()),
        benefits: formData.benefits.filter(b => b.trim()),
        tags: formData.tags.filter(t => t.trim()),
      };

      // Validate required fields
      if (!jobData.title.trim()) {
        throw new Error('Job title is required');
      }
      if (!jobData.location.trim()) {
        throw new Error('Location is required');
      }
      if (!jobData.company.trim()) {
        throw new Error('Company is required');
      }

      // Prepare job data for API
      const jobToSave = {
        title: jobData.title,
        company: jobData.company,
        location: jobData.location,
        type: jobData.type.charAt(0).toUpperCase() + jobData.type.slice(1).replace('-', '-'),
        description: jobData.description || 'No description provided',
        salary: {
          min: Number(jobData.salaryMin) || 0,
          max: Number(jobData.salaryMax) || 0,
          currency: jobData.salaryCurrency,
          period: 'year'
        },
        experience: '2+ years',
        status: status === 'active' ? 'active' : 'draft',
        recruiterId: user?.id
      };

      // Use API service to create/update job
      if (isEditMode && originalJobId) {
        await apiService.updateJob(originalJobId, jobToSave);
      } else {
        await apiService.createJob(jobToSave);
      }

      console.log(`Job ${isEditMode ? 'updated' : 'created'} successfully:`, jobToSave);
      
      // Show success message
      showToast('success', 'Job Saved', `Job "${jobToSave.title}" has been ${isEditMode ? 'updated' : status === 'active' ? 'published' : 'saved as draft'} successfully!`);
      
      // Navigate back to jobs page
      navigate('/recruiter/jobs');
    } catch (error) {
      console.error('Failed to create job:', error);
      showToast('error', 'Job Creation Failed', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/recruiter/jobs" className="inline-flex items-center text-gray-600  hover:text-gray-900 :text-white">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 ">
          {isEditMode ? 'Edit Job' : 'Create New Job'}
        </h1>
        <p className="text-gray-600  mt-2">
          {isEditMode ? 'Update the job details below.' : 'Fill in the details below to create a new job posting.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white  rounded-xl shadow-sm border border-gray-200  p-6">
            <h2 className="text-xl font-bold text-gray-900  mb-6">Basic Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700  mb-2">Job Title *</label>
                <input type="text" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} placeholder="e.g. Senior UI/UX Designer" className="w-full px-4 py-3 border border-gray-300  bg-white  rounded-lg focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-2">Company *</label>
                  <input type="text" value={formData.company} onChange={(e) => handleInputChange('company', e.target.value)} placeholder="Company name" className="w-full px-4 py-3 border border-gray-300  bg-white  rounded-lg focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-2">Location *</label>
                  <div className="relative"><MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /><input type="text" value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} placeholder="e.g. San Francisco, CA" className="w-full pl-10 pr-4 py-3 border border-gray-300  bg-white  rounded-lg focus:ring-2 focus:ring-blue-500" required /></div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-2">Job Type *</label>
                  <select value={formData.type} onChange={(e) => handleInputChange('type', e.target.value)} className="w-full px-4 py-3 border border-gray-300  bg-white  rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-2">Salary Currency</label>
                  <select value={formData.salaryCurrency} onChange={(e) => handleInputChange('salaryCurrency', e.target.value)} className="w-full px-4 py-3 border border-gray-300  bg-white  rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-2">Minimum Salary</label>
                  <input type="number" value={formData.salaryMin} onChange={(e) => handleInputChange('salaryMin', e.target.value)} placeholder="e.g. 50000" className="w-full px-4 py-3 border border-gray-300  bg-white  rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-2">Maximum Salary</label>
                  <input type="number" value={formData.salaryMax} onChange={(e) => handleInputChange('salaryMax', e.target.value)} placeholder="e.g. 80000" className="w-full px-4 py-3 border border-gray-300  bg-white  rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700  mb-2">Job Description *</label>
                <textarea rows={6} value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder="Describe the role, responsibilities, and what makes this opportunity unique..." className="w-full px-4 py-3 border border-gray-300  bg-white  rounded-lg focus:ring-2 focus:ring-blue-500" required />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            <div className="bg-white  rounded-xl shadow-sm border border-gray-200  p-6">
              <h3 className="text-lg font-bold text-gray-900  mb-4">Actions</h3>
              <div className="space-y-3">
                <Button onClick={() => handleSubmit('draft')} disabled={loading} variant="outline" className="w-full">
                  <Save className="h-4 w-4 mr-2" /> 
                  {isEditMode ? 'Save Changes' : 'Save as Draft'}
                </Button>
                <Button onClick={() => handleSubmit('active')} disabled={loading || !formData.title || !formData.location} className="w-full">
                  <Eye className="h-4 w-4 mr-2" /> 
                  {isEditMode ? 'Update & Publish' : 'Publish Job'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJobPage;

