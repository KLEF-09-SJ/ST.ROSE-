const WHATSAPP="2348145501016",ACCOUNT_NAME="";
const S=JSON.parse(document.getElementById("state").textContent);let products=S.products,reviews=S.reviews;
const $=id=>document.getElementById(id),tones={Jewelry:"#c98d86",Watches:"#a87d68",Footwear:"#8a6a5a"};
const wa=t=>`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t)}`,N=n=>"₦"+Number(n).toLocaleString();
const esc=t=>String(t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
["heroWa","footWa","fab"].forEach(i=>$(i).href=wa("Hi St. Rose, I'd like to know what's available."));
$("aname").textContent=ACCOUNT_NAME?"Account name: "+ACCOUNT_NAME:"";
$("copy").onclick=async()=>{try{await navigator.clipboard.writeText("8145501016");$("copy").textContent="Copied"}catch(e){$("copy").textContent="Number: 8145501016"}};
$("share").onclick=async()=>{try{await navigator.clipboard.writeText(location.href);$("share").textContent="Link copied"}catch(e){}};
let cart=[],cur="All";
const cats=["All","Jewelry","Watches","Footwear"];
function render(){
  $("filters").innerHTML="";
  cats.forEach(c=>{const b=document.createElement("button");b.className="chip";b.textContent=c;b.setAttribute("aria-pressed",c===cur);b.onclick=()=>{cur=c;render()};$("filters").appendChild(b)});
  const q=$("q").value.toLowerCase(),so=$("so").value;
  let L=products.filter(p=>(cur==="All"||p.category===cur)&&p.name.toLowerCase().includes(q));
  if(so)L=[...L].sort((a,b)=>so==="a"?a.price-b.price:b.price-a.price);
  const g=$("grid");g.innerHTML="";
  if(!L.length)g.innerHTML='<p class="sub">Nothing matches. Try another search or category.</p>';
  L.forEach(p=>{
    const d=document.createElement("div");d.className="p";
    const im=p.images||[],opts=(p.options||"").split(",").map(x=>x.trim()).filter(Boolean);
    d.innerHTML=(p.sold?'<span class="sold">Sold out</span>':"")+(im.length?`<img class="ph" src="${im[0]}" alt="${esc(p.name)}">`:`<div class="ph" style="background:${tones[p.category]}">St. Rose</div>`)+
    (im.length>1?'<div class="th">'+im.map(s=>`<img src="${s}" alt="">`).join("")+"</div>":"")+
    `<div class="pb"><b>${esc(p.name)}</b><span class="price">${N(p.price)}</span>${stars(p)}`+(opts.length?`<select aria-label="Choose option">${opts.map(o=>`<option>${esc(o)}</option>`).join("")}</select>`:"")+`<div class="row"><button class="btn add" ${p.sold?"disabled":""}>Add to cart</button><a class="btn alt buy" target="_blank" rel="noopener">${p.sold?"Ask":"Order now"}</a></div>${revBox(p)}</div>`;
    d.querySelector(".rf").onsubmit=e=>{e.preventDefault();const f=e.target,i=f.querySelectorAll("input");window.open(wa(`Review for ${p.name}\nRating: ${f.querySelector("select").value}/5\nName: ${i[0].value}\n${i[1].value}`),"_blank")};
    const sel=()=>{const s=d.querySelector("select");return s?s.value:""};
    d.querySelectorAll(".th img").forEach(t=>t.onclick=()=>d.querySelector(".ph").src=t.src);
    d.querySelector(".add").onclick=()=>{const o=sel(),k=p.name+"|"+o,f=cart.find(x=>x.k===k);f?f.n++:cart.push({k,name:p.name,o,price:p.price,n:1});drawCart(true)};
    const buy=d.querySelector(".buy");buy.onmouseenter=buy.onfocus=buy.ontouchstart=()=>buy.href=wa((p.sold?"Hi St. Rose, will "+p.name+" be restocked?":"Hi St. Rose, I'd like to order "+p.name+(sel()?" ("+sel()+")":"")));buy.onmouseenter();
    g.appendChild(d)});
}
const stars=p=>{const r=p.reviews||[];if(!r.length)return"<small>No ratings yet</small>";const a=r.reduce((s,x)=>s+x.stars,0)/r.length,k=Math.round(a);return`<span class="stars" aria-label="${a.toFixed(1)} out of 5">${"★".repeat(k)+"☆".repeat(5-k)} <small>${a.toFixed(1)} (${r.length})</small></span>`};
const revBox=p=>`<details><summary>Reviews (${(p.reviews||[]).length})</summary>${(p.reviews||[]).map(x=>`<p><span class="stars">${"★".repeat(x.stars)}</span> ${esc(x.text)}<br><small>${esc(x.name)}</small></p>`).join("")}<form class="rf"><select aria-label="Stars">${[5,4,3,2,1].map(n=>`<option value="${n}">${"★".repeat(n)} ${n}</option>`).join("")}</select><input placeholder="Your name" required><input placeholder="Your review" required><button class="btn alt" type="submit">Send review</button><small>Opens WhatsApp. It appears here after the owner checks it.</small></form></details>`;
function renderRevs(){$("revs").innerHTML=reviews.length?reviews.map(s=>`<div class="box"><img src="${s}" alt="Customer review"></div>`).join(""):'<div class="box"><div class="shot">Customer reviews will appear here</div></div>'}
function drawCart(open){
  const c=$("cart"),n=cart.reduce((a,x)=>a+x.n,0),t=cart.reduce((a,x)=>a+x.n*x.price,0);
  $("cartb").hidden=!n;$("cartb").textContent="Cart ("+n+") · "+N(t);
  if(!n){c.hidden=true;return}
  if(open)c.hidden=false;
  c.innerHTML="<h3 style='font-size:2rem'>Your cart</h3>";
  cart.forEach((x,i)=>{const r=document.createElement("div");r.className="ci";r.innerHTML=`<span>${esc(x.name)}${x.o?" ("+esc(x.o)+")":""}<br><small>${N(x.price)}</small></span><span><button aria-label="Less">−</button> ${x.n} <button aria-label="More">+</button></span>`;
    const b=r.querySelectorAll("button");b[0].onclick=()=>{x.n--;if(!x.n)cart.splice(i,1);drawCart(true)};b[1].onclick=()=>{x.n++;drawCart(true)};c.appendChild(r)});
  const msg="Hi St. Rose, I'd like to order:\n"+cart.map(x=>`- ${x.n} x ${x.name}${x.o?" ("+x.o+")":""} = ${N(x.n*x.price)}`).join("\n")+"\nTotal: "+N(t)+" (before delivery)";
  c.insertAdjacentHTML("beforeend",`<p><b>Total: ${N(t)}</b> <small>before delivery</small></p><a class="btn" style="display:block" target="_blank" rel="noopener" href="${wa(msg)}">Send order on WhatsApp</a><button class="btn alt" id="cc" style="width:100%;margin-top:8px">Keep shopping</button>`);
  $("cc").onclick=()=>c.hidden=true;
}
$("cartb").onclick=()=>drawCart(true);$("q").oninput=render;$("so").onchange=render;
document.querySelectorAll(".cat").forEach(c=>c.onclick=()=>{cur=c.dataset.f;render();$("shop").scrollIntoView({behavior:"smooth"})});
render();renderRevs();

/* ---- Owner tools ---- */
function shrink(f){return new Promise((ok,no)=>{const r=new FileReader();r.onerror=no;r.onload=()=>{const im=new Image();im.onerror=no;im.onload=()=>{const k=Math.min(1,700/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=im.width*k;c.height=im.height*k;c.getContext("2d").drawImage(im,0,0,c.width,c.height);ok(c.toDataURL("image/jpeg",.78))};im.src=r.result};r.readAsDataURL(f)})}
async function initAdmin(){
  if(!window.claude)return;let user,art;
  try{user=await claude.use("user");art=await claude.use("artifact")}catch(e){return}
  if(!art||!user||!(await user.canEdit()))return;
  const box=$("admin");box.hidden=false;let changed=false,ed=-1;
  function draw(){
    const p=ed>=0?products[ed]:{name:"",price:"",category:"Jewelry",options:""};
    box.innerHTML=`<div class="adm"><h3>Manage shop</h3><small>Only you see this. Press Save to put changes on the live site.</small>
    <form id="af"><input id="an" placeholder="Product name" required value="${esc(p.name)}"><input id="ap" type="number" min="0" placeholder="Price in naira" required value="${p.price}">
    <select id="ac">${["Jewelry","Watches","Footwear"].map(c=>`<option ${c===p.category?"selected":""}>${c}</option>`).join("")}</select>
    <input id="ao" placeholder="Sizes or colours, separated by commas (optional)" value="${esc(p.options||"")}">
    <input id="ai" type="file" accept="image/*" multiple aria-label="Product photos"><small>${ed>=0?"Choose new photos only if you want to replace the old ones.":"You can choose several photos."}</small>
    <button class="btn" type="submit">${ed>=0?"Update product":"Add product"}</button>${ed>=0?'<button class="btn alt" type="button" id="cx">Cancel</button>':""}</form>
    <div id="al"></div>
    <h3 style="font-size:1.5rem">Add a product review</h3><form id="rvf"><select id="rp">${products.map((q,i)=>`<option value="${i}">${esc(q.name)}</option>`).join("")}</select><select id="rs">${[5,4,3,2,1].map(n=>`<option value="${n}">${n} stars</option>`).join("")}</select><input id="rn" placeholder="Customer name" required><input id="rt" placeholder="Review text" required><button class="btn" type="submit">Add review</button></form>
    <h3 style="font-size:1.5rem">Sales</h3><div id="sales"></div>
    <p><label>Add a customer review screenshot <input id="ar" type="file" accept="image/*"></label>${reviews.length?` <button id="rr" class="btn alt">Remove last review</button>`:""}</p>
    <button class="btn" id="sv" ${changed?"":"disabled"}>Save to live site</button> <small id="am"></small></div>`;
    const l=box.querySelector("#al"),m=box.querySelector("#am");
    products.forEach((q,i)=>{const r=document.createElement("div");r.className="row";r.innerHTML=`<span>${esc(q.name)} · ${N(q.price)}${q.sold?" · SOLD OUT":""}</span><span></span>`;
      [["Edit",()=>{ed=i;draw()}],[q.sold?"Mark available":"Mark sold out",()=>{q.sold=!q.sold;changed=true;render();draw()}],["Remove",()=>{products.splice(i,1);ed=-1;changed=true;render();draw()}]].forEach(([t,f])=>{const b=document.createElement("button");b.textContent=t;b.onclick=f;r.lastChild.appendChild(b)});l.appendChild(r)});
    box.querySelector("#rvf").onsubmit=e=>{e.preventDefault();const q=products[+box.querySelector("#rp").value];(q.reviews=q.reviews||[]).push({stars:+box.querySelector("#rs").value,name:box.querySelector("#rn").value.trim(),text:box.querySelector("#rt").value.trim()});changed=true;render();draw()};
    if(box.querySelector("#cx"))box.querySelector("#cx").onclick=()=>{ed=-1;draw()};
    box.querySelector("#af").onsubmit=async e=>{e.preventDefault();let im=null;const fs=[...box.querySelector("#ai").files];
      try{if(fs.length)im=await Promise.all(fs.map(shrink))}catch(x){m.textContent="A photo could not be read. Try another.";return}
      const o={name:box.querySelector("#an").value.trim(),price:Number(box.querySelector("#ap").value),category:box.querySelector("#ac").value,options:box.querySelector("#ao").value.trim()};
      if(ed>=0)Object.assign(products[ed],o,im?{images:im}:{});else products.unshift({...o,images:im||[],sold:false});
      ed=-1;changed=true;render();draw()};
    box.querySelector("#ar").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{reviews.push(await shrink(f));changed=true;renderRevs();draw()}catch(x){m.textContent="That photo could not be read."}};
    if(box.querySelector("#rr"))box.querySelector("#rr").onclick=()=>{reviews.pop();changed=true;renderRevs();draw()};
    box.querySelector("#sv").onclick=async()=>{m.textContent="Saving...";const c=document.documentElement.cloneNode(true);
      c.querySelector("#state").textContent=JSON.stringify({products,reviews}).replace(/</g,"\\u003c");
      ["#filters","#grid","#admin","#revs","#cart"].forEach(q=>c.querySelector(q).innerHTML="");["#admin","#cart","#cartb"].forEach(q=>c.querySelector(q).setAttribute("hidden",""));
      try{await art.publish("<!DOCTYPE html>\n"+c.outerHTML)}catch(e){m.textContent=e.code==="conflict"?"":"Could not save ("+(e.code||"error")+"). Try again."}};
    drawSales();
  }
  let db=null,rows=[];const ymd=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
  try{db=await claude.use("db")}catch(e){}
  if(db)db.collection("sales").onSnapshot(s=>{rows=s.docs.map(d=>({id:d.id,...d.data()}));drawSales()},()=>{});
  function drawSales(){
    const el=box.querySelector("#sales");if(!el)return;
    if(!db){el.innerHTML="<small>The sales log is not available right now.</small>";return}
    const now=new Date(),td=ymd(now),mon=new Date(now);mon.setDate(now.getDate()-((now.getDay()+6)%7));const wk=ymd(mon);
    const P=rows.filter(r=>r.paid),sum=f=>N(P.filter(r=>f(r.date)).reduce((a,r)=>a+r.amount,0)),pen=rows.filter(r=>!r.paid);
    el.innerHTML=`<div class="sg"><div>Today<b>${sum(d=>d===td)}</b></div><div>This week<b>${sum(d=>d>=wk&&d<=td)}</b></div><div>This month<b>${sum(d=>d.slice(0,7)===td.slice(0,7))}</b></div><div>This year<b>${sum(d=>d.slice(0,4)===td.slice(0,4))}</b></div><div>All time<b>${sum(()=>true)}</b></div><div>Awaiting payment<b>${N(pen.reduce((a,r)=>a+r.amount,0))}</b><small>${pen.length} orders</small></div></div>
    <form id="sf"><select id="si">${products.map(q=>`<option>${esc(q.name)}</option>`).join("")}<option>Other</option></select><input id="sq" type="number" min="1" value="1" aria-label="Quantity"><input id="sa" type="number" min="0" placeholder="Amount paid in naira" required><input id="sc" placeholder="Customer name (optional)"><input id="sd" type="date" value="${td}"><select id="sp"><option value="1">Paid</option><option value="">Awaiting payment</option></select><button class="btn" type="submit">Record sale</button></form><div id="sl"></div>`;
    const f=el.querySelector("#sf"),fill=()=>{const q=products.find(x=>x.name===f.querySelector("#si").value);if(q)f.querySelector("#sa").value=q.price*(+f.querySelector("#sq").value||1)};
    f.querySelector("#si").onchange=fill;f.querySelector("#sq").oninput=fill;fill();
    f.onsubmit=async e=>{e.preventDefault();try{await db.collection("sales").doc("s"+Date.now()).set({item:f.querySelector("#si").value,qty:+f.querySelector("#sq").value,amount:+f.querySelector("#sa").value,customer:f.querySelector("#sc").value.trim(),date:f.querySelector("#sd").value,paid:!!f.querySelector("#sp").value})}catch(x){box.querySelector("#am").textContent="Could not record the sale ("+(x.code||"error")+")."}};
    const l=el.querySelector("#sl");[...rows].sort((a,b)=>(b.date+b.id).localeCompare(a.date+a.id)).slice(0,20).forEach(r=>{const w=document.createElement("div");w.className="row";w.style.cssText="display:flex;gap:6px;flex-wrap:wrap;justify-content:space-between;border-top:1px solid var(--accent);padding:6px 0";w.innerHTML=`<span>${esc(r.date)} · ${r.qty} x ${esc(r.item)} · ${N(r.amount)}${r.customer?" · "+esc(r.customer):""} · <b class="${r.paid?"paid":"pend"}">${r.paid?"Paid":"Awaiting payment"}</b></span><span></span>`;
      [[r.paid?"Mark unpaid":"Mark paid",()=>db.collection("sales").doc(r.id).update({paid:!r.paid})],["Delete",()=>db.collection("sales").doc(r.id).delete()]].forEach(([n,fn])=>{const b=document.createElement("button");b.textContent=n;b.style.cssText="background:none;border:1px solid var(--accent);color:var(--ink);border-radius:8px;padding:4px 10px;cursor:pointer;margin-left:4px";b.onclick=fn;w.lastChild.appendChild(b)});l.appendChild(w)});
  }
  draw();
}
initAdmin();
