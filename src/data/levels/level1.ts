
import { Level } from "@/types/game";
import { GAME_WIDTH, GAME_HEIGHT } from "@/constants/gameConstants";

const PLATFORM_HEIGHT = 20;

// Level 1 - Introduction
export const level1: Level = {
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  startPosition: { x: 50, y: 400 },
  endPosition: { x: 750, y: 100 },
  platforms: [
    // Starting platform
    { x: 0, y: 450, width: 200, height: PLATFORM_HEIGHT, type: "normal" },
    // Mid platforms
    { x: 250, y: 380, width: 120, height: PLATFORM_HEIGHT, type: "normal" },
    { x: 420, y: 320, width: 120, height: PLATFORM_HEIGHT, type: "normal" },
    { x: 600, y: 250, width: 120, height: PLATFORM_HEIGHT, type: "normal" },
    // End platform
    { x: 720, y: 150, width: 80, height: PLATFORM_HEIGHT, type: "normal" },
    
    // Moving platform
    {
      x: 300, 
      y: 200, 
      width: 80, 
      height: PLATFORM_HEIGHT, 
      type: "moving",
      direction: "horizontal",
      speed: 1.5,
      range: 150,
      initialPosition: { x: 300, y: 200 }
    }
  ],
  enemies: [
    {
      x: 450, 
      y: 290, 
      width: 30, 
      height: 30, 
      type: "patrol",
      direction: "right",
      speed: 1,
      range: 60,
      initialPosition: { x: 450, y: 290 }
    }
  ],
  hazards: [
    { x: 350, y: 440, width: 40, height: 10, type: "spike" },
    { x: 550, y: 440, width: 40, height: 10, type: "spike" },
    { x: 600, y: 440, width: 40, height: 10, type: "spike" }
  ],
  energyOrbs: [
    { x: 300, y: 350, collected: false },
    { x: 500, y: 290, collected: false },
    { x: 650, y: 220, collected: false }
  ]
};
