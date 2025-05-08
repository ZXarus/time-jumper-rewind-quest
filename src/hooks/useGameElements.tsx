
import { useState, useCallback, useRef } from "react";
import { Platform, Enemy, Hazard, EnergyOrb, Level, EnergyBooster } from "@/types/game";
import { updatePlatforms, updateEnemies } from "@/utils/gamePhysics";

export const useGameElements = () => {
  // Game elements
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [energyOrbs, setEnergyOrbs] = useState<EnergyOrb[]>([]);
  const [energyBoosters, setEnergyBoosters] = useState<EnergyBooster[]>([]);
  
  // Track which platform the player is standing on
  const playerPlatformRef = useRef<{platformId: string | undefined, playerState: any}>({
    platformId: undefined,
    playerState: null
  });
  
  // Update game elements
  const updateGameElements = useCallback((timestamp: number, playerState?: any) => {
    // Update platforms (for moving platforms) with player if needed
    if (playerState && playerPlatformRef.current.platformId && playerPlatformRef.current.platformId) {
      playerPlatformRef.current.playerState = playerState;
      setPlatforms(prevPlatforms => updatePlatforms(prevPlatforms, playerPlatformRef.current));
    } else {
      setPlatforms(prevPlatforms => updatePlatforms(prevPlatforms));
    }
    
    // Update enemies
    setEnemies(prevEnemies => updateEnemies(prevEnemies, timestamp));
  }, []);

  const loadLevelElements = useCallback((level: Level) => {
    // Reset the player platform reference
    playerPlatformRef.current = {
      platformId: undefined,
      playerState: null
    };
    
    setPlatforms([...level.platforms]);
    setEnemies([...level.enemies]);
    setHazards([...level.hazards]);
    setEnergyOrbs([...level.energyOrbs]);
    setEnergyBoosters(level.energyBoosters || []); // Add support for energy boosters
  }, []);
  
  // Update which platform the player is standing on
  const updatePlayerPlatform = useCallback((platformId?: string) => {
    playerPlatformRef.current.platformId = platformId;
  }, []);

  return {
    platforms,
    enemies,
    hazards,
    energyOrbs,
    energyBoosters,
    setEnergyOrbs,
    setEnergyBoosters,
    setPlatforms,
    setEnemies,
    setHazards,
    updateGameElements,
    loadLevelElements,
    updatePlayerPlatform
  };
};
