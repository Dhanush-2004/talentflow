import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { 
  Briefcase, 
  Users, 
  FileText
} from 'lucide-react';

// NOTE: These interfaces should be moved to a shared types file (e.g., src/types/index.ts)
interface Candidate {
  id: string;
  name: string;
  position: string;
  status: 'Interview Scheduled' | 'Assessment Pending' | 'Applied';
  appliedAt: string;
  experience: string;
}

interface Job {
    id: string;
    title: string;
    applications: number;
    status: 'Active' | 'Closed';
    postedAt: string;
}

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode }> = 
  ({ title, value, icon }) => (
  <div className="bg-white  overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500  truncate">
              {title}
            </dt>
            <dd className="text-2xl font-bold text-gray-900 ">
              {value}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

const RecruiterDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // State for dashboard data
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCandidates: 0,
    newApplications: 0,
  });
  const [recentCandidates, setRecentCandidates] = useState<Candidate[]>([]);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch all data using apiService
        const [jobsResponse, applicationsResponse] = await Promise.all([
          apiService.getJobs(),
          apiService.getApplications()
        ]);

        const jobs = jobsResponse.data || [];
        const applications = applicationsResponse.data || [];

        // Filter data for current recruiter (Sarah Wilson has ID '2')
        const recruiterJobs = jobs.filter((job: any) => job.recruiterId === user?.id);
        const recruiterApplications = applications.filter((app: any) => 
          recruiterJobs.some((job: any) => job.id === app.jobId)
        );

        // Calculate stats
        const totalJobs = recruiterJobs.length;
        const totalCandidates = new Set(recruiterApplications.map((app: any) => app.userId)).size;
        const newApplications = recruiterApplications.filter((app: any) => {
          const appDate = new Date(app.appliedAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return appDate > weekAgo;
        }).length;

        setStats({
          totalJobs,
          totalCandidates,
          newApplications,
        });

        // Get recent candidates (last 3 applications)
        const recentApplications = recruiterApplications
          .sort((a: any, b: any) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
          .slice(0, 3);

        const recentCandidatesData = recentApplications.map((app: any) => {
          const job = recruiterJobs.find((j: any) => j.id === app.jobId);
          return {
            id: app.id,
            name: `Candidate ${app.userId}`,
            position: job?.title || 'Unknown Position',
            status: app.assessmentCompleted ? 'Interview Scheduled' as Candidate['status'] : 
                   app.assessmentScore !== null ? 'Assessment Pending' as Candidate['status'] : 
                   'Applied' as Candidate['status'],
            appliedAt: app.appliedAt,
            experience: `${Math.floor(Math.random() * 5) + 1} years`,
          };
        });
        setRecentCandidates(recentCandidatesData);

        // Get recent jobs (last 3)
        const recentJobsData = recruiterJobs
          .sort((a: any, b: any) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
          .slice(0, 3)
          .map((job: any) => ({
            id: job.id,
            title: job.title,
            applications: recruiterApplications.filter((app: any) => app.jobId === job.id).length,
            status: job.status === 'active' ? 'Active' as Job['status'] : 'Closed' as Job['status'],
            postedAt: job.postedAt,
          }));
        setRecentJobs(recentJobsData);

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id]);

  const getCandidateStatusColor = (status: Candidate['status']) => {
    switch (status) {
      case 'Interview Scheduled': return 'bg-green-100 text-green-800  ';
      case 'Assessment Pending': return 'bg-yellow-100 text-yellow-800  ';
      case 'Applied': return 'bg-blue-100 text-blue-800  ';
    }
  };
  
  const getJobStatusColor = (status: Job['status']) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800  ' 
      : 'bg-gray-100 text-gray-800  ';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 ">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 ">
          Recruiter Dashboard
        </h1>
        <p className="mt-1 text-gray-600 ">
          Welcome back, {user?.name}! Here's your recruitment pipeline at a glance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <StatCard title="Total Jobs" value={stats.totalJobs} icon={<Briefcase className="h-8 w-8 text-blue-500" />} />
        <StatCard title="Total Candidates" value={stats.totalCandidates} icon={<Users className="h-8 w-8 text-green-500" />} />
        <StatCard title="New Applications" value={stats.newApplications} icon={<FileText className="h-8 w-8 text-yellow-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Candidates */}
        <div className="bg-white  shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900 ">
                Recent Candidates
              </h3>
              <Link to="/recruiter/candidates" className="text-blue-600 hover:text-blue-800  :text-blue-300 text-sm font-medium">
                View all →
              </Link>
            </div>
            <div className="space-y-4">
              {recentCandidates.map((candidate) => (
                <div key={candidate.id} className="flex items-center justify-between p-3 border border-gray-200  rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">{candidate.name.charAt(0)}</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900 ">{candidate.name}</h4>
                      <p className="text-sm text-gray-500 ">{candidate.position}</p>
                    </div>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCandidateStatusColor(candidate.status)}`}>
                    {candidate.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white  shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900 ">
                Recent Jobs
              </h3>
               <Link to="/recruiter/jobs" className="text-blue-600 hover:text-blue-800  :text-blue-300 text-sm font-medium">
                View all →
              </Link>
            </div>
             <div className="space-y-4">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 border border-gray-200  rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 ">{job.title}</h4>
                    <p className="text-sm text-gray-500 ">{job.applications} applications</p>
                  </div>
                  <div className="ml-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getJobStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecruiterDashboard;

