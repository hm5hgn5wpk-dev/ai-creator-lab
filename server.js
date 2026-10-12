require("dotenv").config();
const express = require("express");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const Stripe = require("stripe");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const BASE_URL = (process.env.BASE_URL || `http://localhost:${PORT}`).replace(/\/$/, "");
const isProd = process.env.NODE_ENV === "production";
if (isProd && (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32 || process.env.SESSION_SECRET.includes("CHANGE"))) {
  throw new Error("En production, SESSION_SECRET doit être défini avec au moins 32 caractères aléatoires.");
}
if (isProd && !BASE_URL.startsWith("https://")) {
  throw new Error("En production, BASE_URL doit utiliser HTTPS.");
}
const lessons = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "lessons.json"), "utf8"));
const dbPath = process.env.DATABASE_FILE || "./data/app.sqlite";
fs.mkdirSync(path.dirname(path.resolve(dbPath)), { recursive: true });
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.exec(`
CREATE TABLE IF NOT EXISTS users (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT NOT NULL,
 email TEXT NOT NULL UNIQUE,
 password_hash TEXT NOT NULL,
 tier TEXT,
 paid_at TEXT,
 stripe_customer_id TEXT,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS payments (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 user_id INTEGER NOT NULL,
 stripe_session_id TEXT NOT NULL UNIQUE,
 tier TEXT NOT NULL,
 amount INTEGER NOT NULL,
 currency TEXT NOT NULL,
 status TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(user_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS stripe_events (
 event_id TEXT PRIMARY KEY,
 received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`);
const stripe = process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes("REMPLACE_MOI")
  ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

app.disable("x-powered-by");
app.use(helmet({ contentSecurityPolicy: false }));
app.use((req,res,next) => {
  res.setHeader("X-Content-Type-Options","nosniff");
  res.setHeader("Referrer-Policy","strict-origin-when-cross-origin");
  next();
});

// Stripe requires the raw request body for signature verification.
app.post("/webhooks/stripe", express.raw({type:"application/json"}), (req,res) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET.includes("REMPLACE_MOI")) {
    return res.status(503).send("Webhook Stripe non configuré.");
  }
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Signature webhook invalide:", err.message);
    return res.status(400).send("Signature webhook invalide.");
  }
  const already = db.prepare("SELECT event_id FROM stripe_events WHERE event_id=?").get(event.id);
  if (already) return res.json({ received:true, duplicate:true });

  try {
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const checkout = event.data.object;
      if (checkout.payment_status === "paid") {
        const userId = Number(checkout.metadata && checkout.metadata.userId);
        const tier = checkout.metadata && checkout.metadata.tier;
        const validTier = ["starter","creator"].includes(tier);
        const amount = Number(checkout.amount_total || 0);
        const currency = String(checkout.currency || "eur").toLowerCase();
        const expectedAmount = tier === "starter" ? 9900 : 24900;
        if (userId && validTier && amount === expectedAmount && currency === "eur") {
          const tx = db.transaction(() => {
            db.prepare(`INSERT INTO payments
              (user_id,stripe_session_id,tier,amount,currency,status) VALUES (?,?,?,?,?,?)
              ON CONFLICT(stripe_session_id) DO UPDATE SET amount=excluded.amount,
              currency=excluded.currency,status='paid'`)
              .run(userId, checkout.id, tier, amount, currency, "paid");
            const current = db.prepare("SELECT tier FROM users WHERE id=?").get(userId);
            const rank = {starter:1, creator:2};
            if (current && (rank[tier] > (rank[current.tier] || 0))) {
              db.prepare("UPDATE users SET tier=?, paid_at=CURRENT_TIMESTAMP, stripe_customer_id=COALESCE(?,stripe_customer_id) WHERE id=?")
                .run(tier, checkout.customer || null, userId);
            }
          });
          tx();
        }
      }
    }
    db.prepare("INSERT INTO stripe_events(event_id) VALUES (?)").run(event.id);
    res.json({received:true});
  } catch (err) {
    console.error("Erreur traitement webhook:", err);
    res.status(500).send("Erreur traitement webhook.");
  }
});

