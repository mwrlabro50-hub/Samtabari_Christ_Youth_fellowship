// Photo selection, resizing, enlarging and sharing
async function usePhoto(f){const fe=$("#fe");if(!f||!fe)return;
 fe.textContent="Loading photo...";fe.style.color="";
 try{const d={t:$("#t").value,b:$("#b").value,c:$("#c").value};photo=await shrink(f);dr=d;render()}
 catch(x){fe.style.color="#d92d20";fe.textContent="This photo could not be loaded. Try a JPG or PNG."}}
document.addEventListener("paste",ev=>{if(role!=="admin"||!$("#p"))return;const f=[...(ev.clipboardData?ev.clipboardData.files:[])].find(x=>x.type.startsWith("image/"));if(f)usePhoto(f)});
function shrink(f){return new Promise((ok,no)=>{const fr=new FileReader();fr.onerror=no;fr.onload=()=>{const im=new Image();im.onerror=no;
 im.onload=()=>{const k=Math.min(1,900/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=im.width*k;c.height=im.height*k;
 c.getContext("2d").drawImage(im,0,0,c.width,c.height);ok(c.toDataURL("image/jpeg",.72))};im.src=fr.result};fr.readAsDataURL(f)})}
function lightbox(p,msg){const d=document.createElement("div");d.className="lb";d.innerHTML=`<img src="${p.photo}" alt="${esc(p.title)}"><p>${msg}</p><button class="btn">Close</button>`;
 d.onclick=ev=>{if(ev.target!==d.querySelector("img"))d.remove()};document.body.appendChild(d)}
async function sharePhoto(p){try{const b=await (await fetch(p.photo)).blob(),f=new File([b],"photo.jpg",{type:"image/jpeg"});
 if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:p.title});return}}catch(e){if(e&&e.name==="AbortError")return}
 lightbox(p,"Sharing is not available here. Press and hold the photo to save it.")}
