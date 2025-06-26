class MenuManager {
    constructor(game) {
        this.game = game;
    }
    
    // Main Menu Input Handling
    handleMainMenuInput(keyCode) {
        const state = this.game.gameState.state.mainMenuState;
        
        switch (keyCode) {
            case 'ArrowUp':
            case 'KeyW':
                state.selectedOption = Math.max(0, state.selectedOption - 1);
                break;
            case 'ArrowDown':
            case 'KeyS':
                state.selectedOption = Math.min(2, state.selectedOption + 1); // 0: Play, 1: Options, 2: Exit
                break;
            case 'Enter':
            case 'Space':
                this.selectMainMenuOption(state.selectedOption);
                break;
            case 'Escape':
                // Could add confirmation dialog or just ignore
                break;
        }
    }
    
    // Level Selection Input Handling
    handleLevelSelectionInput(keyCode) {
        const state = this.game.gameState.state.levelSelectionState;
        
        switch (keyCode) {
            case 'ArrowLeft':
            case 'KeyA':
                state.selectedLevel = Math.max(1, state.selectedLevel - 1);
                break;
            case 'ArrowRight':
            case 'KeyD':
                state.selectedLevel = Math.min(state.maxLevel, state.selectedLevel + 1);
                break;
            case 'Enter':
            case 'Space':
                this.startLevel(state.selectedLevel);
                break;
            case 'Escape':
                this.game.gameState.level = 'main';
                break;
        }
    }
    
    // Main Menu Rendering
    renderMainMenu() {
        const state = this.game.gameState.state.mainMenuState;
        const { width, height } = this.game;
        
        // Title
        this.game.drawText('GAME TITLE', width / 2, 150, {
            font: '32px Courier New',
            align: 'center',
            color: '#fff'
        });
        
        // Menu options
        const options = ['Play', 'Options', 'Exit'];
        const startY = 300;
        const spacing = 50;
        
        options.forEach((option, index) => {
            const color = index === state.selectedOption ? '#0f0' : '#fff';
            const prefix = index === state.selectedOption ? '> ' : '  ';
            
            this.game.drawText(prefix + option, width / 2, startY + index * spacing, {
                font: '20px Courier New',
                align: 'center',
                color: color
            });
        });
        
        // Instructions
        this.game.drawText('Use W/S or Arrow Keys to navigate, Enter/Space to select', width / 2, height - 50, {
            font: '12px Courier New',
            align: 'center',
            color: '#aaa'
        });
    }
    
    // Level Selection Rendering
    renderLevelSelection() {
        const state = this.game.gameState.state.levelSelectionState;
        const { width, height } = this.game;
        
        // Title
        this.game.drawText('SELECT LEVEL', width / 2, 100, {
            font: '24px Courier New',
            align: 'center',
            color: '#fff'
        });
        
        // Level grid
        const cols = 3;
        const rows = Math.ceil(state.maxLevel / cols);
        const startX = width / 2 - (cols * 80) / 2;
        const startY = 200;
        
        for (let i = 1; i <= state.maxLevel; i++) {
            const row = Math.floor((i - 1) / cols);
            const col = (i - 1) % cols;
            const x = startX + col * 80;
            const y = startY + row * 80;
            
            const isSelected = i === state.selectedLevel;
            const color = isSelected ? '#0f0' : '#666';
            const textColor = isSelected ? '#000' : '#fff';
            
            // Level box
            this.game.drawRect(x, y, 60, 60, color, true);
            this.game.drawRect(x, y, 60, 60, '#fff', false);
            
            // Level number
            this.game.drawText(i.toString(), x + 30, y + 30, {
                font: '20px Courier New',
                align: 'center',
                baseline: 'middle',
                color: textColor
            });
        }
        
        // Instructions
        this.game.drawText('Use A/D or Arrow Keys to navigate, Enter/Space to select, ESC to go back', width / 2, height - 50, {
            font: '12px Courier New',
            align: 'center',
            color: '#aaa'
        });
    }
    
    // Menu Action Handlers
    selectMainMenuOption(option) {
        switch (option) {
            case 0: // Play
                this.game.gameState.level = 'selection';
                break;
            case 1: // Options
                // Could implement options screen later
                console.log('Options not implemented yet');
                break;
            case 2: // Exit
                console.log('Thanks for playing!');
                break;
        }
    }
    
    startLevel(levelNumber) {
        this.game.gameState.level = 'level';
        this.game.gameState.state.levelGameState.currentLevel = levelNumber;
        this.game.gameState.state.levelGameState.turnCount = 0;
    }
}