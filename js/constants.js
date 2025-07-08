const BOARD_PADDING = 32;
const BOARD_SIZE = 512;
const H_BOARD_SIZE = BOARD_SIZE / 2;

const SQUARE_SIZE = 64;
const HALF_SQUARE_SIZE = SQUARE_SIZE / 2;
const GRID_SIZE = 8;
const SPRITE_SIZE = 56;
const SPRITE_PADDING = (SQUARE_SIZE - SPRITE_SIZE) / 2;

const cellCorner = (num) => {
  return num * SQUARE_SIZE;
};
