import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image } from "react-konva";
import type Konva from "konva";
import IconButton from "../IconButton/IconButton";
import useImage from "use-image";
import "./PreviewModal.css";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvasDataUrl: string | null;
}

export default function PreviewModal({
  isOpen,
  onClose,
  canvasDataUrl,
}: PreviewModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [posterImage] = useImage("/export_poster.png");
  const [previewImage] = useImage(canvasDataUrl || "");
  const [email, setEmail] = useState("");
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
    if (!stageRef.current || !email || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Get the full stage data URL
      const fullImageDataUrl = stageRef.current.toDataURL();

      const response = await fetch(
        "https://jivq5hqvog.execute-api.us-west-2.amazonaws.com/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            image: fullImageDataUrl,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      // Clear form and close modal on success
      setEmail("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send email");
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
                  width={window.innerWidth * 0.39}
                  height={
                    (window.innerWidth * 0.39 * previewImage.height) /
                    previewImage.width
                  }
                  x={(window.innerWidth - window.innerWidth * 0.44) / 2 + 40}
                  y={
                    (window.innerHeight -
                      (window.innerWidth * 0.44 * previewImage.height) /
                        previewImage.width) /
                      2 +
                    67
                  }
                />
              )}
            </Layer>
            <Layer>
              {posterImage && (
                <Image
                  image={posterImage}
                  width={window.innerWidth * 0.44}
                  height={
                    (window.innerWidth * 0.44 * posterImage.height) /
                    posterImage.width
                  }
                  x={(window.innerWidth - window.innerWidth * 0.44) / 2}
                  y={
                    (window.innerHeight -
                      (window.innerWidth * 0.44 * posterImage.height) /
                        posterImage.width) /
                    2
                  }
                />
              )}
            </Layer>
          </Stage>
          <form onSubmit={handleSubmit} className="email-form">
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="email-input"
              disabled={isSubmitting}
            />
            <IconButton
              src="/icons/export.svg"
              title={isSubmitting ? "Sending..." : "Send Via Email"}
              onClick={() =>
                handleSubmit({ preventDefault: () => {} } as React.FormEvent)
              }
            />
            {error && <div className="error-message">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
