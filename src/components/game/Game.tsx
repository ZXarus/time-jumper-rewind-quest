
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useGame from "@/hooks/useGame";
import GameCanvas from "@/components/game/GameCanvas";
import GameControls from "@/components/game/GameControls";
import { playMusic, playSoundEffect } from "@/utils/soundEffects";
import { Sparkles } from "lucide-react";

const Game = () => {
  const { 
    gameState, 
    player, 
    platforms, 
    enemies, 
    hazards,
    energyOrbs,
    energyBoosters, // Make sure to get energyBoosters from useGame hook
    currentLevel,
    showParticles,
    resetLevel, 
    nextLevel 
  } = useGame();
  
  // Play background music based on level
  useEffect(() => {
    playMusic(`level${gameState.level}` as any);
    
    return () => {
      // Stop music when component unmounts
      // This is handled automatically by the sound utility
    };
  }, [gameState.level]);
  
  // Play sound effects based on player actions
  useEffect(() => {
    // Play jump sound when player jumps
    if (player.velocity.y < -1 && player.isGrounded === false) {
      playSoundEffect('jump');
    }
    
    // Play rewind sounds
    if (player.isRewinding) {
      playSoundEffect('rewind');
    }
    
    // Play death sound
    if (player.isDead) {
      playSoundEffect('death');
    }
    
  }, [player.velocity.y, player.isGrounded, player.isRewinding, player.isDead]);
  
  // Play success sound on victory
  useEffect(() => {
    if (gameState.victory) {
      playSoundEffect('levelComplete');
    }
  }, [gameState.victory]);
  
  useEffect(() => {
    toast("Welcome to Time Jumper! Use WASD or arrow keys to move, R to rewind time.");
  }, []);
  
  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-game-primary flex items-center gap-2">
        <Sparkles className="text-game-accent" size={24} />
        Time Jumper
        <Sparkles className="text-game-accent" size={24} />
      </h1>
      
      <div className="relative mb-4">
        <GameCanvas
          gameState={gameState}
          player={player}
          platforms={platforms}
          enemies={enemies}
          hazards={hazards}
          energyOrbs={energyOrbs}
          energyBoosters={energyBoosters} // Pass energyBoosters to GameCanvas
          currentLevel={currentLevel}
          showParticles={showParticles}
          resetLevel={resetLevel}
          nextLevel={nextLevel}
        />
      </div>
      
      <GameControls />
    </div>
  );
};

export default Game;
