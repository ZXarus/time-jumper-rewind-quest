
import { PlayerState, EnergyOrb, EnergyBooster } from "@/types/game";
import { checkCollision, getPlayerRect } from "../gamePhysics";
import { toast } from "sonner";

// Handle energy orb collection
export const collectEnergyOrbs = (
  player: PlayerState,
  energyOrbs: EnergyOrb[],
  onScoreIncrease: (amount: number) => void
): { updatedOrbs: EnergyOrb[], energyIncrease: number } => {
  let scoreIncrease = 0;
  let energyIncrease = 0;
  const playerRect = getPlayerRect(player);

  const updatedOrbs = energyOrbs.map(orb => {
    if (!orb.collected && checkCollision(playerRect, { x: orb.x, y: orb.y, width: 15, height: 15 })) {
      scoreIncrease += 10;
      energyIncrease += 20;
      toast("Energy orb collected!");
      return { ...orb, collected: true };
    }
    return orb;
  });
  
  if (scoreIncrease > 0) {
    onScoreIncrease(scoreIncrease);
  }
  
  return { updatedOrbs, energyIncrease };
};

// Handle energy booster collection
export const collectEnergyBoosters = (
  player: PlayerState,
  boosters: EnergyBooster[],
): { updatedBoosters: EnergyBooster[], energyIncrease: number } => {
  let energyIncrease = 0;
  const playerRect = getPlayerRect(player);

  const updatedBoosters = boosters.map(booster => {
    if (!booster.collected && checkCollision(playerRect, { x: booster.x, y: booster.y, width: 25, height: 25 })) {
      energyIncrease += 50; // Boosters give more energy than orbs
      toast("Energy booster collected! +50 energy!");
      return { ...booster, collected: true };
    }
    return booster;
  });
  
  return { updatedBoosters, energyIncrease };
};

// Check if player reached level end
export const checkLevelCompletion = (
  player: PlayerState,
  endPosition: { x: number, y: number },
  onVictory: () => void
): boolean => {
  const endPositionHitbox = {
    x: endPosition.x - 10,
    y: endPosition.y - 10,
    width: 30,
    height: 30
  };
  
  const playerRect = getPlayerRect(player);
  
  if (checkCollision(playerRect, endPositionHitbox)) {
    onVictory();
    return true;
  }
  
  return false;
};
