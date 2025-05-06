
import { useState, useEffect, useCallback, useRef } from "react";
import { PlayerState, GameState, Platform, Enemy, Hazard, EnergyOrb, GameControls, Level } from "@/types/game";
import { 
  GAME_WIDTH, GAME_HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT,
  MAX_ENERGY, ENERGY_REGEN_RATE,
} from "@/constants/gameConstants";
import { levels } from "@/data/levels";
import { toast } from "sonner";

// Import utilities
import { checkCollision, applyMovement, updatePlatforms, updateEnemies } from "@/utils/gamePhysics";
import { recordTimePosition, rewindToLastPosition } from "@/utils/timeRewind";
import { 
  handlePlatformCollisions, handleDangerCollisions, 
  handleEmergencyRewind, collectEnergyOrbs, checkLevelCompletion 
} from "@/utils/collisionDetection";
import { initLevel } from "@/utils/levelManager";

export const useGame = () => {
  // Game state
  const [gameState, setGameState] = useState<GameState>({
    paused: false,
    gameOver: false,
    victory: false,
    level: 1,
    score: 0,
  });
  
  // Current level data
  const [currentLevel, setCurrentLevel] = useState<Level>(levels[0]);
  
  // Player state
  const [player, setPlayer] = useState<PlayerState>({
    position: { ...currentLevel.startPosition },
    velocity: { x: 0, y: 0 },
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    isJumping: false,
    isGrounded: false,
    isDead: false,
    facingDirection: 'right',
    timePositions: [],
    energy: MAX_ENERGY,
    maxEnergy: MAX_ENERGY,
    isRewinding: false,
  });

  // Game elements
  const [platforms, setPlatforms] = useState<Platform[]>(currentLevel.platforms);
  const [enemies, setEnemies] = useState<Enemy[]>(currentLevel.enemies);
  const [hazards, setHazards] = useState<Hazard[]>(currentLevel.hazards);
  const [energyOrbs, setEnergyOrbs] = useState<EnergyOrb[]>(currentLevel.energyOrbs);
  
  // Game controls
  const [controls, setControls] = useState<GameControls>({
    left: false,
    right: false,
    jump: false,
    rewind: false,
  });
  
  // Helper refs for game loop management
  const frameRef = useRef<number | null>(null);
  const frameCountRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  
  // Initialize level
  const initGameLevel = useCallback((levelIndex: number) => {
    return initLevel(
      levelIndex,
      setCurrentLevel,
      setPlatforms,
      setEnemies,
      setHazards,
      setEnergyOrbs,
      setPlayer,
      setGameState
    );
  }, []);
  
  // Reset the current level
  const resetLevel = useCallback(() => {
    initGameLevel(gameState.level - 1);
  }, [gameState.level, initGameLevel]);
  
  // Advance to the next level
  const nextLevel = useCallback(() => {
    initGameLevel(gameState.level);
  }, [gameState.level, initGameLevel]);
  
  // Handle game over
  const handleGameOver = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameOver: true
    }));
    toast("Game Over! Try again!");
  }, []);
  
  // Handle level completion
  const handleVictory = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      victory: true,
      score: prev.score + 100,
    }));
    toast("Level Complete!");
  }, []);
  
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
          // Only allow rewinding if there's energy and recorded positions
          if (player.energy > 0 && player.timePositions.length > 0) {
            setControls(prev => ({ ...prev, rewind: true }));
          }
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
  }, [gameState.paused, gameState.gameOver, gameState.victory, player.energy, player.timePositions.length]);
  
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
    
    // Update player state based on current state and inputs
    setPlayer(prevPlayer => {
      // Handle rewinding time
      if (controls.rewind && prevPlayer.energy > 0 && prevPlayer.timePositions.length > 0) {
        const rewindResult = rewindToLastPosition(prevPlayer);
        
        if (rewindResult.shouldStopRewinding || !rewindResult.newPosition) {
          return {
            ...prevPlayer,
            isRewinding: false,
            energy: rewindResult.newEnergy,
            timePositions: rewindResult.newTimePositions
          };
        }
        
        // Return to the previous position
        return {
          ...prevPlayer,
          position: rewindResult.newPosition,
          isDead: false,
          isRewinding: true,
          energy: rewindResult.newEnergy,
          timePositions: rewindResult.newTimePositions
        };
      }
      
      // If not rewinding, proceed with normal physics
      
      // Record position for time rewind
      const newTimePositions = recordTimePosition(prevPlayer, frameCountRef.current);
      
      // Regenerate energy when not rewinding
      let newEnergy = prevPlayer.energy;
      if (!controls.rewind) {
        newEnergy = Math.min(
          prevPlayer.maxEnergy, 
          prevPlayer.energy + ENERGY_REGEN_RATE
        );
      }
      
      // Skip physics updates if player is dead
      if (prevPlayer.isDead) {
        return {
          ...prevPlayer,
          isRewinding: false,
          energy: newEnergy,
          timePositions: newTimePositions
        };
      }
      
      // Apply physics movement
      const movementResult = applyMovement(
        prevPlayer.position,
        prevPlayer.velocity,
        controls,
        prevPlayer.isGrounded,
        prevPlayer.isJumping
      );
      
      // Apply screen boundaries
      let newPosition = { ...movementResult.position };
      let newVelocity = { ...movementResult.velocity };
      
      if (newPosition.x < 0) {
        newPosition.x = 0;
        newVelocity.x = 0;
      } else if (newPosition.x + prevPlayer.width > GAME_WIDTH) {
        newPosition.x = GAME_WIDTH - prevPlayer.width;
        newVelocity.x = 0;
      }
      
      if (newPosition.y < 0) {
        newPosition.y = 0;
        newVelocity.y = 0;
      } else if (newPosition.y + prevPlayer.height > GAME_HEIGHT) {
        // Player fell off the screen
        return {
          ...prevPlayer,
          isDead: true,
          isRewinding: false,
          energy: newEnergy,
          timePositions: newTimePositions
        };
      }
      
      return {
        ...prevPlayer,
        position: newPosition,
        velocity: newVelocity,
        isGrounded: movementResult.isGrounded,
        isJumping: movementResult.isJumping,
        facingDirection: movementResult.facingDirection,
        isRewinding: false,
        energy: newEnergy,
        timePositions: newTimePositions
      };
    });
    
    // Update platforms (for moving platforms)
    setPlatforms(prevPlatforms => updatePlatforms(prevPlatforms));
    
    // Update enemies
    setEnemies(prevEnemies => updateEnemies(prevEnemies, timestamp));
    
    frameRef.current = requestAnimationFrame(gameLoop);
  }, [controls, gameState]);
  
  // Handle collisions
  useEffect(() => {
    // Skip collision detection if game is paused/over/victory or player is rewinding
    if (gameState.paused || gameState.gameOver || gameState.victory || player.isRewinding) {
      return;
    }
    
    // Platform collisions
    const platformResult = handlePlatformCollisions(player, platforms);
    if (platformResult.isGrounded !== player.isGrounded || 
        platformResult.newPlayerState.position?.y !== player.position.y) {
      setPlayer(prev => ({
        ...prev,
        ...platformResult.newPlayerState
      }));
    }
    
    // Enemy and hazard collisions
    const dangerResult = handleDangerCollisions(player, enemies, hazards, handleGameOver);
    if (dangerResult.isDead && !player.isDead) {
      setPlayer(prev => ({ ...prev, isDead: true }));
      
      // Auto-rewind if player has sufficient energy
      if (dangerResult.shouldEmergencyRewind) {
        const didRewind = handleEmergencyRewind(player, (newState) => {
          setPlayer(prev => ({ ...prev, ...newState }));
        });
        
        if (!didRewind) {
          setTimeout(() => handleGameOver(), 1000);
        }
      } else {
        setTimeout(() => handleGameOver(), 1000);
      }
    }
    
    // Energy orb collection
    const orbResult = collectEnergyOrbs(
      player, 
      energyOrbs,
      (amount) => {
        setGameState(prev => ({ ...prev, score: prev.score + amount }));
      }
    );
    
    if (orbResult.energyIncrease > 0) {
      setPlayer(prev => ({
        ...prev,
        energy: Math.min(prev.maxEnergy, prev.energy + orbResult.energyIncrease)
      }));
      setEnergyOrbs(orbResult.updatedOrbs);
    }
    
    // Check victory condition (player reached end position)
    checkLevelCompletion(player, currentLevel.endPosition, handleVictory);
    
  }, [
    player, 
    platforms, 
    enemies, 
    hazards, 
    energyOrbs, 
    currentLevel, 
    gameState, 
    handleGameOver, 
    handleVictory
  ]);
  
  // Start/stop game loop
  useEffect(() => {
    // Start the game loop
    frameRef.current = requestAnimationFrame(gameLoop);
    
    // Initialize level
    initGameLevel(0);
    
    // Clean up the game loop
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [gameLoop, initGameLevel]);
  
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
