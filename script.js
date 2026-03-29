const lessons = [
    { topic: "At the Bar", english: "I would like a beer, please.", german: "Ich hätte gerne ein Bier, bitte." },
    { topic: "Meeting People", english: "My name is Jarlaith.", german: "Mein Name ist Jarlaith." },
    { topic: "Erasmus Life", english: "Where is the library?", german: "Wo ist die Bibliothek?" },
    { topic: "Shopping", english: "How much does this cost?", german: "Wie viel kostet das?" }
];

// 1. Provjera progresa odmah pri učitavanju
document.addEventListener("DOMContentLoaded", () => {
    const savedProgress = localStorage.getItem('germanProgress');
    const actionBtn = document.getElementById('main-action-btn');

    if (savedProgress && savedProgress > 0) {
        // Ako se već vratio, promijeni tekst gumba
        actionBtn.innerText = "Continue Lesson " + (parseInt(savedProgress) + 1) + " →";
        // Postavi index na spremljeno mjesto
        currentIndex = parseInt(savedProgress);
    }

    if (savedProgress) {
    document.getElementById('main-action-btn').innerText = "Continue Learning →";
}
});

let currentIndex = 0;

function startLearning() {
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('lesson-screen').style.display = 'block';
    updateUI();
}

function goBackToWelcome() {
    document.getElementById('welcome-screen').style.display = 'block';
    document.getElementById('lesson-screen').style.display = 'none';
}

function nextLesson() {
    currentIndex = (currentIndex + 1) % lessons.length;
    // SPREMI PROGRES u LocalStorage
    localStorage.setItem('germanProgress', currentIndex);
    updateUI();
}

function updateUI() {
    document.getElementById('lesson-topic').innerText = "Topic: " + lessons[currentIndex].topic;
    document.getElementById('english-text').innerText = lessons[currentIndex].english;
    document.getElementById('german-text').innerText = lessons[currentIndex].german;
    document.getElementById('progress-text').innerText = `Phrase ${currentIndex + 1} of ${lessons.length}`;
}

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
}

function speakCurrent() {
    const text = document.getElementById('german-text').innerText;
    speak(text);
}
function scrollToLessons() {
    document.getElementById('welcome-hero').style.display = 'none';
    document.getElementById('lesson-section').style.display = 'flex';
    
    updateUI();
    
    window.scrollTo(0, 0);
}