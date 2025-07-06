const WORLD_WIZ_SIZE = 48;
const WORLD_WIZ_PADDING = (SQUARE_SIZE - WORLD_WIZ_SIZE) * 0.5;

const WORLD_MAP = `
World Map
0
..|..|..|..|..|..|..|..
..|..|..|..|..|..|..|..
..|..|..|..|..|..|..|Cr
..|..|..|..|Cr|..|Cr|..
Cr|Cr|Cr|Cr|..|Cr|..|..
..|..|..|Cr|..|..|..|..
Cr|..|Wz|..|..|Cr|..|..
..|..|..|Cr|Cr|Cr|..|..
`;

const WORLD_MAP_LOCATIONS = [
  {
    x: 2,
    y: 6,
    title: "GOBBO SLAYER",
    subtitle: "hell yea",
    text: "[W][A][S][D] or Arrow Keys to move"
  },
  {
    x: 4,
    y: 5,
    title: "Area 1",
    subtitle: "Roadside Campfire",
    text: "Gobbos are napping by the fire with their stolen hats",
    done: false,
    asset: ASSETS.WORLD.FIRE,
  },
];

class WorldMap {
  constructor(game) {
    this.game = game;
    this.state = new LevelState();
    this.state.parse(WORLD_MAP);
    this.currentLocation = null;

    this.animations = [];
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

    // Sidebar
    this.game.drawRect(576, 32, 224, 512, {
      fill: "#E2D8D4",
      stroke: "#BDAFA1",
      strokeWidth: 4,
    });

    this.game.drawText(`Level ${this.currentLevel}`, 680, 44, {
      color: "#000",
      font: "bold 24px Courier New",
      align: "center",
    });

    this.game.drawRect(600, 78, 160, 0, {
      fill: "",
      stroke: "#000",
      strokeWidth: 2,
    });

    this.game.drawImage(ASSETS.SPRITE.GOBBOS.MOVE, 608, 80, 64, 64);

    this.game.drawImage(ASSETS.UI.MANA, 608, 152, 64, 64);

    this.game.drawText("Hats", 680, 280, {
      color: "#000",
      font: "bold 24px Courier New",
      align: "center",
    });

    this.game.drawRect(600, 314, 160, 0, {
      fill: "",
      stroke: "#000",
      strokeWidth: 2,
    });

    this.game.drawImage(ASSETS.UI.HAT[HatType.HORIZONTAL], 608, 332, 64, 64);

    this.game.drawImage(ASSETS.UI.HAT[HatType.REMOVE], 688, 332, 64, 64);

    this.game.drawImage(ASSETS.UI.HAT[HatType.VERTICAL], 608, 412, 64, 64);

    // this.game.ctx.globalAlpha = 0.75;
    this.game.drawImage(ASSETS.UI.TITLE, 54, 96, 384, 128);
    this.game.ctx.globalAlpha = 0.5;
    this.game.drawImage(ASSETS.UI.CREDITS, 320, 224, 128, 64);
    this.game.ctx.globalAlpha = 1;

    this.currentLocation = WORLD_MAP_LOCATIONS.find(
      (location) =>
        location.x === this.state.player.x && location.y === this.state.player.y
    );
    if (this.currentLocation) {
      
    } else {
    }

    WORLD_MAP_LOCATIONS.forEach((location) => {
      if (!location.asset) return;
      const status = location.done ? "CLEAR" : "GOB";
      const asset = location.asset[status];
      this.game.drawImage(
        asset,
        cellCenter(location.x),
        cellCenter(location.y),
        SQUARE_SIZE,
        SQUARE_SIZE
      );
    });

    this.game.drawImage(
      ASSETS.SPRITE.WIZ,
      cellCenter(this.state.player.x) + WORLD_WIZ_PADDING,
      cellCenter(this.state.player.y) + WORLD_WIZ_PADDING,
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

  drawSidebarContents(current) {
    
  }
}
