
import { useCallback } from "react";
import { PlayerState, Platform, Enemy, Hazard, EnergyOrb, Level, GameState, EnergyBooster } from "@/types/game";
import { handlePlatformCollisions, handleDangerCollisions, collectEnergyOrbs, collectEnergyBoosters, checkLevelCompletion } from "@/utils/collisionDetection";

export const useCollisionDetection = (
  player: PlayerState,
  setPlayer: (updater: React.SetStateAction<PlayerState>) => void,
  platforms: Platform[],
  enemies: Enemy[],
  hazards: Hazard[],
  energyOrbs: EnergyOrb[],
  energyBoosters: EnergyBooster[],
  setEnergyOrbs: (updater: React.SetStateAction<EnergyOrb[]>) => void,
  setEnergyBoosters: (updater: React.SetStateAction<EnergyBooster[]>) => void,
  updatePlayerPlatform: (platformId?: string) => void,
  currentLevel: Level,
  gameState: GameState,
  setGameState: (updater: React.SetStateAction<GameState>) => void,
  handleGameOver: () => void,
  handleVictory: () => void,
  handleEmergencyRewind: () => boolean
) => {
  const checkCollisions = useCallback(() => {
    // Skip collision detection if game is paused/over/victory or player is rewinding
    if (gameState.paused || gameState.gameOver || gameState.victory || player.isRewinding) {
      return;
    }
    
    // Platform collisions - now returns platformId if player is standing on a platform
    const platformResult = handlePlatformCollisions(player, platforms);
    if (platformResult.isGrounded !== player.isGrounded || 
        platformResult.newPlayerState.position?.y !== player.position.y ||
        platformResult.newPlayerState.position?.x !== player.position.x) {
      setPlayer(prev => ({
        ...prev,
        ...platformResult.newPlayerState
      }));
    }
    
    // Update which platform the player is standing on (for moving platforms)
    updatePlayerPlatform(platformResult.platformId);
    
    // Enemy and hazard collisions
    const dangerResult = handleDangerCollisions(player, enemies, hazards, handleGameOver);
    if (dangerResult.isDead && !player.isDead) {
      setPlayer(prev => ({ ...prev, isDead: true }));
      
      // Auto-rewind if player has sufficient energy
      if (dangerResult.shouldEmergencyRewind) {
        const didRewind = handleEmergencyRewind();
        
        if (!didRewind) {
          setTimeout(() => handleGameOver(), 1000);
        }
      } else {
        setTimeout(() => handleGameOver(), 1000);
      }
    }
    
    // Energy orb collection
    const orbResult = collectEnergyOrbs(
      player, 
      energyOrbs,
      (amount) => {
        setGameState(prev => ({ ...prev, score: prev.score + amount }));
      }
    );
    
    if (orbResult.energyIncrease > 0) {
      setPlayer(prev => ({
        ...prev,
        energy: Math.min(prev.maxEnergy, prev.energy + orbResult.energyIncrease)
      }));
      setEnergyOrbs(orbResult.updatedOrbs);
    }
    
    // Energy booster collection
    const boosterResult = collectEnergyBoosters(player, energyBoosters);
    
    if (boosterResult.energyIncrease > 0) {
      setPlayer(prev => ({
        ...prev,
        energy: Math.min(prev.maxEnergy, prev.energy + boosterResult.energyIncrease)
      }));
      setEnergyBoosters(boosterResult.updatedBoosters);
    }
    
    // Check victory condition (player reached end position)
    checkLevelCompletion(player, currentLevel.endPosition, handleVictory);
  }, [
    player, 
    platforms, 
    enemies, 
    hazards, 
    energyOrbs,
    energyBoosters, 
    currentLevel, 
    gameState,
    setPlayer,
    setEnergyOrbs,
    setEnergyBoosters,
    setGameState,
    updatePlayerPlatform,
    handleGameOver,
    handleVictory,
    handleEmergencyRewind
  ]);

  return { checkCollisions };
};
