
import { Enemy as EnemyType } from "@/types/game";

interface EnemyProps {
  enemy: EnemyType;
}

const Enemy: React.FC<EnemyProps> = ({ enemy }) => {
  const { x, y, width, height, direction, type } = enemy;
  
  let enemyClass = "absolute bg-game-danger rounded-md";
  
  if (type === "flying") {
    enemyClass += " animate-float";
  }
  
  return (
    <div
      className={enemyClass}
      style={{
        left: x,
        top: y,
        width: width,
        height: height,
        transform: direction === "left" ? "scaleX(-1)" : "none",
      }}
    >
      {/* Simple enemy face */}
      <div className="absolute top-1/4 left-[20%] w-[15%] h-[15%] bg-black rounded-full"></div>
      <div className="absolute top-1/4 right-[20%] w-[15%] h-[15%] bg-black rounded-full"></div>
      <div className="absolute top-2/3 left-1/4 w-1/2 h-[10%] bg-black" 
        style={{ borderRadius: '0 0 9999px 9999px' }}></div>
    </div>
  );
};

export default Enemy;
