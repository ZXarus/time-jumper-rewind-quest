
import { EnergyBooster as EnergyBoosterType } from "@/types/game";
import { useState, useEffect, useRef } from "react";

interface EnergyBoosterProps {
  energyBooster: EnergyBoosterType;
}

const EnergyBooster: React.FC<EnergyBoosterProps> = ({ energyBooster }) => {
  const { x, y, collected } = energyBooster;
  const boosterRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(0);
  
  // Add hover animation
  useEffect(() => {
    const interval = setInterval(() => {
      setHover(prev => (prev + 1) % 100);
    }, 16);
    
    return () => clearInterval(interval);
  }, []);
  
  // Add collection animation
  useEffect(() => {
    if (collected && boosterRef.current) {
      // Add collection animation
      boosterRef.current.classList.add("animate-collect");
      
      // Remove from DOM after animation completes
      setTimeout(() => {
        if (boosterRef.current) {
          boosterRef.current.style.display = "none";
        }
      }, 300);
    }
  }, [collected]);

  if (collected) {
    return null;
  }

  const hoverOffset = Math.sin(hover * 0.1) * 3;
  
  return (
    <div
      ref={boosterRef}
      className="absolute"
      style={{
        left: x,
        top: y + hoverOffset,
        width: 25,
        height: 25,
        transition: "top 0.5s ease"
      }}
    >
      {/* Energy booster with pulsing effect */}
      <div className="w-full h-full relative">
        {/* Outer glow */}
        <div className="absolute inset-0 rounded-full bg-[#FFF6A9] animate-pulse opacity-25 scale-150"></div>
        
        {/* Middle glow */}
        <div className="absolute inset-[15%] rounded-full bg-[#FFD700] animate-pulse opacity-60 scale-125"></div>
        
        {/* Inner core */}
        <div className="absolute inset-[25%] rounded-full bg-gradient-to-b from-[#FFD700] to-[#FFA500] shadow-inner"></div>
        
        {/* Shine effect */}
        <div className="absolute top-[15%] left-[15%] w-[25%] h-[25%] bg-white rounded-full opacity-70"></div>
        
        {/* Energy symbols */}
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold transform rotate-45">
          <div className="absolute w-[60%] h-[2px] bg-white opacity-80"></div>
          <div className="absolute w-[2px] h-[60%] bg-white opacity-80"></div>
        </div>
      </div>
    </div>
  );
};

export default EnergyBooster;
