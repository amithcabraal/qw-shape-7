<script lang="ts">
  import type { Shape, Position } from './types';
  import { dndzone } from 'svelte-dnd-action';
  
  export let shape: Shape;
  export let onDragStart: (offset: Position) => void;
  
  let element: HTMLDivElement;
  let items = [{ id: 'shape', shape }];
  
  function calculateOffset(clientX: number, clientY: number, element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    const cellSize = 32; // 30px + 2px margin
    
    const offsetX = Math.floor((clientX - rect.left) / cellSize);
    const offsetY = Math.floor((clientY - rect.top) / cellSize);
    
    // Find the first filled cell in the clicked column
    let firstFilledY = 0;
    for (let y = 0; y < shape.grid.length; y++) {
      if (shape.grid[y][offsetX]) {
        firstFilledY = y;
        break;
      }
    }
    
    return { x: offsetX, y: offsetY - firstFilledY };
  }

  function handleDndConsider(e: CustomEvent) {
    if (!element) return;
    const touch = e.detail?.info?.event?.touches?.[0] || e.detail?.info?.event;
    if (touch) {
      const offset = calculateOffset(touch.clientX, touch.clientY, element);
      onDragStart(offset);
    }
  }

  function handleDndFinalize() {
    items = [{ id: 'shape', shape }]; // Reset the items
  }
</script>

<div 
  class="shape-container"
  use:dndzone={{items, dragDisabled: false}}
  on:consider={handleDndConsider}
  on:finalize={handleDndFinalize}
>
  <div 
    class="shape" 
    bind:this={element}
    role="button"
    aria-label="Current shape - drag or touch to place on grid"
    tabindex="0"
  >
    {#each shape.grid as row}
      <div class="row">
        {#each row as cell}
          {#if cell}
            <div 
              class="cell filled"
              style="background-color: {shape.color}"
            />
          {:else}
            <div class="cell empty" />
          {/if}
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  .shape-container {
    display: inline-block;
    touch-action: none;
  }
  
  .shape {
    display: inline-block;
    cursor: move;
    padding: 4px;
    touch-action: none;
    -webkit-user-select: none;
    user-select: none;
  }
  
  .row {
    display: flex;
  }
  
  .cell {
    width: 30px;
    height: 30px;
    margin: 1px;
  }

  .cell.empty {
    visibility: hidden;
  }
  
  .cell.filled {
    border: 1px solid rgba(128, 128, 128, 0.3);
  }

  :global(.dark) .cell.filled {
    border-color: rgba(255, 255, 255, 0.3);
  }
</style>