
// ============================================
// Animal Neighbors Adventure - Game Logic
// ============================================

// Game State
let gameState = {
    currentLevel: 0,
    currentScreen: 'home',
    language: 'en',
    score: 0,
    lives: 3,
    totalScore: 0,
    levelsCompleted: [false, false, false, false],
    levelScores: [0, 0, 0, 0],
    levelStars: [0, 0, 0, 0],
    currentQuestion: 0,
    correctAnswers: 0,
    totalQuestions: 0
};

// Animals Data (from curriculum)
const animals = [
    { name: 'spider', emoji: '🕷️', fr: 'araignée' },
    { name: 'skunk', emoji: '🦨', fr: 'mouffette' },
    { name: 'fox', emoji: '🦊', fr: 'renard' },
    { name: 'raccoon', emoji: '🦝', fr: 'raton laveur' },
    { name: 'mouse', emoji: '🐭', fr: 'souris' },
    { name: 'robin', emoji: '🐦', fr: 'rouge-gorge' },
    { name: 'worm', emoji: '🪱', fr: 'ver' },
    { name: 'ladybug', emoji: '🐞', fr: 'coccinelle' },
    { name: 'squirrel', emoji: '🐿️', fr: 'écureuil' },
    { name: 'caterpillar', emoji: '🐛', fr: 'chenille' },
    { name: 'ant', emoji: '🐜', fr: 'fourmi' },
    { name: 'snake', emoji: '🐍', fr: 'serpent' },
    { name: 'woodpecker', emoji: '🦜', fr: 'pic', useSvg: true },
    { name: 'frog', emoji: '🐸', fr: 'grenouille' },
    { name: 'butterfly', emoji: '🦋', fr: 'papillon' }
];

// Body Parts Questions (Level 2)
const bodyPartQuestions = [
    { visual: '👁️', question: 'What is this?', correct: 'an eye', options: ['an eye', 'a nose', 'an ear'], fr: { question: 'Qu\'est-ce que c\'est?', correct: 'un œil', options: ['un œil', 'un nez', 'une oreille'] } },
    { visual: '🪶', question: 'It is ___', correct: 'a feather', options: ['a wing', 'a feather', 'a tail'], fr: { question: 'C\'est ___', correct: 'une plume', options: ['une aile', 'une plume', 'une queue'] } },
    { visual: '🦵', question: 'What is this?', correct: 'a leg', options: ['a leg', 'a paw', 'a tail'], fr: { question: 'Qu\'est-ce que c\'est?', correct: 'une jambe', options: ['une jambe', 'une patte', 'une queue'] } },
    { visual: '👃', question: 'It is ___', correct: 'a nose', options: ['a nose', 'a beak', 'an ear'], fr: { question: 'C\'est ___', correct: 'un nez', options: ['un nez', 'un bec', 'une oreille'] } },
    { visual: '🦊↗️', question: 'What is this?', correct: 'a tail', options: ['a tail', 'a leg', 'a wing'], fr: { question: 'Qu\'est-ce que c\'est?', correct: 'une queue', options: ['une queue', 'une jambe', 'une aile'] } },
    { visual: '👂', question: 'It is ___', correct: 'an ear', options: ['an ear', 'an eye', 'a nose'], fr: { question: 'C\'est ___', correct: 'une oreille', options: ['une oreille', 'un œil', 'un nez'] } },
    { visual: '🕊️', question: 'What is this?', correct: 'a wing', options: ['a wing', 'a feather', 'a beak'], fr: { question: 'Qu\'est-ce que c\'est?', correct: 'une aile', options: ['une aile', 'une plume', 'un bec'] } },
    { visual: '🦅', question: 'It is ___', correct: 'a beak', options: ['a beak', 'a nose', 'a mouth'], fr: { question: 'C\'est ___', correct: 'un bec', options: ['un bec', 'un nez', 'une bouche'] } },
    { visual: '🐾', question: 'What is this?', correct: 'a paw', options: ['a paw', 'a leg', 'a tail'], fr: { question: 'Qu\'est-ce que c\'est?', correct: 'une patte', options: ['une patte', 'une jambe', 'une queue'] } },
    { visual: '🦗', question: 'It is ___', correct: 'an antenna', options: ['an antenna', 'a leg', 'a wing'], fr: { question: 'C\'est ___', correct: 'une antenne', options: ['une antenne', 'une jambe', 'une aile'] } },
    { visual: '🐻', question: 'What is this?', correct: 'fur', options: ['fur', 'a feather', 'a wing'], fr: { question: 'Qu\'est-ce que c\'est?', correct: 'de la fourrure', options: ['de la fourrure', 'une plume', 'une aile'] } },
    { visual: '👀', question: 'They are ___', correct: 'eyes', options: ['eyes', 'ears', 'noses'], fr: { question: 'Ce sont ___', correct: 'des yeux', options: ['des yeux', 'des oreilles', 'des nez'] } }
];

