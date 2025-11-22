import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../../features/auth/authSlice'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  return (
    <header className="app-header">
      <div className="container">
        <nav className="nav-container">
          <Link to="/" className="logo">
            <i className="fas fa-graduation-cap"></i>
            <span>OpenLearn</span>
          </Link>

          <button 
            className="mobile-menu-btn"
            onClick={() => setIsOpen(!isOpen)}
          >
            <i className="fas fa-bars"></i>
          </button>

          <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
            <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
            <li><Link to="/courses" onClick={() => setIsOpen(false)}>Courses</Link></li>
            <li><Link to="/resources" onClick={() => setIsOpen(false)}>Resources</Link></li>
            <li><Link to="/tutoring" onClick={() => setIsOpen(false)}>Tutoring</Link></li>
            <li><Link to="/about" onClick={() => setIsOpen(false)}>About</Link></li>
            <li><Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link></li>
            
            {user ? (
              <>
                <li><Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link></li>
                <li><Link to="/profile" onClick={() => setIsOpen(false)}>Profile</Link></li>
                <li>
                  <button onClick={onLogout} className="btn btn-outline">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" className="btn btn-outline" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Navbar