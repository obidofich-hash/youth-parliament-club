import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, Landmark, Users, FileText, MessageCircle, CalendarDays, Newspaper,
  Camera, Phone, Menu, ArrowRight, ArrowUpRight, Send, Mail, MapPin,
  Instagram, Youtube, ShieldCheck, Save, LogOut, Plus, Trash2, Image as ImageIcon
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
  home_image: ''
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
  return <article className="info-panel"><h2>{title}</h2><p>{text}</p></article>
}

function Contact({ I, title, value }) {
  return <article className="contact-card"><I size={22} /><div><small>{title}</small><p>{value || 'Kiritilmagan'}</p></div></article>
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
  const [item, setItem] = useState({ title: '', description: '', event_date: '', image_url: '' })
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    loadSettings()
    loadContent()
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession)
