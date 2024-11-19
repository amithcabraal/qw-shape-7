export type Cell = {
  filled: boolean;
  color: string;
};

export type Shape = {
  grid: boolean[][];
  color: string;
};

export type Position = {
  x: number;
  y: number;
};