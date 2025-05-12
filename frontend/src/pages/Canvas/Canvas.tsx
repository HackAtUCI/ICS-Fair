import React from 'react';
import { useLocation } from 'react-router-dom';
import './Canvas.css'


export default function Canvas() {
  const location = useLocation();
  const { photo } = location.state || {};

  return (
    <div>
      {photo && <img src={photo} alt="Captured photo" className="photo"/>}
    </div>
  );
}
