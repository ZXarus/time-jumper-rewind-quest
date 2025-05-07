
// Game physics
export const GRAVITY = 0.5;
export const JUMP_FORCE = -13;
export const PLAYER_SPEED = 5;
export const MAX_FALL_SPEED = 15;

// Time control
export const MAX_ENERGY = 100;
export const ENERGY_REGEN_RATE = 0.2;
export const REWIND_ENERGY_COST = 1;
export const TIME_POSITION_RECORD_INTERVAL = 3; // Record position every X frames
export const MAX_TIME_POSITIONS = 300; // Store last 5 seconds @ 60fps

// Game dimensions
export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 500;

// Player dimensions
export const PLAYER_WIDTH = 30;
export const PLAYER_HEIGHT = 50;

// Level settings
export const LEVEL_COUNT = 3;

// Game colors (for canvas rendering)
export const COLORS = {
  background: '#1A1F2C',
  player: '#9b87f5',
  playerRewind: '#D946EF',
  platform: '#403E43',
  enemy: '#ea384c',
  hazard: '#ea384c',
  energyOrb: '#0EA5E9',
  timeTrail: 'rgba(155, 135, 245, 0.3)',
  text: '#FFFFFF',
  energy: '#0EA5E9',
  energyBg: '#403E43',
  trajectory: '#D946EF',
};
