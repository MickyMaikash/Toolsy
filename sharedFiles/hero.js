let hero=document.querySelector(".hero");
let title=hero.dataset.title;
let description=hero.dataset.description;

hero.innerHTML=`
 <div class="mainTitle">${title}</div>
        <div class="description">${description}</div>

`