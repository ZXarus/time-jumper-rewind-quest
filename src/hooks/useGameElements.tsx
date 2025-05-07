
import { useState, useCallback } from "react";
import { Platform, Enemy, Hazard, EnergyOrb, Level } from "@/types/game";
import { updatePlatforms, updateEnemies } from "@/utils/gamePhysics";

export const useGameElements = () => {
  // Game elements
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [energyOrbs, setEnergyOrbs] = useState<EnergyOrb[]>([]);
  
  // Update game elements
  const updateGameElements = useCallback((timestamp: number) => {
    // Update platforms (for moving platforms)
    setPlatforms(prevPlatforms => updatePlatforms(prevPlatforms));
    
    // Update enemies
    setEnemies(prevEnemies => updateEnemies(prevEnemies, timestamp));
  }, []);

  const loadLevelElements = useCallback((level: Level) => {
    setPlatforms([...level.platforms]);
    setEnemies([...level.enemies]);
    setHazards([...level.hazards]);
    setEnergyOrbs([...level.energyOrbs]);
  }, []);

  return {
    platforms,
    enemies,
    hazards,
    energyOrbs,
    setEnergyOrbs,
    setPlatforms,
    setEnemies,
    setHazards,
    updateGameElements,
    loadLevelElements
  };
};
