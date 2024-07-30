import React, { useState } from 'react';
import './HelpDesk.css';
import { useInView } from 'react-intersection-observer';

const HelpDesk = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Feedback submitted:', message);
    setMessage(''); 

  };

  const { ref: formContainerRef, inView: formContainerInView } = useInView({ triggerOnce: false });


  return (
    <div ref={formContainerRef} className={`form-container ${formContainerInView ? 'animate' : ''}`}>
      <h2>To Join Alumni Group click this link</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <textarea
            id="message"
            name='message'
            placeholder='Your Help Desk'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="form-group">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default HelpDesk;
