const drawCheckeredGrid = (game, x, y, color1, color2) => {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const color = (i + j) % 2 === 0 ? color1 : color2;
      game.drawRect(
        i * SQUARE_SIZE + x,
        j * SQUARE_SIZE + y,
        SQUARE_SIZE,
        SQUARE_SIZE,
        {
          fill: color,
        }
      );
    }
  }
};
