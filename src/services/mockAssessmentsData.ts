// Comprehensive mock assessments data for Sarah Wilson's jobs

export const mockAssessmentsData = [
  // Assessment for Senior Frontend Developer (job_1)
  {
    id: 'assessment_1',
    title: 'Senior Frontend Developer Assessment',
    description: 'Comprehensive assessment for senior frontend development role covering React, TypeScript, and modern web technologies.',
    type: 'technical',
    duration: 90,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'What is the primary purpose of React hooks?',
        options: ['To replace class components', 'To manage state and side effects in functional components', 'To improve performance', 'To simplify JSX syntax'],
        correctAnswer: 1,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        question: 'Which TypeScript feature helps ensure type safety at compile time?',
        options: ['Dynamic typing', 'Type inference', 'Static typing', 'Runtime type checking'],
        correctAnswer: 2,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q3',
        type: 'text',
        question: 'Explain the difference between controlled and uncontrolled components in React.',
        points: 15,
        timeLimit: 120
      },
      {
        id: 'q4',
        type: 'multiple-choice',
        question: 'What is the time complexity of adding an element to the beginning of an array in JavaScript?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 2,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q5',
        type: 'integer',
        question: 'How many times will the useEffect hook run if the dependency array is empty?',
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q6',
        type: 'multiple-choice',
        question: 'Which CSS property is used to create responsive layouts without media queries?',
        options: ['Flexbox', 'Grid', 'Both Flexbox and Grid', 'Float'],
        correctAnswer: 2,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q7',
        type: 'text',
        question: 'Describe the Virtual DOM and explain how it improves React performance.',
        points: 15,
        timeLimit: 120
      },
      {
        id: 'q8',
        type: 'multiple-choice',
        question: 'What is the purpose of the useMemo hook?',
        options: ['To store data in localStorage', 'To memoize expensive calculations', 'To create side effects', 'To manage component state'],
        correctAnswer: 1,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q9',
        type: 'integer',
        question: 'What is the maximum number of props a React component can accept?',
        points: 5,
        timeLimit: 30
      },
      {
        id: 'q10',
        type: 'text',
        question: 'Write a React component that fetches data from an API and displays it in a list.',
        points: 20,
        timeLimit: 180
      },
      {
        id: 'q11',
        type: 'multiple-choice',
        question: 'Which method is used to prevent unnecessary re-renders in React?',
        options: ['React.memo', 'useCallback', 'useMemo', 'All of the above'],
        correctAnswer: 3,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q12',
        type: 'text',
        question: 'Explain the concept of code splitting in React and how to implement it.',
        points: 15,
        timeLimit: 120
      }
    ],
    passingScore: 70,
    jobId: 'job_1',
    jobTitle: 'Senior Frontend Developer',
    company: 'TechCorp',
    recruiterId: '2',
    status: 'active',
    createdAt: '2024-01-15T09:00:00Z'
  },

  // Assessment for React Developer (job_2)
  {
    id: 'assessment_2',
    title: 'React Developer Assessment',
    description: 'Technical assessment for React developer position covering React.js, Redux, and modern frontend development.',
    type: 'technical',
    duration: 75,
    questions: [
      {
        id: 'q13',
        type: 'multiple-choice',
        question: 'What is the correct way to update state in a functional component?',
        options: ['this.setState()', 'useState hook', 'setState()', 'updateState()'],
        correctAnswer: 1,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q14',
        type: 'multiple-choice',
        question: 'Which Redux function is used to dispatch actions?',
        options: ['mapStateToProps', 'connect', 'dispatch', 'useDispatch'],
        correctAnswer: 3,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q15',
        type: 'text',
        question: 'Explain the Redux data flow and the role of each component.',
        points: 15,
        timeLimit: 120
      },
      {
        id: 'q16',
        type: 'multiple-choice',
        question: 'What is JSX?',
        options: ['A JavaScript extension', 'A template engine', 'A CSS framework', 'A build tool'],
        correctAnswer: 0,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q17',
        type: 'integer',
        question: 'How many default props can a React component have?',
        points: 5,
        timeLimit: 30
      },
      {
        id: 'q18',
        type: 'multiple-choice',
        question: 'Which hook is used to perform side effects in functional components?',
        options: ['useState', 'useEffect', 'useContext', 'useReducer'],
        correctAnswer: 1,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q19',
        type: 'text',
        question: 'Write a simple React component that displays a counter with increment and decrement buttons.',
        points: 20,
        timeLimit: 150
      },
      {
        id: 'q20',
        type: 'multiple-choice',
        question: 'What is the purpose of keys in React lists?',
        options: ['To improve performance', 'To identify components uniquely', 'To sort items', 'Both A and B'],
        correctAnswer: 3,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q21',
        type: 'text',
        question: 'Explain the difference between props and state in React.',
        points: 15,
        timeLimit: 120
      },
      {
        id: 'q22',
        type: 'integer',
        question: 'What is the minimum number of components needed to create a React application?',
        points: 5,
        timeLimit: 30
      },
      {
        id: 'q23',
        type: 'multiple-choice',
        question: 'Which lifecycle method is equivalent to useEffect with empty dependency array?',
        options: ['componentDidMount', 'componentDidUpdate', 'componentWillUnmount', 'componentWillMount'],
        correctAnswer: 0,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q24',
        type: 'text',
        question: 'Describe how to handle forms in React using controlled components.',
        points: 15,
        timeLimit: 120
      }
    ],
    passingScore: 65,
    jobId: 'job_2',
    jobTitle: 'React Developer',
    company: 'InnovateTech',
    recruiterId: '2',
    status: 'active',
    createdAt: '2024-01-18T10:00:00Z'
  },

  // Assessment for Python Developer (job_5)
  {
    id: 'assessment_3',
    title: 'Python Developer Assessment',
    description: 'Comprehensive Python development assessment covering Django, FastAPI, and data processing.',
    type: 'technical',
    duration: 90,
    questions: [
      {
        id: 'q25',
        type: 'multiple-choice',
        question: 'What is the difference between a list and a tuple in Python?',
        options: ['Lists are mutable, tuples are immutable', 'Tuples are mutable, lists are immutable', 'No difference', 'Lists are faster'],
        correctAnswer: 0,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q26',
        type: 'multiple-choice',
        question: 'Which decorator is used to define a Django view?',
        options: ['@view', '@django_view', '@app.route', 'No decorator needed'],
        correctAnswer: 3,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q27',
        type: 'text',
        question: 'Explain the difference between GET and POST methods in Django views.',
        points: 15,
        timeLimit: 120
      },
      {
        id: 'q28',
        type: 'integer',
        question: 'What is the result of 7 // 3 in Python?',
        points: 5,
        timeLimit: 30
      },
      {
        id: 'q29',
        type: 'multiple-choice',
        question: 'Which Python framework is known for its automatic API documentation?',
        options: ['Django', 'Flask', 'FastAPI', 'Pyramid'],
        correctAnswer: 2,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q30',
        type: 'text',
        question: 'Write a Python function to find the factorial of a number using recursion.',
        points: 15,
        timeLimit: 120
      },
      {
        id: 'q31',
        type: 'multiple-choice',
        question: 'What is the purpose of Django migrations?',
        options: ['To move data between databases', 'To update database schema', 'To backup data', 'To optimize queries'],
        correctAnswer: 1,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q32',
        type: 'text',
        question: 'Explain the concept of Python virtual environments and how to create one.',
        points: 15,
        timeLimit: 120
      },
      {
        id: 'q33',
        type: 'integer',
        question: 'How many elements can a Python list theoretically contain?',
        points: 5,
        timeLimit: 30
      },
      {
        id: 'q34',
        type: 'multiple-choice',
        question: 'Which HTTP status code indicates a successful POST request?',
        options: ['200', '201', '204', '301'],
        correctAnswer: 1,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q35',
        type: 'text',
        question: 'Write a FastAPI endpoint that accepts JSON data and returns a response.',
        points: 20,
        timeLimit: 150
      },
      {
        id: 'q36',
        type: 'multiple-choice',
        question: 'What is the purpose of __init__.py in Python packages?',
        options: ['To initialize variables', 'To mark directory as package', 'To run initialization code', 'To import modules'],
        correctAnswer: 1,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q37',
        type: 'text',
        question: 'Explain the difference between synchronous and asynchronous programming in Python.',
        points: 15,
        timeLimit: 120
      }
    ],
    passingScore: 70,
    jobId: 'job_5',
    jobTitle: 'Python Developer',
    company: 'AI Solutions',
    recruiterId: '2',
    status: 'active',
    createdAt: '2024-01-22T11:00:00Z'
  },

  // Assessment for Data Scientist (job_14)
  {
    id: 'assessment_4',
    title: 'Data Scientist Assessment',
    description: 'Comprehensive assessment for data science role covering Python, R, SQL, and machine learning concepts.',
    type: 'technical',
    duration: 120,
    questions: [
      {
        id: 'q38',
        type: 'multiple-choice',
        question: 'Which Python library is primarily used for data manipulation and analysis?',
        options: ['NumPy', 'Pandas', 'Matplotlib', 'Scikit-learn'],
        correctAnswer: 1,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q39',
        type: 'multiple-choice',
        question: 'What is the purpose of cross-validation in machine learning?',
        options: ['To reduce overfitting', 'To increase model complexity', 'To speed up training', 'To reduce data size'],
        correctAnswer: 0,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q40',
        type: 'text',
        question: 'Explain the difference between supervised and unsupervised learning.',
        points: 15,
        timeLimit: 120
      },
      {
        id: 'q41',
        type: 'integer',
        question: 'What is the minimum number of features needed for principal component analysis?',
        points: 5,
        timeLimit: 30
      },
      {
        id: 'q42',
        type: 'multiple-choice',
        question: 'Which SQL function is used to find the average value?',
        options: ['SUM()', 'AVG()', 'COUNT()', 'MAX()'],
        correctAnswer: 1,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q43',
        type: 'text',
        question: 'Write a Python function to calculate the correlation coefficient between two arrays.',
        points: 20,
        timeLimit: 150
      },
      {
        id: 'q44',
        type: 'multiple-choice',
        question: 'What is the purpose of feature scaling in machine learning?',
        options: ['To reduce dataset size', 'To normalize feature ranges', 'To remove outliers', 'To increase accuracy'],
        correctAnswer: 1,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q45',
        type: 'text',
        question: 'Explain the concept of overfitting and how to prevent it.',
        points: 15,
        timeLimit: 120
      },
      {
        id: 'q46',
        type: 'integer',
        question: 'How many dimensions does a 2D array with shape (3, 4) have?',
        points: 5,
        timeLimit: 30
      },
      {
        id: 'q47',
        type: 'multiple-choice',
        question: 'Which algorithm is used for classification problems?',
        options: ['Linear Regression', 'Random Forest', 'K-Means', 'PCA'],
        correctAnswer: 1,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q48',
        type: 'text',
        question: 'Describe the steps involved in a typical machine learning pipeline.',
        points: 15,
        timeLimit: 120
      },
      {
        id: 'q49',
        type: 'multiple-choice',
        question: 'What is the purpose of the train_test_split function?',
        options: ['To merge datasets', 'To split data into training and testing sets', 'To normalize data', 'To remove duplicates'],
        correctAnswer: 1,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q50',
        type: 'text',
        question: 'Write SQL query to find the top 5 customers by total purchase amount.',
        points: 15,
        timeLimit: 120
      },
      {
        id: 'q51',
        type: 'integer',
        question: 'What is the maximum number of classes in a binary classification problem?',
        points: 5,
        timeLimit: 30
      }
    ],
    passingScore: 75,
    jobId: 'job_14',
    jobTitle: 'Data Scientist',
    company: 'DataInsights',
    recruiterId: '2',
    status: 'active',
    createdAt: '2024-02-04T09:00:00Z'
  },

  // Assessment for DevOps Engineer (job_12)
  {
    id: 'assessment_5',
    title: 'DevOps Engineer Assessment',
    description: 'Technical assessment for DevOps role covering CI/CD, Docker, Kubernetes, and cloud technologies.',
    type: 'technical',
    duration: 90,
    questions: [
      {
        id: 'q52',
        type: 'multiple-choice',
        question: 'What is the purpose of Docker containers?',
        options: ['To virtualize hardware', 'To package applications with dependencies', 'To replace virtual machines', 'To manage databases'],
        correctAnswer: 1,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q53',
        type: 'multiple-choice',
        question: 'Which Kubernetes component manages pods and services?',
        options: ['kubelet', 'kube-proxy', 'kube-apiserver', 'kube-controller-manager'],
        correctAnswer: 2,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q54',
        type: 'text',
        question: 'Explain the difference between continuous integration and continuous deployment.',
        points: 15,
        timeLimit: 120
      },
      {
        id: 'q55',
        type: 'integer',
        question: 'What is the default port for SSH connections?',
        points: 5,
        timeLimit: 30
      },
      {
        id: 'q56',
        type: 'multiple-choice',
        question: 'Which AWS service is used for container orchestration?',
        options: ['ECS', 'Lambda', 'S3', 'RDS'],
        correctAnswer: 0,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q57',
        type: 'text',
        question: 'Write a Dockerfile to create a Python web application container.',
        points: 20,
        timeLimit: 150
      },
      {
        id: 'q58',
        type: 'multiple-choice',
        question: 'What is Infrastructure as Code (IaC)?',
        options: ['Writing code in infrastructure', 'Managing infrastructure through code', 'Infrastructure programming', 'Code infrastructure'],
        correctAnswer: 1,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q59',
        type: 'text',
        question: 'Explain the concept of horizontal pod autoscaling in Kubernetes.',
        points: 15,
        timeLimit: 120
      },
      {
        id: 'q60',
        type: 'integer',
        question: 'How many replicas can a Kubernetes deployment have by default?',
        points: 5,
        timeLimit: 30
      },
      {
        id: 'q61',
        type: 'multiple-choice',
        question: 'Which tool is commonly used for infrastructure provisioning?',
        options: ['Jenkins', 'Terraform', 'Docker', 'Git'],
        correctAnswer: 1,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q62',
        type: 'text',
        question: 'Describe the benefits of using microservices architecture.',
        points: 15,
        timeLimit: 120
      },
      {
        id: 'q63',
        type: 'multiple-choice',
        question: 'What is the purpose of a load balancer?',
        options: ['To store data', 'To distribute traffic', 'To monitor systems', 'To backup data'],
        correctAnswer: 1,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q64',
        type: 'text',
        question: 'Write a basic Kubernetes deployment YAML for a web application.',
        points: 20,
        timeLimit: 150
      }
    ],
    passingScore: 70,
    jobId: 'job_12',
    jobTitle: 'DevOps Engineer',
    company: 'CloudScale',
    recruiterId: '2',
    status: 'active',
    createdAt: '2024-02-02T10:00:00Z'
  },

  // Assessment for UI/UX Designer (job_17)
  {
    id: 'assessment_6',
    title: 'UI/UX Designer Assessment',
    description: 'Design assessment covering user research, wireframing, prototyping, and design systems.',
    type: 'design',
    duration: 75,
    questions: [
      {
        id: 'q65',
        type: 'multiple-choice',
        question: 'What is the primary goal of user experience design?',
        options: ['To make things look pretty', 'To create functional and user-friendly products', 'To reduce development time', 'To increase profits'],
        correctAnswer: 1,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q66',
        type: 'multiple-choice',
        question: 'Which design principle focuses on consistency across interfaces?',
        options: ['Hierarchy', 'Contrast', 'Alignment', 'Unity'],
        correctAnswer: 3,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q67',
        type: 'text',
        question: 'Explain the difference between user interface (UI) and user experience (UX) design.',
        points: 15,
        timeLimit: 120
      },
      {
        id: 'q68',
        type: 'integer',
        question: 'How many users are typically needed for usability testing?',
        points: 5,
        timeLimit: 30
      },
      {
        id: 'q69',
        type: 'multiple-choice',
        question: 'What is the purpose of wireframing in the design process?',
        options: ['To add colors', 'To define layout and structure', 'To create animations', 'To write code'],
        correctAnswer: 1,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q70',
        type: 'text',
        question: 'Describe the process of conducting user research and its importance.',
        points: 15,
        timeLimit: 120
      },
      {
        id: 'q71',
        type: 'multiple-choice',
        question: 'Which accessibility guideline ensures content is perceivable?',
        options: ['Operable', 'Understandable', 'Robust', 'Perceivable'],
        correctAnswer: 3,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q72',
        type: 'text',
        question: 'Explain the concept of design systems and their benefits.',
        points: 15,
        timeLimit: 120
      },
      {
        id: 'q73',
        type: 'integer',
        question: 'What is the recommended minimum touch target size for mobile interfaces?',
        points: 5,
        timeLimit: 30
      },
      {
        id: 'q74',
        type: 'multiple-choice',
        question: 'Which prototyping tool is known for collaborative design?',
        options: ['Photoshop', 'Figma', 'Sketch', 'Illustrator'],
        correctAnswer: 1,
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q75',
        type: 'text',
        question: 'Describe the importance of responsive design in modern web development.',
        points: 15,
        timeLimit: 120
      },
      {
        id: 'q76',
        type: 'rating',
        question: 'Rate your proficiency with Figma (1-5 scale).',
        points: 10,
        timeLimit: 60
      },
      {
        id: 'q77',
        type: 'text',
        question: 'Explain the concept of information architecture and its role in UX design.',
        points: 15,
        timeLimit: 120
      }
    ],
    passingScore: 65,
    jobId: 'job_17',
    jobTitle: 'Senior UI/UX Designer',
    company: 'DesignStudio',
    recruiterId: '2',
    status: 'active',
    createdAt: '2024-02-07T09:00:00Z'
  }
];
