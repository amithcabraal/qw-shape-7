import { useState, useEffect } from 'react';
import { GameGrid } from './components/GameGrid';
import { CurrentShape } from './components/CurrentShape';
import { Menu } from './components/Menu';
import { SplashScreen } from './components/SplashScreen';
import { GameState } from './lib/GameState';

export default function App() {
  const [gameState] = useState(() => new GameState(
    new URLSearchParams(window.location.search).get('seed') || undefined
  ));
  const [score, setScore] = useState(gameState.score);
  const [grid, setGrid] = useState(gameState.grid);
  const [currentShape, setCurrentShape] = useState(gameState.currentShape);
  const [nextShape, setNextShape] = useState(gameState.nextShape);
  const [gameOver, setGameOver] = useState(gameState.gameOver);
  const [lastShape, setLastShape] = useState(gameState.lastShape);
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [showSplash, setShowSplash] = useState(() => {
    return localStorage.getItem('shapeSorterSplashDismissed') !== 'true';
  });
  const [key, setKey] = useState(0);

  useEffect(() => {
    window.history.replaceState({}, '', `?seed=${gameState.seed}`);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleShapePlacement = async (x: number, y: number) => {
    if (!gameState.placeShape(x, y)) return;
    
    await new Promise(resolve => setTimeout(resolve, 400)); // Pause after drop
    
    const linesToClear = gameState.findLinesToClear();
    if (linesToClear.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 800)); // Increased delay for sequential animation
      gameState.clearLines(linesToClear);
    }
    
    gameState.nextTurn();
    
    setScore(gameState.score);
    setGrid([...gameState.grid]);
    setCurrentShape(gameState.currentShape);
    setNextShape(gameState.nextShape);
    setGameOver(gameState.gameOver);
    setLastShape(gameState.lastShape);
    setKey(prev => prev + 1);
  };

  const handleNewGame = () => {
    const newGameState = new GameState();
    window.history.replaceState({}, '', `?seed=${newGameState.seed}`);
    
    setScore(newGameState.score);
    setGrid([...newGameState.grid]);
    setCurrentShape(newGameState.currentShape);
    setNextShape(newGameState.nextShape);
    setGameOver(newGameState.gameOver);
    setLastShape(newGameState.lastShape);
    
    Object.assign(gameState, newGameState);
  };

  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}?seed=${gameState.seed}`;
    navigator.clipboard.writeText(url);
    alert('Game URL copied to clipboard!');
  };

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleDismissSplash = (dontShowAgain: boolean) => {
    if (dontShowAgain) {
      localStorage.setItem('shapeSorterSplashDismissed', 'true');
    }
    setShowSplash(false);
  };

  return (
    <>
      <Menu 
        onNewGame={handleNewGame}
        onShare={handleShare}
        onToggleTheme={handleToggleTheme}
        isDarkMode={isDarkMode}
      />

      {showSplash && (
        <SplashScreen onDismiss={handleDismissSplash} />
      )}

      <main className="pt-16 min-h-screen">
        <div className="max-w-6xl mx-auto px-4">
          <div className="score text-2xl font-bold mb-6 text-center">
            Score: {score}
          </div>
          
          <div className="flex flex-col md:flex-row items-start justify-center gap-8">
            <div className="game-grid-container flex-shrink-0">
              <GameGrid
                grid={grid}
                currentShape={currentShape}
                onCellDrop={handleShapePlacement}
              />
            </div>
            
            <div className="shapes-panel flex-shrink-0 min-w-[200px]">
              {!gameOver ? (
                <div className="flex gap-8 items-start">
                  <div className="current-shape slide-in" key={`current-${key}`}>
                    <h3 className="mb-2 text-lg font-semibold">Current:</h3>
                    <CurrentShape shape={currentShape} />
                  </div>
                  <div className="next-shape">
                    <h3 className="mb-2 text-sm font-semibold">Next:</h3>
                    <div className="scale-75 origin-top-left opacity-60">
                      <CurrentShape shape={nextShape} isDraggable={false} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="game-over bg-[var(--modal-bg)] p-5 rounded-lg text-center">
                  <h2 className="text-xl font-bold mb-3">Game Over!</h2>
                  <p className="mb-3">Final Score: {score}</p>
                  {lastShape && (
                    <div className="last-shape mb-5 p-3 bg-red-500/10 rounded">
                      <p className="mb-2">This shape couldn't be placed:</p>
                      <CurrentShape shape={lastShape} isDraggable={false} />
                    </div>
                  )}
                  <button
                    onClick={handleNewGame}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Play Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}