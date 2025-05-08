
import { useState, useCallback, useRef } from "react";
import { PlayerState, GameControls } from "@/types/game";
import { applyMovement } from "@/utils/gamePhysics";
import { recordTimePosition } from "@/utils/timeRewind";
import { MAX_ENERGY, ENERGY_REGEN_RATE } from "@/constants/gameConstants";

export const usePlayerPhysics = (
  frameCountRef?: React.MutableRefObject<number>
) => {
  // Create an internal frameCountRef if one is not provided
  const internalFrameCountRef = useRef<number>(0);
  const actualFrameCountRef = frameCountRef || internalFrameCountRef;
  
  // Add input buffer for more responsive controls
  const inputBufferRef = useRef({
    jumpPressed: false,
    jumpBufferTime: 0,
    jumpBufferDuration: 150, // ms to buffer jump input
    coyoteTime: 0,
    coyoteTimeDuration: 100, // ms of coyote time
    wasGrounded: false
  });
  
  const [player, setPlayer] = useState<PlayerState>({
    position: { x: 0, y: 0 },
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

  // Update player state based on controls and physics with improved responsiveness
  const updatePlayerPhysics = useCallback((controls: GameControls, gameState: { paused: boolean, gameOver: boolean, victory: boolean }) => {
    // Skip updates if game is paused/over/victory
    if (gameState.paused || gameState.gameOver || gameState.victory) {
      return;
    }
    
    // Track current time for input buffering
    const now = performance.now();
    
    // Jump buffer - allow jump input to be registered slightly before landing
    if (controls.jump) {
      inputBufferRef.current.jumpPressed = true;
      inputBufferRef.current.jumpBufferTime = now;
    } else if (now - inputBufferRef.current.jumpBufferTime > inputBufferRef.current.jumpBufferDuration) {
      inputBufferRef.current.jumpPressed = false;
    }
    
    // Increment frame count for smoother animations and physics calculations
    if (actualFrameCountRef) {
      actualFrameCountRef.current += 1;
    }
    
    // Update player state based on current state and inputs
    setPlayer(prevPlayer => {
      // Handle rewinding time
      if (controls.rewind && prevPlayer.energy > 0 && prevPlayer.timePositions.length > 0) {
        // Moved to useTimeRewind hook
        return prevPlayer;
      }
      
      // Record position for time rewind
      const newTimePositions = recordTimePosition(prevPlayer, actualFrameCountRef.current);
      
      // Track coyote time - allow jumping slightly after leaving a platform
      if (prevPlayer.isGrounded && !inputBufferRef.current.wasGrounded) {
        inputBufferRef.current.wasGrounded = true;
      } else if (!prevPlayer.isGrounded && inputBufferRef.current.wasGrounded) {
        inputBufferRef.current.wasGrounded = false;
        inputBufferRef.current.coyoteTime = now;
      }
      
      const canJumpWithCoyoteTime = !prevPlayer.isGrounded && 
        now - inputBufferRef.current.coyoteTime < inputBufferRef.current.coyoteTimeDuration;
      
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
      
      // Create modified controls with jump buffer and coyote time
      const enhancedControls = {
        ...controls,
        jump: controls.jump || (inputBufferRef.current.jumpPressed && (prevPlayer.isGrounded || canJumpWithCoyoteTime))
      };
      
      // Apply physics movement with enhanced controls
      const movementResult = applyMovement(
        prevPlayer.position,
        prevPlayer.velocity,
        enhancedControls,
        prevPlayer.isGrounded || canJumpWithCoyoteTime,
        prevPlayer.isJumping
      );
      
      // Reset jump buffer if we actually jumped
      if (enhancedControls.jump && (prevPlayer.isGrounded || canJumpWithCoyoteTime)) {
        inputBufferRef.current.jumpPressed = false;
      }
      
      // Apply screen boundaries
      let newPosition = { ...movementResult.position };
      let newVelocity = { ...movementResult.velocity };
      
      if (newPosition.x < 0) {
        newPosition.x = 0;
        newVelocity.x = 0;
      } else if (newPosition.x + prevPlayer.width > 800) { // GAME_WIDTH
        newPosition.x = 800 - prevPlayer.width; // GAME_WIDTH - prevPlayer.width
        newVelocity.x = 0;
      }
      
      if (newPosition.y < 0) {
        newPosition.y = 0;
        newVelocity.y = 0;
      } else if (newPosition.y + prevPlayer.height > 500) { // GAME_HEIGHT
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
  }, [actualFrameCountRef]);

  return {
    player,
    setPlayer,
    updatePlayerPhysics
  };
};
