
import { useRef, useCallback, useEffect } from "react";
import { GameState } from "@/types/game";

export const useGameLoop = (
  gameState: GameState,
  updatePlayerPhysics: (controls: any, gameState: GameState) => void,
  updateGameElements: (timestamp: number) => void,
  checkCollisions: () => void,
  controls: any
) => {
  // Helper refs for game loop management
  const frameRef = useRef<number | null>(null);
  const frameCountRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const gameInitializedRef = useRef<boolean>(false);
  
  // Main game loop
  const gameLoop = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
    }
    
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;
    
    // Skip frame if game is paused/over/victory
    if (gameState.paused || gameState.gameOver || gameState.victory) {
      frameRef.current = requestAnimationFrame(gameLoop);
      return;
    }
    
    // Increase frame counter
    frameCountRef.current += 1;
    
    // Update player physics based on controls
    updatePlayerPhysics(controls, gameState);
    
    // Update game elements (platforms, enemies)
    updateGameElements(timestamp);
    
    // Check for collisions
    checkCollisions();
    
    frameRef.current = requestAnimationFrame(gameLoop);
  }, [controls, gameState, updatePlayerPhysics, updateGameElements, checkCollisions]);
  
  // Start/stop game loop
  useEffect(() => {
    // Start the game loop
    frameRef.current = requestAnimationFrame(gameLoop);
    
    // Clean up the game loop
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [gameLoop]);

  return {
    frameCountRef,
    gameInitializedRef
  };
};
