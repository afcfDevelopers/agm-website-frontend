// src/pages/Home.js

import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import './home.css';
import './homeanimation.css';
import { useSwipeable } from 'react-swipeable';
import './css.css'
import Tab from '../../Components/NavBar/Tabs'
import logo1 from '../../Images/logo1.png';
import logo2 from '../../Images/logo2.png';
import logo3 from '../../Images/logo3.png';
import logo4 from '../../Images/logo4.png';
import logo5 from '../../Images/logo5.png';
import { FiFacebook, FiInstagram, FiLinkedin } from "react-icons/fi";
import { RiCheckboxCircleFill, RiImageAddFill, RiRefreshFill } from "react-icons/ri";
import ImageSlider from '../../Components/ImageSlider/ImageSlider';
import HelpDesk from '../../Components/HelpDesk/HelpDesk';
import axios from 'axios'
import Footer from '../../Components/Footer/Footer';
import Navbar from '../../Components/NavBar/Navbar';

const Home = () => {
  const [campusList, setCampusList] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [campusDetails, setCampusDetails] = useState({
    campusName: '',
    flyer: '',
    coordinatorName: '',
    secretaryName: '',
    coordinatorPicture:''
  });
  const [selectedTab, setSelectedTab] = useState('Select University');

  const { ref: topSectionRef, inView: topSectionInView } = useInView({ triggerOnce: true });
  const { ref: logosRef, inView: logosInView } = useInView({ triggerOnce: false });
  const { ref: schoolListRef, inView: schoolListInView } = useInView({ triggerOnce: false });
  const { ref: schoolDetailsRef, inView: schoolDetailsInView } = useInView({ triggerOnce: true });
  const { ref: schoolSocialDetailsRef, inView: schoolSocialDetailsInView } = useInView({ triggerOnce: false });

  useEffect(() => {
    getCampusAvs();
  }, []);
//--------------------------------------------------//










//--------Enpoint to get campus list-----------------------//
  const getCampusAvs = () => {
    console.log('Campus AVS List Api was called..');
    fetch('https://afcfagm.pythonanywhere.com/api/get-all-campusavs/')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        const campuses = data?.queryset || [];
        setCampusList(campuses);
        calculateCounts(campuses);
      })
      .catch(err => {
        console.log('failed to submit: ', err);
      });
  };


  const calculateCounts = (campuses) => {
    const active = campuses.filter(campus => campus.active_Inactive.toLowerCase() === 'active').length;
    const inactive = campuses.filter(campus => campus.active_Inactive.toLowerCase() === 'inactive').length;
    setActiveCount(active);
    setInactiveCount(inactive);
  };






  const getSpecificCampusAvs = (campus) => {
    console.log('Campus AVS List Api was called..');
    axios.get(`https://afcfagm.pythonanywhere.com/api/get-all-campusavs/?campus=${campus}`)
      .then(response => {
        const data = response.data;
        console.log(data);
        const responseDetails = data['queryset'][0];
        setCampusDetails({
          campusAcronym: responseDetails['campusOrSchoolAcronym'],
          campusName: responseDetails['campusName'],
          flyer: responseDetails['flyer'],
          coordinatorName: responseDetails['coordinator_name'],
          secretaryName: responseDetails['secretary_name'],
          coordinatorPicture: responseDetails['coordinator_picture'],
         secretaryPicture: responseDetails['secretary_picture'],
         bibleStudyTime:responseDetails['bibleStudyTime'],
         fellowshipTime:responseDetails['fellowshipTime'],
         fellowshipFacebook:responseDetails['fellowship_facebook_link'],
         fellowshipInstagram:responseDetails['fellowship_instagram_link'],
         fellowshipEmail:responseDetails['fellowship_email'],
         fellowshiPhone:responseDetails['fellowship_phone_number'],
         averageNumber:responseDetails['averageNumberOfStudent'],
         workers:responseDetails['numberOfWorkforce'],
         bibleStudyVenue:responseDetails['bibleStudyVenue'],
         secretaryCourse:responseDetails['secretary_course'],
         secretaryLevel:responseDetails['secretary_level'],
         secretaryEmail:responseDetails['secretary_email'],
         secretaryPhone:responseDetails['secretary_phonenumber'],
         about:responseDetails['about'],
         coordinatorCourse:responseDetails['coordinator_course'],
         coordinatorLevel:responseDetails['coordinator_level'],
         coordinatorEmail:responseDetails['coordinator_email'],
         coordinatorPhone:responseDetails['coordinator_phonenumber'],
       
        });
       
        
      })
      .catch(err => {
        console.log('Failed to submit: ', err);
      });
  };
  

  const [campusAcronym, setCampusAcronym] = useState('');
  const [welcomeReport, setWelcomeReport] = useState(null);
  const [welcomeLink, setWelcomeLink] = useState(null);
  const [revivalReport, setRevivalReport] = useState(null);
  const [revivalLink, setRevivalLink] = useState(null);
  const [error, setError] = useState(null);

  // Function to fetch a single report for a given campus acronym and program type
  const getCampusReport = (campusAcronym, programType) => {
    if (!campusAcronym) {
      console.error('Campus acronym is missing');
      return Promise.resolve(null);
    }

    console.log(`Fetching report for ${campusAcronym} and program type ${programType}`);
    return axios.get(`https://afcfagm.pythonanywhere.com/api/get-report/?campus=${campusAcronym}&program-type=${programType}`)
      .then(response => {
        const data = response.data;
        console.log('API response:', data);
        if (data.queryset && data.queryset.length > 0) {
          return data.queryset[0];
        } else {
          console.log('No data found for', campusAcronym, programType);
          return null;
        }
      })
      .catch(err => {
        console.log('Error fetching report:', err);
        return null;
      });
  };

  // Function to fetch reports for both program types
  const fetchCampusReports = (campusAcronym) => {
    if (!campusAcronym) {
      console.error('Campus acronym is missing');
      return;
    }

    Promise.all([
      getCampusReport(campusAcronym, 'welcome_program'),
      getCampusReport(campusAcronym, 'revival_program')
    ]).then(([welcomeReport, revivalReport]) => {
      if (welcomeReport || revivalReport) {
        setWelcomeReport(welcomeReport);
        setRevivalReport(revivalReport);
        setWelcomeLink(welcomeReport?.google_drive_link || '');
                setRevivalLink(revivalReport?.google_drive_link || '');
        setError(null); // Clear previous errors
      } else {
        setWelcomeReport(null);
        setRevivalReport(null);
        setError(`No reports available for ${campusAcronym}`);
      }
     
    }).catch(err => {
      console.log('Error fetching reports:', err);
      setError(`Failed to fetch reports for ${campusAcronym}`);
    });
  };

  
  const [welcomeImages, setWelcomeImages] = useState([]);
  const [revivalImages, setRevivalImages] = useState([]);
 

  const getCampusImages = async (campusAcronym, programType) => {
    if (!campusAcronym) {
      console.error('Campus acronym is missing');
      return [];
    }

    try {
      console.log(`Fetching images for ${campusAcronym} and program type ${programType}`);
      const response = await axios.get(`https://afcfagm.pythonanywhere.com/api/get-report-images/?campus=${campusAcronym}&program-type=${programType}`);
      const data = response.data.queryset;
      console.log('API response:', data);

      if (data.length > 0) {
        return data.flatMap(item => 
          ['picture1', 'picture2', 'picture3', 'picture4']
            .map(key => item[key])
            .filter(url => url) // Filter out undefined or null values
        );
      } else {
        return [];
      }
    } catch (err) {
      console.error('Error fetching images:', err);
      return [];
    }
  };

  const fetchCampusImages = async (campusAcronym) => {
    if (!campusAcronym) {
      console.error('Campus acronym is missing');
      return;
    }

 

    try {
      const [welcome, revival] = await Promise.all([
        getCampusImages(campusAcronym, 'welcome_program'),
        getCampusImages(campusAcronym, 'revival_program')
      ]);

      setWelcomeImages(welcome);
      setRevivalImages(revival);

      if (welcome.length > 0 || revival.length > 0) {
        setError(null); // Clear previous errors
      } else {
        setError(`No images available for ${campusAcronym}`);
      }
    } catch (err) {
      console.error('Error fetching images:', err);
      setError(`Failed to fetch images for ${campusAcronym}`);
    } finally {
      
    }
  };


  
