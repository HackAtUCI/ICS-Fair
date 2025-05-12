interface IconButtonProps {
  src: string;
  onClick?: () => void;
  title?: string;
  size?: number;
  backgroundColor?: string;
}

export default function IconButton({
  src,
  onClick,
  title,
  size = 48,
  backgroundColor = "#BDB199",
}: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: backgroundColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "none",
        cursor: "pointer",
      }}
    >
      <img src={src} alt="" style={{ width: size / 2, height: size / 2 }} />
    </button>
  );
}