// Description Questions (Level 3)
const descriptionQuestions = [
    { animal: '🐭', question: 'Is the mouse big or small?', correct: 'It is small', wrong: 'It is big', fr: { question: 'La souris est-elle grande ou petite?', correct: 'Elle est petite', wrong: 'Elle est grande' } },
    { animal: '🐰', question: 'Are the rabbit\'s ears long or short?', correct: 'They are long', wrong: 'They are short', fr: { question: 'Les oreilles du lapin sont-elles longues ou courtes?', correct: 'Elles sont longues', wrong: 'Elles sont courtes' } },
    { animal: '🐱', question: 'Is the cat\'s tail long or short?', correct: 'It is long', wrong: 'It is short', fr: { question: 'La queue du chat est-elle longue ou courte?', correct: 'Elle est longue', wrong: 'Elle est courte' } },
    { animal: '🦋', question: 'Are the butterfly\'s wings big or small?', correct: 'They are small', wrong: 'They are big', fr: { question: 'Les ailes du papillon sont-elles grandes ou petites?', correct: 'Elles sont petites', wrong: 'Elles sont grandes' } },
    { animal: '🐍', question: 'Is the snake\'s body long or short?', correct: 'It is long', wrong: 'It is short', fr: { question: 'Le corps du serpent est-il long ou court?', correct: 'Il est long', wrong: 'Il est court' } },
    { animal: '🦊', question: 'Is the fox fast or slow?', correct: 'It is fast', wrong: 'It is slow', fr: { question: 'Le renard est-il rapide ou lent?', correct: 'Il est rapide', wrong: 'Il est lent' } },
    { animal: '🐌', question: 'Is the snail fast or slow?', correct: 'It is slow', wrong: 'It is fast', fr: { question: 'L\'escargot est-il rapide ou lent?', correct: 'Il est lent', wrong: 'Il est rapide' } },
    { animal: '🐕', question: 'Is the dog friendly or mean?', correct: 'It is friendly', wrong: 'It is mean', fr: { question: 'Le chien est-il amical ou méchant?', correct: 'Il est amical', wrong: 'Il est méchant' } },
    { animal: '🐻', question: 'Is the bear wild or tame?', correct: 'It is wild', wrong: 'It is tame', fr: { question: 'L\'ours est-il sauvage ou apprivoisé?', correct: 'Il est sauvage', wrong: 'Il est apprivoisé' } },
    { animal: '🦅', question: 'Is the eagle safe or dangerous?', correct: 'It is dangerous', wrong: 'It is safe', fr: { question: 'L\'aigle est-il sans danger ou dangereux?', correct: 'Il est dangereux', wrong: 'Il est sans danger' } },
    { animal: '🐰', question: 'Is the rabbit safe or dangerous?', correct: 'It is safe', wrong: 'It is dangerous', fr: { question: 'Le lapin est-il sans danger ou dangereux?', correct: 'Il est sans danger', wrong: 'Il est dangereux' } },
    { animal: '🦁', question: 'Is the lion loud or quiet?', correct: 'It is loud', wrong: 'It is quiet', fr: { question: 'Le lion est-il bruyant ou silencieux?', correct: 'Il est bruyant', wrong: 'Il est silencieux' } },
    { animal: '🐭', question: 'Is the mouse loud or quiet?', correct: 'It is quiet', wrong: 'It is loud', fr: { question: 'La souris est-elle bruyante ou silencieuse?', correct: 'Elle est silencieuse', wrong: 'Elle est bruyante' } },
    { animal: '🐘', question: 'Is the elephant big or small?', correct: 'It is big', wrong: 'It is small', fr: { question: 'L\'éléphant est-il grand ou petit?', correct: 'Il est grand', wrong: 'Il est petit' } },
    { animal: '🦒', question: 'Is the giraffe\'s neck long or short?', correct: 'It is long', wrong: 'It is short', fr: { question: 'Le cou de la girafe est-il long ou court?', correct: 'Il est long', wrong: 'Il est court' } }
];

