import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Landmark, Users, FileText, MessageCircle, CalendarDays, Newspaper, Camera, Phone, Menu, X, ArrowRight, ArrowUpRight, Send, Mail, MapPin, Instagram, Youtube, ShieldCheck, Save, LogOut, Image as ImageIcon } from 'lucide-react'
import './style.css'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

const nav = [
  ['home','Bosh sahifa',Home],['about','Klub haqida',Landmark],
  ['membership','A’zolikka ariza',Users],['documents','Hujjatlar',FileText],
  ['feedback','Murojaatlar',MessageCircle],['events','Tadbirlar',CalendarDays],
  ['news','Yangiliklar',Newspaper],['gallery','Galereya',Camera],['contact','Bog‘lanish',Phone]
]
const defaults = {
  phone:'+998 00 000 00 00',
  telegram:'@Yoslar_parlamenti_bot',
  email:'info@youthparliament.uz',
  address:'Toshkent shahri',
  instagram:'',
  youtube:''
}
const formUrl='https://docs.google.com/forms/d/e/1FAIpQLSfBwqF-1CtsNfkWS9x8p5-1JMFbD8jIHB7Zf9z9e8pm3zbzMA/viewform?usp=dialog'

function Brand(){return <div className="brand"><div className="brand-mark"><Landmark size={22}/></div><div><b>YOUTH PARLIAMENT</b><span>CLUB · UZBEKISTAN</span></div></div>}
function App(){
 const [page,setPage]=useState('home'),[menu,setMenu]=useState(false)
 const [settings,setSettings]=useState(defaults),[session,setSession]=useState(null)
 const [email,setEmail]=useState(''),[password,setPassword]=useState('')
 const [notice,setNotice]=useState(''),[busy,setBusy]=useState(false)
 const [draft,setDraft]=useState(defaults)
 useEffect(()=>{loadSettings();supabase.auth.getSession().then(({data})=>setSession(data.session));const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s));return()=>subscription.unsubscribe()},[])
 async function loadSettings(){const {data,error}=await supabase.from('site_settings').select('setting_key,setting_value');if(!error&&data){const next={...defaults};data.forEach(r=>{next[r.setting_key]=r.setting_value||''});setSettings(next);setDraft(next)}}
 function go(p){setPage(p);setMenu(false);setNotice('');window.scrollTo({top:0,behavior:'smooth'})}
 async function login(e){e.preventDefault();setBusy(true);setNotice('');const {error}=await supabase.auth.signInWithPassword({email,password});setBusy(false);setNotice(error?'Kirish amalga oshmadi. Email va parolni tekshiring.':'Tizimga muvaffaqiyatli kirdingiz.')}
 async function save(){setBusy(true);setNotice('');for(const [key,value] of Object.entries(draft)){const {error}=await supabase.from('site_settings').upsert({setting_key:key,setting_value:value},{onConflict:'setting_key'});if(error){setNotice('Saqlashda xatolik: '+error.message);setBusy(false);return}}setSettings(draft);setBusy(false);setNotice('Ma’lumotlar saqlandi.')}
 async function logout(){await supabase.auth.signOut();go('home')}
 const pageTitle=nav.find(n=>n[0]===page)?.[1]||'Bosh sahifa'
 return <div className="app">
  <header className="topbar"><button className="icon-btn mobile-menu" onClick={()=>setMenu(!menu)}><Menu/></button><button className="brand-button" onClick={()=>go('home')}><Brand/></button><div className="top-links"><span>RASMIY KLUB PLATFORMASI</span><button onClick={()=>go('contact')}>Bog‘lanish <ArrowUpRight size={15}/></button></div></header>
  <AnimatePresence>{menu&&<motion.div className="mobile-nav" initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}}>{nav.map(([id,label,I])=><button key={id} onClick={()=>go(id)}><I size={18}/>{label}</button>)}</motion.div>}</AnimatePresence>
  <div className="shell"><aside className="sidebar"><div className="side-label">ASOSIY MENYU</div>{nav.map(([id,label,I])=><button key={id} className={`nav-item ${page===id?'active':''}`} onClick={()=>go(id)}><I size={18}/><span>{label}</span></button>)}<button className={`nav-item ${page==='admin'?'active':''}`} onClick={()=>go('admin')}><ShieldCheck size={18}/><span>Admin panel</span></button><div className="side-card"><div className="side-emblem"><Landmark/></div><b>Kelajak — bizning qo‘limizda.</b><p>Faol yoshlar, kuchli jamiyat va adolatli kelajak sari.</p><button onClick={()=>go('membership')}>Bizga qo‘shiling <ArrowRight size={14}/></button></div></aside>
  <main className="main"><AnimatePresence mode="wait"><motion.div key={page} className="page" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}>
   {page==='home'&&<><section className="hero"><div className="hero-content"><div className="eyebrow light">YOSHLAR PARLAMENTI KLUBI</div><h1>Kelajakni<br/><em>birgalikda</em> quramiz.</h1><p>Yoshlarning huquqiy salohiyati, yetakchiligi va tashabbuslarini birlashtiruvchi ochiq platforma.</p><div className="hero-actions"><button className="gold-btn" onClick={()=>go('membership')}>Klubga qo‘shilish <ArrowRight/></button><button className="ghost-btn" onClick={()=>go('about')}>Klub haqida <ArrowUpRight/></button></div></div></section><section className="welcome-row"><div><div className="eyebrow">BIZNING MAQSAD</div><h2>Yoshlar ovozi —<br/><em>jamiyat kelajagi.</em></h2></div><p>Yoshlarning huquqiy bilimini oshirish, ijtimoiy faolligini kuchaytirish va tashabbuslarini qo‘llab-quvvatlash.</p></section></>}
   {page==='about'&&<><PageHead kicker="BIZ HAQIMIZDA" title="G‘oya, maqsad va mas’uliyat." desc="Yoshlar parlamenti klubi — faol, bilimli va tashabbuskor yoshlarni birlashtiruvchi jamoaviy maydon."/><div className="two-col"><Info title="Bizning missiya" text="Yoshlarning huquqiy ongi va madaniyatini yuksaltirish, ularning jamiyat hayotidagi ishtirokini kengaytirish hamda tashabbuslarini qo‘llab-quvvatlash."/><Info title="Istiqboldagi maqsad" text="Yoshlar va davlat institutlari o‘rtasida muloqot ko‘prigini yaratish, yangi loyihalar va amaliy takliflarni ilgari surish."/></div></>}
   {page==='membership'&&<><PageHead kicker="JAMOAMIZGA QO‘SHILING" title="O‘zgarishlar sizdan boshlanadi." desc="Klub a’zoligiga ariza topshiring."/><a className="gold-btn link-btn" href={formUrl} target="_blank" rel="noreferrer">Anketani to‘ldirish <ArrowUpRight/></a></>}
   {page==='documents'&&<><PageHead kicker="RASMIY HUJJATLAR" title="Faoliyatimizning huquqiy asoslari." desc="Klub nizomi va konsepsiyasi bilan tanishing."/><div className="two-col"><Info title="NIZOM" text="Klubning maqsadi, vazifalari, a’zolik tartibi va boshqaruv mexanizmlari."/><Info title="KONSEPSIYA" text="Klubning strategik yo‘nalishlari va rivojlanish istiqbollari."/></div></>}
   {page==='feedback'&&<><PageHead kicker="OCHIQ MULOQOT" title="Sizning fikringiz biz uchun muhim." desc="Taklif, savol yoki murojaatingiz bormi? Biz bilan bog‘laning."/><a className="gold-btn link-btn" href={`https://t.me/${settings.telegram.replace('@','')}`} target="_blank" rel="noreferrer">Telegram orqali murojaat <Send/></a></>}
   {page==='events'&&<><PageHead kicker="KLUB KALENDARi" title="G‘oyalar uchrashadigan maydon." desc="Klub tadbirlari va uchrashuvlari haqidagi ma’lumotlar tez orada joylanadi."/></>}
   {page==='news'&&<><PageHead kicker="SO‘NGGI XABARLAR" title="Klub hayotidan yangiliklar." desc="Tashabbuslar, uchrashuvlar va klub faoliyatiga oid xabarlar tez orada joylanadi."/></>}
   {page==='gallery'&&<><PageHead kicker="FOTO LAVHALAR" title="Faoliyatimizdan lahzalar." desc="Klub tadbirlaridan fotolavhalar tez orada joylanadi."/></>}
   {page==='contact'&&<><PageHead kicker="BIZ BILAN BOG‘LANING" title="Muloqotga doim ochiqmiz." desc="Savol, taklif yoki hamkorlik yuzasidan biz bilan bog‘laning."/><div className="contact-grid"><Contact I={Phone} title="TELEFON" value={settings.phone}/><Contact I={Send} title="TELEGRAM" value={settings.telegram}/><Contact I={Mail} title="ELEKTRON POCHTA" value={settings.email}/><Contact I={MapPin} title="MANZIL" value={settings.address}/></div>{settings.instagram&&<p><Instagram/> {settings.instagram}</p>}{settings.youtube&&<p><Youtube/> {settings.youtube}</p>}</>}
   {page==='admin'&&<><PageHead kicker="BOSHQARUV" title="Admin panel" desc="Saytning aloqa ma’lumotlarini shu yerdan yangilashingiz mumkin."/>{!session?<form className="form-card" onSubmit={login}><label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Parol<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label><button className="gold-btn" disabled={busy}>Kirish</button></form>:<div className="form-card">{Object.entries(draft).map(([key,value])=><label>{key}<input value={value} onChange={e=>setDraft({...draft,[key]:e.target.value})}/></label>)}<button className="gold-btn" onClick={save} disabled={busy}><Save size={16}/> Saqlash</button><button className="ghost-btn" onClick={logout}><LogOut size={16}/> Chiqish</button></div>}{notice&&<p className="admin-notice">{notice}</p>}</>}
  </motion.div></AnimatePresence><footer className="footer"><Brand/><span>© 2026 Youth Parliament Club</span><button onClick={()=>go('home')}>YUQORIGA <ArrowUpRight size={14}/></button></footer></main></div>
 </div>
}
function PageHead({kicker,title,desc}){return <div className="page-head"><div className="eyebrow">{kicker}</div><h1>{title}</h1><p>{desc}</p></div>}
function Info({title,text}){return <article className="info-panel"><h2>{title}</h2><p>{text}</p></article>}
function Contact({I,title,value}){return <div className="contact-card"><div className="contact-icon"><I/></div><div className="eyebrow">{title}</div><h3>{value||'Kiritilmagan'}</h3></div>}
createRoot(document.getElementById('root')).render(<App/>)
