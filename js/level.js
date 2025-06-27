const Direction = {
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
};

const HatType = {
  VERTICAL: "VERTICAL",
  HORIZONTAL: "HORIZONTAL",
  REMOVE: "REMOVE",
};

class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(other) {
    return new Position(this.x + other.x, this.y + other.y);
  }
}

const SQUARE_SIZE = 64;
const HALF_SQUARE_SIZE = SQUARE_SIZE / 2;
const GRID_SIZE = 8;
const SPRITE_SIZE = 56;
const SPRITE_PADDING = (SQUARE_SIZE - SPRITE_SIZE) / 2;

class Gobbo extends Position {
  constructor(x, y, direction, hatType) {
    super(x, y);
    this.direction = direction;
    this.hatType = hatType;
  }
}

class LevelManager {
  constructor(game) {
    this.game = game;
    this.state = {
      currentLevel: 1,
      turnCount: 0,
      player: new Position(1, 3),
      gobbos: [
        new Gobbo(4, 1, Direction.DOWN, HatType.VERTICAL),
        new Gobbo(5, 3, Direction.RIGHT, HatType.REMOVE),
        new Gobbo(3, 6, Direction.RIGHT, HatType.HORIZONTAL),
      ],
      walls: [
        new Position(2, 5),
        new Position(2, 6),
        new Position(2, 7),
        new Position(3, 1),
        new Position(3, 5),
        new Position(4, 3),
      ],
      aimArea: [new Position(2, 0), new Position(2, -1), new Position(3, 0)],
    };
  }

  // Level Input Handling
  handleGameInput(keyCode) {
    switch (keyCode) {
      case "ArrowUp":
      case "KeyW":
        this.makeMove("up");
        return true;
        break;
      case "ArrowDown":
      case "KeyS":
        this.makeMove("down");
        return true;
        break;
      case "ArrowLeft":
      case "KeyA":
        this.makeMove("left");
        return true;
        break;
      case "ArrowRight":
      case "KeyD":
        this.makeMove("right");
        return true;
        break;
      case "Space":
        this.makeMove("action");
        return true;
        break;
      case "Escape":
        this.game.gameState.level = "selection";
        return true;
      default:
        return false;
    }
  }

  // Level Rendering
  renderGame() {
    const { width, height } = this.game;

    // Game area background
    this.game.drawRect(0, 0, width, height, { fill: "#C5BAB5" });

    // Draw a 8x8 grid of 64px squares. They alternate between CFC6BD and E2D8D4
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const color = (i + j) % 2 === 0 ? "#CFC6BD" : "#E2D8D4";
        this.game.drawRect(
          i * SQUARE_SIZE + HALF_SQUARE_SIZE,
          j * SQUARE_SIZE + HALF_SQUARE_SIZE,
          SQUARE_SIZE,
          SQUARE_SIZE,
          {
            fill: color,
          }
        );
      }
    }

    this.game.drawRect(32, 32, 512, 512, {
      fill: "",
      stroke: "#BDAFA1",
      strokeWidth: 4,
    });

    this.game.drawRect(576, 32, 208, 512, {
      fill: "#E2D8D4",
      stroke: "#BDAFA1",
      strokeWidth: 4,
    });

    // Render level-specific content
    this.renderLevelContent();
  }

  cellCenter(num) {
    return num * SQUARE_SIZE + HALF_SQUARE_SIZE;
  }

  // Level-specific content rendering (override this for different level types)
  renderLevelContent() {
    this.game.drawImage(
      ASSETS.SPRITE.WIZ,
      this.cellCenter(this.state.player.x) + SPRITE_PADDING,
      this.cellCenter(this.state.player.y) + SPRITE_PADDING,
      SPRITE_SIZE,
      SPRITE_SIZE
    );
    this.state.gobbos.forEach((gobbo) => this.renderGobbo(gobbo));
    this.state.walls.forEach((wall) => this.renderWall(wall));
    this.state.aimArea.forEach((area) =>
      this.renderAimArea(area.add(this.state.player))
    );
  }

  renderGobbo(gobbo) {
    console.log(gobbo);
    this.game.drawImage(
      ASSETS.SPRITE.GOBBO,
      this.cellCenter(gobbo.x) + SPRITE_PADDING,
      this.cellCenter(gobbo.y) + SPRITE_PADDING,
      SPRITE_SIZE,
      SPRITE_SIZE
    );
    this.game.drawImage(
      ASSETS.SPRITE.HAT[gobbo.hatType],
      this.cellCenter(gobbo.x) + SPRITE_PADDING,
      this.cellCenter(gobbo.y) + SPRITE_PADDING,
      SPRITE_SIZE,
      SPRITE_SIZE
    );
  }

  renderWall(wall) {
    this.game.drawImage(
      ASSETS.SPRITE.CRATE,
      this.cellCenter(wall.x) + SPRITE_PADDING,
      this.cellCenter(wall.y) + SPRITE_PADDING,
      SPRITE_SIZE,
      SPRITE_SIZE
    );
  }

  renderAimArea(area) {
    this.game.drawRect(
      this.cellCenter(area.x),
      this.cellCenter(area.y),
      SQUARE_SIZE,
      SQUARE_SIZE,
      { fill: "#ffa05766" }
    );
  }

  getDirVec(direction) {
    switch (direction) {
      case "up":
        return [0, -1];
        break;
      case "down":
        return [0, 1];
        break;
      case "left":
        return [-1, 0];
        break;
      case "right":
        return [1, 0];
        break;
    }
    return [0, 0];
  }

  verifyMoveBounds(srcX, srcY, moveX, moveY) {
    const newX = srcX + moveX;
    const newY = srcY + moveY;
    if (newX < 0 || newX > 7 || newY < 0 || newY > 7) {
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
    // This is where you'll implement your actual game logic
    console.log(
      `Making move: ${direction} on turn ${this.state.turnCount} in level ${this.state.currentLevel}`
    );

    // Increment turn counter for any action
    this.state.turnCount++;

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
  }

  // Handle player movement
  handleMovement(deltaX, deltaY) {
    // Add your movement logic here
    // This could involve:
    // - Updating player position
    // - Checking collisions
    // - Moving enemies
    // - Updating game state

    console.log(`Player attempting to move by (${deltaX}, ${deltaY})`);

    if (
      this.state.player.x + deltaX < 0 ||
      this.state.player.x + deltaX > 7 ||
      this.state.player.y + deltaY < 0 ||
      this.state.player.y + deltaY > 7
    ) {
      console.log("Player attempted to move out of bounds");
      return false;
    }

    this.state.player.x += deltaX;
    this.state.player.y += deltaY;
  }

  // Handle player actions (like interactions, attacks, etc.)
  handleAction() {
    // Add your action logic here
    // This could involve:
    // - Interacting with objects
    // - Attacking enemies
    // - Using items
    // - Activating switches

    console.log("Player performed an action");
  }

  // Check if level is completed, failed, etc.
  checkLevelStatus(state) {
    // Add your win/lose conditions here
    // For example:
    // if (playerReachedGoal) {
    //     this.completeLevel();
    // }
    // if (playerDied) {
    //     this.restartLevel();
    // }
  }

  // Level completion handler
  completeLevel() {
    console.log(`Level ${this.state.currentLevel} completed!`);

    // Could advance to next level or return to selection
    // this.game.gameState.level = 'selection';
  }

  // Level restart handler
  restartLevel() {
    this.state.turnCount = 0;
    console.log(`Level ${this.state.currentLevel} restarted`);

    // Reset level state here
  }
}
