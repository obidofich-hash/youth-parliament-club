import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Landmark, Users, FileText, MessageCircle, CalendarDays, Newspaper, Camera, Phone, Menu, X, ArrowRight, ArrowUpRight, Send, Mail, MapPin, Instagram, Youtube, ShieldCheck, Save, LogOut, Image as ImageIcon, Plus, Trash2, Upload } from 'lucide-react'
import './style.css'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)

const nav = [
  ['home','Bosh sahifa',Home],['about','Klub haqida',Landmark],
  ['membership','A’zolikka ariza',Users],['documents','Hujjatlar',FileText],
  ['feedback','Murojaatlar',MessageCircle],['events','Tadbirlar',CalendarDays],
  ['news','Yangiliklar',Newspaper],['gallery','Galereya',Camera],['contact','Bog‘lanish',Phone]
]
const defaults = { phone:'+998 00 000 00 00', telegram:'@Yoslar_parlamenti_bot', email:'info@youthparliament.uz', address:'Toshkent shahri', instagram:'', youtube:'' }
const formUrl='https://docs.google.com/forms/d/e/1FAIpQLSfBwqF-1CtsNfkWS9x8p5-1JMFbD8jIHB7Zf9z9e8pm3zbzMA/viewform?usp=dialog'

function Brand(){return <div className="brand"><div className="brand-mark"><Landmark size={22}/></div><div><b>YOUTH PARLIAMENT</b><span>CLUB · UZBEKISTAN</span></div></div>}
function PageHead({kicker,title,desc}){return <div className="page-head"><div className="eyebrow">{kicker}</div><h1>{title}</h1><p>{desc}</p></div>}
function Info({title,text}){return <article className="info-panel"><h2>{title}</h2><p>{text}</p></article>}
function Contact({I,title,value}){return <div className="contact-card"><div className="contact-icon"><I/></div><div className="eyebrow">{title}</div><h3>{value||'Kiritilmagan'}</h3></div>}

function App(){
 const [page,setPage]=useState('home'),[menu,setMenu]=useState(false)
 const [settings,setSettings]=useState(defaults),[draft,setDraft]=useState(defaults)
 const [session,setSession]=useState(null),[email,setEmail]=useState(''),[password,setPassword]=useState('')
 const [notice,setNotice]=useState(''),[busy,setBusy]=useState(false)
 const [events,setEvents]=useState([]),[news,setNews]=useState([]),[gallery,setGallery]=useState([])
 const [item,setItem]=useState({title:'',description:'',event_date:'',image_url:''})
 const [uploading,setUploading]=useState(false)

 useEffect(()=>{
  loadSettings(); loadContent()
  supabase.auth.getSession().then(({data})=>setSession(data.session))
  const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s))
  return()=>subscription.unsubscribe()
 },[])
 async function loadSettings(){
  const {data,error}=await supabase.from('site_settings').select('setting_key,setting_value')
  if(!error&&data){const next={...defaults};data.forEach(r=>{next[r.setting_key]=r.setting_value||''});setSettings(next);setDraft(next)}
 }
 async function loadContent(){
  const [e,n,g]=await Promise.all([
   supabase.from('club_events').select('*').order('event_date',{ascending:true}),
   supabase.from('club_news').select('*').order('created_at',{ascending:false}),
   supabase.from('club_gallery').select('*').order('created_at',{ascending:false})
  ])
  if(!e.error)setEvents(e.data||[])
  if(!n.error)setNews(n.data||[])
  if(!g.error)setGallery(g.data||[])
 }
 function go(p){setPage(p);setMenu(false);setNotice('');window.scrollTo({top:0,behavior:'smooth'})}
 async function login(e){e.preventDefault();setBusy(true);setNotice('');const {error}=await supabase.auth.signInWithPassword({email,password});setBusy(false);setNotice(error?'Kirish amalga oshmadi. Email va parolni tekshiring.':'Tizimga muvaffaqiyatli kirdingiz.')}
 async function saveSettings(){
  setBusy(true);setNotice('')
  for(const [key,value] of Object.entries(draft)){
   const {error}=await supabase.from('site_settings').upsert({setting_key:key,setting_value:value},{onConflict:'setting_key'})
   if(error){setNotice('Saqlashda xatolik: '+error.message);setBusy(false);return}
  }
  setSettings(draft);setBusy(false);setNotice('Aloqa ma’lumotlari saqlandi.')
 }
 async function logout(){await supabase.auth.signOut();go('home')}
 async function uploadImage(file){
  if(!file)return
  setUploading(true);setNotice('')
  const ext=file.name.split('.').pop()
  const path=`${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const {error}=await supabase.storage.from('club-images').upload(path,file,{upsert:false})
  if(error){setNotice('Rasm yuklashda xatolik: '+error.message);setUploading(false);return}
  const {data}=supabase.storage.from('club-images').getPublicUrl(path)
  setItem(v=>({...v,image_url:data.publicUrl}))
  setUploading(false);setNotice('Rasm yuklandi. Endi saqlashingiz mumkin.')
 }
 async function addContent(type){
  if(!item.title.trim()){setNotice('Sarlavhani kiriting.');return}
  setBusy(true);setNotice('')
  const table=type==='events'?'club_events':type==='news'?'club_news':'club_gallery'
  const payload={title:item.title,description:item.description,image_url:item.image_url}
  if(type==='events')payload.event_date=item.event_date||null
  const {error}=await supabase.from(table).insert(payload)
  setBusy(false)
  if(error){setNotice('Saqlashda xatolik: '+error.message);return}
  setItem({title:'',description:'',event_date:'',image_url:''})
  setNotice('Kontent muvaffaqiyatli qo‘shildi.')
  loadContent()
 }
 async function deleteContent(type,id){
  const table=type==='events'?'club_events':type==='news'?'club_news':'club_gallery'
  const {error}=await supabase.from(table).delete().eq('id',id)
  setNotice(error?'O‘chirishda xatolik: '+error.message:'Kontent o‘chirildi.')
  if(!error)loadContent()
 }
 const pageTitle=nav.find(n=>n[0]===page)?.[1]||'Bosh sahifa'
 const contentForm=(type,label)=><div className="form-card">
  <h2>{label} qo‘shish</h2>
