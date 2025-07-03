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

    this.animations = [];

    this.canHandleInput = true;
    this.restartHeldSince = null;

    this.juiceOffset = new Position(0, 0);

    this.levelIsDone = false;
    this.levelIsTransitioning = false;
  }

  get state() {
    return this.history.getCurrent();
  }

  // Level Input Handling
  handleGameInput(keyCode) {
    if (keyCode == "KeyUp") {
      this.restartHeldSince = null;
      this.canHandleInput = true;
      return true;
    }

    if (!this.canHandleInput) return;

    const inputBlockedByAnimation = this.animations.some((a) => a.blocksInput);
    this.animations.forEach((a) => {
      if (a.needsInput) a.handleInput(keyCode);
    });

    if (inputBlockedByAnimation) return true;

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
      // case "Escape":
      //   this.game.gameState.level = "selection";
      //   return true;
      case "KeyR":
        this.history.pop();
        this.handleRestartHold();
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
    // check now, because we need a re-render if an animation finishes this frame.
    const NEEDS_RE_RENDER = this.animations.length > 0;

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
      `×${this.state.gobbos.length}`,
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
      `×${this.state.remainingBombs}`,
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

    this.animations.forEach((anim) => anim.tick(this.game));
    // console.log("anims pre-filter", this.animations);
    this.animations = this.animations.filter((anim) => !anim.finished);

    if (this.restartHeldSince) {
      const millisDelta = new Date().getTime() - this.restartHeldSince;

      const MAX_OPACITY = 0.75;
      const VIGNETTE_OPAQUE_TIME = 600;
      const TOOLTIP_OPAQUE_TIME = 600;

      const COUNT = 3;
      const MILLIS_PER_COUNT = 500;

      const vignetteOpacity = Math.min(
        MAX_OPACITY * (millisDelta / VIGNETTE_OPAQUE_TIME),
        MAX_OPACITY
      );

      const tooltipOpacity = Math.min(
        MAX_OPACITY * (millisDelta / TOOLTIP_OPAQUE_TIME),
        MAX_OPACITY
      );

      this.game.ctx.globalAlpha = vignetteOpacity;

      this.game.drawRect(
        32 + this.juiceOffset.x * 0.5,
        32 + this.juiceOffset.y * 0.5,
        512,
        512,
        {
          fill: "#CFC6BD",
        }
      );

      this.game.ctx.globalAlpha = tooltipOpacity;

      this.game.drawImage(
        ASSETS.UI.RESTART,
        32 + SQUARE_SIZE * 2,
        32 + SQUARE_SIZE * 3,
        256,
        128
      );

      const count = COUNT - Math.floor(millisDelta / MILLIS_PER_COUNT);

      this.game.drawText(
        count,
        32 + SQUARE_SIZE * 4.3,
        32 + SQUARE_SIZE * 4.1,
        {
          font: "bold 40px Courier New",
          color: "#000",
        }
      );

      this.game.ctx.globalAlpha = 1;

      if (count == 0) {
        this.restartLevel();
        return true;
      }
    }

    this.checkLevelDone();

    return NEEDS_RE_RENDER;
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
    if (this.levelIsDone) return;
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

    const areas = this.state.aimArea
      .map((area) => area.add(this.state.player))
      .filter((area) => !this.isOutOfBounds(area.x, area.y));

    areas.forEach((area) => {
      this.animations.push(
        new ExplosionAnimation(
          this.cellCenter(area.x) + this.juiceOffset.x,
          this.cellCenter(area.y) + this.juiceOffset.y,
          SQUARE_SIZE,
          this.juiceOffset
        )
      );
    });

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
    this.animations.push(
      new EtherealAnimation(
        this.cellCenter(gobbo.x) + SQUARE_SIZE * 0.5,
        this.cellCenter(gobbo.y) + SQUARE_SIZE * 0.5,
        ASSETS.UI.HAT[gobbo.hatType],
        SPRITE_SIZE
      )
    );
  }

  // Check if level is completed, failed, etc.
  checkLevelStatus() {
    if (this.state.gobbos.length === 0) {
      this.levelIsDone = true;
    }
  }

  checkLevelDone() {
    if (
      this.levelIsDone &&
      !this.levelIsTransitioning &&
      this.animations.length === 0
    ) {
      this.levelIsTransitioning = true;
      this.triggerNextLevelTransition();
    }
  }

  renderPopupContent(game) {
    game.drawText(
      `Level ${this.currentLevel}`,
      BOARD_PADDING + H_BOARD_SIZE,
      BOARD_PADDING + H_BOARD_SIZE - 64,
      {
        color: "#000",
        font: "bold 24px Courier New",
        align: "center",
      }
    );

    game.drawText(
      this.state.title,
      BOARD_PADDING + H_BOARD_SIZE,
      BOARD_PADDING + H_BOARD_SIZE - 32,
      {
        color: "#000",
        font: "16px Courier New",
        align: "center",
      }
    );

    game.drawText(
      "Gobbos",
      BOARD_PADDING + H_BOARD_SIZE - 64,
      BOARD_PADDING + H_BOARD_SIZE + 12,
      {
        color: "#000",
        font: "12px Courier New",
        align: "center",
      }
    );

    this.game.drawImage(
      ASSETS.SPRITE.GOBBOS.MOVE,
      BOARD_PADDING + H_BOARD_SIZE - 64 - 36,
      BOARD_PADDING + H_BOARD_SIZE + 20,
      32,
      32
    );

    this.game.drawText(
      `×${this.state.gobbos.length}`,
      BOARD_PADDING + H_BOARD_SIZE - 64,
      BOARD_PADDING + H_BOARD_SIZE + 28,
      {
        color: "#000",
        font: "24px Courier New",
        align: "left",
      }
    );

    game.drawText(
      "Spells",
      BOARD_PADDING + H_BOARD_SIZE + 64,
      BOARD_PADDING + H_BOARD_SIZE + 12,
      {
        color: "#000",
        font: "12px Courier New",
        align: "center",
      }
    );

    this.game.drawImage(
      ASSETS.UI.MANA,
      BOARD_PADDING + H_BOARD_SIZE + 64 - 32,
      BOARD_PADDING + H_BOARD_SIZE + 28,
      24,
      24
    );

    this.game.drawText(
      `×${this.state.remainingBombs}`,
      BOARD_PADDING + H_BOARD_SIZE + 64,
      BOARD_PADDING + H_BOARD_SIZE + 28,
      {
        color: "#000",
        font: "24px Courier New",
        align: "left",
      }
    );
  }

  // Level completion handler
  triggerNextLevelTransition() {
    this.animations.push(
      new TransitionAnimation(TRANSITION_DIRECTION.OUT, () => {
        this.loadNextLevel();
        this.animations.push(
          new PopupAnimation(
            320,
            128,
            this.renderPopupContent.bind(this),
            () => {
              this.animations.push(
                new TransitionAnimation(TRANSITION_DIRECTION.IN)
              );
            }
          )
        );
      })
    );
  }

  loadNextLevel() {
    this.currentLevel++;
    this.history = new LevelHistory(LEVELS[this.currentLevel]);
    this.levelIsDone = false;
    this.levelIsTransitioning = false;
  }

  handleRestartHold() {
    if (!this.restartHeldSince) {
      this.restartHeldSince = new Date().getTime();
    }
  }

  // Level restart handler
  restartLevel() {
    this.state.turnCount = 0;
    this.canHandleInput = false;
    this.restartHeldSince = null;
    this.history.reset();
    this.history;
  }
}
