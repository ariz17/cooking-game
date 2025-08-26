let score = 0;
let currentOrder = [];
let selectedIngredients = [];
let recipes = {};
let customers = [];
let ingredients = [];
let lastCustomerIndex = -1;
let customerQueue = [];
let recipeNameList = [];
let recipeQueue = [];
let lastRecipeName = '';
let timerInterval = null;
let timeLeft = 15;
let strikes = 0;
let selectedBackground = 1;
let selectedChef = 'female';
const MAX_STRIKES = 3;
const ORDER_TIME_LIMIT = 15;
const BACKGROUND_VIDEOS = {
    1: 'assets/Background Vid.mov',
    2: 'assets/Background Vid 3.mp4',
    3: 'assets/Background Vid 2.mp4',
};

const loadingScreen = document.getElementById('loading-screen');
const introScreen = document.getElementById('intro-screen');
const chefSelectionScreen = document.getElementById('chef-selection-screen');
const backgroundSelectionScreen = document.getElementById('background-selection-screen');
const gameContainer = document.querySelector('.game-container');
const scoreDisplay = document.getElementById('score');
const customerOrderDisplay = document.getElementById('customer-order');
const timerDisplay = document.getElementById('timer');
const customerImageDisplay = document.getElementById('customer-image');
const statusMessageDisplay = document.getElementById('status-message');
const ingredientButtonsContainer = document.getElementById('ingredient-buttons-container');
const serveButton = document.getElementById('serve-btn');
const resetButton = document.getElementById('reset-btn');
const chefInfo = document.querySelector('.chef-info');
const chefNameDisplay = document.getElementById('chef-name-display');
const chefNameInput = document.getElementById('chef-name-input');
const startButton = document.getElementById('start-btn');
const continueToBackgroundBtn = document.getElementById('continue-to-bg-btn');
const startGameButton = document.getElementById('start-game-btn');
const cookModel = document.getElementById('cook-model');
const instructionsBtn = document.getElementById('instructions-btn');
const instructionsModal = document.getElementById('instructions-modal');
const closeInstructions = document.getElementById('close-instructions');
const hintBtn = document.getElementById('hint-btn');
const hintContent = document.getElementById('hint-content');
const hintIngredients = document.getElementById('hint-ingredients');
const gameOverModal = document.getElementById('game-over-modal');
const bgVideo = document.getElementById('bg-video');
const restartBtn = document.getElementById('restart-btn');
const bgSelectionOptions = document.querySelectorAll('.bg-selection-option');
const chefSelectionOptions = document.querySelectorAll('.chef-selection-option');

const ingredientIcons = {
    'chocolate icecream': '🍦',
    'milk': '🥛',
    'sugar': '🍬',
    'water': '💧',
    'lemon': '🍋',
    'bread': '🍞',
    'patty': '🥩',
    'cheese': '🧀',
    'potato': '🥔',
    'flour': '🌾',
    'oil': '🧴',
    'dough': '🍞',
    'tomato': '🍅',
    'pepperoni': '🍕',
    'salt': '🧂',
    'chicken': '🍗',
    'chocos fills': '🍫',
    'coffee powder': '☕'
};

function getIngredientIcon(name) {
    return ingredientIcons[name] || '🍽️';
}
async function loadGameData() {
    recipes = {
        'Chocolate Milkshake': ['chocolate icecream', 'milk', 'sugar'],
        'Milk': ['milk', 'sugar'],
        'Lemonade': ['water', 'sugar', 'lemon'],
        'Coffee': ['coffee powder', 'milk', 'sugar'],
        'Burger': ['bread', 'patty', 'cheese'],
        'Potato Balls': ['potato', 'flour', 'oil', 'salt'],
        'Pizza': ['dough', 'cheese', 'tomato', 'pepperoni'],
        'French Fries': ['potato', 'oil', 'salt'],
        'Chocos': ['chocos fills', 'sugar', 'milk'],
        'Chicken Wings': ['chicken', 'flour', 'oil']
    };

    customers = [
        { name: 'Customer 1', image: 'assets/Customer 1.png' },
        { name: 'Customer 2', image: 'assets/Customer 2.png' },
        { name: 'Customer 3', image: 'assets/Customer 3.png' },
        { name: 'Customer 4', image: 'assets/Customer 4.png' },
        { name: 'Customer 5', image: 'assets/Customer 5.png' }
    ];

    const uniq = new Set();
    Object.values(recipes).forEach(arr => arr.forEach(i => uniq.add(i)));
    ingredients = Array.from(uniq);

    recipeNameList = Object.keys(recipes);
    rebuildCustomerQueue();
    rebuildRecipeQueue();
    createIngredientButtons();
}

function showNameInput() {
    introScreen.classList.add('fade-out');
    setTimeout(() => {
        introScreen.classList.add('hidden');
        chefSelectionScreen.classList.remove('hidden');
    }, 180);
}

function selectChef(chefType) {
    selectedChef = chefType;
    
    chefSelectionOptions.forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.chef === chefType) {
            option.classList.add('selected');
        }
    });
    
    if (chefType === 'male') {
        cookModel.src = 'assets/Chef 2.jpg';
    } else {
        cookModel.src = 'assets/Chef.jpg';
    }
}

function showBackgroundSelection() {
    const chefName = chefNameInput.value.trim();
    if (chefName) {
        chefNameDisplay.textContent = chefName;
        chefSelectionScreen.classList.add('fade-out');
        setTimeout(() => {
            chefSelectionScreen.classList.add('hidden');
            backgroundSelectionScreen.classList.remove('hidden');
        }, 180);
    } else {
        alert("Please enter a name to continue.");
    }
}

function selectBackground(bgNumber) {
    selectedBackground = bgNumber;
    
    bgSelectionOptions.forEach(option => {
        option.classList.remove('selected');
        if (parseInt(option.dataset.bg) === bgNumber) {
            option.classList.add('selected');
        }
    });
    
    bgVideo.src = BACKGROUND_VIDEOS[bgNumber];
    
    bgVideo.style.opacity = '0.8';
    bgVideo.style.filter = 'brightness(0.8)';
    
    document.body.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
    backgroundSelectionScreen.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
}

function startGame() {
    backgroundSelectionScreen.classList.add('fade-out');
    
    bgVideo.style.opacity = '1';
    bgVideo.style.filter = 'brightness(0.65)';
    document.body.style.backgroundColor = '';
    
    setTimeout(() => {
        backgroundSelectionScreen.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        chefInfo.classList.remove('hidden');
        strikes = 0;
        gameContainer.classList.remove('disabled-overlay');
        newOrder();
    }, 180);
}

function createIngredientButtons() {
    ingredientButtonsContainer.innerHTML = '';
    ingredients.forEach(ingredient => {
        const button = document.createElement('div');
        button.className = "ingredient-btn";
        button.textContent = '';
        button.dataset.ingredient = ingredient;
        const icon = document.createElement('span');
        icon.className = 'ingredient-icon';
        icon.textContent = getIngredientIcon(ingredient);
        const label = document.createElement('span');
        label.textContent = ingredient;
        button.appendChild(icon);
        button.appendChild(label);
        button.addEventListener('click', () => selectIngredient(button));
        ingredientButtonsContainer.appendChild(button);
    });
}

function selectIngredient(button) {
    const ingredient = button.dataset.ingredient;
    if (selectedIngredients.includes(ingredient)) {
        return;
    }
    selectedIngredients.push(ingredient);
    button.classList.add('active');
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function rebuildCustomerQueue() {
    if (!customers || customers.length === 0) {
        customerQueue = [];
        return;
    }
    customerQueue = Array.from({ length: customers.length }, (_, i) => i);
    shuffleArray(customerQueue);
    if (customerQueue.length > 1 && customerQueue[0] === lastCustomerIndex) {
        // Swap first with a different element to avoid consecutive repeat
        [customerQueue[0], customerQueue[1]] = [customerQueue[1], customerQueue[0]];
    }
}

function rebuildRecipeQueue() {
    if (!recipeNameList || recipeNameList.length === 0) {
        recipeQueue = [];
        return;
    }
    recipeQueue = [...recipeNameList];
    shuffleArray(recipeQueue);
    if (recipeQueue.length > 1 && recipeQueue[0] === lastRecipeName) {
        [recipeQueue[0], recipeQueue[1]] = [recipeQueue[1], recipeQueue[0]];
    }
}

function newOrder() {
    if (!customers || customers.length === 0) {
        return;
    }
    if (strikes >= MAX_STRIKES) {
        endGame();
        return;
    }
    stopTimer();
    if (customerQueue.length === 0) {
        rebuildCustomerQueue();
    }
    if (customerQueue.length > 1 && customerQueue[0] === lastCustomerIndex) {
        customerQueue.push(customerQueue.shift());
    }
    if (recipeQueue.length === 0) {
        rebuildRecipeQueue();
    }
    if (recipeQueue.length > 1 && recipeQueue[0] === lastRecipeName) {
        recipeQueue.push(recipeQueue.shift());
    }
    const index = customerQueue.shift();
    const randomCustomer = customers[index];
    lastCustomerIndex = index;
    const randomRecipe = recipeQueue.shift();
    lastRecipeName = randomRecipe;
    
    customerImageDisplay.src = randomCustomer.image;
    currentOrder = (recipes[randomRecipe] || []).slice();
    customerOrderDisplay.classList.remove('fade-in');
    void customerOrderDisplay.offsetWidth;
    customerOrderDisplay.textContent = `Order: ${randomRecipe}`;
    customerOrderDisplay.classList.add('fade-in');
    customerImageDisplay.classList.remove('fade-in');
    void customerImageDisplay.offsetWidth;
    customerImageDisplay.classList.add('fade-in');
    statusMessageDisplay.textContent = 'Choose your ingredients and serve!';
    
    hintContent.classList.add('hidden');

    startTimer();
}

function serveOrder() {
    const normalize = (arr) => [...arr].map(v => (typeof v === 'string' ? v.trim().toLowerCase() : v)).sort();
    const sortedSelected = normalize(selectedIngredients);
    const sortedOrder = normalize(currentOrder);

    if (sortedSelected.length === sortedOrder.length && 
        sortedSelected.every((value, index) => value === sortedOrder[index])) {
        
        statusMessageDisplay.textContent = "Correct! Order served successfully!";
        statusMessageDisplay.classList.remove('fade-in');
        void statusMessageDisplay.offsetWidth;
        statusMessageDisplay.classList.add('fade-in');
        
        showScoreChange(10, true);
        
        score += 10;
        scoreDisplay.textContent = score;
        stopTimer();
        setTimeout(() => {
            resetGame();
            newOrder();
        }, 1000);
    } else {
        statusMessageDisplay.textContent = "Incorrect recipe. Try again!";
        statusMessageDisplay.classList.remove('fade-in');
        void statusMessageDisplay.offsetWidth;
        statusMessageDisplay.classList.add('fade-in');
        
        showScoreChange(-5, false);
        
        score = Math.max(0, score - 5);
        scoreDisplay.textContent = score;
        setTimeout(() => {
            resetGame();
        }, 1000);
    }
}

function resetGame() {
    selectedIngredients = [];
    const buttons = document.querySelectorAll('.ingredient-btn');
    buttons.forEach(button => button.classList.remove('active'));
}

function showScoreChange(amount, isPositive) {
    const scoreChangeElement = document.createElement('div');
    scoreChangeElement.className = `score-change ${isPositive ? 'score-positive' : 'score-negative'}`;
    scoreChangeElement.textContent = `${isPositive ? '+' : ''}${amount}`;
    
    const rect = scoreDisplay.getBoundingClientRect();
    scoreChangeElement.style.left = `${rect.left + rect.width / 2}px`;
    scoreChangeElement.style.top = `${rect.top}px`;
    
    document.body.appendChild(scoreChangeElement);
    
    setTimeout(() => {
        document.body.removeChild(scoreChangeElement);
    }, 1000);
}

function showHint() {
    if (!currentOrder || currentOrder.length === 0) {
        return;
    }
    if (!hintContent.classList.contains('hidden')) {
        hintContent.classList.add('hidden');
        return;
    }
    
    const currentRecipeName = customerOrderDisplay.textContent.replace('Order: ', '');
    if (recipes[currentRecipeName]) {
        currentOrder = recipes[currentRecipeName].slice();
    }
    
    hintIngredients.innerHTML = '';
    currentOrder.forEach(ingredient => {
        const ingredientSpan = document.createElement('span');
        ingredientSpan.className = 'hint-ingredient';
        const icon = document.createElement('span');
        icon.className = 'ingredient-icon';
        icon.textContent = getIngredientIcon(ingredient);
        const label = document.createElement('span');
        label.textContent = ingredient;
        ingredientSpan.appendChild(icon);
        ingredientSpan.appendChild(label);
        hintIngredients.appendChild(ingredientSpan);
    });
    hintContent.classList.remove('hidden');
    hintContent.classList.remove('fade-in');
    void hintContent.offsetWidth;
    hintContent.classList.add('fade-in');
}

function startTimer() {
    timeLeft = ORDER_TIME_LIMIT;
    timerDisplay.textContent = `${timeLeft}s`;
    timerDisplay.classList.remove('hidden');
    timerInterval = setInterval(() => {
        timeLeft -= 1;
        timerDisplay.textContent = `${timeLeft}s`;
        if (timeLeft <= 0) {
            stopTimer();
            handleTimeout();
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    if (timerDisplay) {
        timerDisplay.classList.add('hidden');
    }
}

function handleTimeout() {
    showScoreChange(-5, false);
    
    score = Math.max(0, score - 5);
    strikes += 1;
    scoreDisplay.textContent = score;
    statusMessageDisplay.textContent = "Time's up! -5 points";
    if (strikes >= MAX_STRIKES) {
        endGame();
        return;
    }
    setTimeout(() => {
        resetGame();
        newOrder();
    }, 800);
}

function endGame() {
    statusMessageDisplay.textContent = 'Game over! You ran out of time.';
    stopTimer();
    gameContainer.classList.add('disabled-overlay');
    gameOverModal.classList.remove('hidden');
}

function restartGame() {
    score = 0;
    strikes = 0;
    scoreDisplay.textContent = score;
    selectedIngredients = [];
    lastCustomerIndex = -1;
    lastRecipeName = '';
    customerQueue = [];
    recipeQueue = [];
    gameContainer.classList.remove('disabled-overlay');
    gameOverModal.classList.add('hidden');
    resetGame();
    rebuildCustomerQueue();
    rebuildRecipeQueue();
    newOrder();
}

startButton.addEventListener('click', showNameInput);
startButton.addEventListener('mousedown', () => startButton.classList.add('btn-press'));
startButton.addEventListener('mouseup', () => startButton.classList.remove('btn-press'));

// Chef selection event listeners
chefSelectionOptions.forEach(option => {
    option.addEventListener('click', () => selectChef(option.dataset.chef));
});

continueToBackgroundBtn.addEventListener('click', showBackgroundSelection);
continueToBackgroundBtn.addEventListener('mousedown', () => continueToBackgroundBtn.classList.add('btn-press'));
continueToBackgroundBtn.addEventListener('mouseup', () => continueToBackgroundBtn.classList.remove('btn-press'));

// Background selection event listeners
bgSelectionOptions.forEach(option => {
    option.addEventListener('click', () => selectBackground(parseInt(option.dataset.bg)));
});

startGameButton.addEventListener('click', startGame);
startGameButton.addEventListener('mousedown', () => startGameButton.classList.add('btn-press'));
startGameButton.addEventListener('mouseup', () => startGameButton.classList.remove('btn-press'));
chefNameInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        showBackgroundSelection();
    }
});
serveButton.addEventListener('click', serveOrder);
serveButton.addEventListener('mousedown', () => serveButton.classList.add('btn-press'));
serveButton.addEventListener('mouseup', () => serveButton.classList.remove('btn-press'));
resetButton.addEventListener('click', () => {
    resetGame();
    statusMessageDisplay.textContent = 'Ingredients reset. Try again.';
    statusMessageDisplay.classList.remove('fade-in');
    void statusMessageDisplay.offsetWidth;
    statusMessageDisplay.classList.add('fade-in');
});
resetButton.addEventListener('mousedown', () => resetButton.classList.add('btn-press'));
resetButton.addEventListener('mouseup', () => resetButton.classList.remove('btn-press'));

instructionsBtn.addEventListener('click', () => {
    instructionsModal.classList.remove('hidden');
});
instructionsBtn.addEventListener('mousedown', () => instructionsBtn.classList.add('btn-press'));
instructionsBtn.addEventListener('mouseup', () => instructionsBtn.classList.remove('btn-press'));

closeInstructions.addEventListener('click', () => {
    instructionsModal.classList.add('hidden');
});
closeInstructions.addEventListener('mousedown', () => closeInstructions.classList.add('btn-press'));
closeInstructions.addEventListener('mouseup', () => closeInstructions.classList.remove('btn-press'));

instructionsModal.addEventListener('click', (e) => {
    if (e.target === instructionsModal) {
        instructionsModal.classList.add('hidden');
    }
});

// Hint button event listener
hintBtn.addEventListener('click', showHint);
hintBtn.addEventListener('mousedown', () => hintBtn.classList.add('btn-press'));
hintBtn.addEventListener('mouseup', () => hintBtn.classList.remove('btn-press'));
restartBtn.addEventListener('mousedown', () => restartBtn.classList.add('btn-press'));
restartBtn.addEventListener('mouseup', () => restartBtn.classList.remove('btn-press'));
restartBtn.addEventListener('click', restartGame);

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => loadingScreen.classList.add('hidden'), 160);
        introScreen.classList.remove('hidden');
        loadGameData();
    }, 3000);
});