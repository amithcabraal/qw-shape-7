import type { Shape } from './types';
import seedrandom from 'seedrandom';

const colors = [
  '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
  '#FF00FF', '#00FFFF', '#FFA500', '#800080'
];

const shapeTemplates = [
  // Single cell
  [[true]],
  
  // Two cells
  [[true, true]],
  
  // Three cells
  [[true, true, true]],
  [[true, true], [true, false]],
  
  // Four cells
  [[true, true, true, true]],
  [[true, true], [true, true]],
  [[true, true, true], [false, true, false]],
  
  // Five cells
  [[true, true, true, true, true]],
  [[true, true, true], [true, true, false]],
  [[true, true], [true, true], [true, false]],
  
  // Special shapes unlocked at 1000 points
  [[true, false, false],
   [false, true, false],
   [false, false, true]],
   
  // Special shapes unlocked at 2000 points
  [[false, false, true],
   [false, true, false],
   [true, false, false]]
];

export function generateShape(rng: ReturnType<typeof seedrandom>, score: number): Shape {
  let availableTemplates = shapeTemplates.slice(0, 10); // Basic shapes
  
  if (score >= 1000) {
    availableTemplates.push(shapeTemplates[10]); // Add diagonal down shape
  }
  
  if (score >= 2000) {
    availableTemplates.push(shapeTemplates[11]); // Add diagonal up shape
  }
  
  const template = availableTemplates[Math.floor(rng() * availableTemplates.length)];
  const color = colors[Math.floor(rng() * colors.length)];
  
  return {
    grid: template,
    color
  };
}