import type { Cell, Shape } from './types';
import { generateShape } from './shapes';
import seedrandom from 'seedrandom';

export class GameState {
  grid: Cell[][];
  score: number;
  currentShape: Shape;
  nextShape: Shape;
  lastShape: Shape | null;
  gameOver: boolean;
  seed: string;
  rng: ReturnType<typeof seedrandom>;

  constructor(seed?: string) {
    this.seed = seed || Math.random().toString(36).substring(7);
    this.rng = seedrandom(this.seed);
    this.grid = this.createEmptyGrid();
    this.score = 0;
    this.gameOver = false;
    this.lastShape = null;
    this.currentShape = generateShape(this.rng, this.score);
    this.nextShape = generateShape(this.rng, this.score);
  }

  createEmptyGrid(): Cell[][] {
    return Array(6).fill(0).map(() =>
      Array(6).fill(0).map(() => ({
        filled: false,
        color: ''
      }))
    );
  }

  isGridEmpty(): boolean {
    return this.grid.every(row => row.every(cell => !cell.filled));
  }

  canPlaceShape(x: number, y: number): boolean {
    if (!this.currentShape) return false;
    
    for (let sy = 0; sy < this.currentShape.grid.length; sy++) {
      for (let sx = 0; sx < this.currentShape.grid[sy].length; sx++) {
        if (this.currentShape.grid[sy][sx]) {
          const gridX = x + sx;
          const gridY = y + sy;
          
          if (gridX >= 6 || gridY >= 6 || gridX < 0 || gridY < 0 || this.grid[gridY][gridX].filled) {
            return false;
          }
        }
      }
    }
    return true;
  }

  canPlaceNextShape(shape: Shape): boolean {
    for (let y = 0; y < 6; y++) {
      for (let x = 0; x < 6; x++) {
        if (this.canPlaceShapeAt(shape, x, y)) {
          return true;
        }
      }
    }
    return false;
  }

  canPlaceShapeAt(shape: Shape, x: number, y: number): boolean {
    for (let sy = 0; sy < shape.grid.length; sy++) {
      for (let sx = 0; sx < shape.grid[sy].length; sx++) {
        if (shape.grid[sy][sx]) {
          const gridX = x + sx;
          const gridY = y + sy;
          
          if (gridX >= 6 || gridY >= 6 || gridX < 0 || gridY < 0 || this.grid[gridY][gridX].filled) {
            return false;
          }
        }
      }
    }
    return true;
  }

  placeShape(x: number, y: number): boolean {
    if (!this.canPlaceShape(x, y)) return false;

    for (let sy = 0; sy < this.currentShape.grid.length; sy++) {
      for (let sx = 0; sx < this.currentShape.grid[sy].length; sx++) {
        if (this.currentShape.grid[sy][sx]) {
          this.grid[y + sy][x + sx] = {
            filled: true,
            color: this.currentShape.color
          };
        }
      }
    }
    return true;
  }

  findLinesToClear(): [number, number][] {
    const lines: [number, number][] = [];

    // Check rows
    for (let y = 0; y < 6; y++) {
      if (this.grid[y].every(cell => cell.filled)) {
        for (let x = 0; x < 6; x++) {
          lines.push([x, y]);
        }
      }
    }

    // Check columns
    for (let x = 0; x < 6; x++) {
      if (this.grid.every(row => row[x].filled)) {
        for (let y = 0; y < 6; y++) {
          lines.push([x, y]);
        }
      }
    }

    return [...new Set(lines.map(line => JSON.stringify(line)))]
      .map(line => JSON.parse(line));
  }

  clearLines(lines: [number, number][]): void {
    // Clear cells
    lines.forEach(([x, y]) => {
      this.grid[y][x] = {
        filled: false,
        color: ''
      };
    });

    // Update score
    const uniqueLines = new Set(lines.map(([x, y]) => `${x},${y}`)).size;
    this.score += uniqueLines * 100;

    // Check for grid clear bonus
    if (this.isGridEmpty()) {
      this.score += 500; // Bonus for clearing entire grid
    }
  }

  nextTurn(): void {
    const nextShape = this.nextShape;
    
    if (!this.canPlaceNextShape(nextShape)) {
      this.lastShape = nextShape;
      this.gameOver = true;
    } else {
      this.currentShape = nextShape;
      this.nextShape = generateShape(this.rng, this.score);
    }
  }
}