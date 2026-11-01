import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'
import {
Home, Landmark, Users, FileText, MessageCircle, CalendarDays, Newspaper,
Camera, Phone, Menu, ArrowRight, ArrowUpRight, Send, Mail, MapPin,
Instagram, Youtube, ShieldCheck, Save, LogOut, Plus, Trash2,
Image as ImageIcon
} from 'lucide-react'
import './style.css'

const supabase = createClient(
import.meta.env.VITE_SUPABASE_URL,
import.meta.env.VITE_SUPABASE_ANON_KEY
)

const defaults = {
phone: '+998 00 000 00 00',
telegram: '@Yoslar_parlamenti_bot',
email: 'info@youthparliament.uz',
address: 'Toshkent shahri',
instagram: '',
youtube: '',
hero_image: '',
club_logo: '',
home_image: '',
about_image: '',
hero_line1: 'Kelajakni',
hero_emphasis: 'birgalikda',
hero_line2: 'quramiz.',
hero_description: 'Yoshlarning huquqiy salohiyati, yetakchiligi va tashabbuslarini birlashtiruvchi ochiq platforma.',

welcome_line1: 'Yoshlar ovozi —',
welcome_line2: 'jamiyat kelajagi.',
welcome_description: 'Yoshlarning huquqiy bilimini oshirish, ijtimoiy faolligini kuchaytirish va tashabbuslarini qo‘llab-quvvatlash.'
}

const nav = [
['home', 'Bosh sahifa', Home],
['about', 'Klub haqida', Landmark],
['membership', 'A’zolikka ariza', Users],
['documents', 'Hujjatlar', FileText],
['feedback', 'Murojaatlar', MessageCircle],
['events', 'Tadbirlar', CalendarDays],
['news', 'Yangiliklar', Newspaper],
['gallery', 'Galereya', Camera],
['contact', 'Bog‘lanish', Phone]
]

const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfBwqF-1CtsNfkWS9x8p5-1JMFbD8jIHB7Zf9z9e8pm3zbzMA/viewform?usp=dialog'

function Brand({ logo }) {
return (
<span className="brand">
{logo
? <img src={logo} alt="Klub logotipi" className="brand-logo" />
: <span className="brand-icon"><Landmark size={25} /></span>}
<span className="brand-copy">
<strong>YOSHLAR PARLAMENTI</strong>
<small>KLUBI</small>
</span>
</span>
)
}

function PageHead({ kicker, title, desc }) {
return (
<div className="page-head">
<div className="eyebrow">{kicker}</div>
<h1>{title}</h1>
{desc && <p>{desc}</p>}
</div>
)
}

function Info({ title, text }) {
return (
<article className="info-panel">
<h2>{title}</h2>
<p>{text}</p>
</article>
)
}

function Contact({ I, title, value }) {
return (
<article className="contact-card">
<I size={22} />
<div>
<small>{title}</small>
<p>{value || 'Kiritilmagan'}</p>
</div>
</article>
)
}

