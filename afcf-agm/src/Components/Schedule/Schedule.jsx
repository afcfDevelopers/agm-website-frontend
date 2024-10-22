import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import './schedule.css'
const PdfDownload = () => {
  const [activities, setActivities] = useState({});
  const contentRef = useRef();

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://afcfagm.pythonanywhere.com/api/get-program-activities/'
        );
        const data = response.data.queryset;
        
        // Group the activities by AGM_Day
        const groupedActivities = data.reduce((acc, activity) => {
          const day = activity.AGM_Day;
          if (!acc[day]) {
            acc[day] = [];
          }
          acc[day].push(activity);
          return acc;
        }, {});
        
        setActivities(groupedActivities);
      } catch (error) {
        console.error('Error fetching the data', error);
      }
    };

    fetchData();
  }, []);

 

  return (
    <div className='main-schedule'>
      <div className='main-schedule-container'>
      <div className='flyer-title'>
              <div className='dot'>
                <div className="indot"></div>
              </div>
              <h2>Schedule of Activities</h2>
            </div>
        {Object.keys(activities).length > 0 ? (
          Object.keys(activities).map((day) => (
            <div key={day} className='schedule-container'>
              <div className='schedule-name'>
              <h3>{day}</h3>
              </div>
             
              {activities[day].map((activity) => (
                <div key={activity.id} className='schedule-activities'>
                  <div>
                  <h3>{activity.program_activity_title}</h3>
                  <p>Time: {activity.activity_timeline}</p>
                  </div>
                 <div>
                 <a href={activity.program_activity_link} target="_blank" rel="noopener noreferrer">Join Program</a>
                 </div>
                  
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>Loading activities...</p>
        )}
      </div>
      <div className='schedule-download-button'>
      <a href="/2024-AGM-Order-of-programme.xlsx" download='2024 AGM Order of programme'>
  <button className="schedule-button">Download Schedule Activities</button>
</a>

      </div>
    </div>
  );
};

export default PdfDownload;
