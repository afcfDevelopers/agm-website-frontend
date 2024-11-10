import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { motion } from 'framer-motion';
import 'react-tooltip/dist/react-tooltip.css';
import './home.css';
import './homeanimation.css';
import './css.css';
import Tab from '../../Components/NavBar/Tabs';
import logo1 from '../../Images/logo1.png';
import logo2 from '../../Images/logo2.png';
import logo3 from '../../Images/logo3.png';
import logo4 from '../../Images/logo4.png';
import logo5 from '../../Images/logo5.png';
import annoucementImage from '../../Images/annoucement.jpg';
import ImageSlider from '../../Components/ImageSlider/ImageSlider';
import PdfDownload from '../../Components/Schedule/Schedule';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

const Home = () => {
  const [campusList, setCampusList] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [selectedTab, setSelectedTab] = useState('University');

  const { ref: topSectionRef, inView: topSectionInView } = useInView({ triggerOnce: true });
  const { ref: logosRef, inView: logosInView } = useInView({ triggerOnce: false });
  const { ref: schoolListRef, inView: schoolListInView } = useInView({ triggerOnce: false });

  useEffect(() => {
    getCampusAvs();
    setSelectedTab('University'); // Ensure default tab is selected
  }, []);

  const getCampusAvs = () => {
    fetch('https://afcfagm.pythonanywhere.com/api/get-all-campusavs/')
      .then(response => response.json())
      .then(data => {
        const campuses = data?.queryset || [];
        setCampusList(campuses);
        calculateCounts(campuses);
      })
      .catch(err => console.error('Failed to fetch campus AVS list:', err));
  };

  const calculateCounts = (campuses) => {
    const active = campuses.filter(campus => campus.active_Inactive.toLowerCase() === 'active').length;
    const inactive = campuses.filter(campus => campus.active_Inactive.toLowerCase() === 'inactive').length;
    setActiveCount(active);
    setInactiveCount(inactive);
  };

  const getItemStyle = (status) => {
    return status.toLowerCase() === 'inactive' ? { color: 'red', cursor: 'not-allowed' } : {};
  };

  const filterCampusesByType = (type) => {
    return campusList.filter(campus => campus.institutionType.toLowerCase() === type.toLowerCase());
  };

  const bottomContainerRef = useRef(null);

  const scrollToBottom = () => {
    bottomContainerRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const tabs = [
    {
      label: 'Universities',
      content: (
        <div id="listDiv">
          {filterCampusesByType('university').map((campus) => (
            <Link 
              to={`/campus/${campus.campusOrSchoolAcronym}`} 
              key={campus.campusOrSchoolAcronym}>
              <div
                className='list-box'
                style={getItemStyle(campus.active_Inactive)}>
                <li>
                  {campus.campusName}
                </li>
              </div>
            </Link>
          ))}
        </div>
      ),
    },
    {
      label: 'Colleges Of Education/Medicine',
      content: (
        <div id="listDiv">
          {filterCampusesByType('college').map((campus) => (
            <Link 
              to={`/campus/${campus.campusOrSchoolAcronym}`} 
              key={campus.campusOrSchoolAcronym}>
              <div
                className='list-box'
                style={getItemStyle(campus.active_Inactive)}
              >
                <li>
                  {campus.campusName}
                </li>
              </div>
            </Link>
          ))}
        </div>
      ),
    },
    {
      label: 'Polytechnic',
      content: (
        <div id="listDiv">
          {filterCampusesByType('polytechnic').map((campus) => (
            <Link 
              to={`/campus/${campus.campusOrSchoolAcronym}`} 
              key={campus.campusOrSchoolAcronym}>
              <div
                className='list-box'
                style={getItemStyle(campus.active_Inactive)}
              >
                <li>
                  {campus.campusName}
                </li>
              </div>
            </Link>
          ))}
        </div>
      ),
    },
  ];

  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get("https://afcfagm.pythonanywhere.com/api/get-idex-data/");
        setEventData(response.data.queryset);
      } catch (error) {
        console.log("Error fetching AGM data:", error);
      }
    };

    fetchEventData();
  }, []);

//  const [announcement, setAnnouncement] = useState(false);
//  useEffect(() => {
//    setAnnouncement(true);
//  }, []);

  return (
    <div className='home-container'>
     {/** {announcement && (
        <motion.div 
          className='announcement-container' 
          initial={{ opacity: 0, y: -50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          onClick={() => setAnnouncement(false)}
        >
          <div className='cancel-announcement' onClick={() => setAnnouncement(false)}>
            <FaTimes />
          </div>
          <div className='announcement'>
            <img src={annoucementImage} style={{width:'100%', height:'100%'}} alt="" />
          </div>
        </motion.div>
      )}*/}
      <div className='sub-home-container'>
        <motion.div 
          ref={topSectionRef} 
          className='top-home-section' 
          initial={{ opacity: 0 }} 
          animate={topSectionInView ? { opacity: 1 } : {}} 
          transition={{ duration: 1 }}
        >
          <ImageSlider />
          <div className='get-event-container'>
            <a href={eventData?.event_Live_link} target="_blank" rel="noopener noreferrer">
              <button className='get-event-button'>JOIN AGM LIVE</button>
            </a>
            <button onClick={scrollToBottom} className='get-event-button'>View Program Activities</button>
          </div>
          <motion.div 
            ref={logosRef} 
            className='logos-container' 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={logosInView ? { scale: 1, opacity: 1 } : {}} 
            transition={{ duration: 0.8 }}
          >
            <img src={logo2} alt="" />
            <img src={logo4} alt="" />
            <img src={logo3} alt="" />
            <img src={logo1} alt="" />
            <img src={logo5} alt="" />
          </motion.div>
          <motion.div 
            ref={schoolListRef} 
            className='school-list-container' 
            initial={{ x: -100, opacity: 0 }} 
            animate={schoolListInView ? { x: 0, opacity: 1 } : {}} 
            transition={{ duration: 1 }}
          >
            <div className='flyer-title'>
              <div className='dot'>
                <div className="indot"></div>
              </div>
              <h2>List of Schools with AFCF Presence</h2>
            </div>
            <div className='school-tab'>
              <div className="desktop-view">
                <Tab tabs={tabs} activeCount={activeCount} inactiveCount={inactiveCount} />
              </div>
            </div>
          </motion.div>
        </motion.div>
        <div style={{ width: '100%' }} ref={bottomContainerRef}>
          <PdfDownload />
        </div>
      </div>
    </div>
  );
};

export default Home;
