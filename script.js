// Podaci za lekcije
const lessons = [
    { topic: "At the Bar", english: "I would like a beer, please.", german: "Ich hätte gerne ein Bier, bitte." },
    { topic: "Meeting People", english: "My name is Jarlaith.", german: "Mein Name ist Jarlaith." },
    { topic: "Erasmus Life", english: "Where is the library?", german: "Wo ist die Bibliothek?" },
    { topic: "Shopping", english: "How much does this cost?", german: "Wie viel kostet das?" }
];

let currentIndex = 0;

// Funkcija za promjenu lekcije
function nextLesson() {
    currentIndex = (currentIndex + 1) % lessons.length;
    
    document.getElementById('lesson-topic').innerText = "Topic: " + lessons[currentIndex].topic;
    document.getElementById('english-text').innerText = lessons[currentIndex].english;
    document.getElementById('german-text').innerText = lessons[currentIndex].german;
    document.getElementById('progress-text').innerText = `Lesson ${currentIndex + 1} of ${lessons.length}`;
}

// Funkcija za izgovor (za bilo koji tekst)
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE'; // Njemački glas
    utterance.rate = 0.9;     // Malo sporije da bolje razumije
    window.speechSynthesis.speak(utterance);
}

// Funkcija za izgovor trenutne lekcije
function speakCurrent() {
    const text = document.getElementById('german-text').innerText;
    speak(text);
}