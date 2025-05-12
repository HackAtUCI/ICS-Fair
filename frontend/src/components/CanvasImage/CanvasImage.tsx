import { useEffect, useRef } from "react";
import { Image, Transformer } from "react-konva";
import useImage from "use-image";
import Konva from "konva";

export interface CanvasImageProps {
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
export default function CanvasImage(props: CanvasImageProps) {
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