app.use(express.json({limit:"100kb"}));
app.use(express.urlencoded({extended:false,limit:"20kb"}));
app.use(session({
  name:"acl.sid",
  store:new SQLiteStore({db:"sessions.sqlite", dir:path.dirname(path.resolve(dbPath))}),
  secret:process.env.SESSION_SECRET || "dev-only-change-this-secret-before-deploying",
  resave:false,
  saveUninitialized:false,
  cookie:{httpOnly:true, sameSite:"lax", secure:isProd, maxAge:1000*60*60*24*7}
}));

const authLimiter = rateLimit({windowMs:15*60*1000,limit:12,standardHeaders:true,legacyHeaders:false,message:{error:"Trop de tentatives. Réessaie dans quelques minutes."}});
function safeUser(user) {
  return user ? {id:user.id,name:user.name,email:user.email,tier:user.tier || null,paidAt:user.paid_at || null} : null;
}
function getUser(req) {
  return req.session.userId ? db.prepare("SELECT * FROM users WHERE id=?").get(req.session.userId) : null;
}
function requireAuth(req,res,next) {
  const user=getUser(req);
  if (!user) return res.status(401).json({error:"Connecte-toi pour continuer."});
  req.user=user; next();
}
function requireCourse(req,res,next) {
  if (!req.user || !["starter","creator"].includes(req.user.tier)) return res.status(403).json({error:"Cette leçon est réservée aux membres ayant acheté la formation."});
  next();
}
function originGuard(req,res,next) {
  const origin=req.get("origin");
  if (origin && origin !== BASE_URL) return res.status(403).json({error:"Origine non autorisée."});
  next();
}
app.use("/api", originGuard);