//-------image Galerry Tab-------------//
const [images, setImages] = useState([])
const [seeMore, setSeeMore] = useState(false)
const imagesToDisplay = images.slice(0, 3);
 const fetchHistoricalImages = async (campusAcronym) => {
    try {
      const response = await fetch(`https://afcfagm.pythonanywhere.com/api/get-history-images/?campus=${campusAcronym}`);
      const data = await response.json();
      console.log('Fetched data:', data); // Inspect the structure
      setImages(data.queryset || []); // Access the queryset array
    } catch (error) {
      console.error('Error fetching images:', error);
      setImages([]); // Default to empty array on error
    }
  };
  const [isProgramModalOpen, setProgramIsModalOpen] = useState(false);
  const [currentProgramImage, setCurrentProgramImage] = useState('');

  const openProgramModal = (image) => {
    setProgramIsModalOpen(true);
    setCurrentProgramImage(image)
  
  };

  const closeProgramModal = () => {
    setProgramIsModalOpen(false);

    setCurrentProgramImage('')
  };



  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = (index) => {
    console.log('model open')
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Navigate to previous image in modal
  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  // Navigate to next image in modal
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };
  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextImage,
    onSwipedRight: prevImage,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });
//---------------------------------------//

  const handleLinkClick = (campus) => {
    getSpecificCampusAvs(campus);
    setCampusAcronym(campus);
    fetchCampusReports(campus, setWelcomeReport, setRevivalReport, setError);
    fetchCampusImages(campus);
    fetchHistoricalImages(campus)
  };
