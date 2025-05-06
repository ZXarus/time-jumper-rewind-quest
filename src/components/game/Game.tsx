
import { useEffect } from "react";
import { toast } from "sonner";
import useGame from "@/hooks/useGame";
import Player from "@/components/game/Player";
import Platform from "@/components/game/Platform";
import Enemy from "@/components/game/Enemy";
import Hazard from "@/components/game/Hazard";
import EnergyOrb from "@/components/game/EnergyOrb";
import EnergyMeter from "@/components/game/EnergyMeter";
import GameStatus from "@/components/game/GameStatus";
import { GAME_WIDTH, GAME_HEIGHT } from "@/constants/gameConstants";

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
  
  useEffect(() => {
    toast("Welcome to Time Jumper! Use WASD or arrow keys to move, R to rewind time.");
  }, []);
  
  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-game-primary">Time Jumper</h1>
      
      <div className="relative mb-4">
        <div 
          className="relative game-canvas bg-game-bg border-4 border-game-tertiary rounded-lg overflow-hidden shadow-2xl"
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        >
          {/* Game elements */}
          {/* End position marker */}
          <div className="absolute w-8 h-8 rounded-full bg-game-accent animate-pulse" 
              style={{ 
                left: currentLevel.endPosition.x - 10, 
                top: currentLevel.endPosition.y - 10 
              }}
          />
          
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
      <div className="bg-game-bg text-white p-4 rounded-lg mb-8 max-w-md">
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
