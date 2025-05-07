
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
    currentLevel,
    resetLevel, 
    nextLevel 
  } = useGame();

  const [showParticles, setShowParticles] = useState({
    jump: false,
    collect: false,
    rewind: false,
    death: false
  });
  
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
      setShowParticles(prev => ({ ...prev, jump: true }));
      setTimeout(() => setShowParticles(prev => ({ ...prev, jump: false })), 200);
    }
    
    // Play rewind sounds
    if (player.isRewinding) {
      playSoundEffect('rewind');
      setShowParticles(prev => ({ ...prev, rewind: true }));
    } else {
      setShowParticles(prev => ({ ...prev, rewind: false }));
    }
    
    // Play death sound
    if (player.isDead) {
      playSoundEffect('death');
      setShowParticles(prev => ({ ...prev, death: true }));
      setTimeout(() => setShowParticles(prev => ({ ...prev, death: false })), 500);
    }
    
  }, [player.velocity.y, player.isGrounded, player.isRewinding, player.isDead]);
  
  // Play success sound on victory
  useEffect(() => {
    if (gameState.victory) {
      playSoundEffect('levelComplete');
      setShowParticles(prev => ({ ...prev, collect: true }));
      setTimeout(() => setShowParticles(prev => ({ ...prev, collect: false })), 1000);
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
