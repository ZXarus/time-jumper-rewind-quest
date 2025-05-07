
import React from "react";

const GameControls: React.FC = () => {
  return (
    <div className="bg-game-bg text-white p-4 rounded-lg mb-8 max-w-md shadow-lg border border-game-tertiary/30">
      <h2 className="text-xl font-bold mb-2 text-game-accent">Controls</h2>
      <ul className="space-y-2 text-sm">
        <li><span className="font-bold text-game-primary">Move:</span> A/D or Arrow Keys</li>
        <li><span className="font-bold text-game-primary">Jump:</span> W, Space or Up Arrow</li>
        <li><span className="font-bold text-game-primary">Rewind Time:</span> Hold R (requires energy)</li>
        <li><span className="font-bold text-game-primary">Pause:</span> Escape</li>
        <li><span className="font-bold text-game-primary">Restart:</span> Click restart button</li>
      </ul>
      <p className="mt-4 text-sm">
        <span className="font-bold text-game-accent">Pro Tip:</span> If you die with full energy, 
        you'll automatically rewind to safety!
      </p>
    </div>
  );
};

export default GameControls;
