
import { useEffect, useState } from "react";
import { Clock, Rewind } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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
          <Clock className="mr-2 text-game-energy" />
        )}
        <span className="text-white font-bold">Time Energy</span>
      </div>
      
      <div className="w-48 h-5 relative">
        <Progress 
          value={energyPercentage} 
          className={`h-5 ${
            isRewinding ? 'bg-gray-700' : 'bg-gray-700'
          }`}
        />
        <div 
          className={`absolute inset-0 bg-gradient-to-r ${
            isRewinding ? 'from-game-accent to-purple-300' : 'from-game-energy to-blue-300'
          } h-full rounded-full ${
            flashMeter && !isRewinding ? 'animate-pulse' : ''
          }`}
          style={{ 
            width: `${energyPercentage}%`,
            transition: 'width 0.3s ease'
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
          {Math.floor(energyPercentage)}%
        </div>
      </div>
    </div>
  );
};

export default EnergyMeter;
