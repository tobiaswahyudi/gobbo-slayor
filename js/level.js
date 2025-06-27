class LevelManager {
  constructor(game) {
    this.game = game;
    this.state = {
      currentLevel: 1,
      turnCount: 0,
    };
  }

  // Level Input Handling
  handleGameInput(keyCode) {
    switch (keyCode) {
      case "ArrowUp":
      case "KeyW":
        this.makeMove("up");
        break;
      case "ArrowDown":
      case "KeyS":
        this.makeMove("down");
        break;
      case "ArrowLeft":
      case "KeyA":
        this.makeMove("left");
        break;
      case "ArrowRight":
      case "KeyD":
        this.makeMove("right");
        break;
      case "Space":
        this.makeMove("action");
        break;
      case "Escape":
        this.game.gameState.level = "selection";
        break;
    }
  }

  // Level Rendering
  renderGame() {
    const { width, height } = this.game;

    // Game area background
    this.game.drawRect(0, 0, width, height, { fill: "#C5BAB5" });

    // Draw a 8x8 grid of 64px squares. They alternate between CFC6BD and E2D8D4
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const color = (i + j) % 2 === 0 ? "#CFC6BD" : "#E2D8D4";
        this.game.drawRect(i * 64 + 32, j * 64 + 32, 64, 64, { fill: color });
      }
    }

    this.game.drawRect(32, 32, 512, 512, {
      fill: '',
      stroke: "#BDAFA1",
      strokeWidth: 4,
    });

    this.game.drawRect(576, 32, 208, 512, {
      fill: '#E2D8D4',
      stroke: "#BDAFA1",
      strokeWidth: 4,
    });

    // Render level-specific content
    this.renderLevelContent(this.state);
  }

  // Level-specific content rendering (override this for different level types)
  renderLevelContent(state) {
    const { width, height } = this.game;
  }

  // Example level-specific rendering methods
  renderLevel1(state) {
    // Level 1 specific content
    // Add your level 1 game objects, obstacles, etc.
  }

  renderLevel2(state) {
    // Level 2 specific content
    // Add your level 2 game objects, obstacles, etc.
  }

  renderLevel3(state) {
    // Level 3 specific content
    // Add your level 3 game objects, obstacles, etc.
  }

  // Game Logic
  makeMove(direction) {
    // This is where you'll implement your actual game logic
    console.log(
      `Making move: ${direction} on turn ${this.state.turnCount} in level ${this.state.currentLevel}`
    );

    // Increment turn counter for any action
    this.state.turnCount++;

    // Add your game logic here based on the direction/action
    switch (direction) {
      case "up":
        this.handleMovement(0, -1);
        break;
      case "down":
        this.handleMovement(0, 1);
        break;
      case "left":
        this.handleMovement(-1, 0);
        break;
      case "right":
        this.handleMovement(1, 0);
        break;
      case "action":
        this.handleAction();
        break;
    }

    // Check for level completion, game over, etc.
    this.checkLevelStatus(this.state);
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

// Export for use in main game
window.LevelManager = LevelManager;
