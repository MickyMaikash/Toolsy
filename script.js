let body=document.body;
let toolButtons=document.querySelectorAll(".tool button");

//hanlding button click events for all the tools
toolButtons.forEach(button=>{
   button.addEventListener("click",(e)=>{

    let title=e.target.parentElement.querySelector("h2").innerText;

    if(title==="Image Resizer"){
      window.location.href = "./tools/image_Resizer/imgResizer.html";
    }else if(title==="Image Converter"){
      console.log("Image Converter clicked");
    }else if(title==="Image Compressor"){
       console.log("Image Compressor clicked");
    }else if(title==="Merge PDF"){
        console.log("Merge PDF clicked");
    }else if(title==="Split PDF"){
      console.log("Split PDF clicked");
    }else if(title==="PDF Watermark"){
       console.log("PDF Watermark clicked");
    }

   })
})