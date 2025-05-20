import "./IconButton.css";

interface IconButtonProps {
  src: string;
  onClick?: () => void;
  title?: string;
}

export default function IconButton({ src, onClick, title }: IconButtonProps) {
  return (
    <button className="icon-button" onClick={onClick} title={title}>
      <img src={src} alt="" />
    </button>
  );
}
