interface MaterialIconProps {
  icon: string;
  filled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-3xl",
  xl: "text-4xl",
};

export default function MaterialIcon({
  icon,
  filled = false,
  className = "",
  size = "md",
}: MaterialIconProps) {
  return (
    <span
      className={`material-symbols-outlined ${sizeClasses[size]} ${className} ${
        filled ? "material-symbols-outlined-filled" : ""
      }`}
    >
      {icon}
    </span>
  );
}
