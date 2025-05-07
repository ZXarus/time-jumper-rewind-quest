
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
  
  // Only display every 5th position for better visual clarity
  const filteredPositions = timePositions.filter((_, i) => i % 5 === 0);
  
  return (
    <>
      {filteredPositions.map((pos, index) => {
        // Calculate opacity and size based on position in the array
        const opacity = 0.2 + (index / filteredPositions.length) * 0.8;
        const scale = 0.7 + (index / filteredPositions.length) * 0.5;
        
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
              filter: "drop-shadow(0 0 5px rgba(217, 70, 239, 0.9))",
              animation: `pulse-energy ${0.5 + index * 0.1}s infinite alternate`,
            }}
          />
        );
      })}
      
      {/* Connect dots with lines for better visualization */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-4" style={{opacity: 0.4}}>
        {filteredPositions.map((pos, index, arr) => {
          if (index < arr.length - 1) {
            const next = arr[index + 1];
            return (
              <line 
                key={`line-${index}`}
                x1={pos.x + playerWidth/2} 
                y1={pos.y + playerHeight/2}
                x2={next.x + playerWidth/2} 
                y2={next.y + playerHeight/2}
                stroke={COLORS.trajectory}
                strokeWidth="2"
                strokeDasharray="3,3"
              />
            );
          }
          return null;
        })}
      </svg>
    </>
  );
};

export default TimeTrajectory;
