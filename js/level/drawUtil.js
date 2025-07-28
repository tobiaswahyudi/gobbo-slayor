const drawCheckeredGrid = (game, x, y, color1, color2, size = GRID_SIZE) => {
  const cellSize = SQUARE_SIZE * GRID_SIZE / size;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const color = (i + j) % 2 === 0 ? color1 : color2;
      game.drawRect(
        i * cellSize + x,
        j * cellSize + y,
        cellSize,
        cellSize,
        {
          fill: color,
        }
      );
    }
  }
};
