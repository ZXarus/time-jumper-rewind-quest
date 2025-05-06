
import { useEffect, useState } from "react";
import { Motion, Rewind } from "lucide-react";

interface EnergyMeterProps {
  currentEnergy: number;
  maxEnergy: number;
  isRewinding: boolean;
}

const EnergyMeter: React.FC<EnergyMeterProps> = ({ 
  currentEnergy, 
  maxEnergy,
  isRewinding
}) => {
  const [flashMeter, setFlashMeter] = useState(false);
  
  // Flash the meter when energy is low
  useEffect(() => {
    if (currentEnergy < maxEnergy * 0.2) {
      const interval = setInterval(() => {
        setFlashMeter(prev => !prev);
      }, 500);
      
      return () => clearInterval(interval);
    } else {
      setFlashMeter(false);
    }
  }, [currentEnergy, maxEnergy]);

  const energyPercentage = (currentEnergy / maxEnergy) * 100;
  
  return (
    <div className="absolute top-4 left-4 flex flex-col items-start">
      <div className="flex items-center mb-2">
        {isRewinding ? (
          <Rewind className="mr-2 text-game-accent" />
        ) : (
          <Motion className="mr-2 text-game-energy" />
        )}
        <span className="text-white font-bold">Time Energy</span>
      </div>
      
      <div className="w-48 h-5 bg-game-platform rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${
            isRewinding ? 'bg-game-accent' : 'bg-game-energy'
          } ${
            flashMeter && !isRewinding ? 'animate-pulse' : ''
          }`}
          style={{ width: `${energyPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default EnergyMeter;