// Animal Riddles (Level 4)
const riddles = [
    {
        clues: ['I am small.', 'I have wings.', 'I have spots.'],
        answer: 'ladybug',
        options: ['ladybug', 'butterfly', 'ant', 'spider', 'robin', 'caterpillar'],
        explanation: 'A ladybug is small, has wings, and is red with black dots!',
        fr: {
            clues: ['Je suis petite.', 'J\'ai des ailes.', 'J\'ai des taches.'],
            explanation: 'Une coccinelle est petite, a des ailes et est rouge avec des points noirs!'
        }
    },
    {
        clues: ['I am fast.', 'I have a bushy tail.', 'I live in the forest.'],
        answer: 'fox',
        options: ['fox', 'squirrel', 'raccoon', 'skunk', 'mouse', 'rabbit'],
        explanation: 'A fox is fast, has a bushy tail, and has orange fur!',
        fr: {
            clues: ['Je suis rapide.', 'J\'ai une queue touffue.', 'Je vis dans la forêt.'],
            explanation: 'Un renard est rapide, a une queue touffue et a une fourrure orange!'
        }
    },
    {
        clues: ['I live near water.', 'I can jump.', 'I eat insects.'],
        answer: 'frog',
        options: ['frog', 'snake', 'spider', 'robin', 'caterpillar', 'ant'],
        explanation: 'A frog lives near water, can jump, and is green!',
        fr: {
            clues: ['Je vis près de l\'eau.', 'Je peux sauter.', 'Je mange des insectes.'],
            explanation: 'Une grenouille vit près de l\'eau, peut sauter et est verte!'
        }
    },
    {
        clues: ['I have many legs.', 'I make webs.', 'I catch insects.'],
        answer: 'spider',
        options: ['spider', 'ant', 'ladybug', 'caterpillar', 'worm', 'butterfly'],
        explanation: 'A spider has 8 legs, makes webs, and is small!',
        fr: {
            clues: ['J\'ai beaucoup de pattes.', 'Je fais des toiles.', 'J\'attrape des insectes.'],
            explanation: 'Une araignée a 8 pattes, fait des toiles et est petite!'
        }
    },
    {
        clues: ['I have a bushy tail.', 'I climb trees.', 'I collect food.'],
        answer: 'squirrel',
        options: ['squirrel', 'raccoon', 'mouse', 'fox', 'woodpecker', 'robin'],
        explanation: 'A squirrel has a bushy tail, climbs trees, and loves nuts!',
        fr: {
            clues: ['J\'ai une queue touffue.', 'Je grimpe aux arbres.', 'Je ramasse de la nourriture.'],
            explanation: 'Un écureuil a une queue touffue, grimpe aux arbres et aime les noix!'
        }
    },
    {
        clues: ['I have no legs.', 'I slither.', 'I can be dangerous.'],
        answer: 'snake',
        options: ['snake', 'worm', 'caterpillar', 'spider', 'frog', 'ladybug'],
        explanation: 'A snake has no legs, slithers, and is long!',
        fr: {
            clues: ['Je n\'ai pas de pattes.', 'Je rampe.', 'Je peux être dangereux.'],
            explanation: 'Un serpent n\'a pas de pattes, rampe et est long!'
        }
    },
    {
        clues: ['I have a mask pattern.', 'I am nocturnal.', 'I am clever.'],
        answer: 'raccoon',
        options: ['raccoon', 'skunk', 'fox', 'mouse', 'squirrel', 'worm'],
        explanation: 'A raccoon has a mask pattern, is nocturnal, and washes its food!',
        fr: {
            clues: ['J\'ai un motif de masque.', 'Je suis nocturne.', 'Je suis malin.'],
            explanation: 'Un raton laveur a un motif de masque, est nocturne et lave sa nourriture!'
        }
    },
    {
        clues: ['I have colorful wings.', 'I fly from flower to flower.', 'I was once a caterpillar.'],
        answer: 'butterfly',
        options: ['butterfly', 'ladybug', 'robin', 'caterpillar', 'ant', 'spider'],
        explanation: 'A butterfly has beautiful wings, was a caterpillar, and drinks nectar!',
        fr: {
            clues: ['J\'ai des ailes colorées.', 'Je vole de fleur en fleur.', 'J\'étais une chenille.'],
            explanation: 'Un papillon a de belles ailes, était une chenille et boit du nectar!'
        }
    },
    {
        clues: ['I am very small.', 'I work in groups.', 'I can carry heavy things.'],
        answer: 'ant',
        options: ['ant', 'spider', 'ladybug', 'worm', 'caterpillar', 'mouse'],
        explanation: 'An ant is very small, very strong, and lives in colonies!',
        fr: {
            clues: ['Je suis très petite.', 'Je travaille en groupe.', 'Je peux porter des choses lourdes.'],
            explanation: 'Une fourmi est très petite, très forte et vit en colonies!'
        }
    },
    {
        clues: ['I have a beak.', 'I peck on wood.', 'I have a red head.'],
        answer: 'woodpecker',
        options: ['woodpecker', 'robin', 'squirrel', 'spider', 'butterfly', 'fox'],
        explanation: 'A woodpecker has a beak, pecks on trees, and looks for insects!',
        fr: {
            clues: ['J\'ai un bec.', 'Je picore sur le bois.', 'J\'ai une tête rouge.'],
            explanation: 'Un pic a un bec, picore sur les arbres et cherche des insectes!'
        }
    }
];

// Translations
const translations = {
    en: {
        welcomeTitle: 'Welcome to Animal Neighbors!',
        welcomeText: 'Learn about animals, their body parts, and how to describe them in English.',
        level1Title: 'Animal Spotter',
        level1Desc: 'Find animals in the backyard',
        level2Title: 'Body Parts Detective',
        level2Desc: 'Learn animal body parts',
        level3Title: 'Describe the Animal',
        level3Desc: 'Use opposites and descriptions',
        level4Title: 'Animal Riddles',
        level4Desc: 'Solve fun animal riddles',
        findPrompt: 'Find the:',
        level1ScreenTitle: '🔍 Level 1: Animal Spotter',
        level1Instruction: 'Click on the animal!',
        level2ScreenTitle: '🦅 Level 2: Body Parts Detective',
        level2Instruction: 'What is this body part?',
        level3ScreenTitle: '📝 Level 3: Describe the Animal',
        level3Instruction: 'Choose the correct description!',
        level4ScreenTitle: '🎭 Level 4: Animal Riddles',
        level4Instruction: 'Solve the riddle!',
        riddleTitle: 'Who am I?',
        completeTitle: '🎉 Level Complete!',
        scoreLabel: 'Score:',
        accuracyLabel: 'Accuracy:',
        gameOverTitle: '😔 Game Over',
        gameOverText: 'You ran out of lives! Try again?',
        finalScoreLabel: 'Final Score:',
        congratsTitle: '🎊 Congratulations!',
        congratsText: 'You completed all 4 levels!',
        totalScoreLabel: 'Total Score',
        totalStarsLabel: 'Stars Earned',
        medalLabel: 'Achievement',
        achievementsTitle: 'What You Learned:',
        achievement1: '✅ Identified 15 different animals',
        achievement2: '✅ Learned 11 animal body parts',
        achievement3: '✅ Practiced using opposites',
        achievement4: '✅ Used "It is" and "They are" correctly',
        correct: 'Correct!',
        wrong: 'Try again!',
        great: 'Great job!',
        almostThere: 'Almost there!'
    },
    fr: {
        welcomeTitle: 'Bienvenue aux Voisins Animaux!',
        welcomeText: 'Apprends sur les animaux, leurs parties du corps et comment les décrire en anglais.',
        level1Title: 'Cherche l\'Animal',
        level1Desc: 'Trouve les animaux dans la cour',
        level2Title: 'Détective des Parties',
        level2Desc: 'Apprends les parties du corps',
        level3Title: 'Décris l\'Animal',
        level3Desc: 'Utilise les contraires',
        level4Title: 'Énigmes d\'Animaux',
        level4Desc: 'Résous les énigmes',
        findPrompt: 'Trouve le/la:',
        level1ScreenTitle: '🔍 Niveau 1: Cherche l\'Animal',
        level1Instruction: 'Clique sur l\'animal!',
        level2ScreenTitle: '🦅 Niveau 2: Détective des Parties',
        level2Instruction: 'Quelle est cette partie du corps?',
        level3ScreenTitle: '📝 Niveau 3: Décris l\'Animal',
        level3Instruction: 'Choisis la bonne description!',
        level4ScreenTitle: '🎭 Niveau 4: Énigmes d\'Animaux',
        level4Instruction: 'Résous l\'énigme!',
        riddleTitle: 'Qui suis-je?',
        completeTitle: '🎉 Niveau Complété!',
        scoreLabel: 'Score:',
        accuracyLabel: 'Précision:',
        gameOverTitle: '😔 Jeu Terminé',
        gameOverText: 'Tu n\'as plus de vies! Réessayer?',
        finalScoreLabel: 'Score Final:',
        congratsTitle: '🎊 Félicitations!',
        congratsText: 'Tu as complété tous les 4 niveaux!',
        totalScoreLabel: 'Score Total',
        totalStarsLabel: 'Étoiles Gagnées',
        medalLabel: 'Réussite',
        achievementsTitle: 'Ce que tu as appris:',
        achievement1: '✅ Identifié 15 animaux différents',
        achievement2: '✅ Appris 11 parties du corps',
        achievement3: '✅ Pratiqué les contraires',
        achievement4: '✅ Utilisé "It is" et "They are" correctement',
        correct: 'Correct!',
        wrong: 'Réessaye!',
        great: 'Excellent travail!',
        almostThere: 'Presque là!'
    }
};

