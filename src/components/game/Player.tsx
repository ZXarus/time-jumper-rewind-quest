
import React, { useEffect, useRef } from "react";
import { PlayerState, Position } from "@/types/game";
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
          isRewinding ? "bg-game-accent" : "bg-transparent"
        } ${isDead ? "opacity-50" : ""}`}
        style={{
          left: position.x,
          top: position.y,
          width: width,
          height: height,
          transform: facingDirection === "left" ? "scaleX(-1)" : "none",
        }}
      >
        {/* More realistic human character */}
        <div className="absolute w-full h-full flex flex-col items-center">
          {/* Head */}
          <div className="w-[55%] h-[30%] bg-[#F5D0A9] rounded-full relative mt-1">
            {/* Hair */}
            <div className="absolute w-[100%] h-[50%] bg-[#4A3933] rounded-t-full top-[-3px]"></div>
            {/* Eyes */}
            <div className="absolute top-[40%] left-[25%] w-[10%] h-[10%] bg-black rounded-full"></div>
            <div className="absolute top-[40%] right-[25%] w-[10%] h-[10%] bg-black rounded-full"></div>
            {/* Mouth */}
            <div className={`absolute bottom-[25%] left-[30%] w-[40%] h-[8%] rounded-full ${isDead ? "bg-red-500" : "bg-[#C96464]"}`}></div>
          </div>
          
          {/* Torso - shirt with color */}
          <div className="w-[70%] h-[35%] bg-[#61A3F6] rounded-lg mt-[-2px] relative">
            {/* Collar */}
            <div className="absolute top-0 left-[35%] w-[30%] h-[10%] bg-[#E1E1E1] rounded"></div>
          </div>
          
          {/* Arms */}
          <div className="flex w-[100%] justify-between mt-[-20px] relative z-10">
            <div className="w-[15%] h-[25px] bg-[#F5D0A9] rounded-bl-full"></div>
            <div className="w-[15%] h-[25px] bg-[#F5D0A9] rounded-br-full"></div>
          </div>
          
          {/* Legs - pants */}
          <div className="flex w-full mt-[-5px]">
            <div className="w-1/2 h-[35%] bg-[#3A4154] rounded-b-lg mr-[1px]"></div>
            <div className="w-1/2 h-[35%] bg-[#3A4154] rounded-b-lg ml-[1px]"></div>
          </div>
          
          {/* Shoes */}
          <div className="flex w-[90%] mt-[-2px]">
            <div className="w-1/2 h-[10px] bg-[#2C2C2C] rounded-b-lg mr-[2px]"></div>
            <div className="w-1/2 h-[10px] bg-[#2C2C2C] rounded-b-lg ml-[2px]"></div>
          </div>
        </div>

        {/* Animation effect for movement */}
        <div className={`absolute bottom-[-5px] left-0 w-full h-[3px] ${
          !player.isGrounded && !player.isDead ? "bg-game-accent" : "bg-transparent"
        }`}></div>
      </div>
    </>
  );
};

export default Player;
