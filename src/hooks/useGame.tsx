
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

// Import custom hooks
import { usePlayerPhysics } from "./usePlayerPhysics";
import { useTimeRewind } from "./useTimeRewind";
import { useGameElements } from "./useGameElements";
import { useLevelManager } from "./useLevelManager";
import { useCollisionDetection } from "./useCollisionDetection";
import { useGameControls } from "./useGameControls";
import { useGameLoop } from "./useGameLoop";

export const useGame = () => {
  // Create a ref for frame count that can be passed to the player physics hook
  const frameCountRef = useRef<number>(0);
  
  // Initialize player physics
  const { player, setPlayer, updatePlayerPhysics } = usePlayerPhysics(frameCountRef);
  
  // Initialize time rewind functionality
  const { handleRewind, handleEmergencyRewind } = useTimeRewind(player, setPlayer);
  
  // Initialize game elements
  const { 
    platforms, enemies, hazards, energyOrbs, 
    setEnergyOrbs, updateGameElements, loadLevelElements,
    setPlatforms, setEnemies, setHazards
  } = useGameElements();
  
  // Initialize level manager
  const {
    currentLevel, gameState, setGameState, 
    initGameLevel, resetLevel, nextLevel
  } = useLevelManager(setPlayer, loadLevelElements);
  
  // Game event handlers
  const handleGameOver = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameOver: true
    }));
    toast("Game Over! Try again!");
  }, [setGameState]);
  
  const handleVictory = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      victory: true,
      score: prev.score + 100,
    }));
    toast("Level Complete!");
  }, [setGameState]);
  
  // Initialize collision detection
  const { checkCollisions } = useCollisionDetection(
    player, setPlayer, platforms, enemies, hazards,
    energyOrbs, setEnergyOrbs, currentLevel, gameState,
    setGameState, handleGameOver, handleVictory, handleEmergencyRewind
  );
  
  // Initialize game controls
  const { controls } = useGameControls(gameState, setGameState);
  
  // Apply rewind when R key is pressed
  useEffect(() => {
    if (controls.rewind && player.energy > 0 && player.timePositions.length > 0) {
      handleRewind(true);
    }
  }, [controls.rewind, player.energy, player.timePositions.length, handleRewind]);
  
  // Initialize game loop
  const { gameInitializedRef } = useGameLoop(
    gameState, 
    updatePlayerPhysics,
    updateGameElements,
    checkCollisions,
    controls
  );
  
  // Initialize game only once when component mounts
  useEffect(() => {
    if (!gameInitializedRef.current) {
      initGameLevel(0);
      gameInitializedRef.current = true;
    }
  }, [initGameLevel, gameInitializedRef]);
  
  return {
    gameState,
    player,
    platforms,
    enemies,
    hazards,
    energyOrbs,
    currentLevel,
    resetLevel,
    nextLevel,
  };
};

export default useGame;
