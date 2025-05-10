
import { PlayerState, Enemy, Hazard } from "@/types/game";
import { checkCollision, getPlayerRect } from "../gamePhysics";
import { toast } from "sonner";
import { findSafePosition } from "../timeRewind";

// Handle enemy and hazard collisions
export const handleDangerCollisions = (
  player: PlayerState,
  enemies: Enemy[],
  hazards: Hazard[],
  handleGameOver: () => void
): { isDead: boolean, shouldEmergencyRewind: boolean } => {
  if (player.isDead) {
    return { isDead: true, shouldEmergencyRewind: false };
  }
  
  const playerRect = getPlayerRect(player);
  
  // Check enemy collisions
  for (const enemy of enemies) {
    if (checkCollision(playerRect, enemy)) {
      return { isDead: true, shouldEmergencyRewind: player.energy >= player.maxEnergy * 0.8 };
    }
  }
  
  // Check hazard collisions
  for (const hazard of hazards) {
    if (checkCollision(playerRect, hazard)) {
      return { isDead: true, shouldEmergencyRewind: player.energy >= player.maxEnergy * 0.8 };
    }
  }
  
  return { isDead: false, shouldEmergencyRewind: false };
};

// Handle emergency rewind after death
export const handleEmergencyRewind = (
  player: PlayerState,
  callback: (newPlayerState: Partial<PlayerState>) => void
) => {
  if (player.timePositions.length > 0) {
    const safePosition = findSafePosition(player.timePositions);
    
    if (safePosition) {
      setTimeout(() => {
        callback({
          position: { x: safePosition.x, y: safePosition.y },
          velocity: { x: 0, y: 0 },
          isDead: false,
          energy: 0, // Drain all energy for emergency rewind
          timePositions: player.timePositions.slice(0, player.timePositions.length - 20)
        });
        
        toast("Emergency time rewind! Energy depleted!");
      }, 500);
      return true;
    }
  }
  return false;
};
