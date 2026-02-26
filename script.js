// --- Data ---
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

const defaultWordBank = {
    "Regular": [
        {w: "Library", h: "Silence"}, {w: "Subway", h: "Underground"}, {w: "Umbrella", h: "Rain"},
        {w: "Backpack", h: "Straps"}, {w: "Mirror", h: "Reflection"}, {w: "Keyboard", h: "Input"},
        {w: "Telescope", h: "Stars"}, {w: "Wallet", h: "Leather"}, {w: "Bicycle", h: "Pedals"},
        {w: "Clock", h: "Hands"}, {w: "Compass", h: "North"}, {w: "Candle", h: "Wick"},
        {w: "Hammer", h: "Nail"}, {w: "Ladder", h: "Height"}, {w: "Camera", h: "Lens"},
        {w: "Blanket", h: "Warmth"}, {w: "Pillow", h: "Feathers"}, {w: "Calendar", h: "Dates"},
        {w: "Matches", h: "Sulfur"}, {w: "Bridge", h: "River"}, {w: "Mountain", h: "Peak"},
        {w: "Ocean", h: "Salt"}, {w: "Forest", h: "Trees"}, {w: "Desert", h: "Sand"},
        {w: "Airport", h: "Runway"}, {w: "Hospital", h: "Doctor"}, {w: "Gym", h: "Weights"},
        {w: "Museum", h: "Artifacts"}, {w: "Postcard", h: "Stamp"}, {w: "Map", h: "Legend"}
    ],
    "Food": [
        {w: "Pizza", h: "Dough"}, {w: "Sushi", h: "Vinegar"}, {w: "Taco", h: "Shell"},
        {w: "Burger", h: "Grill"}, {w: "Pasta", h: "Boil"}, {w: "Steak", h: "Medium"},
        {w: "Ramen", h: "Broth"}, {w: "Salad", h: "Dressing"}, {w: "Omelette", h: "Whisk"},
        {w: "Pancakes", h: "Syrup"}, {w: "Waffles", h: "Iron"}, {w: "Bagel", h: "Creamy"},
        {w: "Croissant", h: "Butter"}, {w: "Donut", h: "Glaze"}, {w: "Chocolate", h: "Cocoa"},
        {w: "Ice Cream", h: "Scoop"}, {w: "Cheesecake", h: "Graham"}, {w: "Popcorn", h: "Kernel"},
        {w: "Burrito", h: "Tortilla"}, {w: "Dim Sum", h: "Steamer"}, {w: "Curry", h: "Spices"},
        {w: "Lasagna", h: "Layers"}, {w: "Paella", h: "Saffron"}, {w: "Falafel", h: "Chickpeas"},
        {w: "Smoothie", h: "Blender"}, {w: "Coffee", h: "Roast"}, {w: "Tea", h: "Steep"},
        {w: "Wine", h: "Vineyard"}, {w: "Beer", h: "Hops"}, {w: "Champagne", h: "Bubbles"}
    ],
    "Celebrities": [
        {w: "Taylor Swift", h: "Eras"}, {w: "Tom Cruise", h: "Stunts"}, {w: "The Rock", h: "Muscle"},
        {w: "Beyonce", h: "Queen"}, {w: "Elon Musk", h: "Mars"}, {w: "Lionel Messi", h: "Pitch"},
        {w: "Cristiano Ronaldo", h: "Goal"}, {w: "LeBron James", h: "Dunk"}, {w: "Brad Pitt", h: "Hollywood"},
        {w: "Leonardo DiCaprio", h: "Oscar"}, {w: "Rihanna", h: "Umbrella"}, {w: "Drake", h: "Toronto"},
        {w: "Ariana Grande", h: "Ponytail"}, {w: "Gordon Ramsay", h: "Kitchen"}, {w: "Will Smith", h: "Fresh"},
        {w: "Morgan Freeman", h: "Voice"}, {w: "Keanu Reeves", h: "Matrix"}, {w: "Bill Gates", h: "Windows"},
        {w: "Oprah Winfrey", h: "Talk"}, {w: "Kim Kardashian", h: "Reality"}, {w: "Justin Bieber", h: "Baby"},
        {w: "Selena Gomez", h: "Rare"}, {w: "Katy Perry", h: "Fireworks"}, {w: "Lady Gaga", h: "Monster"},
        {w: "Eminem", h: "Rap"}, {w: "Jay-Z", h: "Empire"}, {w: "Kanye West", h: "Yeezy"},
        {w: "Zendaya", h: "Spider"}, {w: "Tom Holland", h: "Web"}, {w: "Scarlett Johansson", h: "Widow"}
    ],
    "VideoGames": [
        {w: "Minecraft", h: "Blocks"}, {w: "Fortnite", h: "Building"}, {w: "Roblox", h: "Platform"},
        {w: "Call of Duty", h: "Soldier"}, {w: "Grand Theft Auto", h: "Stealing"}, {w: "Zelda", h: "Triforce"},
        {w: "Mario Kart", h: "Shells"}, {w: "Pac-Man", h: "Ghosts"}, {w: "Tetris", h: "Shapes"},
        {w: "Among Us", h: "Sus"}, {w: "Valorant", h: "Abilities"}, {w: "League of Legends", h: "Nexus"},
        {w: "Dota 2", h: "Ancient"}, {w: "Overwatch", h: "Payload"}, {w: "Apex Legends", h: "Squad"},
        {w: "The Sims", h: "House"}, {w: "Animal Crossing", h: "Island"}, {w: "Pokemon", h: "Catch"},
        {w: "Sonic", h: "Rings"}, {w: "Halo", h: "Spartan"}, {w: "God of War", h: "Axe"},
        {w: "The Witcher", h: "Monsters"}, {w: "Skyrim", h: "Dragon"}, {w: "Elden Ring", h: "Tarnished"},
        {w: "Cyberpunk 2077", h: "Neon"}, {w: "Resident Evil", h: "Horror"}, {w: "Final Fantasy", h: "Crystal"},
        {w: "Street Fighter", h: "Combo"}, {w: "Mortal Kombat", h: "Fatality"}, {w: "Doom", h: "Mars"}
    ],
    "Movies": [
        {w: "Inception", h: "Dreams"}, {w: "Titanic", h: "Iceberg"}, {w: "Star Wars", h: "Galaxy"},
        {w: "Harry Potter", h: "Wand"}, {w: "The Avengers", h: "Heroes"}, {w: "Joker", h: "Laugh"},
        {w: "Parasite", h: "Basement"}, {w: "Interstellar", h: "Blackhole"}, {w: "The Godfather", h: "Mafia"},
        {w: "Pulp Fiction", h: "Briefcase"}, {w: "The Dark Knight", h: "Gotham"}, {w: "Jurassic Park", h: "Fossil"},
        {w: "Toy Story", h: "Plastic"}, {w: "Finding Nemo", h: "Anemone"}, {w: "The Lion King", h: "Savanna"},
        {w: "Shrek", h: "Swamp"}, {w: "Frozen", h: "Snow"}, {w: "Home Alone", h: "Traps"},
        {w: "Back to the Future", h: "Time"}, {w: "The Matrix", h: "Simulation"}, {w: "Spider-Man", h: "Multiverse"},
        {w: "Black Panther", h: "Vibranium"}, {w: "Gladiator", h: "Arena"}, {w: "Braveheart", h: "Freedom"},
        {w: "Rocky", h: "Boxing"}, {w: "The Terminator", h: "Robot"}, {w: "Alien", h: "Space"},
        {w: "Jaws", h: "Ocean"}, {w: "The Shining", h: "Hotel"}, {w: "Mad Max", h: "Desert"}
    ]
};

