const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
let authMode = "register";
let currentUser = null;
let pendingTier = null;

function escapeHtml(value="") {
  return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
function toast(message) {
  const el=$("#toast"); el.textContent=message; el.classList.add("show");
  window.setTimeout(()=>el.classList.remove("show"),3200);
}
async function api(url, options={}) {
  const res=await fetch(url,{credentials:"same-origin",...options,headers:{"Content-Type":"application/json",...(options.headers||{})}});
  let data={}; try{data=await res.json()}catch{}
  if(!res.ok) throw new Error(data.error||"Une erreur est survenue.");
  return data;
}
function showModal(id){const el=$("#"+id);el.classList.add("open");el.setAttribute("aria-hidden","false");}
function hideModal(id){const el=$("#"+id);el.classList.remove("open");el.setAttribute("aria-hidden","true");}
function setAuthMode(mode) {
  authMode=mode;
  $("#authTitle").textContent=mode==="register"?"Créer ton compte":"Content de te revoir";
  $("#authDescription").textContent=mode==="register"?"Inscris-toi pour retrouver tes cours dans ton espace personnel.":"Connecte-toi pour accéder à ton espace membre.";
  $("#nameField").classList.toggle("hidden",mode!=="register");
  $("#authName").required=mode==="register";
  $("#authPassword").autocomplete=mode==="register"?"new-password":"current-password";
  $("#authPassword").minLength=mode==="register"?10:1;
  $("#authSubmit").textContent=mode==="register"?"Créer mon compte":"Se connecter";
  $("#authSwitch").innerHTML=mode==="register"?'Déjà inscrit ? <button class="linklike" id="switchToLogin">Se connecter</button>':'Pas encore de compte ? <button class="linklike" id="switchToRegister">Créer un compte</button>';
  $("#authMessage").textContent="";$("#authMessage").classList.remove("error");
}
function openAuth(mode="register", tier=null) {
  pendingTier=tier;
  setAuthMode(mode);
  showModal("authModal");
}
document.addEventListener("click",async e=>{
  const switchLogin=e.target.closest("#switchToLogin");
  const switchRegister=e.target.closest("#switchToRegister");
  if(switchLogin){setAuthMode("login");return}
  if(switchRegister){setAuthMode("register");return}
  if(e.target.closest("[data-close]")){hideModal("authModal");hideModal("memberModal");return}
  if(e.target.id==="openLogin"){openAuth("login");return}
  if(e.target.id==="openRegister"||e.target.id==="openRegister2"){openAuth("register");return}
  if(e.target.id==="openAccount"){await openMember();return}
  const buy=e.target.closest("[data-checkout]");
  if(buy){const tier=buy.dataset.checkout;if(currentUser){await beginCheckout(tier)}else{openAuth("register",tier);toast("Crée ton compte ou connecte-toi pour continuer.");}return}
  if(e.target.id==="logoutBtn"){
    try{await api("/api/logout",{method:"POST",body:"{}"});currentUser=null;updateNav();hideModal("memberModal");toast("Tu es déconnecté.");}
    catch(err){toast(err.message)}
  }
  if(e.target.classList.contains("download-support")) {
    e.preventDefault(); const id=e.target.dataset.id;
    try{
      const res=await fetch(`/api/support/${id}`,{credentials:"same-origin"});
      if(!res.ok){const d=await res.json().catch(()=>({}));throw new Error(d.error||"Téléchargement impossible.")}
      const blob=await res.blob();const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`AI-Creator-Lab-module-${id}.md`;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
    }catch(err){toast(err.message)}
  }
});
$$(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)hideModal(m.id)}));
document.addEventListener("keydown",e=>{if(e.key==="Escape"){$$(".modal.open").forEach(m=>hideModal(m.id))}});

