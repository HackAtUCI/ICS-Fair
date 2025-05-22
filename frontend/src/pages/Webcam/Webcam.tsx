import "./Webcam.css";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Video from "react-webcam";

export default function Webcam() {
  const videoRef = useRef<Video>(null);
  const navigate = useNavigate();

  const capturePhoto = () => {
    const imageSrc = videoRef.current?.getScreenshot();
    if (imageSrc) {
      navigate("/canvas", { state: { photo: imageSrc } });
    } else {
      console.log("No image captured");
    }
  };

  return (
    <>
      <div className="webcam">
        <h1 className="header">WANTED</h1>
        <Video
          audio={false}
          ref={videoRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: window.innerWidth,
            height: window.innerHeight,
          }}
          className="webcam-video"
        />
      </div>
      <button onClick={capturePhoto} className="capture-button">
        <img
          src="/camera-icon.png"
          alt="Capture photo"
          className="camera-icon"
        />
      </button>
    </>
  );
}
