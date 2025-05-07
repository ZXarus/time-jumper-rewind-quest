
import React from "react";
import { TimePosition } from "@/types/game";
import { COLORS } from "@/constants/gameConstants";

interface TimeTrajectoryProps {
  timePositions: TimePosition[];
  isRewinding: boolean;
  playerWidth: number;
  playerHeight: number;
}

const TimeTrajectory: React.FC<TimeTrajectoryProps> = ({ 
  timePositions, 
  isRewinding, 
  playerWidth, 
  playerHeight 
}) => {
  // Only show trajectory when rewinding and when there are positions to display
  if (!isRewinding || timePositions.length === 0) {
    return null;
  }

  // Calculate size of trajectory points based on player size
  const pointSize = Math.min(playerWidth, playerHeight) * 0.3;
  
  // Only display every 4th position for better visual clarity
  const filteredPositions = timePositions.filter((_, i) => i % 4 === 0);
  
  return (
    <>
      {filteredPositions.map((pos, index) => {
        // Calculate opacity and size based on position in the array
        const opacity = 0.2 + (index / filteredPositions.length) * 0.8;
        const scale = 0.6 + (index / filteredPositions.length) * 0.6;
        
        return (
          <div
            key={`trajectory-${index}`}
            className="absolute rounded-full bg-game-accent"
            style={{
              left: pos.x + playerWidth / 2 - (pointSize * scale) / 2,
              top: pos.y + playerHeight / 2 - (pointSize * scale) / 2,
              width: pointSize * scale,
              height: pointSize * scale,
              opacity: opacity,
              zIndex: 5,
              filter: "drop-shadow(0 0 8px rgba(217, 70, 239, 0.9))",
              animation: `pulse-energy ${0.5 + index * 0.1}s infinite alternate`,
            }}
          />
        );
      })}
      
      {/* Connect dots with lines for better visualization */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-4" style={{opacity: 0.5}}>
        <defs>
          <linearGradient id="timeTrailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D946EF" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#D946EF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#D946EF" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <path 
          d={filteredPositions.map((pos, index) => {
            const x = pos.x + playerWidth/2;
            const y = pos.y + playerHeight/2;
            return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
          }).join(' ')}
          stroke="url(#timeTrailGradient)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="5,3"
        />
      </svg>
    </>
  );
};

export default TimeTrajectory;
