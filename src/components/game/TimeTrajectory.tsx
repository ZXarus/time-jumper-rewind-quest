
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
  
  return (
    <>
      {timePositions.map((pos, index) => {
        // Calculate opacity and size based on position in the array
        const opacity = 0.2 + (index / timePositions.length) * 0.8;
        const scale = 0.7 + (index / timePositions.length) * 0.5;
        
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
              filter: "drop-shadow(0 0 2px rgba(217, 70, 239, 0.8))",
              animation: `pulse-energy ${0.5 + index * 0.1}s infinite alternate`,
            }}
          />
        );
      })}
    </>
  );
};

export default TimeTrajectory;
