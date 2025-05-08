
import { PlayerState, Platform, Enemy, Hazard, EnergyOrb, Level, EnergyBooster } from "@/types/game";
import { checkCollision, getPlayerRect } from "./gamePhysics";
import { toast } from "sonner";
import { findSafePosition } from "./timeRewind";

// Check platform collisions and handle player grounding
export const handlePlatformCollisions = (
  player: PlayerState, 
  platforms: Platform[]
): { newPlayerState: Partial<PlayerState>, isGrounded: boolean, platformId?: string } => {
  let isGrounded = false;
  let newPosition = { ...player.position };
  let platformId: string | undefined;
  
  for (const platform of platforms) {
    // Create larger hitbox for platform top for better platform detection
    const platformTopHitbox = {
      x: platform.x + 2, // Adding slight margin for better collision
      y: platform.y - 8, // Slightly above platform for more forgiving detection
      width: platform.width - 4,
      height: 16 // Taller hitbox to catch collisions earlier
    };
    
    const playerBottomHitbox = {
      x: player.position.x + 2,
      y: player.position.y + player.height - 10,
      width: player.width - 4,
      height: 15
    };
    
    // Check if player is on top of a platform
    if (checkCollision(playerBottomHitbox, platformTopHitbox) && player.velocity.y >= 0) {
      newPosition.y = platform.y - player.height;
      isGrounded = true;
      platformId = platform.id;
      break;
    }
    
    // Check side collisions to prevent getting stuck inside platforms
    const platformRect = { 
      x: platform.x, 
      y: platform.y, 
      width: platform.width, 
      height: platform.height 
    };
    
    const playerRect = getPlayerRect(player);
    
    // Only check side collisions if we're not already grounded from above
    if (!isGrounded && checkCollision(playerRect, platformRect)) {
      // Determine if this is a side collision
      const playerBottom = player.position.y + player.height;
      const platformTop = platform.y;
      
      // If bottom of player is below top of platform by more than a threshold, 
      // it's likely a side collision
      if (playerBottom - platformTop > 10) {
        // Determine which side of the platform we're colliding with
        const playerRight = player.position.x + player.width;
        const platformRight = platform.x + platform.width;
        
        if (player.velocity.x > 0 && Math.abs(playerRight - platform.x) < Math.abs(player.position.x - platformRight)) {
          // Hitting left side of platform
          newPosition.x = platform.x - player.width;
        } else if (player.velocity.x < 0) {
          // Hitting right side of platform
          newPosition.x = platform.x + platform.width;
        }
      }
    }
  }
  
  return {
    newPlayerState: {
      position: newPosition,
      velocity: isGrounded ? { ...player.velocity, y: 0 } : player.velocity,
      isGrounded,
      isJumping: isGrounded ? false : player.isJumping
    },
    isGrounded,
    platformId
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
    if (!orb.collected && checkCollision(playerRect, { x: orb.x, y: orb.y, width: 15, height: 15 })) {
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

// Handle energy booster collection
export const collectEnergyBoosters = (
  player: PlayerState,
  boosters: EnergyBooster[],
): { updatedBoosters: EnergyBooster[], energyIncrease: number } => {
  let energyIncrease = 0;
  const playerRect = getPlayerRect(player);

  const updatedBoosters = boosters.map(booster => {
    if (!booster.collected && checkCollision(playerRect, { x: booster.x, y: booster.y, width: 25, height: 25 })) {
      energyIncrease += 50; // Boosters give more energy than orbs
      toast("Energy booster collected! +50 energy!");
      return { ...booster, collected: true };
    }
    return booster;
  });
  
  return { updatedBoosters, energyIncrease };
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
