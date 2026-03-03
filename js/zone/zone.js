const ZONE_WIZ_SIZE = 48;
const ZONE_WIZ_PADDING = (SQUARE_SIZE - ZONE_WIZ_SIZE) * 0.5;

const SIDEBAR_WIDTH = 224;
const SIDEBAR_CENTER = 688;
const SIDEBAR_INNER_WIDTH = 176;

// update these when UI changed. Easier than runtime computing.
const SILVER_STAR_X = SIDEBAR_CENTER - 22 - 42 - 6;
const GOLD_STAR_X = SIDEBAR_CENTER - 22 + 62 + 6;
const STARS_Y = 104;

const STAR_SUCCESS_SIZE = 40;

class ZoneMap {
  constructor(game) {
    this.game = game;
    this.state = ZONE_LEVELS[this.currentLocation.id].map;

    const numLevels = ZONE_LEVELS[this.currentLocation.id].levels.length;
    const specialTiles = {};

    this.silverStars = this.game.progress.getLevelSilver(
      this.currentLocation.id,
    );
    this.goldStars = this.game.progress.getLevelGold(this.currentLocation.id);

    for (let i = 0; i < numLevels; i++) {
      const numString = String(i + 1).padStart(2, "0");
      specialTiles[numString] = [
        LevelTile,
        numString,
        this.currentLocation.id,
        i,
      ];
    }

    for (let i = 1; i <= numLevels; i++) {
      // Up to 16 levels in a zone
      const numString = i.toString(16);
      specialTiles["L" + numString] = [
        LockTile,
        i,
        this.currentLocation.id,
        this.game.progress,
      ];
    }

    this.state.parse(specialTiles);
    this.currentLevelTile = null;

    this.animations = new AnimationManager(game, this.state);

    this.juiceOffset = new Position(0, 0);

    this.silverAnimation = false;
    this.goldAnimation = false;

    this.silverTextScale = new Position(1, 1);
    this.goldTextScale = new Position(1, 1);

    this.silverTextJuice = new Position(0, 0);
    this.goldTextJuice = new Position(0, 0);
  }

  get currentLocation() {
    return this.game.currentZone;
  }

