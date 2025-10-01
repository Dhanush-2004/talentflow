import React, { useState, useEffect, useMemo, useRef, UIEvent } from 'react';
import Button from '../components/Button';
import { 
  Plus, Eye, Edit, Trash2, Search, X
} from 'lucide-react';

// This interface should eventually be in a shared types file
interface Candidate {
  id: string;
  name: string;
  email: string;
  position: string;
  status: 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';
  appliedAt: string;
  experience: string;
}

const CandidatesPage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    email: '',
    position: '',
    status: 'Applied' as Candidate['status'],
    experience: ''
  });
  // virtualization only; pagination can be added later
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rowHeight = 72; // px per row
  const viewportHeight = 600; // px
  const overscan = 10;

  // Generate 100 mock candidates
  const generateMockCandidates = (): Candidate[] => {
    const firstNames = [
      'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Jessica', 'William', 'Ashley',
      'James', 'Amanda', 'Christopher', 'Stephanie', 'Daniel', 'Jennifer', 'Matthew', 'Elizabeth',
      'Anthony', 'Linda', 'Mark', 'Barbara', 'Donald', 'Susan', 'Steven', 'Lisa', 'Paul', 'Nancy',
      'Andrew', 'Karen', 'Joshua', 'Betty', 'Kenneth', 'Helen', 'Kevin', 'Sandra', 'Brian', 'Donna',
      'George', 'Carol', 'Timothy', 'Ruth', 'Ronald', 'Sharon', 'Jason', 'Michelle', 'Edward', 'Laura'
    ];

    const lastNames = [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez',
      'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor',
      'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez',
      'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright',
      'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker'
    ];

    const positions = [
      'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
      'UI/UX Designer', 'Product Manager', 'Data Scientist', 'DevOps Engineer', 'QA Engineer',
      'Mobile Developer', 'System Administrator', 'Business Analyst', 'Project Manager',
      'Marketing Manager', 'Sales Representative', 'HR Specialist', 'Content Writer',
      'Graphic Designer', 'Financial Analyst', 'Operations Manager'
    ];

    const statuses: Candidate['status'][] = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];

    const candidates: Candidate[] = [];

    for (let i = 1; i <= 100; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const position = positions[Math.floor(Math.random() * positions.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const experience = Math.floor(Math.random() * 15) + 1; // 1-15 years
      
      // Generate random date within last 6 months
      const appliedDate = new Date();
      appliedDate.setDate(appliedDate.getDate() - Math.floor(Math.random() * 180));
      
      candidates.push({
        id: `candidate_${i}`,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
        position,
        status,
        appliedAt: appliedDate.toISOString().split('T')[0],
        experience: `${experience} years`
      });
    }

    return candidates;
  };

  useEffect(() => {
    const loadCandidates = () => {
      setLoading(true);
      
      setTimeout(() => {
        try {
          // Check if mock candidates exist in localStorage
          let mockCandidates = JSON.parse(localStorage.getItem('mockCandidates') || '[]');
          
          // If no candidates exist, generate them
          if (mockCandidates.length === 0) {
            mockCandidates = generateMockCandidates();
            localStorage.setItem('mockCandidates', JSON.stringify(mockCandidates));
          }
          
          setCandidates(mockCandidates);
        } catch (error) {
          console.error('Error loading candidates:', error);
          setCandidates([]);
        } finally {
          setLoading(false);
        }
      }, 800);
    };

    loadCandidates();
  }, []);
  
  const filteredCandidates = useMemo(() => {
    return candidates.filter(candidate => {
      const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           candidate.position.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [candidates, searchTerm, statusFilter]);

  // Simple virtualization calculations
  const totalHeight = filteredCandidates.length * rowHeight;
  const [scrollTop, setScrollTop] = useState(0);
  
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endIndex = Math.min(
    filteredCandidates.length - 1,
    Math.ceil((scrollTop + viewportHeight) / rowHeight) + overscan
  );

  const visibleCandidates = filteredCandidates.slice(startIndex, endIndex + 1);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const handleAddCandidate = () => {
    if (!newCandidate.name.trim() || !newCandidate.email.trim() || !newCandidate.position.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const candidate: Candidate = {
      id: `candidate_${Date.now()}`,
      name: newCandidate.name.trim(),
      email: newCandidate.email.trim(),
      position: newCandidate.position.trim(),
      status: newCandidate.status,
      appliedAt: new Date().toISOString().split('T')[0],
      experience: newCandidate.experience.trim() || '0 years'
    };

    // Add to local state
    setCandidates(prev => [candidate, ...prev]);
    
    // Update localStorage
    const updatedCandidates = [candidate, ...candidates];
    localStorage.setItem('mockCandidates', JSON.stringify(updatedCandidates));

    // Reset form and close modal
    setNewCandidate({
      name: '',
      email: '',
      position: '',
      status: 'Applied',
      experience: ''
    });
    setShowAddModal(false);

    alert('Candidate added successfully!');
  };

  const handleInputChange = (field: string, value: string) => {
    setNewCandidate(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusColor = (status: Candidate['status']) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-100 text-blue-800';
      case 'Screening':
        return 'bg-yellow-100 text-yellow-800';
      case 'Interview':
        return 'bg-purple-100 text-purple-800';
      case 'Offer':
        return 'bg-green-100 text-green-800';
      case 'Hired':
        return 'bg-emerald-100 text-emerald-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Candidates</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track candidate applications
          </p>
        </div>
        <Button className="flex items-center" onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Candidate
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Screening">Screening</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Candidates</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{candidates.length}</p>
            </div>
            <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">TC</span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Applied</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {candidates.filter(c => c.status === 'Applied').length}
              </p>
            </div>
            <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">AP</span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Interview</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {candidates.filter(c => c.status === 'Interview').length}
              </p>
            </div>
            <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 dark:text-purple-400 text-sm font-medium">IV</span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Hired</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {candidates.filter(c => c.status === 'Hired').length}
              </p>
            </div>
            <div className="h-8 w-8 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
              <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">HD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Candidates ({filteredCandidates.length})
          </h3>
        </div>
        
        <div 
          ref={containerRef}
          className="overflow-auto"
          style={{ height: viewportHeight }}
          onScroll={handleScroll}
        >
          <div style={{ height: totalHeight, position: 'relative' }}>
            <div
              style={{
                transform: `translateY(${startIndex * rowHeight}px)`,
                position: 'absolute',
                width: '100%'
              }}
            >
              {visibleCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  style={{ height: rowHeight }}
                >
                  <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{candidate.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{candidate.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-900 dark:text-white">{candidate.position}</p>
                    </div>
                    <div className="col-span-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(candidate.status)}`}>
                        {candidate.status}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-900 dark:text-white">{candidate.experience}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500 dark:text-gray-400">
                        {new Date(candidate.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="col-span-1">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {filteredCandidates.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No candidates found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first candidate.'
            }
          </p>
        </div>
      )}

      {/* Add Candidate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Candidate</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newCandidate.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={newCandidate.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Position *
                </label>
                <input
                  type="text"
                  value={newCandidate.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter position title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Experience
                </label>
                <input
                  type="text"
                  value={newCandidate.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., 5 years"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={newCandidate.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="Applied">Applied</option>
                  <option value="Screening">Screening</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Hired">Hired</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddCandidate}>
                Add Candidate
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatesPage;