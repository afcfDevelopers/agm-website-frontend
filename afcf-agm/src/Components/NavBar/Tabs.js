import React, { useState } from 'react';
import '../../Pages/Home/home.css';  // Your custom CSS file

const Tab = ({ tabs, activeCount, inactiveCount} ) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="tab-container">
            <div className="tab-buttons">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        className={`tab-button ${activeTab === index ? 'active' : ''}`}
                        onClick={() => setActiveTab(index)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className='active-campus-container'>
                <div className='active-campus'> <div className='active-campus-box'></div> <p>Total Active Campus: {activeCount}</p></div>
                <div className='inactive-campus'> <div className='inactive-campus-box'></div> <p>Total Inactive Campus: {inactiveCount}</p></div>
              </div>
            <div className="tab-content">
                <div style={{overflowY:'auto', width:'100%', height:'100%'}}>
                {tabs[activeTab].content}
                </div>
            </div>
        </div>
    );
};

export default Tab;
