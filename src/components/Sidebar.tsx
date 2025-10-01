import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';
import { 
  Briefcase, 
  Users, 
  FileText, 
  BarChart3,
  LogOut,
  Plus,
  User
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/recruiter', text: 'Dashboard', icon: <BarChart3 className="h-5 w-5" /> },
    { to: '/recruiter/jobs', text: 'Jobs', icon: <Briefcase className="h-5 w-5" /> },
    { to: '/recruiter/candidates', text: 'Candidates', icon: <Users className="h-5 w-5" /> },
    { to: '/recruiter/assessments', text: 'Assessments', icon: <FileText className="h-5 w-5" /> },
    { to: '/recruiter/profile', text: 'Profile', icon: <User className="h-5 w-5" /> },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col dark:bg-gray-800 dark:border-gray-700">
      <div className="p-6">
        <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          TalentFlow
        </Link>
        <div className="text-xs text-gray-500 mt-1">Recruiter Portal</div>
      </div>
      
      <div className="p-4">
        <Link to="/recruiter/jobs/create">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
             <Plus className="h-4 w-4 mr-2" />
             Create Job
          </Button>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <div className="text-xs text-gray-400 mb-2 px-3">Navigation</div>
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/recruiter'} // Ensures only the dashboard link is active on the index route
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg transition-colors text-sm font-medium ${
                isActive
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
              }`
            }
          >
            {link.icon}
            <span>{link.text}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-gray-200 dark:border-gray-700">
        <Link to="/recruiter/profile" className="block mb-4">
          <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">{user?.name?.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Recruiter</p>
            </div>
          </div>
        </Link>
        <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;