// --- State ---
let players = [];
let screenHistory = [];
let gameState = {
    roles: [],
    currentPlayerIdx: 0,
    targetWord: {w: '', h: ''},
    twist: null,
    timerInterval: null
};

// --- Initialization & Theme ---
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);
});

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.getElementById("theme-icon");
    icon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
}

// --- Custom Modal System ---
function showModal(title, text, type = 'alert', onConfirm = null) {
    const modal = document.getElementById('custom-modal');
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-text').innerText = text;
    
    const actions = document.getElementById('modal-actions');
    actions.innerHTML = ''; // Clear previous buttons

    if (type === 'confirm') {
        const btnCancel = document.createElement('button');
        btnCancel.className = 'btn-outline';
        btnCancel.innerText = 'Cancel';
        btnCancel.onclick = () => hideModal();

        const btnConfirm = document.createElement('button');
        btnConfirm.className = 'btn-danger';
        btnConfirm.innerText = 'Yes, Vote out';
        btnConfirm.onclick = () => { hideModal(); if(onConfirm) onConfirm(); };

        actions.appendChild(btnCancel);
        actions.appendChild(btnConfirm);
    } else {
        const btnOk = document.createElement('button');
        btnOk.className = 'btn-primary';
        btnOk.innerText = 'OK';
        btnOk.onclick = () => hideModal();
        actions.appendChild(btnOk);
    }
    modal.classList.remove('hidden');
}

