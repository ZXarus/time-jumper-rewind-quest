
import { Button } from "@/components/ui/button";
import { GameState } from "@/types/game";

interface GameStatusProps {
  gameState: GameState;
  onRestart: () => void;
  onNextLevel: () => void;
}

const GameStatus: React.FC<GameStatusProps> = ({ 
  gameState, 
  onRestart,
  onNextLevel
}) => {
  const { paused, gameOver, victory, level, score } = gameState;
  
  if (gameOver) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-10">
        <h2 className="text-4xl text-white font-bold mb-4">Game Over!</h2>
        <p className="text-xl text-white mb-8">Your score: {score}</p>
        <Button 
          variant="default" 
          onClick={onRestart}
          className="bg-game-primary hover:bg-game-secondary text-white"
        >
          Try Again
        </Button>
      </div>
    );
  }
  
  if (victory) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-10">
        <h2 className="text-4xl text-white font-bold mb-4">Level Complete!</h2>
        <p className="text-xl text-white mb-8">Your score: {score}</p>
        <div className="flex gap-4">
          <Button 
            variant="default" 
            onClick={onNextLevel}
            className="bg-game-primary hover:bg-game-secondary text-white"
          >
            Next Level
          </Button>
          <Button 
            variant="outline" 
            onClick={onRestart}
            className="border-game-primary text-game-primary hover:bg-game-primary hover:text-white"
          >
            Replay Level
          </Button>
        </div>
      </div>
    );
  }
  
  if (paused) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-10">
        <h2 className="text-4xl text-white font-bold mb-4">Paused</h2>
        <Button 
          variant="default" 
          onClick={onRestart}
          className="bg-game-primary hover:bg-game-secondary text-white"
        >
          Resume
        </Button>
      </div>
    );
  }
  
  return (
    <div className="absolute top-4 right-4 flex flex-col items-end">
      <div className="text-white font-bold">Level: {level}</div>
      <div className="text-white font-bold">Score: {score}</div>
    </div>
  );
};

export default GameStatus;