// Initialize game on load
window.addEventListener('DOMContentLoaded', () => {
    initGame();
    loadProgress();
    updateUI();
});

function initGame() {
    setupEventListeners();
}

function setupEventListeners() {
    // Language toggle is handled inline in HTML
}

function loadProgress() {
    const saved = localStorage.getItem('animalNeighborsProgress');
    if (saved) {
        const progress = JSON.parse(saved);
        gameState.levelsCompleted = progress.levelsCompleted || [true, true, true, true];
        gameState.levelScores = progress.levelScores || [0, 0, 0, 0];
        gameState.levelStars = progress.levelStars || [0, 0, 0, 0];
        gameState.totalScore = progress.totalScore || 0;
    } else {
        // All levels unlocked by default
        gameState.levelsCompleted = [true, true, true, true];
    }
    updateLevelCards();
}

function saveProgress() {
    const progress = {
        levelsCompleted: gameState.levelsCompleted,
        levelScores: gameState.levelScores,
        levelStars: gameState.levelStars,
        totalScore: gameState.totalScore
    };
    localStorage.setItem('animalNeighborsProgress', JSON.stringify(progress));
}

function updateUI() {
    const lang = gameState.language;
    
    document.getElementById('welcomeTitle').textContent = translations[lang].welcomeTitle;
    document.getElementById('welcomeText').textContent = translations[lang].welcomeText;
    document.getElementById('level1Title').textContent = translations[lang].level1Title;
    document.getElementById('level1Desc').textContent = translations[lang].level1Desc;
    document.getElementById('level2Title').textContent = translations[lang].level2Title;
    document.getElementById('level2Desc').textContent = translations[lang].level2Desc;
    document.getElementById('level3Title').textContent = translations[lang].level3Title;
    document.getElementById('level3Desc').textContent = translations[lang].level3Desc;
    document.getElementById('level4Title').textContent = translations[lang].level4Title;
    document.getElementById('level4Desc').textContent = translations[lang].level4Desc;
    
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('currentLevel').textContent = gameState.currentLevel || '-';
    updateLives();
}

function updateLives() {
    const hearts = '❤️'.repeat(gameState.lives);
    document.getElementById('lives').textContent = hearts || '💔';
}

function toggleLanguage() {
    gameState.language = gameState.language === 'en' ? 'fr' : 'en';
    const btn = document.getElementById('languageBtn');
    btn.textContent = gameState.language === 'en' ? '🇬🇧 English' : '🇫🇷 Français';
    updateUI();
    
    // Update active level screen content
    const lang = gameState.language;
    
    // Update level screen titles and instructions
    document.getElementById('level1ScreenTitle').textContent = translations[lang].level1ScreenTitle;
    document.getElementById('level1Instruction').textContent = translations[lang].level1Instruction;
    document.getElementById('level2ScreenTitle').textContent = translations[lang].level2ScreenTitle;
    document.getElementById('level2Instruction').textContent = translations[lang].level2Instruction;
    document.getElementById('level3ScreenTitle').textContent = translations[lang].level3ScreenTitle;
    document.getElementById('level3Instruction').textContent = translations[lang].level3Instruction;
    document.getElementById('level4ScreenTitle').textContent = translations[lang].level4ScreenTitle;
    document.getElementById('level4Instruction').textContent = translations[lang].level4Instruction;
    document.getElementById('findPrompt').textContent = translations[lang].findPrompt;
    
    // Refresh current level's question/content if in a level (without reshuffling)
    switch(gameState.currentLevel) {
        case 1:
            // Update target animal name
            if (level1CurrentTarget) {
                const displayName = lang === 'en' ? level1CurrentTarget.name : level1CurrentTarget.fr;
                document.getElementById('targetAnimal').textContent = displayName;
            }
            break;
        case 2:
            // Update body part question without reshuffling options
            if (level2CurrentQ < level2Questions.length) {
                updateBodyPartQuestionLanguage();
            }
            break;
        case 3:
            // Update description question without reshuffling options
            if (level3CurrentQ < level3Questions.length) {
                updateDescriptionQuestionLanguage();
            }
            break;
        case 4:
            // Update riddle without reshuffling options
            if (level4CurrentQ < level4Riddles.length) {
                updateRiddleQuestionLanguage();
            }
            break;
    }
}

