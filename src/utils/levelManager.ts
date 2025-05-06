
import { toast } from "sonner";
import { Level, GameState, PlayerState } from "@/types/game";
import { levels } from "@/data/levels";
import { MAX_ENERGY } from "@/constants/gameConstants";

// Initialize a level by index
export const initLevel = (
  levelIndex: number,
  setCurrentLevel: (level: Level) => void,
  setPlatforms: (platforms: Level['platforms']) => void,
  setEnemies: (enemies: Level['enemies']) => void,
  setHazards: (hazards: Level['hazards']) => void,
  setEnergyOrbs: (energyOrbs: Level['energyOrbs']) => void,
  setPlayer: (playerState: PlayerState) => void,
  setGameState: (gameState: GameState | ((prev: GameState) => GameState)) => void
): boolean => {
  if (levelIndex >= levels.length) {
    // Game completed
    toast("Congratulations! You've completed all levels!");
    setGameState(prev => ({
      ...prev,
      paused: true,
      gameOver: false,
      victory: true,
    }));
    return false;
  }
  
  const level = levels[levelIndex];
  
  setCurrentLevel(level);
  setPlatforms([...level.platforms]);
  setEnemies([...level.enemies]);
  setHazards([...level.hazards]);
  setEnergyOrbs([...level.energyOrbs]);
  
  setPlayer({
    position: { ...level.startPosition },
    velocity: { x: 0, y: 0 },
    width: 30,
    height: 50,
    isJumping: false,
    isGrounded: false,
    isDead: false,
    facingDirection: 'right',
    timePositions: [],
    energy: MAX_ENERGY,
    maxEnergy: MAX_ENERGY,
    isRewinding: false,
  });
  
  setGameState(prev => ({
    ...prev,
    paused: false,
    gameOver: false,
    victory: false,
    level: levelIndex + 1,
    score: 0,
  }));
  
  toast(`Level ${levelIndex + 1} started!`);
  return true;
};
