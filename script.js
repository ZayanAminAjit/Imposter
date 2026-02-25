// --- Data ---
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

const defaultWordBank = {
    "Regular": [
        {w: "Apple", h: "Orchard"}, {w: "Banana", h: "Pineapple"}, {w: "Car", h: "Engine"}, {w: "Ship", h: "Voyage"},
        {w: "Orange", h: "Crown"}, {w: "Chair", h: "Layer"}, {w: "Door", h: "Hinge"}, {w: "Airplane", h: "Runway"},
        {w: "Bed", h: "Rest"}, {w: "Roof", h: "Shingles"}, {w: "Wall", h: "Barrier"}, {w: "Bicycle", h: "Chain"},
        {w: "Ocean", h: "Skyline"}, {w: "Train", h: "Route"}, {w: "Sun", h: "Flare"}, {w: "Cloud", h: "Rumble"},
        {w: "Clock", h: "Ticking"}, {w: "Phone", h: "Screen"}, {w: "Mirror", h: "Reflection"}, {w: "Camera", h: "Lens"}
    ],
    "Food": [
        {w: "Pizza", h: "Oven"}, {w: "Burger", h: "Stack"}, {w: "Pasta", h: "AlDente"}, {w: "Biryani", h: "Aroma"},
        {w: "Tacos", h: "Fold"}, {w: "Salad", h: "Tossed"}, {w: "Soup", h: "Tender"}, {w: "Sandwich", h: "Layers"},
        {w: "Steak", h: "Sear"}, {w: "IceCream", h: "Scoop"}, {w: "Coffee", h: "Brewed"}, {w: "Pancake", h: "Griddle"}
    ],
    "Celebrities": [
        {w: "Cristiano Ronaldo", h: "Madrid"}, {w: "Lionel Messi", h: "Rosario"}, {w: "LeBron James", h: "Lakers"},
        {w: "Billie Eilish", h: "Whisper"}, {w: "Drake", h: "Toronto"}, {w: "Elon Musk", h: "Mars"},
        {w: "MrBeast", h: "Challenges"}, {w: "Tom Holland", h: "Spiderman"}
    ],
    "VideoGames": [
        {w: "Fortnite", h: "Island"}, {w: "Minecraft", h: "Crafting"}, {w: "Among Us", h: "Vent"},
        {w: "Call of Duty", h: "Prestige"}, {w: "Skyrim", h: "FusRoDah"}, {w: "Pokemon", h: "Pokeball"},
        {w: "Super Mario", h: "Goomba"}, {w: "Tetris", h: "Blocks"}
    ],
    "Movies": [
        {w: "Avengers", h: "Assemble"}, {w: "Spider-Man", h: "Webs"}, {w: "Harry Potter", h: "Hogwarts"},
        {w: "Titanic", h: "Iceberg"}, {w: "Inception", h: "Totem"}, {w: "Jurassic Park", h: "Isla Nublar"},
        {w: "Matrix", h: "RedPill"}, {w: "Avatar", h: "NaVi"}
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
    if (currentScreen && addToHistory) screenHistory.push(currentScreen.id);
    
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');

    // Update Nav Buttons
    const backBtn = document.getElementById('nav-back');
    const restartBtn = document.getElementById('nav-restart');
    
    // Only allow going back between names and settings, or to prevent breaking game state
    if (screenId === 'screen-settings') backBtn.classList.remove('hidden');
    else backBtn.classList.add('hidden');

    // Show restart button once gameplay starts (after settings)
    if (['screen-pass', 'screen-reveal', 'screen-timer', 'screen-vote'].includes(screenId)) {
        restartBtn.classList.remove('hidden');
    } else {
        restartBtn.classList.add('hidden');
    }
}

function goBack() {
    if (screenHistory.length > 0) {
        const prevScreen = screenHistory.pop();
        showScreen(prevScreen, false); // Don't add to history when going back
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
    document.querySelectorAll('.category-cb:checked').forEach(cb => {
        if(defaultWordBank[cb.value]) activeWords = activeWords.concat(defaultWordBank[cb.value]);
    });

    if (activeWords.length === 0) return showModal("No Categories", "Please select at least one word category!");

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

function showRole() {
    let p = gameState.roles[gameState.currentPlayerIdx];
    const roleElem = document.getElementById('reveal-role');
    
    roleElem.innerText = p.role === 'Whiteman' ? 'Mr. Whiteman' : p.role;
    roleElem.style.color = (p.role === 'Innocent') ? "var(--success)" : "var(--danger)";
    
    if (p.role === 'Innocent' || p.role === 'Jester') {
        document.getElementById('reveal-word').innerText = p.word;
        document.getElementById('reveal-desc').innerText = p.role === 'Jester' ? "Try to act suspicious and get voted out!" : "Find the imposter among you.";
    } else {
        document.getElementById('reveal-word').innerText = `Hint: ${p.hint}`;
        document.getElementById('reveal-desc').innerText = p.role === 'Whiteman' ? "You have no hint. Blend in immediately!" : "Figure out the real word and blend in!";
    }
    showScreen('screen-reveal');
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
    const guess = document.getElementById('imposter-guess-input').value.trim().toLowerCase();
    const actual = gameState.targetWord.w.toLowerCase();
    
    if (guess === actual) {
        endGame("Imposters Steal the Win!", `The Imposter correctly guessed the word!`, 'fa-mask', 'var(--danger)');
    } else {
        endGame("Innocents Win!", `The Imposter guessed "${guess}", which was wrong!`, 'fa-check-circle', 'var(--success)');
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