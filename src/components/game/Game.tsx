
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useGame from "@/hooks/useGame";
import Player from "@/components/game/Player";
import Platform from "@/components/game/Platform";
import Enemy from "@/components/game/Enemy";
import Hazard from "@/components/game/Hazard";
import EnergyOrb from "@/components/game/EnergyOrb";
import EnergyMeter from "@/components/game/EnergyMeter";
import GameStatus from "@/components/game/GameStatus";
import SoundControl from "@/components/game/SoundControl";
import ParticleEffect from "@/components/game/ParticleEffect";
import { GAME_WIDTH, GAME_HEIGHT } from "@/constants/gameConstants";
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
        <div 
          className="relative game-canvas bg-game-bg border-4 border-game-tertiary rounded-lg overflow-hidden shadow-2xl"
          style={{ 
            width: GAME_WIDTH, 
            height: GAME_HEIGHT,
            backgroundImage: "linear-gradient(to bottom, rgba(26, 31, 44, 0.8), rgba(26, 31, 44, 1))",
            boxShadow: "0 0 30px rgba(155, 135, 245, 0.3)"
          }}
        >
          {/* Sound controls */}
          <SoundControl />
          
          {/* Game elements */}
          {/* End position marker */}
          <div className="absolute w-8 h-8 rounded-full bg-game-accent animate-pulse" 
              style={{ 
                left: currentLevel.endPosition.x - 10, 
                top: currentLevel.endPosition.y - 10,
                boxShadow: "0 0 15px rgba(217, 70, 239, 0.7)"
              }}
          />
          
          {/* Particles for visual effects */}
          {showParticles.jump && (
            <ParticleEffect
              position={{ x: player.position.x + player.width / 2, y: player.position.y + player.height }}
              isActive={true}
              type="jump"
            />
          )}
          
          {showParticles.collect && (
            <ParticleEffect
              position={{ x: currentLevel.endPosition.x, y: currentLevel.endPosition.y }}
              isActive={true}
              type="collect"
              count={15}
            />
          )}
          
          {showParticles.rewind && (
            <ParticleEffect
              position={{ x: player.position.x + player.width / 2, y: player.position.y + player.height / 2 }}
              isActive={true}
              type="rewind"
              count={2}
            />
          )}
          
          {showParticles.death && (
            <ParticleEffect
              position={{ x: player.position.x + player.width / 2, y: player.position.y + player.height / 2 }}
              isActive={true}
              type="death"
              count={10}
            />
          )}
          
          {/* Platforms */}
          {platforms.map((platform, index) => (
            <Platform key={`platform-${index}`} platform={platform} />
          ))}
          
          {/* Energy orbs */}
          {energyOrbs.map((orb, index) => (
            <EnergyOrb key={`orb-${index}`} energyOrb={orb} />
          ))}
          
          {/* Hazards */}
          {hazards.map((hazard, index) => (
            <Hazard key={`hazard-${index}`} hazard={hazard} />
          ))}
          
          {/* Enemies */}
          {enemies.map((enemy, index) => (
            <Enemy key={`enemy-${index}`} enemy={enemy} />
          ))}
          
          {/* Player */}
          <Player player={player} isRewinding={player.isRewinding} />
          
          {/* UI Elements */}
          <EnergyMeter 
            currentEnergy={player.energy} 
            maxEnergy={player.maxEnergy} 
            isRewinding={player.isRewinding}
          />
          
          {/* Game status overlay */}
          <GameStatus 
            gameState={gameState} 
            onRestart={resetLevel} 
            onNextLevel={nextLevel}
          />
        </div>
      </div>
      
      {/* Game controls instructions */}
      <div className="bg-game-bg text-white p-4 rounded-lg mb-8 max-w-md shadow-lg border border-game-tertiary/30">
        <h2 className="text-xl font-bold mb-2 text-game-primary">Controls</h2>
        <ul className="space-y-2 text-sm">
          <li><span className="font-bold text-game-primary">Move:</span> A/D or Arrow Keys</li>
          <li><span className="font-bold text-game-primary">Jump:</span> W, Space or Up Arrow</li>
          <li><span className="font-bold text-game-primary">Rewind Time:</span> Hold R (requires energy)</li>
          <li><span className="font-bold text-game-primary">Pause:</span> Escape</li>
        </ul>
        <p className="mt-4 text-sm">
          <span className="font-bold text-game-primary">Pro Tip:</span> If you die with full energy, 
          you'll automatically rewind to safety!
        </p>
      </div>
    </div>
  );
};

export default Game;
