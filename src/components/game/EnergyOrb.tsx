
import { EnergyOrb as EnergyOrbType } from "@/types/game";

interface EnergyOrbProps {
  energyOrb: EnergyOrbType;
}

const EnergyOrb: React.FC<EnergyOrbProps> = ({ energyOrb }) => {
  const { x, y, collected } = energyOrb;
  
  if (collected) return null;
  
  return (
    <div 
      className="energy-orb"
      style={{
        left: x + 5, // Center adjustment
        top: y + 5,  // Center adjustment
      }}
    />
  );
};

export default EnergyOrb;
