document.addEventListener("DOMContentLoaded", function() {
    const headerHTML = `
    <header>
        <div class="logo">🇩🇪 JARLAITH'S GERMAN JOURNEY</div>
        
        <div class="menu-toggle" id="mobile-menu">
            <span></span>
            <span></span>
            <span></span>
        </div>

        <nav id="nav-menu">
            <a href="index.html">HOME</a>
            <a href="vocabulary.html">VOCABULARY</a>
            <a href="lessons.html">LESSONS</a>
            <a href="quizzes.html">QUIZZES</a>
        </nav>
    </header>
    <div class="menu-overlay" id="overlay"></div>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    // Logika za otvaranje/zatvaranje
    const menuBtn = document.getElementById('mobile-menu');
    const nav = document.getElementById('nav-menu');
    const overlay = document.getElementById('overlay');

    menuBtn.addEventListener('click', function() {
        nav.classList.toggle('active');
        menuBtn.classList.toggle('is-active');
        overlay.classList.toggle('active');
    });

    // Zatvori meni ako se klikne sa strane
    overlay.addEventListener('click', function() {
        nav.classList.remove('active');
        menuBtn.classList.remove('is-active');
        overlay.classList.remove('active');
    });
});