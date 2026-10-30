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
