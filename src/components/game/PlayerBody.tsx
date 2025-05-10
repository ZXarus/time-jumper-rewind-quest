
import React from "react";
import { PlayerState } from "@/types/game";

interface PlayerBodyProps {
  facingDirection: 'left' | 'right';
  isDead: boolean;
  isRewinding: boolean;
  isJumping: boolean;
  isMoving: boolean;
}

const PlayerBody: React.FC<PlayerBodyProps> = ({ 
  facingDirection, 
  isDead, 
  isRewinding,
  isJumping,
  isMoving
}) => {
  return (
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
      
      {/* Enhanced Arms with better proportions and details - improved implementation */}
      <div className={`flex w-[100%] justify-between mt-[-26px] relative z-10`}>
        {/* Left arm with animation */}
        <div className={`w-[18%] h-[30px] relative ${isMoving ? 'animate-arm-swing-left' : ''}`}>
          {/* Upper arm */}
          <div className="absolute left-0 top-0 w-full h-[15px] bg-[#4077C5] rounded-full shadow-inner transform origin-top"></div>
          {/* Lower arm and hand */}
          <div className={`absolute left-0 bottom-0 w-full h-[20px] flex ${isJumping ? 'rotate-12' : ''}`}>
            <div className="w-3/4 h-full bg-gradient-to-b from-[#FFE0C9] to-[#FFCFB0] rounded-bl-full shadow-md"></div>
            {/* Improved hand with fingers */}
            <div className="w-1/3 h-full bg-[#FFCFB0] rounded-br-full relative">
              <div className="absolute bottom-0 right-[2px] w-[3px] h-[6px] bg-[#FFCFB0] rounded-full"></div>
              <div className="absolute bottom-[3px] right-[1px] w-[2px] h-[5px] bg-[#FFCFB0] rounded-full"></div>
              <div className="absolute bottom-[2px] right-[4px] w-[2px] h-[4px] bg-[#FFCFB0] rounded-full"></div>
            </div>
          </div>
        </div>
        
        {/* Right arm with animation */}
        <div className={`w-[18%] h-[30px] relative ${isMoving ? 'animate-arm-swing-right' : ''}`}>
          {/* Upper arm */}
          <div className="absolute right-0 top-0 w-full h-[15px] bg-[#4077C5] rounded-full shadow-inner transform origin-top"></div>
          {/* Lower arm and hand */}
          <div className={`absolute right-0 bottom-0 w-full h-[20px] flex flex-row-reverse ${isJumping ? '-rotate-12' : ''}`}>
            <div className="w-3/4 h-full bg-gradient-to-b from-[#FFE0C9] to-[#FFCFB0] rounded-br-full shadow-md"></div>
            {/* Improved hand with fingers */}
            <div className="w-1/3 h-full bg-[#FFCFB0] rounded-bl-full relative">
              <div className="absolute bottom-0 left-[2px] w-[3px] h-[6px] bg-[#FFCFB0] rounded-full"></div>
              <div className="absolute bottom-[3px] left-[1px] w-[2px] h-[5px] bg-[#FFCFB0] rounded-full"></div>
              <div className="absolute bottom-[2px] left-[4px] w-[2px] h-[4px] bg-[#FFCFB0] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Legs - pants with realistic details and movement animation */}
      <div className={`flex w-full mt-[-5px] ${isMoving ? 'animate-leg-walk' : ''}`}>
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
  );
};

export default PlayerBody;
