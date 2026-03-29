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

let currentCategory = localStorage.getItem('currentLessonKey') || "basic-survival";
let currentIndex = parseInt(localStorage.getItem(currentCategory + '_progress')) || 0;
let completedLessons = JSON.parse(localStorage.getItem('completedLessons')) || [];

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('dashboard-container')) {
        renderDashboard();
    }
    
    const actionBtn = document.getElementById('main-action-btn');
    if (actionBtn && localStorage.getItem('any_progress_made')) {
        actionBtn.innerText = "Continue Learning →";
    }

    if (document.getElementById('english-text')) {
        updateUI();
    }
});

function renderDashboard() {
    const container = document.getElementById('dashboard-container');
    if (!container) return;
    
    container.innerHTML = ''; 

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
    updateProgressSidebar();
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

function startSpecificLesson(key) {
    localStorage.setItem('currentLessonKey', key);
    localStorage.setItem('any_progress_made', 'true');
    localStorage.setItem(key + '_progress', 0); 
    
    // OVDJE JE PROMJENA: Šaljemo ga na training.html, ne na lessons.html
    window.location.href = 'training.html'; 
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
        alert("🎉 Mission Accomplished! Check your progress on the dashboard.");
        window.location.href = 'lessons.html'; // Vraća ga na listu (dashboard)
    }
}

function updateUI() {
    const data = courseData[currentCategory];
    const phrase = data.phrases[currentIndex];
    if (document.getElementById('lesson-topic')) {
        document.getElementById('lesson-topic').innerText = data.title;
        document.getElementById('english-text').innerText = phrase.english;
        document.getElementById('german-text').innerText = phrase.german;
        document.getElementById('progress-text').innerText = `Phrase ${currentIndex + 1} of ${data.phrases.length}`;
    }
}

function speakCurrent() {
    const text = document.getElementById('german-text').innerText;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    window.speechSynthesis.speak(utterance);
}