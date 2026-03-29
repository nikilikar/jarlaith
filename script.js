const courseData = {
    "basic-survival": {
        title: "🥨 Basic Survival",
        phrases: [
            { english: "One beer, please!", german: "Ein Bier, bitte!" },
            { english: "Where is the toilet?", german: "Wo ist die Toilette?" },
            { english: "Check, please!", german: "Die Rechnung, bitte!" }
        ]
    },
    "latinas-section": {
        title: "🍑 The 'Special' Mission",
        phrases: [
            { english: "Are you a big booty latina?", german: "Bist du eine 'Big Booty Latina'?" },
            { english: "I love your energy.", german: "Ich liebe deine Energie." },
            { english: "You are very beautiful.", german: "Du bist sehr schön." }
        ]
    },
    "erasmus-party": {
        title: "🍻 Erasmus Party Animal",
        phrases: [
            { english: "Another round!", german: "Noch eine Runde!" },
            { english: "I lost my friends.", german: "Ich habe meine Freunde verloren." },
            { english: "Let's go to another club.", german: "Lass uns in einen anderen Club gehen." }
        ]
    },
    "history-expert": {
        title: "🏛️ Dark History Tour",
        phrases: [
            { english: "I'm just a history buff!", german: "Ich bin nur ein Geschichtsfan!" },
            { english: "That was a 'misunderstanding'.", german: "Das war ein 'Missverständnis'." },
            { english: "Can we skip this museum?", german: "Können wir dieses Museum überspringen?" }
        ]
    },
    "politics-101": {
        title: "🦅 The Trump Logic",
        phrases: [
            { english: "Women would start a war!", german: "Frauen würden einen Krieg anfangen!" },
            { english: "It's because of the hormones.", german: "Es liegt an den Hormonen." },
            { english: "Make Erasmus Great Again!", german: "Mach Erasmus wieder großartig!" }
        ]
    },
    "emergency-exit": {
        title: "🏃‍♂️ Cancel Culture Escape",
        phrases: [
            { english: "It was just a joke, bro!", german: "Das war nur ein Witz, Bruder!" },
            { english: "I am not a bad person.", german: "Ich bin kein schlechter Mensch." },
            { english: "Don't post that on TikTok.", german: "Poste das nicht auf TikTok." }
        ]
    },
    "stuttgart-cars": {
    type: "fill-blanks",
    title: "🚗 Stuttgart: City of Cars",
    // Koristimo ID-ove [blank-X] umjesto crtica
    text: "[blank-0] in Stuttgart: Die Stadt der Autos. Stuttgart ist [blank-1] berühmte Stadt in Deutschland. Hier ist die Heimat von Mercedes-Benz und Porsche. Gottlieb Daimler hat hier im [blank-2] 1885 das erste Auto [blank-3]. Heute besuchen 440.000 Menschen pro Jahr das Mercedes-Benz Museum. In der Region Stuttgart [blank-4] Firmen viele Autos. Stuttgart ist das [blank-5] der Industrie. Das ist der perfekte Ort für einen [blank-6]! Aka as [blank-7]!",
    // Riječi koje će se prikazivati u banki riječi (poredane abecedno ili nasumično da mu je teže)
    words: ["eine", "erfunden", "Herz", "Ingenieur", "Jahr", "Jarlaith", "produzieren", "Willkommen"],
    // TOČNI odgovori, poredani kako se pojavljuju u tekstu (blank-0, blank-1, itd.)
    correctAnswers: ["Willkommen", "eine", "Jahr", "erfunden", "produzieren", "Herz", "Ingenieur", "Jarlaith"]
    },
};

let currentCategory = localStorage.getItem('currentLessonKey') || "basic-survival";
let currentIndex = parseInt(localStorage.getItem(currentCategory + '_progress')) || 0;
let completedLessons = JSON.parse(localStorage.getItem('completedLessons')) || [];
let userXP = parseInt(localStorage.getItem('userXP')) || 0;

