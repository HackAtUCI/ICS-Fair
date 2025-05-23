import "./Webcam.css";
import { useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";

interface WebcamProps {
  bags: number;
}

export default function WebcamComponent({ bags }: WebcamProps) {
  const webcamRef = useRef<Webcam>(null);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  const handleUserMedia = useCallback(() => {
    setError(null);
  }, []);

  const handleUserMediaError = useCallback((error: string | DOMException) => {
    setError(
      "Unable to access webcam. Please make sure you have granted camera permissions."
    );
    console.error("Webcam error:", error);
  }, []);

  const capturePhoto = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      navigate("/canvas", { state: { photo: imageSrc, bags } });
    } else {
      setError("Failed to capture photo. Please try again.");
    }
  };

  return (
    <>
      <div className="webcam">
        <h1 className="header">WANTED</h1>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="webcam-video"
          onUserMedia={handleUserMedia}
          onUserMediaError={handleUserMediaError}
        />
        {error && <div className="webcam-error">{error}</div>}
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
