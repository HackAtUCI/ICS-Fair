// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "./Canvas.css";

// export default function Canvas() {
//   const location = useLocation();
//   const { photo } = location.state || {};
//   const navigate = useNavigate();

//   const redoPhoto = () => {
//     navigate("/"); // Change this to /webcam
//   };

//   return (
//     <div>
//       <div>
//         <h1 className="header">WANTED</h1>
//         {photo && <img src={photo} alt="Captured photo" className="photo" />}
//       </div>

//       <button onClick={redoPhoto} className="capture-button">
//         <img src="/redo-icon.png" alt="Redo photo" className="redo-icon" />
//       </button>

import { useState, useEffect, useMemo, useRef } from "react";
import { Stage, Layer, Image } from "react-konva";
import useImage from "use-image";
import { useLocation, useNavigate } from "react-router-dom";
import Konva from "konva";

import CanvasImage, {
  CanvasImageProps,
} from "../../components/CanvasImage/CanvasImage.tsx";
import IconButton from "../../components/IconButton/IconButton";
import PreviewModal from "../../components/PreviewModal/PreviewModal";

import "./Canvas.css";

const CANVAS_W = 800 * 0.8;
const CANVAS_H = 450 * 0.8;

export default function Canvas() {
  const navigate = useNavigate();
  const [bg] = useImage("/canvas_bg.jpg");
  const [items, setItems] = useState<CanvasImageProps[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const canvas = useRef<Konva.Stage>(null);
  const location = useLocation();
  const { photo } = location.state || {};
  const [photoImage] = useImage(photo || "");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

  const sidebarImages = useMemo(() => {
    const imgs = import.meta.glob(
      "/public/sidebar_images/*.{png,jpg,jpeg,gif,svg}",
      { query: "?url", import: "default", eager: true }
    );
    return Object.values(imgs) as string[];
  }, []);

  useEffect(() => {
    const handleDelete = (e: KeyboardEvent) => {
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedId !== null
      ) {
        setItems((p) => p.filter((n) => n.id !== selectedId));
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", handleDelete);
    return () => window.removeEventListener("keydown", handleDelete);
  }, [selectedId]);

  // Scale sidebar image to fit nicely on the canvas
  const addImage = (src: string) => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      const TARGET = 200; // Tries to make the largest side of the image close to 200px
      const scale = TARGET / Math.max(img.width, img.height);
      setItems((p) => [
        ...p,
        {
          id: Date.now(),
          url: src,
          x: CANVAS_W / 2,
          y: CANVAS_H / 2,
          rotation: 0,
          scale,
        },
      ]);
    };
  };

  // Pushes last-selected image to the top-most layer
  const handleSelect = (id: number) => {
    setSelectedId(id);
    setItems((p) => {
      const idx = p.findIndex((n) => n.id === id);
      if (idx === -1) {
        return p;
      }
      const copy = [...p];
      const [picked] = copy.splice(idx, 1);
      copy.push(picked);
      return copy;
    });
  };

  const handlePreview = () => {
    if (canvas.current) {
      const dataUrl = canvas.current.toDataURL();
      setPreviewDataUrl(dataUrl);
      setIsPreviewOpen(true);
    }
  };

  return (
    <div className="canvas-page">
      <div className="canvas-wrapper">
        <h1 className="poster-title">WANTED</h1>

        <div className="canvas-frame">
          <Stage
            width={CANVAS_W}
            height={CANVAS_H}
            ref={canvas}
            onMouseDown={(e) => {
              if (e.target === e.target.getStage()) {
                setSelectedId(null);
              }
            }}
          >
            <Layer>
              {photoImage && (
                <Image
                  image={photoImage}
                  width={CANVAS_W}
                  height={CANVAS_H}
                  listening={false}
                />
              )}
            </Layer>
            <Layer>
              {items.map((node) => (
                <CanvasImage
                  key={node.id}
                  {...node}
                  isSelected={node.id === selectedId}
                  onSelect={() => handleSelect(node.id)}
                />
              ))}
            </Layer>
          </Stage>

          <div className="canvas-btn--center">
            <IconButton
              src="/icons/retake_picture.svg"
              title="Retake Picture"
              onClick={() => navigate("/webcam")}
            />
          </div>

          <div className="canvas-btn--right">
            <IconButton
              src="/icons/preview.svg"
              title="Preview Wanted Poster"
              onClick={handlePreview}
            />
            
          </div>
        </div>
      </div>

      <div className="sidebar">
        {sidebarImages.map((src) => (
          <img
            key={src}
            src={src}
            onClick={() => addImage(src)}
            style={{ width: "100%", cursor: "pointer" }}
          />
        ))}
      </div>

      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        canvasDataUrl={previewDataUrl}
      />
    </div>
  );
}
