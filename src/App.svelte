<script lang="ts">
  import { onMount } from 'svelte';
  import GameGrid from './lib/GameGrid.svelte';
  import CurrentShape from './lib/CurrentShape.svelte';
  import Menu from './lib/Menu.svelte';
  import { GameState } from './lib/GameState';
  import type { Position } from './lib/types';

  let gameState = new GameState(
    new URLSearchParams(window.location.search).get('seed') || undefined
  );
  let gameGridComponent: GameGrid;
  let isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  async function handleShapePlacement(x: number, y: number) {
    if (!gameState.placeShape(x, y)) return;
    
    const linesToClear = gameState.findLinesToClear();
    if (linesToClear.length > 0) {
      await gameGridComponent.markCellsForClearing(linesToClear);
      gameState.clearLines(linesToClear);
    }
    
    gameState.nextTurn();
    gameState = gameState; // Trigger reactivity
  }

  function handleDragStart(offset: Position) {
    gameGridComponent.setDragOffset(offset);
  }

  function handleNewGame() {
    gameState = new GameState();
    window.history.replaceState({}, '', `?seed=${gameState.seed}`);
  }

  function handleShare() {
    const url = `${window.location.origin}${window.location.pathname}?seed=${gameState.seed}`;
    navigator.clipboard.writeText(url);
    alert('Game URL copied to clipboard!');
  }

  function handleToggleTheme() {
    isDarkMode = !isDarkMode;
    document.documentElement.classList.toggle('dark');
  }

  onMount(() => {
    window.history.replaceState({}, '', `?seed=${gameState.seed}`);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  });
</script>

<Menu 
  onNewGame={handleNewGame} 
  onShare={handleShare} 
  onToggleTheme={handleToggleTheme} 
  {isDarkMode} 
/>

<main>
  <div class="game-container">
    <div class="score">Score: {gameState.score}</div>
    
    <div class="game-area">
      <GameGrid 
        bind:this={gameGridComponent}
        grid={gameState.grid} 
        currentShape={gameState.currentShape}
        onCellDrop={handleShapePlacement} 
      />
      
      <div class="side-panel">
        {#if !gameState.gameOver}
          <div class="next-shape">
            <h3>Current Shape:</h3>
            <CurrentShape 
              shape={gameState.currentShape} 
              onDragStart={handleDragStart}
            />
          </div>
        {:else}
          <div class="game-over">
            <h2>Game Over!</h2>
            <p>Final Score: {gameState.score}</p>
            {#if gameState.lastShape}
              <div class="last-shape">
                <p>This shape couldn't be placed:</p>
                <CurrentShape 
                  shape={gameState.lastShape}
                  onDragStart={() => {}}
                />
              </div>
            {/if}
            <button on:click={handleNewGame}>Play Again</button>
          </div>
        {/if}
      </div>
    </div>
  </div>
</main>

<style>
  :global(:root) {
    --text-color: #333;
    --bg-color: #f0f0f0;
    --title-bg: #333;
    --title-text: #fff;
    --menu-bg: #fff;
    --menu-shadow: -2px 2px 5px rgba(0,0,0,0.2);
    --menu-hover: #f0f0f0;
    --modal-overlay: rgba(0, 0, 0, 0.5);
    --modal-bg: #fff;
    --grid-bg: #fff;
    --border-color: #333;
    --cell-border: #999;
    --cell-border-filled: #666;
    --valid-color: #00ff00;
    --invalid-color: #ff0000;
  }

  :global(.dark) {
    --text-color: #fff;
    --bg-color: #1a1a1a;
    --title-bg: #000;
    --title-text: #fff;
    --menu-bg: #333;
    --menu-shadow: -2px 2px 5px rgba(0,0,0,0.4);
    --menu-hover: #444;
    --modal-overlay: rgba(0, 0, 0, 0.7);
    --modal-bg: #333;
    --grid-bg: #2a2a2a;
    --border-color: #666;
    --cell-border: #444;
    --cell-border-filled: #888;
    --valid-color: #00cc00;
    --invalid-color: #cc0000;
  }

  :global(body) {
    background-color: var(--bg-color);
    color: var(--text-color);
  }

  main {
    padding-top: 60px;
    min-height: calc(100vh - 60px);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    max-width: 100%;
    box-sizing: border-box;
  }
  
  .game-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  @media (min-width: 768px) and (orientation: landscape) {
    .game-area {
      flex-direction: row;
      align-items: flex-start;
      gap: 40px;
    }
  }
  
  .score {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  
  .side-panel {
    min-width: 200px;
  }

  .next-shape {
    padding: 10px;
  }
  
  .game-over {
    padding: 20px;
    background: var(--modal-bg);
    border-radius: 8px;
    text-align: center;
  }

  .last-shape {
    margin: 20px 0;
    padding: 10px;
    background: rgba(255, 0, 0, 0.1);
    border-radius: 4px;
  }

  @media (max-width: 767px) {
    .game-container {
      padding: 10px;
    }
    
    .score {
      font-size: 20px;
      margin-bottom: 10px;
    }
  }
</style>