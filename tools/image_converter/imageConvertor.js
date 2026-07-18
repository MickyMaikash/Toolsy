let UploadSection=document.querySelector(".UploadSection")
let imageInput=document.getElementById('ImageInput')
let previewImg=document.querySelector('.previewImae');
let changeImgBtn=document.querySelector('.ChangeImage');
let ImageExtChangeBtn=document.querySelector('#ImageExtCHangeBtn')
let downloadBtn=document.querySelector('#DownloadBtn')
let mainLayout=document.querySelector('main')
let lastdownSection=document.querySelector('.lastSection')
let progressscren=document.querySelector('.progressScreen')
let imageConvertorOptions=document.querySelectorAll('.imageConvertorOptions button')

let uploadedImage;
let canvas;
let finalConvertImage;
let initalFileType;
let finalFileTeyp;

imageConvertorOptions.forEach((e)=>{
    e.addEventListener('click',()=>{
        console.log(e.dataset.initialtype);
        initalFileType=e.dataset.initialtype;
        finalFileTeyp=e.dataset.finaltype;

        mainLayout.classList.add('hidden');

        UploadSection.classList.remove('hidden');
        UploadSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
    })
})

UploadSection.addEventListener('click',()=>{
    imageInput.click();
});
changeImgBtn.addEventListener('click',()=>{
   imageInput.click();
    lastdownSection.classList.add('hidden')
    ImageExtChangeBtn.classList.remove("hidden")
})

imageInput.addEventListener('change',()=>{
    let data=imageInput.files[0];
    if (!data) return;

    uploadedImage=data;
    if(uploadedImage.size<=0){
        alert("choose a different image it has 0 size")
        return
    }else if(uploadedImage.type.split("/")[1]!=initalFileType){
        console.log(`${uploadedImage.type} and ${initalFileType}`)
        alert( `Choose a different ${initalFileType} image`)
        return;
    }
    mainLayout.classList.remove('hidden');
    if(finalFileTeyp=="jpeg"){
        ImageExtChangeBtn.innerHTML=  `Covert to jpg`
    }else{
 ImageExtChangeBtn.innerHTML=  `Covert to ${finalFileTeyp}`
    }
   
    UploadSection.classList.add('hidden');
    
    previewImg.onload=()=>{
        let width=previewImg.naturalWidth;
        let imgHeight=previewImg.naturalHeight;
        console.log(`width and height are ${width} and ${imgHeight}`)
    }

    previewImg.src=URL.createObjectURL(uploadedImage);

});

function imageCoverter(){
    canvas=document.createElement('canvas');
    let ctx=canvas.getContext('2d');

    let width=previewImg.naturalWidth;
    let imgHeight=previewImg.naturalHeight;

    ImageExtChangeBtn.classList.add("hidden")
    progressscren.classList.remove("hidden")


    canvas.width=width;
    canvas.height=imgHeight;

    ctx.drawImage(previewImg,0,0,width,imgHeight);


     
    if (finalFileType === "jpg" || finalFileType === "jpeg") {

        finalConvertImage = canvas.toDataURL(
            "image/jpeg",
            0.9
        );

    } else{
         finalConvertImage = canvas.toDataURL(
                `image/${finalFileTeyp}`
        );
    }
    

    progressscren.classList.add('hidden');
    lastdownSection.classList.remove('hidden');

    
}

ImageExtChangeBtn.addEventListener('click',()=>{
    if(finalFileTeyp=="svg"){
        convertToSVG()
    }else{
        imageCoverter()
    }

    
})


function convertToSVG() {

    ImageExtChangeBtn.classList.add("hidden");
    progressscren.classList.remove("hidden");


    ImageTracer.imageToSVG(
        previewImg.src,
        function(svgString) {

            // Create SVG file blob
            const svgBlob = new Blob(
                [svgString],
                { type: "image/svg+xml" }
            );

            // Create download URL
            finalConvertImage = URL.createObjectURL(svgBlob);

            console.log(finalConvertImage);

            progressscren.classList.add("hidden");
            lastdownSection.classList.remove("hidden");

        },
        {
            numberofcolors: 16,
            ltres: 1,
            qtres: 1,
            pathomit: 8
        }
    );
}

/*
 async function iCoCreator(){
    const sizes = [
    16,
    32,
    48,
    64,
    128,
    256
  ];

  //it is an empty array which would be used to store the more pngs of differnts size with it's buffer/data
  const images=[];

  for (const size of sizes){
    canvas=document.createElement('canvas')
    const ctx=canvas.getContext('2d')

    canvas.width=size;
    canvas.height=size;


    const padding = size * 0.1; // 10% padding

    const availableSize = size - (padding * 2);


    const scale = Math.min(
        availableSize / previewImg.naturalWidth,
        availableSize / previewImg.naturalHeight
    );


    const width = previewImg.naturalWidth * scale;
    const height = previewImg.naturalHeight * scale;


    const x = (size - width) / 2;
    const y = (size - height) / 2;



    ctx.drawImage(previewImg,x,y,width,height)

    const pngBlob=await new Promise(resolve=>{
    canvas.toBlob(
      resolve,
      "image/png"
    );
    }) 
  
    const buffer= await pngBlob.arrayBuffer();

    images.push({
        size:size,
        data:new Uint8Array(buffer)
    })


  }


  const icon=createICO(images)

  finalConvertImage=URL.createObjectURL(icon)

    progressscren.classList.add('hidden');
    lastdownSection.classList.remove('hidden');

}


function createICO(images) {

    //confused little but it works 
  const imageCount = images.length;

  const headerSize = 6;
  const entrySize = 16;

  let offset = headerSize + (entrySize * imageCount);


  const entries = [];
  const imageBuffers = [];


  for (const image of images) {

    const entry = new Uint8Array(16);


    // Width
    entry[0] = image.size === 256 ? 0 : image.size;

    // Height
    entry[1] = image.size === 256 ? 0 : image.size;


    // Color palette (0 means no palette)
    entry[2] = 0;

    // Reserved
    entry[3] = 0;


    // Color planes
    entry[4] = 1;
    entry[5] = 0;


    // Bits per pixel
    entry[6] = 32;
    entry[7] = 0;


    const dataLength = image.data.length;


    // Image size (4 bytes)
    entry[8]  = dataLength & 255;
    entry[9]  = (dataLength >> 8) & 255;
    entry[10] = (dataLength >> 16) & 255;
    entry[11] = (dataLength >> 24) & 255;


    // Image offset (4 bytes)
    entry[12] = offset & 255;
    entry[13] = (offset >> 8) & 255;
    entry[14] = (offset >> 16) & 255;
    entry[15] = (offset >> 24) & 255;


    entries.push(entry);


    imageBuffers.push(image.data);


    offset += dataLength;
  }



  // ICO header
  const header = new Uint8Array(6);


  // Reserved
  header[0] = 0;
  header[1] = 0;


  // Type = ICO
  header[2] = 1;
  header[3] = 0;


  // Number of images
  header[4] = imageCount;
  header[5] = 0;



  // Combine everything into one file
  const icoBlob = new Blob(
    [
      header,
      ...entries,
      ...imageBuffers
    ],
    {
      type: "image/x-icon"
    }
  );


  return icoBlob;
}

*/




downloadBtn.addEventListener('click',()=>{
    let link=document.createElement('a');
    let ext=uploadedImage.name.split('.').pop();
    if(finalFileTeyp=="jpeg"){
    link.download=`imageIN${finalFileTeyp}.jpg`;
    }else{
            link.download=`imageIN${finalFileTeyp}.${finalFileTeyp}`;
    }

    link.href=finalConvertImage;
    link.click();
})




