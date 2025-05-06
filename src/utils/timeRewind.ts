
import { TimePosition, PlayerState } from "@/types/game";
import { TIME_POSITION_RECORD_INTERVAL, MAX_TIME_POSITIONS, REWIND_ENERGY_COST } from "@/constants/gameConstants";

// Record a player position for time rewinding
export const recordTimePosition = (
  player: PlayerState, 
  frameCount: number
): TimePosition[] => {
  if (frameCount % TIME_POSITION_RECORD_INTERVAL === 0 && !player.isRewinding) {
    const newPosition: TimePosition = {
      x: player.position.x,
      y: player.position.y,
      timestamp: Date.now()
    };
    
    const updatedPositions = [...player.timePositions, newPosition];
    
    // Limit the number of stored positions
    if (updatedPositions.length > MAX_TIME_POSITIONS) {
      return updatedPositions.slice(updatedPositions.length - MAX_TIME_POSITIONS);
    }
    
    return updatedPositions;
  }
  
  return player.timePositions;
};

// Rewind player to previous position
export const rewindToLastPosition = (player: PlayerState): {
  newPosition: { x: number, y: number } | null;
  newEnergy: number;
  newTimePositions: TimePosition[];
  shouldStopRewinding: boolean;
} => {
  // Consume energy
  const newEnergy = Math.max(0, player.energy - REWIND_ENERGY_COST);
  
  // No more positions or energy
  if (player.timePositions.length === 0 || newEnergy <= 0) {
    return {
      newPosition: null,
      newEnergy,
      newTimePositions: player.timePositions,
      shouldStopRewinding: true
    };
  }
  
  // Get the previous position
  const prevTimePosition = player.timePositions[player.timePositions.length - 1];
  const newTimePositions = [...player.timePositions.slice(0, -1)];
  
  return {
    newPosition: { x: prevTimePosition.x, y: prevTimePosition.y },
    newEnergy,
    newTimePositions,
    shouldStopRewinding: newTimePositions.length === 0 || newEnergy <= 0
  };
};

// Find a safe position from the past (for emergency rewind)
export const findSafePosition = (timePositions: TimePosition[], lookBackFrames: number = 20) => {
  const safeIndex = Math.max(0, timePositions.length - lookBackFrames);
  return safeIndex < timePositions.length ? timePositions[safeIndex] : null;
};
