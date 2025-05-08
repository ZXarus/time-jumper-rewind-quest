
import React, { useEffect, useRef } from "react";
import { PlayerState } from "@/types/game";
import { COLORS } from "@/constants/gameConstants";
import TimeTrajectory from "./TimeTrajectory";

interface PlayerProps {
  player: PlayerState;
  isRewinding: boolean;
}

const Player: React.FC<PlayerProps> = ({ player, isRewinding }) => {
  const { position, width, height, facingDirection, isDead, timePositions } = player;
  const playerRef = useRef<HTMLDivElement>(null);

  // Add time trail effect when rewinding
  useEffect(() => {
    if (!isRewinding || !playerRef.current) return;
    
    const createTrail = () => {
      const trail = document.createElement('div');
      trail.className = 'time-trail';
      trail.style.left = `${position.x}px`;
      trail.style.top = `${position.y}px`;
      trail.style.width = `${width * 0.8}px`;
      trail.style.height = `${height * 0.8}px`;
      
      if (playerRef.current?.parentElement) {
        playerRef.current.parentElement.appendChild(trail);
        
        // Remove after animation completes to avoid memory leaks
        setTimeout(() => {
          if (trail.parentElement) {
            trail.parentElement.removeChild(trail);
          }
        }, 800);
      }
    };
    
    const trailInterval = setInterval(createTrail, 100);
    return () => clearInterval(trailInterval);
  }, [isRewinding, position.x, position.y, width, height]);

  return (
    <>
      {/* Render the trajectory visualization */}
      <TimeTrajectory 
        timePositions={timePositions}
        isRewinding={isRewinding}
        playerWidth={width}
        playerHeight={height}
      />
      
      <div 
        ref={playerRef}
        className={`absolute transition-colors duration-75 rounded-md ${
          isRewinding ? "animate-pulse shadow-lg shadow-game-accent" : "bg-transparent"
        } ${isDead ? "opacity-50" : ""}`}
        style={{
          left: position.x,
          top: position.y,
          width: width,
          height: height,
          transform: facingDirection === "left" ? "scaleX(-1)" : "none",
        }}
      >
        {/* Enhanced human character */}
        <div className="absolute w-full h-full flex flex-col items-center">
          {/* Head */}
          <div className="w-[55%] h-[30%] bg-[#FFDBC4] rounded-full relative mt-1 shadow-sm">
            {/* Hair with better styling */}
            <div className="absolute w-[100%] h-[55%] bg-[#673923] rounded-t-full top-[-3px]">
              {/* Hair texture */}
              <div className="absolute w-[80%] h-[40%] left-[10%] top-[20%] rounded-t-full border-t border-[#7F4934] opacity-60"></div>
            </div>
            
            {/* Face features */}
            <div className="absolute w-full h-full flex justify-center items-center">
              {/* Eyes */}
              <div className="absolute top-[40%] left-[25%] w-[10%] h-[10%] bg-[#2C2C2C] rounded-full">
                {/* Eye highlight */}
                <div className="absolute top-0 left-0 w-[30%] h-[30%] bg-white rounded-full"></div>
              </div>
              <div className="absolute top-[40%] right-[25%] w-[10%] h-[10%] bg-[#2C2C2C] rounded-full">
                {/* Eye highlight */}
                <div className="absolute top-0 left-0 w-[30%] h-[30%] bg-white rounded-full"></div>
              </div>
              
              {/* Eyebrows */}
              <div className="absolute top-[35%] left-[22%] w-[15%] h-[3%] bg-[#673923] rounded-full"></div>
              <div className="absolute top-[35%] right-[22%] w-[15%] h-[3%] bg-[#673923] rounded-full"></div>
              
              {/* Mouth - changes based on state */}
              <div className={`absolute bottom-[25%] left-[30%] w-[40%] h-[8%] ${isDead ? "bg-red-500" : 
                isRewinding ? "bg-purple-500" : "bg-[#C96464]"} rounded-full`}>
                {!isDead && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60%] h-[30%] bg-[#FFDBC4]"></div>
                )}
              </div>
            </div>
          </div>
          
          {/* Torso - improved clothing with details */}
          <div className="w-[70%] h-[35%] bg-[#4782D3] rounded-lg mt-[-2px] relative shadow-sm">
            {/* Collar */}
            <div className="absolute top-0 left-[35%] w-[30%] h-[15%] bg-[#E8E8E8] rounded"></div>
            
            {/* Shirt details */}
            <div className="absolute bottom-[20%] left-[10%] w-[80%] h-[1px] bg-[#3E75C0]"></div>
            <div className="absolute bottom-[40%] left-[10%] w-[80%] h-[1px] bg-[#3E75C0]"></div>
            
            {/* Time device on chest */}
            <div className="absolute top-[30%] left-[40%] w-[20%] h-[20%] bg-[#21324F] rounded-full">
              <div className="absolute top-[25%] left-[25%] w-[50%] h-[50%] bg-[#61A3F6] rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Arms with better proportions */}
          <div className="flex w-[100%] justify-between mt-[-20px] relative z-10">
            <div className="w-[15%] h-[25px] bg-[#FFDBC4] rounded-bl-full shadow-sm"></div>
            <div className="w-[15%] h-[25px] bg-[#FFDBC4] rounded-br-full shadow-sm"></div>
          </div>
          
          {/* Legs - pants with details */}
          <div className="flex w-full mt-[-5px]">
            <div className="w-1/2 h-[35%] bg-[#2D3447] rounded-b-lg mr-[1px] relative">
              <div className="absolute bottom-[30%] left-[20%] w-[60%] h-[1px] bg-[#242A38]"></div>
            </div>
            <div className="w-1/2 h-[35%] bg-[#2D3447] rounded-b-lg ml-[1px] relative">
              <div className="absolute bottom-[30%] left-[20%] w-[60%] h-[1px] bg-[#242A38]"></div>
            </div>
          </div>
          
          {/* Shoes with better design */}
          <div className="flex w-[90%] mt-[-2px]">
            <div className="w-1/2 h-[10px] bg-[#21242C] rounded-b-lg mr-[2px] shadow-md"></div>
            <div className="w-1/2 h-[10px] bg-[#21242C] rounded-b-lg ml-[2px] shadow-md"></div>
          </div>
        </div>

        {/* Animation effect for movement */}
        <div className={`absolute bottom-[-5px] left-0 w-full h-[3px] ${
          !player.isGrounded && !player.isDead ? "bg-game-accent" : "bg-transparent"
        }`}></div>
        
        {/* Time rewind effect */}
        {isRewinding && (
          <div className="absolute inset-0 rounded-md border-2 border-game-accent animate-pulse opacity-70"></div>
        )}
      </div>
    </>
  );
};

export default Player;
