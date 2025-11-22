import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Inclusive Peer-to-Peer Digital Education Platform</h1>
            <p>Bridging educational gaps with technology. Empowering learners and educators worldwide.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link to="/register" className="btn btn-primary">
                Join Our Mission
              </Link>
              <Link to="/courses" className="btn btn-outline">
                Explore Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Key Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              OpenLearn offers a comprehensive set of features designed to enhance learning experiences
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <i className="fas fa-users text-4xl text-blue-600 mb-4"></i>
              <h3 className="text-xl font-semibold mb-4">Peer-to-Peer Tutoring</h3>
              <p className="text-gray-600">Connect with expert tutors for personalized learning experiences.</p>
            </div>
            
            <div className="card text-center">
              <i className="fas fa-book-open text-4xl text-blue-600 mb-4"></i>
              <h3 className="text-xl font-semibold mb-4">Digital Resource Hub</h3>
              <p className="text-gray-600">Access thousands of free educational materials and resources.</p>
            </div>
            
            <div className="card text-center">
              <i className="fas fa-graduation-cap text-4xl text-blue-600 mb-4"></i>
              <h3 className="text-xl font-semibold mb-4">Study Groups</h3>
              <p className="text-gray-600">Collaborate with peers in virtual study groups and learning circles.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home