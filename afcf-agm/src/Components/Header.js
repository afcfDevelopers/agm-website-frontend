import React, { useState, useRef, useEffect } from 'react';
import '../Pages/Home/css.css';
import { RiCheckboxCircleFill, RiImageAddFill, RiRefreshFill } from "react-icons/ri";

const AnimatedButton = ({ label, onClick }) => {
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

  return (
    <button
      ref={buttonRef}
      className={`button ${isActive ? 'active' : ''} ${isFinished ? 'finished' : ''}`}
      onClick={onClick}
    >
      <span className="submit">{label}</span>
      <span className="loading"><RiRefreshFill/></span>
      <span className="check"><RiCheckboxCircleFill/></span>
    </button>
  );
};

export default AnimatedButton;
