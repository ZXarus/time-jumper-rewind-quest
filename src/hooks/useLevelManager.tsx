import { useState, useCallback, useEffect } from "react";
import { Level, GameState, PlayerState } from "@/types/game";
import { levels } from "@/data/levels";
import { toast } from "sonner";
import { MAX_ENERGY } from "@/constants/gameConstants";
import { saveGameProgress, loadGameProgress } from "@/utils/gameSave";

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
  
  // Load saved progress on initial mount
  useEffect(() => {
    const savedProgress = loadGameProgress();
    
    if (savedProgress) {
      const levelIndex = savedProgress.level - 1;
      
      // Only restore if it's a valid level
      if (levelIndex >= 0 && levelIndex < levels.length) {
        // Don't auto-initialize level yet, just update the state
        setGameState(prev => ({
          ...prev,
          level: savedProgress.level,
          score: savedProgress.score,
        }));
        
        // Show toast notification about restored progress
        toast(`Welcome back! Restored progress to Level ${savedProgress.level}`);
      }
    }
  }, []);
  
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
    
    // Keep the score from previous levels when advancing
    setGameState(prev => {
      const newLevel = levelIndex + 1;
      const newState = {
        ...prev,
        paused: false,
        gameOver: false,
        victory: false,
        level: newLevel,
      };
      
      // Save progress whenever a new level starts
      saveGameProgress(newLevel, prev.score);
      
      return newState;
    });
    
    toast(`Level ${levelIndex + 1} started!`);
    return true;
  }, [loadLevelElements, setPlayer]);
  
  // Reset the current level
  const resetLevel = useCallback(() => {
    initGameLevel(gameState.level - 1);
  }, [gameState.level, initGameLevel]);
  
  // Advance to the next level
  const nextLevel = useCallback(() => {
    // Save the current score before moving to next level
    saveGameProgress(gameState.level + 1, gameState.score);
    initGameLevel(gameState.level);
  }, [gameState.level, gameState.score, initGameLevel]);

  return {
    currentLevel,
    gameState,
    setGameState,
    initGameLevel,
    resetLevel,
    nextLevel
  };
};
