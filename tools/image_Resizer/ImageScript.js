let UploadSection=document.querySelector(".UploadSection")
let imageInput=document.getElementById('ImageInput')
let previewImg=document.querySelector('.previewImae');
let changeImgBtn=document.querySelector('.ChangeImage');
let name=document.querySelector('.name');
let Imgtype=document.querySelector('.type');
let Imgsize=document.querySelector('.size');
let Imgdimension=document.querySelector('.dimension');
let resizeBtn=document.querySelector('#ResizeBtn')
let downloadBtn=document.querySelector('#DownloadBtn')
let mainLayout=document.querySelector('main')
let lastdownSection=document.querySelector('.lastSection')
let progressscren=document.querySelector('.progressScreen')

let uploadedImage;
let canvas;
let finalResizedImg;
let fileType;
UploadSection.addEventListener('click',()=>{
    imageInput.click();
});
changeImgBtn.addEventListener('click',()=>{
   imageInput.click();
})

imageInput.addEventListener('change',()=>{
    let data=imageInput.files[0];
    if (!data) return;

    uploadedImage=data;
        if(uploadedImage.size<=0){
        alert("choose a different image it has 0 size")
        return
    }
    mainLayout.classList.remove('hidden');
    UploadSection.classList.add('hidden');
    fileType=uploadedImage.type;
    name.innerHTML=`Name: ${uploadedImage.name}`;
    Imgtype.innerHTML=`Type: ${uploadedImage.type}`;
    Imgsize.innerHTML=`Size: ${uploadedImage.size}`;

    previewImg.onload=()=>{
        let width=previewImg.naturalWidth;
        let imgHeight=previewImg.naturalHeight;
        
        Imgdimension.innerHTML=`Dimension: ${width} x ${imgHeight}`;
        
    }

    previewImg.src=URL.createObjectURL(uploadedImage);

});



function resizeImg(){
let width=document.getElementById("widhtInput").value;
let height=document.getElementById("HeightInput").value;

if(!width || !height){
    alert("please enter widht and height properly in px")
return;
}
resizeBtn.classList.add("hidden")
progressscren.classList.remove("hidden")
canvas=document.createElement('canvas');
let ctx=canvas.getContext('2d');

//create empty canvas with width and height
canvas.width=width;
canvas.height=height;

//we are drawing on the canvas 
ctx.drawImage(
    previewImg,0,0,width,height
)

//now the image drawn we are storing as a url
finalResizedImg=canvas.toDataURL(fileType)
  progressscren.classList.add('hidden');
    lastdownSection.classList.remove('hidden')
};

resizeBtn.addEventListener('click',()=>{
    
    resizeImg();
  

    
})

downloadBtn.addEventListener('click',()=>{
    let link=document.createElement('a');
    let ext=uploadedImage.name.split('.').pop();
    link.download=`resized_img.${ext}`;
    link.href=finalResizedImg;
    link.click();
})




