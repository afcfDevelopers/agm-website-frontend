import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import './campus.css';
import useEmblaCarousel from 'embla-carousel-react';
import { FiFacebook, FiInstagram } from "react-icons/fi";
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade'
import logo1 from '../../Images/logo1.png';
import { BallTriangle } from 'react-loader-spinner';
import demo1 from '../../Images/demo1.jpeg';
import demo2 from '../../Images/demo2.jpeg';
import { BiSolidError } from "react-icons/bi";
import { RiCheckboxCircleFill, RiImageAddFill, RiMailFill, RiRefreshFill } from "react-icons/ri";
import SecondEmblaSlider from '../../Components/embla/EmblaSlider';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import '../../Components/embla/emblaCss.css'
const School = () => {
  const { campusOrSchoolAcronym } = useParams();
  const [campusDetails, setCampusDetails] = useState(null);
  const [campusHistoricPics, setCampusHistoricPics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Fade(), Autoplay({delay: 3000})]);
  const contentRef = useRef();
  const [isZoomedIn, setIsZoomedIn] = useState(false);

  const handleImageClick = () => {
    setIsZoomedIn(!isZoomedIn);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://afcfagm.pythonanywhere.com/api/get-all-campusavs/?campus=${campusOrSchoolAcronym}`);
        const data = response.data;
        console.log('API response:', data);
        const responseDetails = data['queryset'][0];

        if (responseDetails) {
          setCampusDetails(responseDetails);
        } else {
          setError('No details found for the specified campus.');
        }
      } catch (error) {
        console.error('Error fetching campus data:', error);
        setError('Error fetching campus data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [campusOrSchoolAcronym]);

  const [edit, setEdit] = useState(false)

  const [picture, setPicture] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const campusInputRef = useRef(null);
  const pictureInputRef = useRef(null);
  const [campusAcronym, setCampusAcronym] = useState(campusOrSchoolAcronym);

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
  
  
  const fetchHistoricalImages = async () => {
    try {
      const response = await axios.get(`https://afcfagm.pythonanywhere.com/api/get-history-images/?campus=${campusOrSchoolAcronym}`);
      console.log('Images retrieved successfully:', response.data);
  
      // Assuming `response.data.queryset` contains an array of objects, each with an `imageURL` or similar field
      const imageUrls = response.data.queryset.map(item => item.picture); // Adjust according to actual field name
      setCampusHistoricPics(imageUrls);
    } catch (error) {
      console.error('Error fetching historical images:', error);
      throw error;
    }
  };
  
  const [campusReportPics, setCampusReportPics] = useState({ nrp_images: [], wlc_images: [] });
 
 
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`https://afcfagm.pythonanywhere.com/api/get-report?campus=${campusOrSchoolAcronym}`);
        setCampusReportPics(response.data);
      } catch (err) {
        setError('Failed to fetch images.');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [campusOrSchoolAcronym]);


  useEffect(() => {
    fetchHistoricalImages()
 
  }, [campusOrSchoolAcronym])

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const onDotButtonClick = useCallback(
    (index) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onInit = useCallback((emblaApi) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());

    const slides = emblaApi.slideNodes();
    slides.forEach((slide, index) => {
      slide.classList.toggle('is-selected', index === emblaApi.selectedScrollSnap());
    });
  }, []);
  
  const [isProgramModalOpen, setProgramIsModalOpen] = useState(false);
  const [currentProgramImage, setCurrentProgramImage] = useState('');

  const openProgramModal = (slide) => {
    setProgramIsModalOpen(true);
    setCurrentProgramImage(slide)
  
  };

  const closeProgramModal = () => {
    setProgramIsModalOpen(false);

    setCurrentProgramImage('')
  };



  useEffect(() => {
    if (!emblaApi) return;
    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', onInit).on('reInit', onSelect).on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);
  
  if (loading) {
    return <div className='loader-container'>
      <BallTriangle
    height={100}
    width={100}
    radius={5}
    color="#007AFF"
    ariaLabel="ball-triangle-loading"
    wrapperStyle={{}}
    wrapperClass=""
    visible={true}
    /></div>

  }

  if (error) {
    return (
      <div style={{
        color: 'blue',
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column' // Stack items vertically
      }}>
        <div>{error}</div>
        <button
          onClick={() => window.location.reload()} // Refresh the page
          style={{
            marginTop: '20px', // Add space between error message and button
            padding: '10px 20px',
            backgroundColor: '#007AFF',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'} // Darken color on hover
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007AFF'} // Reset color
        >
          Refresh
        </button>
      </div>
    );
  }
  

  if (!campusDetails) {
    return <div>No campus details available.</div>;
  }
  const revivalSlide = [
    campusDetails.nrp_picture1 || null,
    campusDetails.nrp_picture2 || null,
    campusDetails.nrp_picture3 || null,
    campusDetails.nrp_picture4 || null,
    campusDetails.nrp_picture5 || null,
    campusDetails.nrp_picture6 || null,
    campusDetails.nrp_picture7 || null,
    campusDetails.nrp_picture8 || null,
  ];
  const welcomeSlides = [
    campusDetails.wlc_picture1 || null,
    campusDetails.wlc_picture2 || null,
    campusDetails.wlc_picture3 || null,
    campusDetails.wlc_picture4 || null,
    campusDetails.wlc_picture5 || null,
    campusDetails.wlc_picture6 || null,
    campusDetails.wlc_picture7 || null,
    campusDetails.wlc_picture8 || null,
  ];

  

  const handleDownloadPdf = () => {
    const content = contentRef.current;

    html2canvas(content, { useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('download.pdf');
    });
  };

  
  return (
    <div ref={contentRef}>
    {loading ? (
      <div className='loader-container'>Loading...</div>
    ) : error ? (
      <div className='campus-main-container'>
         <div><BiSolidError size={250} color='red'/></div>
        <p>{error}</p>
      </div>
    
    ) : campusDetails ? (
      campusDetails.active_Inactive && campusDetails.active_Inactive.toLowerCase() === 'inactive' ? (
        // Display the 'about' section if the campus is inactive
        <div className='campus-main-container'>
           <div className="inactive-container">
          <div><BiSolidError size={250} color='red'/></div>
           <h1 style={{color:'black'}} className="inactive-headtext">{campusDetails.campusName}</h1>
           <p className="inactive-text">{campusDetails.about}</p>
           </div>
          
        </div>
      ) : (
    <div className='campus-main-container' ref={contentRef}>
      <div className='campus-container'>
        <div className="hero-section">
        <div className="campus-hero-container">
        <div className='campus-hero'>
        <div className='campus-hero-one'>
            <h1>{campusDetails.campusName}</h1>
            <p>AFCF {campusDetails.campusOrSchoolAcronym}  as a body organizes programmes that cut across various spheres of a student life; particularly the academic, physical and social spheres.</p>
          </div>
          <div className='campus-hero-two'>
            <div className='ty'>
            <div className="slided-container">
            <div className="embla" ref={emblaRef}>
                  <div className="embla__container">
                    <div className="embla__slide"><img className='embla__slide-img' src={campusDetails.flyer || demo1} alt="" /></div>
                    <div className="embla__slide"><img className='embla__slide-img' src={campusDetails.flyer2 || demo2} alt="" /></div>
                  </div>
                </div>
                <div className='slider-button-container'>
                {scrollSnaps.map((_, index) => (
                 
                  <button
                    key={index}
                    onClick={() => onDotButtonClick(index)}
                    className={'embla__dot'.concat(index === selectedIndex ? ' embla__dot--selected' : '')}
                  />
                 
                ))}
                 </div>
              

              </div>
              </div>
           
         </div>
        </div>
        <div className='alumni-button-container'>
  <a
    href={
      campusDetails.joinAlumiGroup && campusDetails.joinAlumiGroup.trim() !== ''
        ? campusDetails.joinAlumiGroup
        : 'https://docs.google.com/forms/d/e/1FAIpQLSc_TSsN5noV6zVYRXXaz6XMDiudeCsZsXOgw05sZsZocIFdQQ/viewform?usp=sf_link'
    }
    target="_blank"
    rel="noopener noreferrer"
  >
    <button className='alumni-button'>Join the Alumni Group</button>
  </a>
</div>

      </div>
      </div>
      <div className='campus-exe-container'>
          <h1 style={{color:'black', marginBottom:'5vh'}}>{campusDetails.campusName} </h1>
          <h2 style={{marginBottom:'3vh'}}>Meet the Campus Executive</h2>
          <div className="exe-container">
            <div className="exe-details-container-one">
              <div className="exe-image">
                  <div className='exe-image-container'>
                  <img className='images' src={campusDetails.coordinator_picture} alt="coordinator" />
                    <div className="overlay-content">
                    <h1 style={{ fontSize: '20px', fontWeight: 800 }}>Coordinator</h1>
                    </div>
                  </div>
              </div>
               <div className="exe--details">
                      <h6>Name: {campusDetails.coordinator_name} </h6>
                      <h6>Course: {campusDetails.coordinator_course} </h6>
                      <h6>Level: {campusDetails.coordinator_level} </h6>
                      <h6>Email: <a href="">{campusDetails.coordinator_email} </a></h6>
                      <h6>Phone no: <a href="">{campusDetails.coordinator_phonenumber} </a></h6>
               </div>
            </div>
            <div className="exe-details-container-two">
            <div className="exe--details" style={{marginRight:'3vh'}}>
                      <h6>Name: {campusDetails.secretary_name} </h6>
                      <h6>Course: {campusDetails.secretary_course} </h6>
                      <h6>Level: {campusDetails.secretary_level} </h6>
                      <h6>Email: <a href="">{campusDetails.secretary_email} </a></h6>
                      <h6>Phone no: <a href="">{campusDetails.secretary_phonenumber} </a></h6>
                  </div>
                <div className="exe-image">
                <div className='exe-image-container'>
                <img className='images' src={campusDetails.secretary_picture} alt="secretary" />
                    <div className="overlay-content">
                    <h1 style={{ fontSize: '20px', fontWeight: '800' }} >Secretary</h1>

                    </div>
                  </div>
                </div>
                
            </div>
          </div>
          <div className='campus-socialmedia-container'>
           <div className="campus-socialmedia">
            
            <div className='social-container-one'>
            <div className="email-icon-container" style={{marginLeft:'-5vh'}}>
               <div className="email-icon">
               <RiMailFill size={'30'}/>

               </div>
            </div>
            <a href={`mailto:${campusDetails.fellowship_email}`} className='email-link'  target="_blank rel='noopener noreferrer'">
  {campusDetails.fellowship_email}
</a>
            </div>
          
            <div className='social-container-two'>
            <div className='icon' style={{ marginRight: '1vh', display: 'flex', alignItems: 'center' }}>
  {/* Facebook */}
  {campusDetails.fellowship_facebook_link && typeof campusDetails.fellowship_facebook_link === 'string' && (
  <a
    href={
      campusDetails.fellowship_facebook_link.startsWith('https') 
        ? campusDetails.fellowship_facebook_link 
        : `https://${campusDetails.fellowship_facebook_link}`
    }
    style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }}
    target="_blank" 
    rel="noopener noreferrer" 
  >
    <FiFacebook style={{ marginRight: '2px' }} />
    <div style={{ fontSize: '14px' }}>
      @{(() => {
        const url = campusDetails.fellowship_facebook_link;
        if (url.includes('profile.php')) {
          // Fallback to campusOrSchoolAcronym if profile.php is detected
          return campusDetails.campusOrSchoolAcronym || 'Unknown';
        } else {
          // Extract the last part of the URL as the username
          return url.split('/').pop().split('?')[0];
        }
      })()}
    </div>
  </a>
)}

 
  {campusDetails.fellowship_instagram_link && typeof campusDetails.fellowship_instagram_link === 'string' && (
  <a
    href={
      campusDetails.fellowship_instagram_link.startsWith('https')
        ? campusDetails.fellowship_instagram_link
        : `https://${campusDetails.fellowship_instagram_link}`
    }
    style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white', marginLeft: '15px' }}
    target="_blank" // Open link in a new tab
    rel="noopener noreferrer" // Security purposes
  >
    <FiInstagram style={{ marginRight: '2px' }} />
    <div style={{fontSize:'14px'}}>
      @
      {campusDetails.fellowship_instagram_link.split('/').pop().split('?')[0]}
    </div >
  </a>
)}

</div>


            <div className="email-icon-container" style={{marginRight:'-5vh'}}>
               <div className="email-icon">
               <img src={logo1} style={{width:'50%'}}alt="" />
               </div>
            </div>
            
            </div>
           </div>
          </div>
      </div>
      <div className='campus-details-container'>
        <div>
        <div className='flyer-title'>
                  <div className='dot'>
                      <div className="indot"></div>
                  </div>
                  <h1 style={{color:'black'}}>Fellowship Details</h1>
                </div>
                <div style={{overflowX:'auto'}}>
                <table className='styled-table  statistic-table'>
                            <thead>
                                <tr>
                                    <th>Bible Study</th>
                                </tr>
                            </thead>
                            <tbody>
                                        <tr>
                                            <td>Day</td>
                                            <td>{campusDetails.bibleStudyDay}</td>
                                        </tr>
                            </tbody>
                            <tbody>
                                        <tr>
                                            <td>Time</td>
                                            <td>{campusDetails.bibleStudyTime}</td>
                                        </tr>
                            </tbody>
                            <tbody>
                                        <tr>
                                            <td>Venue</td>
                                            <td>{campusDetails.bibleStudyVenue}</td>
                                        </tr>
                            </tbody>
                        </table>
                        </div>
        </div>
        <div>
       
                <div style={{overflowX:'auto'}}>
                <table className='styled-table  statistic-table'>
                <thead>
                                <tr>
                                    <th>Varities</th>
                                </tr>
                            </thead>
                            <tbody>
                                        <tr>
                                            <td>Day</td>
                                            <td>{campusDetails.fellowshipDay}</td>
                                        </tr>
                            </tbody>
                            <tbody>
                                        <tr>
                                            <td>Time</td>
                                            <td>{campusDetails.fellowshipTime}</td>
                                        </tr>
                            </tbody>
                            <tbody>
                                        <tr>
                                            <td>Venue</td>
                                            <td>{campusDetails.fellowshipVenue}</td>
                                        </tr>
                            </tbody>
                        </table>
                        </div>
                        
      
          </div>

          <div className='other-programs-container'>
          <div className='flyer-title'>
                  <div className='dot'>
                      <div className="indot"></div>
                  </div>
                  <h1 style={{color:'black'}}>Other Programs</h1>
                </div>
                <div className='other-program'>
                  {campusDetails.OtherScheduleOfServiceDetails || 'No Other Special Program'}
                        </div>
        </div>

          <div className='other-programs-container'>
          <div className='flyer-title'>
                  <div className='dot'>
                      <div className="indot"></div>
                  </div>
                  <h1 style={{color:'black'}}>Campus Update</h1>
                </div>
                <div className='other-program others'>
                  {campusDetails.UpdateAboutSchool || 'No no update about school'}
                        </div>
        </div>
          <div>
          <div className='flyer-title'>
                  <div className='dot'>
                      <div className="indot"></div>
                  </div>
                  <h1 style={{color:'black'}}>Campus Statistics</h1>
                </div>
                <div style={{overflowX:'auto'}}>
                <table className='styled-table  statistic-table'>
                           
                            <tbody>
                                        <tr>
                                            <td>Average no of members</td>
                                            <td>{campusDetails.averageNumberOfStudent}</td>
                                        </tr>
                            </tbody>
                            <tbody>
                                        <tr>
                                            <td>Number of Workers</td>
                                            <td>{campusDetails.numberOfWorkforce}</td>
                                        </tr>
                            </tbody>
                        </table>
                        </div>
        </div>
      </div>
      <div>
      <div style={{overflowX:'auto'}}>
      <div className='flyer-title'>
                  <div className='dot'>
                      <div className="indot"></div>
                  </div>
                  <h1 style={{color:'black'}}>Program Report</h1>
                </div>
       <table border="1" className='program-table'>
        <thead>
          <tr>
            <th>Program</th>
            <th>Year</th>
            <th>Salvation</th>
            <th>Sanctification</th>
            <th>Baptism</th>
            <th>Healing</th>
            <th>Reannointing</th>
            <th>Others</th>
            <th>Officiating Members</th>
            <th>Total Attendance (Male)</th>
            <th>Total Attendance (Female)</th>
            <th>Total Attendance</th>
           
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Welcome Program</td>
            <td>{campusDetails.wlc_year}</td>
            <td>{campusDetails.wlc_salvation}</td>
            <td>{campusDetails.wlc_sanctification}</td>
            <td>{campusDetails.wlc_baptism}</td>
            <td>{campusDetails.wlc_healing}</td>
            <td>{campusDetails.wlc_reannointing}</td>
            <td>{campusDetails.wlc_others}</td>
            <td>{campusDetails.wlc_officiatingmembers}</td>
            <td>{campusDetails.wlc_TotalAttendanceMale}</td>
            <td>{campusDetails.wlc_TotalAttendanceFemale}</td>
            <td>{campusDetails.wlc_TotalAttendance}</td>
          </tr>
          <tr>
            <td>Revival Program</td>
            <td>{campusDetails.nrp_year}</td>
            <td>{campusDetails.nrp_salvation}</td>
            <td>{campusDetails.nrp_sanctification}</td>
            <td>{campusDetails.nrp_baptism}</td>
            <td>{campusDetails.nrp_healing}</td>
            <td>{campusDetails.nrp_reannointing}</td>
            <td>{campusDetails.nrp_others}</td>
            <td>{campusDetails.nrp_officiatingmembers}</td>
            <td>{campusDetails.nrp_TotalAttendanceMale}</td>
            <td>{campusDetails.nrp_TotalAttendanceFemale}</td>
            <td>{campusDetails.nrp_TotalAttendance}</td>
          </tr>
        </tbody>
      </table>
      </div>
      <div className="sliders-container">
      <div className='flyer-title'>
                  <div className='dot'>
                      <div className="indot"></div>
                  </div>
                  <h1 style={{color:'black'}}>Welcome Program Pictures</h1>
                </div>
                <div style={{marginTop:'7vh'}} className="embla_">
          
                <div className="embla___container">
                {Array.isArray(campusReportPics.wlc_images) && campusReportPics.wlc_images.length > 0 ? (
        campusReportPics.wlc_images.map((image, index) => (
          <div className="embla___slide" key={`nrp-${index}`}>
            <div className="embla___slide__number-container">
              <div className="embla___slide__number">
                <img
                  src={image}
                  alt={`NRP Image ${index + 1}`}
                  className="embla___slide__image"
                />
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No NRP images available.</p>
      )}

                 </div>  
                </div>
    </div>
      <div className="sliders-container">
      <div className='flyer-title'>
                  <div className='dot'>
                      <div className="indot"></div>
                  </div>
                  <h1 style={{color:'black'}}>National Revival Program Pictures</h1>
                </div>
                <div style={{marginTop:'7vh'}} className="embla_">
          
          <div className="embla___container">
                   {Array.isArray(campusReportPics.nrp_images) && campusReportPics.nrp_images.length > 0 ? (
                    campusReportPics.nrp_images.map((image, index) => (
                      <div className="embla___slide" key={`wlc-${index}`}>
                        <div className="embla___slide__number-container">
                          <div className="embla___slide__number">
                            <img
                              src={image}
                              alt={`WLC Image ${index + 1}`}
                              className="embla___slide__image"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No WLC images available.</p>
                  )}
              </div>
          </div>
    </div>
      <div className="sliders-container">
      <div className='flyer-title'>
                  <div className='dot'>
                      <div className="indot"></div>
                  </div>
                  <h1 style={{color:'black'}}>Historic Pictures</h1>
                </div><h3 className='font-bold'>Upload Your Personal AFCF Throwback Images</h3>
                <div style={{marginTop:'7vh'}}>
                  
                <SecondEmblaSlider slides={campusHistoricPics} openProgramModal={openProgramModal}/>
                </div>
    </div>
      </div>
      <div className="uploads-container">
        <div className="upload-button-container" onClick={() => setEdit(true)}>
          <button className='upload-button'><h4>Add Images</h4><RiImageAddFill className='edit-icon'/></button>
          <p>upload your personal AFCF Throwback Pictures</p>
        </div>
        <div onClick={handleDownloadPdf} className="upload-button-container">
          <button className='download-button'><h4>Download Page</h4><RiImageAddFill className='edit-icon'/></button>
          
        </div>
      </div>
      </div>
     

                     {isProgramModalOpen && (
                       <div className="tt">
                         <div className="modal show" onClick={closeProgramModal}>
                           <div className="close-button" onClick={closeProgramModal}>&times;</div>
                           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                             <div className={`zoom-container ${isZoomedIn ? 'zoomed-in' : ''}`} onClick={handleImageClick}>
                               <img
                                 src={currentProgramImage}
                                 alt="Large view"
                                 className="zoom-image"
                               />
                             </div>
                           </div>
                         </div>
                       </div>
                     )}


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
                                     <h3>(Upload one picture at the time) 
                                     </h3>
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
    </div>)
     ) : (
      <p>No campus details available.</p>
    )}
  </div>
  );
};

export default School;

