let darkModeToggle=document.getElementById("darkModeToggle");



//as ui opens check if dark mode is enabled or not then set the theme accordingly
if(localStorage.getItem("darkMode") === "enabled"){
    document.body.classList.add("dark");
}

//on click listen for the dark mode toggle button and switch the theme accordingly
darkModeToggle.addEventListener("click",()=>{
    if(document.body.classList.contains("dark")){
        document.body.classList.remove("dark");
        localStorage.setItem("darkMode","disabled");
    } else {
        document.body.classList.add("dark");
        localStorage.setItem("darkMode","enabled");
    }
});
