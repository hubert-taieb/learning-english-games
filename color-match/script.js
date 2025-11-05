// Color Match Game - Learn Colors in English
class ColorMatchGame {
    constructor() {
        this.colors = {
            red: { hex: '#ff4444', french: 'Rouge', english: 'Red' },
            blue: { hex: '#4444ff', french: 'Bleu', english: 'Blue' },
            green: { hex: '#44ff44', french: 'Vert', english: 'Green' },
            yellow: { hex: '#ffff44', french: 'Jaune', english: 'Yellow' },
            orange: { hex: '#ff8844', french: 'Orange', english: 'Orange' },
            purple: { hex: '#8844ff', french: 'Violet', english: 'Purple' },
            pink: { hex: '#ff44ff', french: 'Rose', english: 'Pink' },
            brown: { hex: '#8b4513', french: 'Marron', english: 'Brown' },
            black: { hex: '#333333', french: 'Noir', english: 'Black' },
            white: { hex: '#ffffff', french: 'Blanc', english: 'White' },
            gray: { hex: '#888888', french: 'Gris', english: 'Gray' },
            cyan: { hex: '#44ffff', french: 'Cyan', english: 'Cyan' }
        };

        this.gameState = {
            score: 0,
            level: 1,
            lives: 3,
            isPlaying: false,
            isPaused: false,
            currentTarget: null,
            currentColors: [],
            language: 'english',
            timeLeft: 15,
            timer: null,
            waitingForNewTarget: false
        };

        this.elements = {
            score: document.getElementById('score'),
            level: document.getElementById('level'),
            lives: document.getElementById('lives'),
            timer: document.getElementById('timer'),
            colorName: document.getElementById('colorName'),
            colorsGrid: document.getElementById('colorsGrid'),
            startBtn: document.getElementById('startBtn'),
            pauseBtn: document.getElementById('pauseBtn'),
            resetBtn: document.getElementById('resetBtn'),
            gameOver: document.getElementById('gameOver'),
            finalScore: document.getElementById('finalScore'),
            finalLevel: document.getElementById('finalLevel'),
            languageBtn: document.getElementById('languageBtn'),
            instruction: document.getElementById('instruction')
        };

        this.initializeGame();
    }

    initializeGame() {
        this.updateDisplay();
        this.setupEventListeners();
        // Don't generate grid on init - wait for game to start
    }

    setupEventListeners() {
        this.elements.startBtn.addEventListener('click', () => this.startGame());
        this.elements.pauseBtn.addEventListener('click', () => this.pauseGame());
        this.elements.resetBtn.addEventListener('click', () => this.resetGame());
        this.elements.languageBtn.addEventListener('click', () => this.toggleLanguage());
    }

    startGame() {
        this.gameState.isPlaying = true;
        this.gameState.isPaused = false;
        this.elements.startBtn.style.display = 'none';
        this.elements.pauseBtn.style.display = 'inline-block';
        this.elements.gameOver.style.display = 'none';
        
        // Show color grid
        this.elements.colorsGrid.style.display = 'grid';
        
        // Generate color grid first, then target
        this.generateColorGrid();
        this.generateNewTarget();
        this.startTimer();
        this.updateDisplay();
    }

    pauseGame() {
        if (this.gameState.isPaused) {
            this.gameState.isPaused = false;
            this.elements.pauseBtn.textContent = 'Pause';
            this.startTimer();
            this.generateNewTarget();
        } else {
            this.gameState.isPaused = true;
            this.elements.pauseBtn.textContent = 'Resume';
            this.stopTimer();
        }
    }

    resetGame() {
        this.stopTimer();
        this.gameState = {
            score: 0,
            level: 1,
            lives: 3,
            isPlaying: false,
            isPaused: false,
            currentTarget: null,
            currentColors: [],
            language: this.gameState.language,
            timeLeft: 15,
            timer: null,
            waitingForNewTarget: false
        };

        this.elements.startBtn.style.display = 'inline-block';
        this.elements.pauseBtn.style.display = 'none';
        this.elements.gameOver.style.display = 'none';
        
        // Hide color grid
        this.elements.colorsGrid.style.display = 'none';
        this.elements.colorsGrid.innerHTML = '';
        
        this.updateDisplay();
    }

    toggleLanguage() {
        if (this.gameState.language === 'english') {
            this.gameState.language = 'french';
            this.elements.languageBtn.textContent = '🇬🇧 English';
            this.elements.instruction.textContent = 'Cliquez sur la couleur:';
        } else {
            this.gameState.language = 'english';
            this.elements.languageBtn.textContent = '🇫🇷 Français';
            this.elements.instruction.textContent = 'Click on the color:';
        }
        
        if (this.gameState.isPlaying && !this.gameState.isPaused) {
            this.updateTargetDisplay();
        }
    }

    generateColorGrid() {
        const colorKeys = Object.keys(this.colors);
        const maxColors = colorKeys.length; // 12 total colors available
        const numColors = Math.min(4 + this.gameState.level, maxColors);
        
        // Select random colors for this round
        this.gameState.currentColors = [];
        const shuffledColors = [...colorKeys].sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < numColors; i++) {
            this.gameState.currentColors.push(shuffledColors[i]);
        }

        // Clear and populate the grid
        this.elements.colorsGrid.innerHTML = '';
        
