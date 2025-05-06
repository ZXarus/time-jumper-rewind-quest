
import { useState, useEffect, useCallback, useRef } from "react";
import { 
  PlayerState, GameState, Platform, Enemy, Hazard, 
  EnergyOrb, GameControls, TimePosition, Position, Level
} from "@/types/game";
import { 
  GAME_WIDTH, GAME_HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT,
  GRAVITY, PLAYER_SPEED, JUMP_FORCE, MAX_FALL_SPEED,
  MAX_ENERGY, ENERGY_REGEN_RATE, REWIND_ENERGY_COST,
  TIME_POSITION_RECORD_INTERVAL, MAX_TIME_POSITIONS
} from "@/constants/gameConstants";
import { levels } from "@/data/levels";
import { toast } from "sonner";

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
  const initLevel = useCallback((levelIndex: number) => {
    if (levelIndex >= levels.length) {
      // Game completed
      toast("Congratulations! You've completed all levels!");
      setGameState(prev => ({
        ...prev,
        paused: true,
        gameOver: false,
        victory: true,
      }));
      return;
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
    
    setGameState(prev => ({
      ...prev,
      paused: false,
      gameOver: false,
      victory: false,
      level: levelIndex + 1,
    }));
    
    toast(`Level ${levelIndex + 1} started!`);
  }, []);
  
  // Reset the current level
  const resetLevel = useCallback(() => {
    initLevel(gameState.level - 1);
  }, [gameState.level, initLevel]);
  
  // Advance to the next level
  const nextLevel = useCallback(() => {
    initLevel(gameState.level);
  }, [gameState.level, initLevel]);
  
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
  
  // Check collision between two rectangles
  const checkCollision = useCallback((rect1: { x: number, y: number, width: number, height: number }, 
                          rect2: { x: number, y: number, width: number, height: number }) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
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
        // Consume energy
        const newEnergy = Math.max(0, prevPlayer.energy - REWIND_ENERGY_COST);
        
        // Get the previous position from the time positions array
        const prevTimePosition = prevPlayer.timePositions[prevPlayer.timePositions.length - 1];
        const newTimePositions = [...prevPlayer.timePositions.slice(0, -1)];
        
        // If no more energy or positions, stop rewinding
        if (newEnergy <= 0 || newTimePositions.length === 0) {
          return {
            ...prevPlayer,
            isRewinding: false,
            energy: newEnergy,
            timePositions: newTimePositions
          };
        }
        
        // Return to the previous position
        return {
          ...prevPlayer,
          position: { x: prevTimePosition.x, y: prevTimePosition.y },
          isDead: false,
          isRewinding: true,
          energy: newEnergy,
          timePositions: newTimePositions
        };
      }
      
      // If not rewinding, proceed with normal physics
      let newPosition = { ...prevPlayer.position };
      let newVelocity = { ...prevPlayer.velocity };
      let newFacingDirection = prevPlayer.facingDirection;
      let isGrounded = false;
      
      // Record position for time rewind (every few frames to save memory)
      let newTimePositions = [...prevPlayer.timePositions];
      if (frameCountRef.current % TIME_POSITION_RECORD_INTERVAL === 0 && !prevPlayer.isRewinding) {
        newTimePositions.push({
          x: prevPlayer.position.x,
          y: prevPlayer.position.y,
          timestamp: Date.now()
        });
        
        // Limit the number of stored positions
        if (newTimePositions.length > MAX_TIME_POSITIONS) {
          newTimePositions = newTimePositions.slice(
            newTimePositions.length - MAX_TIME_POSITIONS
          );
        }
      }
      
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
      
      // Apply horizontal movement
      if (controls.left) {
        newVelocity.x = -PLAYER_SPEED;
        newFacingDirection = 'left';
      } else if (controls.right) {
        newVelocity.x = PLAYER_SPEED;
        newFacingDirection = 'right';
      } else {
        // Apply friction
        newVelocity.x *= 0.8;
        if (Math.abs(newVelocity.x) < 0.1) newVelocity.x = 0;
      }
      
      // Apply jumping
      if (controls.jump && prevPlayer.isGrounded && !prevPlayer.isJumping) {
        newVelocity.y = JUMP_FORCE;
        isGrounded = false;
      } else {
        // Apply gravity
        newVelocity.y += GRAVITY;
        
        // Limit fall speed
        if (newVelocity.y > MAX_FALL_SPEED) {
          newVelocity.y = MAX_FALL_SPEED;
        }
      }
      
      // Update position based on velocity
      newPosition.x += newVelocity.x;
      newPosition.y += newVelocity.y;
      
      // Screen boundaries
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
        isGrounded: isGrounded,
        isJumping: newVelocity.y < 0,
        facingDirection: newFacingDirection,
        isRewinding: false,
        energy: newEnergy,
        timePositions: newTimePositions
      };
    });
    
    // Update platforms (for moving platforms)
    setPlatforms(prevPlatforms => {
      return prevPlatforms.map(platform => {
        if (platform.type !== 'moving' || !platform.direction || 
            !platform.speed || !platform.range || !platform.initialPosition) {
          return platform;
        }
        
        let newX = platform.x;
        let newY = platform.y;
        
        // Calculate movement based on direction
        if (platform.direction === 'horizontal') {
          const maxOffset = platform.range / 2;
          const centerX = platform.initialPosition.x;
          const offset = newX - centerX;
          
          // Change direction if reached range limit
          if (Math.abs(offset) >= maxOffset) {
            platform.speed = -platform.speed;
          }
          
          newX += platform.speed;
        } else if (platform.direction === 'vertical') {
          const maxOffset = platform.range / 2;
          const centerY = platform.initialPosition.y;
          const offset = newY - centerY;
          
          // Change direction if reached range limit
          if (Math.abs(offset) >= maxOffset) {
            platform.speed = -platform.speed;
          }
          
          newY += platform.speed;
        }
        
        return {
          ...platform,
          x: newX,
          y: newY
        };
      });
    });
    
    // Update enemies
    setEnemies(prevEnemies => {
      return prevEnemies.map(enemy => {
        if (!enemy.range || !enemy.initialPosition) {
          return enemy;
        }
        
        let newX = enemy.x;
        let newY = enemy.y;
        let newDirection = enemy.direction;
        
        if (enemy.type === 'patrol') {
          const maxOffset = enemy.range / 2;
          const centerX = enemy.initialPosition.x;
          const offset = newX - centerX;
          
          // Change direction if reached range limit
          if (Math.abs(offset) >= maxOffset) {
            enemy.speed = -enemy.speed;
            newDirection = enemy.speed > 0 ? 'right' : 'left';
          }
          
          newX += enemy.speed;
        } else if (enemy.type === 'flying') {
          const maxOffsetX = enemy.range / 2;
          const centerX = enemy.initialPosition.x;
          const offsetX = newX - centerX;
          
          // Change direction if reached range limit
          if (Math.abs(offsetX) >= maxOffsetX) {
            enemy.speed = -enemy.speed;
            newDirection = enemy.speed > 0 ? 'right' : 'left';
          }
          
          newX += enemy.speed;
          
          // Add slight vertical movement for flying enemies
          newY += Math.sin(timestamp / 500) * 0.5;
        }
        
        return {
          ...enemy,
          x: newX,
          y: newY,
          direction: newDirection
        };
      });
    });
    
    frameRef.current = requestAnimationFrame(gameLoop);
  }, [controls, gameState]);
  
  // Handle collisions
  useEffect(() => {
    // Skip collision detection if game is paused/over/victory or player is rewinding
    if (gameState.paused || gameState.gameOver || gameState.victory || player.isRewinding) {
      return;
    }
    
    // Platform collisions
    let isGrounded = false;
    
    for (const platform of platforms) {
      // Create larger hitbox for platform top for better platform detection
      const platformTopHitbox = {
        x: platform.x,
        y: platform.y - 5, // Slightly above platform
        width: platform.width,
        height: 10
      };
      
      const playerBottomHitbox = {
        x: player.position.x + 2,
        y: player.position.y + player.height - 5,
        width: player.width - 4,
        height: 10
      };
      
      // Check if player is on top of a platform
      if (checkCollision(playerBottomHitbox, platformTopHitbox) && player.velocity.y >= 0) {
        setPlayer(prev => ({
          ...prev,
          position: { ...prev.position, y: platform.y - player.height },
          velocity: { ...prev.velocity, y: 0 },
          isGrounded: true,
          isJumping: false
        }));
        isGrounded = true;
        break;
      }
    }
    
    // Update grounded state if no platforms were collided with
    if (!isGrounded && player.isGrounded) {
      setPlayer(prev => ({
        ...prev,
        isGrounded: false
      }));
    }
    
    // Enemy collisions
    for (const enemy of enemies) {
      // Fix: Convert player state to the correct rectangle format for collision check
      const playerRect = {
        x: player.position.x,
        y: player.position.y,
        width: player.width,
        height: player.height
      };
      
      if (checkCollision(playerRect, enemy)) {
        if (!player.isDead) {
          setPlayer(prev => ({
            ...prev,
            isDead: true
          }));
          
          // Auto-rewind if player has full energy
          if (player.energy >= player.maxEnergy * 0.8) {
            setTimeout(() => {
              if (player.timePositions.length > 0) {
                // Find a safe position from about 1 second ago (20 positions at 3 frame interval)
                const safeIndex = Math.max(0, player.timePositions.length - 20);
                const safePosition = player.timePositions[safeIndex];
                
                setPlayer(prev => ({
                  ...prev,
                  position: { x: safePosition.x, y: safePosition.y },
                  velocity: { x: 0, y: 0 },
                  isDead: false,
                  energy: 0, // Drain all energy for this emergency rewind
                  timePositions: prev.timePositions.slice(0, safeIndex)
                }));
                
                toast("Emergency time rewind! Energy depleted!");
              }
            }, 500);
          } else {
            setTimeout(() => {
              handleGameOver();
            }, 1000);
          }
        }
        break;
      }
    }
    
    // Hazard collisions
    for (const hazard of hazards) {
      // Fix: Convert player state to the correct rectangle format for collision check
      const playerRect = {
        x: player.position.x,
        y: player.position.y,
        width: player.width,
        height: player.height
      };
      
      if (checkCollision(playerRect, hazard)) {
        if (!player.isDead) {
          setPlayer(prev => ({
            ...prev,
            isDead: true
          }));
          
          // Auto-rewind if player has full energy
          if (player.energy >= player.maxEnergy * 0.8) {
            setTimeout(() => {
              if (player.timePositions.length > 0) {
                // Find a safe position from about 1 second ago (20 positions at 3 frame interval)
                const safeIndex = Math.max(0, player.timePositions.length - 20);
                const safePosition = player.timePositions[safeIndex];
                
                setPlayer(prev => ({
                  ...prev,
                  position: { x: safePosition.x, y: safePosition.y },
                  velocity: { x: 0, y: 0 },
                  isDead: false,
                  energy: 0, // Drain all energy for this emergency rewind
                  timePositions: prev.timePositions.slice(0, safeIndex)
                }));
                
                toast("Emergency time rewind! Energy depleted!");
              }
            }, 500);
          } else {
            setTimeout(() => {
              handleGameOver();
            }, 1000);
          }
        }
        break;
      }
    }
    
    // Energy orb collection
    setEnergyOrbs(prevOrbs => {
      let scoreIncrease = 0;
      const updatedOrbs = prevOrbs.map(orb => {
        // Fix: Convert player state to the correct rectangle format for collision check
        const playerRect = {
          x: player.position.x,
          y: player.position.y,
          width: player.width,
          height: player.height
        };
        
        if (!orb.collected && checkCollision(playerRect, { x: orb.x, y: orb.y, width: 10, height: 10 })) {
          scoreIncrease += 10;
          toast("Energy orb collected!");
          return { ...orb, collected: true };
        }
        return orb;
      });
      
      if (scoreIncrease > 0) {
        // Increase score and energy
        setGameState(prev => ({
          ...prev,
          score: prev.score + scoreIncrease
        }));
        
        setPlayer(prev => ({
          ...prev,
          energy: Math.min(prev.maxEnergy, prev.energy + 20)
        }));
      }
      
      return updatedOrbs;
    });
    
    // Check victory condition (player reached end position)
    const endPositionHitbox = {
      x: currentLevel.endPosition.x - 10,
      y: currentLevel.endPosition.y - 10,
      width: 30,
      height: 30
    };
    
    // Fix: Convert player state to the correct rectangle format for collision check
    const playerRect = {
      x: player.position.x,
      y: player.position.y,
      width: player.width,
      height: player.height
    };
    
    if (checkCollision(playerRect, endPositionHitbox)) {
      handleVictory();
    }
    
  }, [player, platforms, enemies, hazards, energyOrbs, currentLevel, gameState, checkCollision, handleGameOver, handleVictory]);
  
  // Start/stop game loop
  useEffect(() => {
    // Start the game loop
    frameRef.current = requestAnimationFrame(gameLoop);
    
    // Initialize level
    initLevel(0);
    
    // Clean up the game loop
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [gameLoop, initLevel]);
  
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
