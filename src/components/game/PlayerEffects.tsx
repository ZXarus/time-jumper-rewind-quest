
import React from "react";

interface PlayerEffectsProps {
  isGrounded: boolean;
  isDead: boolean;
  isRewinding: boolean;
}

const PlayerEffects: React.FC<PlayerEffectsProps> = ({ 
  isGrounded, 
  isDead,
  isRewinding
}) => {
  return (
    <>
      {/* Animation effect for movement */}
      <div className={`absolute bottom-[-5px] left-0 w-full h-[3px] ${
        !isGrounded && !isDead ? "bg-game-accent shadow-[0_0_5px_#8B5CF6]" : "bg-transparent"
      }`}></div>
      
      {/* Time rewind effect */}
      {isRewinding && (
        <div className="absolute inset-0 rounded-md border-2 border-game-accent animate-pulse opacity-70 shadow-[0_0_10px_rgba(139,92,246,0.6)]"></div>
      )}
    </>
  );
};

export default PlayerEffects;
