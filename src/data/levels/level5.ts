
import { Level } from "@/types/game";
import { GAME_WIDTH, GAME_HEIGHT } from "@/constants/gameConstants";

const PLATFORM_HEIGHT = 20;

// Level 5 - Factory Challenge
export const level5: Level = {
  startPosition: { x: 50, y: 400 },
  endPosition: { x: 740, y: 70 },
  platforms: [
    // Starting platform
    { x: 0, y: 450, width: 120, height: PLATFORM_HEIGHT, type: "normal", id: "p5-1" },
    
    // Factory floor
    { x: 150, y: 420, width: 60, height: PLATFORM_HEIGHT, type: "crumbling", id: "p5-2" },
    { x: 240, y: 390, width: 70, height: PLATFORM_HEIGHT, type: "normal", id: "p5-3" },
    { x: 350, y: 420, width: 80, height: PLATFORM_HEIGHT, type: "crumbling", id: "p5-4" },
    { x: 460, y: 390, width: 60, height: PLATFORM_HEIGHT, type: "normal", id: "p5-5" },
    
    // Mid section - machinery
    { x: 550, y: 350, width: 50, height: PLATFORM_HEIGHT, type: "normal", id: "p5-6" },
    { x: 630, y: 310, width: 60, height: PLATFORM_HEIGHT, type: "crumbling", id: "p5-7" },
    { x: 720, y: 270, width: 80, height: PLATFORM_HEIGHT, type: "normal", id: "p5-8" },
    
    // Upper section - catwalks
    { x: 650, y: 210, width: 60, height: PLATFORM_HEIGHT, type: "normal", id: "p5-9" },
    { x: 550, y: 170, width: 70, height: PLATFORM_HEIGHT, type: "crumbling", id: "p5-10" },
    { x: 430, y: 190, width: 80, height: PLATFORM_HEIGHT, type: "normal", id: "p5-11" },
    { x: 320, y: 150, width: 70, height: PLATFORM_HEIGHT, type: "normal", id: "p5-12" },
    { x: 200, y: 180, width: 80, height: PLATFORM_HEIGHT, type: "crumbling", id: "p5-13" },
    
    // Final approach
    { x: 260, y: 110, width: 40, height: PLATFORM_HEIGHT, type: "normal", id: "p5-14" },
    { x: 370, y: 90, width: 60, height: PLATFORM_HEIGHT, type: "normal", id: "p5-15" },
    { x: 480, y: 80, width: 50, height: PLATFORM_HEIGHT, type: "crumbling", id: "p5-16" },
    { x: 580, y: 70, width: 40, height: PLATFORM_HEIGHT, type: "normal", id: "p5-17" },
    { x: 680, y: 100, width: 90, height: PLATFORM_HEIGHT, type: "normal", id: "p5-18" },
    
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
      initialPosition: { x: 150, y: 280 },
      id: "p5-19"
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
      initialPosition: { x: 400, y: 300 },
      id: "p5-20"
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
      initialPosition: { x: 600, y: 140 },
      id: "p5-21"
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
      initialPosition: { x: 280, y: 360 },
      id: "e5-1"
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
      initialPosition: { x: 450, y: 160 },
      id: "e5-2"
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
      initialPosition: { x: 730, y: 240 },
      id: "e5-3"
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
      initialPosition: { x: 480, y: 50 },
      id: "e5-4"
    }
  ],
  hazards: [
    { x: 120, y: 440, width: 30, height: 10, type: "spike", id: "h5-1" },
    { x: 210, y: 440, width: 140, height: 10, type: "spike", id: "h5-2" },
    { x: 430, y: 440, width: 120, height: 10, type: "spike", id: "h5-3" },
    { x: 580, y: 440, width: 220, height: 10, type: "spike", id: "h5-4" },
    { x: 600, y: 300, width: 10, height: 140, type: "laser", id: "h5-5" },
    { x: 200, y: 150, width: 40, height: 30, type: "fire", id: "h5-6" },
    { x: 520, y: 350, width: 30, height: 10, type: "fire", id: "h5-7" },
    { x: 700, y: 240, width: 20, height: 30, type: "fire", id: "h5-8" }
  ],
  energyOrbs: [
    { x: 240, y: 360, collected: false, id: "o5-1" },
    { x: 460, y: 360, collected: false, id: "o5-2" },
    { x: 550, y: 320, collected: false, id: "o5-3" },
    { x: 650, y: 180, collected: false, id: "o5-4" },
    { x: 320, y: 120, collected: false, id: "o5-5" },
    { x: 580, y: 40, collected: false, id: "o5-6" }
  ],
  energyBoosters: [
    { x: 200, y: 250, collected: false, id: "eb5-1" },
    { x: 500, y: 160, collected: false, id: "eb5-2" },
    { x: 680, y: 40, collected: false, id: "eb5-3" }
  ]
};
