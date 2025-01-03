import React from 'react';
// import React, {useRef} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './Pages/Home/Home';
import Campus from './Pages/Campus/Campus';
import Navbar from './Components/NavBar/Navbar';
import Footer from './Components/Footer/Footer';



const App = ({campusDetails}) => {
  // const containerRef = useRef(null);

  // const scrollToContainer = () => {
  //   if (containerRef.current) {
  //     containerRef.current.scrollIntoView({ behavior: 'smooth' });
  //   }
  // };
  return (
    <div>
  
      <Router>
      <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/campus/:campusOrSchoolAcronym" element={<Campus />} />
        </Routes>
      </Router>
      <Footer  />
    </div>
  );
};

export default App;
