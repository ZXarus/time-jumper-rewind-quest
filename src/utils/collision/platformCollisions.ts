
import { PlayerState, Platform, Position } from "@/types/game";
import { checkCollision, getPlayerRect } from "../gamePhysics";

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
    
    // Check side collisions if not grounded
    if (!isGrounded) {
      handleSidePlatformCollisions(player, platform, newPosition);
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

// Helper function to handle side collisions with platforms
const handleSidePlatformCollisions = (
  player: PlayerState, 
  platform: Platform,
  newPosition: Position
) => {
  const platformRect = { 
    x: platform.x, 
    y: platform.y, 
    width: platform.width, 
    height: platform.height 
  };
  
  const playerRect = getPlayerRect(player);
  
  if (checkCollision(playerRect, platformRect)) {
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
};
