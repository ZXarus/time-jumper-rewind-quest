
import { Enemy as EnemyType } from "@/types/game";

interface EnemyProps {
  enemy: EnemyType;
}

const Enemy: React.FC<EnemyProps> = ({ enemy }) => {
  const { x, y, width, height, direction, type } = enemy;
  
  let enemyClass = "absolute rounded-md";
  
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
      {/* Human-like enemy */}
      <div className="w-full h-full relative">
        {/* Head */}
        <div className="absolute w-[60%] h-[30%] bg-[#FFD2C4] rounded-full left-1/2 -translate-x-1/2 top-1">
          {/* Hair */}
          <div className="absolute w-[100%] h-[60%] bg-[#593A27] rounded-t-full top-[-3px]"></div>
          
          {/* Evil Eyes */}
          <div className="absolute top-[40%] left-[20%] w-[15%] h-[15%] bg-red-600 rounded-full"></div>
          <div className="absolute top-[40%] right-[20%] w-[15%] h-[15%] bg-red-600 rounded-full"></div>
          
          {/* Mean mouth */}
          <div className="absolute bottom-[20%] left-[25%] w-[50%] h-[10%] bg-[#6E2727]"
               style={{ clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)' }}></div>
        </div>
        
        {/* Body */}
        <div className="absolute w-[70%] h-[35%] left-1/2 -translate-x-1/2 top-[30%] bg-[#DB4242] rounded-lg">
          {/* Evil logo */}
          <div className="absolute w-[40%] h-[40%] left-1/2 -translate-x-1/2 top-1/4 bg-black opacity-50 rounded-full"></div>
        </div>
        
        {/* Arms */}
        <div className="absolute w-full top-[35%]">
          <div className="absolute left-0 w-[20%] h-[20%] bg-[#FFD2C4] rounded-l-full"></div>
          <div className="absolute right-0 w-[20%] h-[20%] bg-[#FFD2C4] rounded-r-full"></div>
        </div>
        
        {/* Legs */}
        <div className="absolute w-[80%] left-1/2 -translate-x-1/2 top-[65%] flex">
          <div className="w-1/2 h-[30%] bg-[#1E1E1E] rounded-bl-lg mr-[2px]"></div>
          <div className="w-1/2 h-[30%] bg-[#1E1E1E] rounded-br-lg ml-[2px]"></div>
        </div>
        
        {type === "flying" && (
          <div className="absolute w-[90%] h-[10%] bg-[#FFFFFF33] left-1/2 -translate-x-1/2 bottom-[-10px] rounded-full blur-sm animate-pulse"></div>
        )}
      </div>
    </div>
  );
};

export default Enemy;
