
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
        transition: type === "moving" ? "transform 0.05s ease-out" : undefined,
      }}
    >
      {/* Platform shine effect */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white to-transparent opacity-10"></div>
      
      {/* Visual indicators for moving platforms */}
      {type === "moving" && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-0 w-full h-1/4 flex items-center">
            <div className="w-full flex justify-around opacity-30">
              <div className="h-1 w-1/6 bg-blue-200 rounded-full"></div>
              <div className="h-1 w-1/6 bg-blue-200 rounded-full"></div>
              <div className="h-1 w-1/6 bg-blue-200 rounded-full"></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Visual indicators for crumbling platforms */}
      {type === "crumbling" && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-1/2 border border-red-300 border-dashed opacity-20 rounded"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Platform;
