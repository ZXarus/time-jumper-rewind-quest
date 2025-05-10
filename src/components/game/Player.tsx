
import React, { useEffect, useRef } from "react";
import { PlayerState } from "@/types/game";
import TimeTrajectory from "./TimeTrajectory";
import PlayerBody from "./PlayerBody";

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
    
    movingRef.current = Math.abs(player.velocity.x) > 0.1;
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
        {/* Use the refactored player body component */}
        <PlayerBody 
          facingDirection={facingDirection}
          isDead={isDead}
          isRewinding={isRewinding}
          isJumping={player.isJumping}
          isMoving={movingRef.current}
        />

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
