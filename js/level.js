const Animation = {
  NONE: false,
  EXPLODING: "EXPLODING",
  TRANSITION_OUT: "TRANSITION_OUT",
  TRANSITION_IN: "TRANSITION_IN",
};

const TRANSITION_FRAMES = 8;

const HatType = {
  VERTICAL: "V",
  HORIZONTAL: "H",
  REMOVE: "X",
};

const SQUARE_SIZE = 64;
const HALF_SQUARE_SIZE = SQUARE_SIZE / 2;
const GRID_SIZE = 8;
const SPRITE_SIZE = 56;
const SPRITE_PADDING = (SQUARE_SIZE - SPRITE_SIZE) / 2;

class LevelManager {
  constructor(game) {
    this.game = game;
    this.currentLevel = 0;
    this.history = new LevelHistory(LEVELS[this.currentLevel]);

    this.animating = Animation.NONE;
    this.frame = 0;

    this.juiceOffset = new Position(0, 0);
  }

  get state() {
    return this.history.getCurrent();
  }

  // Level Input Handling
  handleGameInput(keyCode) {
    if (this.animating) return;

    this.history.copyTop();

    switch (keyCode) {
      case "ArrowUp":
      case "KeyW":
        this.makeMove(Direction.UP);
        return true;
        break;
      case "ArrowDown":
      case "KeyS":
        this.makeMove(Direction.DOWN);
        return true;
        break;
      case "ArrowLeft":
      case "KeyA":
        this.makeMove(Direction.LEFT);
        return true;
        break;
      case "ArrowRight":
      case "KeyD":
        this.makeMove(Direction.RIGHT);
        return true;
        break;
      case "Space":
        this.handleAction();
        return true;
        break;
      case "Escape":
        this.game.gameState.level = "selection";
        return true;
      case "KeyZ":
        this.history.pop();
        this.history.pop();
        return true;
      default:
        this.history.pop();
        return false;
    }
  }

