let aboutSection=document.querySelector("#page-content")

aboutSection.innerHTML=`
<section class="about">

    <div class="container">

        <span class="badge">✨ About Toolsy</span>

        <h1>Simple File Tools.<br>Built for Everyone.</h1>

        <p class="lead">
            Toolsy is a collection of browser-based image and PDF utilities
            designed to make everyday file tasks fast, simple, and accessible.
        </p>

        <div class="cards">

            <div class="card reveal">
                <div class="icon">⚡</div>
                <h3>Fast</h3>
                <p>Most tools process files directly in your browser.</p>
            </div>

            <div class="card reveal">
                <div class="icon">🔒</div>
                <h3>Private</h3>
                <p>Files are processed locally in your browser.
No uploads, no backend.</p>
            </div>

            <div class="card reveal">
                <div class="icon">💻</div>
                <h3>Frontend Only</h3>
                <p>Built with HTML, CSS, JavaScript, PDF-LIB and PDF.js.</p>
            </div>

        </div>

    </div>

</section>
`;
// Initialize animations after inserting HTML

document.querySelectorAll(".reveal").forEach((el, index) => {

    setTimeout(() => {
        el.classList.add("active");
    }, index * 150);

});