function updateLevelCards() {
    for (let i = 0; i < 4; i++) {
        const card = document.getElementById(`level${i + 1}Card`);
        // All levels are always unlocked
        card.classList.remove('locked');
        card.onclick = () => startLevel(i + 1);
        
        const starsContainer = document.getElementById(`level${i + 1}Stars`);
        const stars = starsContainer.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < gameState.levelStars[i]) {
                star.classList.add('unlocked');
                star.classList.remove('locked');
            }
        });
    }
}

function startLevel(levelNum) {
    // All levels are unlocked, no need to check
    
    gameState.currentLevel = levelNum;
    gameState.score = 0;
    gameState.lives = 3;
    gameState.currentQuestion = 0;
    gameState.correctAnswers = 0;
    
    document.getElementById('homeScreen').classList.remove('active');
    
    const screens = ['level1Screen', 'level2Screen', 'level3Screen', 'level4Screen'];
    screens.forEach((screen, index) => {
        if (index === levelNum - 1) {
            document.getElementById(screen).classList.add('active');
        } else {
            document.getElementById(screen).classList.remove('active');
        }
    });
    
    document.getElementById('currentLevel').textContent = levelNum;
    updateUI();
    
    switch(levelNum) {
        case 1:
            initLevel1();
            break;
        case 2:
            initLevel2();
            break;
        case 3:
            initLevel3();
            break;
        case 4:
            initLevel4();
            break;
    }
}

// LEVEL 1: ANIMAL SPOTTER
let level1Animals = [];
let level1CurrentTarget = null;
let level1Found = 0;

function initLevel1() {
    level1Found = 0;
    level1Animals = shuffleArray([...animals]).slice(0, 10);
    displayBackyardScene();
    nextAnimalTarget();
}

function displayBackyardScene() {
    const scene = document.getElementById('backyardScene');
    scene.innerHTML = '';
    
    level1Animals.forEach((animal, index) => {
        const spot = document.createElement('div');
        spot.className = 'animal-spot';
        
        // Handle woodpecker SVG
        if (animal.useSvg && animal.name === 'woodpecker') {
            const img = document.createElement('img');
            img.src = 'media/woodpicker.svg';
            img.style.width = '2.5em';
            img.style.height = '2.5em';
            img.alt = 'woodpecker';
            spot.appendChild(img);
        } else {
            spot.textContent = animal.emoji;
        }
        
        spot.dataset.animalName = animal.name;
        
        spot.style.left = `${10 + (index % 5) * 18}%`;
        spot.style.top = `${10 + Math.floor(index / 5) * 40}%`;
        
        spot.addEventListener('click', () => checkAnimalClick(animal.name, spot));
        scene.appendChild(spot);
    });
}

function nextAnimalTarget() {
    const spots = Array.from(document.querySelectorAll('.animal-spot'));
    const remaining = spots.filter(spot => !spot.classList.contains('found'));
    
    if (remaining.length === 0) {
        completeLevel1();
        return;
    }
    
    const randomSpot = remaining[Math.floor(Math.random() * remaining.length)];
    const animalName = randomSpot.dataset.animalName;
    level1CurrentTarget = animals.find(a => a.name === animalName);
    
    const lang = gameState.language;
    const displayName = lang === 'en' ? level1CurrentTarget.name : level1CurrentTarget.fr;
    document.getElementById('targetAnimal').textContent = displayName;
}

function checkAnimalClick(animalName, spot) {
    if (spot.classList.contains('found')) return;
    
    if (animalName === level1CurrentTarget.name) {
        gameState.score += 10;
        gameState.correctAnswers++;
        level1Found++;
        spot.classList.add('found');
        showFeedback(true);
        updateProgress(1, level1Found, 10);
        
        setTimeout(() => {
            nextAnimalTarget();
        }, 800);
    } else {
        gameState.lives--;
        updateLives();
        showFeedback(false);
        
        if (gameState.lives === 0) {
            gameOver();
        }
    }
    
    document.getElementById('score').textContent = gameState.score;
}

function completeLevel1() {
    const accuracy = (gameState.correctAnswers / 10) * 100;
    const stars = calculateStars(gameState.score, 100);
    
    gameState.levelsCompleted[0] = true;
    gameState.levelScores[0] = gameState.score;
    gameState.levelStars[0] = stars;
    gameState.totalScore += gameState.score;
    
    saveProgress();
    showLevelComplete(stars, accuracy);
}

// LEVEL 2: BODY PARTS DETECTIVE
let level2Questions = [];
let level2CurrentQ = 0;
let level2ShuffledIndices = []; // Store shuffled indices

function initLevel2() {
    level2Questions = shuffleArray([...bodyPartQuestions]).slice(0, 12);
    level2CurrentQ = 0;
    gameState.totalQuestions = 12;
    showBodyPartQuestion();
}

