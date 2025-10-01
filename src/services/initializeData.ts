// Initialize default data for the application
import { mockAssessmentsData } from './mockAssessmentsData';

export const initializeDefaultData = () => {
  // Initialize comprehensive mock data for Sarah Wilson (recruiter ID: 2)
  console.log('Initializing comprehensive mock data...');
  
  // Check if data already exists to avoid overwriting user applications
  const existingJobs = localStorage.getItem('msw_jobs');
  const existingApplications = localStorage.getItem('msw_applications');
  const existingAssessments = localStorage.getItem('msw_assessments');
  
  if (existingJobs && existingApplications && existingAssessments) {
    console.log('Data already exists, skipping initialization to preserve user data');
    return;
  }
  
  // Only clear if no data exists
  if (!existingJobs) localStorage.removeItem('msw_jobs');
  if (!existingApplications) localStorage.removeItem('msw_applications');
  if (!existingAssessments) localStorage.removeItem('msw_assessments');
  if (!localStorage.getItem('msw_candidates')) localStorage.removeItem('msw_candidates');
  
  // Initialize comprehensive jobs data (only if no jobs exist)
  if (!existingJobs) {
    const defaultJobs = [
      // Frontend Development Roles
      {
        id: 'job_1',
        title: 'Senior Frontend Developer',
        company: 'TechCorp',
        location: 'San Francisco, CA',
        type: 'Full-time',
        salary: { min: 120, max: 160, currency: 'USD', period: 'year' },
        postedAt: '2024-01-15',
        experience: '5+ years',
        description: 'Lead frontend development using React, TypeScript, and modern web technologies. Build scalable user interfaces and mentor junior developers.',
        applicationsCount: 45,
        status: 'active',
        recruiterId: '2'
      },
      {
        id: 'job_2',
        title: 'React Developer',
        company: 'InnovateTech',
        location: 'Remote',
        type: 'Full-time',
        salary: { min: 80, max: 120, currency: 'USD', period: 'year' },
        postedAt: '2024-01-18',
        experience: '3+ years',
        description: 'Develop responsive web applications using React.js, Redux, and modern CSS frameworks. Collaborate with design and backend teams.',
        applicationsCount: 32,
        status: 'active',
        recruiterId: '2'
      },
      {
        id: 'job_3',
        title: 'Vue.js Developer',
        company: 'WebSolutions',
        location: 'Austin, TX',
        type: 'Full-time',
        salary: { min: 75, max: 110, currency: 'USD', period: 'year' },
        postedAt: '2024-01-20',
        experience: '2+ years',
        description: 'Build dynamic web applications using Vue.js ecosystem. Work with Nuxt.js, Vuex, and modern JavaScript features.',
        applicationsCount: 28,
        status: 'active',
        recruiterId: '2'
      },
      {
        id: 'job_4',
        title: 'Senior Backend Developer',
        company: 'DataFlow',
        location: 'New York, NY',
        type: 'Full-time',
        salary: { min: 130, max: 180, currency: 'USD', period: 'year' },
        postedAt: '2024-01-16',
        experience: '6+ years',
        description: 'Design and implement scalable backend systems using Node.js, Python, and cloud technologies. Lead API development and database architecture.',
        applicationsCount: 38,
        status: 'active',
        recruiterId: '2'
      },
      {
        id: 'job_5',
        title: 'Python Developer',
        company: 'AI Solutions',
        location: 'Seattle, WA',
        type: 'Full-time',
        salary: { min: 90, max: 130, currency: 'USD', period: 'year' },
        postedAt: '2024-01-22',
        experience: '4+ years',
        description: 'Develop Python applications, APIs, and data processing pipelines. Work with Django, FastAPI, and machine learning libraries.',
        applicationsCount: 41,
        status: 'active',
        recruiterId: '2'
      },
      {
        id: 'job_6',
        title: 'Java Developer',
        company: 'Enterprise Systems',
        location: 'Chicago, IL',
        type: 'Full-time',
        salary: { min: 85, max: 125, currency: 'USD', period: 'year' },
        postedAt: '2024-01-24',
        experience: '3+ years',
        description: 'Build enterprise-grade applications using Java, Spring Boot, and microservices architecture. Work with relational databases.',
        applicationsCount: 35,
        status: 'active',
        recruiterId: '2'
      },
      {
        id: 'job_7',
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        location: 'Los Angeles, CA',
        type: 'Full-time',
        salary: { min: 95, max: 140, currency: 'USD', period: 'year' },
        postedAt: '2024-01-25',
        experience: '4+ years',
        description: 'Build end-to-end web applications using modern technologies. Frontend: React/Next.js, Backend: Node.js/Python, Database: PostgreSQL/MongoDB.',
        applicationsCount: 52,
        status: 'active',
        recruiterId: '2'
      },
      {
        id: 'job_8',
        title: 'MERN Stack Developer',
        company: 'WebCraft',
        location: 'Remote',
        type: 'Full-time',
        salary: { min: 70, max: 110, currency: 'USD', period: 'year' },
        postedAt: '2024-01-26',
        experience: '3+ years',
        description: 'Develop full-stack applications using MongoDB, Express.js, React, and Node.js. Build RESTful APIs and responsive user interfaces.',
        applicationsCount: 29,
        status: 'active',
        recruiterId: '2'
      },
      {
        id: 'job_9',
        title: 'React Native Developer',
        company: 'MobileFirst',
        location: 'Miami, FL',
        type: 'Full-time',
        salary: { min: 85, max: 125, currency: 'USD', period: 'year' },
        postedAt: '2024-01-28',
        experience: '3+ years',
        description: 'Build cross-platform mobile applications using React Native. Work with native modules, state management, and mobile UI/UX.',
        applicationsCount: 33,
        status: 'active',
        recruiterId: '2'
      },
      {
        id: 'job_10',
        title: 'iOS Developer',
        company: 'AppStudio',
        location: 'Denver, CO',
        type: 'Full-time',
        salary: { min: 100, max: 150, currency: 'USD', period: 'year' },
        postedAt: '2024-01-30',
        experience: '4+ years',
        description: 'Develop native iOS applications using Swift and Objective-C. Work with Core Data, UIKit, and SwiftUI frameworks.',
        applicationsCount: 26,
        status: 'active',
        recruiterId: '2'
      },
      {
        id: 'job_11',
        title: 'Android Developer',
        company: 'MobileTech',
        location: 'Portland, OR',
        type: 'Full-time',
        salary: { min: 90, max: 135, currency: 'USD', period: 'year' },
        postedAt: '2024-02-01',
        experience: '4+ years',
        description: 'Build native Android applications using Kotlin and Java. Work with Jetpack components, Room database, and Material Design.',
        applicationsCount: 31,
        status: 'active',
        recruiterId: '2'
      },
      {
        id: 'job_12',
        title: 'DevOps Engineer',
        company: 'CloudScale',
        location: 'Remote',
        type: 'Full-time',
        salary: { min: 110, max: 160, currency: 'USD', period: 'year' },
        postedAt: '2024-02-02',
        experience: '5+ years',
        description: 'Design and implement CI/CD pipelines, infrastructure as code, and cloud architectures using AWS, Docker, and Kubernetes.',
        applicationsCount: 24,
        status: 'active',
        recruiterId: '2'
      },
      {
        id: 'job_13',
        title: 'AWS Solutions Architect',
        company: 'CloudFirst',
        location: 'Phoenix, AZ',
        type: 'Full-time',
        salary: { min: 120, max: 170, currency: 'USD', period: 'year' },
        postedAt: '2024-02-03',
        experience: '6+ years',
        description: 'Design scalable cloud solutions on AWS. Implement serverless architectures, microservices, and cloud security best practices.',
        applicationsCount: 19,
        status: 'active',
        recruiterId: '2'
      },
      {
        id: 'job_14',
        title: 'Data Scientist',
        company: 'DataInsights',
        location: 'Boston, MA',
        type: 'Full-time',
        salary: { min: 110, max: 160, currency: 'USD', period: 'year' },
        postedAt: '2024-02-04',
        experience: '4+ years',
        description: 'Analyze complex datasets, build machine learning models, and create data-driven insights using Python, R, and SQL.',
        applicationsCount: 37,
        status: 'active',
        recruiterId: '2'
      },
      {
        id: 'job_15',
        title: 'Machine Learning Engineer',
        company: 'AITech',
        location: 'San Jose, CA',
        type: 'Full-time',
        salary: { min: 130, max: 180, currency: 'USD', period: 'year' },
        postedAt: '2024-02-05',
        experience: '5+ years',
        description: 'Build and deploy machine learning models in production. Work with TensorFlow, PyTorch, and MLOps practices.',
        applicationsCount: 28,
        status: 'active',
        recruiterId: '2'
      },
      {
        id: 'job_16',
        title: 'Data Engineer',
        company: 'BigData Corp',
        location: 'Remote',
        type: 'Full-time',
        salary: { min: 95, max: 140, currency: 'USD', period: 'year' },
        postedAt: '2024-02-06',
        experience: '4+ years',
        description: 'Build and maintain data pipelines, ETL processes, and data warehouses using Apache Spark, Kafka, and cloud platforms.',
        applicationsCount: 22,
        status: 'active',
        recruiterId: '2'
      },
      {
        id: 'job_17',
        title: 'Senior UI/UX Designer',
        company: 'DesignStudio',
        location: 'Remote',
        type: 'Full-time',
        salary: { min: 90, max: 130, currency: 'USD', period: 'year' },
        postedAt: '2024-02-07',
        experience: '5+ years',
        description: 'Create user-centered designs for web and mobile applications. Lead design systems, user research, and prototyping.',
        applicationsCount: 43,
        status: 'active',
        recruiterId: '2'
      },
      {
        id: 'job_18',
        title: 'Product Designer',
        company: 'ProductCo',
        location: 'San Diego, CA',
        type: 'Full-time',
        salary: { min: 85, max: 125, currency: 'USD', period: 'year' },
        postedAt: '2024-02-08',
        experience: '4+ years',
        description: 'Design end-to-end user experiences for digital products. Conduct user research, create wireframes, and collaborate with development teams.',
        applicationsCount: 36,
        status: 'active',
        recruiterId: '2'
      },
      {
        id: 'job_19',
        title: 'QA Automation Engineer',
        company: 'TestTech',
        location: 'Atlanta, GA',
        type: 'Full-time',
        salary: { min: 75, max: 115, currency: 'USD', period: 'year' },
        postedAt: '2024-02-09',
        experience: '3+ years',
        description: 'Develop automated test suites using Selenium, Cypress, and other testing frameworks. Ensure software quality and reliability.',
        applicationsCount: 27,
        status: 'active',
        recruiterId: '2'
      },
      {
        id: 'job_20',
        title: 'Performance Test Engineer',
        company: 'LoadTest Inc',
        location: 'Remote',
        type: 'Full-time',
        salary: { min: 80, max: 120, currency: 'USD', period: 'year' },
        postedAt: '2024-02-10',
        experience: '4+ years',
        description: 'Design and execute performance tests using tools like JMeter, LoadRunner. Optimize application performance and scalability.',
        applicationsCount: 21,
        status: 'active',
        recruiterId: '2'
      },
      {
        id: 'job_21',
        title: 'Cybersecurity Analyst',
        company: 'SecureTech',
        location: 'Washington, DC',
        type: 'Full-time',
        salary: { min: 85, max: 130, currency: 'USD', period: 'year' },
        postedAt: '2024-02-11',
        experience: '3+ years',
        description: 'Monitor and analyze security threats, implement security controls, and conduct vulnerability assessments.',
        applicationsCount: 18,
        status: 'active',
        recruiterId: '2'
      },
      {
        id: 'job_22',
        title: 'Penetration Tester',
        company: 'HackSecure',
        location: 'Remote',
        type: 'Full-time',
        salary: { min: 95, max: 145, currency: 'USD', period: 'year' },
        postedAt: '2024-02-12',
        experience: '4+ years',
        description: 'Conduct ethical hacking assessments, vulnerability testing, and security audits of web applications and networks.',
        applicationsCount: 15,
        status: 'active',
        recruiterId: '2'
      },
      {
        id: 'job_23',
        title: 'Blockchain Developer',
        company: 'CryptoBuild',
        location: 'Remote',
        type: 'Full-time',
        salary: { min: 100, max: 150, currency: 'USD', period: 'year' },
        postedAt: '2024-02-13',
        experience: '3+ years',
        description: 'Develop smart contracts using Solidity, build DeFi applications, and work with blockchain technologies like Ethereum.',
        applicationsCount: 23,
        status: 'active',
        recruiterId: '2'
      },
      {
        id: 'job_24',
        title: 'Web3 Frontend Developer',
        company: 'DeFi Solutions',
        location: 'Remote',
        type: 'Full-time',
        salary: { min: 90, max: 135, currency: 'USD', period: 'year' },
        postedAt: '2024-02-14',
        experience: '3+ years',
        description: 'Build decentralized application frontends using React, Web3.js, and integrate with blockchain networks and wallets.',
        applicationsCount: 20,
        status: 'active',
        recruiterId: '2'
      },
      {
        id: 'job_25',
        title: 'Unity Game Developer',
        company: 'GameStudio',
        location: 'Austin, TX',
        type: 'Full-time',
        salary: { min: 70, max: 110, currency: 'USD', period: 'year' },
        postedAt: '2024-02-15',
        experience: '3+ years',
        description: 'Develop 2D and 3D games using Unity engine, C#, and game development best practices. Work on mobile and PC platforms.',
        applicationsCount: 25,
        status: 'active',
        recruiterId: '2'
      },
      {
        id: 'job_26',
        title: 'Technical Writer',
        company: 'DocuTech',
        location: 'Remote',
        type: 'Full-time',
        salary: { min: 60, max: 90, currency: 'USD', period: 'year' },
        postedAt: '2024-02-16',
        experience: '2+ years',
        description: 'Create technical documentation, API docs, and user guides for software products. Work with development teams.',
        applicationsCount: 19,
        status: 'active',
        recruiterId: '2'
      },
      {
        id: 'job_27',
        title: 'Technical Project Manager',
        company: 'ProjectFlow',
        location: 'Remote',
        type: 'Full-time',
        salary: { min: 85, max: 125, currency: 'USD', period: 'year' },
        postedAt: '2024-02-17',
        experience: '5+ years',
        description: 'Manage software development projects using Agile methodologies. Coordinate between development, design, and business teams.',
        applicationsCount: 17,
        status: 'active',
        recruiterId: '2'
      },
      {
        id: 'job_28',
        title: 'Sales Engineer',
        company: 'TechSales',
        location: 'Remote',
        type: 'Full-time',
        salary: { min: 80, max: 120, currency: 'USD', period: 'year' },
        postedAt: '2024-02-18',
        experience: '3+ years',
        description: 'Bridge technical and sales teams, conduct product demonstrations, and provide technical solutions to enterprise clients.',
        applicationsCount: 14,
        status: 'active',
        recruiterId: '2'
      }
    ];
    localStorage.setItem('msw_jobs', JSON.stringify(defaultJobs));
    console.log(`Loaded ${defaultJobs.length} comprehensive mock jobs`);
  }

  // Initialize applications data with comprehensive mock applications and assessment results (only if no applications exist)
  if (!existingApplications) {
    const defaultApplications = [
      // Frontend Developer Applications
      {
        id: 'app_1',
        userId: 'employee_1',
        userName: 'John Doe',
        userEmail: 'john.doe@example.com',
        jobId: 'job_1',
        jobTitle: 'Senior Frontend Developer',
        company: 'TechCorp',
        appliedAt: '2024-01-20T10:30:00Z',
        status: 'Under Review',
        assessmentCompleted: true,
        assessmentScore: 87
      },
      {
        id: 'app_2',
        userId: 'employee_2',
        userName: 'Jane Smith',
        userEmail: 'jane.smith@example.com',
        jobId: 'job_2',
        jobTitle: 'React Developer',
        company: 'InnovateTech',
        appliedAt: '2024-01-19T14:15:00Z',
        status: 'Shortlisted',
        assessmentCompleted: true,
        assessmentScore: 92
      },
      {
        id: 'app_3',
        userId: 'employee_3',
        userName: 'Mike Johnson',
        userEmail: 'mike.johnson@example.com',
        jobId: 'job_3',
        jobTitle: 'Vue.js Developer',
        company: 'WebSolutions',
        appliedAt: '2024-01-18T09:45:00Z',
        status: 'Interview Scheduled',
        assessmentCompleted: true,
        assessmentScore: 79
      },
      
      // Backend Developer Applications
      {
        id: 'app_4',
        userId: 'employee_4',
        userName: 'Sarah Wilson',
        userEmail: 'sarah.wilson@example.com',
        jobId: 'job_4',
        jobTitle: 'Senior Backend Developer',
        company: 'DataFlow',
        appliedAt: '2024-01-17T16:20:00Z',
        status: 'Under Review',
        assessmentCompleted: true,
        assessmentScore: 94
      },
      {
        id: 'app_5',
        userId: 'employee_5',
        userName: 'David Brown',
        userEmail: 'david.brown@example.com',
        jobId: 'job_5',
        jobTitle: 'Python Developer',
        company: 'AI Solutions',
        appliedAt: '2024-01-16T11:30:00Z',
        status: 'Hired',
        assessmentCompleted: true,
        assessmentScore: 96
      },
      {
        id: 'app_6',
        userId: 'employee_6',
        userName: 'Emily Davis',
        userEmail: 'emily.davis@example.com',
        jobId: 'job_6',
        jobTitle: 'Java Developer',
        company: 'Enterprise Systems',
        appliedAt: '2024-02-06T13:10:00Z',
        status: 'Under Review',
        assessmentCompleted: true,
        assessmentScore: 83
      },
      
      // Full Stack Developer Applications
      {
        id: 'app_7',
        userId: 'employee_7',
        userName: 'Alex Chen',
        userEmail: 'alex.chen@example.com',
        jobId: 'job_7',
        jobTitle: 'Full Stack Developer',
        company: 'StartupXYZ',
        appliedAt: '2024-01-15T08:45:00Z',
        status: 'Shortlisted',
        assessmentCompleted: true,
        assessmentScore: 89
      },
      {
        id: 'app_8',
        userId: 'employee_8',
        userName: 'Lisa Wang',
        userEmail: 'lisa.wang@example.com',
        jobId: 'job_8',
        jobTitle: 'MERN Stack Developer',
        company: 'WebCraft',
        appliedAt: '2024-01-14T12:20:00Z',
        status: 'Interview Scheduled',
        assessmentCompleted: true,
        assessmentScore: 91
      },
      
      // Mobile Developer Applications
      {
        id: 'app_9',
        userId: 'employee_9',
        userName: 'Tom Rodriguez',
        userEmail: 'tom.rodriguez@example.com',
        jobId: 'job_9',
        jobTitle: 'React Native Developer',
        company: 'MobileFirst',
        appliedAt: '2024-01-13T15:30:00Z',
        status: 'Under Review',
        assessmentCompleted: true,
        assessmentScore: 85
      },
      {
        id: 'app_10',
        userId: 'employee_10',
        userName: 'Maria Garcia',
        userEmail: 'maria.garcia@example.com',
        jobId: 'job_10',
        jobTitle: 'iOS Developer',
        company: 'AppStudio',
        appliedAt: '2024-01-12T10:15:00Z',
        status: 'Hired',
        assessmentCompleted: true,
        assessmentScore: 93
      },
      
      // DevOps Applications
      {
        id: 'app_11',
        userId: 'employee_11',
        userName: 'Kevin Park',
        userEmail: 'kevin.park@example.com',
        jobId: 'job_11',
        jobTitle: 'DevOps Engineer',
        company: 'CloudScale',
        appliedAt: '2024-01-11T14:45:00Z',
        status: 'Shortlisted',
        assessmentCompleted: true,
        assessmentScore: 88
      },
      {
        id: 'app_12',
        userId: 'employee_12',
        userName: 'Rachel Kim',
        userEmail: 'rachel.kim@example.com',
        jobId: 'job_12',
        jobTitle: 'AWS Solutions Architect',
        company: 'CloudFirst',
        appliedAt: '2024-01-10T09:30:00Z',
        status: 'Under Review',
        assessmentCompleted: true,
        assessmentScore: 82
      },
      
      // Data Science Applications
      {
        id: 'app_13',
        userId: 'employee_13',
        userName: 'James Wilson',
        userEmail: 'james.wilson@example.com',
        jobId: 'job_13',
        jobTitle: 'Data Scientist',
        company: 'DataInsights',
        appliedAt: '2024-01-09T11:20:00Z',
        status: 'Interview Scheduled',
        assessmentCompleted: true,
        assessmentScore: 95
      },
      {
        id: 'app_14',
        userId: 'employee_14',
        userName: 'Anna Thompson',
        userEmail: 'anna.thompson@example.com',
        jobId: 'job_14',
        jobTitle: 'Machine Learning Engineer',
        company: 'AITech',
        appliedAt: '2024-01-08T16:10:00Z',
        status: 'Hired',
        assessmentCompleted: true,
        assessmentScore: 97
      },
      
      // UI/UX Designer Applications
      {
        id: 'app_15',
        userId: 'employee_15',
        userName: 'Sophie Martin',
        userEmail: 'sophie.martin@example.com',
        jobId: 'job_15',
        jobTitle: 'Senior UI/UX Designer',
        company: 'DesignStudio',
        appliedAt: '2024-01-07T13:45:00Z',
        status: 'Under Review',
        assessmentCompleted: true,
        assessmentScore: 90
      },
      {
        id: 'app_16',
        userId: 'employee_16',
        userName: 'Daniel Lee',
        userEmail: 'daniel.lee@example.com',
        jobId: 'job_16',
        jobTitle: 'Product Designer',
        company: 'ProductCo',
        appliedAt: '2024-01-06T10:30:00Z',
        status: 'Shortlisted',
        assessmentCompleted: true,
        assessmentScore: 86
      },
      
      // QA Engineer Applications
      {
        id: 'app_17',
        userId: 'employee_17',
        userName: 'Chris Taylor',
        userEmail: 'chris.taylor@example.com',
        jobId: 'job_17',
        jobTitle: 'QA Automation Engineer',
        company: 'TestTech',
        appliedAt: '2024-01-05T15:20:00Z',
        status: 'Interview Scheduled',
        assessmentCompleted: true,
        assessmentScore: 84
      },
      {
        id: 'app_18',
        userId: 'employee_18',
        userName: 'Nina Patel',
        userEmail: 'nina.patel@example.com',
        jobId: 'job_18',
        jobTitle: 'Performance Test Engineer',
        company: 'LoadTest Inc',
        appliedAt: '2024-01-04T12:15:00Z',
        status: 'Under Review',
        assessmentCompleted: true,
        assessmentScore: 87
      },
      
      // Cybersecurity Applications
      {
        id: 'app_19',
        userId: 'employee_19',
        userName: 'Ryan O\'Connor',
        userEmail: 'ryan.oconnor@example.com',
        jobId: 'job_19',
        jobTitle: 'Cybersecurity Analyst',
        company: 'SecureTech',
        appliedAt: '2024-01-03T14:30:00Z',
        status: 'Hired',
        assessmentCompleted: true,
        assessmentScore: 92
      },
      {
        id: 'app_20',
        userId: 'employee_20',
        userName: 'Zoe Anderson',
        userEmail: 'zoe.anderson@example.com',
        jobId: 'job_20',
        jobTitle: 'Penetration Tester',
        company: 'HackSecure',
        appliedAt: '2024-01-02T09:45:00Z',
        status: 'Shortlisted',
        assessmentCompleted: true,
        assessmentScore: 89
      },
      
      // Blockchain Applications
      {
        id: 'app_21',
        userId: 'employee_21',
        userName: 'Marcus Johnson',
        userEmail: 'marcus.johnson@example.com',
        jobId: 'job_21',
        jobTitle: 'Blockchain Developer',
        company: 'CryptoBuild',
        appliedAt: '2024-01-01T11:20:00Z',
        status: 'Under Review',
        assessmentCompleted: true,
        assessmentScore: 91
      },
      {
        id: 'app_22',
        userId: 'employee_22',
        userName: 'Isabella Clark',
        userEmail: 'isabella.clark@example.com',
        jobId: 'job_22',
        jobTitle: 'Web3 Frontend Developer',
        company: 'DeFi Solutions',
        appliedAt: '2023-12-31T16:10:00Z',
        status: 'Interview Scheduled',
        assessmentCompleted: true,
        assessmentScore: 88
      },
      
      // Specialized Role Applications
      {
        id: 'app_23',
        userId: 'employee_23',
        userName: 'Oliver White',
        userEmail: 'oliver.white@example.com',
        jobId: 'job_23',
        jobTitle: 'Unity Game Developer',
        company: 'GameStudio',
        appliedAt: '2023-12-30T13:45:00Z',
        status: 'Hired',
        assessmentCompleted: true,
        assessmentScore: 93
      },
      {
        id: 'app_24',
        userId: 'employee_24',
        userName: 'Grace Miller',
        userEmail: 'grace.miller@example.com',
        jobId: 'job_24',
        jobTitle: 'Technical Writer',
        company: 'DocuTech',
        appliedAt: '2023-12-29T10:30:00Z',
        status: 'Under Review',
        assessmentCompleted: true,
        assessmentScore: 85
      },
      
      // Project Management Applications
      {
        id: 'app_25',
        userId: 'employee_25',
        userName: 'Lucas Moore',
        userEmail: 'lucas.moore@example.com',
        jobId: 'job_25',
        jobTitle: 'Technical Project Manager',
        company: 'ProjectFlow',
        appliedAt: '2023-12-28T15:20:00Z',
        status: 'Shortlisted',
        assessmentCompleted: true,
        assessmentScore: 87
      },
      {
        id: 'app_26',
        userId: 'employee_26',
        userName: 'Emma Turner',
        userEmail: 'emma.turner@example.com',
        jobId: 'job_26',
        jobTitle: 'Sales Engineer',
        company: 'TechSales',
        appliedAt: '2023-12-27T12:15:00Z',
        status: 'Interview Scheduled',
        assessmentCompleted: true,
        assessmentScore: 82
      },
      
      // Data Engineering Applications
      {
        id: 'app_27',
        userId: 'employee_27',
        userName: 'Noah Harris',
        userEmail: 'noah.harris@example.com',
        jobId: 'job_27',
        jobTitle: 'Data Engineer',
        company: 'BigData Corp',
        appliedAt: '2023-12-26T14:30:00Z',
        status: 'Hired',
        assessmentCompleted: true,
        assessmentScore: 94
      },
      {
        id: 'app_28',
        userId: 'employee_28',
        userName: 'Ava Martinez',
        userEmail: 'ava.martinez@example.com',
        jobId: 'job_28',
        jobTitle: 'Android Developer',
        company: 'MobileTech',
        appliedAt: '2023-12-25T09:45:00Z',
        status: 'Under Review',
        assessmentCompleted: true,
        assessmentScore: 86
      }
    ];
    localStorage.setItem('msw_applications', JSON.stringify(defaultApplications));
    console.log(`Loaded ${defaultApplications.length} mock applications`);
  }

  // Initialize comprehensive assessments data (force load new assessments)
  // Clear any existing assessments first to avoid conflicts
  localStorage.removeItem('msw_assessments');
  localStorage.setItem('msw_assessments', JSON.stringify(mockAssessmentsData));
  console.log(`Loaded ${mockAssessmentsData.length} comprehensive assessments`);

  // Initialize candidates data
  const defaultCandidates: any[] = [];
  localStorage.setItem('msw_candidates', JSON.stringify(defaultCandidates));
  console.log('Initialized empty candidates array');
  
  console.log('✅ All comprehensive mock data initialized successfully!');
};
