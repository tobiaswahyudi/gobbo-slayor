const MOVE_ANIM_DUR = 4;

class LevelManager {
  constructor(game, titleString, levelState) {
    this.game = game;
    this.titleString = titleString;
    this.history = new LevelHistory(levelState);

    this.animations = [new TransitionAnimation(TRANSITION_DIRECTION.IN)];

    this.canHandleInput = true;
    this.restartHeldSince = null;

    this.juiceOffset = new Position(0, 0);

    this.levelIsDone = false;
    this.levelIsTransitioning = false;

    this.wizardMoveOffset = new Position(0, 0);
    this.gobboMoveOffsets = [];
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
        if (!this.makeMove(Direction.UP)) this.history.pop();
        return true;
        break;
      case "ArrowDown":
      case "KeyS":
        this.history.copyTop();
        if (!this.makeMove(Direction.DOWN)) this.history.pop();
        return true;
        break;
      case "ArrowLeft":
      case "KeyA":
        this.history.copyTop();
        if (!this.makeMove(Direction.LEFT)) this.history.pop();
        return true;
        break;
      case "ArrowRight":
      case "KeyD":
        this.history.copyTop();
        if (!this.makeMove(Direction.RIGHT)) this.history.pop();
        return true;
        break;
      case "Space":
        this.history.copyTop();
        if (!this.handleAction()) this.history.pop();
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
      case "Escape":
        this.returnToZone(false);
        return true;
        break;
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
    this.renderTutorial();

    const offsets = {
      wiz: this.wizardMoveOffset,
      gobbos: this.gobboMoveOffsets,
    };

    // console.log(JSON.stringify(offsets, null, 2));

    this.state.render(
      this.game,
      BOARD_PADDING + this.juiceOffset.x,
      BOARD_PADDING + this.juiceOffset.y,
      offsets
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

  renderTutorial() {
    if (this.currentLevel !== 0) return;

    this.game.ctx.globalAlpha = 0.4;
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
    this.game.drawImage(
      ASSETS.TUTORIAL.UNDO,
      32 + 3 * SQUARE_SIZE + 0.5 * this.juiceOffset.x,
      32 + 6 * SQUARE_SIZE + 0.5 * this.juiceOffset.y,
      SQUARE_SIZE,
      SQUARE_SIZE
    );
    this.game.drawImage(
      ASSETS.TUTORIAL.RESTART,
      32 + 4 * SQUARE_SIZE + 0.5 * this.juiceOffset.x + SPRITE_PADDING,
      32 + 6 * SQUARE_SIZE + 0.5 * this.juiceOffset.y + SPRITE_PADDING,
      SPRITE_SIZE,
      SPRITE_SIZE
    );

    this.game.drawImage(
      ASSETS.TUTORIAL.TOOLTIP,
      480 + 0.5 * this.juiceOffset.x,
      96 + 0.5 * this.juiceOffset.y,
      64,
      128
    );
    this.game.ctx.globalAlpha = 1;
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
    if (!ok) return false;

    this.wizardMoveOffset = this.getMovementOffsetStart(direction);

    // move gobbos
    this.state.gobbos.forEach((gobbo) => {
      for (let tries = 0; tries < 2; tries++) {
        if (this.tryMove(gobbo, ...this.getDirVec(gobbo.direction))) {
          gobbo.lastMovedDirection = gobbo.direction;
          break;
        } else {
          gobbo.direction = oppositeDirection(gobbo.direction);
        }
      }
    });

    this.pushMovementAnimations(direction);

    this.checkLevelStatus();

    return true;
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

  checkAimArea(pos) {
    return this.state.aimArea.lookup.has(pos);
  }

  handleAction() {
    if (this.state.remainingBombs == 0) {
      return false;
    }

    this.state.remainingBombs--;

    const areas = this.state.aimArea.cells
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
      this.animations.push(
        new JuiceAnimation(this.juiceOffset, EXPLOSION_FRAMES, 20)
      );
    });

    const gobbosToKill = [];

    this.state.gobbos.forEach((gobbo) => {
      const pos = gobbo.add(this.state.player.negate());
      if (this.checkAimArea(pos)) gobbosToKill.push([gobbo, pos]);
    });

    gobbosToKill.forEach(([gobbo, aim]) => this.killGobbo(gobbo, aim));

    this.makeMove();

    return true;
  }

  pushMovementAnimations(direction) {
    // console.log(direction, new Position(...this.getDirVec(direction)).scale(SQUARE_SIZE))
    this.animations.push(
      new MotionTweenAnimation(
        this.wizardMoveOffset,
        this.getMovementOffsetStart(direction),
        new Position(0, 0),
        MOVE_ANIM_DUR,
        {
          blocksInput: true,
        }
      )
    );

    this.gobboMoveOffsets = [];

    this.state.gobbos.forEach((gobbo) => {
      const gobPos = this.getMovementOffsetStart(gobbo.lastMovedDirection);
      this.gobboMoveOffsets.push(gobPos);
      this.animations.push(
        new MotionTweenAnimation(
          gobPos,
          gobPos.clone(),
          new Position(0, 0),
          MOVE_ANIM_DUR
        )
      );
    });
  }

  getMovementOffsetStart(direction) {
    return new Position(...this.getDirVec(oppositeDirection(direction))).scale(
      SQUARE_SIZE
    );
  }

  killGobbo(gobbo, aim) {
    this.state.gobbos = this.state.gobbos.filter((g) => g !== gobbo);
    gobbo.hat.gobboKilled(
      this.state.aimArea,
      gobbo.add(this.state.player.negate())
    );
    this.animations.push(
      new EtherealAnimation(
        cellCorner(gobbo.x) + BOARD_PADDING + HALF_SQUARE_SIZE,
        cellCorner(gobbo.y) + BOARD_PADDING + HALF_SQUARE_SIZE,
        gobbo.hat.display,
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
      this.returnToZone(true);
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
  returnToZone(finished = false) {
    if (finished) {
      this.game.progress.setProgress(
        this.game.currentZone.id,
        this.game.currentLevel.id,
        this.state.turnCount
      );
    }
    this.animations.push(
      new TransitionAnimation(TRANSITION_DIRECTION.OUT, () => {
        this.game.zoneMap.animations.push(
          new TransitionAnimation(TRANSITION_DIRECTION.IN)
        );
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