  handleInput(keyCode) {
    const inputBlockedByAnimation = this.animations.inputBlockedByAnimation;
    if (inputBlockedByAnimation) return true;

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
        this.goToLevel();
        return true;
        break;
      case "Escape":
        this.animations.push(
          new TransitionAnimation(
            TRANSITION_DIRECTION.OUT,
            {
              width: GAME_WIDTH_NET,
              height: GAME_HEIGHT_NET,
              center: new Position(GAME_WIDTH / 2, GAME_HEIGHT / 2),
            },
            () => {
              this.game.worldMap.animations.push(
                new TransitionAnimation(TRANSITION_DIRECTION.IN, {
                  width: GAME_WIDTH,
                  height: GAME_HEIGHT,
                  center: new Position(GAME_WIDTH / 2, GAME_HEIGHT / 2),
                }),
              );
              this.game.scene = "world";
            },
          ),
        );
        return true;
        break;
      default:
        return false;
    }
  }

  // Zone Map Rendering
  render() {
    const { width, height } = this.game;

    // Game area background
    this.game.drawRect(0, 0, width, height, { fill: "#C5BAB5" });
    const hadAnimations = this.animations.needsRerender;

    drawCheckeredGrid(
      this.game,
      BOARD_PADDING + 0.5 * this.juiceOffset.x,
      BOARD_PADDING + 0.5 * this.juiceOffset.y,
      "#6a9848",
      "#7fb259",
      this.state.size,
    );

    // World Outline
    this.game.drawRect(32, 32, 512, 512, {
      fill: "",
      stroke: "#BDAFA1",
      strokeWidth: 4,
    });

    this.state.render(
      this.game,
      BOARD_PADDING + this.juiceOffset.x,
      BOARD_PADDING + this.juiceOffset.y,
    );
    // this.state.specialTiles.forEach((tile) => tile.render(this.game));

    this.currentLevelTile = this.state.specialTiles.find(
      (tile) => tile.x == this.state.player.x && tile.y == this.state.player.y,
    );

    if (!(this.currentLevelTile instanceof LevelTile)) {
      this.currentLevelTile = null;
    }

    let topPosition = this.renderSidebarBase();
    if (this.currentLevelTile) {
      this.renderLevelSidebar(topPosition);
    } else {
      this.renderZoneSidebar(topPosition);
    }

    this.animations.tick();

    if (this.silverAnimation) {
      this.game.drawImage(
        ASSETS.UI.STAR.SILVER,
        this.silverAnimation.x,
        this.silverAnimation.y,
        STAR_SUCCESS_SIZE,
        STAR_SUCCESS_SIZE,
      );
    }
    if (this.goldAnimation) {
      this.game.drawImage(
        ASSETS.UI.STAR.GOLD,
        this.goldAnimation.x,
        this.goldAnimation.y,
        STAR_SUCCESS_SIZE,
        STAR_SUCCESS_SIZE,
      );
    }

    // return true;
    return hadAnimations;
  }

  renderWall(wall) {
    this.game.drawImage(
      ASSETS.SPRITE.CRATE,
      cellCorner(wall.x) + BOARD_PADDING + SPRITE_PADDING + this.juiceOffset.x,
      cellCorner(wall.y) + BOARD_PADDING + SPRITE_PADDING + this.juiceOffset.y,
      SPRITE_SIZE,
      SPRITE_SIZE,
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

  verifyMoveBounds(srcX, srcY, moveX, moveY) {
    const newX = srcX + moveX;
    const newY = srcY + moveY;
    if (isOutOfBounds(this.state.size, newX, newY)) {
      return false;
    }
    if (this.state.crates.some((wall) => wall.x === newX && wall.y === newY)) {
      return false;
    }
    if (this.state.blocks.some((wall) => wall.x === newX && wall.y === newY)) {
      return false;
    }
    if (
      this.state.specialTiles.some(
        (tile) =>
          tile.x === newX &&
          tile.y === newY &&
          tile instanceof LockTile &&
          tile.closed,
      )
    ) {
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
    const dirVec = this.getDirVec(direction);
    const ok = this.tryMove(this.state.player, dirVec[0], dirVec[1]);
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

  renderSidebarBase() {
    let topPosition = 32;

    this.game.drawRect(576, 32, SIDEBAR_WIDTH, 512, {
      fill: "#E2D8D4",
      stroke: "#BDAFA1",
      strokeWidth: 4,
    });

    topPosition += 24;

    this.game.drawText(
      this.currentLocation.title,
      SIDEBAR_CENTER,
      topPosition,
      {
        color: "#000",
        font: "700 10px Edu-SA",
        align: "center",
      },
    );

    topPosition += 10;
    topPosition += 12;

    const titleFontSize = this.currentLocation.subtitle > 10 ? 14 : 18;

    this.game.drawText(
      this.currentLocation.subtitle,
      SIDEBAR_CENTER,
      topPosition,
      {
        color: "#000",
        font: `500 ${titleFontSize}px Edu-SA`,
        align: "center",
      },
    );

    topPosition += titleFontSize;
    topPosition += 22;
    return topPosition;
  }

  renderLevelSidebar(topPosition) {
    const level = this.currentLevelTile.level;

    const isZoneDone = this.silverStars == this.currentLocation.levels;
    const isGoldDone = this.goldStars == this.currentLocation.levels;
    
    this.game.ctx.save();
    this.game.ctx.translate(SIDEBAR_CENTER - 40, topPosition - 4)
    this.game.ctx.translate(this.silverTextJuice.x, this.silverTextJuice.y)
    this.game.ctx.scale(this.silverTextScale.x, this.silverTextScale.x)

    this.game.drawImage(
      ASSETS.UI.STAR.SILVER,
      -30,
      -8,
      16,
      16,
    );
    this.game.drawText(
      `× ${this.silverStars}/${this.currentLocation.levels}`,
      -8,
      -8,
      {
        color: isZoneDone ? "#551280" : "#000",
        font: `500 16px Tiny5`,
        align: "left",
      },
    );

    this.game.ctx.restore();

    this.game.ctx.save();
    this.game.ctx.translate(SIDEBAR_CENTER + 44, topPosition - 4)
    this.game.ctx.translate(this.goldTextJuice.x, this.goldTextJuice.y)
    this.game.ctx.scale(this.goldTextScale.x, this.goldTextScale.x)

    this.game.drawImage(
      ASSETS.UI.STAR.GOLD,
      -30,
      -8,
      16,
      16,
    );
    this.game.drawText(
      `× ${this.goldStars}/${this.currentLocation.levels}`,
      -8,
      -8,
      {
        color: isGoldDone ? "#551280" : "#000",
        font: `500 16px Tiny5`,
        align: "left",
      },
    );

    this.game.ctx.restore();

    topPosition += 16;

    this.game.drawRect(600, topPosition, 176, 0, {
      fill: "",
      stroke: "#000",
      strokeWidth: 2,
    });

    topPosition += 20;

    this.game.drawText(
      `LEVEL ${this.currentLevelTile.number}`,
      SIDEBAR_CENTER,
      topPosition,
      {
        color: "#000",
        font: "700 10px Edu-SA",
        align: "center",
      },
    );

    topPosition += 10;
    topPosition += 16;

    const titleFontSize =
      level.title.length < 12 ? 22 : level.title.length < 20 ? 18 : 14;

    this.game.drawText(level.title, SIDEBAR_CENTER, topPosition, {
      color: "#000",
      font: `500 ${titleFontSize}px Edu-SA`,
      align: "center",
    });

    topPosition += titleFontSize;
    topPosition += 16;

    // this.game.drawRect(600, topPosition, 176, 0, {
    //   fill: "",
    //   stroke: "#000",
    //   strokeWidth: 2,
    // });

    // topPosition += 24;

    this.game.ctx.save();
    const scale = SIDEBAR_INNER_WIDTH / BOARD_SIZE;
    this.game.ctx.scale(scale, scale);

    drawCheckeredGrid(
      this.game,
      600 / scale,
      topPosition / scale,
      "#CFC6BD",
      "#E2D8D4",
      this.currentLevelTile.level.size,
    );
    this.currentLevelTile.level.render(
      this.game,
      600 / scale,
      topPosition / scale,
      {},
      true,
    );

    this.game.drawRect(
      600 / scale,
      topPosition / scale,
      BOARD_SIZE,
      BOARD_SIZE,
      {
        fill: "",
        stroke: "#000",
        strokeWidth: 4,
      },
    );

    this.game.ctx.restore();

    topPosition += SIDEBAR_INNER_WIDTH;
    topPosition += 28;

    const levelProgress = this.game.progress.getProgress(
      this.currentLocation.id,
      this.currentLevelTile.level.id,
    );

    if (levelProgress.completed) {
      this.game.drawImage(
        ASSETS.UI.STAR.SILVER,
        SIDEBAR_CENTER - 60,
        topPosition - 12,
        24,
        24,
      );

      this.game.drawText(`Completed!`, SIDEBAR_CENTER - 24, topPosition - 4, {
        color: "#000",
        font: `500 16px Edu-SA`,
        align: "left",
      });

      const hasGold =
        levelProgress.bestMoves <= this.currentLevelTile.level.bestMoves;

      if (hasGold) {
        topPosition += 36;

        this.game.drawImage(
          ASSETS.UI.STAR.GOLD,
          SIDEBAR_CENTER - 60,
          topPosition - 12,
          24,
          24,
        );

        this.game.drawText(
          `Gold star!!!   :0`,
          SIDEBAR_CENTER - 24,
          topPosition - 4,
          {
            color: "#000",
            font: `500 16px Edu-SA`,
            align: "left",
          },
        );
      }

      topPosition += 24;

      this.game.drawText(
        `Best solved in ${levelProgress.bestMoves} moves`,
        SIDEBAR_CENTER,
        topPosition,
        {
          color: "#000",
          font: `500 12px Edu-SA`,
          align: "center",
        },
      );

      topPosition += 48;

      if (!hasGold) {
        this.game.drawImage(
          ASSETS.UI.STAR.GOLD,
          SIDEBAR_CENTER - 30,
          topPosition - 10,
          24,
          24,
        );

        this.game.drawText(
          "For a          Gold star:",
          SIDEBAR_CENTER,
          topPosition,
          {
            color: "#000",
            font: `500 16px Edu-SA`,
            align: "center",
            lineSpacing: 24,
          },
        );

        topPosition += 24;

        this.game.drawText(
          `Solve in ${this.currentLevelTile.level.bestMoves} moves`,
          SIDEBAR_CENTER,
          topPosition,
          {
            color: "#000",
            font: `500 12px Edu-SA`,
            align: "center",
          },
        );
        topPosition += 24;
      }
    } else {
      this.game.drawText(`Not yet solved`, SIDEBAR_CENTER, topPosition, {
        color: "#000",
        font: `500 16px Edu-SA`,
        align: "center",
      });

      topPosition += 48;

      this.game.drawImage(
        ASSETS.UI.SPACEBAR,
        SIDEBAR_CENTER + 4,
        topPosition - 6,
      );

      this.game.drawText(
        "Press          \nto start level".split("\n"),
        SIDEBAR_CENTER,
        topPosition - 8,
        {
          color: "#000",
          font: `500 16px Tiny5`,
          align: "center",
        },
      );
    }
  }

  renderZoneSidebar(topPosition) {
    topPosition += 12;

    this.game.drawImage(
      ASSETS.UI.STAR.SILVER,
      SIDEBAR_CENTER - 32 - 6,
      topPosition - 14,
      24,
      24,
    );

    const isZoneDone = this.silverStars == this.currentLocation.levels;

    this.game.drawText(
      `× ${this.silverStars}/${this.currentLocation.levels}`,
      SIDEBAR_CENTER - 6,
      topPosition - 10,
      {
        color: isZoneDone ? "#551280" : "#000",
        font: `500 24px Tiny5`,
        align: "left",
      },
    );

    topPosition += 36;

    this.game.drawImage(
      ASSETS.UI.STAR.GOLD,
      SIDEBAR_CENTER - 32 - 6,
      topPosition - 14,
      24,
      24,
    );

    this.game.drawText(
      `× ${this.goldStars}/${this.currentLocation.levels}`,
      SIDEBAR_CENTER - 6,
      topPosition - 10,
      {
        color: isZoneDone ? "#551280" : "#000",
        font: `500 24px Tiny5`,
        align: "left",
      },
    );

    topPosition += 32;

    this.game.drawRect(600, topPosition, 176, 0, {
      fill: "",
      stroke: "#000",
      strokeWidth: 2,
    });

    topPosition += 32;

    topPosition = this.game.drawText(
      this.currentLocation.text.split("\n"),
      SIDEBAR_CENTER,
      topPosition,
      {
        color: "#000",
        font: `500 12px Edu-SA`,
        align: "center",
        lineSpacing: 20,
      },
    );

    topPosition += 32;

    topPosition = this.game.drawText(
      this.currentLocation.cta.split("\n"),
      SIDEBAR_CENTER,
      topPosition,
      {
        color: "#000",
        font: `500 12px Edu-SA`,
        align: "center",
        lineSpacing: 16,
      },
    );
  }

  spawnProgressStar(isGold, callback) {
    const FLOAT_UP_FRAMES = 10;
    const GO_TO_TARGET_FRAMES = 12;
    const TEXT_BLOWUP_SCALE = 2.5;
    const TEXT_JUICE_AMPLITUDE = 16;
    const TEXT_SHRINK_FRAMES = 14;

    const TARGET = new Position(
      isGold ? GOLD_STAR_X : SILVER_STAR_X,
      STARS_Y,
    ).add(new Position(-STAR_SUCCESS_SIZE / 2, -STAR_SUCCESS_SIZE / 2));

    // starting position is the screen space position of the player.
    const pos = this.state.player
      .add(new Position(0.5, 0.5))
      .scale((DEFAULT_SIZE / this.state.size) * SQUARE_SIZE)
      .add(
        new Position(
          BOARD_PADDING - STAR_SUCCESS_SIZE / 2,
          BOARD_PADDING - STAR_SUCCESS_SIZE / 2,
        ),
      );

    const targetAnim = isGold ? "goldAnimation" : "silverAnimation";
    this[targetAnim] = pos;

    const targetTextScale = isGold ? "goldTextScale" : "silverTextScale";
    const targetTextJuice = isGold ? "goldTextJuice" : "silverTextJuice";

    const upABit = pos.add(new Position(0, -0.6 * SQUARE_SIZE));

    this.animations.push(
      new MotionTweenAnimation(
        this[targetAnim],
        pos.clone(),
        upABit,
        FLOAT_UP_FRAMES,
        {
          ease: 0.3,
          callback: () => {
            this.animations.push(
              new MotionTweenAnimation(
                this[targetAnim],
                upABit.clone(),
                TARGET,
                GO_TO_TARGET_FRAMES,
                {
                  ease: 2,
                  callback: () => {
                    if (isGold) {
                      this.goldStars++;
                    } else {
                      this.silverStars++;
                    }
                    this[targetAnim] = undefined;
                    this.animations.push(
                      new MotionTweenAnimation(this[targetTextScale], new Position(TEXT_BLOWUP_SCALE, 1), new Position(1, 1), TEXT_SHRINK_FRAMES)
                    );
                    this.animations.push(
                      new JuiceAnimation(this[targetTextJuice], TEXT_JUICE_AMPLITUDE, TEXT_SHRINK_FRAMES)
                    );
                    if (callback) callback();
                  },
                  blocksInput: true
                },
              ),
            );
          },
          blocksInput: true
        },
      ),
    );
  }

  dismantleLock(lock) {}

  returnFromLevel() {
    const gotSilver = this.silverStars !=
      this.game.progress.getLevelSilver(this.currentLocation.id)
    const gotGold = this.goldStars != this.game.progress.getLevelGold(this.currentLocation.id);
    const callback = !gotGold ? undefined : () => this.spawnProgressStar(true);
    if(gotSilver) {
      this.spawnProgressStar(false, callback);
    } else if(gotGold) {
      this.spawnProgressStar(true);
    }
  }

  goToLevel() {
    if (!this.currentLevelTile) return;
    this.game.currentLevel = this.currentLevelTile.level;
    this.game.levelManager = new LevelManager(
      this.game,
      `${this.currentLocation.title}  -  LEVEL ${this.currentLevelTile.number}`,
      this.currentLevelTile.level,
    );

    if (Number(this.currentLevelTile.number) <= 1) {
      this.game.levelManager.currentLevel = 0;
    }

    this.animations.push(
      new TransitionAnimation(TRANSITION_DIRECTION.OUT, {}, () => {
        this.game.scene = "level";
      }),
    );
  }
}