function App() {
const [page, setPage] = useState('home')
const [menu, setMenu] = useState(false)
const [session, setSession] = useState(null)
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [settings, setSettings] = useState(defaults)
const [draft, setDraft] = useState(defaults)
const [events, setEvents] = useState([])
const [news, setNews] = useState([])
const [gallery, setGallery] = useState([])
const [item, setItem] = useState({
title: '',
description: '',
event_date: '',
image_url: ''
})
const [busy, setBusy] = useState(false)
const [uploading, setUploading] = useState(null)
const emptyApplication = {
  full_name: '',
  phone: '',
  birth_date: '',
  university: '',
  faculty: '',
  study_direction: '',
  course: '',
  group_number: '',
  email: '',
  motivation: '',
  activity_direction: '',
  activity_other: '',
  confirmation: ''
}
const [application, setApplication] = useState(emptyApplication)
const [applicationBusy, setApplicationBusy] = useState(false)
const [applicationMessage, setApplicationMessage] = useState('')
const [applicationSuccess, setApplicationSuccess] = useState('')
const [applications, setApplications] = useState([])
const [notice, setNotice] = useState('')
const [editing,setEditing] = useState(null)
useEffect(() => {
loadSettings()
loadContent()

supabase.auth.getSession().then(({ data }) => {
setSession(data.session)
})

const {
data: { subscription }
} = supabase.auth.onAuthStateChange((_event, currentSession) => {
setSession(currentSession)
})

return () => subscription.unsubscribe()
}, [])
useEffect(() => {
  if (session) {
    loadApplications()
  }
}, [session])
async function loadSettings() {
const { data, error } = await supabase
.from('site_settings')
.select('setting_key,setting_value')

if (!error && data) {
const next = { ...defaults }

data.forEach(row => {
next[row.setting_key] = row.setting_value || ''
})

setSettings(next)
setDraft(next)
}
}

async function loadContent() {
const [eventResult, newsResult, galleryResult] = await Promise.all([
supabase.from('club_events').select('*').order('event_date', { ascending: true }),
supabase.from('club_news').select('*').order('created_at', { ascending: false }),
supabase.from('club_gallery').select('*').order('created_at', { ascending: false })
])

if (!eventResult.error) setEvents(eventResult.data || [])
if (!newsResult.error) setNews(newsResult.data || [])
if (!galleryResult.error) setGallery(galleryResult.data || [])
}

async function loadApplications() {
  const { data, error } = await supabase
    .from('club_applications')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    setNotice('Arizalarni yuklashda xatolik: ' + error.message)
    return
  }

  setApplications(data || [])
}
function go(nextPage) {
setPage(nextPage)
setMenu(false)
setNotice('')
window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function submitApplication(event) {
  event.preventDefault()
  setApplicationBusy(true)
  setApplicationMessage('')

  if (application.confirmation !== 'Ha, tasdiqlayman') {
    setApplicationMessage('Ma’lumotlarni tasdiqlashingiz kerak.')
    setApplicationBusy(false)
    return
  }

 const applicationCode = 'YPC-' + crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()

const { error } = await supabase
  .from('club_applications')
  .insert([{ ...application, application_code: applicationCode }])

  setApplicationBusy(false)

  if (error) {
    setApplicationMessage('Xatolik: ' + error.message)
    return
  }

setApplicationMessage('')
setApplicationSuccess(applicationCode)
setApplication(emptyApplication)
}
async function login(event) {
event.preventDefault()
setBusy(true)
setNotice('')

const { error } = await supabase.auth.signInWithPassword({
email,
password
})

setBusy(false)

setNotice(
error
? 'Kirish amalga oshmadi. Email va parolni tekshiring.'
: 'Tizimga muvaffaqiyatli kirdingiz.'
)
}
async function googleLogin() {
  setBusy(true)
  setNotice('')

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  })

  if (error) {
    setNotice('Google orqali kirishda xatolik: ' + error.message)
    setBusy(false)
  }
}
async function saveSettings() {
setBusy(true)
setNotice('')

for (const [key, value] of Object.entries(draft)) {
const { error } = await supabase
.from('site_settings')
.upsert(
{ setting_key: key, setting_value: value },
{ onConflict: 'setting_key' }
)

if (error) {
setNotice('Saqlashda xatolik: ' + error.message)
setBusy(false)
return
}
}

setSettings({ ...draft })
setBusy(false)
setNotice('Aloqa ma’lumotlari saqlandi.')
}

async function logout() {
await supabase.auth.signOut()
go('home')
}

async function uploadSettingImage(key, file) {
if (!file) return

setUploading(true)
setNotice('')

const extension = file.name.split('.').pop() || 'jpg'
const path = `site-${key}-${Date.now()}.${extension}`

const { error } = await supabase.storage
.from('club-images')
.upload(path, file, { upsert: false })

if (error) {
setNotice('Rasm yuklashda xatolik: ' + error.message)
setUploading(false)
return
}

const { data } = supabase.storage
.from('club-images')
.getPublicUrl(path)

const publicUrl = data.publicUrl

const { error: saveError } = await supabase
.from('site_settings')
.upsert(
{ setting_key: key, setting_value: publicUrl },
{ onConflict: 'setting_key' }
)

if (saveError) {
setNotice('Rasm havolasini saqlashda xatolik: ' + saveError.message)
setUploading(false)
return
}

setDraft(current => ({ ...current, [key]: publicUrl }))
setSettings(current => ({ ...current, [key]: publicUrl }))

setUploading(false)
setNotice('Rasm muvaffaqiyatli yuklandi.')
}