function showBodyPartQuestion() {
    if (level2CurrentQ >= level2Questions.length) {
        completeLevel2();
        return;
    }
    
    const q = level2Questions[level2CurrentQ];
    const lang = gameState.language;
    
    document.getElementById('bodyPartVisual').textContent = q.visual;
    document.getElementById('bodyPartQuestion').textContent = lang === 'en' ? q.question : q.fr.question;
    
    const optionsContainer = document.getElementById('bodyPartOptions');
    optionsContainer.innerHTML = '';
    
    const options = lang === 'en' ? q.options : q.fr.options;
    const correctAnswer = lang === 'en' ? q.correct : q.fr.correct;
    
    // Create shuffled indices
    level2ShuffledIndices = shuffleArray([0, 1, 2]);
    
    // Display options in shuffled order
    level2ShuffledIndices.forEach(index => {
        const option = options[index];
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.dataset.optionIndex = index; // Store the original index
        btn.addEventListener('click', () => checkBodyPartAnswer(option, correctAnswer, btn));
        optionsContainer.appendChild(btn);
    });
    
    updateProgress(2, level2CurrentQ, 12);
}

function updateBodyPartQuestionLanguage() {
    const q = level2Questions[level2CurrentQ];
    const lang = gameState.language;
    
    document.getElementById('bodyPartQuestion').textContent = lang === 'en' ? q.question : q.fr.question;
    
    const options = lang === 'en' ? q.options : q.fr.options;
    const correctAnswer = lang === 'en' ? q.correct : q.fr.correct;
    
    // Update button texts using stored indices
    const buttons = document.querySelectorAll('#bodyPartOptions .option-btn');
    buttons.forEach(btn => {
        const optionIndex = parseInt(btn.dataset.optionIndex);
        const newText = options[optionIndex];
        btn.textContent = newText;
        
        // Update click handler with new correct answer
        btn.onclick = () => checkBodyPartAnswer(newText, correctAnswer, btn);
    });
}

function checkBodyPartAnswer(selected, correct, btn) {
    const allButtons = document.querySelectorAll('#bodyPartOptions .option-btn');
    allButtons.forEach(b => b.style.pointerEvents = 'none');
    
    if (selected === correct) {
        btn.classList.add('correct');
        gameState.score += 15;
        gameState.correctAnswers++;
        showFeedback(true);
        
        setTimeout(() => {
            level2CurrentQ++;
            showBodyPartQuestion();
        }, 1200);
    } else {
        btn.classList.add('wrong');
        gameState.lives--;
        updateLives();
        showFeedback(false);
        
        if (gameState.lives === 0) {
            gameOver();
        } else {
            setTimeout(() => {
                allButtons.forEach(b => {
                    b.style.pointerEvents = 'auto';
                    b.classList.remove('wrong');
                });
            }, 1000);
        }
    }
    
    document.getElementById('score').textContent = gameState.score;
}

function completeLevel2() {
    const accuracy = (gameState.correctAnswers / 12) * 100;
    const stars = calculateStars(gameState.score, 180);
    
    gameState.levelsCompleted[1] = true;
    gameState.levelScores[1] = gameState.score;
    gameState.levelStars[1] = stars;
    gameState.totalScore += gameState.score;
    
    saveProgress();
    showLevelComplete(stars, accuracy);
}

// LEVEL 3: DESCRIBE THE ANIMAL
let level3Questions = [];
let level3CurrentQ = 0;
let level3ShuffledIndices = []; // Store shuffled indices (0=correct, 1=wrong)

function initLevel3() {
    level3Questions = shuffleArray([...descriptionQuestions]).slice(0, 15);
    level3CurrentQ = 0;
    gameState.totalQuestions = 15;
    showDescriptionQuestion();
}

function showDescriptionQuestion() {
    if (level3CurrentQ >= level3Questions.length) {
        completeLevel3();
        return;
    }
    
    const q = level3Questions[level3CurrentQ];
    const lang = gameState.language;
    
    document.getElementById('animalVisual').textContent = q.animal;
    document.getElementById('descriptionQuestion').textContent = lang === 'en' ? q.question : q.fr.question;
    
    const optionsContainer = document.getElementById('descriptionOptions');
    optionsContainer.innerHTML = '';
    
    const correct = lang === 'en' ? q.correct : q.fr.correct;
    const wrong = lang === 'en' ? q.wrong : q.fr.wrong;
    
    // Create shuffled indices (0=correct, 1=wrong)
    level3ShuffledIndices = shuffleArray([0, 1]);
    
    // Display options in shuffled order
    level3ShuffledIndices.forEach(index => {
        const option = index === 0 ? correct : wrong;
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.dataset.optionIndex = index; // Store 0 for correct, 1 for wrong
        btn.addEventListener('click', () => checkDescriptionAnswer(option, correct, btn));
        optionsContainer.appendChild(btn);
    });
    
    updateProgress(3, level3CurrentQ, 15);
}

function updateDescriptionQuestionLanguage() {
    const q = level3Questions[level3CurrentQ];
    const lang = gameState.language;
    
    document.getElementById('descriptionQuestion').textContent = lang === 'en' ? q.question : q.fr.question;
    
    const correct = lang === 'en' ? q.correct : q.fr.correct;
    const wrong = lang === 'en' ? q.wrong : q.fr.wrong;
    
    // Update button texts using stored indices
    const buttons = document.querySelectorAll('#descriptionOptions .option-btn');
    buttons.forEach(btn => {
        const optionIndex = parseInt(btn.dataset.optionIndex);
        const newText = optionIndex === 0 ? correct : wrong;
        btn.textContent = newText;
        
        // Update click handler with new correct answer
        btn.onclick = () => checkDescriptionAnswer(newText, correct, btn);
    });
}