        this.gameState.currentColors.forEach(colorKey => {
            const colorSquare = document.createElement('div');
            colorSquare.className = 'color-square';
            colorSquare.style.backgroundColor = this.colors[colorKey].hex;
            colorSquare.dataset.color = colorKey;
            
            // Add border for white color visibility
            if (colorKey === 'white') {
                colorSquare.style.border = '4px solid #ddd';
            }
            
            colorSquare.addEventListener('click', () => this.handleColorClick(colorKey, colorSquare));
            this.elements.colorsGrid.appendChild(colorSquare);
        });
    }

    generateNewTarget() {
        if (!this.gameState.isPlaying || this.gameState.isPaused) return;
        
        // Ensure we have current colors displayed
        if (this.gameState.currentColors.length === 0) {
            this.generateColorGrid();
        }
        
        // Select a random color from current colors, but avoid the previous target
        let availableColors = [...this.gameState.currentColors];
        
        // If we have more than one color and there was a previous target, remove it from options
        if (availableColors.length > 1 && this.gameState.currentTarget) {
            availableColors = availableColors.filter(color => color !== this.gameState.currentTarget);
        }
        
        // Ensure we still have colors to choose from
        if (availableColors.length === 0) {
            availableColors = [...this.gameState.currentColors];
        }
        
        const randomIndex = Math.floor(Math.random() * availableColors.length);
        this.gameState.currentTarget = availableColors[randomIndex];
        this.gameState.waitingForNewTarget = false;
        
        this.updateTargetDisplay();
    }

    updateTargetDisplay() {
        const targetColor = this.colors[this.gameState.currentTarget];
        
        if (this.gameState.language === 'english') {
            this.elements.colorName.textContent = targetColor.english;
        } else {
            this.elements.colorName.textContent = targetColor.french;
        }
    }

    handleColorClick(clickedColor, colorSquare) {
        if (!this.gameState.isPlaying || this.gameState.isPaused || this.gameState.waitingForNewTarget) return;

        if (clickedColor === this.gameState.currentTarget) {
            // Correct answer - prevent further clicks until new target
            this.gameState.waitingForNewTarget = true;
            this.gameState.score += 10;
            colorSquare.classList.add('correct');
            
            // Play success sound effect (visual feedback)
            this.showFeedback('Correct! +10', 'success');
            
            setTimeout(() => {
                colorSquare.classList.remove('correct');
                this.generateNewTarget();
            }, 600);
            
        } else {
            // Wrong answer
            this.gameState.lives--;
            colorSquare.classList.add('wrong');
            
            this.showFeedback('Wrong! Try again!', 'error');
            
            setTimeout(() => {
                colorSquare.classList.remove('wrong');
            }, 600);
            
            if (this.gameState.lives <= 0) {
                this.endGame();
                return;
            }
        }
        
        this.updateDisplay();
    }

    startTimer() {
        this.stopTimer();
        this.gameState.timeLeft = 15;
        this.updateDisplay();
        
        this.gameState.timer = setInterval(() => {
            if (!this.gameState.isPaused) {
                this.gameState.timeLeft--;
                this.updateDisplay();
                
                if (this.gameState.timeLeft <= 0) {
                    this.levelUp();
                }
            }
        }, 1000);
    }

    stopTimer() {
        if (this.gameState.timer) {
            clearInterval(this.gameState.timer);
            this.gameState.timer = null;
        }
    }

    levelUp() {
        this.stopTimer();
        this.gameState.level++;
        this.showFeedback(`Level ${this.gameState.level}! 🎉`, 'levelup');
        
        // Regenerate grid with more colors and reset timer
        setTimeout(() => {
            this.generateColorGrid();
            this.generateNewTarget();
            this.startTimer();
        }, 1000);
    }

    showFeedback(message, type) {
        // Create feedback element
        const feedback = document.createElement('div');
        feedback.className = `feedback feedback-${type}`;
        feedback.textContent = message;
        feedback.style.cssText = `
            position: fixed;
            top: 380px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#ff9800'};
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 1.3em;
            font-weight: bold;
            z-index: 1000;
            animation: feedbackSlide 0.6s ease;
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            document.body.removeChild(feedback);
        }, 1000);
    }

    endGame() {
        this.stopTimer();
        this.gameState.isPlaying = false;
        this.elements.startBtn.style.display = 'inline-block';
        this.elements.pauseBtn.style.display = 'none';
        this.elements.gameOver.style.display = 'block';
        this.elements.finalScore.textContent = this.gameState.score;
        this.elements.finalLevel.textContent = this.gameState.level;
    }

    updateDisplay() {
        this.elements.score.textContent = this.gameState.score;
        this.elements.level.textContent = this.gameState.level;
        this.elements.timer.textContent = this.gameState.timeLeft;
        
        // Update lives display
        const heartsArray = Array(this.gameState.lives).fill('❤️');
        const emptyHearts = Array(3 - this.gameState.lives).fill('🖤');
        this.elements.lives.textContent = heartsArray.concat(emptyHearts).join('');
    }
}

// Add CSS for feedback animation
const style = document.createElement('style');
style.textContent = `
    @keyframes feedbackSlide {
        0% { transform: translateX(-50%) translateY(-20px); opacity: 0; }
        50% { transform: translateX(-50%) translateY(0); opacity: 1; }
        100% { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.colorMatchGame = new ColorMatchGame();
});

// Global function for reset button in game over screen
function resetGame() {
    window.colorMatchGame.resetGame();
}