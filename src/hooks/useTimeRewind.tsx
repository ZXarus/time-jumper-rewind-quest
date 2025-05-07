
import { useCallback } from "react";
import { PlayerState } from "@/types/game";
import { rewindToLastPosition, findSafePosition } from "@/utils/timeRewind";
import { toast } from "sonner";

export const useTimeRewind = (
  player: PlayerState,
  setPlayer: (updater: React.SetStateAction<PlayerState>) => void
) => {
  // Handle rewinding time
  const handleRewind = useCallback((rewindActive: boolean) => {
    if (!rewindActive || player.energy <= 0 || player.timePositions.length === 0) {
      return false;
    }
    
    setPlayer(prevPlayer => {
      const rewindResult = rewindToLastPosition(prevPlayer);
      
      if (rewindResult.shouldStopRewinding || !rewindResult.newPosition) {
        return {
          ...prevPlayer,
          isRewinding: false,
          energy: rewindResult.newEnergy,
          timePositions: rewindResult.newTimePositions
        };
      }
      
      // Return to the previous position
      return {
        ...prevPlayer,
        position: rewindResult.newPosition,
        isDead: false,
        isRewinding: true,
        energy: rewindResult.newEnergy,
        timePositions: rewindResult.newTimePositions
      };
    });
    
    return true;
  }, [player.energy, player.timePositions.length, setPlayer]);

  // Handle emergency rewind after death
  const handleEmergencyRewind = useCallback(() => {
    if (player.timePositions.length === 0) {
      return false;
    }
    
    const safePosition = findSafePosition(player.timePositions);
    
    if (safePosition) {
      setTimeout(() => {
        setPlayer(prev => ({
          ...prev,
          position: { x: safePosition.x, y: safePosition.y },
          velocity: { x: 0, y: 0 },
          isDead: false,
          energy: 0, // Drain all energy for emergency rewind
          timePositions: player.timePositions.slice(0, player.timePositions.length - 20)
        }));
        
        toast("Emergency time rewind! Energy depleted!");
      }, 500);
      return true;
    }
    
    return false;
  }, [player.timePositions, setPlayer]);

  return {
    handleRewind,
    handleEmergencyRewind
  };
};