//-------------------------------//

useEffect(() => {
  // Fetch data for "unilag" when the component mounts
  handleLinkClick('unilag');
}, []);

const getItemStyle = (status) => {
  if (status.toLowerCase() === 'inactive') {
    return { color: 'red' };
  } else if (status.toLowerCase() === 'active') {
    return { color: '#007AFF' };
  }
  return {};
};


const containerRef1 = useRef(null);
const containerRef2 = useRef(null);
const cardRef1 = useRef(null);
const cardRef2 = useRef(null);
const [activeCard, setActiveCard] = useState(null);
const flipTimeoutRef1 = useRef(null);
const flipTimeoutRef2 = useRef(null);

const handleCardClick = (id) => {
  setActiveCard((prevActiveCard) => (prevActiveCard === id ? null : id));
};

const handleScroll = () => {
  const rect1 = cardRef1.current?.getBoundingClientRect();
  const rect2 = cardRef2.current?.getBoundingClientRect();

  if (rect1) {
    if (rect1.top >= 0 && rect1.bottom <= window.innerHeight) {
      flipTimeoutRef1.current = setTimeout(() => {
        setActiveCard(1);
      }, 1000);
    } else {
      clearTimeout(flipTimeoutRef1.current);
      setActiveCard((prevActiveCard) => (prevActiveCard === 1 ? null : prevActiveCard));
    }
  }

  if (rect2) {
    if (rect2.top >= 0 && rect2.bottom <= window.innerHeight) {
      flipTimeoutRef2.current = setTimeout(() => {
        setActiveCard(2);
      }, 1000);
    } else {
      clearTimeout(flipTimeoutRef2.current);
      setActiveCard((prevActiveCard) => (prevActiveCard === 2 ? null : prevActiveCard));
    }
  }
};

useEffect(() => {
  window.addEventListener('scroll', handleScroll);
  return () => {
    window.removeEventListener('scroll', handleScroll);
    clearTimeout(flipTimeoutRef1.current);
    clearTimeout(flipTimeoutRef2.current);
  };
}, []);

const [edit, setEdit] = useState(false)

