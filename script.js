const themeToggle = document.getElementById('theme-toggle');
const langToggle = document.getElementById('lang-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');

let currentLang = localStorage.getItem('lang') || 'PT';
if (currentLang === 'EN') {
    langToggle.textContent = 'EN';
}

function updateTitle() {
    document.title = currentLang === 'PT' ? 'Decorador de Notas' : 'Note Decorator';
}
updateTitle();

langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'PT' ? 'EN' : 'PT';
    langToggle.textContent = currentLang;
    localStorage.setItem('lang', currentLang);
    updateTitle();
    nextRound();
});

const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }
} else {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }
}

themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }
});

const notesData = [
    { notePt: "Dó", noteEn: "Do", symbol: "C", id: "C" },
    { notePt: "Dó sustenido", noteEn: "Do sharp", symbol: "C#", id: "C#" },
    { notePt: "Ré", noteEn: "Re", symbol: "D", id: "D" },
    { notePt: "Ré sustenido", noteEn: "Re sharp", symbol: "D#", id: "D#" },
    { notePt: "Mi", noteEn: "Mi", symbol: "E", id: "E" },
    { notePt: "Fá", noteEn: "Fa", symbol: "F", id: "F" },
    { notePt: "Fá sustenido", noteEn: "Fa sharp", symbol: "F#", id: "F#" },
    { notePt: "Sol", noteEn: "Sol", symbol: "G", id: "G" },
    { notePt: "Sol sustenido", noteEn: "Sol sharp", symbol: "G#", id: "G#" },
    { notePt: "Lá", noteEn: "La", symbol: "A", id: "A" },
    { notePt: "Lá sustenido", noteEn: "La sharp", symbol: "A#", id: "A#" },
    { notePt: "Si", noteEn: "Ti", symbol: "B", id: "B" },
    { notePt: "Si bemol", noteEn: "Ti flat", symbol: "Bb", id: "Bb" },
    { notePt: "Lá bemol", noteEn: "La flat", symbol: "Ab", id: "Ab" },
    { notePt: "Sol bemol", noteEn: "Sol flat", symbol: "Gb", id: "Gb" },
    { notePt: "Mi bemol", noteEn: "Mi flat", symbol: "Eb", id: "Eb" },
    { notePt: "Ré bemol", noteEn: "Re flat", symbol: "Db", id: "Db" },
];

let weights = {};
notesData.forEach(item => {
    weights[item.id] = 10;
});

let currentChallenge = null;
let currentQuestionType = 'SYMBOL_TO_NOTE';
let isWaiting = false;

const challengeLabel = document.getElementById('challenge-label');
const challengeDisplay = document.getElementById('challenge-display');
const optionsGrid = document.getElementById('options-grid');

function getWeightedRandomItem() {
    let totalWeight = 0;
    for (const key in weights) {
        totalWeight += weights[key];
    }

    let randomNum = Math.random() * totalWeight;
    let weightSum = 0;

    for (const item of notesData) {
        weightSum += weights[item.id];
        if (randomNum <= weightSum) {
            return item;
        }
    }
    return notesData[0];
}

function getRandomOptions(correctItem, count) {
    const options = [correctItem];
    while (options.length < count) {
        const randomItem = notesData[Math.floor(Math.random() * notesData.length)];
        if (!options.some(opt => opt.id === randomItem.id)) {
            options.push(randomItem);
        }
    }
    return options.sort(() => Math.random() - 0.5);
}

function nextRound() {
    isWaiting = false;
    currentChallenge = getWeightedRandomItem();
    currentQuestionType = 'SYMBOL_TO_NOTE';

    challengeLabel.textContent = currentLang === 'PT' ? "Qual é a nota?" : "What's the note?";
    challengeDisplay.textContent = currentChallenge.symbol;

    const options = getRandomOptions(currentChallenge, 4);
    optionsGrid.innerHTML = '';
    
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = currentLang === 'PT' ? opt.notePt : opt.noteEn;
        
        btn.addEventListener('click', () => handleAnswer(opt.id, btn));
        optionsGrid.appendChild(btn);
    });
}

function handleAnswer(selectedId, btnElement) {
    if (isWaiting) return;
    btnElement.blur();

    if (selectedId === currentChallenge.id) {
        isWaiting = true;
        btnElement.classList.add('correct');
        weights[currentChallenge.id] = Math.max(1, weights[currentChallenge.id] - 2);
        
        setTimeout(() => {
            nextRound();
        }, 500);
    } else {
        btnElement.classList.add('incorrect');
        weights[currentChallenge.id] += 5;
        
        setTimeout(() => {
            btnElement.classList.remove('incorrect');
        }, 400);
    }
}

nextRound();