function checkDescriptionAnswer(selected, correct, btn) {
    const allButtons = document.querySelectorAll('#descriptionOptions .option-btn');
    allButtons.forEach(b => b.style.pointerEvents = 'none');
    
    if (selected === correct) {
        btn.classList.add('correct');
        gameState.score += 20;
        gameState.correctAnswers++;
        showFeedback(true);
        
        setTimeout(() => {
            level3CurrentQ++;
            showDescriptionQuestion();
        }, 1200);
    } else {
        btn.classList.add('wrong');
        gameState.lives--;
        updateLives();
        showFeedback(false);
        
        if (gameState.lives === 0) {
            gameOver();
        } else {
            setTimeout(() => {
                allButtons.forEach(b => {
                    b.style.pointerEvents = 'auto';
                    b.classList.remove('wrong');
                });
            }, 1000);
        }
    }
    
    document.getElementById('score').textContent = gameState.score;
}

function completeLevel3() {
    const accuracy = (gameState.correctAnswers / 15) * 100;
    const stars = calculateStars(gameState.score, 300);
    
    gameState.levelsCompleted[2] = true;
    gameState.levelScores[2] = gameState.score;
    gameState.levelStars[2] = stars;
    gameState.totalScore += gameState.score;
    
    saveProgress();
    showLevelComplete(stars, accuracy);
}

// LEVEL 4: ANIMAL RIDDLES
let level4Riddles = [];
let level4CurrentQ = 0;
let level4ShuffledOrder = []; // Store animal names in shuffled order

function initLevel4() {
    level4Riddles = shuffleArray([...riddles]).slice(0, 10);
    level4CurrentQ = 0;
    gameState.totalQuestions = 10;
    showRiddleQuestion();
}

function showRiddleQuestion() {
    if (level4CurrentQ >= level4Riddles.length) {
        completeLevel4();
        return;
    }
    
    const riddle = level4Riddles[level4CurrentQ];
    const lang = gameState.language;
    
    document.getElementById('riddleTitle').textContent = translations[lang].riddleTitle;
    
    const cluesContainer = document.getElementById('riddleClues');
    cluesContainer.innerHTML = '';
    
    const clues = lang === 'en' ? riddle.clues : riddle.fr.clues;
    clues.forEach(clue => {
        const p = document.createElement('p');
        p.className = 'clue';
        p.textContent = '• ' + clue;
        cluesContainer.appendChild(p);
    });
    
    const optionsContainer = document.getElementById('riddleOptions');
    optionsContainer.innerHTML = '';
    
    // Shuffle and store the animal names (language-independent)
    level4ShuffledOrder = shuffleArray([...riddle.options]);
    
    level4ShuffledOrder.forEach(animalName => {
        const animalData = animals.find(a => a.name === animalName);
        const div = document.createElement('div');
        div.className = 'animal-option option-btn';
        div.dataset.animalName = animalName; // Store animal name
        
        const emojiSpan = document.createElement('span');
        emojiSpan.className = 'animal-emoji';
        
        // Handle woodpecker SVG
        if (animalData.useSvg && animalData.name === 'woodpecker') {
            const img = document.createElement('img');
            img.src = 'media/woodpicker.svg';
            img.style.width = '3em';
            img.style.height = '3em';
            img.alt = 'woodpecker';
            emojiSpan.appendChild(img);
        } else {
            emojiSpan.textContent = animalData.emoji;
        }
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'animal-name';
        nameSpan.textContent = animalName;
        
        div.appendChild(emojiSpan);
        div.appendChild(nameSpan);
        div.addEventListener('click', () => checkRiddleAnswer(animalName, riddle.answer, div));
        optionsContainer.appendChild(div);
    });
    
    updateProgress(4, level4CurrentQ, 10);
}

function updateRiddleQuestionLanguage() {
    const riddle = level4Riddles[level4CurrentQ];
    const lang = gameState.language;
    
    document.getElementById('riddleTitle').textContent = translations[lang].riddleTitle;
    
    // Update clues only - animal names don't change
    const cluesContainer = document.getElementById('riddleClues');
    cluesContainer.innerHTML = '';
    
    const clues = lang === 'en' ? riddle.clues : riddle.fr.clues;
    clues.forEach(clue => {
        const p = document.createElement('p');
        p.className = 'clue';
        p.textContent = '• ' + clue;
        cluesContainer.appendChild(p);
    });
}

function checkRiddleAnswer(selected, correct, btn) {
    const allButtons = document.querySelectorAll('#riddleOptions .animal-option');
    allButtons.forEach(b => b.style.pointerEvents = 'none');
    
    if (selected === correct) {
        btn.classList.add('correct');
        gameState.score += 25;
        gameState.correctAnswers++;
        showFeedback(true);
        
        setTimeout(() => {
            level4CurrentQ++;
            showRiddleQuestion();
        }, 1200);
    } else {
        btn.classList.add('wrong');
        gameState.lives--;
        updateLives();
        showFeedback(false);
        
        if (gameState.lives === 0) {
            gameOver();
        } else {
            setTimeout(() => {
                allButtons.forEach(b => {
                    b.style.pointerEvents = 'auto';
                    b.classList.remove('wrong');
                });
            }, 1000);
        }
    }
    
    document.getElementById('score').textContent = gameState.score;
}

function completeLevel4() {
    const accuracy = (gameState.correctAnswers / 10) * 100;
    const stars = calculateStars(gameState.score, 250);
    
    gameState.levelsCompleted[3] = true;
    gameState.levelScores[3] = gameState.score;
    gameState.levelStars[3] = stars;
    gameState.totalScore += gameState.score;
    
    saveProgress();
    
    setTimeout(() => {
        showFinalResults();
    }, 1500);
}

// HELPER FUNCTIONS
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function calculateStars(score, maxScore) {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 3;
    if (percentage >= 60) return 2;
    return 1;
}

