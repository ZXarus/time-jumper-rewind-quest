
import { useState, useCallback } from "react";
import { Level, GameState, PlayerState } from "@/types/game";
import { levels } from "@/data/levels";
import { toast } from "sonner";
import { MAX_ENERGY } from "@/constants/gameConstants";

export const useLevelManager = (
  setPlayer: (updater: React.SetStateAction<PlayerState>) => void,
  loadLevelElements: (level: Level) => void
) => {
  const [currentLevel, setCurrentLevel] = useState<Level>(levels[0]);
  const [gameState, setGameState] = useState<GameState>({
    paused: false,
    gameOver: false,
    victory: false,
    level: 1,
    score: 0,
  });
  
  const initGameLevel = useCallback((levelIndex: number) => {
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
    loadLevelElements(level);
    
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
  }, [loadLevelElements, setPlayer]);
  
  // Reset the current level
  const resetLevel = useCallback(() => {
    initGameLevel(gameState.level - 1);
  }, [gameState.level, initGameLevel]);
  
  // Advance to the next level
  const nextLevel = useCallback(() => {
    initGameLevel(gameState.level);
  }, [gameState.level, initGameLevel]);

  return {
    currentLevel,
    gameState,
    setGameState,
    initGameLevel,
    resetLevel,
    nextLevel
  };
};