function hideModal() { document.getElementById('custom-modal').classList.add('hidden'); }

// --- UI Navigation ---
function showScreen(screenId, addToHistory = true) {
    const currentScreen = document.querySelector('.screen.active');
    
    // Only add to history if we're moving forward to a DIFFERENT screen
    if (currentScreen && addToHistory && currentScreen.id !== screenId) {
        screenHistory.push(currentScreen.id);
    }
    
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');

    const backBtn = document.getElementById('nav-back');
    const restartBtn = document.getElementById('nav-restart');
    
    // FIX: Show back button if there is any history to go back to, 
    // unless we are on the first screen or the final result screen.
    if (screenHistory.length > 0 && screenId !== 'screen-names' && screenId !== 'screen-result') {
        backBtn.classList.remove('hidden');
    } else {
        backBtn.classList.add('hidden');
    }

    if (['screen-pass', 'screen-reveal', 'screen-timer', 'screen-vote'].includes(screenId)) {
        restartBtn.classList.remove('hidden');
    } else {
        restartBtn.classList.add('hidden');
    }
}

function goBack() {
    if (screenHistory.length > 0) {
        const prevScreen = screenHistory.pop();
        showScreen(prevScreen, false); // 'false' prevents an infinite history loop
    }
}

function restartToSettings() {
    clearInterval(gameState.timerInterval);
    screenHistory = [];
    showScreen('screen-settings', false);
}

// --- Screen 1: Names ---
function addPlayer() {
    const input = document.getElementById('new-player-name');
    const name = input.value.trim();
    if (name && !players.includes(name)) {
        players.push(name);
        input.value = '';
        renderPlayers();
    } else if (players.includes(name)) {
        showModal('Oops!', 'Player name already exists.');
    }
}

document.getElementById('new-player-name').addEventListener('keypress', e => { if (e.key === 'Enter') addPlayer(); });

function removePlayer(name) {
    players = players.filter(p => p !== name);
    renderPlayers();
}

function renderPlayers() {
    const list = document.getElementById('player-list-ui');
    list.innerHTML = '';
    players.forEach(p => {
        const div = document.createElement('div');
        div.className = 'player-item';
        div.innerHTML = `<span><i class="fa-solid fa-user" style="color:var(--accent); margin-right:10px;"></i>${p}</span>
                         <button class="remove-btn" onclick="removePlayer('${p}')"><i class="fa-solid fa-xmark"></i></button>`;
        list.appendChild(div);
    });
    document.getElementById('btn-to-settings').disabled = players.length < 3;
}

function goToSettings() {
    if (players.length >= 3) showScreen('screen-settings');
    else showModal('Hold on!', 'You need at least 3 players to start a game.');
}

