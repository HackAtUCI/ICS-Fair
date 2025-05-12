import { useState, useEffect, useMemo, useRef } from "react";
import { Stage, Layer, Image, Transformer } from "react-konva";
import useImage from "use-image";
import { useNavigate } from "react-router-dom";
import Konva from "konva";

const CANVAS_W = 800 * 0.8;
const CANVAS_H = 450 * 0.8;
const ACCENT_COLOR = "#BDB199";
const BUTTON_DIAMETER = 48;

interface CanvasImageProps {
  id: number;
  url: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  isSelected?: boolean;
  onSelect?: () => void;
}

// Draggable canvas image component
function CanvasImage(props: CanvasImageProps) {
  const { url, isSelected, onSelect, x, y, rotation, scale } = props;
  const [img] = useImage(url);
  const shape = useRef<Konva.Image>(null);
  const transformer = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (img && shape.current) {
      shape.current.offsetX(img.width / 2);
      shape.current.offsetY(img.height / 2);
    }
  }, [img]);

  useEffect(() => {
    if (isSelected && transformer.current && shape.current) {
      transformer.current.nodes([shape.current]);
      transformer.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const handleClick = () => {
    if (shape.current) {
      shape.current.moveToTop();
      shape.current.getLayer()?.batchDraw();
    }
    onSelect?.();
  };

  return (
    <>
      <Image
        image={img}
        x={x}
        y={y}
        rotation={rotation}
        scaleX={scale}
        scaleY={scale}
        ref={shape}
        draggable
        onClick={handleClick}
      />
      {isSelected && (
        <Transformer
          ref={transformer}
          rotateEnabled
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ]}
        />
      )}
    </>
  );
}

// Button component that can be styled with images
function IconButton({
  src,
  onClick,
  title,
}: {
  src: string;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: BUTTON_DIAMETER,
        height: BUTTON_DIAMETER,
        borderRadius: "50%",
        background: ACCENT_COLOR,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "none",
        cursor: "pointer",
      }}
    >
      <img
        src={src}
        alt=""
        style={{ width: BUTTON_DIAMETER / 2, height: BUTTON_DIAMETER / 2 }}
      />
    </button>
  );
}

export default function Canvas() {
  const navigate = useNavigate();
  const [bg] = useImage("/canvas_bg.jpg");
  const [items, setItems] = useState<CanvasImageProps[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const canvas = useRef<Konva.Stage>(null);

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

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 40,
        padding: 40,
      }}
    >
      {/* Canvas */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1 className="poster-title" style={{ margin: 0, marginBottom: 20 }}>
          WANTED
        </h1>

        <div
          style={{
            position: "relative",
            display: "inline-block",
            border: "2px solid #000",
            padding: 10,
            background: "#fff",
          }}
        >
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
              {bg && (
                <Image
                  image={bg}
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

          {/* Center Button */}
          <div
            style={{
              position: "absolute",
              bottom: -BUTTON_DIAMETER - 12,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <IconButton
              src="/icons/retake_picture.svg"
              title="Retake Picture"
              onClick={() => navigate("/webcam")}
            />
          </div>

          {/* Right Buttons */}
          <div
            style={{
              position: "absolute",
              bottom: -BUTTON_DIAMETER - 12,
              right: 0,
              display: "flex",
              gap: 16,
            }}
          >
            <IconButton
              src="/icons/preview.svg"
              title="Preview Wanted Poster"
              onClick={() => {
                /* TODO: Open Preview Modal */
              }}
            />
            <IconButton
              src="/icons/export.svg"
              title="Send Via Email"
              onClick={() => {
                /* TODO: Open Email Dialog */
              }}
            />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        style={{
          background: ACCENT_COLOR,
          borderRadius: 12,
          padding: 20,
          width: "15vw",
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {sidebarImages.map((src) => (
          <img
            key={src}
            src={src}
            onClick={() => addImage(src)}
            style={{ width: "100%", cursor: "pointer" }}
          />
        ))}
      </div>
    </div>
  );
}
