
import { useState, useCallback } from "react";
import { PlayerState, GameControls } from "@/types/game";
import { applyMovement } from "@/utils/gamePhysics";
import { recordTimePosition } from "@/utils/timeRewind";
import { MAX_ENERGY, ENERGY_REGEN_RATE } from "@/constants/gameConstants";

export const usePlayerPhysics = (frameCountRef: React.MutableRefObject<number>) => {
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

  // Update player state based on controls and physics
  const updatePlayerPhysics = useCallback((controls: GameControls, gameState: { paused: boolean, gameOver: boolean, victory: boolean }) => {
    // Skip updates if game is paused/over/victory
    if (gameState.paused || gameState.gameOver || gameState.victory) {
      return;
    }
    
    // Update player state based on current state and inputs
    setPlayer(prevPlayer => {
      // Handle rewinding time
      if (controls.rewind && prevPlayer.energy > 0 && prevPlayer.timePositions.length > 0) {
        // Moved to useTimeRewind hook
        return prevPlayer;
      }
      
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
  }, [frameCountRef]);

  return {
    player,
    setPlayer,
    updatePlayerPhysics
  };
};