function updateProgress(level, current, total) {
    const progressFill = document.getElementById(`level${level}Progress`);
    const progressText = document.getElementById(`progressText${level === 1 ? '' : level}`);
    
    const percentage = (current / total) * 100;
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${current} / ${total}`;
}

function showFeedback(isCorrect) {
    const overlay = document.getElementById('feedbackOverlay');
    const icon = document.getElementById('feedbackIcon');
    const text = document.getElementById('feedbackText');
    const lang = gameState.language;
    
    if (isCorrect) {
        icon.textContent = '✅';
        text.textContent = translations[lang].correct;
        overlay.classList.add('active');
        
        setTimeout(() => {
            overlay.classList.remove('active');
        }, 800);
    } else {
        icon.textContent = '❌';
        text.textContent = translations[lang].wrong;
        overlay.classList.add('active');
        
        setTimeout(() => {
            overlay.classList.remove('active');
        }, 800);
    }
}

function showLevelComplete(stars, accuracy) {
    const modal = document.getElementById('levelCompleteModal');
    const lang = gameState.language;
    
    document.getElementById('completeTitle').textContent = translations[lang].completeTitle;
    document.getElementById('scoreLabel').textContent = translations[lang].scoreLabel;
    document.getElementById('accuracyLabel').textContent = translations[lang].accuracyLabel;
    document.getElementById('levelScore').textContent = gameState.score;
    document.getElementById('accuracy').textContent = Math.round(accuracy) + '%';
    
    const starsContainer = document.getElementById('starsEarned');
    starsContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const star = document.createElement('span');
        star.className = 'star-big';
        star.textContent = i < stars ? '⭐' : '☆';
        starsContainer.appendChild(star);
    }
    
    const nextBtn = document.getElementById('nextLevelBtn');
    if (gameState.currentLevel < 4) {
        nextBtn.style.display = 'inline-block';
        nextBtn.textContent = lang === 'en' ? 'Next Level →' : 'Niveau Suivant →';
    } else {
        nextBtn.style.display = 'none';
    }
    
    modal.classList.add('active');
    updateLevelCards();
}

function goToNextLevel() {
    document.getElementById('levelCompleteModal').classList.remove('active');
    
    const screens = ['level1Screen', 'level2Screen', 'level3Screen', 'level4Screen'];
    screens.forEach(screen => {
        document.getElementById(screen).classList.remove('active');
    });
    
    if (gameState.currentLevel < 4) {
        startLevel(gameState.currentLevel + 1);
    } else {
        goHome();
    }
}

function gameOver() {
    const modal = document.getElementById('gameOverModal');
    const lang = gameState.language;
    
    document.getElementById('gameOverTitle').textContent = translations[lang].gameOverTitle;
    document.getElementById('gameOverText').textContent = translations[lang].gameOverText;
    document.getElementById('finalScoreLabel').textContent = translations[lang].finalScoreLabel;
    document.getElementById('gameOverScore').textContent = gameState.score;
    
    modal.classList.add('active');
}

function retryLevel() {
    document.getElementById('gameOverModal').classList.remove('active');
    startLevel(gameState.currentLevel);
}

function goHome() {
    document.getElementById('levelCompleteModal').classList.remove('active');
    document.getElementById('gameOverModal').classList.remove('active');
    
    const screens = ['level1Screen', 'level2Screen', 'level3Screen', 'level4Screen'];
    screens.forEach(screen => {
        document.getElementById(screen).classList.remove('active');
    });
    
    document.getElementById('homeScreen').classList.add('active');
    gameState.currentLevel = 0;
    updateUI();
}

function showFinalResults() {
    const modal = document.getElementById('finalResultsModal');
    const lang = gameState.language;
    
    document.getElementById('congratsTitle').textContent = translations[lang].congratsTitle;
    document.getElementById('congratsText').textContent = translations[lang].congratsText;
    document.getElementById('totalScoreLabel').textContent = translations[lang].totalScoreLabel;
    document.getElementById('totalStarsLabel').textContent = translations[lang].totalStarsLabel;
    document.getElementById('medalLabel').textContent = translations[lang].medalLabel;
    document.getElementById('achievementsTitle').textContent = translations[lang].achievementsTitle;
    
    const totalStars = gameState.levelStars.reduce((a, b) => a + b, 0);
    document.getElementById('totalScore').textContent = gameState.totalScore;
    document.getElementById('totalStarsEarned').textContent = `${totalStars} / 12`;
    
    let medal = '🥉 Bronze';
    if (gameState.totalScore >= 700) medal = '🥇 Gold';
    else if (gameState.totalScore >= 550) medal = '🥈 Silver';
    
    document.getElementById('medal').textContent = medal;
    
    document.getElementById('achievement1').textContent = translations[lang].achievement1;
    document.getElementById('achievement2').textContent = translations[lang].achievement2;
    document.getElementById('achievement3').textContent = translations[lang].achievement3;
    document.getElementById('achievement4').textContent = translations[lang].achievement4;
    
    const screens = ['level1Screen', 'level2Screen', 'level3Screen', 'level4Screen'];
    screens.forEach(screen => {
        document.getElementById(screen).classList.remove('active');
    });
    
    modal.classList.add('active');
}

function playAgain() {
    document.getElementById('finalResultsModal').classList.remove('active');
    gameState.totalScore = 0;
    gameState.levelsCompleted = [false, false, false, false];
    gameState.levelScores = [0, 0, 0, 0];
    gameState.levelStars = [0, 0, 0, 0];
    saveProgress();
    goHome();
    updateLevelCards();
}