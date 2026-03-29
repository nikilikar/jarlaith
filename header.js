document.addEventListener("DOMContentLoaded", function() {
    const headerHTML = `
    <header>
        <div class="logo">🇩🇪 Jarlaith's German Journey</div>
        <nav>
            <a href="index.html">Home</a>
            <a href="vocabulary.html">Vocabulary</a>
            <a href="lessons.html">Lessons</a>
        </nav>
    </header>
    `;
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
});