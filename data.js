// State, default posts and browser storage
const KEY="portail_posts_v1";
const seed=[
{id:1,title:"Welcome to the portal",body:"Find company news, notices and documents here. Viewers can read everything; admins publish and edit.",cat:"General",pin:true,date:"2026-10-01"},
{id:2,title:"Office closed Friday",body:"The office is closed this Friday for maintenance. Remote work is expected.",cat:"Notice",pin:false,date:"2026-10-03"},
{id:3,title:"New expense policy",body:"Expenses above 200 EUR now need manager approval before purchase.",cat:"Policy",pin:false,date:"2026-10-05"}];
let posts=load(),role=null,q="",cat="All",editId=null,photo=null,delId=null,dr=null;
function load(){try{const v=localStorage.getItem(KEY);if(v)return JSON.parse(v)}catch(e){}return seed.slice()}
function save(){try{localStorage.setItem(KEY,JSON.stringify(posts))}catch(e){}}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const $=s=>document.querySelector(s);
