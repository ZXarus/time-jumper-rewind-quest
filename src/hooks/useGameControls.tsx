
import { useState, useEffect } from "react";
import { GameControls, GameState } from "@/types/game";

export const useGameControls = (gameState: GameState, setGameState: (updater: React.SetStateAction<GameState>) => void) => {
  // Game controls
  const [controls, setControls] = useState<GameControls>({
    left: false,
    right: false,
    jump: false,
    rewind: false,
  });
  
  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.paused || gameState.gameOver || gameState.victory) return;
      
      switch(e.key.toLowerCase()) {
        case 'a':
        case 'arrowleft':
          setControls(prev => ({ ...prev, left: true }));
          break;
        case 'd':
        case 'arrowright':
          setControls(prev => ({ ...prev, right: true }));
          break;
        case 'w':
        case ' ':
        case 'arrowup':
          setControls(prev => ({ ...prev, jump: true }));
          break;
        case 'r':
          setControls(prev => ({ ...prev, rewind: true }));
          break;
        case 'escape':
          setGameState(prev => ({ ...prev, paused: !prev.paused }));
          break;
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      switch(e.key.toLowerCase()) {
        case 'a':
        case 'arrowleft':
          setControls(prev => ({ ...prev, left: false }));
          break;
        case 'd':
        case 'arrowright':
          setControls(prev => ({ ...prev, right: false }));
          break;
        case 'w':
        case ' ':
        case 'arrowup':
          setControls(prev => ({ ...prev, jump: false }));
          break;
        case 'r':
          setControls(prev => ({ ...prev, rewind: false }));
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState.paused, gameState.gameOver, gameState.victory, setGameState]);

  return { controls };
};
