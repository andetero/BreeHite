const gallery=document.getElementById("gallery");
const emptyState=document.getElementById("empty-state");
const lightbox=document.getElementById("lightbox");
const lightboxImage=document.getElementById("lightbox-image");
const lightboxCaption=document.getElementById("lightbox-caption");
const lightboxSource=document.getElementById("lightbox-source");
document.getElementById("year").textContent=new Date().getFullYear();

async function loadPhotos(){
  try{
    const response=await fetch("photos.json",{cache:"no-store"});
    const photos=await response.json();
    const horsePhotos=photos.filter(photo=>photo.horse===true&&photo.src);
    if(!horsePhotos.length){emptyState.hidden=false;return;}
    horsePhotos.sort((a,b)=>new Date(b.date||0)-new Date(a.date||0));
    for(const photo of horsePhotos){
      const card=document.createElement("article");
      card.className="photo-card";
      card.tabIndex=0;
      card.setAttribute("role","button");
      card.setAttribute("aria-label",photo.caption?"Open photo: "+photo.caption:"Open horse photo");
      const img=document.createElement("img");
      img.src=photo.src;
      img.alt=photo.alt||photo.caption||"Bree Hite horseback riding";
      img.loading="lazy";
      img.decoding="async";
      const overlay=document.createElement("div");
      overlay.className="photo-overlay";
      const caption=document.createElement("p");
      caption.className="photo-caption";
      caption.textContent=photo.caption||"";
      const date=document.createElement("p");
      date.className="photo-date";
      date.textContent=photo.date?new Date(photo.date+"T12:00:00").toLocaleDateString(undefined,{year:"numeric",month:"long"}):"";
      overlay.append(caption,date);
      card.append(img,overlay);
      const open=()=>openLightbox(photo);
      card.addEventListener("click",open);
      card.addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();open();}});
      gallery.append(card);
    }
  }catch(error){
    emptyState.hidden=false;
  }
}

function openLightbox(photo){
  lightboxImage.src=photo.src;
  lightboxImage.alt=photo.alt||photo.caption||"Bree Hite horseback riding";
  lightboxCaption.textContent=photo.caption||"";
  if(photo.source){
    lightboxSource.href=photo.source;
    lightboxSource.hidden=false;
  }else{
    lightboxSource.hidden=true;
  }
  lightbox.showModal();
}
document.querySelector(".lightbox-close").addEventListener("click",()=>lightbox.close());
lightbox.addEventListener("click",event=>{if(event.target===lightbox)lightbox.close();});
loadPhotos();