async function uploadImage(file) {
if (!file) return

setUploading(true)
setNotice('')

const extension = file.name.split('.').pop() || 'jpg'
const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`

const { error } = await supabase.storage
.from('club-images')
.upload(path, file, { upsert: false })

if (error) {
setNotice('Rasm yuklashda xatolik: ' + error.message)
setUploading(false)
return
}

const { data } = supabase.storage
.from('club-images')
.getPublicUrl(path)

setItem(current => ({
...current,
image_url: data.publicUrl
}))

setUploading(false)
setNotice('Rasm yuklandi. Endi saqlashingiz mumkin.')
}
async function addContent(type) {
if (!item.title.trim()) {
setNotice('Sarlavhani kiriting.')
return
}

setBusy(true)
setNotice('')

const table =
type === 'events'
? 'club_events'
: type === 'news'
? 'club_news'
: 'club_gallery'

const payload = {
title: item.title,
description: item.description,
image_url: item.image_url
}

if (type === 'events') {
payload.event_date = item.event_date || null
}

const { error } = await supabase.from(table).insert(payload)

setBusy(false)

if (error) {
setNotice('Saqlashda xatolik: ' + error.message)
return
}

setItem({
title: '',
description: '',
event_date: '',
image_url: ''
})

setNotice('Kontent muvaffaqiyatli qo‘shildi.')
loadContent()
}
function startEdit(type, row) {
  setEditing({
    type,
    id: row.id,
    title: row.title || '',
    description: row.description || '',
    event_date: row.event_date
      ? new Date(row.event_date).toISOString().slice(0, 16)
      : '',
    image_url: row.image_url || ''
  })
}

async function updateContent() {
  if (!editing.title.trim()) {
    setNotice('Sarlavhani kiriting.')
    return
  }

  setBusy(true)
  setNotice('')

  const table = editing.type === 'events'
    ? 'club_events'
    : editing.type === 'news'
      ? 'club_news'
      : 'club_gallery'

  const payload = {
    title: editing.title,
    description: editing.description,
    image_url: editing.image_url
  }

  if (editing.type === 'events') {
    payload.event_date = editing.event_date || null
  }

  const { error } = await supabase
    .from(table)
    .update(payload)
    .eq('id', editing.id)

  setBusy(false)

  if (error) {
    setNotice('Tahrirlashda xatolik: ' + error.message)
    return
  }

  setEditing(null)
  setNotice('Ma’lumot muvaffaqiyatli yangilandi.')
  loadContent()
}
async function deleteContent(type, id) {
const table =
type === 'events'
? 'club_events'
: type === 'news'
? 'club_news'
: 'club_gallery'

const { error } = await supabase
.from(table)
.delete()
.eq('id', id)

setNotice(
error
? 'O‘chirishda xatolik: ' + error.message
: 'Kontent o‘chirildi.'
)

if (!error) loadContent()
}

function contentForm(type, label) {
return (
<div className="form-card" key={type}>
<h2>{label} qo‘shish</h2>

<label>
Sarlavha
<input
value={item.title}
onChange={event =>
setItem({ ...item, title: event.target.value })
}
placeholder="Sarlavha"
/>
</label>

{type === 'events' && (
<label>
Sana va vaqt
<input
type="datetime-local"
value={item.event_date}
onChange={event =>
setItem({ ...item, event_date: event.target.value })
}
/>
</label>
)}

{type !== 'gallery' && (
<label>
Qisqacha ma’lumot
<textarea
value={item.description}
onChange={event =>
setItem({ ...item, description: event.target.value })
}
rows="3"
placeholder="Ma’lumot kiriting"
/>
</label>
)}

<label>
Rasm yuklash
<input
type="file"
accept="image/*"
onChange={event => uploadImage(event.target.files?.[0])}
/>
</label>

{item.image_url && (
<img
src={item.image_url}
alt="Yuklangan rasm"
style={{
maxWidth: '220px',
display: 'block',
margin: '12px 0'
}}
/>
)}

<button
className="gold-btn"
disabled={busy || uploading}
onClick={() => addContent(type)}
>
<Plus size={16} />
{busy ? 'Saqlanmoqda...' : 'Saqlash'}
</button>
</div>
)
}

function contentList(type, rows) {
  if (!rows.length) {
    return <p className="empty-state">Hozircha ma’lumot mavjud emas.</p>
  }

  return (
    <div className="two-col">
      {rows.map(row => (
        <article className="info-panel" key={row.id}>
          {row.image_url && (
            <img
              src={row.image_url}
              alt={row.title}
              style={{
                width: '100%',
                maxHeight: '220px',
                objectFit: 'cover',
                marginBottom: '12px'
              }}
            />
          )}
          {editing?.id === row.id && editing?.type === type ? (
            <>
              <label>
                Sarlavha
                <input
                  value={editing.title}
                  onChange={e => setEditing({
                    ...editing,
                    title: e.target.value
                  })}
                />
              </label>

              {type !== 'gallery' && (
                <label>
                  Ma’lumot
                  <textarea
                    rows="3"
                    value={editing.description}
                    onChange={e => setEditing({
                      ...editing,
                      description: e.target.value
                    })}
                  />
                </label>
              )}

              {type === 'events' && (
                <label>
                  Sana va vaqt
                  <input
                    type="datetime-local"
                    value={editing.event_date}
                    onChange={e => setEditing({
                      ...editing,
                      event_date: e.target.value
                    })}
                  />
                </label>
              )}

              <button
                className="gold-btn"
                disabled={busy}
                onClick={updateContent}
              >
                <Save size={15} /> Saqlash
              </button>

              <button
                className="ghost-btn"
                onClick={() => setEditing(null)}
              >
                Bekor qilish
              </button>
            </>
          ) : (
            <>
              <h2>{row.title}</h2>

              {row.description && <p>{row.description}</p>}

              {row.event_date && (
                <p>
                  {new Date(row.event_date).toLocaleString('uz-UZ')}
                </p>
              )}

              {session && session.user.email === 'obidofich@gmail.com' && (
                <>
                  <button
                    className="gold-btn"
                    onClick={() => startEdit(type, row)}
                  >
                    <FileText size={15} /> Tahrirlash
                  </button>

                  <button
                    className="ghost-btn"
                    onClick={() => deleteContent(type, row.id)}
                  >
                    <Trash2 size={15} /> O‘chirish
                  </button>
                </>
              )}
            </>
          )}
        </article>
      ))}
    </div>
)
}
return (
{applicationSuccess && (
  <div className="success-overlay">
    <div className="success-modal">
      <div className="success-check">
        <svg viewBox="0 0 52 52">
          <circle cx="26" cy="26" r="24" />
          <path d="M14 27 L22 35 L39 17" />
        </svg>
      </div>

      <h2>Arizangiz muvaffaqiyatli yuborildi!</h2>

      <p>
        Youth Parliament Club a’zoligiga arizangiz qabul qilindi.
      </p>

      <span className="success-label">SIZNING ARIZA RAQAMINGIZ</span>

      <div className="success-code">{applicationSuccess}</div>

      <button
        className="success-home-btn"
        onClick={() => {
          setApplicationSuccess('')
          go('home')
        }}
      >
        Bosh sahifaga
        <ArrowRight size={18} />
      </button>
    </div>
  </div>
)}
<div className="app">
<header className="topbar">
<button
className="icon-btn mobile-menu"
onClick={() => setMenu(!menu)}
>
<Menu />
</button>

<button className="brand-button" onClick={() => go('home')}>
<Brand logo={settings.club_logo} />
</button>

        <div className="top-links">
          <span>RASMIY KLUB PLATFORMASI</span>
          <button onClick={() => go('contact')}>
            Bog‘lanish <ArrowUpRight size={15} />
          </button>
        </div>
       
<div className="top-links">
  {[
    ['home', 'Bosh sahifa'],
    ['about', 'Klub haqida'],
    ['events', 'Faoliyat'],
    ['news', 'Loyihalar'],
    ['gallery', 'Galereya'],
    ['membership', 'A’zolik']
  ].map(([id, label]) => (
    <button
      key={id}
      className={page === id ? 'top-link-active' : ''}
      onClick={() => go(id)}
    >
      {label}
    </button>
  ))}
  <button className="top-join" onClick={() => go('membership')}>
    A’zo bo‘lish <ArrowUpRight size={16} />
  </button>
</div>

</header>

<AnimatePresence>
{menu && (
<motion.div
className="mobile-nav"
initial={{ opacity: 0, y: -8 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0 }}
>
{nav.map(([id, label, Icon]) => (
<button key={id} onClick={() => go(id)}>
<Icon size={18} />
{label}
</button>
))}
</motion.div>
)}
</AnimatePresence>

<div className="shell">
<aside className="sidebar">
<div className="side-label">ASOSIY MENYU</div>

{nav.map(([id, label, Icon]) => (
<button
key={id}
className={`nav-item ${page === id ? 'active' : ''}`}
onClick={() => go(id)}
>
<Icon size={18} />
<span>{label}</span>
</button>
))}

<button
className={`nav-item ${page === 'admin' ? 'active' : ''}`}
onClick={() => go('admin')}
>
<ShieldCheck size={18} />
<span>Admin panel</span>
</button>

<div className="side-card">
<div className="side-emblem"><Landmark /></div>
<b>Kelajak — bizning qo‘limizda.</b>
<p>
Faol yoshlar, kuchli jamiyat va adolatli kelajak sari.
</p>
<button onClick={() => go('membership')}>
Bizga qo‘shiling <ArrowRight size={14} />
</button>
</div>
</aside>

<main className="main">
<AnimatePresence mode="wait">
<motion.div
key={page}
className="page"
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -8 }}
>
{page === 'home' && (
<>
<section
className="hero"
style={
settings.hero_image
? {
backgroundImage: `linear-gradient(90deg,rgba(8,22,35,.88),rgba(8,22,35,.35)),url(${settings.hero_image})`,
backgroundSize: 'cover',
backgroundPosition: 'center'
}
: undefined
}
>
<div className="hero-content">
<div className="eyebrow light">
YOSHLAR PARLAMENTI KLUBI
</div>

<h1>
  {settings.hero_line1}<br />
  <em>{settings.hero_emphasis}</em> {settings.hero_line2}
</h1>

<p>
  {settings.hero_description}
</p>
<div className="hero-actions">
<button
className="gold-btn"
onClick={() => go('membership')}
>
Klubga qo‘shilish <ArrowRight />
</button>

<button
className="ghost-btn"
onClick={() => go('about')}
>
Klub haqida <ArrowUpRight />
</button>
</div>
</div>
</section>

<motion.section
  className="welcome-row"
  style={{
    backgroundImage: settings.home_image
      ? `linear-gradient(rgba(5,18,35,.45), rgba(5,18,35,.65)), url("${settings.home_image}")`
      : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}
  initial={{ opacity: 0, y: 55 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ duration: 0.9, ease: "easeOut" }}
>
  <div className="welcome-overlay" />
  <div className="welcome-content">
    <div className="eyebrow">BIZNING MAQSAD</div>
   <h2>
  {settings.welcome_line1}<br />
  <em>{settings.welcome_line2}</em>
</h2>
<p>
  {settings.welcome_description}
</p>
  </div>
</motion.section>
</>
)}


{page === 'about' && (
<div className="about-v2">
<PageHead
kicker="YOSHLAR PARLAMENTI KLUBI"
title="G‘oyadan — kelajakka."
desc="Bilim, tashabbus va yetakchilikni birlashtirgan yoshlar platformasi."
/>

<motion.section
className="av-intro"
initial={{ opacity: 0, y: 55 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, amount: 0.2 }}
transition={{ duration: 0.85 }}
>
<div className="av-intro-copy">
<span className="av-kicker">BIZNING MISSIYAMIZ</span>
<h2>Yoshlar ovozi — <em>jamiyat kelajagi.</em></h2>
<p>
Yoshlarning huquqiy bilimini oshirish, ijtimoiy
faolligini kuchaytirish va yangi tashabbuslarini
qo‘llab-quvvatlash — klub faoliyatining asosiy
yo‘nalishidir.
</p>
<div className="av-meta">
<span><CalendarDays size={17}/> 2026-yil, noyabr</span>
<span><Users size={17}/> 12 nafar jamoa a’zosi</span>
</div>
</div>

<div className="av-visual av-visual-one">
<div className="av-image-frame">
<img
  src={settings.about_image || "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=85"}
  alt="Universitet binosi"
/>
</div>
<div className="av-image-caption">
<Landmark size={19}/>
<span>XALQARO IJTIMOIY INNOVATSIYALAR UNIVERSITETI</span>
</div>
<span className="av-number">01</span>
</div>
</motion.section>

<div className="av-divider">
<span>01</span><i/><b>O‘TMISH</b>
</div>

<motion.section
className="av-history"
initial={{ opacity: 0, y: 55 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, amount: 0.2 }}
transition={{ duration: 0.8 }}
>
<div className="av-history-art">
<div className="av-history-frame">
<img
src="https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=85"
alt="Parlament majlisi zali"
/>
</div>
<div className="av-photo-stamp">YOSHLAR<br/>TASHABBUSI</div>
</div>

<motion.div
className="av-history-copy"
initial={{ opacity: 0, x: 55 }}
whileInView={{ opacity: 1, x: 0 }}
viewport={{ once: true, amount: 0.3 }}
transition={{ duration: 0.9, delay: 0.15 }}
>
<span className="av-kicker">TASHKIL TOPISH TARIXI</span>
<h2>Har bir katta o‘zgarish <em>bir g‘oyadan</em> boshlanadi.</h2>
<p>
2026-yil noyabr oyida Xalqaro ijtimoiy innovatsiyalar
universiteti hududida Yoshlar parlamenti klubi ochilgan.
Klub yoshlarning fikr va takliflarini ilgari surish,
ularning ijtimoiy hayotdagi ishtirokini kuchaytirish
maqsadida tashkil etilgan.
</p>
<div className="av-date">
<CalendarDays size={19}/>
<div>
<small>TASHKIL TOPGAN SANA</small>
<strong>2026 / NOYABR</strong>
</div>
</div>
</motion.div>
</motion.section>

<div className="av-divider">
<span>02</span><i/><b>BUGUN</b>
</div>

<motion.section
className="av-today"
initial={{ opacity: 0, y: 50 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, amount: 0.2 }}
transition={{ duration: 0.8 }}
>
<div className="av-today-copy">
<span className="av-kicker">BUGUNGI FAOLIYAT</span>
<h2>Bir maqsad — <em>yagona jamoa.</em></h2>
<p>
Klub faoliyati vazifalar taqsimoti, hamkorlik va
mas’uliyat tamoyillariga asoslanadi. Har bir ishtirokchi
umumiy maqsad yo‘lida o‘z yo‘nalishi bo‘yicha faoliyat
olib boradi.
</p>
</div>

<div className="av-roles">
<div><strong>01</strong><span>Spiker</span><b>1 nafar</b></div>
<div><strong>02</strong><span>Koordinatorlar</span><b>2 nafar</b></div>
<div><strong>03</strong><span>Media bo‘limi</span><b>2 nafar</b></div>
<div><strong>04</strong><span>Klub a’zolari</span><b>7 nafar</b></div>
<div className="av-total">
<strong>12</strong>
<span>Jami jamoa a’zolari</span>
</div>
</div>
</motion.section>

<div className="av-divider">
<span>03</span><i/><b>KELAJAK</b>
</div>

<motion.section
className="av-future"
initial={{ opacity: 0, y: 50 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, amount: 0.2 }}
transition={{ duration: 0.85 }}
>
<div className="av-future-heading">
<span className="av-kicker">ISTIQBOL VA RIVOJLANISH</span>
<h2>Kelajakni bugundan <em>birgalikda quramiz.</em></h2>
<p>
Klubning istiqboldagi maqsadi — universitet miqyosida
yoshlar tashabbuslarini kengaytirish, huquqiy va
intellektual loyihalarni amalga oshirish hamda faol
yoshlar hamkorligini rivojlantirish.
</p>
</div>

<div className="av-future-grid">
<article>
<span>01</span><Landmark/>
<h3>Huquqiy bilim</h3>
<p>Huquqiy savodxonlik va fuqarolik faolligini oshirish.</p>
</article>
<article>
<span>02</span><Users/>
<h3>Yoshlar hamkorligi</h3>
<p>Tashabbuskor yoshlarni yagona maqsad atrofida birlashtirish.</p>
</article>
<article>
<span>03</span><ArrowUpRight/>
<h3>Yangi loyihalar</h3>
<p>Innovatsion va ijtimoiy ahamiyatga ega g‘oyalarni ro‘yobga chiqarish.</p>
</article>
</div>

<div className="av-final-line">
YOSHLAR OVOZI. YANGI G‘OYALAR. YANGI KELAJAK.
</div>
</motion.section>
</div>
)}



{page === 'membership' && (
<>
<PageHead
kicker="JAMOAMIZGA QO‘SHILING"
title="O‘zgarishlar sizdan boshlanadi."
desc="Klub a’zoligiga ariza topshiring."
/>

<form className="form-card application-form" onSubmit={submitApplication}>
  <h2>YOUTH PARLIAMENT CLUB</h2>
  <p>A'zolikka qabul qilish uchun rasmiy ro‘yxatdan o‘tish anketasi.</p>

  <label>
    Ism va familiyangizni kiriting.
    <input
      value={application.full_name}
      onChange={e => setApplication({...application, full_name:e.target.value})}
      placeholder="Ism va familiyangiz"
    />
  </label>

  <label>
    Telefon raqamingizni kiriting. *
    <input
      type="tel"
      required
      value={application.phone}
      onChange={e => setApplication({...application, phone:e.target.value})}
      placeholder="+998 90 123 45 67"
    />
  </label>

  <label>
    Tug‘ilgan sanangizni kiriting. *
    <input
      type="date"
      required
      value={application.birth_date}
      onChange={e => setApplication({...application, birth_date:e.target.value})}
    />
  </label>

  <label>
    Universitet nomini kiriting. *
    <select required value={application.university}
      onChange={e => setApplication({...application, university:e.target.value})}>
      <option value="">Universitetni tanlang</option>
      <option>Toshkent xalqaro universiteti</option>
      <option>Toshkent davlat yuridik universiteti</option>
      <option>Toshkent afrosiyob universiteti</option>
      <option>Xalqaro ijtimoiy innovatsiyalar universiteti</option>
      <option>Diplomat university</option>
      <option>Sarbon university</option>
    </select>
  </label>

  <label>
    Fakultetingiz nomini kiriting. *
    <input required value={application.faculty}
      onChange={e => setApplication({...application, faculty:e.target.value})}/>
  </label>

  <label>
    Ta'lim yo‘nalishingizni kiriting. *
    <input required value={application.study_direction}
      onChange={e => setApplication({...application, study_direction:e.target.value})}/>
  </label>

  <label>
    Nechanchi kursda tahsil olasiz? *
    <select required value={application.course}
      onChange={e => setApplication({...application, course:e.target.value})}>
      <option value="">Kursni tanlang</option>
      <option>1-kurs</option>
      <option>2-kurs</option>
      <option>3-kurs</option>
      <option>4-kurs</option>
      <option>Boshqa</option>
    </select>
  </label>

  <label>
    Guruhingiz raqamini kiriting. *
    <input required value={application.group_number}
      onChange={e => setApplication({...application, group_number:e.target.value})}/>
  </label>

  <label>
    Elektron pochta manzilingizni kiriting. *
    <input type="email" required value={application.email}
      onChange={e => setApplication({...application, email:e.target.value})}/>
  </label>

  <label>
    Nima uchun klub a'zosi bo‘lmoqchisiz?
    <textarea rows="4" value={application.motivation}
      onChange={e => setApplication({...application, motivation:e.target.value})}
      placeholder="Fikringizni yozing..."/>
  </label>

  <label>
    Qaysi yo‘nalishda faoliyat yuritishni xohlaysiz? *
    <select required value={application.activity_direction}
      onChange={e => setApplication({...application, activity_direction:e.target.value, activity_other:''})}>
      <option value="">Yo‘nalishni tanlang</option>
      <option>Qonunchilik va huquq ijodkorligi</option>
      <option>Debat va notiqlik</option>
      <option>Ilmiy-tadqiqot faoliyati</option>
      <option>Yoshlar siyosati</option>
      <option>Media va axborot</option>
      <option>Tashkiliy faoliyat</option>
      <option>Boshqa</option>
    </select>
  </label>

  {application.activity_direction === 'Boshqa' && (
    <label>
      Boshqa yo‘nalishni kiriting.
      <input value={application.activity_other}
        onChange={e => setApplication({...application, activity_other:e.target.value})}/>
    </label>
  )}

  <label>
    Kiritilgan ma'lumotlarning to‘g‘riligini tasdiqlaysizmi? *
    <select required value={application.confirmation}
      onChange={e => setApplication({...application, confirmation:e.target.value})}>
      <option value="">Javobni tanlang</option>
      <option>Ha, tasdiqlayman</option>
      <option>Yo‘q, bekor qilaman</option>
    </select>
  </label>

  <button className="gold-btn" type="submit"
    disabled={applicationBusy || application.confirmation !== 'Ha, tasdiqlayman'}>
    {applicationBusy ? 'Yuborilmoqda...' : 'Arizani yuborish'}
    <ArrowRight size={18}/>
  </button>

  {applicationMessage && <p className="admin-notice">{applicationMessage}</p>}
</form>
</>
)}

{page === 'documents' && (
<>
<PageHead
kicker="RASMIY HUJJATLAR"
title="Faoliyatimizning huquqiy asoslari."
desc="Klub nizomi va konsepsiyasi bilan tanishing."
/>

<div className="two-col">
<Info
title="NIZOM"
text="Klubning maqsadi, vazifalari, a’zolik tartibi va boshqaruv mexanizmlari."
/>

<Info
title="KONSEPSIYA"
text="Klubning strategik yo‘nalishlari va rivojlanish istiqbollari."
/>
</div>
</>
)}
{page === 'feedback' && (
<>
<PageHead
kicker="OCHIQ MULOQOT"
title="Sizning fikringiz biz uchun muhim."
desc="Taklif, savol yoki murojaatingiz bormi? Biz bilan bog‘laning."
/>

<a
className="gold-btn link-btn"
href={`https://t.me/${(settings.telegram || '').replace('@', '')}`}
target="_blank"
rel="noreferrer"
>
Telegram orqali murojaat <Send />
</a>
</>
)}

