import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';



const Navbar = ({ handleLinkClick, onScrollToContainer }) => {

  const [searchQuery, setSearchQuery] = useState('');
  const [campusList, setCampusList] = useState([]);



  // Filter the campus list based on the search query
  const filteredCampusList = campusList.filter(campus =>
    campus.campusName.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const getCampusAvs = (query) => {
    console.log('Campus AVS List Api was called..');
    fetch(`https://afcfagm.pythonanywhere.com/api/get-all-campusavs/?query=${query}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        const campuses = data?.queryset || [];
        setCampusList(campuses);
      })
      .catch(err => {
        console.log('failed to submit: ', err);
      });
  };

  useEffect(() => {
    if (searchQuery) {
      getCampusAvs(searchQuery);
    } else {
      setCampusList([]);
    }
  }, [searchQuery]);
  const getItemStyle = (status) => {
    if (status.toLowerCase() === 'inactive') {
      return { color: 'red' };
    } else if (status.toLowerCase() === 'active') {
      return { color: '#007AFF' };
    }
    return {};

   
  };
  const handleItemClick = (acronym) => {
    handleLinkClick(acronym); // Call the parent component function
    setSearchQuery(''); // Clear the search query
  };
  const [isNavOpen, setIsNavOpen] = useState(false);
  const toggleNav = () => setIsNavOpen(!isNavOpen);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="logo.png" alt="Logo" />
      </div>
      <div className={`navbar-right ${isNavOpen ? 'active' : ''}`}>
      <div className="nav ">
            <a className="navbar-link" href="/">
              Home</a>
              <span className="current"></span>
          </div>
       
        <div className='nav-buttons'>
        <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for a campus..."
        className='dropdown-btn'
      />
      {searchQuery && filteredCampusList.length > 0 && (
        <div className='dropdown-container' onClick={ handleItemClick}>
        <div className='dropdown'>
          {filteredCampusList.map((campus) => (
            <li 
              key={campus.campusOrSchoolAcronym}
              onClick={() => handleItemClick(campus.campusOrSchoolAcronym)}
            >
              <a 
                className='dropdown-university-list'
                href='#'
                onClick={(e) => {
                  e.preventDefault(); // Prevent default link behavior
                  handleLinkClick(campus.campusOrSchoolAcronym); // Call your function
                  window.scrollTo({ top: 0, behavior: 'smooth' });}}
                style={getItemStyle(campus.active_Inactive, campus.campusName, searchQuery)}
              >
                {campus.campusName} - {campus.active_Inactive}
              </a>
            </li>
          ))}
        </div>
        </div>
      )}
            <button  onClick={onScrollToContainer} className="regular-btn">Help Desk</button>
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
