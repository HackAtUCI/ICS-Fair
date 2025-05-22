import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Canvas.css'


export default function Canvas() {
  const location = useLocation();
  const { photo } = location.state || {};
  const navigate = useNavigate();

  const redoPhoto= () => {
    navigate('/');
  }


  return (
    <div>
      <div>
        <h1 className='header'>WANTED</h1>
        {photo && <img src={photo} alt="Captured photo" className="photo"/>}
      </div>

      <button 
        onClick={redoPhoto}
        className="capture-button"
      >
        <img 
          src="/redo-icon.png" 
          alt="Redo photo"
          className="redo-icon"
        />
      </button>
    </div>
    
  );
}