{page === 'events' && (
<>
<PageHead
kicker="KLUB KALENDARi"
title="G‘oyalar uchrashadigan maydon."
desc="Klub tadbirlari va uchrashuvlari."
/>
{contentList('events', events)}
</>
)}

{page === 'news' && (
<>
<PageHead
kicker="SO‘NGGI XABARLAR"
title="Klub hayotidan yangiliklar."
desc="Tashabbuslar, uchrashuvlar va klub faoliyatiga oid xabarlar."
/>
{contentList('news', news)}
</>
)}

{page === 'gallery' && (
<>
<PageHead
kicker="FOTO LAVHALAR"
title="Faoliyatimizdan lahzalar."
desc="Klub tadbirlaridan fotolavhalar."
/>
{contentList('gallery', gallery)}
</>
)}

{page === 'contact' && (
<>
<PageHead
kicker="BIZ BILAN BOG‘LANING"
title="Muloqotga doim ochiqmiz."
desc="Savol, taklif yoki hamkorlik yuzasidan biz bilan bog‘laning."
/>

<div className="contact-grid">
<Contact I={Phone} title="TELEFON" value={settings.phone} />
<Contact I={Send} title="TELEGRAM" value={settings.telegram} />
<Contact I={Mail} title="ELEKTRON POCHTA" value={settings.email} />
<Contact I={MapPin} title="MANZIL" value={settings.address} />
</div>

{settings.instagram && <p><Instagram /> {settings.instagram}</p>}
{settings.youtube && <p><Youtube /> {settings.youtube}</p>}
</>
)}

