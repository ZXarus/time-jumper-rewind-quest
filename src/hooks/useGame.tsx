
import { useCallback, useEffect, useRef, useState } from "react";
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
  
  // Track particle effects
  const [showParticles, setShowParticles] = useState({
    jump: false,
    collect: false,
    rewind: false,
    death: false
  });
  
  // Initialize player physics
  const { player, setPlayer, updatePlayerPhysics } = usePlayerPhysics(frameCountRef);
  
  // Initialize time rewind functionality
  const { handleRewind, handleEmergencyRewind } = useTimeRewind(player, setPlayer);
  
  // Initialize game elements
  const { 
    platforms, enemies, hazards, energyOrbs, energyBoosters,
    setEnergyOrbs, setEnergyBoosters, updateGameElements, loadLevelElements,
    updatePlayerPlatform
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
    
    setShowParticles(prev => ({
      ...prev,
      death: true
    }));
    
    toast("Game Over! Try again!");
    
    // Hide death particles after animation
    setTimeout(() => {
      setShowParticles(prev => ({
        ...prev,
        death: false
      }));
    }, 1000);
  }, [setGameState]);
  
  const handleVictory = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      victory: true,
      score: prev.score + 100,
    }));
    
    setShowParticles(prev => ({
      ...prev,
      collect: true
    }));
    
    toast("Level Complete!");
    
    // Hide collect particles after animation
    setTimeout(() => {
      setShowParticles(prev => ({
        ...prev,
        collect: false
      }));
    }, 1000);
  }, [setGameState]);
  
  // Initialize collision detection
  const { checkCollisions } = useCollisionDetection(
    player, setPlayer, platforms, enemies, hazards,
    energyOrbs, energyBoosters, setEnergyOrbs, setEnergyBoosters,
    updatePlayerPlatform, currentLevel, gameState,
    setGameState, handleGameOver, handleVictory, handleEmergencyRewind
  );
  
  // Initialize game controls
  const { controls } = useGameControls(gameState, setGameState);
  
  // Apply rewind when R key is pressed
  useEffect(() => {
    if (controls.rewind && player.energy > 0 && player.timePositions.length > 0) {
      handleRewind(true);
      
      // Show rewind particles
      setShowParticles(prev => ({
        ...prev,
        rewind: true
      }));
      
      // Hide rewind particles after animation
      setTimeout(() => {
        setShowParticles(prev => ({
          ...prev,
          rewind: false
        }));
      }, 500);
    }
  }, [controls.rewind, player.energy, player.timePositions.length, handleRewind]);
  
  // Show jump particles when jumping
  useEffect(() => {
    if (player.isJumping && player.velocity.y < 0 && !showParticles.jump) {
      setShowParticles(prev => ({
        ...prev,
        jump: true
      }));
      
      // Hide jump particles after animation
      setTimeout(() => {
        setShowParticles(prev => ({
          ...prev,
          jump: false
        }));
      }, 300);
    }
  }, [player.isJumping, player.velocity.y, showParticles.jump]);
  
  // Update game elements with player position for moving platforms
  const updateGameElementsWithPlayer = useCallback((timestamp: number) => {
    updateGameElements(timestamp, player);
  }, [updateGameElements, player]);
  
  // Initialize game loop
  const { gameInitializedRef } = useGameLoop(
    gameState, 
    updatePlayerPhysics,
    updateGameElementsWithPlayer,
    checkCollisions,
    controls
  );
  
  // Initialize game only once when component mounts
  useEffect(() => {
    if (!gameInitializedRef.current) {
      // Start at level 0 (first level) unless we have saved progress
      const levelToStart = Math.max(0, gameState.level - 1);
      initGameLevel(levelToStart);
      gameInitializedRef.current = true;
    }
  }, [initGameLevel, gameInitializedRef, gameState.level]);
  
  return {
    gameState,
    player,
    platforms,
    enemies,
    hazards,
    energyOrbs,
    energyBoosters, // Make sure energyBoosters is exported
    currentLevel,
    showParticles, // Make sure showParticles is exported
    resetLevel,
    nextLevel,
  };
};

export default useGame;
