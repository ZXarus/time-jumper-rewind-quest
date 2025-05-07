
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { playSoundEffect } from "@/utils/soundEffects";

interface RestartButtonProps {
  onRestart: () => void;
}

const RestartButton: React.FC<RestartButtonProps> = ({ onRestart }) => {
  const handleClick = () => {
    playSoundEffect("restart");
    onRestart();
  };

  return (
    <Button
      onClick={handleClick}
      className="absolute left-3 top-3 z-10 bg-game-primary hover:bg-game-secondary flex items-center gap-1 px-3 py-1 text-sm rounded-md shadow-lg"
      title="Restart Level"
    >
      <RefreshCcw size={16} />
      <span>Restart</span>
    </Button>
  );
};

export default RestartButton;
