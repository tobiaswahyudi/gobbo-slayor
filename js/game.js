class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game state
        this.isRunning = false;
        this.lastTime = 0;
        this.deltaTime = 0;
        
        // Canvas dimensions
        this.width = 800;
        this.height = 600;
        
        // Input handling
        this.keys = {};
        this.mouse = {
            x: 0,
            y: 0,
            left: false,
            right: false
        };
        
        this.init();
    }
    
    init() {
        // Set canvas size
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Configure canvas context
        this.ctx.imageSmoothingEnabled = false; // For pixel-perfect rendering
        
        console.log('Game initialized');
    }
    
    setupEventListeners() {
        // Keyboard events
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            e.preventDefault(); // Prevent default browser behavior
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            e.preventDefault();
        });
        
        // Mouse events
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) this.mouse.left = true;
            if (e.button === 2) this.mouse.right = true;
            e.preventDefault();
        });
        
        this.canvas.addEventListener('mouseup', (e) => {
            if (e.button === 0) this.mouse.left = false;
            if (e.button === 2) this.mouse.right = false;
            e.preventDefault();
        });
        
        // Prevent context menu
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Handle focus/blur for pause functionality
        window.addEventListener('blur', () => {
            this.pause();
        });
        
        window.addEventListener('focus', () => {
            if (this.isRunning) this.resume();
        });
    }
    
    handleResize() {
        // Optional: implement responsive canvas sizing
        // For now, keep fixed size
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastTime = performance.now();
            this.gameLoop();
            console.log('Game started');
        }
    }
    
    pause() {
        this.isRunning = false;
        console.log('Game paused');
    }
    
    resume() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastTime = performance.now();
            this.gameLoop();
            console.log('Game resumed');
        }
    }
    
    gameLoop(currentTime = 0) {
        if (!this.isRunning) return;
        
        // Calculate delta time
        this.deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // Cap delta time to prevent large jumps
        this.deltaTime = Math.min(this.deltaTime, 1/30);
        
        // Update game logic
        this.update(this.deltaTime);
        
        // Render game
        this.render();
        
        // Continue the loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update(deltaTime) {
        // Game logic updates go here
        // This is where you'll add your game-specific update logic
        
        // Example: Handle input
        this.handleInput();
    }
    
    handleInput() {
        // Handle keyboard input
        if (this.keys['KeyW'] || this.keys['ArrowUp']) {
            // Move up
        }
        if (this.keys['KeyS'] || this.keys['ArrowDown']) {
            // Move down
        }
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
            // Move left
        }
        if (this.keys['KeyD'] || this.keys['ArrowRight']) {
            // Move right
        }
        if (this.keys['Space']) {
            // Action
        }
        if (this.keys['Escape']) {
            // Pause or menu
            this.pause();
        }
        
        // Handle mouse input
        if (this.mouse.left) {
            // Left click action
        }
        if (this.mouse.right) {
            // Right click action
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Set default styles
        this.ctx.fillStyle = '#fff';
        this.ctx.strokeStyle = '#fff';
        this.ctx.font = '16px Courier New';
        
        // Render game objects here
        this.renderGame();
        
        // Render UI
        this.renderUI();
    }
    
    renderGame() {
        // Main game rendering goes here
        // This is where you'll draw your game objects
        
        // Example: Draw a simple placeholder
        this.ctx.fillStyle = '#0f0';
        this.ctx.fillRect(this.width / 2 - 25, this.height / 2 - 25, 50, 50);
    }
    
    renderUI() {
        // UI rendering goes here
        // This is for canvas-based UI elements
        
        // Example: FPS counter
        const fps = Math.round(1 / this.deltaTime);
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '14px Courier New';
        this.ctx.fillText(`FPS: ${fps}`, 10, 20);
        
        // Example: Mouse position
        this.ctx.fillText(`Mouse: ${this.mouse.x}, ${this.mouse.y}`, 10, 40);
        
        // Example: Instructions
        this.ctx.fillStyle = '#aaa';
        this.ctx.font = '12px Courier New';
        this.ctx.fillText('WASD/Arrow Keys to move, Space for action, ESC to pause', 10, this.height - 10);
    }
    
    // Utility methods
    
    drawText(text, x, y, options = {}) {
        const {
            color = '#fff',
            font = '16px Courier New',
            align = 'left',
            baseline = 'top'
        } = options;
        
        this.ctx.fillStyle = color;
        this.ctx.font = font;
        this.ctx.textAlign = align;
        this.ctx.textBaseline = baseline;
        this.ctx.fillText(text, x, y);
    }
    
    drawRect(x, y, width, height, color = '#fff', filled = true) {
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        
        if (filled) {
            this.ctx.fillRect(x, y, width, height);
        } else {
            this.ctx.strokeRect(x, y, width, height);
        }
    }
    
    drawCircle(x, y, radius, color = '#fff', filled = true) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        
        if (filled) {
            this.ctx.fill();
        } else {
            this.ctx.stroke();
        }
    }
    
    // Collision detection utility
    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    // Distance calculation
    getDistance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }
}

// Initialize and start the game when the page loads
window.addEventListener('load', () => {
    const game = new Game();
    game.start();
}); 