app.post("/api/register",authLimiter, async (req,res) => {
  const name=String(req.body.name||"").trim().slice(0,80);
  const email=String(req.body.email||"").trim().toLowerCase().slice(0,254);
  const password=String(req.body.password||"");
  if (name.length<2) return res.status(400).json({error:"Indique ton prénom ou nom d'affichage."});
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({error:"Adresse e-mail invalide."});
  if (password.length<10 || password.length>200) return res.status(400).json({error:"Choisis un mot de passe d'au moins 10 caractères."});
  const existing=db.prepare("SELECT id FROM users WHERE email=?").get(email);
  if (existing) return res.status(409).json({error:"Un compte existe déjà avec cet e-mail. Connecte-toi."});
  const hash=await bcrypt.hash(password,12);
  try {
    const result=db.prepare("INSERT INTO users(name,email,password_hash) VALUES(?,?,?)").run(name,email,hash);
    req.session.userId=Number(result.lastInsertRowid);
    res.json({user:{id:Number(result.lastInsertRowid),name,email,tier:null},message:"Compte créé. Tu peux maintenant choisir ton accès."});
  } catch(e) { res.status(500).json({error:"Impossible de créer le compte pour le moment."}); }
});
app.post("/api/login",authLimiter, async (req,res) => {
  const email=String(req.body.email||"").trim().toLowerCase();
  const password=String(req.body.password||"");
  const user=db.prepare("SELECT * FROM users WHERE email=?").get(email);
  if (!user || !(await bcrypt.compare(password,user.password_hash))) return res.status(401).json({error:"E-mail ou mot de passe incorrect."});
  req.session.regenerate(err=>{
    if(err) return res.status(500).json({error:"Impossible d'ouvrir la session."});
    req.session.userId=user.id;
    res.json({user:safeUser(user),message:"Connexion réussie."});
  });
});
app.post("/api/logout",(req,res)=>req.session.destroy(()=>{res.clearCookie("acl.sid",{httpOnly:true,sameSite:"lax",secure:isProd});res.json({ok:true});}));
app.get("/api/me",(req,res)=>res.json({user:safeUser(getUser(req))}));
app.get("/api/status",requireAuth,(req,res)=>{
  const user=getUser(req);
  const payment=db.prepare("SELECT tier,amount,currency,status,created_at FROM payments WHERE user_id=? AND status='paid' ORDER BY id DESC LIMIT 5").all(user.id);
  res.json({user:safeUser(user),payments,configured:Boolean(stripe && process.env.STRIPE_WEBHOOK_SECRET && process.env.STRIPE_PRICE_STARTER && process.env.STRIPE_PRICE_CREATOR)});
});
app.post("/api/checkout",requireAuth,async (req,res)=>{
  if (!stripe) return res.status(503).json({error:"Le paiement n'est pas encore configuré. Ajoute les clés Stripe dans le fichier .env."});
  const tier=String(req.body.tier||"");
  if (!["starter","creator"].includes(tier)) return res.status(400).json({error:"Offre inconnue."});
  if (req.user.tier==="creator" || (req.user.tier==="starter" && tier==="starter")) return res.status(409).json({error:"Ton compte possède déjà cet accès ou un accès supérieur."});
  const priceId=tier==="starter"?process.env.STRIPE_PRICE_STARTER:process.env.STRIPE_PRICE_CREATOR;
  if (!priceId || priceId.includes("REMPLACE_MOI")) return res.status(503).json({error:"Les prix Stripe ne sont pas encore configurés."});
  try {
    const checkout=await stripe.checkout.sessions.create({
      mode:"payment",
      payment_method_types:["card"],
      line_items:[{price:priceId,quantity:1}],
      customer_email:req.user.email,
      client_reference_id:String(req.user.id),
      metadata:{userId:String(req.user.id),tier},
      payment_intent_data:{metadata:{userId:String(req.user.id),tier}},
      success_url:`${BASE_URL}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:`${BASE_URL}/?payment=cancelled`,
      allow_promotion_codes:false
    });
    db.prepare("INSERT OR IGNORE INTO payments(user_id,stripe_session_id,tier,amount,currency,status) VALUES(?,?,?,?,?,?)")
      .run(req.user.id,checkout.id,tier,tier==="starter"?9900:24900,"eur","pending");
    res.json({url:checkout.url});
  } catch(err) {
    console.error("Stripe checkout:",err.message);
    res.status(502).json({error:"Impossible de créer la session de paiement. Vérifie la configuration Stripe."});
  }
});
app.get("/api/lessons",requireAuth,requireCourse,(req,res)=>{
  const bonus=req.user.tier==="creator";
  res.json({tier:req.user.tier,lessons:lessons.map(l=>({
    id:l.id,title:l.title,time:l.time,objective:l.objective,content:l.content,exercise:l.exercise,deliverable:l.deliverable,
    template:bonus?l.template:null
  })),bonus});
});
app.get("/api/support/:id",requireAuth,requireCourse,(req,res)=>{
  const id=String(req.params.id||"").padStart(2,"0");
  const lesson=lessons.find(l=>l.id===id);
  if(!lesson) return res.status(404).json({error:"Support introuvable."});
  if(req.user.tier!=="creator") return res.status(403).json({error:"Les modèles téléchargeables sont inclus dans l'offre Creator Pro."});
  const content=`# Module ${lesson.id} — ${lesson.title}\n\n## Objectif\n${lesson.objective}\n\n${lesson.content.map(c=>`## ${c[0]}\n${c[1]}`).join("\n\n")}\n\n## Exercice\n${lesson.exercise}\n\n## Livrable\n${lesson.deliverable}\n\n## Modèle à compléter\n${lesson.template}\n`;
  res.setHeader("Content-Type","text/markdown; charset=utf-8");
  res.setHeader("Content-Disposition",`attachment; filename="AI-Creator-Lab-module-${id}.md"`);
  res.send(content);
});

app.use(express.static(path.join(__dirname,"public"),{extensions:["html"]}));
app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
app.listen(PORT, "0.0.0.0", () => console.log(`AI Creator Lab prêt sur le port ${PORT}`));
