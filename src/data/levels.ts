
import { Level } from "@/types/game";
import { GAME_WIDTH, GAME_HEIGHT } from "@/constants/gameConstants";

const PLATFORM_HEIGHT = 20;

export const levels: Level[] = [
  // Level 1 - Introduction
  {
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
  },
  
  // Level 2 - More challenges
  {
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
  },
  
  // Level 3 - Advanced
  {
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
  }
];

