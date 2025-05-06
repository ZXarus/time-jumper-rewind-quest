
import { PlayerState, Platform, Enemy, Hazard, EnergyOrb, Level } from "@/types/game";
import { checkCollision, getPlayerRect } from "./gamePhysics";
import { toast } from "sonner";
import { findSafePosition } from "./timeRewind";

// Check platform collisions and handle player grounding
export const handlePlatformCollisions = (
  player: PlayerState, 
  platforms: Platform[]
): { newPlayerState: Partial<PlayerState>, isGrounded: boolean } => {
  let isGrounded = false;
  let newPosition = { ...player.position };
  
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
      newPosition.y = platform.y - player.height;
      isGrounded = true;
      break;
    }
  }
  
  return {
    newPlayerState: {
      position: newPosition,
      velocity: isGrounded ? { ...player.velocity, y: 0 } : player.velocity,
      isGrounded: isGrounded,
      isJumping: isGrounded ? false : player.isJumping
    },
    isGrounded
  };
};

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

// Handle energy orb collection
export const collectEnergyOrbs = (
  player: PlayerState,
  energyOrbs: EnergyOrb[],
  onScoreIncrease: (amount: number) => void
): { updatedOrbs: EnergyOrb[], energyIncrease: number } => {
  let scoreIncrease = 0;
  let energyIncrease = 0;
  const playerRect = getPlayerRect(player);

  const updatedOrbs = energyOrbs.map(orb => {
    if (!orb.collected && checkCollision(playerRect, { x: orb.x, y: orb.y, width: 10, height: 10 })) {
      scoreIncrease += 10;
      energyIncrease += 20;
      toast("Energy orb collected!");
      return { ...orb, collected: true };
    }
    return orb;
  });
  
  if (scoreIncrease > 0) {
    onScoreIncrease(scoreIncrease);
  }
  
  return { updatedOrbs, energyIncrease };
};

// Check if player reached level end
export const checkLevelCompletion = (
  player: PlayerState,
  endPosition: { x: number, y: number },
  onVictory: () => void
): boolean => {
  const endPositionHitbox = {
    x: endPosition.x - 10,
    y: endPosition.y - 10,
    width: 30,
    height: 30
  };
  
  const playerRect = getPlayerRect(player);
  
  if (checkCollision(playerRect, endPositionHitbox)) {
    onVictory();
    return true;
  }
  
  return false;
};
