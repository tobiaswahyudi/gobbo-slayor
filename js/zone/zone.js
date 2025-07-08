const ZONE_WIZ_SIZE = 48;
const ZONE_WIZ_PADDING = (SQUARE_SIZE - ZONE_WIZ_SIZE) * 0.5;

class ZoneMap {
  constructor(game) {
    this.game = game;
    this.state = ZONE_LEVELS[this.currentLocation.id].map;

    const numLevels = ZONE_LEVELS[this.currentLocation.id].levels.length;
    const specialTiles = Object.fromEntries(
      new Array(numLevels).fill(0).map((_, i) => {
        const numString = String(i + 1).padStart(2, "0");
        return [numString, [LevelTile, numString, this.currentLocation.id, i]];
      })
    );

    this.state.parse(specialTiles);
    this.currentLevel = null;

    this.animations = [new TransitionAnimation(TRANSITION_DIRECTION.IN)];

    this.juiceOffset = new Position(0, 0);

    this.silverAnimation = false;
    this.goldAnimation = false;
  }

  get currentLocation() {
    return this.game.currentZone;
  }

  handleInput(keyCode) {
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
        this.game.scene = "world";
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

    // Draw a 8x8 grid of 64px squares. They alternate between 6a9848 and 7fb259
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const color = (i + j) % 2 === 0 ? "#6a9848" : "#7fb259";
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

    // World Outline
    this.game.drawRect(32, 32, 512, 512, {
      fill: "",
      stroke: "#BDAFA1",
      strokeWidth: 4,
    });

    this.state.specialTiles.forEach((tile) => tile.render(this.game));

    this.currentLevel = this.state.specialTiles.find(
      (tile) => tile.x == this.state.player.x && tile.y == this.state.player.y
    );

    if (this.currentLevel) {
      this.renderLevelSidebar();
    } else {
      this.renderZoneSidebar();
    }

    this.game.drawImage(
      ASSETS.SPRITE.WIZ,
      cellCorner(this.state.player.x) + WORLD_WIZ_PADDING + BOARD_PADDING,
      cellCorner(this.state.player.y) + WORLD_WIZ_PADDING + BOARD_PADDING,
      WORLD_WIZ_SIZE,
      WORLD_WIZ_SIZE
    );

    this.state.walls.forEach((wall) => this.renderWall(wall));

    const hadAnimations = this.animations.length > 0;

    this.animations.forEach((anim) => anim.tick(this.game));
    this.animations = this.animations.filter((anim) => !anim.finished);

    // return true;
    return hadAnimations;
  }

