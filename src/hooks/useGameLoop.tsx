
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
  const lastUpdateTimeRef = useRef<number>(0);
  const FPS_CAP = 60;
  const FRAME_TIME = 1000 / FPS_CAP;
  
  // Add performance monitoring
  const performanceChecksRef = useRef<{
    lastCheck: number;
    frameCount: number;
    slowFrames: number;
  }>({
    lastCheck: 0,
    frameCount: 0,
    slowFrames: 0
  });
  
  // Main game loop with improved timing and stability
  const gameLoop = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
      lastUpdateTimeRef.current = timestamp;
      performanceChecksRef.current.lastCheck = timestamp;
    }
    
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;
    
    // Performance monitoring
    performanceChecksRef.current.frameCount++;
    if (deltaTime > 32) { // More than 32ms (less than 30fps)
      performanceChecksRef.current.slowFrames++;
    }
    
    // Every 5 seconds, check performance
    if (timestamp - performanceChecksRef.current.lastCheck > 5000) {
      const avgFPS = performanceChecksRef.current.frameCount / 5;
      const slowFramePercentage = (performanceChecksRef.current.slowFrames / performanceChecksRef.current.frameCount) * 100;
      
      // Reset performance metrics
      performanceChecksRef.current = {
        lastCheck: timestamp,
        frameCount: 0,
        slowFrames: 0
      };
      
      // Log performance issues if needed
      if (slowFramePercentage > 20) {
        console.warn(`Performance warning: ${avgFPS.toFixed(1)}fps, ${slowFramePercentage.toFixed(1)}% slow frames`);
      }
    }
    
    // Skip frame if game is paused/over/victory
    if (gameState.paused || gameState.gameOver || gameState.victory) {
      frameRef.current = requestAnimationFrame(gameLoop);
      return;
    }
    
    // Use a consistent update rate for physics to ensure stable behavior
    const timeSinceLastUpdate = timestamp - lastUpdateTimeRef.current;
    
    // More stable timing mechanism
    const updatesToPerform = Math.floor(timeSinceLastUpdate / FRAME_TIME);
    
    if (updatesToPerform > 0) {
      // Prevent too many updates at once (if game has been in background)
      const maxUpdates = Math.min(updatesToPerform, 5);
      
      for (let i = 0; i < maxUpdates; i++) {
        // Increase frame counter
        frameCountRef.current += 1;
        
        // Update player physics based on controls
        updatePlayerPhysics(controls, gameState);
        
        // Update game elements (platforms, enemies)
        updateGameElements(timestamp);
        
        // Check for collisions
        checkCollisions();
      }
      
      // Update last update time - more accurate tracking
      lastUpdateTimeRef.current += maxUpdates * FRAME_TIME;
    }
    
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
