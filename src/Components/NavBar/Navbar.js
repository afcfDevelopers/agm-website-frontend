import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import logo from '../../Images/logo.png';
import { Link, useLocation } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
// import { FaArrowRight, FaSearch } from "react-icons/fa";


const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [campusList, setCampusList] = useState([]);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation();
  
  // Fetch campuses based on search query
  const getCampusAvs = (query) => {
    console.log('Campus AVS List API was called..');
    fetch(`https://afcfagm.pythonanywhere.com/api/get-all-campusavs/?query=${query}`)
      .then(response => response.json())
      .then(data => {
        const campuses = data?.queryset || [];
        setCampusList(campuses);
      })
      .catch(err => {
        console.log('Failed to submit: ', err);
      });
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      getCampusAvs(searchQuery);
    } else {
      setCampusList([]);
    }
  }, [searchQuery]);

  // Filter the campus list based on the search query
  const filteredCampusList = campusList.filter(campus =>
    campus.campusName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campus.campusOrSchoolAcronym.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // const dropdownMaxHeight = Math.min(filteredCampusList.length * 50, 300); // 50px for each item, capped at 300px

  // Style for active or inactive status
  const getItemStyle = (status) => {
    if (status.toLowerCase() === 'inactive') {
      return { color: 'red' };
    } else if (status.toLowerCase() === 'active') {
      return { color: '#007AFF' };
    }
    return {};
  };

  const handleItemClick = (acronym) => {
    setSearchQuery(''); // Clear the search query
    setCampusList([]);  // Clear the campus list
    setIsNavOpen(false)
  };

  const toggleNav = () => setIsNavOpen(!isNavOpen);
  const targetRef = useRef(null);
  // const [isHovered, setIsHovered] = useState(false);
  // const [isFocused, setIsFocused] = useState(false);
  // const showSearchInput = isHovered || isFocused;

  // const handleCloseSearch = () => {
  //   setIsFocused(false);
  //   setSearchQuery(""); // Clear the search query
  // }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      <div className={`navbar-drop ${isNavOpen ? 'active' : ''}`}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a campus by name or acronym..."
          className="dropdown-btn"
        />
        
        {searchQuery && filteredCampusList.length > 0 && (
          <ul className="dropdown-container" onClick={handleItemClick}>
            <div className="dropdown">
              {filteredCampusList.map((campus) => (
                <li key={campus.campusOrSchoolAcronym}>
                  <Link
                    className="dropdown-university-list"
                    to={campus.active_Inactive.toLowerCase() === 'inactive' ? '#' : `/campus/${campus.campusOrSchoolAcronym}`}
                    style={getItemStyle(campus.active_Inactive)}
                    onClick={() => handleItemClick(campus.campusOrSchoolAcronym)}
                  >
                    {campus.campusName} ({campus.campusOrSchoolAcronym}) - {campus.active_Inactive}
                  </Link>
                </li>
              ))}
            </div>
          </ul>
        )}
      </div>
      <div className='navbar-right'>
        <div className="nav">
          <Link className="navbar-link" to="/">
            Home
          </Link>
          {location.pathname === '/' && <span className="current"></span>}
        </div>
        <div
          className='container' 
         >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a campus by name or acronym..."
            ref={targetRef}
            className= 'search-input'
          />
       
          {searchQuery && filteredCampusList.length > 0 && (
            <ul className="dropdown-container" onClick={handleItemClick}>
              <div className="dropdown">
                {filteredCampusList.map((campus) => (
                  <li key={campus.campusOrSchoolAcronym}>
                    <Link
                      className="dropdown-university-list"
                      to={campus.active_Inactive.toLowerCase() === 'inactive' ? '#' : `/campus/${campus.campusOrSchoolAcronym}`}
                      style={getItemStyle(campus.active_Inactive)}
                      onClick={() => handleItemClick(campus.campusOrSchoolAcronym)}
                    >
                      {campus.campusName} ({campus.campusOrSchoolAcronym}) - {campus.active_Inactive}
                    </Link>
                  </li>
                ))}
              </div>
            </ul>
          )}
        </div>
      </div>

      <div className="hamburger-menu" onClick={toggleNav} aria-label="Toggle Navigation">
        <FaSearch className="icon-magnifying-glass" />
      </div>
    </nav>
  );
};

export default Navbar;
