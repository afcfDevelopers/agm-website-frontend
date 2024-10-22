import React from 'react';
import './Footer.css';

// Import SVG files
import Facebook from '../../Images/facebook.svg';
import Instagram from '../../Images/instagram.svg';
import Linkdin from '../../Images/linkdin.svg';
import Twitter from '../../Images/twitter.svg';

const Footer = ({campusDetails}) => {
  return (
    <footer className="footer">
      <div className="left">
        <span>© 2024</span>
      </div>
      <div className="right">
      <a className='footer-icon' href="https://www.facebook.com/afcfweca?mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer">
        <img src={Facebook} alt="Icon 1" />
      </a>

      <a className='footer-icon' href="https://www.instagram.com/afcfweca?igsh=MWxnaTczMWxudGZtZA==" target="_blank" rel="noopener noreferrer">
        <img src={Instagram} alt="Icon 2" />
      </a>


      <a className='footer-icon' href="https://x.com/Afcfweca?t=-Zq_fRncayReyOSpmHcXtw&s=08" target="_blank" rel="noopener noreferrer">
        <img src={Twitter} alt="Icon 4" />
      </a>
      <a href={`mailto:afcfweca@apostolicfaithweca.org`} target="_blank" rel="noopener noreferrer">
      <span className="afcf-text">Afcf{/*campusDetails.campusOrSchoolAcronym*/}Chapter</span>

</a>

      </div>
    </footer>
  );
};

export default Footer;
