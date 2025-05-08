
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
      {/* Enhanced human-like enemy */}
      <div className="w-full h-full relative">
        {/* Head */}
        <div className="absolute w-[60%] h-[30%] bg-[#FFD2C4] rounded-full left-1/2 -translate-x-1/2 top-1 shadow-sm">
          {/* Hair with style */}
          <div className="absolute w-[100%] h-[60%] bg-[#593A27] rounded-t-full top-[-3px]">
            {/* Evil spiky hair detail */}
            <div className="absolute w-[20%] h-[80%] bg-[#593A27] left-[15%] top-[-30%] transform rotate-[-15deg] rounded-t-full"></div>
            <div className="absolute w-[20%] h-[80%] bg-[#593A27] right-[15%] top-[-30%] transform rotate-[15deg] rounded-t-full"></div>
          </div>
          
          {/* Evil Eyes with glow effect */}
          <div className="absolute top-[40%] left-[20%] w-[15%] h-[15%] bg-red-600 rounded-full shadow-[0_0_5px_rgba(255,0,0,0.5)]"></div>
          <div className="absolute top-[40%] right-[20%] w-[15%] h-[15%] bg-red-600 rounded-full shadow-[0_0_5px_rgba(255,0,0,0.5)]"></div>
          
          {/* Evil eyebrows */}
          <div className="absolute top-[35%] left-[15%] w-[20%] h-[5%] bg-[#593A27] rounded-full transform rotate-[15deg]"></div>
          <div className="absolute top-[35%] right-[15%] w-[20%] h-[5%] bg-[#593A27] rounded-full transform rotate-[-15deg]"></div>
          
          {/* Mean mouth */}
          <div className="absolute bottom-[20%] left-[25%] w-[50%] h-[15%]">
            <div className="w-full h-full bg-[#6E2727]"
                 style={{ clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)' }}></div>
            {/* Teeth */}
            <div className="absolute top-[30%] left-[25%] w-[10%] h-[40%] bg-white"></div>
            <div className="absolute top-[30%] right-[25%] w-[10%] h-[40%] bg-white"></div>
          </div>
        </div>
        
        {/* Body with enhanced details */}
        <div className="absolute w-[70%] h-[35%] left-1/2 -translate-x-1/2 top-[30%] bg-gradient-to-b from-[#DB4242] to-[#B23333] rounded-lg shadow-sm">
          {/* Evil logo */}
          <div className="absolute w-[40%] h-[40%] left-1/2 -translate-x-1/2 top-1/4 rounded-full border-2 border-black flex items-center justify-center">
            <div className="w-[60%] h-[60%] bg-black opacity-80 rounded-full"></div>
          </div>
          
          {/* Body details */}
          <div className="absolute bottom-[20%] left-[10%] w-[80%] h-[1px] bg-[#9E2E2E]"></div>
          <div className="absolute bottom-[40%] left-[10%] w-[80%] h-[1px] bg-[#9E2E2E]"></div>
        </div>
        
        {/* Arms */}
        <div className="absolute w-full top-[35%]">
          <div className="absolute left-0 w-[20%] h-[20%] bg-[#FFD2C4] rounded-l-full shadow-sm">
            {/* Evil claws */}
            {direction === "left" && (
              <div className="absolute left-[20%] top-[40%] w-[25%] h-[20%] bg-[#111] transform rotate-45"></div>
            )}
          </div>
          <div className="absolute right-0 w-[20%] h-[20%] bg-[#FFD2C4] rounded-r-full shadow-sm">
            {/* Evil claws */}
            {direction === "right" && (
              <div className="absolute right-[20%] top-[40%] w-[25%] h-[20%] bg-[#111] transform rotate-[-45deg]"></div>
            )}
          </div>
        </div>
        
        {/* Legs */}
        <div className="absolute w-[80%] left-1/2 -translate-x-1/2 top-[65%] flex">
          <div className="w-1/2 h-[30%] bg-[#1E1E1E] rounded-bl-lg mr-[2px] shadow-sm"></div>
          <div className="w-1/2 h-[30%] bg-[#1E1E1E] rounded-br-lg ml-[2px] shadow-sm"></div>
        </div>
        
        {/* Flying effect */}
        {type === "flying" && (
          <div className="absolute w-[90%] h-[10%] bg-[#FF4242] opacity-30 left-1/2 -translate-x-1/2 bottom-[-10px] rounded-full blur-md animate-pulse"></div>
        )}
        
        {/* Apply targeting effect */}
        <div className="absolute inset-0 border-2 border-transparent hover:border-red-500 rounded-md transition-colors duration-300"></div>
      </div>
    </div>
  );
};

export default Enemy;
