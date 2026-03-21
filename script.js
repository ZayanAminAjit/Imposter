// --- Service Worker and Data ---
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.log('Service Worker registration failed:', err));
}

const wordBank = {
    "Regular": [
        {w: "Library", h: "Silence"}, {w: "Subway", h: "Underground"}, {w: "Umbrella", h: "Rain"},
        {w: "Backpack", h: "Straps"}, {w: "Mirror", h: "Reflection"}, {w: "Keyboard", h: "Input"}
    ],
    "Food": [
        {w: "Pizza", h: "Dough"}, {w: "Sushi", h: "Vinegar"}, {w: "Taco", h: "Shell"},
        {w: "Burger", h: "Grill"}, {w: "Pasta", h: "Boil"}, {w: "Steak", h: "Medium"}
    ],
    "Celebrities": [
        {w: "Taylor Swift", h: "Eras"}, {w: "Tom Cruise", h: "Stunts"}, {w: "The Rock", h: "Muscle"},
        {w: "Beyonce", h: "Queen"}, {w: "Elon Musk", h: "Mars"}, {w: "Lionel Messi", h: "Pitch"}
    ],
    "VideoGames": [
        {w: "Minecraft", h: "Blocks"}, {w: "Fortnite", h: "Building"}, {w: "Among Us", h: "Sus"},
        {w: "Valorant", h: "Abilities"}, {w: "Zelda", h: "Triforce"}, {w: "Mario Kart", h: "Shells"}
    ],
    "Movies": [
        {w: "Inception", h: "Dreams"}, {w: "Titanic", h: "Iceberg"}, {w: "Star Wars", h: "Galaxy"},
        {w: "Harry Potter", h: "Wand"}, {w: "The Avengers", h: "Heroes"}, {w: "Joker", h: "Laugh"}
    ]
};

// --- State Management ---
let players = [];
let gameState = {
    roles: [],
    currentPlayerIdx: 0,
    targetWord: {w: '', h: ''},
    timerInterval: null
};
let settings = {
    categories: ['Regular'],
    imposterCount: 1,
    timeLimit: 0, // in minutes
    imposterHint: true,
    trollMode: false
};

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    document.getElementById('theme-toggle').dataset.value = savedTheme;

    renderCategories();
    renderPlayers();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('new-player-name').addEventListener('keypress', e => { if (e.key === 'Enter') addPlayer(); });

    // Settings listeners
    document.getElementById('time-limit-toggle').addEventListener('click', toggleSetting);
    document.getElementById('imposter-hint-toggle').addEventListener('click', toggleSetting);
    document.getElementById('troll-mode-toggle').addEventListener('click', toggleSetting);
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Reveal card interaction
    const revealCard = document.getElementById('reveal-card');
    const longPressProgress = document.getElementById('long-press-progress');
    let pressTimer = null;

    const startPress = (e) => {
        e.preventDefault(); // Prevent context menu on mobile
        longPressProgress.style.transition = 'width 0.5s linear';
        longPressProgress.style.width = '100%';
        pressTimer = setTimeout(() => {
            revealCard.classList.add('flipped');
            document.getElementById('btn-next-player').classList.remove('hidden');
        }, 500);
    };

    const cancelPress = () => {
        clearTimeout(pressTimer);
        longPressProgress.style.transition = 'width 0.2s linear';
        longPressProgress.style.width = '0%';
        revealCard.classList.remove('flipped');
    };

    revealCard.addEventListener("mousedown", startPress);
    revealCard.addEventListener("mouseup", cancelPress);
    revealCard.addEventListener("mouseleave", cancelPress);
    revealCard.addEventListener("touchstart", startPress, { passive: false });
    revealCard.addEventListener("touchend", cancelPress);
}

// --- Theme Management ---
function toggleTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    toggleBtn.dataset.value = newTheme;
}

// --- UI Navigation ---
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function restartGame() {
    clearInterval(gameState.timerInterval);
    showScreen('screen-setup');
}

