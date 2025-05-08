
import { useState, useCallback, useEffect } from "react";
import { Level, GameState, PlayerState } from "@/types/game";
import { levels } from "@/data/levels";
import { toast } from "sonner";
import { MAX_ENERGY } from "@/constants/gameConstants";
import { 
  saveGameProgress, 
  loadGameProgress, 
  saveHighestLevel, 
  getHighestLevel
} from "@/utils/gameSave";

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
          score: 0, // Reset score to 0 when loading a level
        }));
        
        // Show toast notification about restored progress
        toast(`Welcome back! Continuing from Level ${savedProgress.level}`);
      }
    } else {
      // Check if there's a highest level reached
      const highestLevel = getHighestLevel();
      if (highestLevel > 1) {
        setGameState(prev => ({
          ...prev,
          level: highestLevel,
        }));
        toast(`Welcome back! You can continue from Level ${highestLevel}`);
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
    
    // Ensure all platforms have IDs (needed for moving platform tracking)
    const platformsWithIds = level.platforms.map((platform, index) => {
      if (!platform.id) {
        return {...platform, id: `p-${levelIndex}-${index}`};
      }
      return platform;
    });
    
    // Add some energy boosters if not present
    let levelEnergyBoosters = level.energyBoosters || [];
    if (!level.energyBoosters || level.energyBoosters.length === 0) {
      // Add 1-2 energy boosters at strategic locations
      levelEnergyBoosters = [
        {
          x: level.startPosition.x + 200,
          y: level.startPosition.y - 100,
          collected: false,
          id: `eb-${levelIndex}-1`
        }
      ];
      
      // Add a second one for longer levels
      if (Math.abs(level.endPosition.x - level.startPosition.x) > 400) {
        levelEnergyBoosters.push({
          x: (level.startPosition.x + level.endPosition.x) / 2,
          y: Math.min(level.startPosition.y, level.endPosition.y) - 50,
          collected: false,
          id: `eb-${levelIndex}-2`
        });
      }
    }
    
    // Updated level with IDs and energy boosters
    const updatedLevel = {
      ...level,
      platforms: platformsWithIds,
      energyBoosters: levelEnergyBoosters
    };
    
    setCurrentLevel(updatedLevel);
    loadLevelElements(updatedLevel);
    
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
    
    const newLevel = levelIndex + 1;
    
    // Reset score when initializing a level
    setGameState(prev => {
      const newState = {
        ...prev,
        paused: false,
        gameOver: false,
        victory: false,
        level: newLevel,
        score: 0, // Reset score to 0 when starting a level
      };
      
      // Save progress whenever a new level starts
      saveGameProgress(newLevel, 0);
      saveHighestLevel(newLevel);
      
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
    // Save the level progress before moving to next level
    const nextLevelNum = gameState.level + 1;
    saveGameProgress(nextLevelNum, 0); // Reset score when advancing
    saveHighestLevel(nextLevelNum);
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
