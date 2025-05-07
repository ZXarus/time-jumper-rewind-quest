
import React from "react";
import { TimePosition } from "@/types/game";

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
        // Calculate opacity based on position in the array (more recent = more opaque)
        const opacity = 0.2 + (index / timePositions.length) * 0.8;
        
        return (
          <div
            key={`trajectory-${index}`}
            className="absolute rounded-full bg-game-accent"
            style={{
              left: pos.x + playerWidth / 2 - pointSize / 2,
              top: pos.y + playerHeight / 2 - pointSize / 2,
              width: pointSize,
              height: pointSize,
              opacity: opacity,
              zIndex: 5,
            }}
          />
        );
      })}
    </>
  );
};

export default TimeTrajectory;
