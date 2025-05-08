
import { Level } from "@/types/game";
import { GAME_WIDTH, GAME_HEIGHT } from "@/constants/gameConstants";

const PLATFORM_HEIGHT = 20;

// Level 3 - Advanced
export const level3: Level = {
  startPosition: { x: 50, y: 400 },
  endPosition: { x: 740, y: 50 },
  platforms: [
    // Starting platform
    { x: 0, y: 450, width: 120, height: PLATFORM_HEIGHT, type: "normal", id: "p3-1" },
    
    // Main path platforms
    { x: 170, y: 400, width: 80, height: PLATFORM_HEIGHT, type: "normal", id: "p3-2" },
    { x: 300, y: 350, width: 60, height: PLATFORM_HEIGHT, type: "crumbling", id: "p3-3" },
    { x: 400, y: 300, width: 100, height: PLATFORM_HEIGHT, type: "normal", id: "p3-4" },
    { x: 550, y: 250, width: 70, height: PLATFORM_HEIGHT, type: "crumbling", id: "p3-5" },
    { x: 670, y: 200, width: 60, height: PLATFORM_HEIGHT, type: "normal", id: "p3-6" },
    
    // End platform
    { x: 720, y: 100, width: 80, height: PLATFORM_HEIGHT, type: "normal", id: "p3-7" },
    
    // Alternative paths
    { x: 200, y: 320, width: 50, height: PLATFORM_HEIGHT, type: "normal", id: "p3-8" },
    { x: 270, y: 250, width: 50, height: PLATFORM_HEIGHT, type: "normal", id: "p3-9" },
    { x: 650, y: 350, width: 70, height: PLATFORM_HEIGHT, type: "normal", id: "p3-10" },
    
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
      initialPosition: { x: 100, y: 350 },
      id: "p3-11"
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
      initialPosition: { x: 480, y: 170 },
      id: "p3-12"
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
      initialPosition: { x: 580, y: 150 },
      id: "p3-13"
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
      initialPosition: { x: 420, y: 270 },
      id: "e3-1"
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
      initialPosition: { x: 670, y: 170 },
      id: "e3-2"
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
      initialPosition: { x: 300, y: 150 },
      id: "e3-3"
    }
  ],
  hazards: [
    { x: 120, y: 440, width: 50, height: 10, type: "spike", id: "h3-1" },
    { x: 250, y: 440, width: 150, height: 10, type: "spike", id: "h3-2" },
    { x: 450, y: 440, width: 200, height: 10, type: "spike", id: "h3-3" },
    { x: 360, y: 340, width: 10, height: 100, type: "laser", id: "h3-4" },
    { x: 730, y: 170, width: 40, height: 10, type: "spike", id: "h3-5" },
    { x: 480, y: 290, width: 20, height: 10, type: "fire", id: "h3-6" }
  ],
  energyOrbs: [
    { x: 200, y: 290, collected: false, id: "o3-1" },
    { x: 270, y: 220, collected: false, id: "o3-2" },
    { x: 450, y: 140, collected: false, id: "o3-3" },
    { x: 650, y: 320, collected: false, id: "o3-4" },
    { x: 740, y: 70, collected: false, id: "o3-5" }
  ],
  energyBoosters: [
    { x: 350, y: 270, collected: false, id: "eb3-1" },
    { x: 600, y: 120, collected: false, id: "eb3-2" }
  ]
};
