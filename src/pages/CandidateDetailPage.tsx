import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../components/Button';
import { 
  ArrowLeft, Mail, Phone,
  MessageCircle, Star, Download, MapPin, Clock
} from 'lucide-react';

// Centralize these interfaces in a types file (e.g., src/types/index.ts)
interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience: number;
  skills: string[];
  status: 'applied' | 'interview' | 'assessment' | 'offered' | 'rejected';
  appliedAt: string;
  jobTitle: string;
  location: string;
  education: {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa: number;
  }[];
  workHistory: {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    achievements: string[];
  }[];
  assessments: {
    id: string;
    title: string;
    score: number;
    completedAt: string;
    status: 'completed';
  }[];
}

const CandidateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/recruiter/candidates/${id}`);
        if (!res.ok) throw new Error('Failed to fetch candidate');
        const c = await res.json();
        const assessmentsRes = await fetch(`/api/recruiter/candidates/${id}/assessments`);
        const assessments = assessmentsRes.ok ? await assessmentsRes.json() : [];
        const mapped: Candidate = {
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone || '+1 (555) 123-4567',
          experience: c.experience || 0,
          skills: c.skills || [],
          status: (c.currentStage || 'applied') as Candidate['status'],
          appliedAt: c.appliedAt || '2024-01-15',
          jobTitle: 'Frontend Developer',
          location: c.location || 'Remote',
          education: c.education || [],
          workHistory: c.workHistory || [],
          assessments: (assessments || []).map((a: any) => ({ id: a.id, title: a.title, score: a.score ?? 0, completedAt: a.completedAt ?? '2024-01-01', status: 'completed' }))
        };
        setCandidate(mapped);
      } catch (error) {
        console.error('Failed to fetch candidate details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCandidateDetails();
    }
  }, [id]);
  
  const getStatusColor = (status: Candidate['status']) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'interview': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'assessment': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'offered': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (loading) return <div className="p-8">Loading candidate details...</div>;
  if (!candidate) return <div className="p-8">Candidate not found.</div>;

  return (
    <>
      <div className="mb-6">
        <Link to="/recruiter/candidates" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Candidates
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Candidate Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-2xl font-medium text-white">
                  {candidate.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{candidate.name}</h1>
                <p className="text-gray-600 dark:text-gray-400">{candidate.jobTitle}</p>
                <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(candidate.status)}`}>
                  {candidate.status}
                </span>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-center text-gray-600 dark:text-gray-400"><Mail className="h-4 w-4 mr-3" /> {candidate.email}</div>
              <div className="flex items-center text-gray-600 dark:text-gray-400"><Phone className="h-4 w-4 mr-3" /> {candidate.phone}</div>
              <div className="flex items-center text-gray-600 dark:text-gray-400"><MapPin className="h-4 w-4 mr-3" /> {candidate.location}</div>
              <div className="flex items-center text-gray-600 dark:text-gray-400"><Clock className="h-4 w-4 mr-3" /> {candidate.experience} years experience</div>
            </div>

            <div className="mt-6">
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button className="w-full"><MessageCircle className="h-4 w-4 mr-2" /> Send Message</Button>
              <Button variant="outline" className="w-full"><Download className="h-4 w-4 mr-2" /> Download Resume</Button>
            </div>
          </div>
        </div>

        {/* Right Column: Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Education</h2>
            {candidate.education.map((edu) => (
              <div key={edu.id} className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{edu.degree} in {edu.field}</h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium">{edu.institution}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">{edu.startDate} - {edu.endDate} • GPA: {edu.gpa}</p>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Work Experience</h2>
            {candidate.workHistory.map((work) => (
              <div key={work.id} className="border-l-4 border-blue-500 pl-4 mb-6 last:mb-0">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{work.position}</h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium">{work.company}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">{work.startDate} - {work.endDate}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{work.description}</p>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Key Achievements:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {work.achievements.map((achievement, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400">{achievement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Assessment Results</h2>
            {candidate.assessments.map((assessment) => (
              <div key={assessment.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg mb-3">
                <div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">{assessment.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Completed {assessment.completedAt}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 mr-1" />
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{assessment.score}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CandidateDetailPage;

