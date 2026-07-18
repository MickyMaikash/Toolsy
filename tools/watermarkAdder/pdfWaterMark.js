let UploadSection=document.querySelector(".UploadSection")
let fileInput=document.getElementById('ImageInput')
let textInput =document.querySelector('#sizeInput')
let ImageExtChangeBtn=document.querySelector('#ImageExtCHangeBtn')
let downloadBtn=document.querySelector('#DownloadBtn')
let mainLayout=document.querySelector('main')
let lastdownSection=document.querySelector('.lastSection')
let progressscren=document.querySelector('.progressScreen')
let name=document.querySelector('.name');
let Imgtype=document.querySelector('.type');
let Imgsize=document.querySelector('.size');

let uploadpdfBuffer;
let canvas;
let downlaodUrl;
let imageMimeType;


UploadSection.addEventListener('click',()=>{
    fileInput.click();
})


fileInput.addEventListener('change',async()=>{
    let data=fileInput.files[0];
    if (!data) return;

    
    if(data.size<=10*1024){
        alert("Please Enter Valid Image")
        return;
    }
    const pdfBytes = await data.arrayBuffer();
    if(pdfBytes.byteLength<=0){
        alert(`File ${data.name} has size 0 bytes plesae upload`)
        return
    }
    uploadpdfBuffer=pdfBytes;
    imageMimeType=data.type;
    console.log(`Uploaded pdf has type ${imageMimeType}`)

    name.innerHTML=`Name: ${data.name}`;
    Imgtype.innerHTML=`Type: ${data.type}`;
    Imgsize.innerHTML=`Size: ${(data.size / 1024).toFixed(2)} kb`;
    mainLayout.classList.remove('hidden')
    lastdownSection.classList.add('hidden')
    ImageExtChangeBtn.classList.remove('hidden')
   

mainLayout.scrollIntoView({
    behavior: "smooth",
    block: "center"
});

})

ImageExtChangeBtn.addEventListener("click",()=>{
    addWatermark(uploadpdfBuffer)
})


async function addWatermark(pdfBuffer) {
    progressscren.classList.remove("hidden")
  let watermarkTxt=textInput.value.trim();
    if(watermarkTxt=="" ){
        alert("Please Enter Watermark Text")
        return;
    }
  
   console.log("4. PDF loaded");
    // Load PDF from buffer
    const pdfDoc = await PDFLib.PDFDocument.load(pdfBuffer);
   console.log("5. PDF loaded");
    const pages = pdfDoc.getPages();

  const font = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);

pages.forEach((page) => {
    const { width, height } = page.getSize();

    const fontSize = Math.min(width, height) / 8;

    const textWidth = font.widthOfTextAtSize(watermarkTxt, fontSize);

    page.drawText(watermarkTxt, {
        x: (width - textWidth) / 2,
        y: height / 2,
        size: fontSize,
        font,
        color: PDFLib.rgb(0.7, 0.7, 0.7), // Light gray
        opacity: 0.2,
        rotate: PDFLib.degrees(45),
    });
});
    // Return modified PDF as Uint8Array
    const watermarkedPdf = await pdfDoc.save();

    const blob=new Blob([watermarkedPdf],{type:"application/pdf"})
    downlaodUrl=URL.createObjectURL(blob)
    progressscren.classList.add("hidden")
    lastdownSection.classList.remove('hidden')
    ImageExtChangeBtn.classList.add('hidden')
}




downloadBtn.addEventListener('click',()=>{
    let link=document.createElement('a');
    link.download=`pdfwithwatermark.pdf`;
    link.href=downlaodUrl;
    link.click();
})