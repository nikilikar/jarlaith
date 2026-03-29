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

    const keys = Object.entries(courseData);
    
    keys.forEach(([key, data], index) => {
        // 1. Crtamo običnu lekciju
        const isDone = completedLessons.includes(key);
        const missionBox = document.createElement('div');
        missionBox.className = `mission-item ${isDone ? 'completed' : ''}`;
        missionBox.id = `mission-${key}`;
        missionBox.onclick = () => startSpecificLesson(key);
        
        missionBox.innerHTML = `
            <div>
                <span style="font-size: 1.2rem; display: block; margin-bottom: 5px;">${data.title}</span>
                <span style="font-size: 0.8rem; color: #636e72;">${data.phrases.length} phrases to master</span>
            </div>
            <div class="status-tag">${isDone ? '✓ Done' : 'New'}</div>
        `;
        container.appendChild(missionBox);

        // 2. PROVJERA: Ubaci kviz TOČNO nakon 3. lekcije (index je 2 jer kreće od 0)
        if (index === 2 && completedLessons.length >= 3) {
            const quizBox = document.createElement('div');
            quizBox.className = 'mission-item quiz-unlock-special'; 
            quizBox.onclick = () => window.location.href = 'quizzes.html';
            quizBox.innerHTML = `
                <div>
                    <span style="font-size: 1.2rem; display: block; font-weight: bold;">🏆 Level 1: Final Test</span>
                    <span style="font-size: 0.8rem; color: #636e72;">Unlock your first 100 XP!</span>
                </div>
                <div class="status-tag" style="background: #fdcb6e; color: #d35400;">READY 🔥</div>
            `;
            container.appendChild(quizBox);
        }
    });

    // Automatski skrol na zadnju/novu misiju
    const firstNew = document.querySelector('.mission-item:not(.completed)');
    if (firstNew) {
        setTimeout(() => {
            firstNew.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
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
    
    // Izračun postotka
    const percentage = totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0;

    // 1. Ažuriraj širinu Progress Bara
    const progressBar = document.getElementById('main-progress-bar');
    if (progressBar) {
        progressBar.style.width = percentage + '%';
    }

    // 2. Ažuriraj tekst (sad piše postotak + broj misija)
    const statsText = document.getElementById('progress-stats');
    if (statsText) {
        statsText.innerHTML = `
            <span style="font-size: 1.5rem; font-weight: 900; color: #244b56;">${percentage}%</span><br>
            <small style="color: #636e72;">${completedMissions} of ${totalMissions} missions done</small>
        `;
    }
}

function speakCurrent() {
    const text = document.getElementById('german-text').innerText;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    window.speechSynthesis.speak(utterance);
}