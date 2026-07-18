let navBar=document.querySelector("header");
navBar.innerHTML=` <h1>Toolsy</h1>
        <nav>
            <a id="darkModeToggle" href="#">🌙 / ☀️</a>
            <a id="toolsLink" href="#">Tools</a>
            <a id="about" href="#">About</a>  
            <a href="#" target="_blank">GitHub</a>
        </nav>`


let about=document.querySelector("#about")
    about.addEventListener('click',()=>{
        document.querySelector("#page-content").classList.remove("hidden")
        document.querySelector("#page-content").scrollIntoView({
            behavior: "smooth"
        });
        
        })