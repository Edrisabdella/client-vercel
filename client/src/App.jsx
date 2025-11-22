import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// Layout Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Page Components
import Home from './pages/Home'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import Resources from './pages/Resources'
import Tutoring from './pages/Tutoring'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import About from './pages/About'
import Contact from './pages/Contact'

// Protected Route
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <div className="App">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/tutoring" element={<Tutoring />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  )
}

export default App