# TalentFlow - Mini Hiring Platform

A modern React-based hiring platform with role-based access for recruiters and candidates. Built with front-end only architecture using Mock Service Worker (MSW) for API simulation.

## 🚀 Features

### Authentication & Authorization
- **Login/Signup** with role-based routing
- **Local Storage** persistence with session management
- **Role-based access**: Recruiter vs Employee (Candidate) portals

### Recruiter Portal
- **Jobs Management**: Create, edit, archive, reorder jobs with drag-and-drop
- **Kanban Board**: Drag-and-drop candidate stages with @mention notes
- **Assessment Builder**: Create custom assessments with multiple question types
- **Dashboard**: Real-time stats and recent activity

### Employee (Candidate) Portal
- **Job Search**: Browse and apply to available positions
- **Application Tracking**: View status of submitted applications
- **Assessment Taking**: Complete job-specific assessments
- **Profile Management**: Maintain personal and professional information

### Technical Features
- **Front-end Only**: No real backend required
- **MSW Integration**: Mock API with artificial latency (200-1200ms) and 5-10% error rate
- **Local Storage**: IndexedDB-based persistence for all data
- **Responsive Design**: Mobile-first with dark/light theme support
- **Virtualization**: Efficient rendering of large candidate lists

## 🛠 Tech Stack

- **React 18** with TypeScript
- **React Router v6** for navigation
- **Mock Service Worker (MSW)** for API simulation
- **Tailwind CSS** for styling
- **@hello-pangea/dnd** for drag-and-drop functionality
- **Lucide React** for icons
- **Vite** for build tooling

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd talentflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🎯 Usage

### Test Credentials
- **Recruiter**: `recruiter@test.com` (any password)
- **Candidate**: `candidate@test.com` (any password)

### Navigation
- **Recruiter Portal**: `/recruiter/dashboard`
  - Jobs: `/recruiter/jobs`
  - Candidates: `/recruiter/candidates`
  - Pipeline: `/recruiter/candidates/kanban`
  - Assessments: `/recruiter/assessments`

- **Employee Portal**: `/employee/dashboard`
  - Job Search: `/employee/jobs`
  - Profile: `/employee/profile`

### Key Features Demo

#### Jobs Management
1. Navigate to `/recruiter/jobs`
2. Create new jobs with validation
3. Pagination and filtering support
4. Drag-and-drop reordering (optimistic UI)

#### Candidate Pipeline
1. Visit `/recruiter/candidates` for list view
2. Go to `/recruiter/candidates/kanban` for pipeline view
3. Drag candidates between stages
4. Add notes with @mentions

#### Assessment Builder
1. Navigate to `/recruiter/assessments/create`
2. Build custom assessments with multiple question types
3. Set time limits and scoring
4. Preview before saving

## 🏗 Architecture

### Front-end Only Design
- **MSW Service Worker**: Intercepts all API calls
- **Local Storage**: Persists user sessions and preferences
- **In-memory State**: All data stored client-side during session
- **Simulated Backend**: Realistic API responses with latency/errors

### Data Flow
```
User Action → MSW Handler → Local State Update → UI Re-render
```

### State Management
- **AuthContext**: User authentication and session
- **ThemeContext**: Dark/light mode preferences
- **Local Storage**: Persistent data across sessions
- **Component State**: Local UI state management

## 📊 Mock Data

### Seeded Data
- **25 Jobs**: Mixed active/archived with various types
- **1000 Candidates**: Distributed across different stages
- **3+ Assessments**: Multiple question types and formats
- **2 Recruiter Users**: For testing different roles
- **10 Employee Users**: Various candidate profiles

### API Simulation
- **Artificial Latency**: 200-1200ms response times
- **Error Simulation**: 5-10% random write failures
- **Realistic Data**: Comprehensive mock responses

## 🚀 Deployment

### Vercel (Recommended)
1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

2. **Environment Variables**
   - No environment variables required (front-end only)

### Netlify
1. **Build Command**: `npm run build`
2. **Publish Directory**: `dist`
3. **Redirect Rules**: Add `_redirects` file for SPA routing

### GitHub Pages
1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deploy script**
   ```json
   {
     "scripts": {
       "deploy": "gh-pages -d dist"
     }
   }
   ```

## 🔧 Development

### Project Structure
```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, Theme)
├── hooks/              # Custom React hooks
├── mocks/              # MSW handlers and browser setup
├── pages/              # Route components
├── services/           # API service layers
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### Key Files
- `src/mocks/handlers.ts`: API endpoint definitions
- `src/contexts/AuthContext.tsx`: Authentication logic
- `src/components/Sidebar.tsx`: Navigation component
- `src/App.tsx`: Main routing configuration

### Adding New Features
1. **Create Component**: Add to `src/components/`
2. **Add Route**: Update `src/App.tsx`
3. **Mock API**: Add handlers in `src/mocks/handlers.ts`
4. **Update Types**: Add interfaces in `src/types/`

## 🐛 Troubleshooting

### Common Issues

#### MSW Not Working
- Hard refresh (Ctrl+Shift+R) to register service worker
- Check browser console for MSW initialization
- Verify `mockServiceWorker.js` is in public directory

#### Authentication Errors
- Clear localStorage and try again
- Check MSW handlers are responding
- Verify token is being set correctly

#### Build Errors
- Run `npm install` to ensure dependencies are installed
- Check TypeScript errors with `npm run build`
- Verify all imports are correct

### Development Tips
- Use browser dev tools to inspect MSW requests
- Check Network tab for API call simulation
- Monitor localStorage for persistent data

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request



**TalentFlow** - Streamlining the hiring process with modern web technologies.
