const lessons = [
    { topic: "Meeting People", german: "Guten Tag!", croatian: "Dobar dan!" },
    { topic: "Erasmus Life", german: "Ich bin Erasmus-Student.", croatian: "Ja sam Erasmus student." },
    { topic: "Party time", german: "Wo ist die nächste Party?", croatian: "Gdje je idući party?" }
];

let current = 0;

function nextLesson() {
    current = (current + 1) % lessons.length;
    document.getElementById('topic').innerText = "Topic: " + lessons[current].topic;
    document.getElementById('german-text').innerText = lessons[current].german;
    document.getElementById('translation').innerText = lessons[current].croatian;
}

function speak() {
    const text = document.getElementById('german-text').innerText;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE'; // Postavlja na njemački izgovor
    window.speechSynthesis.speak(utterance);
}