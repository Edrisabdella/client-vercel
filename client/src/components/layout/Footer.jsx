import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>OpenLearn</h3>
            <p>Bridging educational gaps with technology. Empowering learners and educators worldwide through our inclusive peer-to-peer digital education platform.</p>
            <div className="social-icons">
              <a href="https://github.com/Edrisabdella" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github"></i>
              </a>
              <a href="https://linkedin.com/in/edris-abdella-7aa521177" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="/resources">Resources</Link></li>
              <li><Link to="/tutoring">Tutoring</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Contact Info</h3>
            <p><strong>Edris Abdella – Project Lead</strong></p>
            <p><i className="fas fa-envelope"></i> Email: edrisabdella178@gmail.com</p>
            <p><i className="fas fa-phone"></i> Phone: +251905131051</p>
            <p><i className="fas fa-map-marker-alt"></i> Location: Dire Dawa, Ethiopia</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 OpenLearn. All rights reserved. | Designed for SDG 4: Quality Education</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer