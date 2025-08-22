// --- Game State Variables ---
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
let selectedBackground = 1; // Default background
let selectedChef = 'female'; // Default chef
const MAX_STRIKES = 3;
const ORDER_TIME_LIMIT = 15;
const BACKGROUND_VIDEOS = {
    1: 'https://raw.githubusercontent.com/ariz17/cooking-game/5322a124c0dca1e825822838be1fca3548f1a41f/assets/Background%20Vid.mov',
    2: 'https://raw.githubusercontent.com/ariz17/cooking-game/67cf259ea80f80525fb9e92de39b60885397a877/assets/Background%20Vid%203.mp4',
    3: 'https://raw.githubusercontent.com/ariz17/cooking-game/67cf259ea80f80525fb9e92de39b60885397a877/assets/Background%20Vid%202.mp4',
};

// --- DOM Elements ---
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

// Add the URL of your animated cook image here
//cookModel.src = ""; // Example: "https://your-image-host.com/cook.gif"

// --- Game Logic Functions ---
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
    try {
        // Add cache-busting timestamp and no-cache headers to prevent caching
        const response = await fetch(`http://localhost:8080/api/gamedata?ts=${Date.now()}`, {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        const data = await response.json();
        console.log('Loaded game data:', data); // Debug log to see what data is loaded
        // Normalize recipes to guard against stale backend data
        const normalizedRecipes = { ...(data.recipes || {}) };
        if (Object.prototype.hasOwnProperty.call(normalizedRecipes, 'Sweet Tea')) {
            delete normalizedRecipes['Sweet Tea'];
        }
        if (Object.prototype.hasOwnProperty.call(normalizedRecipes, 'Tea')) {
            delete normalizedRecipes['Tea'];
        }
        if (Object.prototype.hasOwnProperty.call(normalizedRecipes, 'Direct Milk') &&
            !Object.prototype.hasOwnProperty.call(normalizedRecipes, 'Milk')) {
            normalizedRecipes['Milk'] = normalizedRecipes['Direct Milk'];
            delete normalizedRecipes['Direct Milk'];
        }
        if (Object.prototype.hasOwnProperty.call(normalizedRecipes, 'Plain Milk')) {
            if (!Object.prototype.hasOwnProperty.call(normalizedRecipes, 'Milk')) {
                normalizedRecipes['Milk'] = normalizedRecipes['Plain Milk'];
            }
            delete normalizedRecipes['Plain Milk'];
        }
        // Ensure Milk recipe includes both milk and sugar
        if (Object.prototype.hasOwnProperty.call(normalizedRecipes, 'Milk')) {
            const required = ['milk', 'sugar'];
            const present = new Set((normalizedRecipes['Milk'] || []).map(v => (typeof v === 'string' ? v.trim().toLowerCase() : v)));
            required.forEach(r => present.add(r));
            normalizedRecipes['Milk'] = Array.from(present);
        }
        recipes = normalizedRecipes;
        // Filter out customers that were randomly assigned removed recipes
        customers = (data.customers || [])
            .filter(c => !['Sweet Tea', 'Tea'].includes(c.order))
            .map(c => ({ ...c, order: c.order === 'Plain Milk' ? 'Milk' : c.order }));
        ingredients = data.ingredients;
        recipeNameList = Object.keys(recipes);
        rebuildCustomerQueue();
        rebuildRecipeQueue();
        createIngredientButtons();
    } catch (error) {
        console.error('Error loading game data:', error);
        statusMessageDisplay.textContent = 'Failed to load game data. Please start the backend server.';
    }
}

/**
 * Shows the name input screen after selecting chef
 */
function showNameInput() {
    introScreen.classList.add('fade-out');
    setTimeout(() => {
        introScreen.classList.add('hidden');
        chefSelectionScreen.classList.remove('hidden');
    }, 180);
}

/**
 * Handles chef selection
 */
function selectChef(chefType) {
    selectedChef = chefType;
    
    // Update UI to show selected chef
    chefSelectionOptions.forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.chef === chefType) {
            option.classList.add('selected');
        }
    });
    
    // Update the chef image
    if (chefType === 'male') {
        cookModel.src = 'https://raw.githubusercontent.com/ariz17/cooking-game/baec44290ada2844fcc1cf73932bceaad84a6e7b/assets/Chef%202.jpg';
    } else {
        cookModel.src = 'https://raw.githubusercontent.com/ariz17/cooking-game/3e226d7f8411fe125e6e937d5e36b74a0bd0fc9b/assets/Chef.jpg';
    }
}

/**
 * Shows the background selection screen after entering name
 */
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

/**
 * Handles background selection
 */
function selectBackground(bgNumber) {
    selectedBackground = bgNumber;
    
    // Update UI to show selected background
    bgSelectionOptions.forEach(option => {
        option.classList.remove('selected');
        if (parseInt(option.dataset.bg) === bgNumber) {
            option.classList.add('selected');
        }
    });
    
    // Update video source
    bgVideo.src = BACKGROUND_VIDEOS[bgNumber];
    
    // Make the background video visible during selection
    bgVideo.style.opacity = '0.8';
    bgVideo.style.filter = 'brightness(0.8)';
    
    // Add a semi-transparent overlay to make text more readable
    document.body.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
    backgroundSelectionScreen.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
}

/**
 * Starts the game after selecting background
 */
function startGame() {
    backgroundSelectionScreen.classList.add('fade-out');
    
    // Reset background video styles
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

/**
 * Generates the ingredient buttons dynamically from the ingredients array.
 */
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

/**
 * Handles the selection of an ingredient.
 * Toggles the 'active' class and adds/removes from selectedIngredients array.
 * @param {HTMLElement} button The button element that was clicked.
 */
function selectIngredient(button) {
    const ingredient = button.dataset.ingredient;
    if (selectedIngredients.includes(ingredient)) {
        return;
    }
    // Select ingredient only once; cannot unselect by clicking again
    selectedIngredients.push(ingredient);
    button.classList.add('active');
}

// Fisher-Yates shuffle
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

/**
 * Starts a new round by generating a new order.
 */
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
    // Avoid consecutive same customer even after rebuild
    if (customerQueue.length > 1 && customerQueue[0] === lastCustomerIndex) {
        customerQueue.push(customerQueue.shift());
    }
    if (recipeQueue.length === 0) {
        rebuildRecipeQueue();
    }
    // Avoid consecutive same recipe even after rebuild
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
    
    // Hide hint content for new order
    hintContent.classList.add('hidden');

    startTimer();
}

/**
 * Checks if the served ingredients match the current order.
 */
function serveOrder() {
    // Sort arrays to ensure correct comparison regardless of order
    const normalize = (arr) => [...arr].map(v => (typeof v === 'string' ? v.trim().toLowerCase() : v)).sort();
    const sortedSelected = normalize(selectedIngredients);
    const sortedOrder = normalize(currentOrder);

    if (sortedSelected.length === sortedOrder.length && 
        sortedSelected.every((value, index) => value === sortedOrder[index])) {
        
        statusMessageDisplay.textContent = "Correct! Order served successfully!";
        statusMessageDisplay.classList.remove('fade-in');
        void statusMessageDisplay.offsetWidth;
        statusMessageDisplay.classList.add('fade-in');
        
        // Show score animation for +10 points
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
        
        // Show score animation for -5 points
        showScoreChange(-5, false);
        
        score = Math.max(0, score - 5);
        scoreDisplay.textContent = score;
        setTimeout(() => {
            resetGame();
        }, 1000);
    }
}

/**
 * Resets the selected ingredients and button states.
 */
function resetGame() {
    selectedIngredients = [];
    const buttons = document.querySelectorAll('.ingredient-btn');
    buttons.forEach(button => button.classList.remove('active'));
}

/**
 * Shows a score change animation with the specified amount and color.
 * @param {number} amount - The amount of points to show (positive or negative).
 * @param {boolean} isPositive - Whether the score change is positive or negative.
 */
function showScoreChange(amount, isPositive) {
    const scoreChangeElement = document.createElement('div');
    scoreChangeElement.className = `score-change ${isPositive ? 'score-positive' : 'score-negative'}`;
    scoreChangeElement.textContent = `${isPositive ? '+' : ''}${amount}`;
    
    // Position the score change element near the score display
    const rect = scoreDisplay.getBoundingClientRect();
    scoreChangeElement.style.left = `${rect.left + rect.width / 2}px`;
    scoreChangeElement.style.top = `${rect.top}px`;
    
    document.body.appendChild(scoreChangeElement);
    
    // Remove the element after the animation completes
    setTimeout(() => {
        document.body.removeChild(scoreChangeElement);
    }, 1000);
}

/**
 * Shows the hint with ingredients needed for the current order.
 */
function showHint() {
    if (!currentOrder || currentOrder.length === 0) {
        return;
    }
    if (!hintContent.classList.contains('hidden')) {
        hintContent.classList.add('hidden');
        return;
    }
    
    // Refresh current order from recipes to ensure we have the latest data
    const currentRecipeName = customerOrderDisplay.textContent.replace('Order: ', '');
    if (recipes[currentRecipeName]) {
        currentOrder = recipes[currentRecipeName].slice();
        console.log('Updated current order for hint:', currentOrder);
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
    // Show score animation for -5 points
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
    // Reset core state
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

// --- Event Listeners ---
startButton.addEventListener('click', showNameInput);
startButton.addEventListener('mousedown', () => startButton.classList.add('btn-press'));
startButton.addEventListener('mouseup', () => startButton.classList.remove('btn-press'));

// Chef selection event listeners
chefSelectionOptions.forEach(option => {
    option.addEventListener('click', () => selectChef(option.dataset.chef));
});

// Continue to background button
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

// Instructions modal event listeners
instructionsBtn.addEventListener('click', () => {
    console.log('Instructions button clicked!');
    instructionsModal.classList.remove('hidden');
    console.log('Modal hidden class removed');
});
instructionsBtn.addEventListener('mousedown', () => instructionsBtn.classList.add('btn-press'));
instructionsBtn.addEventListener('mouseup', () => instructionsBtn.classList.remove('btn-press'));

closeInstructions.addEventListener('click', () => {
    instructionsModal.classList.add('hidden');
});
closeInstructions.addEventListener('mousedown', () => closeInstructions.classList.add('btn-press'));
closeInstructions.addEventListener('mouseup', () => closeInstructions.classList.remove('btn-press'));

// Close modal when clicking outside
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

// --- Initial Setup ---
// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initial loading logic
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => loadingScreen.classList.add('hidden'), 160);
        introScreen.classList.remove('hidden');
        loadGameData();
    }, 3000);
    
    // Debug: Check if elements exist
    console.log('Instructions button:', instructionsBtn);
    console.log('Instructions modal:', instructionsModal);
    console.log('Close button:', closeInstructions);
});