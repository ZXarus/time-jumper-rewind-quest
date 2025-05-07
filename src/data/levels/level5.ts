
import { Level } from "@/types/game";
import { GAME_WIDTH, GAME_HEIGHT } from "@/constants/gameConstants";

const PLATFORM_HEIGHT = 20;

// Level 5 - Factory Challenge
export const level5: Level = {
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  startPosition: { x: 50, y: 400 },
  endPosition: { x: 740, y: 70 },
  platforms: [
    // Starting platform
    { x: 0, y: 450, width: 120, height: PLATFORM_HEIGHT, type: "normal" },
    
    // Factory floor
    { x: 150, y: 420, width: 60, height: PLATFORM_HEIGHT, type: "crumbling" },
    { x: 240, y: 390, width: 70, height: PLATFORM_HEIGHT, type: "normal" },
    { x: 350, y: 420, width: 80, height: PLATFORM_HEIGHT, type: "crumbling" },
    { x: 460, y: 390, width: 60, height: PLATFORM_HEIGHT, type: "normal" },
    
    // Mid section - machinery
    { x: 550, y: 350, width: 50, height: PLATFORM_HEIGHT, type: "normal" },
    { x: 630, y: 310, width: 60, height: PLATFORM_HEIGHT, type: "crumbling" },
    { x: 720, y: 270, width: 80, height: PLATFORM_HEIGHT, type: "normal" },
    
    // Upper section - catwalks
    { x: 650, y: 210, width: 60, height: PLATFORM_HEIGHT, type: "normal" },
    { x: 550, y: 170, width: 70, height: PLATFORM_HEIGHT, type: "crumbling" },
    { x: 430, y: 190, width: 80, height: PLATFORM_HEIGHT, type: "normal" },
    { x: 320, y: 150, width: 70, height: PLATFORM_HEIGHT, type: "normal" },
    { x: 200, y: 180, width: 80, height: PLATFORM_HEIGHT, type: "crumbling" },
    
    // Final approach
    { x: 260, y: 110, width: 40, height: PLATFORM_HEIGHT, type: "normal" },
    { x: 370, y: 90, width: 60, height: PLATFORM_HEIGHT, type: "normal" },
    { x: 480, y: 80, width: 50, height: PLATFORM_HEIGHT, type: "crumbling" },
    { x: 580, y: 70, width: 40, height: PLATFORM_HEIGHT, type: "normal" },
    { x: 680, y: 100, width: 90, height: PLATFORM_HEIGHT, type: "normal" },
    
    // Moving platforms (machinery)
    {
      x: 150, 
      y: 280, 
      width: 60, 
      height: PLATFORM_HEIGHT, 
      type: "moving",
      direction: "horizontal",
      speed: 2,
      range: 160,
      initialPosition: { x: 150, y: 280 }
    },
    {
      x: 400, 
      y: 300, 
      width: 50, 
      height: PLATFORM_HEIGHT, 
      type: "moving",
      direction: "vertical",
      speed: 1.8,
      range: 90,
      initialPosition: { x: 400, y: 300 }
    },
    {
      x: 600, 
      y: 140, 
      width: 40, 
      height: PLATFORM_HEIGHT, 
      type: "moving",
      direction: "horizontal",
      speed: 2.2,
      range: 100,
      initialPosition: { x: 600, y: 140 }
    }
  ],
  enemies: [
    {
      x: 280, 
      y: 360, 
      width: 30, 
      height: 50, 
      type: "patrol",
      direction: "left",
      speed: 1.5,
      range: 70,
      initialPosition: { x: 280, y: 360 }
    },
    {
      x: 450, 
      y: 160, 
      width: 30, 
      height: 50, 
      type: "flying",
      direction: "right",
      speed: 1.8,
      range: 120,
      initialPosition: { x: 450, y: 160 }
    },
    {
      x: 730, 
      y: 240, 
      width: 30, 
      height: 50, 
      type: "patrol",
      direction: "left",
      speed: 2,
      range: 80,
      initialPosition: { x: 730, y: 240 }
    },
    {
      x: 480, 
      y: 50, 
      width: 30, 
      height: 50, 
      type: "flying",
      direction: "right",
      speed: 2.2,
      range: 150,
      initialPosition: { x: 480, y: 50 }
    }
  ],
  hazards: [
    { x: 120, y: 440, width: 30, height: 10, type: "spike" },
    { x: 210, y: 440, width: 140, height: 10, type: "spike" },
    { x: 430, y: 440, width: 120, height: 10, type: "spike" },
    { x: 580, y: 440, width: 220, height: 10, type: "spike" },
    { x: 600, y: 300, width: 10, height: 140, type: "laser" },
    { x: 200, y: 150, width: 40, height: 30, type: "fire" },
    { x: 520, y: 350, width: 30, height: 10, type: "fire" },
    { x: 700, y: 240, width: 20, height: 30, type: "fire" },
  ],
  energyOrbs: [
    { x: 240, y: 360, collected: false },
    { x: 460, y: 360, collected: false },
    { x: 550, y: 320, collected: false },
    { x: 650, y: 180, collected: false },
    { x: 320, y: 120, collected: false },
    { x: 580, y: 40, collected: false }
  ]
};
