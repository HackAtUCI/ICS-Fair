import './Webcam.css';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Webcam() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  const getVideo = () => {
    navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: window.innerWidth },
        height: { ideal: window.innerHeight }
      }
    })
    .then((stream) => {
      let video = videoRef.current;
      video.srcObject = stream;
      video.play();
    })
    .catch((err) => {
      console.error(err);
    })
  }

  const capturePhoto = () => {

    // Draw the current frame on a canvas
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to jpeg
    const imageData = canvas.toDataURL('image/jpeg');
    
    // Navigate to Canvas page with the photo
    navigate('/canvas', { state: { photo: imageData } });
  }


  useEffect(() => {
    getVideo();
  }, [videoRef])

  return (
    <>
      <div>
        <h1 className='header'>WANTED</h1>
        <video className="webcam-video" ref={videoRef}></video>
      </div>
      <button 
        onClick={capturePhoto}
        className="capture-button"
      >
        <img 
          src="/camera-icon.png" 
          alt="Capture photo"
          className="camera-icon"
        />
      </button>
    </>
  );
}