const [picture, setPicture] = useState(null);
const [responseMessage, setResponseMessage] = useState('');
const campusInputRef = useRef(null);
const pictureInputRef = useRef(null);
const handleFileChange = (e) => {
  setPicture(e.target.files[0]);
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const form = new FormData();
  form.append('campusOrSchoolAcronym', campusAcronym);
  form.append('picture', picture);

  try {
    const response = await axios.post('https://afcfagm.pythonanywhere.com/api/add-history-images/', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status === 200) {
      setResponseMessage('Image uploaded successfully!');
      toggleClass()
      console.log(response.data);
         // Clear input fields
         campusInputRef.current.value = '';
         pictureInputRef.current.value = '';
    } else {
      setResponseMessage(`Error: ${response.data.message}`);
    }
  } catch (error) {
    setResponseMessage('Failed to submit: ' + error.message);
  }
};


const [isActive, setIsActive] = useState(false);
const [isFinished, setIsFinished] = useState(false);
const buttonRef = useRef(null);

const toggleClass = () => {
  setIsActive(prevState => !prevState);
};

const addClass = () => {
  setIsFinished(true);
};

useEffect(() => {
  const button = buttonRef.current;

  if (button) {
    button.addEventListener('click', toggleClass);
    button.addEventListener('transitionend', toggleClass);
    button.addEventListener('transitionend', addClass);

    return () => {
      button.removeEventListener('click', toggleClass);
      button.removeEventListener('transitionend', toggleClass);
      button.removeEventListener('transitionend', addClass);
    };
  }
}, []);



