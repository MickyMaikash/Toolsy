let uploadSection=document.querySelector('.uploadSection')
let PdfInput=document.querySelector('#PdfInput')
let PdfContainer=document.querySelector('.PdfContainer')
let mergeSection=document.querySelector('.MergeSection')
let mergeButton=document.querySelector(".mergeButton")
let progressUi=document.querySelector('#mergeProgress')
let downloadBtn=document.querySelector('#downloadBtn')
let closeViewer=document.querySelector('#closeViewer')
let pdfModal=document.querySelector('#pdfModal')
let pdfViewer=document.querySelector('#pdfViewer')
let guide=document.querySelector('.guide')

if(localStorage.getItem("ImageToPdfVisit")=="YES"){
    guide.remove()
}else{
    guide.classList.add("show")
console.log(document.querySelector(".closeGuide"));
    document.querySelector(".closeGuide").addEventListener('click',()=>{
        console.log("clicked")
        guide.remove()
        localStorage.setItem("ImageToPdfVisit","YES")
    })
}


let pdflist=[];
let draggingIndex=null;
let downloadUrl=null;

uploadSection.addEventListener('click',()=>{
    console.log("box clicked")
    PdfInput.click();
})

PdfInput.addEventListener('change',async()=>{
 let data=PdfInput.files;

 if(data==null ||data.length==0) return;
    mergeSection.classList.remove('hidden')
    mergeButton.classList.remove('hidden')
    progressUi.classList.add('hidden')
    downloadBtn.classList.add('hidden')
 for(const file of data){
    const pdfBytes = await file.arrayBuffer();
    if(pdfBytes.byteLength<=0){
        alert(`File ${file.name} has size 0 bytes`)
        continue
    }
    pdflist.push({
        "name":file.name,
        "size":file.size,
        "data":pdfBytes,
        "position":pdflist.length
    })
    console.log(pdflist)
 }


renderPdfOnScreen()
PdfContainer.scrollIntoView({
    behavior: "smooth",
    block: "center"
});


})

document.querySelectorAll('.PdfContainer .mainContainer').forEach(e=>{
    e.addEventListener('dragstart',()=>{
        console.log('start')
        e.classList.add('dragging')
        console.log('started')
        draggingIndex=Number(e.dataset.index);
    })

    e.addEventListener("dragover", (e) => {
    e.preventDefault(); 
    });

    e.addEventListener('drop',()=>{
        let dropIndex=Number(e.dataset.index)

        if(dropIndex==draggingIndex) return
        //remove one obj from index at draggingindex
        let objtomove=pdflist[draggingIndex]
        pdflist.splice(draggingIndex,1)
       
       //now add
        pdflist.splice(dropIndex,0,objtoMove)

        pdflist.forEach((e,index)=>{
            e.position=index;
        })

        renderPdfOnScreen()
       
        
    })
    e.addEventListener("dragover", (event) => {
        event.preventDefault();
    });
})

mergeButton.addEventListener('click',()=>{
    if(pdflist.length==0){
        alert("there is no pdf to merge")
    }else{
        PdfMerger()
    }
})

downloadBtn.addEventListener('click',()=>{
    downloadPdf()
})



function renderPdfOnScreen(){
    PdfContainer.innerHTML = "";

    pdflist.forEach(element => {
        
    const mainContainer=document.createElement('div')
    mainContainer.dataset.index=element.position
    mainContainer.draggable=true
    mainContainer.classList.add('mainContainer')

    const pdfImg=document.createElement('img')
    pdfImg.src="../../assets/pdf.svg";

    const subContainer=document.createElement('div')
    const h3=document.createElement('h3')
    h3.innerText=element.name;
    const p=document.createElement('p')
    p.innerText=`Size:${(element.data.byteLength/1024).toFixed(2)}kb`

    const viewImg=document.createElement('img')
    viewImg.src="../../assets/view.svg"
    viewImg.classList.add('viewImg')

    const closeBtn=document.createElement('img')
    closeBtn.classList.add('closeBtn')
    closeBtn.src="../../assets/close.svg"

    mainContainer.append(pdfImg,subContainer,viewImg,closeBtn)
    subContainer.append(h3,p)
    PdfContainer.appendChild(mainContainer)






    //adding click listeners 

     mainContainer.addEventListener('dragstart',()=>{
        //getting the index of eleemtn which is dragged or moved
        console.log('start')
        mainContainer.classList.add('dragging')
        console.log('started')
        draggingIndex=Number(mainContainer.dataset.index);
    })

    mainContainer.addEventListener("dragover", (e) => {
    e.preventDefault(); 
    });

    mainContainer.addEventListener('drop',()=>{
        //getting the index of element where obj was dropped
        let dropIndex=Number(mainContainer.dataset.index)

        if(dropIndex==draggingIndex) return
        //remove one obj from index at draggingindex
        let objtoMove=pdflist[draggingIndex]
        pdflist.splice(draggingIndex,1)
       
       //now add
        pdflist.splice(dropIndex,0,objtoMove)

        pdflist.forEach((e,index)=>{
            e.position=index;
        })



        renderPdfOnScreen()
        
    })
    mainContainer.addEventListener("dragover", (event) => {
        event.preventDefault();
    });

    mainContainer.addEventListener("dragend", () => {
    mainContainer.classList.remove("dragging");
});

    viewImg.addEventListener('click',(e)=>{
        let index=Number(e.target.parentElement.dataset.index)
        openPDF(pdflist[index].data)
    })

    closeBtn.addEventListener('click',(e)=>{
        let indexToDelet=Number(e.target.parentElement.dataset.index)
        let objToDelete=pdflist[indexToDelet]
        //now deleting
        pdflist.splice(draggingIndex,1)

        //hiding buttons if no pdf present there
        if(pdflist.length==0){
            mergeSection.classList.add('hidden')
        }

        pdflist.forEach((e,index)=>{
            e.position=index;
        })

        renderPdfOnScreen()

        console.log('deletedSuccessfully')
    }
    )


    });


   

}

const PdfMerger=async()=>{
    mergeButton.classList.add('hidden')
    progressUi.classList.remove('hidden')
    //create a pdf document
    let mergePdf=await  PDFLib.PDFDocument.create();

    for(const pdf of pdflist){
        //load the pdf
        const pdfObj= await PDFLib.PDFDocument.load(pdf.data);


        //copy the pages in the format as it belongs to mergePdf
        const pages=await mergePdf.copyPages(pdfObj,pdfObj.getPageIndices())

        //add the pages you copied in mergepdf format into mergedpdf
        pages.forEach(page => {
            mergePdf.addPage(page)
        });
    }

    //save the mergepdf in bytes
    const mergedpdfbytes=await mergePdf.save()

    const blob=new Blob([ mergedpdfbytes],{"type":"application/pdf"})

    downloadUrl=URL.createObjectURL(blob)
    mergeSection.classList.add('hidden')
    downloadBtn.classList.remove('hidden')
    alert("Pdf Merged Successfully")

}

const downloadPdf=()=>{
    let link =document.createElement('a')
    
    link.href=downloadUrl
    link.download="mergedPdf.pdf"

    link.click()
}


function openPDF(data){

    const blob = new Blob(
        [data],
        {
            type:"application/pdf"
        }
    );

    const url = URL.createObjectURL(blob);

    pdfViewer.src = url;

    pdfModal.classList.add("show");
}

closeViewer.addEventListener("click",()=>{

    pdfModal.classList.remove("show");

    pdfViewer.src = "";

});