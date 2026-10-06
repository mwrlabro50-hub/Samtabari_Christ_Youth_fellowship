// Admin account (username + hashed password)
const CK="portail_admin_v1";
function getCred(){try{return JSON.parse(localStorage.getItem(CK))}catch(e){return null}}
async function hash(p,salt){try{const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(salt+p));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}catch(e){return salt+p}}
