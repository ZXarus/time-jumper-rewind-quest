
import { Platform as PlatformType } from "@/types/game";

interface PlatformProps {
  platform: PlatformType;
}

const Platform: React.FC<PlatformProps> = ({ platform }) => {
  const { x, y, width, height, type } = platform;
  
  // Determine platform styling based on type
  let platformClasses = "absolute rounded-md shadow-md";
  
  if (type === "normal") {
    platformClasses += " bg-game-platform border-t-2 border-gray-300";
  } else if (type === "moving") {
    platformClasses += " bg-game-secondary border-t-2 border-blue-400";
  } else if (type === "crumbling") {
    platformClasses += " bg-game-tertiary border-t-2 border-red-400";
  }
  
  return (
    <div
      className={platformClasses}
      style={{
        left: x,
        top: y,
        width,
        height,
        transition: type === "moving" ? "transform 0.05s linear" : undefined,
      }}
    >
      {/* Platform shine effect */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white to-transparent opacity-10"></div>
    </div>
  );
};

export default Platform;
