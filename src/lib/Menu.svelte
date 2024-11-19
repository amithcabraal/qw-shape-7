<script lang="ts">
  import { slide } from 'svelte/transition';
  
  export let onNewGame: () => void;
  export let onShare: () => void;
  export let onToggleTheme: () => void;
  export let isDarkMode: boolean;
  
  let showMenu = false;
  let showHelp = false;
  let showPrivacy = false;
  let showContact = false;
</script>

<div class="title-bar">
  <h1>Shape Sorter</h1>
  <div class="controls">
    <button 
      class="theme-toggle" 
      on:click={onToggleTheme}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
    <button 
      class="burger" 
      on:click={() => showMenu = !showMenu}
      aria-label="Open menu"
      aria-expanded={showMenu}
      aria-controls="menu"
    >
      <div class="burger-line" />
      <div class="burger-line" />
      <div class="burger-line" />
    </button>
  </div>
</div>

{#if showMenu}
  <div 
    id="menu"
    class="menu" 
    transition:slide
    role="menu"
  >
    <button 
      on:click={() => { onNewGame(); showMenu = false; }}
      role="menuitem"
    >
      New Game
    </button>
    <button 
      on:click={() => { onShare(); showMenu = false; }}
      role="menuitem"
    >
      Share Game
    </button>
    <button 
      on:click={() => { showHelp = true; showMenu = false; }}
      role="menuitem"
    >
      How to Play
    </button>
    <button 
      on:click={() => { showPrivacy = true; showMenu = false; }}
      role="menuitem"
    >
      Privacy
    </button>
    <button 
      on:click={() => { showContact = true; showMenu = false; }}
      role="menuitem"
    >
      Contact
    </button>
  </div>
{/if}

{#if showHelp || showPrivacy || showContact}
  <div 
    class="modal"
    role="dialog"
    aria-modal="true"
  >
    <div class="modal-content">
      {#if showHelp}
        <h2>How to Play</h2>
        <p>1. Drag and drop shapes onto the 6x6 grid</p>
        <p>2. Complete rows or columns to clear them and score points</p>
        <p>3. Game ends when no more shapes can be placed</p>
        <button on:click={() => showHelp = false}>Close</button>
      {/if}
      {#if showPrivacy}
        <h2>Privacy Policy</h2>
        <p>We don't collect any personal data. Game seeds are stored in the URL only.</p>
        <button on:click={() => showPrivacy = false}>Close</button>
      {/if}
      {#if showContact}
        <h2>Contact Us</h2>
        <p>Email: example@shapesort.game</p>
        <button on:click={() => showContact = false}>Close</button>
      {/if}
    </div>
  </div>
{/if}

<style>
  .title-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background: var(--title-bg);
    color: var(--title-text);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
  }

  .controls {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  h1 {
    margin: 0;
    font-size: 1.5rem;
  }

  .burger {
    background: none;
    border: none;
    padding: 10px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .burger-line {
    width: 24px;
    height: 2px;
    background: var(--title-text);
    transition: all 0.3s ease;
  }

  .theme-toggle {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 4px;
  }

  .menu {
    position: fixed;
    top: 60px;
    right: 0;
    background: var(--menu-bg);
    box-shadow: var(--menu-shadow);
    z-index: 90;
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-radius: 0 0 0 8px;
  }

  .menu button {
    background: none;
    border: none;
    padding: 10px 20px;
    text-align: left;
    cursor: pointer;
    white-space: nowrap;
    color: var(--text-color);
  }

  .menu button:hover {
    background: var(--menu-hover);
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--modal-overlay);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 110;
  }

  .modal-content {
    background: var(--modal-bg);
    color: var(--text-color);
    padding: 20px;
    border-radius: 8px;
    max-width: 500px;
    margin: 20px;
  }
</style>