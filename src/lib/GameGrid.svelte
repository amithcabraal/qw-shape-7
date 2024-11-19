<script lang="ts">
  import type { Cell, Shape, Position } from './types';
  import { dndzone } from 'svelte-dnd-action';
  
  export let grid: Cell[][];
  export let currentShape: Shape;
  export let onCellDrop: (x: number, y: number) => void;
  
  let hoverX: number | null = null;
  let hoverY: number | null = null;
  let clearingCells: Set<string> = new Set();
  let dragOffset: Position = { x: 0, y: 0 };
  let gridElement: HTMLDivElement;
  let items = [{ id: 'grid', grid }];

  function canPlaceShape(x: number, y: number): boolean {
    if (!currentShape) return false;
    
    for (let sy = 0; sy < currentShape.grid.length; sy++) {
      for (let sx = 0; sx < currentShape.grid[sy].length; sx++) {
        if (currentShape.grid[sy][sx]) {
          const gridX = x + sx;
          const gridY = y + sy;
          
          if (gridX >= 6 || gridY >= 6 || gridX < 0 || gridY < 0 || grid[gridY][gridX].filled) {
            return false;
          }
        }
      }
    }
    return true;
  }

  function getCellPosition(clientX: number, clientY: number): { x: number, y: number } | null {
    if (!gridElement) return null;
    
    const rect = gridElement.getBoundingClientRect();
    const cellSize = 42; // 40px + 2px margin
    
    const x = Math.floor((clientX - rect.left) / cellSize);
    const y = Math.floor((clientY - rect.top) / cellSize);
    
    if (x < 0 || x >= 6 || y < 0 || y >= 6) return null;
    
    return { x, y };
  }

  function handleDndConsider(e: CustomEvent) {
    const touch = e.detail?.info?.event?.touches?.[0] || e.detail?.info?.event;
    if (touch) {
      const pos = getCellPosition(touch.clientX, touch.clientY);
      if (pos) {
        hoverX = pos.x - dragOffset.x;
        hoverY = pos.y - dragOffset.y;
      }
    }
  }

  function handleDndFinalize(e: CustomEvent) {
    const touch = e.detail?.info?.event?.changedTouches?.[0] || e.detail?.info?.event;
    if (touch && hoverX !== null && hoverY !== null) {
      onCellDrop(hoverX, hoverY);
    }
    hoverX = null;
    hoverY = null;
    items = [{ id: 'grid', grid }]; // Reset the items
  }

  export function markCellsForClearing(cells: [number, number][]) {
    clearingCells = new Set(cells.map(([x, y]) => `${x},${y}`));
    return new Promise(resolve => {
      setTimeout(() => {
        clearingCells.clear();
        resolve(true);
      }, 500);
    });
  }

  export function setDragOffset(offset: Position) {
    dragOffset = offset;
  }

  $: previewCells = hoverX !== null && hoverY !== null ? 
    Array(currentShape.grid.length).fill(0).flatMap((_, sy) =>
      Array(currentShape.grid[sy].length).fill(0).map((_, sx) => ({
        x: hoverX! + sx,
        y: hoverY! + sy,
        active: currentShape.grid[sy][sx]
      }))
    ).filter(({active}) => active) : [];

  $: isValidPlacement = hoverX !== null && hoverY !== null && 
    canPlaceShape(hoverX, hoverY);
</script>

<div 
  class="grid"
  role="grid"
  aria-label="Game grid - 6x6 cells"
  bind:this={gridElement}
  use:dndzone={{items, dragDisabled: false}}
  on:consider={handleDndConsider}
  on:finalize={handleDndFinalize}
>
  {#each grid as row, y}
    <div class="row" role="row">
      {#each row as cell, x}
        <div
          class="cell"
          class:filled={cell.filled}
          class:preview={previewCells.some(p => p.x === x && p.y === y)}
          class:valid={previewCells.some(p => p.x === x && p.y === y) && isValidPlacement}
          class:invalid={previewCells.some(p => p.x === x && p.y === y) && !isValidPlacement}
          class:clearing={clearingCells.has(`${x},${y}`)}
          style="background-color: {cell.filled ? cell.color : 'transparent'}"
          role="gridcell"
          aria-label={cell.filled ? 'Filled cell' : 'Empty cell'}
        />
      {/each}
    </div>
  {/each}
</div>

<style>
  .grid {
    display: inline-block;
    border: 2px solid var(--border-color);
    background: var(--grid-bg);
    padding: 4px;
    border-radius: 8px;
    touch-action: none;
    -webkit-user-select: none;
    user-select: none;
  }
  
  .row {
    display: flex;
  }
  
  .cell {
    width: 40px;
    height: 40px;
    border: 1px solid var(--cell-border);
    margin: 1px;
    transition: all 0.2s ease;
  }
  
  .filled {
    border: 1px solid var(--cell-border-filled);
  }

  .preview {
    opacity: 0.5;
  }

  .valid {
    box-shadow: inset 0 0 0 2px var(--valid-color);
  }

  .invalid {
    box-shadow: inset 0 0 0 2px var(--invalid-color);
  }

  .clearing {
    animation: flash 0.5s ease-out;
  }

  @keyframes flash {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.5; }
    100% { transform: scale(0); opacity: 0; }
  }
</style>