// --- Setup & Game Logic ---
function startGame() {
    let activeWords = [];
    const selectedCheckboxes = document.querySelectorAll('.category-cb:checked');
    
    selectedCheckboxes.forEach(cb => {
        const category = cb.value;
        if (defaultWordBank[category]) {
            activeWords = activeWords.concat(defaultWordBank[category]);
        }
    });

    // CRITICAL FIX: If no words are found, the game will now stop and tell you 
    // instead of showing a blank screen.
    if (activeWords.length === 0) {
        return showModal("No Words Found", "Please select at least one valid category.");
    }
    gameState.targetWord = activeWords[Math.floor(Math.random() * activeWords.length)];

    let imposterCount = parseInt(document.getElementById('set-imposters').value);
    const hasWhiteman = document.getElementById('set-whiteman').checked;
    const hasJester = document.getElementById('set-jester').checked;
    const allowTwists = document.getElementById('set-twists').checked;

    if (imposterCount + (hasWhiteman?1:0) + (hasJester?1:0) >= players.length) {
        return showModal("Too Many Roles", "You have more special roles than players! Reduce imposters.");
    }

    gameState.twist = null;
    if (allowTwists) {
        const rand = Math.random();
        if (rand < 0.10) gameState.twist = 'all_imposters';
        else if (rand < 0.20) gameState.twist = 'no_imposters';
    }

    let rolesPool = [];
    if (gameState.twist === 'all_imposters') {
        for(let i=0; i<players.length; i++) rolesPool.push('Imposter');
    } else if (gameState.twist === 'no_imposters') {
        for(let i=0; i<players.length; i++) rolesPool.push('Innocent');
    } else {
        for(let i=0; i<imposterCount; i++) rolesPool.push('Imposter');
        if(hasWhiteman) rolesPool.push('Whiteman');
        if(hasJester) rolesPool.push('Jester');
        while(rolesPool.length < players.length) rolesPool.push('Innocent');
    }

    rolesPool.sort(() => Math.random() - 0.5);
    let shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    
    gameState.roles = shuffledPlayers.map((p, i) => {
        let r = rolesPool[i];
        let data = { name: p, role: r, word: '', hint: '' };
        if (r === 'Innocent' || r === 'Jester') {
            data.word = gameState.targetWord.w;
            data.hint = "You have the word.";
        } else if (r === 'Imposter') {
            data.word = "???";
            data.hint = gameState.targetWord.h;
        } else if (r === 'Whiteman') {
            data.word = "???";
            data.hint = "You get NOTHING.";
        }
        return data;
    });

    gameState.currentPlayerIdx = 0;
    prepPassScreen();
}

function prepPassScreen() {
    if (gameState.currentPlayerIdx >= gameState.roles.length) {
        startDiscussion();
        return;
    }
    let p = gameState.roles[gameState.currentPlayerIdx];
    document.getElementById('pass-player-name').innerText = p.name;
    document.getElementById('btn-im-player').innerText = p.name;
    showScreen('screen-pass');
}

let hasSeenWord = false; // Track if current player revealed the word

function showRole() {
    let p = gameState.roles[gameState.currentPlayerIdx];
    hasSeenWord = false; 

    // 1. Prepare Text (Handle Spaces and Case)
    const roleElem = document.getElementById('reveal-role');
    roleElem.innerText = p.role === 'Whiteman' ? 'Mr. Whiteman' : p.role;
    roleElem.style.color = (p.role === 'Innocent') ? "var(--success)" : "var(--danger)";
    
    // Formatting: Ensure multi-word entries like "Ice Cream" look right
    let displayWord = (p.role === 'Innocent' || p.role === 'Jester') ? p.word : `Hint: ${p.hint}`;
    document.getElementById('reveal-word').innerText = displayWord;
    
    document.getElementById('reveal-desc').innerText = p.role === 'Jester' ? 
        "Try to act suspicious and get voted out!" : 
        (p.role === 'Innocent' ? "Find the imposter among you." : "Blend in and don't get caught!");

    // 2. Reset UI State to "Locked"
    document.getElementById('reveal-content').classList.add('hidden-blur');
    document.getElementById('reveal-content').classList.remove('visible-clear');
    document.getElementById('reveal-placeholder').style.display = 'block';
    
    document.getElementById('btn-toggle-reveal').innerHTML = '<i class="fa-solid fa-eye"></i> Show Word';
    document.getElementById('btn-next-player').classList.add('hidden'); // Hide "Next" until they look

    showScreen('screen-reveal');
}

function toggleWordVisibility() {
    const content = document.getElementById('reveal-content');
    const placeholder = document.getElementById('reveal-placeholder');
    const toggleBtn = document.getElementById('btn-toggle-reveal');
    const nextBtn = document.getElementById('btn-next-player');

    if (content.classList.contains('hidden-blur')) {
        // ACTION: SHOW
        content.classList.remove('hidden-blur');
        content.classList.add('visible-clear');
        placeholder.style.display = 'none';
        toggleBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Hide Word';
        hasSeenWord = true;
        nextBtn.classList.remove('hidden'); // Now they can proceed
    } else {
        // ACTION: HIDE
        content.classList.add('hidden-blur');
        content.classList.remove('visible-clear');
        placeholder.style.display = 'block';
        toggleBtn.innerHTML = '<i class="fa-solid fa-eye"></i> Show Word';
    }
}


