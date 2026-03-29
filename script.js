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
    }
};

// Globalne varijable
let currentCategory = localStorage.getItem('currentLessonKey') || "basic-survival";
let currentIndex = parseInt(localStorage.getItem(currentCategory + '_progress')) || 0;
let completedLessons = JSON.parse(localStorage.getItem('completedLessons')) || [];
let userXP = parseInt(localStorage.getItem('userXP')) || 0;

const quizList = [
    { id: "quiz-1", title: "Survival Basics Test", requiredMissions: 1, xpReward: 100 },
    { id: "quiz-2", title: "The Latina Masterclass", requiredMissions: 2, xpReward: 150 },
    { id: "quiz-3", title: "Party Animal Pro", requiredMissions: 3, xpReward: 200 }
];

// --- JEDINSTVENI DOM CONTENT LOADED ---
document.addEventListener("DOMContentLoaded", () => {
    // 1. Inicijalizacija Dashboarda
    if (document.getElementById('dashboard-container')) {
        renderDashboard();
    }
    
    // 2. Inicijalizacija UI-a za učenje (training.html)
    if (document.getElementById('english-text')) {
        updateUI();
    }

    // 3. Inicijalizacija liste kvizova (quizzes.html)
    if (document.getElementById('quiz-list-container')) {
        renderQuizList();
    }

    // 4. Ažuriranje XP-a svugdje gdje postoji element
    updateXPUI();

    // 5. PAMETNI HOME GUMB (Continue Learning)
    const actionBtn = document.getElementById('main-action-btn');
    if (actionBtn) {
        if (completedLessons.length > 0 || localStorage.getItem('any_progress_made')) {
            actionBtn.innerText = "Continue Learning →";
            
            // Logika: Nađi prvu lekciju koja NIJE gotova
            const allLessonKeys = Object.keys(courseData);
            const nextLessonKey = allLessonKeys.find(key => !completedLessons.includes(key));

            if (nextLessonKey) {
                // Ako postoji iduća lekcija, gumb šalje na nju
                actionBtn.onclick = () => {
                    localStorage.setItem('currentLessonKey', nextLessonKey);
                    window.location.href = 'training.html';
                };
            } else {
                // Ako su sve gotove, šalji na dashboard
                actionBtn.innerText = "Review Progress →";
                actionBtn.onclick = () => window.location.href = 'lessons.html';
            }
        } else {
            // Početnik
            actionBtn.onclick = () => window.location.href = 'lessons.html';
        }
    }
});

// --- FUNKCIJE ZA DASHBOARD ---
function renderDashboard() {
    const container = document.getElementById('dashboard-container');
    if (!container) return;
    
    container.innerHTML = ''; 
    completedLessons = JSON.parse(localStorage.getItem('completedLessons')) || [];

    for (const [key, data] of Object.entries(courseData)) {
        const isDone = completedLessons.includes(key);
        const missionBox = document.createElement('div');
        missionBox.className = `mission-item ${isDone ? 'completed' : ''}`;
        missionBox.onclick = () => startSpecificLesson(key);
        
        missionBox.innerHTML = `
            <div>
                <span style="font-size: 1.2rem; display: block; margin-bottom: 5px;">${data.title}</span>
                <span style="font-size: 0.8rem; color: #636e72;">${data.phrases.length} phrases to master</span>
            </div>
            <div class="status-tag">${isDone ? '✓ Done' : 'New'}</div>
        `;
        container.appendChild(missionBox);
    }

    // Ako je riješio sve 3, pokaži Final Quiz gumb na dnu dashboarda
    if (completedLessons.length >= 3) {
        const quizBox = document.createElement('div');
        quizBox.className = 'mission-item quiz-unlock-special'; 
        quizBox.onclick = () => window.location.href = 'quizzes.html';
        quizBox.innerHTML = `
            <div>
                <span style="font-size: 1.2rem; display: block; font-weight: bold;">🏆 Final Level 1 Quiz</span>
                <span style="font-size: 0.8rem; color: #636e72;">Prove your German skills!</span>
            </div>
            <div class="status-tag" style="background: #fdcb6e; color: #d35400;">READY 🔥</div>
        `;
        container.appendChild(quizBox);
    }
    updateProgressSidebar();
}

