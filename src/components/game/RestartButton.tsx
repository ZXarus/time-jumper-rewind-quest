
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
      className="absolute left-3 top-3 z-10 bg-game-accent hover:bg-game-accent/80 flex items-center gap-1 px-3 py-1 text-sm rounded-md shadow-lg transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(217,70,239,0.5)]"
      title="Restart Level"
    >
      <RefreshCcw size={16} className="animate-pulse" />
      <span>Restart</span>
    </Button>
  );
};

export default RestartButton;
