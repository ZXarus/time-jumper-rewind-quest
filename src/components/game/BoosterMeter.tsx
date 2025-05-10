
import { useState, useEffect } from "react";
import { Battery, BatteryCharging } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface BoosterMeterProps {
  collected: boolean;
  boosterCount: number;
  maxBoosters: number;
}

const BoosterMeter: React.FC<BoosterMeterProps> = ({ 
  collected, 
  boosterCount,
  maxBoosters
}) => {
  const [showEffect, setShowEffect] = useState(false);
  
  // Animation when collecting a booster
  useEffect(() => {
    if (collected) {
      setShowEffect(true);
      const timer = setTimeout(() => {
        setShowEffect(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [collected, boosterCount]);

  const boosterPercentage = (boosterCount / maxBoosters) * 100;
  
  return (
    <div className="absolute top-16 left-4 flex flex-col items-start">
      <div className="flex items-center mb-2">
        {showEffect ? (
          <BatteryCharging className="mr-2 text-green-400 animate-pulse" />
        ) : (
          <Battery className="mr-2 text-green-400" />
        )}
        <span className="text-white font-bold">Boosters</span>
      </div>
      
      <div className="w-48 h-5 relative">
        <Progress 
          value={boosterPercentage} 
          className="h-5 bg-gray-700"
        />
        <div 
          className={`absolute inset-0 flex items-center justify-start px-2 text-xs font-medium text-white ${
            showEffect ? 'animate-pulse' : ''
          }`}
          style={{
            textShadow: '1px 1px 2px rgba(0,0,0,0.6)'
          }}
        >
          {boosterCount}/{maxBoosters} Collected
        </div>
      </div>
    </div>
  );
};

export default BoosterMeter;
