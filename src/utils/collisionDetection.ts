
import { PlayerState, Platform, Enemy, Hazard, EnergyOrb, Level, GameState, EnergyBooster } from "@/types/game";

// Import refactored collision utilities
import { handlePlatformCollisions } from "./collision/platformCollisions";
import { handleDangerCollisions, handleEmergencyRewind } from "./collision/dangerCollisions";
import { collectEnergyOrbs, collectEnergyBoosters, checkLevelCompletion } from "./collision/collectibles";

// Export everything for backward compatibility
export { 
  handlePlatformCollisions, 
  handleDangerCollisions,
  handleEmergencyRewind,
  collectEnergyOrbs,
  collectEnergyBoosters,
  checkLevelCompletion 
};