  // Level Rendering
  // returns true if another re-render is needed
  renderGame() {
    const { width, height } = this.game;

    // Game area background
    this.game.drawRect(0, 0, width, height, { fill: "#C5BAB5" });

    // Draw a 8x8 grid of 64px squares. They alternate between CFC6BD and E2D8D4
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const color = (i + j) % 2 === 0 ? "#CFC6BD" : "#E2D8D4";
        this.game.drawRect(
          i * SQUARE_SIZE + HALF_SQUARE_SIZE + this.juiceOffset.x * 0.5,
          j * SQUARE_SIZE + HALF_SQUARE_SIZE + this.juiceOffset.y * 0.5,
          SQUARE_SIZE,
          SQUARE_SIZE,
          {
            fill: color,
          }
        );
      }
    }

    this.game.drawRect(
      32 + this.juiceOffset.x * 0.5,
      32 + this.juiceOffset.y * 0.5,
      512,
      512,
      {
        fill: "",
        stroke: "#BDAFA1",
        strokeWidth: 4,
      }
    );

    this.game.drawRect(
      576 + this.juiceOffset.x * 0.5,
      32 + this.juiceOffset.y * 0.5,
      208,
      512,
      {
        fill: "#E2D8D4",
        stroke: "#BDAFA1",
        strokeWidth: 4,
      }
    );

    this.game.drawText(
      `Level ${this.currentLevel}`,
      680 + this.juiceOffset.x,
      44 + this.juiceOffset.y,
      {
        color: "#000",
        font: "bold 24px Courier New",
        align: "center",
      }
    );

    this.game.drawRect(
      600 + this.juiceOffset.x,
      78 + this.juiceOffset.y,
      160,
      0,
      {
        fill: "",
        stroke: "#000",
        strokeWidth: 2,
      }
    );

    this.game.drawImage(
      ASSETS.SPRITE.GOBBOS.MOVE,
      608 + this.juiceOffset.x,
      80 + this.juiceOffset.y,
      64,
      64
    );

    this.game.drawText(
      `x${this.state.gobbos.length}`,
      688 + this.juiceOffset.x,
      106 + this.juiceOffset.y,
      {
        color: "#000",
        font: "bold 40px Courier New",
        align: "left",
      }
    );

    this.game.drawImage(
      ASSETS.SPRITE.GOBBO,
      608 + this.juiceOffset.x,
      80 + this.juiceOffset.y,
      64,
      64
    );

    this.game.drawText(
      `x${this.state.gobbos.length}`,
      688 + this.juiceOffset.x,
      106 + this.juiceOffset.y,
      {
        color: "#000",
        font: "bold 40px Courier New",
        align: "left",
      }
    );

    this.game.drawImage(
      ASSETS.UI.MANA,
      608 + this.juiceOffset.x,
      152 + this.juiceOffset.y,
      64,
      64
    );

    this.game.drawText(
      `x${this.state.remainingBombs}`,
      688 + this.juiceOffset.x,
      178 + this.juiceOffset.y,
      {
        color: "#000",
        font: "bold 40px Courier New",
        align: "left",
      }
    );

    this.game.drawText(
      "Hats",
      680 + this.juiceOffset.x,
      280 + this.juiceOffset.y,
      {
        color: "#000",
        font: "bold 24px Courier New",
        align: "center",
      }
    );

    this.game.drawRect(
      600 + this.juiceOffset.x,
      314 + this.juiceOffset.y,
      160,
      0,
      {
        fill: "",
        stroke: "#000",
        strokeWidth: 2,
      }
    );

    this.game.drawImage(
      ASSETS.UI.HAT[HatType.HORIZONTAL],
      608 + this.juiceOffset.x,
      332 + this.juiceOffset.y,
      64,
      64
    );

    this.game.drawImage(
      ASSETS.UI.HAT[HatType.REMOVE],
      688 + this.juiceOffset.x,
      332 + this.juiceOffset.y,
      64,
      64
    );

    this.game.drawImage(
      ASSETS.UI.HAT[HatType.VERTICAL],
      608 + this.juiceOffset.x,
      412 + this.juiceOffset.y,
      64,
      64
    );

    this.game.ctx.globalAlpha = 0.4;
    if (this.currentLevel === 0) {
      this.game.drawImage(
        ASSETS.TUTORIAL.ATTACK,
        32 + 2 * SQUARE_SIZE + 0.5 * this.juiceOffset.x,
        32 + 6 * SQUARE_SIZE + 0.5 * this.juiceOffset.y,
        SQUARE_SIZE,
        SQUARE_SIZE
      );
      this.game.drawImage(
        ASSETS.TUTORIAL.MOVE,
        32 + 1 * SQUARE_SIZE + 0.5 * this.juiceOffset.x,
        32 + 6 * SQUARE_SIZE + 0.5 * this.juiceOffset.y,
        SQUARE_SIZE,
        SQUARE_SIZE
      );
    }
    if (this.currentLevel <= 1) {
      this.game.drawImage(
        ASSETS.TUTORIAL.UNDO,
        32 + 3 * SQUARE_SIZE + 0.5 * this.juiceOffset.x,
        32 + 6 * SQUARE_SIZE + 0.5 * this.juiceOffset.y,
        SQUARE_SIZE,
        SQUARE_SIZE
      );
    }

    this.game.ctx.globalAlpha = 1;

    if (this.currentLevel === 0) {
      this.game.ctx.globalAlpha = 0.75;
      this.game.drawImage(
        ASSETS.UI.TITLE,
        54 + 0.5 * this.juiceOffset.x,
        96 + 0.5 * this.juiceOffset.y,
        384,
        128
      );
      this.game.ctx.globalAlpha = 0.5;
      this.game.drawImage(
        ASSETS.UI.CREDITS,
        320 + 0.5 * this.juiceOffset.x,
        224 + 0.5 * this.juiceOffset.y,
        128,
        64
      );
      this.game.ctx.globalAlpha = 1;
    }

    if (this.currentLevel === 0 || this.currentLevel === 2) {
      this.game.ctx.globalAlpha = 0.5;
      this.game.drawImage(
        ASSETS.TUTORIAL.TOOLTIP,
        480 + 0.5 * this.juiceOffset.x,
        96 + 0.5 * this.juiceOffset.y,
        64,
        128
      );
      this.game.ctx.globalAlpha = 1;
    }

    // Render level-specific content
    this.renderLevelContent();

    if (this.animating === Animation.NONE) {
      return false;
    }

    if (
      this.animating === Animation.TRANSITION_OUT ||
      this.animating === Animation.TRANSITION_IN
    ) {
      this.juiceOffset.zero();
      this.frame++;

      const radFrame =
        this.animating === Animation.TRANSITION_OUT
          ? TRANSITION_FRAMES - this.frame
          : this.frame;

      const maxRadius = (SQUARE_SIZE * GRID_SIZE * Math.sqrt(2) + 1) / 2;
      const radius = maxRadius * (radFrame / TRANSITION_FRAMES);

      const vignette = new Path2D();

      vignette.arc(
        32 + (SQUARE_SIZE * GRID_SIZE) / 2,
        32 + (SQUARE_SIZE * GRID_SIZE) / 2,
        radius,
        0,
        Math.PI * 2
      );

      vignette.lineTo(
        32 + SQUARE_SIZE * GRID_SIZE,
        32 + (SQUARE_SIZE * GRID_SIZE) / 2
      );

      vignette.lineTo(
        32 + SQUARE_SIZE * GRID_SIZE,
        32 + SQUARE_SIZE * GRID_SIZE
      );

      vignette.lineTo(32, 32 + SQUARE_SIZE * GRID_SIZE);

      vignette.lineTo(32, 32);

      vignette.lineTo(32 + SQUARE_SIZE * GRID_SIZE, 32);

      vignette.lineTo(
        32 + SQUARE_SIZE * GRID_SIZE,
        32 + (SQUARE_SIZE * GRID_SIZE) / 2
      );

      vignette.closePath();

      this.game.ctx.save();

      this.game.ctx.clip(vignette, "evenodd");

      this.game.drawRect(
        32,
        32,
        SQUARE_SIZE * GRID_SIZE,
        SQUARE_SIZE * GRID_SIZE,
        {
          fill: "#BDAFA1",
        }
      );

      this.game.ctx.restore();

      if (
        this.animating === Animation.TRANSITION_OUT &&
        this.frame >= TRANSITION_FRAMES
      ) {
        this.loadNextLevel();
      }

      if (
        this.animating === Animation.TRANSITION_IN &&
        this.frame >= TRANSITION_FRAMES
      ) {
        this.animating = Animation.NONE;
        this.frame = 0;
      }
    }

    if (this.animating === Animation.EXPLODING) {
      this.frame++;
      this.juiceOffset
        .randomize()
        .normalize()
        .scale(6 - this.frame)
        .scale(1.5);

      if (this.frame >= 5) {
        this.juiceOffset.zero();
        this.animating = Animation.NONE;
        this.frame = 0;
      }
    }

    return true;
  }

  cellCenter(num) {
    return num * SQUARE_SIZE + HALF_SQUARE_SIZE;
  }

  // Level-specific content rendering (override this for different level types)
  renderLevelContent() {
    this.game.drawImage(
      ASSETS.SPRITE.WIZ,
      this.cellCenter(this.state.player.x) +
        SPRITE_PADDING +
        this.juiceOffset.x,
      this.cellCenter(this.state.player.y) +
        SPRITE_PADDING +
        this.juiceOffset.y,
      SPRITE_SIZE,
      SPRITE_SIZE
    );
    this.state.gobbos.forEach((gobbo) => this.renderGobbo(gobbo));
    this.state.walls.forEach((wall) => this.renderWall(wall));
    this.renderAimAreas();
  }

  renderGobbo(gobbo) {
    if (gobbo.direction === Direction.SLEEP) {
      this.game.drawImage(
        ASSETS.SPRITE.GOBBOS.SLEEP,
        this.cellCenter(gobbo.x) + SPRITE_PADDING + this.juiceOffset.x,
        this.cellCenter(gobbo.y) + SPRITE_PADDING + this.juiceOffset.y,
        SPRITE_SIZE,
        SPRITE_SIZE
      );
    } else {
      this.game.drawImage(
        ASSETS.SPRITE.GOBBOS.MOVE,
        this.cellCenter(gobbo.x) + SPRITE_PADDING + this.juiceOffset.x,
        this.cellCenter(gobbo.y) + SPRITE_PADDING + this.juiceOffset.y,
        SPRITE_SIZE,
        SPRITE_SIZE
      );
    }
    this.game.drawImage(
      ASSETS.SPRITE.HAT[gobbo.hatType],
      this.cellCenter(gobbo.x) + SPRITE_PADDING + this.juiceOffset.x,
      this.cellCenter(gobbo.y) + SPRITE_PADDING + this.juiceOffset.y,
      SPRITE_SIZE,
      SPRITE_SIZE
    );
  }

  renderWall(wall) {
    this.game.drawImage(
      ASSETS.SPRITE.CRATE,
      this.cellCenter(wall.x) + SPRITE_PADDING + this.juiceOffset.x,
      this.cellCenter(wall.y) + SPRITE_PADDING + this.juiceOffset.y,
      SPRITE_SIZE,
      SPRITE_SIZE
    );
  }

  isInAimArea(x, y, lookup) {
    return !this.isOutOfBounds(x, y) && lookup[x][y];
  }

  renderAimAreas() {
    const aimAreaLookup = new Array(GRID_SIZE)
      .fill(null)
      .map(() => new Array(GRID_SIZE).fill(false));

    const areas = this.state.aimArea
      .map((area) => area.add(this.state.player))
      .filter((area) => !this.isOutOfBounds(area.x, area.y));

    if (areas.length == 0) return;

    areas.forEach((area) => {
      aimAreaLookup[area.x][area.y] = true;
      this.renderAimArea(area);
      if (this.animating === Animation.EXPLODING) {
        this.renderExplosion(
          this.cellCenter(area.x) + this.juiceOffset.x,
          this.cellCenter(area.y) + this.juiceOffset.y,
          this.frame
        );
      }
    });

    const outline = new Path2D();

    areas.forEach((area) => {
      if (!this.isInAimArea(area.x - 1, area.y, aimAreaLookup)) {
        outline.moveTo(
          this.cellCenter(area.x) + this.juiceOffset.x,
          this.cellCenter(area.y) + this.juiceOffset.y
        );
        outline.lineTo(
          this.cellCenter(area.x) + this.juiceOffset.x,
          this.cellCenter(area.y + 1) + this.juiceOffset.y
        );
      }
      if (!this.isInAimArea(area.x + 1, area.y, aimAreaLookup)) {
        outline.moveTo(
          this.cellCenter(area.x + 1) + this.juiceOffset.x,
          this.cellCenter(area.y) + this.juiceOffset.y
        );
        outline.lineTo(
          this.cellCenter(area.x + 1) + this.juiceOffset.x,
          this.cellCenter(area.y + 1) + this.juiceOffset.y
        );
      }
      if (!this.isInAimArea(area.x, area.y - 1, aimAreaLookup)) {
        outline.moveTo(
          this.cellCenter(area.x) + this.juiceOffset.x,
          this.cellCenter(area.y) + this.juiceOffset.y
        );
        outline.lineTo(
          this.cellCenter(area.x + 1) + this.juiceOffset.x,
          this.cellCenter(area.y) + this.juiceOffset.y
        );
      }
      if (!this.isInAimArea(area.x, area.y + 1, aimAreaLookup)) {
        outline.moveTo(
          this.cellCenter(area.x) + this.juiceOffset.x,
          this.cellCenter(area.y + 1) + this.juiceOffset.y
        );
        outline.lineTo(
          this.cellCenter(area.x + 1) + this.juiceOffset.x,
          this.cellCenter(area.y + 1) + this.juiceOffset.y
        );
      }
    });

    const leftmostCellPos = areas.reduce(
      (min, area) => (area.x < min ? area.x : min),
      GRID_SIZE
    );
    const leftmostCell = areas.find((area) => area.x === leftmostCellPos);

    // draw a line from THE MIDDLE OF THE MAGIC STAFF at (28, 12)

    const magicStaffX = (27.5 / 32) * SPRITE_SIZE + SPRITE_PADDING;
    const magicStaffY = (11.5 / 32) * SPRITE_SIZE + SPRITE_PADDING;

    outline.moveTo(
      this.cellCenter(this.state.player.x) + magicStaffX + this.juiceOffset.x,
      this.cellCenter(this.state.player.y) + magicStaffY + this.juiceOffset.y
    );
    outline.lineTo(
      this.cellCenter(leftmostCell.x) + this.juiceOffset.x,
      this.cellCenter(leftmostCell.y + 0.5) + this.juiceOffset.y
    );

    this.game.drawPath(outline, {
      stroke: this.state.remainingBombs > 0 ? "#FF6F00" : "#808080A0",
      strokeWidth: 4,
    });
  }

  renderAimArea(area) {
    this.game.drawRect(
      this.cellCenter(area.x) + this.juiceOffset.x,
      this.cellCenter(area.y) + this.juiceOffset.y,
      SQUARE_SIZE,
      SQUARE_SIZE,
      { fill: this.state.remainingBombs > 0 ? "#ffa05766" : "#ababab66" }
    );
  }

  renderExplosion(x, y, frame, size = SQUARE_SIZE) {
    this.game.drawImage(ASSETS.SPRITE.EXPLOSION, x, y, size, size, {
      x: 32 * (frame % 4),
      y: 0,
      width: 32,
      height: 32,
    });
  }

  getDirVec(direction) {
    switch (direction) {
      case Direction.UP:
        return [0, -1];
        break;
      case Direction.DOWN:
        return [0, 1];
        break;
      case Direction.LEFT:
        return [-1, 0];
        break;
      case Direction.RIGHT:
        return [1, 0];
        break;
    }
    return [0, 0];
  }

  isOutOfBounds(x, y) {
    return x < 0 || x > 7 || y < 0 || y > 7;
  }

  verifyMoveBounds(srcX, srcY, moveX, moveY) {
    const newX = srcX + moveX;
    const newY = srcY + moveY;
    if (this.isOutOfBounds(newX, newY)) {
      return false;
    }
    if (this.state.walls.some((wall) => wall.x === newX && wall.y === newY)) {
      return false;
    }
    return true;
  }

  tryMove(src, moveX, moveY) {
    if (!this.verifyMoveBounds(src.x, src.y, moveX, moveY)) return false;
    src.x += moveX;
    src.y += moveY;
    return true;
  }

  bounceDirection(direction) {
    switch (direction) {
      case Direction.UP:
        return Direction.DOWN;
      case Direction.DOWN:
        return Direction.UP;
      case Direction.LEFT:
        return Direction.RIGHT;
      case Direction.RIGHT:
        return Direction.LEFT;
    }
    return direction;
  }

  // Game Logic
  makeMove(direction) {
    const dirVec = this.getDirVec(direction);
    const ok = this.tryMove(this.state.player, dirVec[0], dirVec[1]);
    if (!ok) return;

    // move gobbos
    this.state.gobbos.forEach((gobbo) => {
      if (!this.tryMove(gobbo, ...this.getDirVec(gobbo.direction))) {
        gobbo.direction = this.bounceDirection(gobbo.direction);
        this.tryMove(gobbo, ...this.getDirVec(gobbo.direction));
      }
    });

    this.checkLevelStatus();
  }

  // Handle player movement
  handleMovement(deltaX, deltaY) {
    if (
      this.state.player.x + deltaX < 0 ||
      this.state.player.x + deltaX > 7 ||
      this.state.player.y + deltaY < 0 ||
      this.state.player.y + deltaY > 7
    ) {
      return false;
    }

    this.state.player.x += deltaX;
    this.state.player.y += deltaY;
  }

  checkAimArea(x, y) {
    return this.state.aimArea.find((a) => a.x === x && a.y === y);
  }

  handleAction() {
    if (this.state.remainingBombs == 0) {
      return;
    }

    this.state.remainingBombs--;

    this.animating = Animation.EXPLODING;

    const gobbosToKill = [];

    this.state.gobbos.forEach((gobbo) => {
      const aim = this.checkAimArea(
        gobbo.x - this.state.player.x,
        gobbo.y - this.state.player.y
      );
      if (aim) {
        gobbosToKill.push([gobbo, aim]);
      }
    });

    gobbosToKill.forEach(([gobbo, aim]) => this.killGobbo(gobbo, aim));

    this.makeMove();
  }

  killGobbo(gobbo, aim) {
    this.state.gobbos = this.state.gobbos.filter((g) => g !== gobbo);
    switch (gobbo.hatType) {
      case HatType.REMOVE:
        this.state.aimArea = this.state.aimArea.filter(
          (a) => a.x !== aim.x || a.y !== aim.y
        );
        break;
      case HatType.HORIZONTAL:
        if (!this.checkAimArea(aim.x - 1, aim.y)) {
          this.state.aimArea.push(new Position(aim.x - 1, aim.y));
        }
        if (!this.checkAimArea(aim.x + 1, aim.y)) {
          this.state.aimArea.push(new Position(aim.x + 1, aim.y));
        }
        break;
      case HatType.VERTICAL:
        if (!this.checkAimArea(aim.x, aim.y - 1)) {
          this.state.aimArea.push(new Position(aim.x, aim.y - 1));
        }
        if (!this.checkAimArea(aim.x, aim.y + 1)) {
          this.state.aimArea.push(new Position(aim.x, aim.y + 1));
        }
        break;
    }
  }

  // Check if level is completed, failed, etc.
  checkLevelStatus() {
    if (this.state.gobbos.length === 0) {
      this.completeLevel();
    } else if (this.state.remainingBombs === 0) {
      this.restartLevel();
    }
  }

  // Level completion handler
  completeLevel() {
    this.animating = Animation.TRANSITION_OUT;
    this.frame = 0;
  }

  loadNextLevel() {
    this.currentLevel++;
    this.history = new LevelHistory(LEVELS[this.currentLevel]);
    this.animating = Animation.TRANSITION_IN;
    this.frame = 0;
  }

  // Level restart handler
  restartLevel() {
    this.state.turnCount = 0;

    // Reset level state here
  }
}
