
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
          isRewinding ? "bg-game-accent" : "bg-game-primary"
        } ${isDead ? "opacity-50" : ""}`}
        style={{
          left: position.x,
          top: position.y,
          width: width,
          height: height,
          transform: facingDirection === "left" ? "scaleX(-1)" : "none",
        }}
      >
        {/* Improved humanoid character */}
        <div className="absolute w-full h-full flex flex-col items-center">
          {/* Head */}
          <div className="w-[60%] h-[40%] bg-white rounded-full relative mt-1">
            {/* Eyes */}
            <div className="absolute top-[35%] left-[25%] w-[15%] h-[15%] bg-black rounded-full"></div>
            <div className="absolute top-[35%] right-[25%] w-[15%] h-[15%] bg-black rounded-full"></div>
            {/* Mouth */}
            <div className={`absolute bottom-[25%] left-[30%] w-[40%] h-[10%] rounded-full ${isDead ? "bg-red-500" : "bg-black"}`}></div>
          </div>
          
          {/* Body */}
          <div className="w-[80%] h-[30%] bg-game-primary rounded-lg mt-[-2px]">
            {/* Arms */}
            <div className="absolute left-[-3px] top-[40%] w-[15%] h-[30%] bg-game-primary rounded-full"></div>
            <div className="absolute right-[-3px] top-[40%] w-[15%] h-[30%] bg-game-primary rounded-full"></div>
          </div>
          
          {/* Legs */}
          <div className="flex w-full mt-[-2px]">
            <div className="w-1/2 h-[25%] bg-game-primary rounded-b-lg mr-[1px]"></div>
            <div className="w-1/2 h-[25%] bg-game-primary rounded-b-lg ml-[1px]"></div>
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
