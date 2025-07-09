const WORLD_WIZ_SIZE = 48;
const WORLD_WIZ_PADDING = (SQUARE_SIZE - WORLD_WIZ_SIZE) * 0.5;

const WORLD_MAP = `
..|..|..|..|..|..|..|..
..|..|..|..|..|..|..|..
..|..|..|..|..|..|..|Cr
..|..|..|..|Cr|..|Cr|..
Cr|Cr|Cr|Cr|..|Cr|..|..
..|..|..|Cr|..|..|..|..
Cr|..|..|..|..|Cr|..|..
..|Wz|..|Cr|Cr|Cr|..|..
`;

const WORLD_MAP_LOCATIONS = [
  {
    id: "wiz",
    x: 2,
    y: 6,
    title: "HOME BASE",
    subtitle: "Wizard Tower",
    text: "Ransacked by Goblins >:(\nTheir tracks lead east...",
    isZone: false,
  },
  {
    id: "camp",
    x: 4,
    y: 5,
    title: "GOBLIN CAMP 1",
    subtitle: "Sleepy Hill",
    text: "Goblins are napping by the fire\nwith their stolen hats.",
    asset: ASSETS.WORLD.FIRE,
    isZone: true,
    goldStars: 0,
    levels: 6,
    cta: "Dang Gobbos! Get em!",
  },
  {
    id: "fort",
    x: 7,
    y: 5,
    title: "GOBLIN CAMP 2",
    subtitle: "Ruined Fort",
    text: "Goblins are running around the old\n ruined fort. (They're actually doing\na good job of rebuilding it.)",
    asset: ASSETS.WORLD.FORT,
    isZone: true,
    goldStars: 0,
    levels: 6,
    cta: "Don't care! Blow up the fort!\nGet your hats back!!",
  },
];

class WorldMap {
  constructor(game) {
    this.game = game;
    this.state = LevelState.make({
      level: WORLD_MAP,
    });
    this.currentLocation = null;

    this.animations = [];

    this.silverAnimation = false;
    this.goldAnimation = false;
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
        this.goToZone();
        return true;
        break;
      case "KeyR":
        this.resetProgress();
        return true;
        break;
      default:
        return false;
    }
  }

  // World Map Rendering
  render() {
    const { width, height } = this.game;

    // Game area background
    this.game.drawRect(0, 0, width, height, { fill: "#C5BAB5" });

    this.game.drawImage(
      ASSETS.WORLD.MAP,
      BOARD_PADDING,
      BOARD_PADDING,
      BOARD_SIZE,
      BOARD_SIZE
    );

    // World Outline
    this.game.drawRect(32, 32, 512, 512, {
      fill: "",
      stroke: "#BDAFA1",
      strokeWidth: 4,
    });

    // this.game.ctx.globalAlpha = 0.75;
    // this.game.drawImage(ASSETS.UI.TITLE, 54, 96, 384, 128);
    // this.game.ctx.globalAlpha = 0.5;
    // this.game.drawImage(ASSETS.UI.CREDITS, 320, 224, 128, 64);
    // this.game.ctx.globalAlpha = 1;

    this.currentLocation = WORLD_MAP_LOCATIONS.find(
      (location) =>
        location.x === this.state.player.x && location.y === this.state.player.y
    );

    if (this.currentLocation) {
      this.renderZoneSidebar();
    } else {
      this.renderEmptySidebar();
    }

    WORLD_MAP_LOCATIONS.forEach((location) => {
      if (!location.asset) return;
      const silverStars = this.game.progress.getLevelSilver(location.id);
      const isZoneDone = silverStars == location.levels;
      const status = isZoneDone ? "CLEAR" : "GOB";
      const asset = location.asset[status];
      this.game.drawImage(
        asset,
        cellCorner(location.x) + BOARD_PADDING,
        cellCorner(location.y) + BOARD_PADDING,
        SQUARE_SIZE,
        SQUARE_SIZE
      );
    });

    this.game.drawImage(
      ASSETS.SPRITE.WIZ,
      cellCorner(this.state.player.x) + WORLD_WIZ_PADDING + BOARD_PADDING,
      cellCorner(this.state.player.y) + WORLD_WIZ_PADDING + BOARD_PADDING,
      WORLD_WIZ_SIZE,
      WORLD_WIZ_SIZE
    );

    this.animations.forEach((anim) => anim.tick(this.game));

    // return true;
    return this.animations.length > 0;
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

  renderEmptySidebar() {
    this.animations = [];

    const SIDEBAR_WIDTH = 224;
    const SIDEBAR_CENTER = 688;

    let topPosition = 32;

    // Sidebar background
    this.game.drawRect(576, 32, SIDEBAR_WIDTH, 512, {
      fill: "#E2D8D4",
      stroke: "#BDAFA1",
      strokeWidth: 4,
    });

    // Shtuff
    topPosition += 24;

    this.game.drawImage(
      ASSETS.UI.TITLE,
      SIDEBAR_CENTER - 192 / 2,
      topPosition,
      192,
      64
    );

    topPosition += 80;

    this.game.drawImage(
      ASSETS.UI.CREDITS,
      SIDEBAR_CENTER - 64,
      topPosition,
      128,
      64
    );

    topPosition += 80;

    this.game.drawRect(576, topPosition, SIDEBAR_WIDTH, 0, {
      fill: "",
      stroke: "#BDAFA1",
      strokeWidth: 4,
    });

    topPosition += 40;

    this.game.drawImage(
      ASSETS.TUTORIAL.MOVE,
      SIDEBAR_CENTER - 128 / 2,
      topPosition,
      128,
      128
    );
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

    const silverStars = this.game.progress.getLevelSilver(this.currentLocation.id);

    const isZoneDone =
      silverStars == this.currentLocation.levels;

    this.game.drawText(
      `× ${silverStars}/${this.currentLocation.levels}`,
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
        "Try for all gold stars!\nYou can do it!".split("\n"),
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

  goToZone() {
    if(!this.currentLocation || !this.currentLocation.isZone) return;

    this.game.scene = "zone";
    this.game.currentZone = this.currentLocation;
    this.game.zoneMap = new ZoneMap(this.game);
    this.game.zoneMap.currentLevel = null;
  }

  resetProgress() {
    if(this.currentLocation.id == "wiz") {
      this.game.progress = new GameProgress();
      this.game.progress.saveProgress();
    }
  }
}
