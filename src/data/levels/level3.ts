
import { Level } from "@/types/game";
import { GAME_WIDTH, GAME_HEIGHT } from "@/constants/gameConstants";

const PLATFORM_HEIGHT = 20;

// Level 3 - Advanced
export const level3: Level = {
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  startPosition: { x: 50, y: 400 },
  endPosition: { x: 740, y: 50 },
  platforms: [
    // Starting platform
    { x: 0, y: 450, width: 120, height: PLATFORM_HEIGHT, type: "normal" },
    
    // Main path platforms
    { x: 170, y: 400, width: 80, height: PLATFORM_HEIGHT, type: "normal" },
    { x: 300, y: 350, width: 60, height: PLATFORM_HEIGHT, type: "crumbling" },
    { x: 400, y: 300, width: 100, height: PLATFORM_HEIGHT, type: "normal" },
    { x: 550, y: 250, width: 70, height: PLATFORM_HEIGHT, type: "crumbling" },
    { x: 670, y: 200, width: 60, height: PLATFORM_HEIGHT, type: "normal" },
    
    // End platform
    { x: 720, y: 100, width: 80, height: PLATFORM_HEIGHT, type: "normal" },
    
    // Alternative paths
    { x: 200, y: 320, width: 50, height: PLATFORM_HEIGHT, type: "normal" },
    { x: 270, y: 250, width: 50, height: PLATFORM_HEIGHT, type: "normal" },
    { x: 650, y: 350, width: 70, height: PLATFORM_HEIGHT, type: "normal" },
    
    // Moving platforms
    {
      x: 100, 
      y: 350, 
      width: 60, 
      height: PLATFORM_HEIGHT, 
      type: "moving",
      direction: "vertical",
      speed: 1.5,
      range: 80,
      initialPosition: { x: 100, y: 350 }
    },
    {
      x: 480, 
      y: 170, 
      width: 60, 
      height: PLATFORM_HEIGHT, 
      type: "moving",
      direction: "horizontal",
      speed: 2.2,
      range: 150,
      initialPosition: { x: 480, y: 170 }
    },
    {
      x: 580, 
      y: 150, 
      width: 60, 
      height: PLATFORM_HEIGHT, 
      type: "moving",
      direction: "vertical",
      speed: 1.8,
      range: 60,
      initialPosition: { x: 580, y: 150 }
    }
  ],
  enemies: [
    {
      x: 420, 
      y: 270, 
      width: 30, 
      height: 30, 
      type: "patrol",
      direction: "left",
      speed: 2,
      range: 80,
      initialPosition: { x: 420, y: 270 }
    },
    {
      x: 670, 
      y: 170, 
      width: 30, 
      height: 30, 
      type: "flying",
      direction: "left",
      speed: 1.5,
      range: 50,
      initialPosition: { x: 670, y: 170 }
    },
    {
      x: 300, 
      y: 150, 
      width: 35, 
      height: 35, 
      type: "flying",
      direction: "right",
      speed: 2,
      range: 150,
      initialPosition: { x: 300, y: 150 }
    }
  ],
  hazards: [
    { x: 120, y: 440, width: 50, height: 10, type: "spike" },
    { x: 250, y: 440, width: 150, height: 10, type: "spike" },
    { x: 450, y: 440, width: 200, height: 10, type: "spike" },
    { x: 360, y: 340, width: 10, height: 100, type: "laser" },
    { x: 730, y: 170, width: 40, height: 10, type: "spike" },
    { x: 480, y: 290, width: 20, height: 10, type: "fire" }
  ],
  energyOrbs: [
    { x: 200, y: 290, collected: false },
    { x: 270, y: 220, collected: false },
    { x: 450, y: 140, collected: false },
    { x: 650, y: 320, collected: false },
    { x: 740, y: 70, collected: false }
  ]
};
