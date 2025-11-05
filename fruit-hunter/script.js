class FruitHunterGame {
    constructor() {
        this.score = 0;
        this.lives = 3;
        this.gameActive = false;
        this.currentLevel = 1;
        this.gameArea = document.getElementById('game-area');
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('lives');
        this.currentLevelElement = document.getElementById('current-level');
        this.timerElement = document.getElementById('timer');
        this.witchFace = document.getElementById('witch-face');
        this.startBtn = document.getElementById('start-btn');
        this.resultsModal = document.getElementById('results-modal');
        this.level1Btn = document.getElementById('level1-btn');
        this.level2Btn = document.getElementById('level2-btn');
        this.level3Btn = document.getElementById('level3-btn');
        this.translationInterface = document.getElementById('translation-interface');
        this.translationButtons = document.getElementById('translation-buttons');
        this.correctAnswers = [];
        this.wrongAnswers = [];
        this.wordsSpawned = 0;
        this.maxWords = 20;
        this.staticWordsCount = 20; // For level 1 - increased from 12
        this.gameStartTime = 0;
        this.timerInterval = null;
        this.gameDuration = 60000; // 60 seconds (1 minute) for level 1, will be adjusted for level 2
        this.usedWords = []; // Track words that have already appeared
        this.currentFrenchWord = null; // Track current French word for level 3
        this.translationButtonsData = []; // Store translation button data
        
        // Word lists
        this.fruits = [
            'apple', 'banana', 'orange', 'grape', 'strawberry', 'pineapple',
            'mango', 'kiwi', 'peach', 'pear', 'cherry', 'watermelon',
            'lemon', 'lime', 'blueberry', 'raspberry', 'coconut', 'papaya'
        ];
        
        // French translations for fruits
        this.fruitsFrench = {
            'apple': 'pomme',
            'banana': 'banane',
            'orange': 'orange',
            'grape': 'raisin',
            'strawberry': 'fraise',
            'pineapple': 'ananas',
            'mango': 'mangue',
            'kiwi': 'kiwi',
            'peach': 'pêche',
            'pear': 'poire',
            'cherry': 'cerise',
            'watermelon': 'pastèque',
            'lemon': 'citron',
            'lime': 'citron vert',
            'blueberry': 'myrtille',
            'raspberry': 'framboise',
            'coconut': 'noix de coco',
            'papaya': 'papaye'
        };
        
        // Fruit emoji mapping - using correct official Unicode emoji
        this.fruitEmojis = {
            'apple': '🍎',           // Red Apple
            'banana': '🍌',         // Banana
            'orange': '🍊',         // Tangerine/Orange
            'grape': '🍇',          // Grapes
            'strawberry': '🍓',     // Strawberry
            'pineapple': '🍍',      // Pineapple
            'mango': '🥭',          // Mango
            'kiwi': '🥝',           // Kiwi Fruit
            'peach': '🍑',          // Peach
            'pear': '🍐',           // Pear
            'cherry': '🍒',         // Cherries
            'watermelon': '🍉',     // Watermelon
            'lemon': '🍋',          // Lemon
            'lime': '🍋',           // Lime (no specific emoji, using lemon)
            'blueberry': '🫐',      // Blueberries
            'raspberry': '🫐',      // Raspberry (no specific emoji, using blueberries)
            'coconut': '🥥',        // Coconut
            'papaya': '🥭'          // Papaya (no specific emoji, using mango)
        };
        
        this.nonFruits = [
            'milk', 'egg', 'bread', 'bacon', 'butter', 'apple juice',
            'cereal', 'cheese', 'fish', 'nuts', 'jam', 'maple syrup',
            'peppers', 'onion'
        ];
        
        this.initializeGame();
        
        // Set initial level
        this.selectLevel(1);
    }
    
    initializeGame() {
        this.startBtn.addEventListener('click', () => this.startGame());
        document.getElementById('play-again-btn').addEventListener('click', () => this.resetGame());
        
        // Level selection
        this.level1Btn.addEventListener('click', () => this.selectLevel(1));
        this.level2Btn.addEventListener('click', () => this.selectLevel(2));
        this.level3Btn.addEventListener('click', () => this.selectLevel(3));
        
        // Prevent right-click context menu during game
        this.gameArea.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    selectLevel(level) {
        this.currentLevel = level;
        this.currentLevelElement.textContent = level;
        
        // Update button states
        this.level1Btn.classList.toggle('active', level === 1);
        this.level2Btn.classList.toggle('active', level === 2);
        this.level3Btn.classList.toggle('active', level === 3);
        
        // Update game area class
        this.gameArea.className = `game-area level${level}`;
        
        // Show/hide translation interface for level 3
        if (level === 3) {
            this.translationInterface.classList.remove('hidden');
            this.createTranslationButtons();
        } else {
            this.translationInterface.classList.add('hidden');
        }
        
        // Reset game if it was running
        if (this.gameActive) {
            this.resetGame();
        }
    }
    
    startGame() {
        this.gameActive = true;
        this.startBtn.disabled = true;
        this.startBtn.textContent = 'Game Running...';
        this.clearGameArea();
        this.startTimer();
        
        if (this.currentLevel === 1) {
            this.createStaticWords();
        } else if (this.currentLevel === 2) {
            this.spawnWords();
        } else if (this.currentLevel === 3) {
            this.spawnFrenchWords();
        }
    }
    
    startTimer() {
        this.gameStartTime = Date.now();
        this.updateTimer();
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 100); // Update every 100ms for smooth display
    }
    
    updateTimer() {
        if (!this.gameActive) return;
        
        const elapsed = Date.now() - this.gameStartTime;
        const remaining = Math.max(0, this.gameDuration - elapsed);
        
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        const centiseconds = Math.floor((remaining % 1000) / 10);
        
        this.timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
        
        // Change color as time runs out
        if (remaining <= 10000) { // Last 10 seconds
            this.timerElement.style.color = '#ff4757';
            this.timerElement.style.animation = 'pulse 0.5s infinite';
        } else if (remaining <= 20000) { // Last 20 seconds
            this.timerElement.style.color = '#ffa502';
        } else {
            this.timerElement.style.color = '#ff6b6b';
            this.timerElement.style.animation = 'none';
        }
        
        // End game when time runs out
        if (remaining <= 0) {
            this.endGame();
        }
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    createStaticWords() {
        // Create a mix of fruits and non-fruits for level 1
        const allWords = [];
        const availableFruits = [...this.fruits]; // Copy of fruits array
        const availableNonFruits = [...this.nonFruits]; // Copy of non-fruits array
        
        // Add some fruits (about 40% of total)
        const fruitsToShow = Math.floor(this.staticWordsCount * 0.4);
        for (let i = 0; i < fruitsToShow && availableFruits.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availableFruits.length);
            const fruit = availableFruits.splice(randomIndex, 1)[0]; // Remove from available list
            allWords.push({ text: fruit, isFruit: true });
            this.usedWords.push(fruit);
        }
        
        // Add non-fruits for the rest
        const nonFruitsToShow = this.staticWordsCount - allWords.length;
        for (let i = 0; i < nonFruitsToShow && availableNonFruits.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availableNonFruits.length);
            const nonFruit = availableNonFruits.splice(randomIndex, 1)[0]; // Remove from available list
            allWords.push({ text: nonFruit, isFruit: false });
            this.usedWords.push(nonFruit);
        }
        
        // Shuffle the array
        for (let i = allWords.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allWords[i], allWords[j]] = [allWords[j], allWords[i]];
        }
        
        // Create word elements with collision detection
        const placedWords = [];
        
        allWords.forEach(wordData => {
            const wordElement = document.createElement('div');
            wordElement.className = `word ${wordData.isFruit ? 'fruit' : 'not-fruit'} static`;
            wordElement.textContent = wordData.text;
            wordElement.dataset.isFruit = wordData.isFruit;
            wordElement.dataset.text = wordData.text;
            
            // Find a non-overlapping position
            let position = this.findNonOverlappingPosition(placedWords);
            
            wordElement.style.left = position.x + 'px';
            wordElement.style.top = position.y + 'px';
            
            // Store the position for collision detection
            placedWords.push({
                x: position.x,
                y: position.y,
                width: 150, // Approximate word width
                height: 60  // Approximate word height
            });
            
            // Add click event
            wordElement.addEventListener('click', (e) => this.handleWordClick(e, wordElement));
            
            this.gameArea.appendChild(wordElement);
        });
        
        // End game after 60 seconds for level 1
        setTimeout(() => {
            if (this.gameActive && this.currentLevel === 1) {
                this.endGame();
            }
        }, 60000);
    }
    
    findNonOverlappingPosition(placedWords) {
        const maxX = this.gameArea.clientWidth - 150; // Account for word width
        const maxY = this.gameArea.clientHeight - 200; // Much more space from bottom
        const minDistance = 20; // Minimum distance between words
        
        let attempts = 0;
        const maxAttempts = 100;
        
        while (attempts < maxAttempts) {
            const x = Math.random() * Math.max(maxX, 100);
            const y = Math.random() * Math.max(maxY, 100);
            
            // Check if this position overlaps with any existing word
            let overlaps = false;
            for (let placedWord of placedWords) {
                if (this.isOverlapping(x, y, 150, 60, placedWord, minDistance)) {
                    overlaps = true;
                    break;
                }
            }
            
            if (!overlaps) {
                return { x, y };
            }
            
            attempts++;
        }
        
        // If we can't find a non-overlapping position, use a grid-based fallback
        const gridX = (placedWords.length % 4) * (maxX / 4);
        const gridY = Math.floor(placedWords.length / 4) * (maxY / 3);
        return { x: gridX, y: gridY };
    }
    
    isOverlapping(x1, y1, w1, h1, placedWord, minDistance) {
        const x2 = placedWord.x;
        const y2 = placedWord.y;
        const w2 = placedWord.width;
        const h2 = placedWord.height;
        
        // Add minimum distance to the dimensions
        return !(x1 > x2 + w2 + minDistance ||
                 x2 > x1 + w1 + minDistance ||
                 y1 > y2 + h2 + minDistance ||
                 y2 > y1 + h1 + minDistance);
    }
    
    spawnWords() {
        if (!this.gameActive || this.wordsSpawned >= this.maxWords) {
            if (this.wordsSpawned >= this.maxWords) {
                setTimeout(() => this.endGame(), 2000); // Wait for last words to clear
            }
            return;
        }
        
        const word = this.createRandomWord();
        if (word === null) {
            // No more unique words available, end the game
            return;
        }
        
        this.gameArea.appendChild(word);
        this.wordsSpawned++;
        
        // Spawn next word after random interval - very high frequency for maximum difficulty
        const nextSpawnTime = Math.random() * 600 + 200; // 0.2-0.8 seconds (extremely fast)
        setTimeout(() => this.spawnWords(), nextSpawnTime);
    }
    
    createTranslationButtons() {
        // Clear existing buttons
        this.translationButtons.innerHTML = '';
        this.translationButtonsData = [];
        
        // Create buttons for all English fruit names
        this.fruits.forEach(englishFruit => {
            const button = document.createElement('button');
            button.className = 'translation-btn';
            button.textContent = englishFruit;
            button.dataset.english = englishFruit;
            
            // Add click event for translation matching
            button.addEventListener('click', () => this.handleTranslationClick(englishFruit, button));
            
            this.translationButtons.appendChild(button);
            this.translationButtonsData.push({
                english: englishFruit,
                french: this.fruitsFrench[englishFruit],
                button: button
            });
        });
    }
    
    spawnFrenchWords() {
        if (!this.gameActive || this.wordsSpawned >= this.maxWords) {
            if (this.wordsSpawned >= this.maxWords) {
                setTimeout(() => this.endGame(), 2000); // Wait for last words to clear
            }
            return;
        }
        
        const frenchWord = this.createRandomFrenchWord();
        if (frenchWord === null) {
            // No more unique words available, end the game
            return;
        }
        
        this.gameArea.appendChild(frenchWord);
        this.wordsSpawned++;
        
        // Spawn next word after random interval (slower than level 2 for translation time)
        const nextSpawnTime = Math.random() * 3000 + 2500; // 2.5-5.5 seconds (much slower for reading)
        setTimeout(() => this.spawnFrenchWords(), nextSpawnTime);
    }
    
    createRandomFrenchWord() {
        // Only use fruits for level 3
        const availableFruits = this.fruits.filter(fruit => !this.usedWords.includes(fruit));
        
        if (availableFruits.length === 0) {
            // No more unique words available, end the game
            this.endGame();
            return null;
        }
        
        const englishFruit = availableFruits[Math.floor(Math.random() * availableFruits.length)];
        const frenchFruit = this.fruitsFrench[englishFruit];
        
        this.usedWords.push(englishFruit);
        
        const wordElement = document.createElement('div');
        wordElement.className = 'word french moving';
        wordElement.textContent = frenchFruit;
        wordElement.dataset.english = englishFruit;
        wordElement.dataset.french = frenchFruit;
        
        // Random starting position and speed
        const startY = Math.random() * Math.max(this.gameArea.clientHeight - 200, 100);
        const speed = 12; // Much slower speed for translation time (12 seconds to cross screen)
        
        wordElement.style.top = startY + 'px';
        wordElement.style.animationDuration = speed + 's';
        
        // Remove word when animation ends (missed translation)
        wordElement.addEventListener('animationend', () => {
            if (wordElement.parentNode && !wordElement.classList.contains('exploding')) {
                // Missed a French word - lose a life
                if (this.gameActive) {
                    this.lives--;
                    this.showWitchFace();
                    this.updateDisplay();
                    
                    if (this.lives <= 0) {
                        this.endGame();
                        return;
                    }
                }
                wordElement.remove();
            }
        });
        
        return wordElement;
    }
    
    handleTranslationClick(englishWord, button) {
        if (!this.gameActive) return;
        
        // Find the current French word on screen that matches this English translation
        const frenchWords = this.gameArea.querySelectorAll('.word.french:not(.exploding)');
        let matchFound = false;
        
        frenchWords.forEach(frenchWordElement => {
            const englishEquivalent = frenchWordElement.dataset.english;
            
            if (englishEquivalent === englishWord) {
                // Correct match!
                matchFound = true;
                this.score += 15; // Higher score for translation
                this.correctAnswers.push(`${frenchWordElement.dataset.french} → ${englishWord}`);
                
                // Visual feedback
                this.showTranslationMatch(frenchWordElement, button, true);
                this.explodeWord(frenchWordElement, true);
                
                // Temporarily disable button
                button.classList.add('correct');
                button.disabled = true;
                setTimeout(() => {
                    button.classList.remove('correct');
                    button.disabled = false;
                }, 1000);
            }
        });
        
        if (!matchFound) {
            // Wrong translation or no matching French word on screen
            this.lives--;
            this.wrongAnswers.push(`❌ ${englishWord}`);
            this.showWitchFace();
            
            // Visual feedback for wrong answer
            button.classList.add('wrong');
            button.disabled = true;
            setTimeout(() => {
                button.classList.remove('wrong');
                button.disabled = false;
            }, 1000);
            
            if (this.lives <= 0) {
                this.endGame();
                return;
            }
        }
        
        this.updateDisplay();
    }
    
    showTranslationMatch(frenchWordElement, englishButton, isCorrect) {
        if (!isCorrect) return;
        
        // Create a visual connection line between the French word and English button
        const frenchRect = frenchWordElement.getBoundingClientRect();
        const buttonRect = englishButton.getBoundingClientRect();
        const gameAreaRect = this.gameArea.getBoundingClientRect();
        
        const line = document.createElement('div');
        line.className = 'connection-line';
        
        // Calculate line position and angle
        const startX = frenchRect.left + frenchRect.width / 2 - gameAreaRect.left;
        const startY = frenchRect.top + frenchRect.height / 2 - gameAreaRect.top;
        const endX = buttonRect.left + buttonRect.width / 2 - gameAreaRect.left;
        const endY = buttonRect.top + buttonRect.height / 2 - gameAreaRect.top;
        
        const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
        
        line.style.left = startX + 'px';
        line.style.top = startY + 'px';
        line.style.width = length + 'px';
        line.style.transformOrigin = '0 50%';
        line.style.transform = `rotate(${angle}deg)`;
        
        this.gameArea.appendChild(line);
        
        // Remove line after animation
        setTimeout(() => {
            if (line.parentNode) {
                line.remove();
            }
        }, 1000);
    }
    
    createRandomWord() {
        const isFruit = Math.random() < 0.4; // 40% chance of fruit
        const wordList = isFruit ? this.fruits : this.nonFruits;
        
        // Filter out already used words
        const availableWords = wordList.filter(word => !this.usedWords.includes(word));
        
        let text, actualIsFruit;
        
        // If no words available from this category, try the other category
        if (availableWords.length === 0) {
            const otherWordList = isFruit ? this.nonFruits : this.fruits;
            const otherAvailableWords = otherWordList.filter(word => !this.usedWords.includes(word));
            
            if (otherAvailableWords.length === 0) {
                // No more unique words available, end the game
                this.endGame();
                return null;
            }
            
            text = otherAvailableWords[Math.floor(Math.random() * otherAvailableWords.length)];
            actualIsFruit = !isFruit; // Switch category
        } else {
            text = availableWords[Math.floor(Math.random() * availableWords.length)];
            actualIsFruit = isFruit;
        }
        
        this.usedWords.push(text);
        
        const wordElement = document.createElement('div');
        wordElement.className = `word ${actualIsFruit ? 'fruit' : 'not-fruit'} moving`;
        wordElement.textContent = text;
        wordElement.dataset.isFruit = actualIsFruit;
        wordElement.dataset.text = text;
        
        // Random starting position and consistent slower speed for level 2
        // Keep words in the visible area (not at bottom)
        const startY = Math.random() * Math.max(this.gameArea.clientHeight - 200, 100);
        const speed = 6; // Fixed 6 seconds to cross screen (slower and consistent)
        
        wordElement.style.top = startY + 'px';
        wordElement.style.animationDuration = speed + 's';
        
        // Add click event
        wordElement.addEventListener('click', (e) => this.handleWordClick(e, wordElement));
        
        // Remove word when animation ends
        wordElement.addEventListener('animationend', () => {
            if (wordElement.parentNode && !wordElement.classList.contains('exploding')) {
                // Check if it's a fruit that escaped - lose a life
                if (actualIsFruit && this.gameActive) {
                    this.lives--;
                    this.showWitchFace();
                    this.updateDisplay();
                    
                    if (this.lives <= 0) {
                        this.endGame();
                        return;
                    }
                }
                wordElement.remove();
            }
        });
        
        return wordElement;
    }
    
    handleWordClick(event, wordElement) {
        event.preventDefault();
        
        if (!this.gameActive) return;
        
        const isFruit = wordElement.dataset.isFruit === 'true';
        const wordText = wordElement.dataset.text;
        
        if (isFruit) {
            // Correct click on fruit
            this.score += 10;
            this.correctAnswers.push(wordText);
            this.explodeWord(wordElement, true, event);
            
            // For level 1, check if all fruits are found
            if (this.currentLevel === 1) {
                const remainingFruits = this.gameArea.querySelectorAll('.word.fruit:not(.exploding)');
                if (remainingFruits.length === 0) {
                    setTimeout(() => this.endGame(), 1000); // Small delay to see the last explosion
                }
            }
        } else {
            // Wrong click on non-fruit - show witch face
            this.lives--;
            this.wrongAnswers.push(wordText);
            this.explodeWord(wordElement, false, event);
            this.showWitchFace();
            
            if (this.lives <= 0) {
                this.endGame();
                return;
            }
        }
        
        this.updateDisplay();
    }
    
    showWitchFace() {
        console.log('Showing witch face!');
        
        // Create a new witch face element dynamically
        const witchElement = document.createElement('div');
        witchElement.innerHTML = '🧙‍♀️ NO!';
        witchElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 4em;
            z-index: 99999;
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 30px;
            border-radius: 20px;
            text-align: center;
            font-weight: bold;
            border: 5px solid white;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
            animation: headShake 1s ease-in-out;
        `;
        
        // Add to body (not game area)
        document.body.appendChild(witchElement);
        
        // Remove after 2 seconds
        setTimeout(() => {
            if (witchElement.parentNode) {
                witchElement.remove();
            }
        }, 2000);
    }
    
    explodeWord(wordElement, isCorrect, clickEvent = null) {
        // For moving words, preserve their visual position during explosion
        if (wordElement.classList.contains('moving')) {
            const rect = wordElement.getBoundingClientRect();
            const gameAreaRect = this.gameArea.getBoundingClientRect();
            
            // Stop the animation and fix the position where it was clicked
            wordElement.style.animation = 'none';
            wordElement.style.left = (rect.left - gameAreaRect.left) + 'px';
            wordElement.style.top = (rect.top - gameAreaRect.top) + 'px';
        }
        
        wordElement.classList.add('exploding');
        
        // Change color during explosion and show emoji for fruits
        if (isCorrect) {
            wordElement.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
            
            // Show fruit emoji - handle both English and French words
            let fruitName;
            if (wordElement.classList.contains('french')) {
                // For French words, use the English equivalent to get the emoji
                fruitName = wordElement.dataset.english;
            } else {
                // For English words, use the text directly
                fruitName = wordElement.dataset.text;
            }
            const emoji = this.fruitEmojis[fruitName] || '🍎';
            this.showFruitEmoji(wordElement, emoji, clickEvent);
        } else {
            wordElement.style.background = 'linear-gradient(45deg, #f44336, #d32f2f)';
        }
        
        // Remove after explosion animation
        setTimeout(() => {
            if (wordElement.parentNode) {
                wordElement.remove();
            }
        }, 500);
    }
    
    showFruitEmoji(wordElement, emoji, clickEvent = null) {
        // Create emoji element
        const emojiElement = document.createElement('div');
        emojiElement.textContent = emoji;
        emojiElement.style.position = 'absolute';
        emojiElement.style.fontSize = '1.5em';
        emojiElement.style.pointerEvents = 'none';
        emojiElement.style.zIndex = '1000';
        emojiElement.style.transformOrigin = 'center center';
        emojiElement.style.animation = 'emojiPop 1.5s ease-out forwards';
        
        if (clickEvent) {
            // Use click coordinates relative to game area
            const gameAreaRect = this.gameArea.getBoundingClientRect();
            emojiElement.style.left = (clickEvent.clientX - gameAreaRect.left) + 'px';
            emojiElement.style.top = (clickEvent.clientY - gameAreaRect.top) + 'px';
        } else {
            // Fallback to word position (for level 1 static words)
            const computedStyle = window.getComputedStyle(wordElement);
            const wordLeft = parseFloat(computedStyle.left) || 0;
            const wordTop = parseFloat(computedStyle.top) || 0;
            const wordWidth = wordElement.offsetWidth;
            const wordHeight = wordElement.offsetHeight;
            
            // Position emoji at the center of the word
            emojiElement.style.left = (wordLeft + wordWidth / 2) + 'px';
            emojiElement.style.top = (wordTop + wordHeight / 2) + 'px';
        }
        
        this.gameArea.appendChild(emojiElement);
        
        // Remove emoji after animation
        setTimeout(() => {
            if (emojiElement.parentNode) {
                emojiElement.remove();
            }
        }, 1500);
    }
    
    updateDisplay() {
        this.scoreElement.textContent = this.score;
        
        const hearts = '❤️'.repeat(this.lives);
        const emptyHearts = '🤍'.repeat(3 - this.lives);
        this.livesElement.textContent = hearts + emptyHearts;
    }
    
    endGame() {
        this.gameActive = false;
        this.stopTimer();
        this.clearGameArea();
        this.showResults();
    }
    
    clearGameArea() {
        while (this.gameArea.firstChild) {
            this.gameArea.removeChild(this.gameArea.firstChild);
        }
    }
    
    showResults() {
        const finalScoreElement = document.getElementById('final-score');
        const correctListElement = document.getElementById('correct-list');
        const wrongListElement = document.getElementById('wrong-list');
        
        // Calculate final score
        const totalPossibleScore = this.correctAnswers.length * 10;
        const accuracy = this.correctAnswers.length > 0 ? 
            Math.round((this.correctAnswers.length / (this.correctAnswers.length + this.wrongAnswers.length)) * 100) : 0;
        
        finalScoreElement.innerHTML = `
            <div>Final Score: ${this.score} points</div>
            <div>Accuracy: ${accuracy}%</div>
            <div>Fruits Found: ${this.correctAnswers.length}</div>
        `;
        
        // Show correct answers
        correctListElement.innerHTML = '';
        if (this.correctAnswers.length > 0) {
            this.correctAnswers.forEach(word => {
                const span = document.createElement('span');
                span.className = 'result-word correct';
                span.textContent = word;
                correctListElement.appendChild(span);
            });
        } else {
            correctListElement.innerHTML = '<em>No fruits found</em>';
        }
        
        // Show wrong answers
        wrongListElement.innerHTML = '';
        if (this.wrongAnswers.length > 0) {
            this.wrongAnswers.forEach(word => {
                const span = document.createElement('span');
                span.className = 'result-word wrong';
                span.textContent = word;
                wrongListElement.appendChild(span);
            });
        } else {
            wrongListElement.innerHTML = '<em>No mistakes! Perfect!</em>';
        }
        
        this.resultsModal.classList.remove('hidden');
    }
    
    resetGame() {
        this.score = 0;
        this.lives = 3;
        this.gameActive = false;
        this.correctAnswers = [];
        this.wrongAnswers = [];
        this.wordsSpawned = 0;
        this.usedWords = []; // Reset used words for new game
        this.currentFrenchWord = null;
        
        this.stopTimer();
        this.timerElement.textContent = '1:00.00';
        this.timerElement.style.color = '#ff6b6b';
        this.timerElement.style.animation = 'none';
        
        this.updateDisplay();
        this.clearGameArea();
        this.resultsModal.classList.add('hidden');
        
        // Hide witch face if visible
        this.witchFace.classList.remove('show', 'shake');
        this.witchFace.classList.add('hidden');
        
        // Reset game area class
        this.gameArea.className = `game-area level${this.currentLevel}`;
        
        // Reset translation buttons for level 3
        if (this.currentLevel === 3 && this.translationButtonsData.length > 0) {
            this.translationButtonsData.forEach(buttonData => {
                buttonData.button.classList.remove('correct', 'wrong');
                buttonData.button.disabled = false;
            });
        }
        
        this.startBtn.disabled = false;
        this.startBtn.textContent = 'Start Game';
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new FruitHunterGame();
});

// Add some fun sound effects (optional - using Web Audio API)
class SoundEffects {
    constructor() {
        this.audioContext = null;
        this.initAudio();
    }
    
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }
    
    playTone(frequency, duration, type = 'sine') {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playCorrect() {
        this.playTone(523.25, 0.2); // C5 note
    }
    
    playWrong() {
        this.playTone(196, 0.3, 'sawtooth'); // G3 note
    }
}

// Add sound effects to the game
const soundEffects = new SoundEffects();

// Override the handleWordClick method to include sound effects
document.addEventListener('DOMContentLoaded', () => {
    const originalHandleWordClick = FruitHunterGame.prototype.handleWordClick;
    FruitHunterGame.prototype.handleWordClick = function(event, wordElement) {
        const isFruit = wordElement.dataset.isFruit === 'true';
        
        if (isFruit) {
            soundEffects.playCorrect();
        } else {
            soundEffects.playWrong();
        }
        
        originalHandleWordClick.call(this, event, wordElement);
    };
});