  renderWall(wall) {
    this.game.drawImage(
      ASSETS.SPRITE.CRATE,
      cellCorner(wall.x) + BOARD_PADDING + SPRITE_PADDING + this.juiceOffset.x,
      cellCorner(wall.y) + BOARD_PADDING + SPRITE_PADDING + this.juiceOffset.y,
      SPRITE_SIZE,
      SPRITE_SIZE
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

  renderLevelSidebar() {
    const SIDEBAR_WIDTH = 224;
    const SIDEBAR_CENTER = 688;

    const SIDEBAR_INNER_WIDTH = 176;

    let topPosition = 32;

    const level = this.currentLevel.level;

    // Sidebar background
    this.game.drawRect(576, 32, SIDEBAR_WIDTH, 512, {
      fill: "#E2D8D4",
      stroke: "#BDAFA1",
      strokeWidth: 4,
    });

    // Shtuff
    topPosition += 24;

    this.game.drawText(
      `${this.currentLocation.title}  -  LEVEL ${this.currentLevel.number}`,
      SIDEBAR_CENTER,
      topPosition,
      {
        color: "#000",
        font: "700 10px Edu-SA",
        align: "center",
      }
    );

    topPosition += 10;
    topPosition += 16;

    const titleFontSize = this.state.title.length > 10 ? 14 : 18;

    this.game.drawText(level.title, SIDEBAR_CENTER, topPosition, {
      color: "#000",
      font: `500 ${titleFontSize}px Edu-SA`,
      align: "center",
    });

    topPosition += titleFontSize;
    topPosition += 12;

    this.game.drawRect(600, topPosition, 176, 0, {
      fill: "",
      stroke: "#000",
      strokeWidth: 2,
    });

    topPosition += 24;

    this.game.ctx.save();
    const scale = SIDEBAR_INNER_WIDTH / BOARD_SIZE;
    this.game.ctx.scale(scale, scale);

    drawCheckeredGrid(
      this.game,
      600 / scale,
      topPosition / scale,
      "#CFC6BD",
      "#E2D8D4"
    );
    this.currentLevel.level.render(this.game, 600 / scale, topPosition / scale);

    this.game.drawRect(
      600 / scale,
      topPosition / scale,
      BOARD_SIZE,
      BOARD_SIZE,
      {
        fill: "",
        stroke: "#000",
        strokeWidth: 4,
      }
    );

    // this.currentLevel.level.render(this.game, 10, 10);

    this.game.ctx.restore();
  }

  renderZoneSidebar() {
    const SIDEBAR_WIDTH = 224;
    const SIDEBAR_CENTER = 688;

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
      }
    );

    topPosition += 10;
    topPosition += 16;

    const titleFontSize = this.state.title.length > 10 ? 14 : 18;

    this.game.drawText(
      this.currentLocation.subtitle,
      SIDEBAR_CENTER,
      topPosition,
      {
        color: "#000",
        font: `500 ${titleFontSize}px Edu-SA`,
        align: "center",
      }
    );

    topPosition += titleFontSize;
    topPosition += 12;

    this.game.drawRect(600, topPosition, 176, 0, {
      fill: "",
      stroke: "#000",
      strokeWidth: 2,
    });

    topPosition += 24;

    topPosition = this.game.drawText(
      this.currentLocation.text.split("\n"),
      SIDEBAR_CENTER,
      topPosition,
      {
        color: "#000",
        font: `500 12px Edu-SA`,
        align: "center",
        lineSpacing: 20,
      }
    );

    if (!this.currentLocation.isZone) return;

    topPosition += 24;

    this.game.drawImage(
      ASSETS.UI.STAR.SILVER,
      SIDEBAR_CENTER - 36,
      topPosition - 12,
      24,
      24
    );

    const isZoneDone =
      this.currentLocation.silverStars == this.currentLocation.levels;

    this.game.drawText(
      `× ${this.currentLocation.silverStars}/${this.currentLocation.levels}`,
      SIDEBAR_CENTER,
      topPosition - 10,
      {
        color: isZoneDone ? "#551280" : "#000",
        font: `500 24px Tiny5`,
        align: "left",
      }
    );

    if (isZoneDone) {
      // woohoo!
      const pushAnimation = (top, current) => {
        if (this.currentLocation != current) return;
        if (this.animations.length > 0) return;
        this.animations.push(
          new EtherealAnimation(
            SIDEBAR_CENTER - 24,
            top,
            ASSETS.UI.STAR.SILVER,
            24,
            {
              etherealInFrames: 1,
              etherealOutFrames: 30,
              etherealEnd: 1.8,
              etherealStart: 1,
            },
            () => {
              setTimeout(() => {
                pushAnimation(top, current);
              }, 100);
            }
          )
        );
      };

      if (this.animations.length == 0) {
        pushAnimation(topPosition, this.currentLocation);
      }

      topPosition += 24;

      topPosition = this.game.drawText(
        `Great job!!!`,
        SIDEBAR_CENTER,
        topPosition,
        {
          color: "#551280",
          font: `500 14px Edu-SA`,
          align: "center",
        }
      );
    } else {
      topPosition += 12;
    }

    topPosition += 24;

    this.game.drawImage(
      ASSETS.UI.STAR.GOLD,
      SIDEBAR_CENTER - 36,
      topPosition - 12,
      24,
      24
    );

    const isGoldDone =
      this.currentLocation.goldStars == this.currentLocation.levels;

    this.game.drawText(
      `× ${this.currentLocation.goldStars}/${this.currentLocation.levels}`,
      SIDEBAR_CENTER,
      topPosition - 10,
      {
        color: isGoldDone ? "#551280" : "#000",
        font: `500 24px Tiny5`,
        align: "left",
      }
    );

    topPosition += 24;

    if (isZoneDone) {
      topPosition = this.game.drawText(
        "Try for all gold stars!",
        SIDEBAR_CENTER,
        topPosition,
        {
          color: "#000",
          font: `500 12px Edu-SA`,
          align: "center",
          lineSpacing: 16,
        }
      );
    } else {
      topPosition = this.game.drawText(
        this.currentLocation.cta.split("\n"),
        SIDEBAR_CENTER,
        topPosition,
        {
          color: "#000",
          font: `500 12px Edu-SA`,
          align: "center",
          lineSpacing: 16,
        }
      );
    }

    topPosition += 24;

    // Press Space

    this.game.drawImage(
      ASSETS.UI.SPACEBAR,
      SIDEBAR_CENTER + 2,
      topPosition - 9,
      54,
      18
    );

    this.game.drawText("Press ", SIDEBAR_CENTER - 2, topPosition - 8, {
      color: "#000",
      font: `500 16px Tiny5`,
      align: "right",
    });

    this.game.drawRect(624, topPosition, 12, 0, {
      fill: "",
      stroke: "#000",
      strokeWidth: 2,
    });

    this.game.drawRect(752, topPosition, 12, 0, {
      fill: "",
      stroke: "#000",
      strokeWidth: 2,
    });
  }

  goToLevel() {
    this.game.scene = "level";
    this.game.levelManager = new LevelManager(
      this.game,
      `${this.currentLocation.title}  -  LEVEL ${this.currentLevel.number}`,
      this.currentLevel.level
    );
  }
}
