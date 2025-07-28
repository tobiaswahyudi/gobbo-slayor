class AimAreaLookup {
  constructor(cells) {
    this.lookup = new Map(cells.map((cell) => [cell.toString(), true]));
  }

  has(cell) {
    return this.lookup.has(cell.toString());
  }

  add(cell) {
    this.lookup.set(cell.toString(), true);
  }

  delete(cell) {
    this.lookup.delete(cell.toString());
  }
}

const getAimSlicePos = (ul, ur, dl, dr) => [2 * dl + dr, 2 * ul + ur];

class AimArea {
  constructor(cells) {
    this.cells = cells;
    this.lookup = new AimAreaLookup(cells);
  }

  add(cell) {
    if (this.lookup.has(cell.toString())) {
      return false;
    }

    this.cells.push(cell);
    this.lookup.add(cell);

    return true;
  }

  remove(cell) {
    if (!this.lookup.has(cell)) {
      return false;
    }

    this.lookup.delete(cell);
    this.cells = this.cells.filter((c) => c.toString() !== cell.toString());

    return true;
  }

  render(game, levelSize, renderPos, playerPos, hasBombs, animOffset) {
    const areas = this.cells
      .map((cell) => cell.add(playerPos))
      .filter((cell) => !isOutOfBounds(levelSize, cell.x, cell.y));

    const pos = renderPos.add(animOffset);

    if (areas.length == 0) return;

    const lookup = new AimAreaLookup(areas);
    const isInAimArea = (x, y) =>
      !isOutOfBounds(levelSize, x, y) && lookup.has(strPosition(x, y));

    const outline = new Path2D();

    const cc = cellCorner;

    // areas.forEach((area) => {
    //   game.drawRect(
    //     cc(area.x) + pos.x,
    //     cc(area.y) + pos.y,
    //     SQUARE_SIZE,
    //     SQUARE_SIZE,
    //     { fill: hasBombs ? "#ffa05766" : "#ababab66" }
    //   );

    //   if (!isInAimArea(area.x - 1, area.y)) {
    //     outline.moveTo(cc(area.x) + pos.x, cc(area.y) + pos.y);
    //     outline.lineTo(cc(area.x) + pos.x, cc(area.y + 1) + pos.y);
    //   }
    //   if (!isInAimArea(area.x + 1, area.y)) {
    //     outline.moveTo(cc(area.x + 1) + pos.x, cc(area.y) + pos.y);
    //     outline.lineTo(cc(area.x + 1) + pos.x, cc(area.y + 1) + pos.y);
    //   }
    //   if (!isInAimArea(area.x, area.y - 1)) {
    //     outline.moveTo(cc(area.x) + pos.x, cc(area.y) + pos.y);
    //     outline.lineTo(cc(area.x + 1) + pos.x, cc(area.y) + pos.y);
    //   }
    //   if (!isInAimArea(area.x, area.y + 1)) {
    //     outline.moveTo(cc(area.x) + pos.x, cc(area.y + 1) + pos.y);
    //     outline.lineTo(cc(area.x + 1) + pos.x, cc(area.y + 1) + pos.y);
    //   }
    // });

    const leftmostCellPos = areas.reduce(
      (min, area) => (area.x < min ? area.x : min),
      Infinity
    );
    const rightmostCellPos = areas.reduce(
      (max, area) => (area.x > max ? area.x : max),
      -Infinity
    );

    const topmostCellPos = areas.reduce(
      (min, area) => (area.y < min ? area.y : min),
      Infinity
    );
    const bottommostCellPos = areas.reduce(
      (max, area) => (area.y > max ? area.y : max),
      -Infinity
    );
    // const leftmostCell = areas.find((area) => area.x === leftmostCellPos);

    game.ctx.save();
    game.ctx.globalAlpha = 0.7;

    for (let y = topmostCellPos; y <= bottommostCellPos + 1; y++) {
      for (let x = leftmostCellPos; x <= rightmostCellPos + 1; x++) {
        const ul = isInAimArea(x - 1, y - 1);
        const ur = isInAimArea(x, y -1);
        const dl = isInAimArea(x - 1, y);
        const dr = isInAimArea(x, y);

        const [sliceX, sliceY] = getAimSlicePos(ul, ur, dl, dr);

        game.drawImage(ASSETS.SPRITE.AIM_SLICES, cc(x-0.5) + pos.x, cc(y-0.5) + pos.y, 64, 64, {
          x: sliceX * 16,
          y: sliceY * 16,
          width: 16,
          height: 16,
        });
      }
    }

    game.ctx.restore();

    // draw a line from THE MIDDLE OF THE MAGIC STAFF at (28, 12)

    // const magicStaffX = (27.5 / 32) * SPRITE_SIZE + SPRITE_PADDING;
    // const magicStaffY = (11.5 / 32) * SPRITE_SIZE + SPRITE_PADDING;

    // outline.moveTo(
    //   cc(playerPos.x) + magicStaffX + pos.x - animOffset.x,
    //   cc(playerPos.y) + magicStaffY + pos.y - animOffset.y
    // );
    // outline.lineTo(
    //   cc(leftmostCell.x) + pos.x,
    //   cc(leftmostCell.y + 0.5) + pos.y
    // );

    // game.drawPath(outline, {
    //   stroke: hasBombs ? "#FF6F00" : "#808080A0",
    //   strokeWidth: 4,
    // });
  }
}
