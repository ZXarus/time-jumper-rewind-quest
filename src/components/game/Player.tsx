
import React from "react";
import { PlayerState } from "@/types/game";
import TimeTrajectory from "./TimeTrajectory";
import PlayerBody from "./PlayerBody";
import PlayerEffects from "./PlayerEffects";

interface PlayerProps {
  player: PlayerState;
  isRewinding: boolean;
}

const Player: React.FC<PlayerProps> = ({ player, isRewinding }) => {
  const { position, width, height, facingDirection, isDead, timePositions } = player;
  
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
        {/* Player body component */}
        <PlayerBody 
          facingDirection={facingDirection}
          isDead={isDead}
          isRewinding={isRewinding}
          isJumping={player.isJumping}
          isMoving={player.velocity.x !== 0}
        />

        {/* Player effects component */}
        <PlayerEffects 
          isGrounded={player.isGrounded} 
          isDead={isDead}
          isRewinding={isRewinding}
        />
      </div>
    </>
  );
};

export default Player;
