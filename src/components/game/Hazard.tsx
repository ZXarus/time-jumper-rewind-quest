
import { Hazard as HazardType } from "@/types/game";

interface HazardProps {
  hazard: HazardType;
}

const Hazard: React.FC<HazardProps> = ({ hazard }) => {
  const { x, y, width, height, type } = hazard;
  
  let hazardClass = "absolute bg-game-danger";
  
  if (type === "spike") {
    hazardClass += " rotate-45";
  } else if (type === "laser") {
    hazardClass += " animate-pulse";
  } else if (type === "fire") {
    hazardClass += " rounded-lg";
  }
  
  return (
    <div
      className={hazardClass}
      style={{
        left: x,
        top: y,
        width: width,
        height: height,
      }}
    />
  );
};

export default Hazard;