// --- Setup Screen ---
function addPlayer() {
    const input = document.getElementById('new-player-name');
    const name = input.value.trim();
    if (name && !players.includes(name) && players.length < 12) {
        players.push(name);
        input.value = '';
        renderPlayers();
    } else if (players.includes(name)) {
        showModal('Oops!', 'Player name already exists.');
    } else if (players.length >= 12) {
        showModal('Max Players', 'You can have a maximum of 12 players.');
    }
}

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
        div.innerHTML = `<span><i class="fa-solid fa-user"></i> ${p}</span>
                         <button class="remove-btn" onclick="removePlayer('${p}')"><i class="fa-solid fa-xmark"></i></button>`;
        list.appendChild(div);
    });
    updateImposterCount();
    validateGameStart();
}

function renderCategories() {
    const grid = document.getElementById('categories-grid');
    grid.innerHTML = '';
    Object.keys(wordBank).forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.textContent = category;
        if (settings.categories.includes(category)) {
            btn.classList.add('selected');
        }
        btn.onclick = () => toggleCategory(category, btn);
        grid.appendChild(btn);
    });
}

function toggleCategory(category, btn) {
    const index = settings.categories.indexOf(category);
    if (index > -1) {
        if (settings.categories.length > 1) {
            settings.categories.splice(index, 1);
            btn.classList.remove('selected');
        } else {
            showModal('Hold on!', 'You must have at least one category selected.');
        }
    } else {
        settings.categories.push(category);
        btn.classList.add('selected');
    }
    validateGameStart();
}

function updateImposterCount() {
    const playerCount = players.length;
    if (playerCount <= 4) settings.imposterCount = 1;
    else if (playerCount <= 8) settings.imposterCount = 2;
    else settings.imposterCount = 3;
    document.getElementById('imposter-count').textContent = settings.imposterCount;
}

function toggleSetting(event) {
    const toggleBtn = event.currentTarget;
    const setting = toggleBtn.id.replace('-toggle', '');
    const isToggled = toggleBtn.dataset.value === 'on';
    const newValue = !isToggled;

    toggleBtn.dataset.value = newValue ? 'on' : 'off';

    if (setting === 'time-limit') {
        document.getElementById('time-limit-value').classList.toggle('hidden', !newValue);
        document.getElementById('time-limit-unit').classList.toggle('hidden', !newValue);
        settings.timeLimit = newValue ? parseInt(document.getElementById('time-limit-value').value) : 0;
    } else if (setting === 'imposter-hint') {
        settings.imposterHint = newValue;
    } else if (setting === 'troll-mode') {
        settings.trollMode = newValue;
    }
}


function validateGameStart() {
    const startBtn = document.getElementById('btn-start-game');
    const valid = players.length >= 3 && settings.categories.length > 0;
    startBtn.disabled = !valid;
}

// --- Game Logic ---
function startGame() {
    let activeWords = [];
    settings.categories.forEach(cat => {
        activeWords = activeWords.concat(wordBank[cat]);
    });
    gameState.targetWord = activeWords[Math.floor(Math.random() * activeWords.length)];

    let rolesPool = [];
    let isTrollRound = settings.trollMode && Math.random() < 0.2;

    if (isTrollRound) {
        const everyoneIsImposter = Math.random() < 0.5;
        rolesPool = Array(players.length).fill(everyoneIsImposter ? 'Imposter' : 'Innocent');
    } else {
        for (let i = 0; i < settings.imposterCount; i++) rolesPool.push('Imposter');
        while (rolesPool.length < players.length) rolesPool.push('Innocent');
    }

    rolesPool.sort(() => Math.random() - 0.5);
    
    gameState.roles = players.map((p, i) => {
        const role = rolesPool[i];
        let word = '???';
        let desc = "Blend in and don't get caught.";
        if (role === 'Innocent') {
            word = gameState.targetWord.w;
            desc = "Find the imposter among you.";
        } else if (settings.imposterHint) {
            word = `Hint: ${gameState.targetWord.h}`;
        }
        return { name: p, role, word, desc };
    });

    gameState.currentPlayerIdx = 0;
    prepareRevealScreen();
    showScreen('screen-reveal');
}

function prepareRevealScreen() {
    const player = gameState.roles[gameState.currentPlayerIdx];
    document.getElementById('reveal-player-name').textContent = player.name;
    
    document.getElementById('reveal-role').textContent = player.role;
    document.getElementById('reveal-role').style.color = player.role === 'Innocent' ? 'var(--success)' : 'var(--danger)';
    document.getElementById('reveal-word').textContent = player.word;
    document.getElementById('reveal-desc').textContent = player.desc;

    document.getElementById('reveal-card').classList.remove('flipped');
    document.getElementById('btn-next-player').classList.add('hidden');
    document.getElementById('long-press-progress').style.width = '0%';
}

function nextPlayer() {
    gameState.currentPlayerIdx++;
    if (gameState.currentPlayerIdx < players.length) {
        prepareRevealScreen();
    } else {
        if (settings.timeLimit > 0) {
            startDiscussionTimer();
        } else {
            // A short delay before moving to the vote screen to avoid accidental clicks
            setTimeout(goToVote, 100);
        }
    }
}

// --- Timer, Voting, and Result ---
function startDiscussionTimer() {
    showScreen('screen-timer');
    settings.timeLimit = parseInt(document.getElementById('time-limit-value').value);
    let timeLeft = settings.timeLimit * 60;
    
    const updateTimer = () => {
        let m = Math.floor(timeLeft / 60);
        let s = timeLeft % 60;
        document.getElementById('timer-display').innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    updateTimer();
    
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            clearInterval(gameState.timerInterval);
            showModal("Time's Up!", "Proceed to voting.", 'alert', goToVote);
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
    showModal("Confirm Vote", `Are you sure you want to vote out ${votedName}?`, "confirm", () => {
        const votedPlayer = gameState.roles.find(r => r.name === votedName);
        const imposters = gameState.roles.filter(r => r.role === 'Imposter');
        
        if (votedPlayer.role === 'Imposter') {
             endGame("Innocents Win!", `${votedName} was an Imposter!`, 'fa-check-circle');
        } else {
            const remainingPlayers = players.length - 1;
            if (imposters.length >= remainingPlayers / 2) {
                endGame("Imposters Win!", `An innocent player (${votedName}) was voted out!`, 'fa-skull');
            } else {
                // This part is tricky. Let's simplify: if you vote out an innocent, imposters win.
                 endGame("Imposters Win!", `An innocent player (${votedName}) was voted out! The imposters take over.`, 'fa-skull');
            }
        }
    });
}

function endGame(title, desc, iconClass) {
    const titleEl = document.getElementById('result-title');
    const iconEl = document.getElementById('result-icon');
    
    titleEl.innerText = title;
    titleEl.style.color = title.includes('Innocents') ? 'var(--success)' : 'var(--danger)';
    
    iconEl.className = `fa-solid ${iconClass} fa-4x screen-icon`;
    iconEl.style.color = title.includes('Innocents') ? 'var(--success)' : 'var(--danger)';

    document.getElementById('result-desc').innerText = desc;
    document.getElementById('result-word').innerText = gameState.targetWord.w;
    
    showScreen('screen-result');
}


// --- Custom Modal ---
function showModal(title, text, type = 'alert', onConfirm = null) {
    const modal = document.getElementById('custom-modal');
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-text').innerText = text;
    
    const actions = document.getElementById('modal-actions');
    actions.innerHTML = ''; 

    if (type === 'confirm') {
        const btnCancel = document.createElement('button');
        btnCancel.className = 'btn-outline';
        btnCancel.innerText = 'Cancel';
        btnCancel.onclick = () => hideModal();

        const btnConfirm = document.createElement('button');
        btnConfirm.className = 'btn-primary';
        btnConfirm.innerText = 'Confirm';
        btnConfirm.onclick = () => { hideModal(); if(onConfirm) onConfirm(); };

        actions.appendChild(btnCancel);
        actions.appendChild(btnConfirm);
    } else {
        const btnOk = document.createElement('button');
        btnOk.className = 'btn-primary';
        btnOk.innerText = 'OK';
        btnOk.onclick = () => { hideModal(); if(onConfirm) onConfirm(); };
        actions.appendChild(btnOk);
    }
    modal.classList.remove('hidden');
}

function hideModal() { document.getElementById('custom-modal').classList.add('hidden'); }
