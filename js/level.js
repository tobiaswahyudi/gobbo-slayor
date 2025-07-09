const HatType = {
  VERTICAL: "V",
  HORIZONTAL: "H",
  REMOVE: "X",
};

class LevelManager {
  constructor(game, titleString, levelState) {
    this.game = game;
    this.titleString = titleString;
    this.history = new LevelHistory(levelState);

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

    switch (keyCode) {
      case "ArrowUp":
      case "KeyW":
        this.history.copyTop();
        this.makeMove(Direction.UP);
        return true;
        break;
      case "ArrowDown":
      case "KeyS":
        this.history.copyTop();
        this.makeMove(Direction.DOWN);
        return true;
        break;
      case "ArrowLeft":
      case "KeyA":
        this.history.copyTop();
        this.makeMove(Direction.LEFT);
        return true;
        break;
      case "ArrowRight":
      case "KeyD":
        this.history.copyTop();
        this.makeMove(Direction.RIGHT);
        return true;
        break;
      case "Space":
        this.history.copyTop();
        this.handleAction();
        return true;
        break;
      // case "Escape":
      //   this.game.gameState.level = "selection";
      //   return true;
      case "KeyR":
        // this.history.pop();
        this.handleRestartHold();
        return true;
      case "KeyZ":
        // this.history.pop();
        this.history.pop();
        return true;
      default:
        // this.history.pop();
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

    drawCheckeredGrid(
      this.game,
      BOARD_PADDING + 0.5 * this.juiceOffset.x,
      BOARD_PADDING + 0.5 * this.juiceOffset.y,
      "#CFC6BD",
      "#E2D8D4"
    );

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

    this.renderSidebar();

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
    if (this.currentLevel <= 1 || this.currentLevel == 4) {
      this.game.drawImage(
        ASSETS.TUTORIAL.UNDO,
        32 + 3 * SQUARE_SIZE + 0.5 * this.juiceOffset.x,
        32 + 6 * SQUARE_SIZE + 0.5 * this.juiceOffset.y,
        SQUARE_SIZE,
        SQUARE_SIZE
      );
    }
    if (this.currentLevel == 4) {
      this.game.drawImage(
        ASSETS.TUTORIAL.RESTART,
        32 + 6 * SQUARE_SIZE + 0.5 * this.juiceOffset.x + SPRITE_PADDING,
        32 + 6 * SQUARE_SIZE + 0.5 * this.juiceOffset.y + SPRITE_PADDING,
        SPRITE_SIZE,
        SPRITE_SIZE
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

    if (this.currentLevel === 0) {
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

    this.state.render(
      this.game,
      BOARD_PADDING + this.juiceOffset.x,
      BOARD_PADDING + this.juiceOffset.y
    );

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
        32 + SQUARE_SIZE * 4.25,
        32 + SQUARE_SIZE * 4.125,
        {
          font: "40px Tiny5",
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

  // Game Logic
  makeMove(direction) {
    if (this.levelIsDone) return;
    const dirVec = this.getDirVec(direction);
    const ok = this.tryMove(this.state.player, dirVec[0], dirVec[1]);
    if (!ok) return;

    // move gobbos
    this.state.gobbos.forEach((gobbo) => {
      for (let tries = 0; tries < 2; tries++) {
        if (!this.tryMove(gobbo, ...this.getDirVec(gobbo.direction))) {
          gobbo.direction = oppositeDirection(gobbo.direction);
        } else {
          gobbo.lastMovedDirection = gobbo.direction;
          break;
        }
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
          cellCorner(area.x) + BOARD_PADDING + this.juiceOffset.x,
          cellCorner(area.y) + BOARD_PADDING + this.juiceOffset.y,
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
        cellCorner(gobbo.x) + BOARD_PADDING + HALF_SQUARE_SIZE,
        cellCorner(gobbo.y) + BOARD_PADDING + HALF_SQUARE_SIZE,
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

  renderSidebar() {
    const SIDEBAR_WIDTH = 224;
    const SIDEBAR_CENTER = 688;

    let topPosition = 32;

    this.game.drawRect(
      576 + this.juiceOffset.x * 0.5,
      32 + this.juiceOffset.y * 0.5,
      SIDEBAR_WIDTH,
      512,
      {
        fill: "#E2D8D4",
        stroke: "#BDAFA1",
        strokeWidth: 4,
      }
    );

    topPosition += 24;

    this.game.drawText(
      this.titleString,
      SIDEBAR_CENTER + this.juiceOffset.x,
      topPosition + this.juiceOffset.y,
      {
        color: "#000",
        font: "700 10px Edu-SA",
        align: "center",
      }
    );

    topPosition += 10;
    topPosition += 16;

    const titleFontSize = this.state.title.length > 10 ? 14 : 18;

    this.game.drawText(
      this.state.title,
      SIDEBAR_CENTER + this.juiceOffset.x,
      topPosition + this.juiceOffset.y,
      {
        color: "#000",
        font: `500 ${titleFontSize}px Edu-SA`,
        align: "center",
      }
    );

    topPosition += titleFontSize;
    topPosition += 12;

    this.game.drawRect(
      600 + this.juiceOffset.x,
      topPosition + this.juiceOffset.y,
      176,
      0,
      {
        fill: "",
        stroke: "#000",
        strokeWidth: 2,
      }
    );

    topPosition += 32;

    this.game.drawText(
      "Gobbos",
      612 + this.juiceOffset.x,
      topPosition - 8 + this.juiceOffset.y,
      {
        color: "#000",
        font: "500 16px Edu-SA",
        align: "left",
      }
    );

    this.game.drawImage(
      ASSETS.SPRITE.GOBBOS.MOVE,
      SIDEBAR_CENTER + this.juiceOffset.x,
      topPosition - 22 + this.juiceOffset.y,
      36,
      36
    );

    this.game.drawText(
      `×${this.state.gobbos.length}`,
      736 + this.juiceOffset.x,
      topPosition - 12 + this.juiceOffset.y,
      {
        color: "#000",
        font: "24px Tiny5",
        align: "left",
      }
    );

    topPosition += 40;

    const spellColor = this.state.remainingBombs == 0 ? "#808080" : "#000000";

    this.game.drawText(
      "Spells",
      612 + this.juiceOffset.x,
      topPosition - 8 + this.juiceOffset.y,
      {
        color: spellColor,
        font: "500 16px Edu-SA",
        align: "left",
      }
    );

    if (this.state.remainingBombs == 0) {
      this.game.ctx.filter = "grayscale(1) contrast(0.5) brightness(1.2)";
    }

    this.game.drawImage(
      ASSETS.UI.MANA,
      692 + this.juiceOffset.x,
      topPosition - 16 + this.juiceOffset.y,
      32,
      32
    );

    this.game.ctx.filter = "none";

    this.game.drawText(
      `×${this.state.remainingBombs}`,
      736 + this.juiceOffset.x,
      topPosition - 12 + this.juiceOffset.y,
      {
        color: spellColor,
        font: "24px Tiny5",
        align: "left",
      }
    );

    topPosition += 32;

    this.game.drawText(
      `Moves: ${this.state.turnCount}`,
      SIDEBAR_CENTER + this.juiceOffset.x,
      topPosition + this.juiceOffset.y,
      {
        color: "#000",
        font: "500 16px Edu-SA",
        align: "center",
      }
    );

    topPosition = 300;

    this.game.drawText(
      "Hat Gallery",
      SIDEBAR_CENTER + this.juiceOffset.x,
      topPosition + this.juiceOffset.y,
      {
        color: "#000",
        font: "500 16px Edu-SA",
        align: "center",
      }
    );

    topPosition += 16;
    topPosition += 12;

    this.game.drawRect(
      600 + this.juiceOffset.x,
      topPosition + this.juiceOffset.y,
      176,
      0,
      {
        fill: "",
        stroke: "#000",
        strokeWidth: 2,
      }
    );

    topPosition += 16;

    this.game.drawImage(
      ASSETS.UI.HAT[HatType.HORIZONTAL],
      SIDEBAR_CENTER - 64 - 12 + this.juiceOffset.x,
      topPosition + this.juiceOffset.y,
      64,
      64
    );

    this.game.drawImage(
      ASSETS.UI.HAT[HatType.REMOVE],
      SIDEBAR_CENTER + 12 + this.juiceOffset.x,
      topPosition + this.juiceOffset.y,
      64,
      64
    );

    topPosition += 64;
    topPosition += 12;

    this.game.drawImage(
      ASSETS.UI.HAT[HatType.VERTICAL],
      SIDEBAR_CENTER - 64 - 8 + this.juiceOffset.x,
      topPosition + this.juiceOffset.y,
      64,
      64
    );
  }

  renderPopupContent(game) {
    game.drawText(
      `LEVEL ${this.currentLevel}`,
      BOARD_PADDING + H_BOARD_SIZE,
      BOARD_PADDING + H_BOARD_SIZE - 56,
      {
        color: "#000",
        font: "bold 12px Edu-SA",
        align: "center",
      }
    );

    game.drawText(
      this.state.title,
      BOARD_PADDING + H_BOARD_SIZE,
      BOARD_PADDING + H_BOARD_SIZE - 24,
      {
        color: "#000",
        font: "500 18px Edu-SA",
        align: "center",
      }
    );

    game.drawText(
      "Gobbos",
      BOARD_PADDING + H_BOARD_SIZE - 64,
      BOARD_PADDING + H_BOARD_SIZE + 12,
      {
        color: "#000",
        font: "500 12px Edu-SA",
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
        font: "24px Tiny5",
        align: "left",
      }
    );

    game.drawText(
      "Spells",
      BOARD_PADDING + H_BOARD_SIZE + 64,
      BOARD_PADDING + H_BOARD_SIZE + 12,
      {
        color: "#000",
        font: "500 12px Edu-SA",
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
        font: "24px Tiny5",
        align: "left",
      }
    );
  }

  // Level completion handler
  triggerNextLevelTransition() {
    this.animations.push(
      new TransitionAnimation(TRANSITION_DIRECTION.OUT, () => {
        console.log("transitioning to zone", this.game.zoneMap.animations);
        this.game.zoneMap.animations.push(
          new TransitionAnimation(TRANSITION_DIRECTION.IN)
        );
        console.log("transitioning to zone", this.game.zoneMap.animations);
        this.game.scene = "zone";
      })
    );
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
  }
}
