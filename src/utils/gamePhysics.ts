
import { Platform, Position, PlayerState, Enemy, Hazard, EnergyOrb } from "@/types/game";
import { GRAVITY, MAX_FALL_SPEED, PLAYER_SPEED, JUMP_FORCE, GAME_HEIGHT, GROUND_HEIGHT } from "@/constants/gameConstants";

// Check collision between two rectangles
export const checkCollision = (
  rect1: { x: number, y: number, width: number, height: number },
  rect2: { x: number, y: number, width: number, height: number }
) => {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
};

// Convert player state to rectangle format for collision detection
export const getPlayerRect = (player: PlayerState) => {
  return {
    x: player.position.x,
    y: player.position.y,
    width: player.width,
    height: player.height
  };
};

// Apply movement based on controls
export const applyMovement = (
  position: Position, 
  velocity: { x: number, y: number },
  controls: { left: boolean, right: boolean, jump: boolean },
  isGrounded: boolean,
  isJumping: boolean
) => {
  let newVelocity = { ...velocity };
  let newFacingDirection: 'left' | 'right' = velocity.x < 0 ? 'left' : 'right';
  
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
  if (controls.jump && isGrounded && !isJumping) {
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
  let newPosition = {
    x: position.x + newVelocity.x,
    y: position.y + newVelocity.y
  };
  
  // Check if player has reached the bottom of the screen (ground)
  if (newPosition.y + GROUND_HEIGHT >= GAME_HEIGHT) {
    newPosition.y = GAME_HEIGHT - GROUND_HEIGHT;
    newVelocity.y = 0;
    isGrounded = true;
  }
  
  return {
    position: newPosition,
    velocity: newVelocity,
    facingDirection: newFacingDirection,
    isGrounded,
    isJumping: newVelocity.y < 0
  };
};

// Update moving platforms
export const updatePlatforms = (platforms: Platform[]) => {
  return platforms.map(platform => {
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
};

// Update enemy positions
export const updateEnemies = (enemies: Enemy[], timestamp: number) => {
  return enemies.map(enemy => {
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
};
