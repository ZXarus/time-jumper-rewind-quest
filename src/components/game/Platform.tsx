
import { Platform as PlatformType } from "@/types/game";

interface PlatformProps {
  platform: PlatformType;
}

const Platform: React.FC<PlatformProps> = ({ platform }) => {
  const { x, y, width, height, type } = platform;
  
  let platformClass = "platform";
  
  // Add additional classes based on platform type
  if (type === "moving") {
    platformClass += " bg-game-secondary";
  } else if (type === "crumbling") {
    platformClass += " bg-game-tertiary";
  }
  
  return (
    <div
      className={platformClass}
      style={{
        left: x,
        top: y,
        width: width,
        height: height,
        position: "absolute"
      }}
    />
  );
};

export default Platform;