$("#authForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const msg=$("#authMessage");msg.textContent="";msg.classList.remove("error");
  const button=$("#authSubmit");button.disabled=true;button.textContent="Un instant…";
  const body={name:$("#authName").value.trim(),email:$("#authEmail").value.trim(),password:$("#authPassword").value};
  try{
    const data=await api(authMode==="register"?"/api/register":"/api/login",{method:"POST",body:JSON.stringify(body)});
    currentUser=data.user;updateNav();hideModal("authModal");$("#authForm").reset();toast(data.message||"Bienvenue !");
    if(pendingTier){const tier=pendingTier;pendingTier=null;await beginCheckout(tier);}
    else if(currentUser.tier){await openMember();}
    else {toast("Compte créé. Choisis une offre pour débloquer les cours.");}
  }catch(err){msg.textContent=err.message;msg.classList.add("error");}
  finally{button.disabled=false;button.textContent=authMode==="register"?"Créer mon compte":"Se connecter";}
});
function updateNav(){
  $("#openLogin").classList.toggle("hidden",!!currentUser);
  $("#openRegister").classList.toggle("hidden",!!currentUser);
  $("#openAccount").classList.toggle("hidden",!currentUser);
  if(currentUser) $("#openAccount").textContent=currentUser.name.split(" ")[0]+" · Mon espace";
}
async function beginCheckout(tier){
  try{
    const data=await api("/api/checkout",{method:"POST",body:JSON.stringify({tier})});
    if(data.url) window.location.href=data.url;
  }catch(err){toast(err.message);if(err.message.includes("Connecte-toi"))openAuth("login",tier);}
}
function renderLesson(l,tier){
  const content=l.content.map(([title,body])=>`<h4>${escapeHtml(title)}</h4><p>${escapeHtml(body).replace(/\n\n/g,"</p><p>")}</p>`).join("");
  const agenda=l.agenda?`<div class="lesson-agenda"><h4>Déroulé conseillé — ${escapeHtml(l.time)}</h4><p>${escapeHtml(l.agenda)}</p></div>`:"";
  const template=l.template?`<h4>Modèle à compléter</h4><pre>${escapeHtml(l.template)}</pre>`:"";
  const download=tier==="creator"?`<p><a href="/api/support/${escapeHtml(l.id)}" class="download-support" data-id="${escapeHtml(l.id)}">↓ Télécharger le support complet du module</a></p>`:"";
  return `<details class="lesson-row"><summary><span class="member-pill">MODULE ${escapeHtml(l.id)}</span> ${escapeHtml(l.title)} <small>· ${escapeHtml(l.time)}</small></summary><p><strong>Objectif :</strong> ${escapeHtml(l.objective)}</p>${agenda}${content}<h4>Atelier pratique</h4><p>${escapeHtml(l.exercise)}</p><h4>Livrable attendu</h4><p>${escapeHtml(l.deliverable)}</p>${template}${download}</details>`;
}
async function openMember(){
  if(!currentUser){openAuth("login");return}
  showModal("memberModal");
  $("#memberHeading").textContent=`Espace de ${currentUser.name}`;
  $("#memberSummary").textContent=currentUser.tier?`Ton accès : ${currentUser.tier==="creator"?"Creator Pro — 249 €":"Starter — 99 €"}`:"Ton compte est créé. Choisis une offre pour débloquer les cours.";
  const content=$("#memberContent");content.innerHTML='<p class="muted">Chargement de ton espace…</p>';
  try{
    const status=await api("/api/status");
    currentUser=status.user;updateNav();
    if(!currentUser.tier){
      content.innerHTML=`<div class="empty-state"><h3>Aucun achat confirmé pour le moment</h3><p>Choisis une formule pour obtenir l'accès à la formation. Après le paiement, l'accès est activé automatiquement lorsque Stripe confirme la transaction.</p><p><button class="btn" data-checkout="starter">Choisir Starter — 99 €</button> <button class="btn" data-checkout="creator">Choisir Creator Pro — 249 €</button></p></div>`;
      return;
    }
    $("#memberSummary").innerHTML=`Accès actif : <span class="member-pill">${currentUser.tier==="creator"?"CREATOR PRO":"STARTER"}</span>`;
    const data=await api("/api/lessons");
    content.innerHTML=`<div class="course-intro"><h3>Ta formation : de l'idée à l'exécution</h3><p class="muted">Ouvre un module pour consulter la leçon et réaliser l'exercice associé. Il est conseillé d'avancer dans l'ordre.</p>${data.tier==="creator"?'<p class="member-pill">SUPPORTS TÉLÉCHARGEABLES INCLUS</p>':'<p class="muted">Les modèles téléchargeables sont inclus dans Creator Pro.</p>'}</div>${data.lessons.map(l=>renderLesson(l,data.tier)).join("")}<div class="empty-state"><strong>Conseil :</strong> conserve les livrables de chaque module et reviens chaque semaine sur tes hypothèses à la lumière des résultats.</div>`;
  }catch(err){content.innerHTML=`<div class="empty-state">${escapeHtml(err.message)}</div>`}
}
async function initialize(){
  try{const d=await api("/api/me");currentUser=d.user;updateNav()}catch{}
  const params=new URLSearchParams(location.search);
  if(params.get("payment")==="success"){
    toast("Paiement reçu. Vérification de l'activation de ton accès…");
    let tries=0;
    const poll=async()=>{
      tries++;
      try{
        const d=await api("/api/me");currentUser=d.user;updateNav();
        if(currentUser&&currentUser.tier){history.replaceState({}, "", "/");toast("Accès activé. Bienvenue dans la formation !");await openMember();return}
      }catch{}
      if(tries<8)setTimeout(poll,1500);
      else{history.replaceState({}, "", "/");toast("Le paiement est en cours de vérification. Recharge ton espace dans un instant.");if(currentUser)openMember()}
    };poll();
  } else if(params.get("payment")==="cancelled"){history.replaceState({}, "", "/");toast("Paiement annulé. Aucun accès n'a été débloqué.");}
}
initialize();
