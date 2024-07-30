import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';

const Dropdown = ({ options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="dropdown-btn"
        aria-expanded={isOpen}
      >
        Select School
      </button>
      {isOpen && (
        <div className="dropdown-content">
          {options.map((option, index) => (
            <a key={index} href="#">
              {option}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const toggleNav = () => setIsNavOpen(!isNavOpen);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="logo.png" alt="Logo" />
      </div>
      <div className={`navbar-right ${isNavOpen ? 'active' : ''}`}>
      <div className="nav ">
            <a className="navbar-link" href="#home">
              Home</a>
              <span className="current"></span>
          </div>
       
        <div className='nav-buttons'>
            <Dropdown options={['Universities', 'Colleges', 'Polytechnics']} />
            <button className="regular-btn">Help Desk</button>
        </div>
      </div>
      <div className="hamburger-menu" onClick={toggleNav}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </nav>
  );
};

export default Navbar;