{page === 'admin' && (
<>
<PageHead
kicker="BOSHQARUV"
title="Admin panel"
desc="Sayt ma’lumotlari, yangiliklar, tadbirlar va galereyani boshqaring."
/>

{!session || session.user.email !== 'obidofich@gmail.com' ? (
<form className="form-card" onSubmit={login}>
<label>
Email
<input
type="email"
value={email}
onChange={event => setEmail(event.target.value)}
required
/>
</label>

<label>
Parol
<input
type="password"
value={password}
onChange={event => setPassword(event.target.value)}
required
/>
</label>

<button className="gold-btn" disabled={busy}>
{busy ? 'Kirilmoqda...' : 'Kirish'}
</button>
  <button
  type="button"
  className="gold-btn"
  onClick={googleLogin}
  disabled={busy}
>
  Google orqali kirish
</button>
</form>
  ) : (
<>
<div className="form-card">
<h2>Aloqa ma’lumotlari</h2>

{['phone', 'telegram', 'email', 'address', 'instagram', 'youtube'].map(key => (
<label key={key}>
{({
phone: 'Telefon',
telegram: 'Telegram',
email: 'Email',
address: 'Manzil',
instagram: 'Instagram',
youtube: 'YouTube'
})[key]}

<input
value={draft[key] || ''}
onChange={event =>
setDraft({ ...draft, [key]: event.target.value })
}
/>
</label>
))}

<button
className="gold-btn"
onClick={saveSettings}
disabled={busy}
>
<Save size={16} /> Saqlash
</button>

<h2 style={{ marginTop: '24px' }}>
<ImageIcon size={18} /> Sayt rasmlari
</h2>

{[
  ['hero_image', 'Bosh sahifa banneri'],
  ['club_logo', 'Klub logotipi'],
  ['home_image', 'Bosh sahifadagi qo‘shimcha rasm'],
  ['about_image', 'Klub haqida — universitet rasmi']
].map(([key, label]) => (
<label key={key}>
{label}

<input
type="file"
accept="image/*"
onChange={event =>
uploadSettingImage(key, event.target.files?.[0])
}
/>

{draft[key] && (
<img
src={draft[key]}
alt={label}
style={{
display: 'block',
maxWidth: '220px',
maxHeight: '130px',
objectFit: 'contain',
marginTop: '8px'
}}
/>
)}
</label>
))}

<button className="ghost-btn" onClick={logout}>
<LogOut size={16} /> Chiqish
</button>
</div>
<div className="form-card">
  <h2>Bosh sahifa matnlari</h2>

  {[
    ['hero_line1', 'Banner — birinchi qator'],
    ['hero_emphasis', 'Banner — ajratilgan so‘z'],
    ['hero_line2', 'Banner — ikkinchi qator'],
    ['hero_description', 'Banner — izoh'],
    ['welcome_line1', 'Quyi blok — birinchi qator'],
    ['welcome_line2', 'Quyi blok — ikkinchi qator'],
    ['welcome_description', 'Quyi blok — izoh']
  ].map(([key, label]) => (
    <label key={key}>
      {label}
      <textarea
        rows="2"
        value={draft[key] || ''}
        onChange={event =>
          setDraft({ ...draft, [key]: event.target.value })
        }
      />
    </label>
  ))}

  <button
    className="gold-btn"
    onClick={saveSettings}
    disabled={busy}
  >
    <Save size={16} /> Matnlarni saqlash
  </button>
</div>
<div className="two-col">
{contentForm('news', 'Yangilik')}
{contentForm('events', 'Tadbir')}
{contentForm('gallery', 'Galereya rasmi')}
</div>
</>
)}

{notice && <p className="admin-notice">{notice}</p>}
</>
)}
</motion.div>
</AnimatePresence>

<footer className="footer">
<Brand logo={settings.club_logo} />

<span>© 2026 Youth Parliament Club</span>

<button onClick={() => go('home')}>
YUQORIGA <ArrowUpRight size={14} />
</button>
</footer>
</main>
</div>
</div>
)
}

createRoot(document.getElementById('root')).render(<App />)