const quizList = [
    { id: "quiz-1", title: "Survival Basics Test", requiredMissions: 1, xpReward: 100 },
    { id: "quiz-2", title: "The Latina Masterclass", requiredMissions: 2, xpReward: 150 },
    { id: "quiz-3", title: "Party Animal Pro", requiredMissions: 3, xpReward: 200 }
];

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('dashboard-container')) renderDashboard();
    if (document.getElementById('lesson-topic')) updateUI();
    if (document.getElementById('quiz-list-container')) renderQuizList();
    updateXPUI();

    const actionBtn = document.getElementById('main-action-btn');
    if (actionBtn) {
        const allKeys = Object.keys(courseData);
        const nextKey = allKeys.find(k => !completedLessons.includes(k));
        if (nextKey) {
            actionBtn.innerText = "Continue Learning →";
            actionBtn.onclick = () => { localStorage.setItem('currentLessonKey', nextKey); window.location.href = 'training.html'; };
        } else {
            actionBtn.innerText = "Review Progress →";
            actionBtn.onclick = () => window.location.href = 'lessons.html';
        }
    }
});

function renderDashboard() {
    const container = document.getElementById('dashboard-container');
    if (!container) return;
    container.innerHTML = ''; 
    const keys = Object.entries(courseData);
    
    keys.forEach(([key, data], index) => {
        const isDone = completedLessons.includes(key);
        const missionBox = document.createElement('div');
        missionBox.className = `mission-item ${isDone ? 'completed' : ''}`;
        
        // POPRAVAK: Provjera ima li lekcija phrases ili type
        const infoText = data.type === 'fill-blanks' ? "Interactive Story" : `${data.phrases.length} phrases`;

        missionBox.innerHTML = `
            <div>
                <span style="font-size: 1.2rem; display: block; margin-bottom: 5px;">${data.title}</span>
                <span style="font-size: 0.8rem; color: #636e72;">${infoText} to master</span>
            </div>
            <div class="status-tag">${isDone ? '✓ Done' : 'New'}</div>
        `;
        missionBox.onclick = () => { localStorage.setItem('currentLessonKey', key); window.location.href = 'training.html'; };
        container.appendChild(missionBox);

        if (index === 2 && completedLessons.length >= 3) {
            const quizBox = document.createElement('div');
            quizBox.className = 'mission-item quiz-unlock-special'; 
            quizBox.onclick = () => window.location.href = 'quizzes.html';
            quizBox.innerHTML = `<div><span style="font-weight:bold;">🏆 Level 1: Final Test</span></div><div class="status-tag" style="background:#fdcb6e;">READY</div>`;
            container.appendChild(quizBox);
        }
    });
    updateProgressSidebar();
}

function updateUI() {
    const data = courseData[currentCategory];
    if (!data) return;

    document.getElementById('lesson-topic').innerText = data.title;
    const phraseSection = document.getElementById('phrase-section-container');
    const blanksSection = document.getElementById('fill-blanks-section');
    const nextBtn = document.querySelector('.btn-next');

    if (data.type === "fill-blanks") {
        if(phraseSection) phraseSection.style.display = 'none';
        if(blanksSection) blanksSection.style.display = 'block';
        if(nextBtn) nextBtn.innerText = "Finish Mission →";
        renderStory(data);
    } else {
        if(phraseSection) phraseSection.style.display = 'block';
        if(blanksSection) blanksSection.style.display = 'none';
        const phrase = data.phrases[currentIndex];
        document.getElementById('english-text').innerText = phrase.english;
        document.getElementById('german-text').innerText = phrase.german;
        document.getElementById('progress-text').innerText = `Phrase ${currentIndex + 1} of ${data.phrases.length}`;
    }
}

function renderStory(data) {
    const wordBank = document.getElementById('word-bank');
    const storyText = document.getElementById('story-text');
    
    // Provjera da se kod ne sruši ako ne nađe elemente
    if (!wordBank || !storyText) return;

    // --- 1. NAPUNI BANKU RIJEČI (OBLAČIĆI GORE) ---
    wordBank.innerHTML = ''; // Očisti staro
    
    // Sortiramo riječi abecedno da mu je teže naći pravu
    const sortedWords = [...data.words].sort();

    sortedWords.forEach(word => {
        const span = document.createElement('span');
        span.className = 'word-token'; // Novi CSS class
        span.innerText = word;
        wordBank.appendChild(span);
    });

    // --- 2. UBACI INPUTE U TEKST ---
    let finalizedText = data.text;
    
    // Prolazimo kroz točne odgovore i mijenjamo [blank-X] u <input> polje
    data.correctAnswers.forEach((answer, index) => {
        // Svaki input dobiva ID tipa 'blank-input-0' i 'data-answer' koji sadrži točnu riječ
        const inputHTML = `<input type="text" class="story-input" id="blank-input-${index}" data-answer="${answer}" placeholder="?">`;
        finalizedText = finalizedText.replace(`[blank-${index}]`, inputHTML);
    });
    
    storyText.innerHTML = finalizedText;
}

// Ova funkcija provjerava odgovore prije nego pusti Jarlaitha dalje
function nextLesson() {
    const data = courseData[currentCategory];

    if (data.type === "fill-blanks") {
        const inputs = document.querySelectorAll('.story-input');
        let allCorrect = true;

        inputs.forEach(input => {
            const userAnswer = input.value.trim().toLowerCase();
            const correctAnswer = input.getAttribute('data-answer').toLowerCase();

            if (userAnswer === correctAnswer) {
                input.style.border = "2px solid #2ecc71"; // Zeleno ako je točno
                input.style.background = "#eafaf1";
            } else {
                input.style.border = "2px solid #e74c3c"; // Crveno ako je krivo
                input.style.background = "#fdedec";
                allCorrect = false;
            }
        });

        if (allCorrect) {
            completeMission();
        } else {
            alert("❌ Some words are missing or wrong! Check the red boxes.");
        }
        return;
    }

    // Standardna logika za obične fraze
    if (currentIndex < data.phrases.length - 1) {
        currentIndex++;
        localStorage.setItem(currentCategory + '_progress', currentIndex);
        updateUI();
    } else {
        completeMission();
    }
}

function completeMission() {
    if (!completedLessons.includes(currentCategory)) {
        completedLessons.push(currentCategory);
        localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
    }
    alert("🎉 Mission Accomplished!");
    window.location.href = 'lessons.html';
}

function updateXPUI() {
    const xpElement = document.getElementById('total-xp');
    if (xpElement) xpElement.innerText = userXP;
    // ... ostatak rank sistema ...
}

function renderQuizList() {
    const container = document.getElementById('quiz-list-container');
    if (!container) return;
    container.innerHTML = '';
    quizList.forEach(quiz => {
        const isLocked = completedLessons.length < quiz.requiredMissions;
        const box = document.createElement('div');
        box.className = `mission-item ${isLocked ? 'locked' : ''}`;
        box.innerHTML = `<div><b>${quiz.title}</b></div><div>${isLocked ? '🔒 Locked' : '🔥 Available'}</div>`;
        if(!isLocked) box.onclick = () => window.location.href = 'play-quiz.html';
        container.appendChild(box);
    });
}

function updateProgressSidebar() {
    const total = Object.keys(courseData).length;
    const done = completedLessons.length;
    const perc = Math.round((done / total) * 100);
    const bar = document.getElementById('main-progress-bar');
    if (bar) bar.style.width = perc + '%';
    const stats = document.getElementById('progress-stats');
    if (stats) stats.innerHTML = `<b>${perc}%</b><br><small>${done} of ${total} missions</small>`;
}

function speakCurrent() {
    const data = courseData[currentCategory];
    let text = "";
    if (data.type === "fill-blanks") {
        text = "Stuttgart ist die Stadt der Autos."; // Skraćeno za story
    } else {
        text = document.getElementById('german-text').innerText;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    window.speechSynthesis.speak(utterance);
}