// --- FUNKCIJE ZA LEKCIJE ---
function startSpecificLesson(key) {
    localStorage.setItem('currentLessonKey', key);
    localStorage.setItem('any_progress_made', 'true');
    // Ne resetiramo progres ako je već započeo, osim ako želimo ispočetka
    window.location.href = 'training.html'; 
}

function updateUI() {
    const data = courseData[currentCategory];
    const phrase = data.phrases[currentIndex];
    if (document.getElementById('english-text')) {
        document.getElementById('lesson-topic').innerText = data.title;
        document.getElementById('english-text').innerText = phrase.english;
        document.getElementById('german-text').innerText = phrase.german;
        document.getElementById('progress-text').innerText = `Phrase ${currentIndex + 1} of ${data.phrases.length}`;
    }
}

function nextLesson() {
    const phrases = courseData[currentCategory].phrases;
    if (currentIndex < phrases.length - 1) {
        currentIndex++;
        localStorage.setItem(currentCategory + '_progress', currentIndex);
        updateUI();
    } else {
        if (!completedLessons.includes(currentCategory)) {
            completedLessons.push(currentCategory);
            localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
        }
        alert("🎉 Mission Accomplished!");
        window.location.href = 'lessons.html';
    }
}

// --- XP I RANK SUSTAV ---
function updateXPUI() {
    const xpElement = document.getElementById('total-xp');
    const xpBar = document.getElementById('xp-bar');
    const rankText = document.getElementById('rank-text');

    userXP = parseInt(localStorage.getItem('userXP')) || 0;

    if (xpElement) {
        xpElement.innerText = userXP;
        let progress = (userXP / 1000) * 100;
        if (xpBar) xpBar.style.width = Math.min(progress, 100) + "%";

        // Rank sistem koji si tražila
        if (rankText) {
            if (userXP >= 500) rankText.innerText = "German Husband Material 💍";
            else if (userXP >= 300) rankText.innerText = "German Local 🍺";
            else if (userXP >= 100) rankText.innerText = "Erasmus Legend 🇪🇺";
            else rankText.innerText = "Beginner Traveler 🥨";
        }
    }
}

// --- FUNKCIJE ZA KVIZOVE ---
function renderQuizList() {
    const container = document.getElementById('quiz-list-container');
    if (!container) return;

    container.innerHTML = '';
    const completedCount = completedLessons.length;

    quizList.forEach(quiz => {
        const isLocked = completedCount < quiz.requiredMissions;
        const quizBox = document.createElement('div');
        quizBox.className = `mission-item ${isLocked ? 'completed' : ''}`;
        
        quizBox.innerHTML = `
            <div>
                <span style="font-size: 1.2rem; display: block; font-weight: bold;">${quiz.title}</span>
                <span style="font-size: 0.8rem; color: #636e72;">Reward: ${quiz.xpReward} XP</span>
            </div>
            <div class="status-tag">${isLocked ? '🔒 Locked' : '🔥 Available'}</div>
        `;

        if (!isLocked) {
            quizBox.onclick = () => {
                localStorage.setItem('activeQuizId', quiz.id);
                window.location.href = 'play-quiz.html';
            };
        }
        container.appendChild(quizBox);
    });
}

function updateProgressSidebar() {
    const totalMissions = Object.keys(courseData).length;
    const completedMissions = completedLessons.length;
    const percentage = (completedMissions / totalMissions) * 100;

    const progressBar = document.getElementById('main-progress-bar');
    if (progressBar) progressBar.style.width = percentage + '%';

    const statsText = document.getElementById('progress-stats');
    if (statsText) statsText.innerText = `${completedMissions}/${totalMissions} Missions Completed`;
}

function speakCurrent() {
    const text = document.getElementById('german-text').innerText;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    window.speechSynthesis.speak(utterance);
}