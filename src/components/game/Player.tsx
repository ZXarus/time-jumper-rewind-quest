
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
  const lastMoveRef = useRef<string>('idle');
  const movingRef = useRef<boolean>(false);
  
  // Track player movement state for animations
  useEffect(() => {
    const currentDirection = player.velocity.x !== 0 ? 
      (player.velocity.x > 0 ? 'right' : 'left') : 'idle';
    
    if (currentDirection !== lastMoveRef.current) {
      lastMoveRef.current = currentDirection;
    }
    
    movingRef.current = player.velocity.x !== 0;
  }, [player.velocity.x]);

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
          transition: "transform 0.1s ease"
        }}
      >
        {/* Enhanced realistic human character */}
        <div className="absolute w-full h-full flex flex-col items-center">
          {/* Detailed Head */}
          <div className="w-[60%] h-[30%] bg-[#FFE0C9] rounded-full relative mt-[1px] shadow-md overflow-hidden">
            {/* Hair with better styling and shading */}
            <div className="absolute w-[100%] h-[60%] bg-gradient-to-b from-[#4A2F1D] to-[#724128] rounded-t-full top-[-4px] overflow-hidden">
              {/* Hair texture with highlights */}
              <div className="absolute w-[20%] h-[50%] right-[20%] top-[10%] bg-[#8B5A3A] opacity-60 rounded-full"></div>
              <div className="absolute w-[10%] h-[40%] left-[25%] top-[20%] bg-[#8B5A3A] opacity-60 rounded-full"></div>
              <div className="absolute w-[15%] h-[30%] left-[55%] top-[5%] bg-[#9B6A4A] opacity-40 rounded-full"></div>
              
              {/* Side hair bangs */}
              <div className="absolute w-[15%] h-[90%] left-0 bg-[#4A2F1D] rounded-l-full"></div>
              <div className="absolute w-[15%] h-[90%] right-0 bg-[#4A2F1D] rounded-r-full"></div>
            </div>
            
            {/* Detailed Face features */}
            <div className="absolute w-full h-full flex justify-center items-center">
              {/* Eyebrows */}
              <div className="absolute top-[35%] left-[20%] w-[18%] h-[4%] bg-[#3D2314] rounded-full transform -rotate-6"></div>
              <div className="absolute top-[35%] right-[20%] w-[18%] h-[4%] bg-[#3D2314] rounded-full transform rotate-6"></div>
              
              {/* Eyes with animations */}
              <div className="absolute top-[42%] left-[26%] w-[12%] h-[12%] bg-white rounded-full flex justify-center items-center">
                <div className="w-[70%] h-[70%] bg-[#49678D] rounded-full flex justify-center items-center">
                  <div className="w-[50%] h-[50%] bg-black rounded-full"></div>
                  {/* Eye highlight */}
                  <div className="absolute top-[15%] left-[15%] w-[25%] h-[25%] bg-white rounded-full"></div>
                </div>
                {/* Animated blink effect */}
                <div className="absolute w-full h-full bg-[#FFE0C9] animate-blink opacity-0"></div>
              </div>
              <div className="absolute top-[42%] right-[26%] w-[12%] h-[12%] bg-white rounded-full flex justify-center items-center">
                <div className="w-[70%] h-[70%] bg-[#49678D] rounded-full flex justify-center items-center">
                  <div className="w-[50%] h-[50%] bg-black rounded-full"></div>
                  {/* Eye highlight */}
                  <div className="absolute top-[15%] left-[15%] w-[25%] h-[25%] bg-white rounded-full"></div>
                </div>
                {/* Animated blink effect */}
                <div className="absolute w-full h-full bg-[#FFE0C9] animate-blink opacity-0"></div>
              </div>
              
              {/* Nose with better shading */}
              <div className="absolute top-[55%] left-[48%] w-[4%] h-[10%] bg-[#E8CBAE] rounded-full"></div>
              <div className="absolute top-[58%] left-[47%] w-[6%] h-[3%] bg-[#E8CBAE] rounded-full opacity-60"></div>
              
              {/* Mouth - changes based on state with realistic shape */}
              <div className={`absolute bottom-[20%] left-[35%] w-[30%] h-[7%] rounded-full overflow-hidden 
                ${isDead ? "bg-[#D35F5F]" : isRewinding ? "bg-[#A64DFF]" : "bg-[#D35F5F]"}`}>
                {!isDead && (
                  <>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] h-[40%] bg-[#FFE0C9]"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[40%] h-[40%] bg-[#C14545]"></div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Enhanced Torso with realistic details */}
          <div className="w-[70%] h-[38%] bg-gradient-to-b from-[#4782D3] to-[#3E75C0] rounded-lg mt-[-2px] relative shadow-md">
            {/* Neck */}
            <div className="absolute top-[-5px] left-[38%] w-[24%] h-[10%] bg-[#FFE0C9] rounded-t-sm"></div>
            
            {/* Detailed Collar */}
            <div className="absolute top-0 left-[30%] w-[40%] h-[15%] bg-[#E8E8E8] rounded-t-sm"></div>
            
            {/* Shirt folds and details */}
            <div className="absolute bottom-[20%] left-[10%] w-[80%] h-[1px] bg-[#3468B0]"></div>
            <div className="absolute bottom-[40%] left-[10%] w-[80%] h-[1px] bg-[#3468B0]"></div>
            <div className="absolute bottom-[60%] left-[10%] w-[80%] h-[1px] bg-[#3468B0]"></div>
            
            {/* Time device on chest with glow effect */}
            <div className="absolute top-[30%] left-[40%] w-[20%] h-[25%] bg-[#21324F] rounded-full shadow-md">
              <div className="absolute top-[25%] left-[25%] w-[50%] h-[50%] bg-[#61A3F6] rounded-full animate-pulse shadow-[0_0_8px_#61A3F6]"></div>
            </div>
            
            {/* Shoulder details */}
            <div className="absolute top-[10%] left-[-8%] w-[15%] h-[20%] bg-[#4077C5] rounded-full"></div>
            <div className="absolute top-[10%] right-[-8%] w-[15%] h-[20%] bg-[#4077C5] rounded-full"></div>
          </div>
          
          {/* Enhanced Arms with better proportions and details - now with animation */}
          <div className={`flex w-[100%] justify-between mt-[-26px] relative z-10 ${movingRef.current ? 'animate-armSwing' : ''}`}>
            {/* Left arm with animation */}
            <div className="w-[18%] h-[30px] relative">
              {/* Upper arm */}
              <div className="absolute left-0 top-0 w-full h-[15px] bg-[#4077C5] rounded-full shadow-inner transform origin-top"></div>
              {/* Lower arm and hand */}
              <div className={`absolute left-0 bottom-0 w-full h-[20px] flex ${player.isJumping ? 'rotate-12' : ''}`}>
                <div className="w-3/4 h-full bg-gradient-to-b from-[#FFE0C9] to-[#FFCFB0] rounded-bl-full shadow-md"></div>
                {/* Hand with fingers */}
                <div className="w-1/4 h-full bg-[#FFCFB0] rounded-br-full relative">
                  <div className="absolute bottom-0 right-[2px] w-[3px] h-[6px] bg-[#FFCFB0] rounded-full"></div>
                  <div className="absolute bottom-[3px] right-[1px] w-[2px] h-[5px] bg-[#FFCFB0] rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Right arm with animation */}
            <div className="w-[18%] h-[30px] relative">
              {/* Upper arm */}
              <div className="absolute right-0 top-0 w-full h-[15px] bg-[#4077C5] rounded-full shadow-inner transform origin-top"></div>
              {/* Lower arm and hand */}
              <div className={`absolute right-0 bottom-0 w-full h-[20px] flex flex-row-reverse ${player.isJumping ? '-rotate-12' : ''}`}>
                <div className="w-3/4 h-full bg-gradient-to-b from-[#FFE0C9] to-[#FFCFB0] rounded-br-full shadow-md"></div>
                {/* Hand with fingers */}
                <div className="w-1/4 h-full bg-[#FFCFB0] rounded-bl-full relative">
                  <div className="absolute bottom-0 left-[2px] w-[3px] h-[6px] bg-[#FFCFB0] rounded-full"></div>
                  <div className="absolute bottom-[3px] left-[1px] w-[2px] h-[5px] bg-[#FFCFB0] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Legs - pants with realistic details and movement animation */}
          <div className={`flex w-full mt-[-5px] ${movingRef.current ? 'animate-legWalk' : ''}`}>
            <div className="w-1/2 h-[35%] bg-gradient-to-b from-[#2D3447] to-[#232A3D] rounded-b-lg mr-[1px] relative shadow-md">
              <div className="absolute bottom-[30%] left-[20%] w-[60%] h-[1px] bg-[#1E2333]"></div>
              <div className="absolute bottom-[60%] left-[20%] w-[60%] h-[1px] bg-[#1E2333]"></div>
            </div>
            <div className="w-1/2 h-[35%] bg-gradient-to-b from-[#2D3447] to-[#232A3D] rounded-b-lg ml-[1px] relative shadow-md">
              <div className="absolute bottom-[30%] left-[20%] w-[60%] h-[1px] bg-[#1E2333]"></div>
              <div className="absolute bottom-[60%] left-[20%] w-[60%] h-[1px] bg-[#1E2333]"></div>
            </div>
          </div>
          
          {/* Enhanced Shoes with better design */}
          <div className="flex w-[90%] mt-[-2px]">
            <div className="w-1/2 h-[12px] bg-gradient-to-b from-[#21242C] to-[#17191F] rounded-b-lg mr-[2px] shadow-md">
              <div className="h-[3px] w-3/4 bg-[#111] rounded-b-lg mt-[2px] mx-auto"></div>
            </div>
            <div className="w-1/2 h-[12px] bg-gradient-to-b from-[#21242C] to-[#17191F] rounded-b-lg ml-[2px] shadow-md">
              <div className="h-[3px] w-3/4 bg-[#111] rounded-b-lg mt-[2px] mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Animation effect for movement */}
        <div className={`absolute bottom-[-5px] left-0 w-full h-[3px] ${
          !player.isGrounded && !player.isDead ? "bg-game-accent shadow-[0_0_5px_#8B5CF6]" : "bg-transparent"
        }`}></div>
        
        {/* Time rewind effect */}
        {isRewinding && (
          <div className="absolute inset-0 rounded-md border-2 border-game-accent animate-pulse opacity-70 shadow-[0_0_10px_rgba(139,92,246,0.6)]"></div>
        )}
      </div>
    </>
  );
};

export default Player;
