import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Save,
  Edit,
  Camera,
  User,
  Building,
  Settings,
  Shield
} from 'lucide-react';
import Button from '../components/Button';

interface ProfileData {
  bio: string;
  phone: string;
  location: string;
  company: string;
  companySize: string;
  industry: string;
  hiringManager: boolean;
  linkedin: string;
  website: string;
  avatar?: string;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    weeklyReports: boolean;
    candidateUpdates: boolean;
    jobAlerts: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    showEmail: boolean;
    showPhone: boolean;
    allowDirectContact: boolean;
  };
}

const RecruiterProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'company' | 'preferences' | 'privacy'>('profile');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [profile, setProfile] = useState<ProfileData>({
    bio: user?.bio || '',
    phone: user?.phone || '',
    location: user?.location || '',
    company: user?.company || '',
    companySize: user?.companySize || '',
    industry: user?.industry || '',
    hiringManager: user?.hiringManager || false,
    linkedin: user?.linkedin || '',
    website: user?.website || '',
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      weeklyReports: true,
      candidateUpdates: true,
      jobAlerts: true,
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      allowDirectContact: true,
    }
  });

  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '501-1000 employees',
    '1000+ employees'
  ];

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Consulting',
    'Non-profit',
    'Government',
    'Other'
  ];

  const handleSave = async () => {
    setLoading(true);
    setSuccessMessage('');
    
    try {
      // Basic validation
      if (!profile.company.trim() && activeTab === 'company') {
        alert('Company name is required');
        return;
      }
      
      if (!profile.phone.trim() && activeTab === 'profile') {
        alert('Phone number is required');
        return;
      }

      await updateUser(profile);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      
      console.log('Profile saved:', profile);
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfile({
      bio: user?.bio || '',
      phone: user?.phone || '',
      location: user?.location || '',
      company: user?.company || '',
      companySize: user?.companySize || '',
      industry: user?.industry || '',
      hiringManager: user?.hiringManager || false,
      linkedin: user?.linkedin || '',
      website: user?.website || '',
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        weeklyReports: true,
        candidateUpdates: true,
        jobAlerts: true,
      },
      privacy: {
        profileVisibility: 'public',
        showEmail: false,
        showPhone: false,
        allowDirectContact: true,
      }
    });
    setIsEditing(false);
  };

  const [uploading, setUploading] = useState(false);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        setUploading(false);
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        setUploading(false);
        return;
      }
      
      // In a real app, you would upload this to a server
      // For now, we'll create a local URL for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({
          ...prev,
          avatar: e.target?.result as string
        }));
        setUploading(false);
        // Show success message with better UX
        setTimeout(() => {
          alert('Profile picture uploaded successfully!');
        }, 100);
      };
      reader.onerror = () => {
        setUploading(false);
        alert('Failed to upload image. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  const resetTab = (tabId: string) => {
    switch (tabId) {
      case 'profile':
        setProfile(prev => ({
          ...prev,
          bio: user?.bio || '',
          phone: user?.phone || '',
          location: user?.location || '',
          linkedin: user?.linkedin || '',
          website: user?.website || ''
        }));
        break;
      case 'company':
        setProfile(prev => ({
          ...prev,
          company: user?.company || '',
          companySize: user?.companySize || '',
          industry: user?.industry || '',
          hiringManager: user?.hiringManager || false
        }));
        break;
      case 'preferences':
        setProfile(prev => ({
          ...prev,
          preferences: {
            emailNotifications: true,
            smsNotifications: false,
            weeklyReports: true,
            candidateUpdates: true,
            jobAlerts: true,
          }
        }));
        break;
      case 'privacy':
        setProfile(prev => ({
          ...prev,
          privacy: {
            profileVisibility: 'public',
            showEmail: false,
            showPhone: false,
            allowDirectContact: true,
          }
        }));
        break;
    }
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'company' as const, label: 'Company', icon: Building },
    { id: 'preferences' as const, label: 'Preferences', icon: Settings },
    { id: 'privacy' as const, label: 'Privacy', icon: Shield },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Profile Settings
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Manage your profile information and account settings.
        </p>
        {successMessage && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Profile Summary Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-6">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-2xl font-bold">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                {isEditing && (
                  <div className="absolute bottom-0 right-0">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="avatar-upload"
                      onChange={handleAvatarUpload}
                      disabled={uploading}
                    />
                    <label
                      htmlFor="avatar-upload"
                      className={`relative inline-flex items-center justify-center p-2 rounded-full shadow-lg cursor-pointer transition-all duration-200 ${
                        uploading 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95'
                      }`}
                      title={uploading ? "Uploading..." : "Click to upload profile picture"}
                    >
                      {uploading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      ) : (
                        <Camera className="h-4 w-4 text-white" />
                      )}
                    </label>
                    {uploading && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">
                        Uploading...
                      </div>
                    )}
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{user?.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{user?.position || user?.role}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            {/* Tab Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {tabs.find(tab => tab.id === activeTab)?.label} Information
                </h2>
                <div className="flex space-x-3">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={() => resetTab(activeTab)} disabled={loading}>
                        Reset
                      </Button>
                      <Button variant="outline" onClick={handleCancel} disabled={loading}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave} disabled={loading}>
                        {loading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </div>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
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
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={user?.name || ''}
                          disabled
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => {
                            // Basic phone number formatting
                            const value = e.target.value.replace(/\D/g, '');
                            let formatted = value;
                            if (value.length >= 6) {
                              formatted = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                            } else if (value.length >= 3) {
                              formatted = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                            }
                            setProfile(prev => ({ ...prev, phone: formatted }));
                          }}
                          disabled={!isEditing}
                          placeholder="+1 (555) 123-4567"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={profile.location}
                          onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                          disabled={!isEditing}
                          placeholder="City, State"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={!isEditing}
                      rows={4}
                      placeholder="Tell us about yourself, your recruiting experience, and your company..."
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  {/* Social Links */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Social Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          LinkedIn URL
                        </label>
                        <input
                          type="url"
                          value={profile.linkedin}
                          onChange={(e) => setProfile(prev => ({ ...prev, linkedin: e.target.value }))}
                          disabled={!isEditing}
                          placeholder="https://linkedin.com/in/yourprofile"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        {profile.linkedin && !profile.linkedin.startsWith('http') && profile.linkedin.trim() && (
                          <p className="text-xs text-orange-600 mt-1">Please include http:// or https://</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Website
                        </label>
                        <input
                          type="url"
                          value={profile.website}
                          onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                          disabled={!isEditing}
                          placeholder="https://yourcompany.com"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        {profile.website && !profile.website.startsWith('http') && profile.website.trim() && (
                          <p className="text-xs text-orange-600 mt-1">Please include http:// or https://</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'company' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Company Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={profile.company}
                          onChange={(e) => setProfile(prev => ({ ...prev, company: e.target.value }))}
                          disabled={!isEditing}
                          placeholder="Your company name"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Company Size
                        </label>
                        <select
                          value={profile.companySize}
                          onChange={(e) => setProfile(prev => ({ ...prev, companySize: e.target.value }))}
                          disabled={!isEditing}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          <option value="">Select company size</option>
                          {companySizes.map((size) => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Industry
                        </label>
                        <select
                          value={profile.industry}
                          onChange={(e) => setProfile(prev => ({ ...prev, industry: e.target.value }))}
                          disabled={!isEditing}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          <option value="">Select industry</option>
                          {industries.map((industry) => (
                            <option key={industry} value={industry}>{industry}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profile.hiringManager}
                        onChange={(e) => setProfile(prev => ({ ...prev, hiringManager: e.target.checked }))}
                        disabled={!isEditing}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:bg-gray-50"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        I am a hiring manager
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notification Preferences</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                        { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive notifications via SMS' },
                        { key: 'weeklyReports', label: 'Weekly Reports', description: 'Get weekly hiring reports' },
                        { key: 'candidateUpdates', label: 'Candidate Updates', description: 'Notifications about candidate status changes' },
                        { key: 'jobAlerts', label: 'Job Alerts', description: 'Alerts about new job postings' },
                      ].map((pref) => (
                        <div key={pref.key} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{pref.label}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{pref.description}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={profile.preferences[pref.key as keyof typeof profile.preferences]}
                            onChange={(e) => setProfile(prev => ({
                              ...prev,
                              preferences: {
                                ...prev.preferences,
                                [pref.key]: e.target.checked
                              }
                            }))}
                            disabled={!isEditing}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:bg-gray-50"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Privacy Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Profile Visibility
                        </label>
                        <select
                          value={profile.privacy.profileVisibility}
                          onChange={(e) => setProfile(prev => ({
                            ...prev,
                            privacy: {
                              ...prev.privacy,
                              profileVisibility: e.target.value as 'public' | 'private'
                            }
                          }))}
                          disabled={!isEditing}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                        </select>
                      </div>

                      <div className="space-y-3">
                        {[
                          { key: 'showEmail', label: 'Show Email Address', description: 'Display email on your public profile' },
                          { key: 'showPhone', label: 'Show Phone Number', description: 'Display phone on your public profile' },
                          { key: 'allowDirectContact', label: 'Allow Direct Contact', description: 'Let candidates contact you directly' },
                        ].map((setting) => (
                          <div key={setting.key} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">{setting.label}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{setting.description}</p>
                            </div>
                            <input
                              type="checkbox"
                              checked={profile.privacy[setting.key as keyof typeof profile.privacy] as boolean}
                              onChange={(e) => setProfile(prev => ({
                                ...prev,
                                privacy: {
                                  ...prev.privacy,
                                  [setting.key]: e.target.checked
                                }
                              }))}
                              disabled={!isEditing}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:bg-gray-50"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterProfilePage;