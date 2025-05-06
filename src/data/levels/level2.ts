
import { Level } from "@/types/game";
import { GAME_WIDTH, GAME_HEIGHT } from "@/constants/gameConstants";

const PLATFORM_HEIGHT = 20;

// Level 2 - More challenges
export const level2: Level = {
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  startPosition: { x: 50, y: 400 },
  endPosition: { x: 750, y: 100 },
  platforms: [
    // Starting platform
    { x: 0, y: 450, width: 150, height: PLATFORM_HEIGHT, type: "normal" },
    
    // Mid platforms
    { x: 200, y: 400, width: 100, height: PLATFORM_HEIGHT, type: "crumbling" },
    { x: 350, y: 350, width: 100, height: PLATFORM_HEIGHT, type: "normal" },
    { x: 500, y: 300, width: 80, height: PLATFORM_HEIGHT, type: "crumbling" },
    { x: 630, y: 250, width: 80, height: PLATFORM_HEIGHT, type: "normal" },
    
    // End platform
    { x: 720, y: 150, width: 80, height: PLATFORM_HEIGHT, type: "normal" },
    
    // Moving platforms
    {
      x: 150, 
      y: 300, 
      width: 60, 
      height: PLATFORM_HEIGHT, 
      type: "moving",
      direction: "vertical",
      speed: 1,
      range: 100,
      initialPosition: { x: 150, y: 300 }
    },
    {
      x: 450, 
      y: 200, 
      width: 60, 
      height: PLATFORM_HEIGHT, 
      type: "moving",
      direction: "horizontal",
      speed: 2,
      range: 100,
      initialPosition: { x: 450, y: 200 }
    }
  ],
  enemies: [
    {
      x: 380, 
      y: 320, 
      width: 30, 
      height: 30, 
      type: "patrol",
      direction: "right",
      speed: 1.5,
      range: 80,
      initialPosition: { x: 380, y: 320 }
    },
    {
      x: 650, 
      y: 220, 
      width: 30, 
      height: 30, 
      type: "flying",
      direction: "left",
      speed: 1,
      range: 50,
      initialPosition: { x: 650, y: 220 }
    }
  ],
  hazards: [
    { x: 290, y: 440, width: 220, height: 10, type: "spike" },
    { x: 550, y: 440, width: 160, height: 10, type: "spike" },
    { x: 600, y: 340, width: 30, height: 100, type: "laser" }
  ],
  energyOrbs: [
    { x: 250, y: 370, collected: false },
    { x: 450, y: 270, collected: false },
    { x: 580, y: 220, collected: false },
    { x: 700, y: 120, collected: false }
  ]
};
