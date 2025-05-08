
import React, { useState } from "react";
import Player from "@/components/game/Player";
import Platform from "@/components/game/Platform";
import Enemy from "@/components/game/Enemy";
import Hazard from "@/components/game/Hazard";
import EnergyOrb from "@/components/game/EnergyOrb";
import EnergyBooster from "@/components/game/EnergyBooster";
import EnergyMeter from "@/components/game/EnergyMeter";
import GameStatus from "@/components/game/GameStatus";
import SoundControl from "@/components/game/SoundControl";
import ParticleEffect from "@/components/game/ParticleEffect";
import RestartButton from "@/components/game/RestartButton";
import { GAME_WIDTH, GAME_HEIGHT, GROUND_HEIGHT, COLORS } from "@/constants/gameConstants";
import { Position, PlayerState, GameState, Level, Platform as PlatformType, Enemy as EnemyType, Hazard as HazardType, EnergyOrb as EnergyOrbType, EnergyBooster as EnergyBoosterType } from "@/types/game";

interface GameCanvasProps {
  gameState: GameState;
  player: PlayerState;
  platforms: PlatformType[];
  enemies: EnemyType[];
  hazards: HazardType[];
  energyOrbs: EnergyOrbType[];
  energyBoosters: EnergyBoosterType[];
  currentLevel: Level;
  showParticles: {
    jump: boolean;
    collect: boolean;
    rewind: boolean;
    death: boolean;
  };
  resetLevel: () => void;
  nextLevel: () => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({
  gameState,
  player,
  platforms,
  enemies,
  hazards,
  energyOrbs,
  energyBoosters,
  currentLevel,
  showParticles,
  resetLevel,
  nextLevel
}) => {
  return (
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
      
      {/* Restart button */}
      <RestartButton onRestart={resetLevel} />
      
      {/* Game elements */}
      {/* Ground */}
      <div 
        className="absolute bottom-0 left-0 w-full" 
        style={{ 
          height: GROUND_HEIGHT, 
          backgroundColor: COLORS.ground,
          borderTop: '2px solid rgba(255,255,255,0.1)',
          boxShadow: '0 -5px 15px rgba(0,0,0,0.2)',
        }}
      ></div>
      
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
          count={3}
        />
      )}
      
      {showParticles.death && (
        <ParticleEffect
          position={{ x: player.position.x + player.width / 2, y: player.position.y + player.height / 2 }}
          isActive={true}
          type="death"
          count={12}
        />
      )}
      
      {/* Platforms */}
      {platforms.map((platform, index) => (
        <Platform key={`platform-${platform.id || index}`} platform={platform} />
      ))}
      
      {/* Energy orbs */}
      {energyOrbs.map((orb, index) => (
        <EnergyOrb key={`orb-${orb.id || index}`} energyOrb={orb} />
      ))}
      
      {/* Energy boosters */}
      {energyBoosters && energyBoosters.map((booster, index) => (
        <EnergyBooster key={`booster-${booster.id || index}`} energyBooster={booster} />
      ))}
      
      {/* Hazards */}
      {hazards.map((hazard, index) => (
        <Hazard key={`hazard-${hazard.id || index}`} hazard={hazard} />
      ))}
      
      {/* Enemies */}
      {enemies.map((enemy, index) => (
        <Enemy key={`enemy-${enemy.id || index}`} enemy={enemy} />
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
  );
};

export default GameCanvas;
