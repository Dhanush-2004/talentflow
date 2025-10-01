import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Star, 
  Users, 
  Briefcase, 
  Award, 
  TrendingUp, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle,
  Globe,
  Target,
  Heart
} from 'lucide-react'
import Button from '../components/Button'

const HomePage: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      text: "We partnered with TalentFlow to streamline our recruitment process. Their platform was incredibly flexible, fast, and came up with great solutions to make our hiring successful. Highly Recommended!",
      author: "Sarah Johnson, CEO TechCorp",
      rating: 5
    },
    {
      id: 2,
      text: "I've worked with TalentFlow on multiple recruitment projects, and they have consistently exceeded expectations. The candidate matching is outstanding. I highly recommend them",
      author: "Michael Chen, Founder/CEO of StartupXYZ",
      rating: 5
    },
    {
      id: 3,
      text: "TalentFlow helped me immensely when I couldn't get clear on my vision for our talent acquisition strategy. Their team was fast to deliver, took feedback professionally and returned everything quickly. I absolutely recommend TalentFlow to anyone looking for a professional recruitment platform.",
      author: "Emily Rodriguez, CEO - Digital Solutions",
      rating: 5
    },
    {
      id: 4,
      text: "TalentFlow has been working as our recruitment partner for just under 2 years. Their platform has been a great addition, very responsive, and stays current with latest hiring trends. A great asset for any of your talent needs.",
      author: "David Kim, Founder @TechStart",
      rating: 5
    },
    {
      id: 5,
      text: "TalentFlow is a team of recruitment veterans and really helped me work through creating some complex hiring processes. Highly recommend",
      author: "Alex Thompson, Founder/CEO of InnovateLab",
      rating: 5
    },
    {
      id: 6,
      text: "I have used TalentFlow for the recruitment of our development team. It was a great experience to work with such a qualified and professional platform. They effectively communicated and always kept me updated. The team is very detail-oriented and tries best to satisfy customer needs.",
      author: "Lisa Wang, CEO/CTO at TechForward",
      rating: 5
    }
  ]

  const partners = [
    { name: "TechCorp", logo: "TC" },
    { name: "StartupXYZ", logo: "SX" },
    { name: "InnovateLab", logo: "IL" },
    { name: "Digital Solutions", logo: "DS" },
    { name: "TechStart", logo: "TS" },
    { name: "TechForward", logo: "TF" },
    { name: "FutureTech", logo: "FT" },
    { name: "NextGen", logo: "NG" },
    { name: "CloudTech", logo: "CT" },
    { name: "DataFlow", logo: "DF" },
    { name: "AI Solutions", logo: "AI" },
    { name: "BlockChain Pro", logo: "BP" },
    { name: "CyberSecure", logo: "CS" },
    { name: "Quantum Labs", logo: "QL" },
    { name: "RoboTech", logo: "RT" }
  ]

  const features = [
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Smart Candidate Matching",
      description: "AI-powered algorithms match the right candidates with the right opportunities"
    },
    {
      icon: <Briefcase className="h-8 w-8 text-green-600" />,
      title: "Streamlined Hiring Process",
      description: "From job posting to candidate selection, manage everything in one platform"
    },
    {
      icon: <Award className="h-8 w-8 text-purple-600" />,
      title: "Quality Assessments",
      description: "Comprehensive testing and evaluation tools to find the best talent"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-orange-600" />,
      title: "Analytics & Insights",
      description: "Data-driven insights to optimize your recruitment strategy"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">TalentFlow</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Dream Job or
              <span className="block text-yellow-300">Perfect Candidate</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              The ultimate platform connecting talented professionals with amazing opportunities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-colors inline-flex items-center"
              >
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose TalentFlow?
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features designed to make recruitment effortless
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built with Trust.
              <span className="block text-blue-600">Backed by Results.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="text-6xl text-blue-200 font-bold">"</div>
                  <div className="flex ml-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">
                  {testimonial.text}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {testimonial.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Trusted by Leading Companies
            </h2>
            <p className="text-gray-600">
              Join thousands of companies already using TalentFlow
            </p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-8">
            {partners.map((partner, index) => (
              <div key={index} className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600 font-bold text-sm">{partner.logo}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{partner.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Recruitment?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of companies and candidates who trust TalentFlow
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">TalentFlow</h3>
              <p className="text-gray-400">
                Connecting talent with opportunity through innovative recruitment solutions.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">For Candidates</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/jobs" className="hover:text-white">Find Jobs</Link></li>
                <li><Link to="/assessments" className="hover:text-white">Take Assessments</Link></li>
                <li><Link to="/profile" className="hover:text-white">Build Profile</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">For Companies</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/recruiter" className="hover:text-white">Post Jobs</Link></li>
                <li><Link to="/candidates" className="hover:text-white">Find Candidates</Link></li>
                <li><Link to="/assessments" className="hover:text-white">Create Assessments</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TalentFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
