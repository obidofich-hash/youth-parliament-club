import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Landmark, Users, FileText, MessageCircle, CalendarDays, Newspaper, Camera, Phone, Menu, ArrowRight, ArrowUpRight, Send, Mail, MapPin, Instagram, Youtube, ShieldCheck, Save, LogOut, Plus, Trash2 } from 'lucide-react'
import './style.css'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)

const nav = [
 ['home','Bosh sahifa',Home],['about','Klub haqida',Landmark],
 ['membership','A’zolikka ariza',Users],['documents','Hujjatlar',FileText],
 ['feedback','Murojaatlar',MessageCircle],['events','Tadbirlar',CalendarDays],
 ['news','Yangiliklar',Newspaper],['gallery','Galereya',Camera],
 ['contact','Bog‘lanish',Phone]
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

function Brand(){
 return <div className="brand">
  <div className="brand-mark"><Landmark size={22}/></div>
  <div><b>YOUTH PARLIAMENT</b><span>CLUB · UZBEKISTAN</span></div>
 </div>
}
function PageHead({kicker,title,desc}){
 return <div className="page-head">
  <div className="eyebrow">{kicker}</div><h1>{title}</h1><p>{desc}</p>
 </div>
}
function Info({title,text}){
 return <article className="info-panel"><h2>{title}</h2><p>{text}</p></article>
}

function App(){
 const [page,setPage]=useState('home')
 const [menu,setMenu]=useState(false)
 const [settings,setSettings]=useState(defaults)
 const [draft,setDraft]=useState(defaults)
 const [session,setSession]=useState(null)
 const [email,setEmail]=useState('')
 const [password,setPassword]=useState('')
 const [notice,setNotice]=useState('')
 const [busy,setBusy]=useState(false)
 const [events,setEvents]=useState([])
 const [news,setNews]=useState([])
 const [gallery,setGallery]=useState([])
 const [item,setItem]=useState({title:'',description:'',event_date:'',image_url:''})
 const [uploading,setUploading]=useState(false)

 useEffect(()=>{
  loadSettings()
  loadContent()
  supabase.auth.getSession().then(({data})=>setSession(data.session))
  const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s))
  return()=>subscription.unsubscribe()
 },[])

 async function loadSettings(){
  const {data,error}=await supabase.from('site_settings').select('setting_key,setting_value')
  if(!error&&data){
   const next={...defaults}
   data.forEach(r=>{next[r.setting_key]=r.setting_value||''})
   setSettings(next)
   setDraft(next)
  }
 }
 async function loadContent(){
  const [e,n,g]=await Promise.all([
   supabase.from('club_events').select('*').order('event_date'),
   supabase.from('club_news').select('*').order('created_at',{ascending:false}),
   supabase.from('club_gallery').select('*').order('created_at',{ascending:false})
  ])
  if(!e.error)setEvents(e.data||[])
  if(!n.error)setNews(n.data||[])
  if(!g.error)setGallery(g.data||[])
 }
 function go(p){
  setPage(p)
  setMenu(false)
  setNotice('')
  window.scrollTo({top:0,behavior:'smooth'})
 }
  async function login(e){
  e.preventDefault()
  setBusy(true)
  setNotice('')
  const {error}=await supabase.auth.signInWithPassword({email,password})
  setBusy(false)
  setNotice(error?'Email yoki parol noto‘g‘ri.':'Muvaffaqiyatli kirdingiz.')
 }
 async function saveSettings(){
  setBusy(true)
  setNotice('')
  for(const [key,value] of Object.entries(draft)){
   const {error}=await supabase.from('site_settings').upsert(
    {setting_key:key,setting_value:value},
    {onConflict:'setting_key'}
   )
   if(error){
    setNotice('Xatolik: '+error.message)
    setBusy(false)
    return
   }
  }
  setSettings(draft)
  setBusy(false)
  setNotice('Ma’lumotlar saqlandi.')
 }
 async function logout(){
  await supabase.auth.signOut()
  go('home')
 }
 async function uploadImage(file){
  if(!file)return
  setUploading(true)
  const ext=file.name.split('.').pop()
  const path=Date.now()+'.'+ext
  const {error}=await supabase.storage.from('club-images').upload(path,file)
  if(error){
   setNotice('Rasm yuklanmadi: '+error.message)
   setUploading(false)
   return
  }
  const {data}=supabase.storage.from('club-images').getPublicUrl(path)
  setItem(v=>({...v,image_url:data.publicUrl}))
  setUploading(false)
  setNotice('Rasm yuklandi.')
 }
 async function addContent(type){
  if(!item.title.trim()){
   setNotice('Sarlavhani kiriting.')
   return
  }
  setBusy(true)
  const table={events:'club_events',news:'club_news',gallery:'club_gallery'}[type]
  const payload={
   title:item.title,
   description:item.description,
   image_url:item.image_url
  }
  if(type==='events')payload.event_date=item.event_date||null
  const {error}=await supabase.from(table).insert(payload)
  setBusy(false)
  if(error){
   setNotice('Xatolik: '+error.message)
   return
  }
  setItem({title:'',description:'',event_date:'',image_url:''})
  setNotice('Muvaffaqiyatli qo‘shildi.')
  loadContent()
 }
 async function deleteContent(type,id){
  const table={events:'club_events',news:'club_news',gallery:'club_gallery'}[type]
  const {error}=await supabase.from(table).delete().eq('id',id)
  setNotice(error?'O‘chirishda xatolik.':'O‘chirildi.')
  if(!error)loadContent()
 }

 const contentForm=(type,label)=>(
  <div className="form-card">
   <h2>{label} qo‘shish</h2>
   <label>Sarlavha
    <input value={item.title} onChange={e=>setItem({...item,title:e.target.value})}/>
   </label>
   {type==='events'&&<label>Sana
    <input type="datetime-local" value={item.event_date}
     onChange={e=>setItem({...item,event_date:e.target.value})}/>
   </label>}
   {type!=='gallery'&&<label>Ma’lumot
    <textarea value={item.description} rows="3"
     onChange={e=>setItem({...item,description:e.target.value})}/>
   </label>}
   <label>Rasm
    <input type="file" accept="image/*"
     onChange={e=>uploadImage(e.target.files?.[0])}/>
   </label>
   {item.image_url&&<img src={item.image_url} alt="Yuklangan rasm" width="180"/>}
   <button className="gold-btn" disabled={busy||uploading}
    onClick={()=>addContent(type)}>
    <Plus size={16}/> Saqlash
   </button>
  </div>
 ); const contentList=(type,rows)=>(
  <div className="two-col">
   {rows.map(row=>(
    <article className="info-panel" key={row.id}>
     {row.image_url&&<img src={row.image_url} alt={row.title}
      style={{width:'100%',maxHeight:'220px',objectFit:'cover'}}/>}
     <h2>{row.title}</h2>
     <p>{row.description}</p>
     {row.event_date&&<p>{new Date(row.event_date).toLocaleString('uz-UZ')}</p>}
     {session&&<button className="ghost-btn"
      onClick={()=>deleteContent(type,row.id)}>
      <Trash2 size={15}/> O‘chirish
     </button>}
    </article>
   ))}
  </div>
 )

 return (
  <div className="app">
   <header className="topbar">
    <button className="brand-button" onClick={()=>go('home')}><Brand/></button>
    <div className="top-links">
     <span>RASMIY KLUB PLATFORMASI</span>
     <button onClick={()=>go('contact')}>Bog‘lanish <ArrowUpRight size={15}/></button>
    </div>
   </header>

   <div className="shell">
    <aside className="sidebar">
     <div className="side-label">ASOSIY MENYU</div>
     {nav.map(([id,label,I])=>(
      <button key={id} className={`nav-item ${page===id?'active':''}`}
       onClick={()=>go(id)}>
       <I size={18}/><span>{label}</span>
      </button>
     ))}
     <button className={`nav-item ${page==='admin'?'active':''}`}
      onClick={()=>go('admin')}>
      <ShieldCheck size={18}/><span>Admin panel</span>
     </button>
     <div className="side-card">
      <div className="side-emblem"><Landmark/></div>
      <b>Kelajak — bizning qo‘limizda.</b>
      <p>Faol yoshlar, kuchli jamiyat va adolatli kelajak sari.</p>
      <button onClick={()=>go('membership')}>Bizga qo‘shiling <ArrowRight size={14}/></button>
     </div>
    </aside>

    <main className="main">
     <AnimatePresence mode="wait">
      <motion.div key={page} className="page"
       initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
       exit={{opacity:0,y:-8}}>

       {page==='home'&&<>
        <section className="hero">
         <div className="hero-content">
          <div className="eyebrow light">YOSHLAR PARLAMENTI KLUBI</div>
          <h1>Kelajakni<br/><em>birgalikda</em> quramiz.</h1>
          <p>Yoshlarning huquqiy salohiyati, yetakchiligi va tashabbuslarini birlashtiruvchi ochiq platforma.</p>
          <div className="hero-actions">
           <button className="gold-btn" onClick={()=>go('membership')}>Klubga qo‘shilish <ArrowRight/></button>
           <button className="ghost-btn" onClick={()=>go('about')}>Klub haqida <ArrowUpRight/></button>
          </div>
         </div>
        </section>
        <section className="welcome-row">
         <div><div className="eyebrow">BIZNING MAQSAD</div>
          <h2>Yoshlar ovozi —<br/><em>jamiyat kelajagi.</em></h2></div>
         <p>Yoshlarning huquqiy bilimini oshirish, ijtimoiy faolligini kuchaytirish va tashabbuslarini qo‘llab-quvvatlash.</p>
        </section>
       </>}

       {page==='about'&&<>
        <PageHead kicker="BIZ HAQIMIZDA" title="G‘oya, maqsad va mas’uliyat."
         desc="Yoshlar parlamenti klubi — faol, bilimli va tashabbuskor yoshlarni birlashtiruvchi jamoaviy maydon."/>
        <div className="two-col">
         <Info title="Bizning missiya" text="Yoshlarning huquqiy ongi va madaniyatini yuksaltirish, ularning jamiyat hayotidagi ishtirokini kengaytirish."/>
         <Info title="Istiqboldagi maqsad" text="Yoshlar va davlat institutlari o‘rtasida muloqot ko‘prigini yaratish."/>
        </div>
       </>}

       {page==='membership'&&<>
        <PageHead kicker="JAMOAMIZGA QO‘SHILING" title="O‘zgarishlar sizdan boshlanadi."
         desc="Klub a’zoligiga ariza topshiring."/>
        <a className="gold-btn link-btn" href={formUrl} target="_blank" rel="noreferrer">Anketani to‘ldirish <ArrowUpRight/></a>
       </>}

       {page==='documents'&&<>
        <PageHead kicker="RASMIY HUJJATLAR" title="Faoliyatimizning huquqiy asoslari."
         desc="Klub nizomi va konsepsiyasi bilan tanishing."/>
        <div className="two-col">
         <Info title="NIZOM" text="Klubning maqsadi, vazifalari va a’zolik tartibi."/>
         <Info title="KONSEPSIYA" text="Klubning strategik yo‘nalishlari va rivojlanish istiqbollari."/>
        </div>
       </>}

       {page==='feedback'&&<>
        <PageHead kicker="OCHIQ MULOQOT" title="Sizning fikringiz biz uchun muhim."
         desc="Taklif, savol yoki murojaatingiz bormi?"/>
        <a className="gold-btn link-btn" href={`https://t.me/${settings.telegram.replace('@','')}`} target="_blank" rel="noreferrer">Telegram orqali murojaat <Send/></a>
       </>}

       {page==='events'&&<>
        <PageHead kicker="KLUB KALENDARi" title="G‘oyalar uchrashadigan maydon." desc="Klub tadbirlari va uchrashuvlari."/>
        {contentList('events',events)}
       </>}

       {page==='news'&&<>
        <PageHead kicker="SO‘NGGI XABARLAR" title="Klub hayotidan yangiliklar." desc="Tashabbuslar va klub faoliyatiga oid xabarlar."/>
        {contentList('news',news)}
       </>}

       {page==='gallery'&&<>
        <PageHead kicker="FOTO LAVHALAR" title="Faoliyatimizdan lahzalar." desc="Klub tadbirlaridan fotolavhalar."/>
        {contentList('gallery',gallery)}
       </>}

       {page==='contact'&&<>
        <PageHead kicker="BIZ BILAN BOG‘LANING" title="Muloqotga doim ochiqmiz." desc="Savol, taklif yoki hamkorlik yuzasidan bog‘laning."/>
        <div className="contact-grid">
         <div className="contact-card"><Phone/><div className="eyebrow">TELEFON</div><h3>{settings.phone}</h3></div>
         <div className="contact-card"><Send/><div className="eyebrow">TELEGRAM</div><h3>{settings.telegram}</h3></div>
         <div className="contact-card"><Mail/><div className="eyebrow">EMAIL</div><h3>{settings.email}</h3></div>
         <div className="contact-card"><MapPin/><div className="eyebrow">MANZIL</div><h3>{settings.address}</h3></div>
        </div>
       </>}       {page==='admin'&&<>
        <PageHead kicker="BOSHQARUV" title="Admin panel"
         desc="Sayt ma’lumotlari, yangiliklar, tadbirlar va galereyani boshqaring."/>
        {!session?
         <form className="form-card" onSubmit={login}>
          <label>Email<input type="email" value={email}
           onChange={e=>setEmail(e.target.value)} required/></label>
          <label>Parol<input type="password" value={password}
           onChange={e=>setPassword(e.target.value)} required/></label>
          <button className="gold-btn" disabled={busy}>Kirish</button>
         </form>
         :
         <>
          <div className="form-card">
           <h2>Aloqa ma’lumotlari</h2>
           {Object.entries(draft).map(([key,value])=>(
            <label key={key}>{key}
             <input value={value}
              onChange={e=>setDraft({...draft,[key]:e.target.value})}/>
            </label>
           ))}
           <button className="gold-btn" onClick={saveSettings} disabled={busy}>
            <Save size={16}/> Saqlash
           </button>
           <button className="ghost-btn" onClick={logout}>
            <LogOut size={16}/> Chiqish
           </button>
          </div>
          <div className="two-col">
           {contentForm('news','Yangilik')}
           {contentForm('events','Tadbir')}
           {contentForm('gallery','Galereya rasmi')}
          </div>
         </>
        }
        {notice&&<p className="admin-notice">{notice}</p>}
       </>}
      </motion.div>
     </AnimatePresence>

     <footer className="footer">
      <Brand/>
      <span>© 2026 Youth Parliament Club</span>
      <button onClick={()=>go('home')}>YUQORIGA <ArrowUpRight size={14}/></button>
     </footer>
    </main>
   </div>
  </div>
 )
}

createRoot(document.getElementById('root')).render(<App/>)
