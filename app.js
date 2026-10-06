// Screens: role choice, admin login, admin console, viewer
function render(){
 const app=$("#app");
 if(!role){
  app.innerHTML=`<div class="login"><div><h1>Samtabari Christ Youths Fellowship</h1><p class="mute">Choose how you want to enter.</p></div>
  <button class="role" data-r="admin"><h2>Admin</h2><p class="mute">Publish, edit, pin and delete posts.</p></button>
  <button class="role" data-r="viewer"><h2>Viewer</h2><p class="mute">Read and search posts. No editing.</p></button></div>`;
  app.querySelectorAll(".role").forEach(b=>b.onclick=()=>{role=b.dataset.r==="admin"?"adminlogin":"viewer";render()});
  return;
 }
 if(role==="adminlogin"){
  const cr=getCred();
  app.innerHTML=`<div class="login"><div><h1>${cr?"Admin sign in":"Create admin account"}</h1><p class="mute">${cr?"Enter your admin username and password.":"First time here. Choose the admin username and password (6+ characters)."}</p></div>
  <div class="form"><input id="u" placeholder="Username" autocomplete="username" aria-label="Username">
  <input id="pw" type="password" placeholder="Password" autocomplete="${cr?"current-password":"new-password"}" aria-label="Password">
  ${cr?"":`<input id="pw2" type="password" placeholder="Confirm password" autocomplete="new-password" aria-label="Confirm password">`}
  <p class="mute" id="err" role="alert" style="color:#d92d20"></p>
  <div class="acts"><button class="btn" id="go">${cr?"Sign in":"Create account"}</button><button class="btn ghost" id="back">Back</button></div></div></div>`;
  $("#back").onclick=()=>{role=null;render()};
  const go=async()=>{
   const u=$("#u").value.trim(),pw=$("#pw").value,er=$("#err");
   if(!u||!pw){er.textContent="Enter a username and password.";return}
   if(cr){
    if(u.toLowerCase()===cr.u.toLowerCase()&&await hash(pw,cr.s)===cr.h){role="admin";render()}
    else er.textContent="Wrong username or password.";
   }else{
    if(pw.length<6){er.textContent="Use at least 6 characters.";return}
    if(pw!==$("#pw2").value){er.textContent="Passwords do not match.";return}
    const sl=Math.random().toString(36).slice(2);
    try{localStorage.setItem(CK,JSON.stringify({u,s:sl,h:await hash(pw,sl)}))}catch(e){er.textContent="Could not save the account in this browser.";return}
    role="admin";render();
   }
  };
  $("#go").onclick=go;
  app.querySelectorAll("input").forEach(i=>i.onkeydown=ev=>{if(ev.key==="Enter")go()});
  return;
 }
 const admin=role==="admin";
 const cats=["All",...new Set(posts.map(p=>p.cat))];
 const list=posts.filter(p=>(cat==="All"||p.cat===cat)&&(p.title+p.body).toLowerCase().includes(q.toLowerCase()))
  .sort((a,b)=>(b.pin-a.pin)||b.date.localeCompare(a.date));
 const e=posts.find(p=>p.id===editId);
 app.innerHTML=`
 <div class="top"><div><h1>${admin?"Admin console":"Samtabari Christ Youths Fellowship"}</h1><span class="badge ${admin?"admin":""}">${admin?"Admin":"Viewer"}</span></div>
 <button class="btn ghost sm" id="out">Switch role</button></div>
 ${admin?`<div class="stats"><div><b>${posts.length}</b><span class="mute">Posts</span></div><div><b>${posts.filter(p=>p.pin).length}</b><span class="mute">Pinned</span></div></div>
 <div class="form"><h2>${e?"Edit post":"New post"}</h2>
  <input id="t" placeholder="Title" value="${esc(dr?dr.t:e?e.title:"")}" aria-label="Title">
  <textarea id="b" placeholder="Message" aria-label="Message">${esc(dr?dr.b:e?e.body:"")}</textarea>
  <div class="pv" id="pv">${photo?`<img src="${photo}" alt="Selected photo"><button class="btn danger sm" id="rp">Remove photo</button>`:""}</div>
  <label class="mute" for="p">Photo: pick a file from this device, take one with the camera, or paste/drop an image copied from a browser tab.</label>
  <input id="p" type="file" accept=".jpg,.jpeg,.png,.gif,.webp,.bmp,.avif,image/jpeg,image/png,image/webp,image/gif">
  <input id="pc" type="file" accept="image/*" capture="environment" aria-label="Take photo" style="display:none"><button class="btn ghost sm" type="button" id="cam">Take photo with camera</button>
  <input id="c" placeholder="Category (e.g. Notice)" value="${esc(dr?dr.c:e?e.cat:"")}" aria-label="Category">
  <p class="mute" id="fe" role="alert" style="color:#d92d20"></p>
  <div class="acts"><button class="btn" id="save">${e?"Save changes":"Publish"}</button>${e?`<button class="btn ghost" id="cancel">Cancel</button>`:""}</div></div>`:""}
 <div class="tools"><input id="q" type="search" placeholder="Search posts" value="${esc(q)}" aria-label="Search posts">
 <select id="f" aria-label="Category">${cats.map(c=>`<option ${c===cat?"selected":""}>${esc(c)}</option>`).join("")}</select></div>
 ${list.length?list.map(p=>`<article class="post ${p.pin?"pin":""}"><div class="meta"><span class="cat">${esc(p.cat)}</span><span class="cat">${p.date}</span>${p.pin?'<span class="badge">Pinned</span>':""}</div>
  <h2>${esc(p.title)}</h2><p>${esc(p.body)}</p>
  ${p.photo?`<img class="ph" src="${p.photo}" alt="${esc(p.title)}" data-a="zoom" data-id="${p.id}">`:""}
  <div class="acts">${p.photo?`<button class="btn ghost sm" data-a="share" data-id="${p.id}">Share photo</button>`:""}</div>
  ${admin?`<div class="acts"><button class="btn ghost sm" data-a="pin" data-id="${p.id}">${p.pin?"Unpin":"Pin"}</button><button class="btn ghost sm" data-a="edit" data-id="${p.id}">Edit</button>${delId===p.id?`<span class="mute">Delete this post?</span><button class="btn danger sm" data-a="yes" data-id="${p.id}">Yes, delete</button><button class="btn ghost sm" data-a="no" data-id="${p.id}">Cancel</button>`:`<button class="btn danger sm" data-a="del" data-id="${p.id}">Delete</button>`}</div>`:""}</article>`).join(""):`<div class="empty">No posts found.${admin?" Publish one above.":""}</div>`}`;
 $("#out").onclick=()=>{role=null;editId=null;render()};
 $("#q").oninput=ev=>{q=ev.target.value;render();const i=$("#q");i.focus();i.setSelectionRange(q.length,q.length)};
 $("#f").onchange=ev=>{cat=ev.target.value;render()};
 if(admin){
  $("#p").onchange=ev=>usePhoto(ev.target.files&&ev.target.files[0]);
  $("#pc").onchange=ev=>usePhoto(ev.target.files&&ev.target.files[0]);
  $("#cam").onclick=()=>$("#pc").click();
  const fm=$(".form");fm.ondragover=ev=>ev.preventDefault();
  fm.ondrop=ev=>{ev.preventDefault();usePhoto([...ev.dataTransfer.files].find(f=>f.type.startsWith("image/")))};
  const rp=$("#rp");if(rp)rp.onclick=()=>{photo=null;render()};
  $("#save").onclick=()=>{
   const t=$("#t").value.trim(),b=$("#b").value.trim(),c=$("#c").value.trim()||"General";
   if(!t||!b){$("#fe").textContent="Add a title and a message.";return}
   if(e){Object.assign(e,{title:t,body:b,cat:c,photo})}
   else posts.push({id:Date.now(),title:t,body:b,cat:c,photo,pin:false,date:new Date().toISOString().slice(0,10)});
   editId=null;photo=null;dr=null;save();render();
  };
  const cn=$("#cancel");if(cn)cn.onclick=()=>{editId=null;photo=null;dr=null;render()};
  app.querySelectorAll("[data-a=pin],[data-a=edit],[data-a=del],[data-a=yes],[data-a=no]").forEach(b=>b.onclick=()=>{
   const id=+b.dataset.id,p=posts.find(x=>x.id===id);
   if(b.dataset.a==="pin")p.pin=!p.pin;
   else if(b.dataset.a==="edit"){editId=id;photo=p.photo||null;dr=null;render();scrollTo(0,0);return}
   else if(b.dataset.a==="del"){delId=id;render();return}
   else if(b.dataset.a==="no"){delId=null;render();return}
   else if(b.dataset.a==="yes"){posts=posts.filter(x=>x.id!==id);delId=null}
   save();render();
  });
 }
}
function app_bind(){render();document.addEventListener("click",ev=>{const b=ev.target.closest("[data-a=share],[data-a=zoom]");if(!b)return;
 const p=posts.find(x=>x.id==b.dataset.id);if(!p)return;b.dataset.a==="share"?sharePhoto(p):lightbox(p,"Tap anywhere to close.")})}
app_bind();
