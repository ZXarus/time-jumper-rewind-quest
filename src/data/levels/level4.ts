
import { Level } from "@/types/game";
import { GAME_WIDTH, GAME_HEIGHT } from "@/constants/gameConstants";

const PLATFORM_HEIGHT = 20;

// Level 4 - Urban Adventure
export const level4: Level = {
  startPosition: { x: 50, y: 400 },
  endPosition: { x: 730, y: 80 },
  platforms: [
    // Starting area
    { x: 0, y: 450, width: 130, height: PLATFORM_HEIGHT, type: "normal", id: "p4-1" },
    
    // Main path - building-like structures
    { x: 150, y: 420, width: 100, height: PLATFORM_HEIGHT, type: "normal", id: "p4-2" },
    { x: 280, y: 380, width: 80, height: PLATFORM_HEIGHT, type: "normal", id: "p4-3" },
    { x: 390, y: 340, width: 70, height: PLATFORM_HEIGHT, type: "crumbling", id: "p4-4" },
    { x: 490, y: 300, width: 90, height: PLATFORM_HEIGHT, type: "normal", id: "p4-5" },
    { x: 610, y: 250, width: 60, height: PLATFORM_HEIGHT, type: "normal", id: "p4-6" },
    
    // Upper structures
    { x: 200, y: 300, width: 70, height: PLATFORM_HEIGHT, type: "normal", id: "p4-7" },
    { x: 120, y: 240, width: 60, height: PLATFORM_HEIGHT, type: "normal", id: "p4-8" },
    { x: 300, y: 200, width: 80, height: PLATFORM_HEIGHT, type: "crumbling", id: "p4-9" },
    { x: 420, y: 150, width: 70, height: PLATFORM_HEIGHT, type: "normal", id: "p4-10" },
    { x: 530, y: 120, width: 100, height: PLATFORM_HEIGHT, type: "normal", id: "p4-11" },
    
    // End platform - rooftop
    { x: 700, y: 130, width: 100, height: PLATFORM_HEIGHT, type: "normal", id: "p4-12" },
    
    // Moving platforms (elevators)
    {
      x: 240, 
      y: 320, 
      width: 50, 
      height: PLATFORM_HEIGHT, 
      type: "moving",
      direction: "vertical",
      speed: 1.8,
      range: 120,
      initialPosition: { x: 240, y: 320 },
      id: "p4-13"
    },
    {
      x: 650, 
      y: 190, 
      width: 40, 
      height: PLATFORM_HEIGHT, 
      type: "moving",
      direction: "vertical",
      speed: 1.5,
      range: 60,
      initialPosition: { x: 650, y: 190 },
      id: "p4-14"
    }
  ],
  enemies: [
    {
      x: 510, 
      y: 270, 
      width: 30, 
      height: 50, 
      type: "patrol",
      direction: "left",
      speed: 1.5,
      range: 90,
      initialPosition: { x: 510, y: 270 },
      id: "e4-1"
    },
    {
      x: 350, 
      y: 170, 
      width: 30, 
      height: 50, 
      type: "flying",
      direction: "right",
      speed: 1.8,
      range: 80,
      initialPosition: { x: 350, y: 170 },
      id: "e4-2"
    },
    {
      x: 600, 
      y: 220, 
      width: 30, 
      height: 50, 
      type: "patrol",
      direction: "right",
      speed: 1.2,
      range: 60,
      initialPosition: { x: 600, y: 220 },
      id: "e4-3"
    }
  ],
  hazards: [
    { x: 130, y: 440, width: 20, height: 10, type: "spike", id: "h4-1" },
    { x: 360, y: 440, width: 130, height: 10, type: "spike", id: "h4-2" },
    { x: 580, y: 440, width: 100, height: 10, type: "spike", id: "h4-3" },
    { x: 380, y: 330, width: 10, height: 110, type: "laser", id: "h4-4" },
    { x: 550, y: 290, width: 30, height: 10, type: "fire", id: "h4-5" }
  ],
  energyOrbs: [
    { x: 200, y: 270, collected: false, id: "o4-1" },
    { x: 120, y: 210, collected: false, id: "o4-2" },
    { x: 300, y: 170, collected: false, id: "o4-3" },
    { x: 530, y: 90, collected: false, id: "o4-4" },
    { x: 730, y: 100, collected: false, id: "o4-5" }
  ],
  energyBoosters: [
    { x: 350, y: 300, collected: false, id: "eb4-1" },
    { x: 620, y: 100, collected: false, id: "eb4-2" }
  ]
};
