import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image, Text } from "react-konva";
import type Konva from "konva";
import IconButton from "../IconButton/IconButton";
import useImage from "use-image";
import "./PreviewModal.css";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvasDataUrl: string | null;
  bags: number;
}

export default function PreviewModal({
  isOpen,
  onClose,
  canvasDataUrl,
  bags,
}: PreviewModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [posterImage] = useImage("/export_poster.png");
  const [previewImage] = useImage(canvasDataUrl || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stageRef.current || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Get the full stage data URL
      const fullImageDataUrl = stageRef.current.toDataURL();

      // Prompt for filename
      const filename = prompt(
        "Enter filename (without extension):",
        "wanted-poster"
      );
      if (!filename) {
        setIsSubmitting(false);
        return;
      }

      // Create a link element
      const link = document.createElement("a");
      link.href = fullImageDataUrl;
      link.download = `${filename}.png`;

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Close modal on success
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save image");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="preview-modal-overlay">
      <div className="preview-modal" ref={modalRef}>
        <div className="preview-modal-header">
          <button onClick={onClose} className="close-button">
            &times;
          </button>
        </div>
        <div className="preview-modal-content">
          <Stage
            width={window.innerWidth}
            height={window.innerHeight}
            listening={false}
            ref={stageRef}
          >
            <Layer>
              {previewImage && (
                <Image
                  image={previewImage}
                  width={window.innerHeight * 0.6}
                  height={
                    (window.innerHeight * 0.6 * previewImage.height) /
                    previewImage.width
                  }
                  x={(window.innerWidth - window.innerHeight * 0.6) / 2}
                  y={
                    (window.innerHeight -
                      (window.innerHeight * 0.6 * previewImage.height) /
                        previewImage.width) /
                      2 +
                    37
                  }
                />
              )}
            </Layer>
            <Layer>
              {posterImage && (
                <Image
                  image={posterImage}
                  width={window.innerHeight * 0.64}
                  height={
                    (window.innerHeight * 0.64 * posterImage.height) /
                    posterImage.width
                  }
                  x={(window.innerWidth - window.innerHeight * 0.64) / 2}
                  y={
                    (window.innerHeight -
                      (window.innerHeight * 0.64 * posterImage.height) /
                        posterImage.width) /
                    2
                  }
                />
              )}
            </Layer>
            <Layer>
              <Text
                text={`${bags} Bags`}
                x={window.innerWidth / 2 - 100}
                y={window.innerHeight - 140}
                fontSize={38}
                fontFamily="Tiro Devanagari Hindi"
                fill="#48351c"
                align="center"
                width={200}
              />
              <Text
                text={`$${(bags * 100000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                x={window.innerWidth / 2 - 100}
                y={window.innerHeight - 100}
                fontSize={38}
                fontFamily="Tiro Devanagari Hindi"
                fill="#48351c"
                align="center"
                width={200}
              />
            </Layer>
          </Stage>
          <div className="email-form">
            <IconButton
              src="/icons/export.svg"
              title={isSubmitting ? "Saving..." : "Save Image"}
              onClick={() =>
                handleSubmit({ preventDefault: () => {} } as React.FormEvent)
              }
            />
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
