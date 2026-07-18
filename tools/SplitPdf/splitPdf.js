let uploadSection=document.querySelector('.uploadSection')
let PdfInput=document.querySelector('#PdfInput')
let splitButton=document.querySelector("#SplitBTN")
let progressUi=document.querySelector('.splitProgress')
let downloadBtn=document.querySelector('#downloadBtn')
let guide=document.querySelector('.guide')
let splitModal =document.querySelector(".splitModal")
let pagesGrid=document.querySelector(".pagesGrid")
let closeBtn=document.querySelector(".closeBtn")
let selectImages=document.querySelector("#selectImages")
const loader = document.querySelector("#loader");


let pdfFile=null
let downloadUrl=null
let canvas;

if(localStorage.getItem("SplitPdfVisit")=="YES"){
    guide.remove()
}else{
    guide.classList.add("show")
console.log(document.querySelector(".closeGuide"));
    document.querySelector(".closeGuide").addEventListener('click',()=>{
        console.log("clicked")
        guide.remove()
        localStorage.setItem("SplitPdfVisit","YES")
    })
}

uploadSection.addEventListener('click',()=>{
    PdfInput.click()
})

PdfInput.addEventListener('change',async()=>{
    let data=PdfInput.files[0];
    if (!data) return;

     showLoader();

    splitButton.classList.remove('hidden')
    const buffer = await data.arrayBuffer();

    const pdfDoc = await PDFLib.PDFDocument.load(buffer);
// PDF.js (displaying pages)
const pdfJsDoc = await pdfjsLib.getDocument({
    data: buffer
}).promise;

    pdfFile = {
        name: data.name,
        size:buffer.byteLength,
        data: buffer,
        pdfDoc: pdfDoc,
        pdfJsDoc:pdfJsDoc,
        pages: pdfDoc.getPageCount(),
        selectedPages: []
    };

    try {
        await loadPagesInUi();
    } finally {
        hideLoader();
    }

})

splitButton.addEventListener('click',()=>{
    splitPdf()
})

downloadBtn.addEventListener('click',()=>{
    downloadPdf()
})

selectImages.addEventListener('click',()=>{
    splitModal.classList.remove('hidden')
})
closeBtn.addEventListener("click",()=>{
    splitModal.classList.add('hidden')
    selectImages.classList.remove("hidden")
})



async function loadPagesInUi(){
 
    pagesGrid.innerHTML=""

    for (let i=0;i<pdfFile.pages;i++){
             
        //get that page
        const page = await pdfFile.pdfJsDoc.getPage(i + 1);

        //get the viewport for width and height of canvas
        const viewport = page.getViewport({
            scale: 0.3
        });

        canvas=document.createElement('canvas')
        let ctx=canvas.getContext('2d')

        canvas.width=viewport.width;
        canvas.height=viewport.height;

       await page.render({

            canvasContext: ctx,
            viewport: viewport

        }).promise;

        const pagecard=document.createElement('div')
        pagecard.className = "pageCard";

        pagecard.dataset.index=i

        const number=document.createElement('p')
        number.innerText=   `${i+1}`
        number.className = "pageNumber";

        pagecard.append(canvas,number)
        pagesGrid.appendChild(pagecard)

        pagecard.addEventListener('click',()=>{
            let index=Number(pagecard.dataset.index)
            if(pdfFile.selectedPages.includes(index)){
                console.log("value already exists")
                pdfFile.selectedPages=pdfFile.selectedPages.filter(n=>n!=index)
                pagecard.classList.remove('selected')
            }else{
                pdfFile.selectedPages.push(index)
                pagecard.classList.add('selected')
                }
        })
    }
   splitModal.classList.remove('hidden')

}


async function splitPdf(){
    if(!pdfFile) return;

    if(pdfFile.selectedPages.length==0){
        alert("please Selct atleast one page")
        return
    }
    const pdfObj =await  PDFLib.PDFDocument.create();


        //copy the pages in the format as it belongs to pdfObj
    const pages=await pdfObj.copyPages(pdfFile.pdfDoc,pdfFile.selectedPages)

        //add the pages select  format into pdfObj
    pages.forEach(page => {
            pdfObj.addPage(page)
        });

    const splitpdfByte=await pdfObj.save()

    const blob=new Blob([ splitpdfByte],{"type":"application/pdf"})

    downloadUrl=URL.createObjectURL(blob)
    splitButton.classList.add('hidden')
    progressUi.classList.add('hidden')
    downloadBtn.classList.remove('hidden')
    alert("Pdf Splitted Successfully")
}


const downloadPdf=()=>{
    let link =document.createElement('a')
    
    link.href=downloadUrl
    link.download="mergedPdf.pdf"

    link.click()
}

function showLoader() {
    loader.classList.remove("hidden");
}

function hideLoader() {
    loader.classList.add("hidden");
}
