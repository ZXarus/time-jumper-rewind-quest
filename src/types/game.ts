
export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  x: number;
  y: number;
}

export interface GameState {
  paused: boolean;
  gameOver: boolean;
  victory: boolean;
  level: number;
  score: number;
}

export interface GameControls {
  left: boolean;
  right: boolean;
  jump: boolean;
  rewind: boolean;
}

export interface TimePosition extends Position {
  timestamp: number;
}

export interface PlayerState {
  position: Position;
  velocity: Velocity;
  width: number;
  height: number;
  isJumping: boolean;
  isGrounded: boolean;
  isDead: boolean;
  facingDirection: 'left' | 'right';
  timePositions: TimePosition[];
  energy: number;
  maxEnergy: number;
  isRewinding: boolean;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'normal' | 'moving' | 'crumbling';
  direction?: 'horizontal' | 'vertical';
  speed?: number;
  range?: number;
  initialPosition?: Position;
  id?: string; // Added ID field for platforms
}

export interface Enemy {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'patrol' | 'flying' | 'stationary';
  direction: 'left' | 'right';
  speed: number;
  range?: number;
  initialPosition?: Position;
  id?: string; // Added ID field for enemies
}

export interface Hazard {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'spike' | 'laser' | 'fire';
  id?: string; // Added ID field for hazards
}

export interface EnergyOrb {
  x: number;
  y: number;
  collected: boolean;
  id?: string; // Added ID field for orbs
}

export interface EnergyBooster {
  x: number;
  y: number;
  collected: boolean;
  id?: string;
}

export interface Level {
  platforms: Platform[];
  enemies: Enemy[];
  hazards: Hazard[];
  energyOrbs: EnergyOrb[];
  energyBoosters?: EnergyBooster[];
  startPosition: Position;
  endPosition: Position;
  // Remove width and height as they're not in the Level type
}
