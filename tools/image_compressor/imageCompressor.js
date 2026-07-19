let UploadSection=document.querySelector(".UploadSection")
let imageInput=document.getElementById('ImageInput')
let previewImg=document.querySelector('.previewImae');
let sizeInput =document.querySelector('#sizeInput')
let changeImgBtn=document.querySelector('.ChangeImage');
let ImageExtChangeBtn=document.querySelector('#ImageExtCHangeBtn')
let downloadBtn=document.querySelector('#DownloadBtn')
let mainLayout=document.querySelector('main')
let lastdownSection=document.querySelector('.lastSection')
let progressscren=document.querySelector('.progressScreen')
let beforAfterPreview=document.querySelector(".beforAfterPreview")
let beforCompression=document.querySelector("#beforCompression")
let afterCompression=document.querySelector("#afterCompression")
let name=document.querySelector('.name');
let Imgtype=document.querySelector('.type');
let Imgsize=document.querySelector('.size');

let UploadedImage;
let canvas;
let compressedFile;
let imageMimeType;

beforCompression.addEventListener('click',()=>{
    previewImg.src=URL.createObjectURL(UploadedImage)
})

afterCompression.addEventListener('click',()=>{
    previewImg.src=compressedFile
})

UploadSection.addEventListener('click',()=>{
    imageInput.click();
})

changeImgBtn.addEventListener('click',()=>{
    imageInput.click();
})

imageInput.addEventListener('change',()=>{
    let data=imageInput.files[0];
    if (!data) return;

    UploadedImage=data;
    if(data.size<=10*1024){
        alert("Please Enter Valid Image")
        return;
    }
    imageMimeType=data.type;
    console.log(`Uploaded image has type ${imageMimeType}`)
    if(data.type=="image/jpeg" || data.type=="image/webp" ||data.type=="image/png"){
        console.log('Compression Possible')
    }else{ 
        return;
    }

    
    name.innerHTML=`Name: ${UploadedImage.name}`;
    Imgtype.innerHTML=`Type: ${UploadedImage.type}`;
    Imgsize.innerHTML=`Size: ${(UploadedImage.size / 1024).toFixed(2)} kb`;
    UploadSection.classList.add('hidden')
    mainLayout.classList.remove('hidden')
    lastdownSection.classList.add('hidden')
    ImageExtChangeBtn.classList.remove('hidden')
    previewImg.onload=()=>{
        console.log('image Loaded Successfully')
    }


    previewImg.src=URL.createObjectURL(UploadedImage);

})

ImageExtChangeBtn.addEventListener('click',()=>{
    compressImage();
})



async function compressImage(){
   let target=document.getElementById("sizeInput").value;
    
    if(target<=0){
        alert("Please Enter size ")
        return
    }
    
    ImageExtChangeBtn.classList.add("hidden")
    progressscren.classList.remove("hidden")
    //we will use binary search
    let low=0.1;
    let high=1.0;
    let BestBlob=null;
    while(high-low>0.01){
        const quality=(low+high)/2;

        const blob= await createblob(quality);

        console.log(
    "quality:",
    quality,
    "size:",
    (blob.size / 1024).toFixed(2),
    "KB"
);
        
        if((blob.size/1024)>target){
            high=quality;
        }else{
            low=quality;
            BestBlob=blob;
        }
        console.log(`current blob size is ${blob.size}`)
    }

    if(BestBlob!=null && BestBlob.size>0){
        compressedFile=URL.createObjectURL(BestBlob);
      progressscren.classList.add('hidden');
        lastdownSection.classList.remove('hidden');
        beforAfterPreview.classList.remove('hidden')
    }else{
        alert("Not able to compress your image to your required size and please enter more size")
        ImageExtChangeBtn.classList.remove('hidden') 
        progressscren.classList.add('hidden');
        lastdownSection.classList.add('hidden');
        beforAfterPreview.classList.add('hidden')
        console.log("not able to convert it ")
    }
    
    
}

const createblob=async(quality)=>{
    canvas=document.createElement('canvas')
    let ctx=canvas.getContext('2d')

    canvas.width=previewImg.naturalWidth;
    canvas.height=previewImg.naturalHeight;

    ctx.drawImage(previewImg,0,0)
let blob;
    if(imageMimeType=="image/png"){
     blob=await new Promise(resolve=>{
    canvas.toBlob(
      resolve,
      "image/jpeg",
      quality
    );
    }) 
    }else{
        blob=await new Promise(resolve=>{
    canvas.toBlob(
      resolve,
      imageMimeType,
      quality
    );
    }) 
    }
    
    return blob;
}

downloadBtn.addEventListener('click',()=>{
    let link=document.createElement('a');
    link.download=`${UploadedImage.name}`;
    link.href=compressedFile;
    link.click();
})