function hideRole() {
    gameState.currentPlayerIdx++;
    prepPassScreen();
}

// --- Timer & Voting ---
function updateTimerUI(timeLeft) {
    let m = Math.floor(timeLeft / 60);
    let s = timeLeft % 60;
    document.getElementById('timer-display').innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
}

function startDiscussion() {
    showScreen('screen-timer');
    let timeLeft = parseInt(document.getElementById('set-timer').value);
    
    // Fix: Immediately update the display so it doesn't show 2:00 for a second
    updateTimerUI(timeLeft); 
    
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerUI(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(gameState.timerInterval);
            document.getElementById('timer-display').innerText = "0:00";
            showModal("Time's Up!", "Discussion time is over. Proceed to voting.");
        }
    }, 1000);
}

function goToVote() {
    clearInterval(gameState.timerInterval);
    const grid = document.getElementById('vote-grid');
    grid.innerHTML = '';
    players.forEach(p => {
        let btn = document.createElement('button');
        btn.className = 'btn-outline';
        btn.innerText = p;
        btn.onclick = () => handleVote(p);
        grid.appendChild(btn);
    });
    showScreen('screen-vote');
}

function handleVote(votedName) {
    // Custom Modal instead of window.confirm
    showModal("Confirm Vote", `Are you sure the group wants to vote out ${votedName}?`, "confirm", () => {
        let votedPlayer = gameState.roles.find(r => r.name === votedName);

        if (votedPlayer.role === 'Jester') {
            endGame("The Jester Wins!", `${votedName} tricked you all and got voted out!`, 'fa-masks-theater', 'var(--accent)');
        } else if (votedPlayer.role === 'Innocent') {
            if (gameState.twist === 'no_imposters') {
                endGame("Paranoia Wins!", `There were NO imposters! You voted out an innocent ${votedName}.`, 'fa-ghost', 'var(--text-muted)');
            } else {
                endGame("Imposters Win!", `You voted out an Innocent (${votedName}). The Imposters survive!`, 'fa-skull', 'var(--danger)');
            }
        } else if (votedPlayer.role === 'Imposter' || votedPlayer.role === 'Whiteman') {
            document.getElementById('guess-msg').innerText = `${votedName}, you were caught! You get one chance to guess the actual word to steal the win.`;
            document.getElementById('imposter-guess-input').value = '';
            showScreen('screen-guess');
        }
    });
}

function submitGuess() {
    // Case-Insensitive & Space-Friendly Guessing
    const rawGuess = document.getElementById('imposter-guess-input').value.trim().toLowerCase();
    const rawActual = gameState.targetWord.w.toLowerCase();
    
    // Remove symbols/spaces for a "Deep Match" (Dota 2 vs Dota2)
    const cleanGuess = rawGuess.replace(/[^a-z0-9]/g, '');
    const cleanActual = rawActual.replace(/[^a-z0-9]/g, '');

    if (cleanGuess === cleanActual) {
        endGame("Imposters Steal the Win!", `The Imposter correctly guessed "${gameState.targetWord.w}"!`, 'fa-mask', 'var(--danger)');
    } else {
        endGame("Innocents Win!", `The Imposter guessed "${rawGuess}", but the word was "${gameState.targetWord.w}".`, 'fa-check-circle', 'var(--success)');
    }
}

function endGame(title, desc, iconClass, color) {
    const titleEl = document.getElementById('result-title');
    const iconEl = document.getElementById('result-icon');
    
    titleEl.innerText = title;
    titleEl.style.color = color;
    
    iconEl.className = `fa-solid ${iconClass} fa-4x screen-icon`;
    iconEl.style.color = color;

    document.getElementById('result-desc').innerText = desc;
    document.getElementById('result-word').innerText = gameState.targetWord.w;
    
    document.getElementById('nav-restart').classList.add('hidden'); // Hide top bar restart on final screen
    showScreen('screen-result');

}