const [eventData, setEventData] = useState(null);
 

    const getLatestEventAgmLink = () => {
        axios.get('https://afcfagm.pythonanywhere.com/api/get-idex-data/')
            .then(response => {
                const data = response.data;
                console.log('API response:', data);
                if (data && data.queryset) {
                    setEventData(data.queryset);
                } else {
                    console.log('No data found');
                    setEventData(null);
                }
            })
            .catch(err => {
                console.log('Error fetching event data:', err);
                setError('Failed to fetch event data');
            });
    };




  //------------University Tab-----------------------------//
  const filterCampusesByType = (type) => {
    return campusList.filter(campus => campus.institutionType === type);
  };

  const tabs = [
    {
      label: 'Select University',
      content: (
        <div id="listDiv">
          {filterCampusesByType('university').map((campus) => (
            <li key={campus.campusOrSchoolAcronym}>
            <a className='university-list' href="javascript:void(0)"   onClick={(e) => {
    e.preventDefault(); // Prevent default link behavior
    handleLinkClick(campus.campusOrSchoolAcronym); // Call your function
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top
  }} style={getItemStyle(campus.active_Inactive)}>
              {campus.campusName}- {campus.active_Inactive}
            </a>
          </li>
          ))}
        </div>
      ),
    },
    {
      label: 'Select College',
      content: (
        <div id="listDiv">
          {filterCampusesByType('college').map((campus) => (
              <li key={campus.campusOrSchoolAcronym}>
              <a className='university-list' href="javascript:void(0)"   onClick={(e) => {
    e.preventDefault(); // Prevent default link behavior
    handleLinkClick(campus.campusOrSchoolAcronym); // Call your function
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top
  }} style={getItemStyle(campus.active_Inactive)}>
                {campus.campusName}- {campus.active_Inactive}
              </a>
            </li>
          ))}
        </div>
      ),
    },
    {
      label: 'Select Polytechnic',
      content: (
        <div id="listDiv">
         
          {filterCampusesByType('polytechnic').map((campus) => (
            <li key={campus.campusOrSchoolAcronym}>
            <a className='university-list' href="javascript:void(0)"   onClick={(e) => {
    e.preventDefault(); // Prevent default link behavior
    handleLinkClick(campus.campusOrSchoolAcronym); // Call your function
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top
  }} style={getItemStyle(campus.active_Inactive)}>
              {campus.campusName}- {campus.active_Inactive}
            </a>
          </li>
          ))}
        </div>
      ),
    },
  ];

  const handleSelectChange = (e) => {
    setSelectedTab(e.target.value);
  };

  const selectedTabContent = tabs.find(tab => tab.label === selectedTab)?.content;

  //----------------------------//



  const containerRef = useRef(null);

  const scrollToContainer = () => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };


  return (
    <div>
         <Navbar handleLinkClick={handleLinkClick}  onScrollToContainer={scrollToContainer}/>
    <div className='home-container' >
      {/**-----------------------Hero Container------------------------ */}
      <div className='sub-home-container'>
        <div ref={topSectionRef} className={`top-home-section ${topSectionInView ? 'animate' : ''}`}>
          <ImageSlider />
          <div ref={logosRef} className={`logos-container ${logosInView ? 'animate' : ''}`}>
            <img src={logo2} alt="" />
            <img src={logo4} alt="" />
            <img src={logo3} alt="" />
            <img src={logo1} alt="" />
            <img src={logo5} alt="" />
          </div>
          <div ref={schoolListRef} className={`school-list-container ${schoolListInView ? 'animate' : ''}`}>
          <div className='flyer-title'>
                  <div className='dot'>
                      <div className="indot"></div>
                  </div>
                  <h2>List of Universities with campus A.V.S (now Afcf)</h2>
                </div>
              </div>
            <div className='school-tab'>
             
              <div className="desktop-view">
                <Tab tabs={tabs} activeCount={activeCount} inactiveCount={inactiveCount}/>
              </div>
              <div>
              
              <div className="mobile-view">
                <select value={selectedTab} onChange={handleSelectChange} className='moble-select'>
                  {tabs.map((tab) => (
                    <option key={tab.label} value={tab.label} className='options'>
                      {tab.label}
                    </option>
                  ))}
                </select>
                <div className='active-campus-container'>
                <div className='active-campus'> <div className='active-campus-box'></div> <p>Active Campus: {activeCount}</p></div>
                <div className='inactive-campus'> <div className='inactive-campus-box'></div> <p>Inactive Campus: {inactiveCount}</p></div>
              </div>
                <div className='mobile-content'>{selectedTabContent}</div>
              </div>
            </div>
          </div>
          {/**--------------------------------------------- */}


          {/**---------------school Deatails----------------------------- */}
          <div ref={schoolDetailsRef} className={`school-details ${schoolDetailsInView ? 'animate' : ''}`} >
            <div className="school-details-text" >
              <h1 style={{ color: '#383838' }}>{campusDetails.campusName}</h1>
              <h2>Meet the Fellowship Executives</h2>

              <div className="school-exe">
              <div ref={cardRef1}  className={`card ${activeCard === 1 ? 'flipped' : ''}`} onClick={() => handleCardClick(1)}>
                <div className='front'>
                    <div className='school-exe-image-container '>
                      <div className='school-exe-image-container-cont'>
                      <img className='images' src={campusDetails.secretaryPicture} alt="Coordinator Picture" />
                      <div className="overlay-content">
                      <h1 style={{ fontSize: '20px', fontWeight: 800 }}>secretary</h1>
                    </div>
                      </div>

                     </div>
                     <h4 style={{ textAlign: 'center', marginTop: '3vh' }}>{campusDetails.secretaryName}</h4>
                </div>
                <div className='back' style={{height:'auto'}}>
                <div className='exco-detailssec'>
                      <h6>Name: {campusDetails.secretaryName}</h6>
                      <h6>Course: {campusDetails.secretaryCourse}</h6>
                      <h6>Level: {campusDetails.secretaryLevel}</h6>
                      <h6>Email: <a href="">{campusDetails.secretaryEmail}</a></h6>
                      <h6>Phone no: <a href="">{campusDetails.secretaryPhone}</a></h6>
                    </div>
                    </div>
      </div>
              <div ref={cardRef2} className={`card ${activeCard === 2 ? 'flipped' : ''}`} onClick={() => handleCardClick(2)}>
              
              <div className='front'>
                <div className='school-exe-image-container'>
                <div className='school-exe-image-container-cont'>
                <img className='images' src={campusDetails.coordinatorPicture} alt="Coordinator Picture" />
                    <div className="overlay-content">
                      <h1 style={{ fontSize: '20px', fontWeight: 800 }}>Coordinator</h1>
                    </div>
                    <h4 style={{ textAlign: 'center', marginTop: '3vh' }}>{campusDetails.coordinatorName}</h4>
                  </div>
                </div>
                </div>
                
                <div className='back' style={{height:'auto'}}>
                <div className='exco-detailssec'>
                       <h6>Name: {campusDetails.coordinatorName}</h6>
                      <h6>Course: {campusDetails.coordinatorCourse}</h6>
                      <h6>Level: {campusDetails.coordinatorLevel}</h6>
                      <h6>Email: <a href="">{campusDetails.coordinatorEmail}</a></h6>
                      <h6>Phone no: <a href="">{campusDetails.coordinatorPhone}</a></h6>
                    </div>
                    </div>
      </div>
              </div>
                  

{/**-------------------Social Meadia---------------------------------- */}
              <div ref={schoolSocialDetailsRef} className={`school-social-details ${schoolSocialDetailsInView ? 'animate' : ''}`}>
                <div>Email: <a className='social-text' href="">{campusDetails.fellowshipEmail}</a></div>
                <div className='divider'></div>
                <div><a className='social-text' href="">{campusDetails.fellowshiPhone}</a></div>
                <div className='divider'></div>
                <div className='icons' style={{ marginRight: '2vh' }}>
                  <a href={campusDetails.fellowshipFacebook}><FiFacebook /></a>
                  <a href={campusDetails.fellowshipInstagram}><FiInstagram /></a>
                </div>
                <span>Afcf{campusDetails.campusAcronym}Chapter</span>
              </div>
            </div>
          </div>

          {/** -----------------fliyer container ----------------- */}
          <div className='flyer-container'>
                <div className='flyer-title'>
                  <div className='dot'>
                      <div className="indot">
                        
                      </div>
                  </div>
                  <h2>Fellowship Details</h2>
                </div>
        <div className="image-wrappers">
        <img className='image-flyer' src={campusDetails.flyer} alt="Image 1"/>        </div>
                <div className="address">
                  <li>Bible Study - {campusDetails.bibleStudyTime}</li>
                  <li>variety - {campusDetails.fellowshipTime}</li>
                  <li>{campusDetails.bibleStudyVenue}</li>
                </div>
                <div className='about-container'>
                <div className='flyer-title'>
                  <div className='dot'>
                      <div className="indot">
                        
                      </div>
                  </div>
                  <h2>About Fellowship</h2>
                </div>
                <div className='about-text-container'>
                <p className='about-text'>{campusDetails.about}</p>
                </div>
                </div>
          </div>

        
          {/**--------Capus Report--------------------------------- */}


          <div className='table-container'>
            <div className='campus-stat'>
          <div className='flyer-title'>
                  <div className='dot'>
                      <div className="indot"></div>
                  </div>
                  <h2>Campus Statistics</h2>
                </div>
                <div style={{overflowX:'auto'}}>
                <table className='styled-table  statistic-table'>
                            <thead>
                                <tr>
                                    <th>Report</th>
                                </tr>
                            </thead>
                            <tbody>
                                        <tr>
                                            <td>Average no of members</td>
                                            <td>{campusDetails.averageNumber}</td>
                                        </tr>
                            </tbody>
                            <tbody>
                                        <tr>
                                            <td>Number of Workers</td>
                                            <td>{campusDetails.workers}</td>
                                        </tr>
                            </tbody>
                        </table>
                        </div>
                        </div>
      
                      <div className='program-report'>
                     <div className='flyer-title'>
                  <div className='dot'>
                      <div className="indot"></div>
                  </div>
                  <h2>Programs Report</h2>
                </div>

      {error && <p>{error}</p>}
      <div style={{overflowX:'auto'}}>
      <table border="1" className='styled-table'>
        <thead>
          <tr>
            <th>Program</th>
            <th>Year</th>
            <th>Salvation</th>
            <th>Sanctification</th>
            <th>Baptism</th>
            <th>Healing</th>
            <th>Total Attendance (Male)</th>
            <th>Total Attendance (Female)</th>
            <th>Total Attendance</th>
            <th>Body</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Welcome Program</td>
            <td>{welcomeReport?.year || 'N/A'}</td>
            <td>{welcomeReport?.salvation || 'N/A'}</td>
            <td>{welcomeReport?.sanctification || 'N/A'}</td>
            <td>{welcomeReport?.baptism || 'N/A'}</td>
            <td>{welcomeReport?.healing || 'N/A'}</td>
            <td>{welcomeReport?.TotalAttendanceMale || 'N/A'}</td>
            <td>{welcomeReport?.TotalAttendanceFemale || 'N/A'}</td>
            <td>{welcomeReport?.TotalAttendance || 'N/A'}</td>
            <td>{welcomeReport?.body || 'N/A'}</td>
          </tr>
          <tr>
            <td>Revival Program</td>
            <td>{revivalReport?.year || 'N/A'}</td>
            <td>{revivalReport?.salvation || 'N/A'}</td>
            <td>{revivalReport?.sanctification || 'N/A'}</td>
            <td>{revivalReport?.baptism || 'N/A'}</td>
            <td>{revivalReport?.healing || 'N/A'}</td>
            <td>{revivalReport?.TotalAttendanceMale || 'N/A'}</td>
            <td>{revivalReport?.TotalAttendanceFemale || 'N/A'}</td>
            <td>{revivalReport?.TotalAttendance || 'N/A'}</td>
            <td>{revivalReport?.body || 'N/A'}</td>
          </tr>
        </tbody>
      </table>
      </div>
      <div className='google-drive-button'>
      {welcomeLink && <a style={{color:'blue'}} href={welcomeLink} target="_blank" rel="noopener noreferrer">Welcome Program Report</a>}
      {revivalLink && <a style={{color:'blue'}} href={revivalLink} target="_blank" rel="noopener noreferrer">Revival Program Report</a>}

      </div>
      </div>
    </div>

    {/*** ------------------Image Galerry ------------------- */}
    <div  className='program-image-container'>
               <div className="national-revival" >
                  <div className="flyer-title">
                    <div className="dot">
                      <div className="indot"></div>
                    </div>
                    <h2>National Revival Program</h2>
                  </div>
                  <div className="national-revival-images">
            
                         {revivalImages.length > 0 ? (
                           revivalImages.map((image, index) => (
                            <div className="school-exe-image-container" style={{margin:'3vh', height:'42vh'}}>
                             <img className='images' key={index} src={image} alt={`Revival Program ${index}`} onClick={() => openProgramModal(image)}/>
                             </div>
                           ))
                         ) : (
                           <p>No Rivival Program images available.</p>
                         )}
                     
                  </div>
               </div>

  
               <div className="national-revival">
                  <div className="flyer-title">
                    <div className="dot">
                      <div className="indot"></div>
                    </div>
                    <h2>Welcome Program</h2>
                  </div>
                  <div className="national-revival-images">
                         {welcomeImages.length > 0 ? (
                           welcomeImages.map((image, index) => (
                            <div className="school-exe-image-container" style={{margin:'3vh', height:'45vh'}}>
                             <img className='images' key={index} src={image} alt={`Welcome Program ${index}`} onClick={() => openProgramModal(image)}/>
                             </div>
                           ))
                         ) : (
                           <p>No Welcome Program images available.</p>
                         )}
                     
                  </div>
               </div>
                                 {isProgramModalOpen && (
                                          <div className='tt'>
                                            <div className="modal  show" onClick={closeProgramModal}>
                                            <div className="close-button" onClick={closeProgramModal}>&times;</div>
                                               <div className="modal-content" >
                                                   <img src={currentProgramImage} alt="Large view" className="large-image" />

                                                  </div>
                                             </div>
                                          </div>
                                         )}
                       </div>
                       <div className='history-container'>
                       <div className="flyer-title">
                    <div className="dot">
                      <div className="indot"></div>
                    </div>
                    <h2>Historical Images</h2>
                  </div>

                  <div className='edit-button-container' onClick={() => setEdit(true)}>
                    <p style={{marginRight:'2vh'}}>Add Images</p>
                  <RiImageAddFill className='edit-icon'/>
                  </div>
                  {edit && 
                       <div className='edit-container'>
                            <div className="add-image">
                              <div style={{display:'flex', justifyContent:'space-between'}}>
                              <div className="flyer-title">
                                <div className="dot">
                                  <div className="indot"></div>
                                </div>
                                <h2>Add Images</h2>
                                
                              </div>
                              <h2 style={{ cursor:'pointer'}} onClick={() => setEdit(false)}>x</h2>
                              </div>
                           
                              <hr/>
                              <form className='form' onSubmit={handleSubmit}>
                                   <div >
                                     <label>
                                       Campus Acronym:
                                       <input
                                       className='input-acronym'
                                         type="text"
                                         value={campusAcronym}
                                         onChange={(e) => setCampusAcronym(e.target.value)}
                                         required
                                         ref={campusInputRef}
                                         placeholder='Campus Acronym'
                                       />
                                     </label>
                                   </div>
                                   <div>
                                   <label for="images" className="drop-container" id="dropcontainer">
                                          <span className="drop-title">Drop files here</span>
                                          or
                                          <input type="file" id="images" accept="image/*" onChange={handleFileChange} required ref={pictureInputRef}/>
                                        </label>
                                   </div>
                                   <button
                                      className={`button ${isActive ? 'active' : ''} ${isFinished ? 'finished' : ''}`}
                                      type="submit"
                                      onTransitionEnd={addClass}>
                                      <span className="submit">Submit</span>
                                      <span className="loading"><RiRefreshFill /></span>
                                      <span className="check"><RiCheckboxCircleFill /></span>
                                    </button>
                                  
                                 </form>
                                 {responseMessage && <p style={{color:'#0172DA'}}>{responseMessage}</p>}
                            </div>
                       </div>
                  }
                           <div className="history-images">
                           <div className="national-revival-images">
                           {imagesToDisplay.length > 0 ? (
                                imagesToDisplay.map((image, index) => (
                                  <div key={image.id} className="school-exe-image-container" style={{ height:'40vh'}}>
                                    <img src={image.picture} alt={`Image ${image.id}`}  onClick={() => openModal(index)}/>
                                    {/* Display other image fields if necessary */}
                                  </div>
                                ))
                              ) : (
                                <p>No images available</p>
                              )}
                              <button className='see-more' onClick={() => setSeeMore(true)}>See More...</button>
                               </div>
                               {seeMore && (
                                    <div className="full-screen-gallery">
                                      <div className="close-button" onClick={() => setSeeMore(false)}>&times;</div>
                                      <div className="image-grid">
                                      {images.length > 0 ? (
                                              images.map((image, index) => (
                                                <div key={image.id} className="images-item">
                                                  <img className='images-item-img' src={image.picture} alt={`Image ${image.id}`}  onClick={() => openModal(index)}/>
                                                  {/* Display other image fields if necessary */}
                                                </div>
                                              ))
                                            ) : (
                                              <p>No images available</p>
                                            )}
                                      </div>
                                     
                                    </div>
                                  )}
                                   {isModalOpen && (
                                          <div className='tt'>
                                            <div className="modal  show" >
                                            <div className="close-button" onClick={closeModal}>&times;</div>
                                            <button className="custom-prev-button" onClick={prevImage}>&#10094;</button>
                                               <div className="modal-content" {...swipeHandlers}>
                                                 <img src={images[currentIndex].picture} alt="Modal view" className="modal-image" />
                                               </div>
                                               <button className="custom-next-button" onClick={nextImage}>&#10095;</button>
                                             </div>
                                          </div>
                                         )}
                           </div>
                       </div>
          
        </div>
        <div className='event-container'>
        <div className="flyer-title">
                    <div className="dot">
                      <div className="indot"></div>
                    </div>
                    <h2>Events</h2>
                  </div>
            <button className='event-button' onClick={getLatestEventAgmLink}>Get Latest Event AGM Link</button>
            {eventData && (
                <div className='event-list'>
                    <h2>{eventData.event_name}:</h2>
                    <a style={{marginLeft:'2vh'}} href={eventData.event_Live_link} target="_blank" rel="noopener noreferrer">
                        Join Event Live
                    </a>
                </div>
            )}
        </div>
        <div ref={containerRef}>
            <HelpDesk /> 
          </div>
      </div>
    </div>
    <Footer  campusDetails={campusDetails}/>
    </div>
  );
}

export default Home;
