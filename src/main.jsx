import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createPortal } from 'react-dom'
import { createClient } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'
import {
Home, Landmark, Users, FileText, MessageCircle, CalendarDays, Newspaper,
Camera, Phone, Menu, ArrowRight, ArrowUpRight, Send, Mail, MapPin,
Instagram, Youtube, ShieldCheck, Save, LogOut, Plus, Trash2,
Image as ImageIcon, RefreshCw, QrCode, Settings
} from 'lucide-react'
import './style.css'
import MembershipCertificate from './MembershipCertificate'
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
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
certificate_club_name: 'YOUTH PARLIAMENT',
certificate_logo: '',
certificate_background: '',
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
['member', 'Shaxsiy kabinet', ShieldCheck],
['documents', 'Hujjatlar', FileText],
['feedback', 'Murojaatlar', MessageCircle],
['events', 'Tadbirlar', CalendarDays],
['news', 'Yangiliklar', Newspaper],
['gallery', 'Galereya', Camera],
['contact', 'Bog‘lanish', Phone]
]

const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfBwqF-1CtsNfkWS9x8p5-1JMFbD8jIHB7Zf9z9e8pm3zbzMA/viewform?usp=dialog'

const allowedPages = new Set([
  'home', 'about', 'membership', 'member', 'documents', 'feedback',
  'events', 'news', 'gallery', 'contact', 'admin', 'reset-password'
])

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

function Contact({ I, title, value, emoji, delay = 0 }) {
  const cleanValue = value || 'Kiritilmagan'
  const href = !value ? undefined
    : title === 'TELEFON' ? `tel:${value.replace(/[^\d+]/g, '')}`
    : title === 'TELEGRAM' ? (value.startsWith('http') ? value : `https://t.me/${value.replace('@', '')}`)
    : title === 'ELEKTRON POCHTA' ? `mailto:${value}`
    : title === 'MANZIL' ? `https://maps.google.com/?q=${encodeURIComponent(value)}`
    : undefined
  return (
    <motion.article
      className="contact-card"
      initial={{ opacity: 0, y: 28, scale: .97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: .65, delay, ease: 'easeOut' }}
      whileHover={{ y: -8, scale: 1.018 }}
      style={{
        position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center',
        gap: 19, padding: '26px 25px', minHeight: 126, borderRadius: 23,
        border: '1px solid rgba(216,179,109,.38)',
        background: 'linear-gradient(135deg,#0d1d32 0%,#142d49 58%,#1d3b5b 100%)',
        boxShadow: '0 15px 34px rgba(12,29,50,.17)', transition: 'box-shadow .3s ease',
        color: '#f8fafc'
      }}
    >
      <motion.div
        aria-hidden="true"
        animate={{ scale: [1, 1.07, 1], rotate: [0, 3, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay }}
        style={{
          width: 62, height: 62, flex: '0 0 62px', display: 'grid', placeItems: 'center',
          borderRadius: 19, background: 'linear-gradient(145deg,#203f60,#294d70)',
          color: '#f0c879', boxShadow: '0 0 0 1px rgba(240,200,121,.22),0 9px 22px rgba(0,0,0,.2)'
        }}
      >
        <I size={27} strokeWidth={1.9} />
      </motion.div>
      <div style={{ minWidth: 0, flex: 1, position: 'relative', zIndex: 1 }}>
        <small style={{ display: 'block', color: '#e7bd70', fontSize: 10, fontWeight: 850, letterSpacing: '2px', marginBottom: 9 }}>
          {title}
        </small>
        {href
          ? <a href={href} target={title === 'MANZIL' || title === 'TELEGRAM' ? '_blank' : undefined}
              rel="noreferrer" style={{ color: '#ffffff', fontSize: 16, lineHeight: 1.5, fontWeight: 750, textDecoration: 'none', overflowWrap: 'anywhere' }}>{cleanValue}</a>
          : <p style={{ margin: 0, color: '#ffffff', fontSize: 16, lineHeight: 1.5, fontWeight: 750, overflowWrap: 'anywhere' }}>{cleanValue}</p>}
        {href && <span style={{ display: 'block', color: 'rgba(255,255,255,.58)', fontSize: 11, marginTop: 7 }}>Bog‘lanish uchun bosing ↗</span>}
      </div>
      <motion.span aria-hidden="true"
        animate={{ y: [0, -7, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: delay + .2 }}
        style={{ position: 'absolute', right: 16, top: 10, fontSize: 25, opacity: .82, filter: 'drop-shadow(0 3px 7px rgba(0,0,0,.25))' }}>
        {emoji}
      </motion.span>
      <div aria-hidden="true" style={{ position: 'absolute', width: 130, height: 130, borderRadius: '50%', right: -55, bottom: -85, background: 'rgba(231,189,112,.09)', filter: 'blur(2px)' }} />
    </motion.article>
  )
}

function App() {
const requestedPage = new URLSearchParams(window.location.search).get('page')
const [page, setPage] = useState(allowedPages.has(requestedPage) ? requestedPage : 'home')
const [assistantOpen, setAssistantOpen] = useState(false)
const [assistantInput, setAssistantInput] = useState('')
const [assistantBusy, setAssistantBusy] = useState(false)
const [assistantMessages, setAssistantMessages] = useState([{role:'assistant',text:'Assalomu alaykum! Men Youth Parliament Club sayt yordamchisiman. Saytdagi ochiq ma’lumotlar bo‘yicha yordam beraman.'}])
const [theme, setTheme] = useState(() => {
  try { return localStorage.getItem('ypc-theme') || 'light' } catch { return 'light' }
})
useEffect(() => {
  document.documentElement.setAttribute('data-yp-theme', theme)
  try { localStorage.setItem('ypc-theme', theme) } catch {}
}, [theme])


const [adminTab, setAdminTab] = useState('overview')
const [adminSearch, setAdminSearch] = useState('')
const [publicSearch, setPublicSearch] = useState('')
const [calendarMonth, setCalendarMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))
const [selectedCalendarDate, setSelectedCalendarDate] = useState('')
const [galleryPreview, setGalleryPreview] = useState(null)
const [applicationLookupCode, setApplicationLookupCode] = useState('')
const [applicationLookupResult, setApplicationLookupResult] = useState(null)
const [applicationLookupBusy, setApplicationLookupBusy] = useState(false)
const [menu, setMenu] = useState(false)
const [memberApplication, setMemberApplication] = useState(null)
const [scannerOpen, setScannerOpen] = useState(false)
const [scannerBusy, setScannerBusy] = useState(false)
const [attendanceResult, setAttendanceResult] = useState('')
const [memberLoading, setMemberLoading] = useState(false)
const [session, setSession] = useState(null)
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [resetBusy, setResetBusy] = useState(false)
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
const [attendanceEvents, setAttendanceEvents] = useState([])
const [selectedAttendanceEvent, setSelectedAttendanceEvent] = useState('')
const [attendanceRecords, setAttendanceRecords] = useState([])
const [attendanceLoading, setAttendanceLoading] = useState(false)
const [activeEventQR, setActiveEventQR] = useState(null)
const [qrBusy, setQrBusy] = useState(false)
const [memberRecord, setMemberRecord] = useState(null)
const [notice, setNoticeState] = useState('')
const [toast, setToast] = useState(null)
const [editing,setEditing] = useState(null)
const [documentViewer, setDocumentViewer] = useState(null)
const [feedbackName, setFeedbackName] = useState('')
const [feedbackContact, setFeedbackContact] = useState('')
const [feedbackAnonymous, setFeedbackAnonymous] = useState(false)
const [feedbackMessage, setFeedbackMessage] = useState('')
const [feedbackBusy, setFeedbackBusy] = useState(false)
const [feedbackRows, setFeedbackRows] = useState([])
const [feedbackLoading, setFeedbackLoading] = useState(false)
const [feedbackReplyDrafts, setFeedbackReplyDrafts] = useState({})
const [feedbackReplyBusy, setFeedbackReplyBusy] = useState(null)

const normalizedAdminSearch = adminSearch.trim().toLocaleLowerCase('uz')
const filteredApplications = applications.filter(app =>
  [app.full_name, app.application_code, app.phone, app.email, app.status, app.university]
    .filter(Boolean).join(' ').toLocaleLowerCase('uz').includes(normalizedAdminSearch)
)
const filteredFeedbackRows = feedbackRows.filter(row =>
  [row.full_name, row.contact_info, row.message, row.status]
    .filter(Boolean).join(' ').toLocaleLowerCase('uz').includes(normalizedAdminSearch)
)
const filteredAttendanceRecords = attendanceRecords.filter(record =>
  [record.member?.full_name, record.member?.application_code, record.member?.phone,
   record.member?.email, record.member?.university, record.method, record.status]
    .filter(Boolean).join(' ').toLocaleLowerCase('uz').includes(normalizedAdminSearch)
)
const filteredEvents = events.filter(row =>
  [row.title, row.description, row.event_date].filter(Boolean).join(' ').toLocaleLowerCase('uz').includes(normalizedAdminSearch)
)
const filteredNews = news.filter(row =>
  [row.title, row.description].filter(Boolean).join(' ').toLocaleLowerCase('uz').includes(normalizedAdminSearch)
)
const filteredGallery = gallery.filter(row =>
  [row.title, row.description].filter(Boolean).join(' ').toLocaleLowerCase('uz').includes(normalizedAdminSearch)
)
const normalizedPublicSearch = publicSearch.trim().toLocaleLowerCase('uz')
const publicSearchResults = normalizedPublicSearch ? [
  ...nav.filter(([id, label]) => label.toLocaleLowerCase('uz').includes(normalizedPublicSearch)).map(([id,label]) => ({ type:'Bo‘lim', title:label, page:id, key:`page-${id}` })),
  ...events.filter(row => [row.title,row.description,row.event_date].filter(Boolean).join(' ').toLocaleLowerCase('uz').includes(normalizedPublicSearch)).map(row => ({ type:'Tadbir', title:row.title, page:'events', key:`event-${row.id}` })),
  ...news.filter(row => [row.title,row.description].filter(Boolean).join(' ').toLocaleLowerCase('uz').includes(normalizedPublicSearch)).map(row => ({ type:'Yangilik', title:row.title, page:'news', key:`news-${row.id}` })),
  ...gallery.filter(row => [row.title,row.description].filter(Boolean).join(' ').toLocaleLowerCase('uz').includes(normalizedPublicSearch)).map(row => ({ type:'Galereya', title:row.title || 'Galereya rasmi', page:'gallery', key:`gallery-${row.id}` }))
].slice(0, 8) : []
const calendarYear = calendarMonth.getFullYear()
const calendarMonthIndex = calendarMonth.getMonth()
const calendarMonthDays = new Date(calendarYear, calendarMonthIndex + 1, 0).getDate()
const calendarOffset = (new Date(calendarYear, calendarMonthIndex, 1).getDay() + 6) % 7
const calendarCells = [...Array(calendarOffset).fill(null), ...Array.from({length:calendarMonthDays}, (_,i)=>i+1)]
const calendarEventDates = new Set(events.map(row => String(row.event_date || '').slice(0,10)).filter(Boolean))
const selectedDateEvents = selectedCalendarDate ? events.filter(row => String(row.event_date || '').slice(0,10) === selectedCalendarDate) : []
const today = new Date()
const todayKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
const upcomingEvents = events.filter(row => { const date = String(row.event_date || '').slice(0,10); return date && date >= todayKey }).sort((a,b) => String(a.event_date).localeCompare(String(b.event_date))).slice(0,3)

const pendingApplicationsCount = applications.filter(app =>
  !['Qabul qilindi', 'Rad etildi'].includes(app.status)
).length
const unreadFeedbackCount = feedbackRows.filter(row => row.status !== 'O‘qildi').length


// Barcha amaliyotlar uchun yagona yuqori bildirishnoma.
function setNotice(message) {
  setNoticeState(message)
  if (!message) {
    setToast(null)
    return
  }
  const normalized = String(message).toLowerCase()
  if (/tekshirilmoqda|tayyorlanmoqda|yuklanmoqda|yaratilmoqda/.test(normalized)) return
  const isError = /xatolik|xato:|amalga oshmadi|muvaffaqiyatsiz|bo\u2018lmadi|bo\u0027lmadi|mos kelmadi|noto\u2018g\u2018ri|noto\u0027g\u0027ri|kamida|tanlang|kerak|rad etildi|tekshiring/.test(normalized)
  setToast({ id: Date.now(), type: isError ? 'error' : 'success', message: String(message) })
}

useEffect(() => {
  if (!toast) return
  const timer = window.setTimeout(() => setToast(null), 5000)
  return () => window.clearTimeout(timer)
}, [toast?.id])
useEffect(() => {
  loadSettings()
  loadContent()

  // Supabase invite/recovery links include type=invite or type=recovery.
  // Read it before Supabase processes and clears the URL hash.
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  const queryParams = new URLSearchParams(window.location.search)
  const authType = hashParams.get('type') || queryParams.get('type')

  if (authType === 'invite' || authType === 'recovery') {
    setPage('reset-password')
  }

  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      setNotice('Sessiyani tekshirishda xatolik yuz berdi.')
      return
    }
    setSession(data.session)
  })

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, currentSession) => {
      setSession(currentSession)

      const currentHashParams = new URLSearchParams(
        window.location.hash.replace(/^#/, '')
      )
      const currentAuthType =
        currentHashParams.get('type') ||
        new URLSearchParams(window.location.search).get('type')

      if (
        event === 'PASSWORD_RECOVERY' ||
        (event === 'SIGNED_IN' &&
          (authType === 'invite' ||
            authType === 'recovery' ||
            currentAuthType === 'invite' ||
            currentAuthType === 'recovery'))
      ) {
        setPage('reset-password')
      }
    }
  )

  const handlePopState = () => {
    const route = new URLSearchParams(window.location.search).get('page')
    setPage(allowedPages.has(route) ? route : 'home')
    setMenu(false)
  }
  window.addEventListener('popstate', handlePopState)

  return () => {
    subscription.unsubscribe()
    window.removeEventListener('popstate', handlePopState)
  }
}, [])

useEffect(() => {
  if (!session) {
    setMemberApplication(null)
    setApplications([])
    setAttendanceEvents([])
    return
  }

  // Only the administrator should load the full applications list.
  if (session.user.email?.toLowerCase() === 'obidofich@gmail.com') {
    loadApplications()
    loadAttendanceEvents()
    loadFeedback()
  }

  // Every authenticated member may load only their own approved record.
  loadMemberApplication(session.user)
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
  if (session?.user?.email?.toLowerCase() !== 'obidofich@gmail.com') return

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
  async function loadMemberApplication(user) {
  if (!user?.id) return

  setMemberLoading(true)

  const { data, error } = await supabase
    .from('club_applications')
    .select('*')
    .eq('auth_user_id', user.id)
    .eq('status', 'Qabul qilindi')
    .not('membership_code', 'is', null)
    .maybeSingle()

  if (error) {
    setNotice('A’zolik ma’lumotlarini yuklashda xatolik.')
    setMemberApplication(null)
  } else {
    setMemberApplication(data)
  }

  setMemberLoading(false)
  return data || null
}
  async function uploadMemberPhoto(file) {
  if (!file || !session?.user?.id || !memberApplication?.id) return

  if (!file.type.startsWith('image/')) {
    setNotice('Faqat rasm faylini yuklash mumkin.')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    setNotice('Rasm hajmi 5 MB dan oshmasligi kerak.')
    return
  }

  setUploading(true)
  setNotice('Rasm yuklanmoqda...')

  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${session.user.id}/${Date.now()}.${extension}`

  const { error: uploadError } = await supabase.storage
    .from('club-images')
    .upload(path, file, { upsert: false })

  if (uploadError) {
    setNotice('Rasm yuklashda xatolik: ' + uploadError.message)
    setUploading(false)
    return
  }

  const { data } = supabase.storage
    .from('club-images')
    .getPublicUrl(path)

  const { error: updateError } = await supabase
    .from('club_applications')
    .update({ photo_url: data.publicUrl })
    .eq('id', memberApplication.id)
    .eq('auth_user_id', session.user.id)

  if (updateError) {
    setNotice('Rasmni saqlashda xatolik: ' + updateError.message)
    setUploading(false)
    return
  }

  await loadMemberApplication(session.user)
  setUploading(false)
  setNotice('Profil rasmi muvaffaqiyatli yangilandi!')
}
  useEffect(() => {
    if (!scannerOpen) return

    if (!window.Html5Qrcode) {
      setNotice('QR skaner kutubxonasi yuklanmadi. Sahifani yangilang.')
      setScannerOpen(false)
      return
    }

    const scanner = new window.Html5Qrcode('member-qr-reader')
    let processing = false
    let cancelled = false
    let started = false

    const stopScanner = async () => {
      try {
        if (started) await scanner.stop()
      } catch {
        // Scanner may already have stopped after a successful scan.
      }
      try {
        scanner.clear()
      } catch {
        // Clearing an already-disposed scanner is harmless.
      }
    }

    const startPromise = scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      async decodedText => {
        if (processing || cancelled) return
        processing = true
        setScannerBusy(true)

        try {
          await stopScanner()
          setScannerOpen(false)
          await recordAttendance({
            method: 'member_scan',
            eventToken: decodedText
          })
        } catch (error) {
          setNotice('QR skanerlashda xatolik: ' + (error?.message || 'Noma’lum xatolik'))
        } finally {
          setScannerBusy(false)
        }
      },
      () => {}
    ).then(async () => {
      started = true
      if (cancelled) await stopScanner()
    }).catch(error => {
      if (!cancelled) {
        setNotice('Kamerani ishga tushirib bo‘lmadi: ' + (error?.message || error))
        setScannerOpen(false)
      }
    })

    return () => {
      cancelled = true
      if (started) {
        stopScanner()
      } else {
        startPromise.then(stopScanner).catch(() => {})
      }
    }
  }, [scannerOpen])
  async function recordAttendance(payload) {
  setNotice('Davomat tekshirilmoqda...')

  const { data, error } = await supabase.functions.invoke(
    'record-attendance',
    { body: payload }
  )

  if (error || data?.error) {
    setNotice('Xatolik: ' + (data?.error || error?.message || 'Davomatni tasdiqlab bo‘lmadi.'))
    return null
  }

  setNotice(
    (data?.memberName || 'A’zo') + ' — davomat muvaffaqiyatli tasdiqlandi!'
  )

  return data
}
  async function loadAttendanceEvents() {
  if (session?.user?.email?.toLowerCase() !== 'obidofich@gmail.com') return

  try {
    const { data, error } = await supabase
      .from('club_events')
      .select('id, title, event_date')
      .order('event_date', { ascending: false })

    if (error) throw error

    const rows = data || []
    setAttendanceEvents(rows)
    const initialEventId = rows.some(row => String(row.id) === String(selectedAttendanceEvent))
      ? String(selectedAttendanceEvent)
      : rows.length ? String(rows[0].id) : ''
    setSelectedAttendanceEvent(initialEventId)
    if (initialEventId) await loadAttendanceRecords(initialEventId)

    if (!rows.length) {
      setNotice('QR yaratish uchun avval kamida bitta tadbir qo‘shing.')
    }
  } catch (error) {
    setAttendanceEvents([])
    setSelectedAttendanceEvent('')
    setNotice('Tadbirlarni yuklashda xatolik: ' + (error?.message || 'Noma’lum xatolik'))
  }
}


async function loadAttendanceRecords(eventId = selectedAttendanceEvent) {
  if (session?.user?.email?.toLowerCase() !== 'obidofich@gmail.com') {
    setAttendanceRecords([])
    return
  }

  const numericEventId = Number(eventId)
  if (!Number.isInteger(numericEventId) || numericEventId <= 0) {
    setAttendanceRecords([])
    return
  }

  setAttendanceLoading(true)
  try {
    const { data, error } = await supabase
      .from('club_attendance')
      .select(`
        id,
        attendance_time,
        method,
        status,
        member:club_applications (
          full_name,
          application_code,
          phone,
          email,
          faculty,
          study_direction,
          course,
          group_number
        )
      `)
      .eq('event_id', numericEventId)
      .eq('status', 'Tasdiqlandi')
      .order('attendance_time', { ascending: false })

    if (error) throw error
    setAttendanceRecords(data || [])
  } catch (error) {
    setAttendanceRecords([])
    setNotice('Davomat ro‘yxatini yuklashda xatolik: ' + (error?.message || 'Noma’lum xatolik'))
  } finally {
    setAttendanceLoading(false)
  }
}

async function createEventQR(eventId) {
  const numericEventId = Number(eventId)
  if (!Number.isInteger(numericEventId) || numericEventId <= 0) {
    setNotice('Avval ro‘yxatdan tadbirni tanlang.')
    return
  }

  if (!session?.user || session.user.email?.toLowerCase() !== 'obidofich@gmail.com') {
    setNotice('QR-kod yaratish uchun administrator sifatida kiring.')
    return
  }

  setQrBusy(true)
  setActiveEventQR(null)
  setNotice('QR-kod tayyorlanmoqda...')

  try {
    // Event uchun QR yozuvi mavjud bo‘lsa faollashtiradi, bo‘lmasa yaratadi.
    const { data, error } = await supabase
      .from('club_event_qr')
      .upsert(
        { event_id: numericEventId, is_active: true },
        { onConflict: 'event_id' }
      )
      .select('id, event_id, token, is_active')
      .single()

    if (error) throw error
    if (!data?.token) {
      throw new Error('Bazadan QR token qaytmadi. club_event_qr jadvalidagi token ustunini tekshiring.')
    }

    setActiveEventQR(data)
    setNotice('QR-kod muvaffaqiyatli tayyorlandi. Uni skanerlab tekshiring.')
  } catch (error) {
    setNotice('QR yaratishda xatolik: ' + (error?.message || 'Noma’lum xatolik'))
  } finally {
    setQrBusy(false)
  }
}
  async function updateApplicationStatus(id, status) {
  if (status === 'Qabul qilindi') {
    setNotice('A’zo akkaunti yaratilmoqda...')

    const { data: result, error } = await supabase.functions.invoke(
      'create-member',
      {
        body: { applicationId: id }
      }
    )

    if (error || result?.error) {
      setNotice('Xatolik: ' + (result?.error || error?.message || 'A’zoni qabul qilib bo‘lmadi.'))
      return
    }

    setNotice(
      'A’zo muvaffaqiyatli qabul qilindi. A’zolik raqami: ' +
      (result?.membershipCode || 'yaratildi')
    )
  } else {
    const { error } = await supabase
      .from('club_applications')
      .update({ status })
      .eq('id', id)

    if (error) {
      setNotice('Holatni yangilashda xatolik: ' + error.message)
      return
    }

    setNotice('Ariza holati yangilandi.')
  }

  await loadApplications()
}
  async function deleteApplication(id) {
  const confirmed = window.confirm(
    'Ushbu arizani butunlay o‘chirishni tasdiqlaysizmi?'
  )

  if (!confirmed) return

  const { error } = await supabase
    .from('club_applications')
    .delete()
    .eq('id', id)

  if (error) {
    setNotice('O‘chirishda xatolik: ' + error.message)
    return
  }

  setApplications(prev => prev.filter(app => app.id !== id))
  setNotice('Ariza muvaffaqiyatli o‘chirildi.')
}
async function submitFeedback(event) {
  event.preventDefault()
  if (!feedbackMessage.trim()) {
    setNotice('Murojaat matnini kiriting.')
    return
  }
  setFeedbackBusy(true)
  try {
    const { error } = await supabase.from('club_feedback').insert({
      full_name: feedbackAnonymous ? null : (feedbackName.trim() || null),
      contact_info: feedbackAnonymous ? null : (feedbackContact.trim() || null),
      message: feedbackMessage.trim(),
      is_anonymous: feedbackAnonymous
    })
    if (error) throw error
    setFeedbackName('')
    setFeedbackContact('')
    setFeedbackMessage('')
    setFeedbackAnonymous(false)
    setNotice('Murojaatingiz muvaffaqiyatli yuborildi.')
  } catch (error) {
    setNotice('Murojaat yuborilmadi: ' + (error?.message || 'Jadval sozlamasini tekshiring.'))
  } finally {
    setFeedbackBusy(false)
  }
}

async function loadFeedback() {
  if (session?.user?.email?.toLowerCase() !== 'obidofich@gmail.com') return
  setFeedbackLoading(true)
  const { data, error } = await supabase
    .from('club_feedback')
    .select('id, full_name, contact_info, message, is_anonymous, created_at, status, admin_reply, replied_at')
    .order('created_at', { ascending: false })
  if (error) setNotice('Murojaatlarni yuklashda xatolik: ' + error.message)
  else setFeedbackRows(data || [])
  setFeedbackLoading(false)
}

async function updateFeedbackStatus(id, status) {
  const { error } = await supabase
    .from('club_feedback')
    .update({ status })
    .eq('id', id)

  if (error) {
    setNotice('Murojaat holatini yangilashda xatolik: ' + error.message)
    return
  }

  setFeedbackRows(rows => rows.map(row => row.id === id ? { ...row, status } : row))
  setNotice(status === 'O‘qildi' ? 'Murojaat o‘qilgan deb belgilandi.' : 'Murojaat qayta yangi deb belgilandi.')
}

async function replyToFeedback(id) {
  const reply = (feedbackReplyDrafts[id] || '').trim()
  if (!reply) {
    setNotice('Javob matnini kiriting.')
    return
  }

  setFeedbackReplyBusy(id)
  const { error } = await supabase
    .from('club_feedback')
    .update({ admin_reply: reply, replied_at: new Date().toISOString() })
    .eq('id', id)

  setFeedbackReplyBusy(null)
  if (error) {
    setNotice('Javobni saqlashda xatolik: ' + error.message)
    return
  }

  setFeedbackRows(rows => rows.map(row => row.id === id
    ? { ...row, admin_reply: reply, replied_at: new Date().toISOString() }
    : row
  ))
  setFeedbackReplyDrafts(drafts => ({ ...drafts, [id]: '' }))
  setNotice('Javob muvaffaqiyatli saqlandi.')
}

async function deleteFeedback(id) {
  if (!window.confirm('Ushbu murojaatni butunlay o‘chirishni tasdiqlaysizmi?')) return

  const { error } = await supabase
    .from('club_feedback')
    .delete()
    .eq('id', id)

  if (error) {
    setNotice('Murojaatni o‘chirishda xatolik: ' + error.message)
    return
  }

  setFeedbackRows(rows => rows.filter(row => row.id !== id))
  setNotice('Murojaat muvaffaqiyatli o‘chirildi.')
}

function go(nextPage) {
  if (!allowedPages.has(nextPage)) return

  setPage(nextPage)
  setMenu(false)
  setNotice('')

  // Har bir bo‘limga to‘g‘ridan-to‘g‘ri havola orqali kirish mumkin.
  const url = new URL(window.location.href)
  if (nextPage === 'home') url.searchParams.delete('page')
  else url.searchParams.set('page', nextPage)

  window.history.pushState({}, document.title, url.pathname + url.search + url.hash)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function checkApplicationStatus(event) {
  event.preventDefault()
  const code = applicationLookupCode.trim().toUpperCase()
  if (!/^YPC-[A-Z0-9]{8}$/.test(code)) {
    setNotice('Ariza raqamini YPC-XXXXXXXX shaklida kiriting.')
    return
  }
  setApplicationLookupBusy(true)
  setApplicationLookupResult(null)
  try {
    const { data, error } = await supabase.functions.invoke('rapid-processor', {
      body: { applicationCode: code }
    })
    if (error || data?.error) throw new Error(data?.error || error?.message || 'Tekshirib bo‘lmadi.')
    setApplicationLookupResult(data)
  } catch (error) {
    setNotice('Ariza holatini tekshirishda xatolik: ' + (error?.message || 'Qayta urinib ko‘ring.'))
  } finally {
    setApplicationLookupBusy(false)
  }
}

async function submitApplication(event) {
  event.preventDefault()
  setApplicationBusy(true)
  setApplicationMessage('')

  if (application.confirmation !== 'Ha, tasdiqlayman') {
    setApplicationMessage('Ma’lumotlarni tasdiqlashingiz kerak.')
    setNotice('Ma’lumotlarni tasdiqlashingiz kerak.')
    setApplicationBusy(false)
    return
  }

  try {
    const applicationCode = 'YPC-' + crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()
    const { error } = await supabase
      .from('club_applications')
      .insert([{ ...application, application_code: applicationCode }])

    if (error) throw error

    setApplicationSuccess(applicationCode)
    setNotice('Arizangiz muvaffaqiyatli yuborildi! Raqam: ' + applicationCode)
    setApplication(emptyApplication)
  } catch (error) {
    setApplicationMessage('Xatolik: ' + (error?.message || 'Arizani yuborib bo‘lmadi.'))
    setNotice('Arizani yuborishda xatolik: ' + (error?.message || 'Noma’lum xatolik'))
  } finally {
    setApplicationBusy(false)
  }
}
async function updatePassword(event) {
  event.preventDefault()
  setNotice('')

  const form = event.currentTarget
  const newPassword = form.elements.newPassword.value
  const confirmPassword = form.elements.confirmPassword.value

  if (newPassword.length < 8) {
    setNotice('Parol kamida 8 ta belgidan iborat bo‘lishi kerak.')
    return
  }

  if (newPassword !== confirmPassword) {
    setNotice('Kiritilgan parollar bir-biriga mos kelmadi.')
    return
  }

  setResetBusy(true)
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  })
  setResetBusy(false)

  if (error) {
    setNotice('Parolni saqlashda xatolik: ' + error.message)
    return
  }

  setNotice('Parol muvaffaqiyatli o‘rnatildi!')
  const currentUser = data?.user || session?.user
  if (currentUser) {
    await loadMemberApplication(currentUser)
  }
  setPage('member')
  window.history.replaceState({}, document.title, window.location.pathname + '?page=member')
}

async function login(event) {
  event.preventDefault()
  setBusy(true)
  setNotice('')

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    })

    if (error) throw error

    const signedInEmail = (data?.user?.email || '').toLowerCase()
    setPassword('')

    if (signedInEmail === 'obidofich@gmail.com') {
      setNotice('Administrator sifatida muvaffaqiyatli kirdingiz.')
      go('admin')
    } else {
      setNotice('Tizimga muvaffaqiyatli kirdingiz. Shaxsiy kabinetingiz yuklanmoqda.')
      go('member')
    }
  } catch (error) {
    setNotice('Kirish amalga oshmadi: ' + (error?.message || 'Email yoki parolni tekshiring.'))
  } finally {
    setBusy(false)
  }
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

  try {
    const rows = Object.entries(draft).map(([setting_key, setting_value]) => ({
      setting_key,
      setting_value: setting_value ?? ''
    }))

    const { error } = await supabase
      .from('site_settings')
      .upsert(rows, { onConflict: 'setting_key' })

    if (error) throw error

    setSettings({ ...draft })
    setNotice('Sozlamalar muvaffaqiyatli saqlandi.')
  } catch (error) {
    setNotice('Saqlashda xatolik: ' + (error?.message || 'Noma’lum xatolik'))
  } finally {
    setBusy(false)
  }
}

async function logout() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    go('home')
    setNotice('Tizimdan muvaffaqiyatli chiqdingiz.')
  } catch (error) {
    setNotice('Tizimdan chiqishda xatolik: ' + (error?.message || 'Noma’lum xatolik'))
  }
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

// Kontent faqat tizimga kirgan administrator tomonidan qo‘shiladi.
const { data: authData, error: authError } = await supabase.auth.getUser()
if (authError || !authData?.user || authData.user.email?.toLowerCase() !== 'obidofich@gmail.com') {
  setNotice('Saqlash uchun administrator akkauntiga qayta kiring.')
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
const message = error.code === '42501' || /row-level security|RLS/i.test(error.message || '')
  ? 'Supabase RLS ruxsati yo‘q. SQL Editor’da administrator INSERT/UPDATE/DELETE siyosatini yoqing.'
  : error.message
setNotice('Saqlashda xatolik: ' + message)
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
const confirmed = window.confirm('Ushbu kontentni butunlay o‘chirishni tasdiqlaysizmi?')
if (!confirmed) return

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
              onClick={type === 'gallery' ? () => setGalleryPreview(row) : undefined}
              role={type === 'gallery' ? 'button' : undefined}
              tabIndex={type === 'gallery' ? 0 : undefined}
              onKeyDown={type === 'gallery' ? event => { if (event.key === 'Enter' || event.key === ' ') setGalleryPreview(row) } : undefined}
              style={{
                width: '100%',
                maxHeight: '220px',
                objectFit: 'cover',
                marginBottom: '12px',
                cursor: type === 'gallery' ? 'zoom-in' : 'default',
                borderRadius: 14,
                transition: 'transform .25s ease'
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

              {session && session.user.email?.toLowerCase() === 'obidofich@gmail.com' && (
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

function answerSiteAssistant(question) {
 const q=(question||'').toLocaleLowerCase('uz-UZ').trim()
 if(/parol|password|pasport|karta raqam|maxfiy|shaxsiy ma.?lumot/i.test(q)) return 'Xavfsizlik uchun parol, pasport, karta yoki boshqa shaxsiy ma’lumotlarni chatga yozmang. Bu yordamchi bunday ma’lumotlarni so‘ramaydi.'
 if(/a.?zolik|a.?zo bo|ariza|qabul/i.test(q)) return 'Klubga a’zo bo‘lish uchun “A’zolikka ariza” bo‘limiga o‘ting va shaklni to‘ldiring. Ariza holatini tekshirish ham shu bo‘limda mavjud.'
 if(/tadbir|uchrashuv|kalend|qachon|sana/i.test(q)) {
  const rows=(events||[]).filter(e=>e.event_date&&new Date(e.event_date)>=new Date()).sort((a,b)=>new Date(a.event_date)-new Date(b.event_date)).slice(0,5)
  return rows.length?'Saytdagi yaqin tadbirlar:\n'+rows.map(e=>'• '+e.title+' — '+new Date(e.event_date).toLocaleString('uz-UZ',{dateStyle:'medium',timeStyle:'short'})).join('\n'):'Saytda hozircha kelgusi tadbirlar sanasi ko‘rsatilmagan. “Tadbirlar” sahifasidagi kalendardan tekshiring.'
 }
 if(/yangilik|xabar/i.test(q)) return (news||[]).length?'Yangiliklar:\n'+news.slice(0,5).map(n=>'• '+n.title).join('\n'):'Saytda hozircha yangilik e’lon qilinmagan.'
 if(/hujjat|nizom|konsepsiya|ustav/i.test(q)) return 'Rasmiy hujjatlarni “Hujjatlar” bo‘limidan ko‘rishingiz mumkin.'
 if(/murojaat|taklif|shikoyat|fikr/i.test(q)) return 'Taklif yoki murojaat yuborish uchun “Murojaatlar” bo‘limidan foydalaning. Maxfiy ma’lumotlarni yubormang.'
 if(/aloqa|bog.?lan|telefon|telegram|email|pochta|manzil/i.test(q)) return `Bog‘lanish: ${settings.phone||'telefon ko‘rsatilmagan'}; ${settings.telegram||'Telegram ko‘rsatilmagan'}; ${settings.email||'email ko‘rsatilmagan'}; ${settings.address||'manzil ko‘rsatilmagan'}. Batafsil “Bog‘lanish” sahifasida.`
 if(/klub haqida|tarix|maqsad|vazifa|faoliyat/i.test(q)) return settings.about_intro||settings.about_today||'Klub yoshlarning huquqiy bilimini, yetakchiligini va tashabbuslarini qo‘llab-quvvatlashga qaratilgan. “Klub haqida” sahifasida batafsil ma’lumot bor.'
 if(/rahmat|tashakkur/i.test(q)) return 'Marhamat! Yana savolingiz bo‘lsa, yozing.'
 return 'Bu savol bo‘yicha saytda tasdiqlangan ochiq ma’lumot topilmadi. “Klub haqida”, “Hujjatlar”, “Tadbirlar” yoki “Bog‘lanish” bo‘limlarini ko‘rib chiqing. Taxminiy javob bermayman.'
}
async function sendAssistantMessage(text=assistantInput) {
 const question=(text||'').trim()
 if(!question || assistantBusy) return
 const containsSensitive = /(?:\b\d{14}\b|\b[A-ZА-Я]{2}\s?\d{7}\b|\+?998[\s()-]?\d{2}[\s()-]?\d{3}[\s()-]?\d{2}[\s()-]?\d{2}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i.test(question)
 if(containsSensitive) {
   setAssistantInput('')
   setAssistantMessages(current=>[...current,{role:'assistant',text:'Xavfsizlik uchun telefon, email, pasport yoki JShShIR kabi shaxsiy ma’lumotlarni chatga yubormang. Savolingizni ushbu ma’lumotlarsiz qayta yozing.'}])
   return
 }
 setAssistantInput('')
 setAssistantMessages(current=>[...current,{role:'user',text:question}])
 setAssistantBusy(true)
 try {
   // Faqat saytda hammaga ochiq bo‘lgan ma’lumotlar yuboriladi.
   // Arizalar, a’zolar, QR-davomat, murojaatlar va login ma’lumotlari yuborilmaydi.
   const publicContext = {
     club: {
       name: 'Youth Parliament Club',
       about: settings.about_history || settings.about_intro || 'Yoshlar tashabbuslari va ijtimoiy faolligini qo‘llab-quvvatlovchi klub.',
       today: settings.about_today || '',
       future: settings.about_future || '',
       university: 'Xalqaro ijtimoiy innovatsiyalar universiteti',
       founded: '2026-yil noyabr'
     },
     events: (events || []).slice(0, 20).map(item=>({
       title: item.title || '',
       date: item.event_date || '',
       description: item.description || ''
     })),
     news: (news || []).slice(0, 15).map(item=>({
       title: item.title || '',
       description: item.description || ''
     })),
     publicContact: {
       phone: settings.phone || '',
       email: settings.email || '',
       telegram: settings.telegram || '',
       address: settings.address || ''
     },
     publicSections: ['Bosh sahifa','Klub haqida','A’zolikka ariza','Tadbirlar','Yangiliklar','Hujjatlar','Galereya','Bog‘lanish']
   }
   const {data,error} = await supabase.functions.invoke('ypc-assistant',{body:{question,context:publicContext}})
   if(error) throw error
   const reply = data?.answer
   if(typeof reply !== 'string' || !reply.trim()) throw new Error('AI javobi bo‘sh qaytdi')
   setAssistantMessages(current=>[...current,{role:'assistant',text:reply.trim()}])
 } catch(error) {
   console.error('YPC assistant error:',error)
   setAssistantMessages(current=>[...current,{role:'assistant',text:'AI yordamchi hozircha ulanmagan yoki vaqtincha javob bermayapti. Supabase’da ypc-assistant funksiyasi va OPENAI_API_KEY sozlamasini tekshiring. Shaxsiy ma’lumotlaringiz yuborilmadi.'}])
 } finally {
   setAssistantBusy(false)
 }
}

return (
<div className="app">
<style>{`
.admin-dashboard{margin:0 0 22px;padding:22px;border:1px solid #e7eaf0;border-radius:20px;background:linear-gradient(135deg,#fff 0%,#f7f8fb 100%);box-shadow:0 12px 32px rgba(18,32,55,.06)}
.admin-dashboard-top{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:18px}
.admin-eyebrow{font-size:10px;font-weight:800;letter-spacing:.16em;color:#a47b35}
.admin-dashboard-top h2{margin:5px 0 4px;font-size:25px;color:#17263a}
.admin-dashboard-top p{margin:0;color:#667085;font-size:13px}
.admin-refresh{display:inline-flex;align-items:center;gap:8px;padding:10px 13px;border:1px solid #e0e4eb;border-radius:11px;background:#fff;color:#344054;font-weight:700;cursor:pointer}
.admin-stat-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:18px 0}
.admin-stat-grid button{display:flex;flex-direction:column;align-items:flex-start;gap:4px;text-align:left;padding:14px 15px;border:1px solid #e8ebf0;border-radius:14px;background:#fff;cursor:pointer}
.admin-stat-grid button span{font-size:12px;color:#667085;font-weight:650}
.admin-stat-grid button strong{font-size:27px;line-height:1.1;color:#17263a}
.admin-stat-grid button small{font-size:11px;color:#98a2b3}
.admin-tabs{display:flex;gap:7px;flex-wrap:wrap;padding-top:14px;border-top:1px solid #e9ecf1}
.admin-tabs button{padding:9px 14px;border:1px solid transparent;border-radius:10px;background:#f0f2f6;color:#475467;font-size:13px;font-weight:700;cursor:pointer}
.admin-tabs button.active{background:#172b45;color:#fff;box-shadow:0 5px 14px rgba(23,43,69,.16)}
.admin-overview-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-bottom:24px}
.admin-overview-grid button{display:flex;flex-direction:column;align-items:flex-start;gap:9px;padding:19px;border:1px solid #e7eaf0;border-radius:16px;background:#fff;text-align:left;cursor:pointer;transition:transform .2s,box-shadow .2s}
.admin-overview-grid button:hover{transform:translateY(-2px);box-shadow:0 12px 24px rgba(18,32,55,.08)}
.admin-overview-grid button svg{color:#a47b35}
.admin-overview-grid button strong{font-size:15px;color:#17263a}
.admin-overview-grid button span{font-size:12px;color:#667085;line-height:1.5}
.admin-overview-grid button b{font-size:12px;color:#9b742f;margin-top:3px}
.admin-section{display:grid;gap:16px;max-width:100%}
.admin-section .form-card{margin:0;padding:20px;border-radius:16px}
.admin-section .applications-list{display:grid;gap:10px}
.admin-section .application-item{padding:15px;border:1px solid #e8ebf0;border-radius:13px;background:#fff;color:#172033}
.admin-section .application-item summary,
.admin-section .application-item strong,
.admin-section .application-item p,
.admin-section .application-item b,
.admin-section .application-item small,
.admin-section .application-item span{color:#172033}
.admin-section .application-item summary{cursor:pointer}
.admin-section .application-item .application-actions button{color:#172033}
.admin-section .application-actions{display:flex;flex-wrap:wrap;gap:8px}
.admin-section .application-actions button{min-height:38px;padding:8px 12px;border-radius:9px;font-size:12px}
.admin-section .form-card h2{margin-top:0;font-size:18px}
.admin-section input,.admin-section textarea,.admin-section select{border-radius:10px}
@media(max-width:760px){.admin-dashboard{padding:15px;border-radius:15px}.admin-dashboard-top{flex-direction:column}.admin-dashboard-top h2{font-size:21px}.admin-stat-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.admin-overview-grid{grid-template-columns:1fr}.admin-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}.admin-tabs button{padding:9px 5px;font-size:11px}.admin-section .form-card{padding:15px}.admin-section .application-actions button{flex:1 1 auto}}
.global-toast{position:fixed;top:18px;left:50%;transform:translateX(-50%);z-index:2147483647;display:flex;align-items:center;gap:12px;width:min(560px,calc(100vw - 28px));min-height:58px;padding:13px 18px 16px;border-radius:13px;color:#fff;box-shadow:0 12px 36px rgba(0,0,0,.22);overflow:hidden;font-size:14px;font-weight:600}
.global-toast.success{background:#168447;border:1px solid #36b56f}
.global-toast.error{background:#c83232;border:1px solid #ed6666}
.toast-icon{display:grid;place-items:center;flex:0 0 27px;width:27px;height:27px;border:2px solid rgba(255,255,255,.9);border-radius:50%;font-size:17px;font-weight:800}
.toast-message{flex:1;line-height:1.4;overflow-wrap:anywhere}
.toast-close{border:0;background:transparent;color:#fff;font-size:24px;line-height:1;cursor:pointer;padding:0 2px}
.toast-progress{position:absolute;bottom:0;left:0;width:100%;height:4px;background:rgba(255,255,255,.9);transform-origin:left center}
.feedback-warning{background:#fff0f0;border:1px solid #efb0b0;color:#a32626;padding:13px 15px;border-radius:14px;font-size:13px;line-height:1.55;margin-bottom:16px}.feedback-warning strong{font-weight:800}
.feedback-status{display:inline-flex;align-items:center;padding:5px 10px;border-radius:20px;font-size:12px;font-weight:700;white-space:nowrap}
.feedback-status.is-new{background:#fff0d6;color:#8a5200}
.feedback-status.is-read{background:#e2f4e9;color:#176b3a}
.feedback-admin-reply{margin:14px 0;padding:12px 14px;border-left:3px solid #b58a43;background:rgba(181,138,67,.08);border-radius:8px}
.feedback-admin-reply p{margin:7px 0}
.feedback-admin-reply small{display:block;color:#777}

@media(max-width:600px){.global-toast{top:50%;left:50%;translate:-50% -50%;padding:13px 14px 16px;font-size:13px;border-radius:13px;width:min(440px,calc(100vw - 34px))}}
/* Application status checker */
.application-status-check{margin:0 0 22px;padding:22px;border-radius:20px;background:linear-gradient(130deg,#10243d,#244766);border:1px solid rgba(216,179,109,.35);box-shadow:0 14px 34px rgba(15,35,58,.12);color:#fff}
.application-status-check .status-check-kicker{font-size:10px;font-weight:900;letter-spacing:2px;color:#e7bd70}
.application-status-check h2{margin:7px 0;color:#fff;font-size:22px}
.application-status-check p{margin:0 0 15px;color:rgba(255,255,255,.72);font-size:13px}
.application-status-check form{display:flex;gap:10px}
.application-status-check input{flex:1;min-width:0;background:#fff!important;color:#14243a!important;border:1px solid #d9e0e8!important;border-radius:11px;padding:12px 14px!important;font-weight:800;letter-spacing:1px}
.application-status-check button{border:0;border-radius:11px;background:#d9b36d;color:#17283e;font-weight:850;padding:12px 16px;cursor:pointer}
.application-status-check button:disabled{opacity:.6;cursor:wait}
.status-check-result{display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-top:14px;padding:12px 14px;border-radius:12px;background:rgba(255,255,255,.1);color:#fff}
.status-check-result strong{color:#f1ce8e}
@media(max-width:600px){.application-status-check form{flex-direction:column}.application-status-check button{width:100%}}
.site-global-search{position:relative;display:flex;align-items:center;min-width:180px;max-width:230px;margin:0 12px}
.site-global-search input{width:100%;border:1px solid #e2e6ec!important;border-radius:10px;padding:9px 12px!important;background:#fff!important;color:#17283e!important;font-size:12px}
.site-global-search>button{border:0;background:transparent;color:#8a6a36;font-size:20px;cursor:pointer}
.site-search-results{position:absolute;top:calc(100% + 8px);left:0;right:0;z-index:2000;background:#fff;border:1px solid #e3e7ed;border-radius:13px;box-shadow:0 14px 35px rgba(12,30,52,.16);padding:7px;max-height:300px;overflow:auto}
.site-search-results button{display:flex;width:100%;flex-direction:column;align-items:flex-start;gap:3px;padding:9px 10px;border:0;border-radius:8px;background:#fff;color:#17283e;text-align:left;cursor:pointer}
.site-search-results button:hover{background:#f5f2eb}.site-search-results small{font-size:10px;color:#a47b3d}.site-search-results p{padding:8px;color:#667;margin:0;font-size:12px}
.admin-global-results{margin:16px 0}.admin-result-shortcuts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin:12px 0}.admin-result-shortcuts button{display:flex;justify-content:space-between;gap:8px;border:1px solid #e4e8ef;border-radius:10px;background:#f8f9fb;padding:11px;color:#17283e;cursor:pointer}
.events-calendar{margin:12px 0 24px}.calendar-heading{display:flex;align-items:center;justify-content:space-between;gap:12px}.calendar-heading h2{text-transform:capitalize;margin:0;font-size:19px}.calendar-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:7px;margin:18px 0}.calendar-grid>b{text-align:center;color:#9b7a45;font-size:12px;padding:6px}.calendar-grid>button,.calendar-empty{min-height:42px;border:1px solid #e7eaf0;border-radius:10px;background:#fff;color:#1c2e45;position:relative}.calendar-grid>button{cursor:pointer}.calendar-grid>button.selected{background:#162d48;color:#fff;border-color:#162d48}.calendar-grid>button.has-event:after{content:'';position:absolute;bottom:5px;left:50%;width:5px;height:5px;border-radius:50%;background:#c49a52;transform:translateX(-50%)}.calendar-grid>button.selected.has-event:after{background:#fff}.calendar-event-list{border-top:1px solid #e8ebf0;padding-top:12px}.calendar-event-list article{padding:10px 12px;border-radius:10px;background:#f7f8fa;margin-top:8px}.calendar-event-list p{margin:5px 0 0;color:#657286;font-size:13px}
@media(max-width:900px){.site-global-search{order:4;max-width:none;width:100%;margin:8px 0}.admin-result-shortcuts{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:600px){.calendar-grid{gap:4px}.calendar-grid>button,.calendar-empty{min-height:36px}.calendar-heading h2{font-size:16px}}
/* Unified platform improvements */
.admin-search-wrap{display:flex;align-items:center;gap:10px;margin-top:16px;padding:10px 13px;border:1px solid #e4e8ef;border-radius:14px;background:#fff}
.admin-search-wrap>span{font-size:24px;color:#a47b3d;line-height:1}
.admin-search-wrap input{flex:1;min-width:0;border:0!important;outline:none!important;box-shadow:none!important;background:transparent!important;padding:8px 4px!important}
.admin-search-wrap button{border:0;background:#f2eee5;color:#23354c;border-radius:9px;padding:8px 11px;font-weight:700;cursor:pointer}
.admin-tab-count{display:inline-grid;place-items:center;min-width:19px;height:19px;margin-left:7px;padding:0 5px;border-radius:20px;background:#c99f58;color:#14243a;font-size:11px;font-weight:900}
.gallery-lightbox{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:24px;background:rgba(5,14,27,.88);backdrop-filter:blur(8px)}
.gallery-lightbox-panel{position:relative;width:min(100%,980px);max-height:90vh;overflow:auto;padding:14px;border-radius:22px;background:#10243d;border:1px solid rgba(231,189,112,.35);box-shadow:0 25px 80px rgba(0,0,0,.4)}
.gallery-lightbox-panel img{display:block;width:100%;max-height:75vh;object-fit:contain;border-radius:14px;background:#071321}
.gallery-lightbox-panel h3{color:#fff;margin:14px 8px 4px}
.gallery-lightbox-panel p{color:rgba(255,255,255,.75);margin:4px 8px 10px}
.gallery-lightbox-close{position:absolute;z-index:2;right:22px;top:22px;width:42px;height:42px;border:1px solid rgba(255,255,255,.35);border-radius:50%;background:rgba(5,14,27,.8);color:#fff;font-size:28px;line-height:1;cursor:pointer}
@media(max-width:640px){.admin-search-wrap{align-items:stretch}.admin-search-wrap input{font-size:13px}.gallery-lightbox{padding:10px}.gallery-lightbox-panel{padding:9px}}

.home-live-section,.home-upcoming-section{margin:34px 0;padding:28px;border:1px solid #e7eaf0;border-radius:22px;background:#fff;box-shadow:0 12px 34px rgba(15,35,58,.05)}
.home-live-heading h2,.home-upcoming-heading h2{margin:8px 0 0;color:#172b45;font-size:clamp(20px,3vw,28px)}
.home-live-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:22px}
.home-live-stats article{padding:18px;border-radius:15px;background:linear-gradient(145deg,#10243d,#254867);color:#fff;display:flex;flex-direction:column;gap:5px;min-width:0}
.home-live-stats strong{font-size:32px;line-height:1;color:#e7bd70}.home-live-stats span{font-weight:800}.home-live-stats small{color:rgba(255,255,255,.65);font-size:11px}
.home-upcoming-heading{display:flex;justify-content:space-between;align-items:center;gap:12px}.home-upcoming-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:18px}.home-upcoming-grid article{padding:18px;border:1px solid #e7eaf0;border-radius:15px;background:#fafbfc}.home-upcoming-grid small{color:#a47b3d;font-weight:800}.home-upcoming-grid h3{margin:9px 0;color:#172b45}.home-upcoming-grid p,.home-upcoming-empty{color:#647287;font-size:13px;line-height:1.6}.home-upcoming-empty{margin-top:18px;padding:18px;border-radius:14px;background:#f7f8fa}
@media(max-width:760px){.home-live-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.home-upcoming-grid{grid-template-columns:1fr}.home-live-section,.home-upcoming-section{padding:19px}.home-upcoming-heading{align-items:flex-start;flex-direction:column}}\n

/* Accessible contrast corrections for both themes */
.about-section-copy h2{color:#102744!important}
.about-section-copy p{color:#43546b!important}
.about-team h2,.about-future h2{color:#102744!important}
.about-team p,.about-future p{color:#53647a!important}
.about-metric{background:#fffdf8!important;border-color:#d9c69e!important}
.about-metric strong{color:#9a7134!important}
.about-metric span{color:#40516a!important}
.about-role{background:#fffdf8!important;color:#172b45!important;border-color:#d8c49a!important}
.about-role span{color:#172b45!important}
.about-role small{color:#66758a!important}
.about-pill{color:#946b2e!important;background:#f5ecd9!important}
html[data-yp-theme="dark"] .about-modern{color:#edf2f8!important}
html[data-yp-theme="dark"] .about-section-copy h2,
html[data-yp-theme="dark"] .about-team h2,
html[data-yp-theme="dark"] .about-future h2{color:#f4dba9!important}
html[data-yp-theme="dark"] .about-section-copy p,
html[data-yp-theme="dark"] .about-team p,
html[data-yp-theme="dark"] .about-future p{color:#d0dae6!important}
html[data-yp-theme="dark"] .about-metric{background:linear-gradient(145deg,#132f4c,#0d233b)!important;border-color:rgba(200,166,107,.38)!important}
html[data-yp-theme="dark"] .about-metric strong{color:#f0cc86!important}
html[data-yp-theme="dark"] .about-metric span{color:#d0dae6!important}
html[data-yp-theme="dark"] .about-role{background:#102944!important;color:#f0f3f7!important;border-color:rgba(200,166,107,.38)!important}
html[data-yp-theme="dark"] .about-role b{color:#e8c987!important}
html[data-yp-theme="dark"] .about-role span{color:#f0f3f7!important}
html[data-yp-theme="dark"] .about-role small{color:#c4d0de!important}
html[data-yp-theme="dark"] .about-pill{color:#f0d39d!important;background:rgba(200,166,107,.16)!important;border:1px solid rgba(200,166,107,.32)!important}
html[data-yp-theme="dark"] .about-section-art{background:#0a1b2d!important}
html[data-yp-theme="dark"] .yp-assistant-messages{background:linear-gradient(180deg,#102944,#081a30)!important}
html[data-yp-theme="dark"] .yp-assistant-bubble{color:#f1f4f8!important}
.yp-assistant-quick button:disabled,.yp-assistant-compose button:disabled{opacity:.55;cursor:wait}
.yp-assistant-privacy{color:#53647a!important}
html[data-yp-theme="dark"] .yp-assistant-privacy{color:#c2cedb!important}

/* Youth Parliament premium navy & champagne theme */
:root{--yp-navy:#081a30;--yp-navy2:#102b49;--yp-gold:#c8a66b;--yp-gold2:#e7d2a5;--yp-ink:#152840;--yp-muted:#66758a;--yp-paper:#f4f1e9;--yp-card:#fffdf8}
html,body{min-height:100%;background:var(--yp-paper)!important;color:var(--yp-ink)}
body{background:radial-gradient(ellipse at 8% 0%,rgba(200,166,107,.13),transparent 30%),linear-gradient(145deg,#f4f1e9,#e9edf2 58%,#f5f1e8)!important;background-attachment:fixed!important;color:var(--yp-ink)}
.app,.main,.page{background:transparent!important;color:var(--yp-ink)}
.topbar{background:rgba(8,26,48,.97)!important;color:#f8f4eb!important;border-bottom:1px solid rgba(200,166,107,.42)!important;box-shadow:0 10px 35px rgba(8,26,48,.18)!important;backdrop-filter:blur(18px)}
.topbar .brand-copy strong,.topbar .brand-copy small,.topbar .top-links,.topbar .top-links button{color:#f2e8d2!important}
.topbar .top-links button.top-link-active{color:#e7c98f!important}
.topbar .top-links button.top-join{background:linear-gradient(135deg,#d9bd83,#b58d4d)!important;color:#10243c!important}
.sidebar{background:rgba(248,246,239,.96)!important;border-right:1px solid rgba(181,145,83,.28)!important}
.sidebar button{color:#34465e}
.sidebar button.active,.sidebar button[aria-current="page"]{background:#eee6d6!important;color:#0b2039!important}
.form-card,.info-panel,.doc-card,.contact-card,.news-card,.event-card,.membership-box,.home-live-section,.home-upcoming-section,.events-calendar{border:1px solid rgba(173,146,101,.28)!important;border-radius:20px!important;box-shadow:0 16px 42px rgba(8,26,48,.09)!important;background:linear-gradient(145deg,rgba(255,253,248,.98),rgba(246,243,235,.98))!important;backdrop-filter:blur(12px)}
.form-card h1,.form-card h2,.form-card h3,.info-panel h2,.doc-card h2,.contact-card h2,.event-card h3,.news-card h3,.page-head h1{color:#102744}
.form-card p,.info-panel p,.doc-card p,.contact-card p,.event-card p,.news-card p{color:#53647a}
.form-card input,.form-card textarea,.form-card select,.yp-assistant-compose input{background:#fffdf8!important;color:#152840!important;border:1px solid #cdb783!important}
.gold-btn,.top-join{background:linear-gradient(135deg,#d9bd83,#b58d4d)!important;color:#10243c!important;border:1px solid #b58d4d!important}
.footer{border-top:1px solid rgba(181,145,83,.35)!important;background:rgba(8,26,48,.97)!important;color:#e9dfcc!important;border-radius:18px 18px 0 0}
.footer span,.footer button{color:#e9dfcc!important}
.yp-theme-toggle{display:inline-flex!important;align-items:center;justify-content:center;gap:6px;padding:9px 12px!important;border:1px solid rgba(231,210,165,.55)!important;border-radius:999px!important;background:rgba(255,255,255,.08)!important;color:#f3dfb8!important;font-size:11px!important;font-weight:800!important;white-space:nowrap}
.yp-theme-toggle:hover{background:rgba(231,210,165,.18)!important}
html[data-yp-theme="dark"],html[data-yp-theme="dark"] body{background:#071426!important;color:#e8edf4!important}
html[data-yp-theme="dark"] body{background:radial-gradient(ellipse at 10% 0%,rgba(200,166,107,.12),transparent 32%),linear-gradient(145deg,#071426,#0b1d33 55%,#10243b)!important;background-attachment:fixed!important}
html[data-yp-theme="dark"] .app,html[data-yp-theme="dark"] .main,html[data-yp-theme="dark"] .page{background:transparent!important;color:#e8edf4!important}
html[data-yp-theme="dark"] .topbar{background:rgba(5,16,30,.97)!important}
html[data-yp-theme="dark"] .sidebar{background:rgba(9,27,47,.97)!important;border-color:rgba(200,166,107,.25)!important}
html[data-yp-theme="dark"] .sidebar button{color:#c6d0dc!important}
html[data-yp-theme="dark"] .sidebar button.active,html[data-yp-theme="dark"] .sidebar button[aria-current="page"]{background:rgba(200,166,107,.18)!important;color:#f1d7a4!important}
html[data-yp-theme="dark"] .form-card,html[data-yp-theme="dark"] .info-panel,html[data-yp-theme="dark"] .doc-card,html[data-yp-theme="dark"] .contact-card,html[data-yp-theme="dark"] .news-card,html[data-yp-theme="dark"] .event-card,html[data-yp-theme="dark"] .membership-box,html[data-yp-theme="dark"] .home-live-section,html[data-yp-theme="dark"] .home-upcoming-section,html[data-yp-theme="dark"] .events-calendar{background:linear-gradient(145deg,#102944,#0b2038)!important;border:1px solid rgba(200,166,107,.3)!important;box-shadow:0 18px 45px rgba(0,0,0,.24)!important;color:#e8edf4!important}
html[data-yp-theme="dark"] .form-card h1,html[data-yp-theme="dark"] .form-card h2,html[data-yp-theme="dark"] .form-card h3,html[data-yp-theme="dark"] .info-panel h2,html[data-yp-theme="dark"] .doc-card h2,html[data-yp-theme="dark"] .contact-card h2,html[data-yp-theme="dark"] .event-card h3,html[data-yp-theme="dark"] .news-card h3,html[data-yp-theme="dark"] .page-head h1{color:#f1d7a4!important}
html[data-yp-theme="dark"] .form-card p,html[data-yp-theme="dark"] .info-panel p,html[data-yp-theme="dark"] .doc-card p,html[data-yp-theme="dark"] .contact-card p,html[data-yp-theme="dark"] .event-card p,html[data-yp-theme="dark"] .news-card p,html[data-yp-theme="dark"] .page-head p{color:#c0ccda!important}
html[data-yp-theme="dark"] .form-card label,html[data-yp-theme="dark"] .info-panel label{color:#e2c58e!important}
html[data-yp-theme="dark"] .form-card input,html[data-yp-theme="dark"] .form-card textarea,html[data-yp-theme="dark"] .form-card select,html[data-yp-theme="dark"] .yp-assistant-compose input{background:#081a30!important;color:#f3f5f8!important;border:1px solid rgba(200,166,107,.55)!important}
html[data-yp-theme="dark"] .calendar-grid>button,html[data-yp-theme="dark"] .calendar-empty{background:#0b2038!important;color:#e9edf4!important;border-color:rgba(200,166,107,.25)!important}
html[data-yp-theme="dark"] .calendar-grid>button.selected{background:#c8a66b!important;color:#10243c!important}
html[data-yp-theme="dark"] .calendar-event-list article,html[data-yp-theme="dark"] .home-upcoming-grid article{background:#0a1d33!important;border-color:rgba(200,166,107,.28)!important;color:#edf1f6!important}
html[data-yp-theme="dark"] .calendar-event-list article b,html[data-yp-theme="dark"] .home-upcoming-grid h3{color:#f1d7a4!important}
html[data-yp-theme="dark"] .calendar-event-list p,html[data-yp-theme="dark"] .home-upcoming-grid p{color:#c0ccda!important}
html[data-yp-theme="dark"] .footer{background:#050f1d!important;border-color:rgba(200,166,107,.3)!important}
html[data-yp-theme="dark"] .yp-assistant-panel{background:#0b2038!important;border-color:rgba(200,166,107,.5)!important}
html[data-yp-theme="dark"] .yp-assistant-messages{background:linear-gradient(180deg,#0b2038,#081a30)!important}
html[data-yp-theme="dark"] .yp-assistant-bubble{background:#142e49!important;color:#eaf0f6!important;border-color:rgba(200,166,107,.22)!important}
html[data-yp-theme="dark"] .yp-assistant-bubble.user{background:#c8a66b!important;color:#10243c!important}
html[data-yp-theme="dark"] .yp-assistant-quick,html[data-yp-theme="dark"] .yp-assistant-compose,html[data-yp-theme="dark"] .yp-assistant-privacy{background:#0a1b30!important;border-color:rgba(200,166,107,.22)!important;color:#b8c5d3!important}
html[data-yp-theme="dark"] .yp-assistant-quick button{background:#142e49!important;color:#f0d8a9!important;border-color:rgba(200,166,107,.35)!important}
html[data-yp-theme="dark"] .site-search-results{background:#102944!important;border-color:rgba(200,166,107,.3)!important}
html[data-yp-theme="dark"] .site-search-results button{background:#102944!important;color:#edf1f6!important}
html[data-yp-theme="dark"] .site-search-results button:hover{background:#193955!important}

html[data-yp-theme="dark"] .about-modern h1,
html[data-yp-theme="dark"] .about-modern h2,
html[data-yp-theme="dark"] .about-modern h3{color:#f2d7a2!important}
html[data-yp-theme="dark"] .about-modern p,
html[data-yp-theme="dark"] .about-modern span,
html[data-yp-theme="dark"] .about-modern small{color:#d0dae6}
html[data-yp-theme="dark"] .about-hero h1,
html[data-yp-theme="dark"] .about-hero p,
html[data-yp-theme="dark"] .about-hero .about-tag{color:inherit}
html[data-yp-theme="dark"] .page-head p{color:#d0dae6!important}
html[data-yp-theme="dark"] .form-card label{color:#e4c98f!important}

@media(max-width:900px){.yp-theme-toggle{order:5;margin:6px 0}}
@media(max-width:600px){.yp-theme-toggle{font-size:10px!important;padding:8px 10px!important}.form-card,.info-panel,.doc-card,.contact-card,.news-card,.event-card,.membership-box{border-radius:17px!important}}
.yp-assistant-launch{position:fixed;right:25px;bottom:24px;z-index:11000;display:flex;align-items:center;gap:11px;padding:7px 18px 7px 7px;min-height:76px;border:1px solid rgba(218,187,130,.72);border-radius:999px;background:linear-gradient(135deg,#102844,#07182d);color:#fff;box-shadow:0 16px 40px rgba(7,24,45,.34);font-weight:800;cursor:pointer;overflow:visible;transition:transform .25s ease,box-shadow .25s ease}
.yp-assistant-launch:hover{transform:translateY(-3px);box-shadow:0 20px 48px rgba(7,24,45,.42)}
.yp-assistant-launch-icon{display:grid;place-items:center;width:62px;height:62px;flex:none;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 35% 25%,#284968,#07182d 72%);border:1px solid rgba(224,190,128,.55);box-shadow:0 0 0 3px rgba(200,166,107,.12);animation:ypRobotBob 3.2s ease-in-out infinite}
.yp-assistant-launch-icon img{width:100%;height:100%;object-fit:cover;display:block}
.yp-assistant-launch-label{display:inline-block;white-space:nowrap;animation:ypLabelPulse 4.8s ease-in-out infinite;transform-origin:left center}
@keyframes ypRobotBob{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-4px) rotate(-2deg)}}
@keyframes ypLabelPulse{0%,12%,100%{opacity:1;transform:translateX(0)}5%{opacity:.45;transform:translateX(5px)}8%{opacity:1;transform:translateX(0)}}
@media(prefers-reduced-motion:reduce){.yp-assistant-launch,.yp-assistant-launch-icon,.yp-assistant-launch-label{animation:none!important;transition:none!important}}
.yp-assistant-panel{position:fixed;right:24px;bottom:88px;z-index:11001;width:min(390px,calc(100vw - 28px));height:min(570px,calc(100vh - 125px));display:flex;flex-direction:column;overflow:hidden;border:1px solid rgba(205,174,119,.45);border-radius:22px;background:#f8fafc;box-shadow:0 24px 70px rgba(5,20,38,.28)}
.yp-assistant-head{display:flex;align-items:center;gap:11px;padding:16px;background:linear-gradient(130deg,#07182d,#173956);color:white}
.yp-assistant-avatar{display:grid;place-items:center;width:40px;height:40px;border:1px solid rgba(230,209,166,.55);border-radius:14px;color:#f0d39d}
.yp-assistant-head strong{display:block;font-size:14px}.yp-assistant-head small{display:block;margin-top:3px;color:#c7d2df;font-size:11px}
.yp-assistant-close{margin-left:auto;width:34px;height:34px;border:1px solid rgba(255,255,255,.18);border-radius:50%;background:rgba(255,255,255,.08);color:white;font-size:22px;cursor:pointer}
.yp-assistant-messages{flex:1;overflow:auto;display:flex;flex-direction:column;gap:11px;padding:16px;background:linear-gradient(180deg,#f6f2e9,#e9edf2)}
.yp-assistant-bubble{max-width:88%;padding:11px 13px;border:1px solid #e0e6ed;border-radius:15px 15px 15px 4px;background:white;color:#23354c;font-size:13px;line-height:1.55;white-space:pre-wrap;overflow-wrap:anywhere}
.yp-assistant-bubble.user{align-self:flex-end;border-color:#183653;border-radius:15px 15px 4px 15px;background:#183653;color:white}
.yp-assistant-quick{display:flex;gap:7px;flex-wrap:wrap;padding:0 13px 10px;background:#f8f5ed}
.yp-assistant-quick button{border:1px solid #d9e1ea;border-radius:999px;background:white;color:#314761;padding:7px 10px;font-size:11px;cursor:pointer}
.yp-assistant-compose{display:flex;gap:8px;padding:12px;border-top:1px solid #e0e6ed;background:#fff}
.yp-assistant-compose input{flex:1;min-width:0;border:1px solid #d8e0e9!important;border-radius:12px!important;background:#f8fafc!important;color:#172b45!important;padding:11px 12px!important;font-size:13px}
.yp-assistant-compose button{width:42px;flex:none;border:0;border-radius:12px;background:#c9a86e;color:#13263c;font-weight:900;cursor:pointer}
.yp-assistant-privacy{padding:0 13px 11px;background:#fff;color:#8290a1;font-size:10px;line-height:1.4}
@media(max-width:600px){.yp-assistant-launch{right:14px;bottom:14px;padding:6px 13px 6px 6px;min-height:66px}.yp-assistant-launch-icon{width:54px;height:54px}.yp-assistant-panel{right:10px;bottom:72px;width:calc(100vw - 20px);height:min(600px,calc(100vh - 92px))}.form-card,.info-panel,.doc-card,.contact-card,.news-card,.event-card,.membership-box{border-radius:17px!important}}
\n`}

</style>
{typeof document !== 'undefined' && createPortal(
  <AnimatePresence>
    {toast && (
      <motion.div
        key={toast.id}
        className={`global-toast ${toast.type}`}
        role="status"
        aria-live="polite"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
      >
        <span className="toast-icon">{toast.type === 'success' ? '✓' : '!'}</span>
        <span className="toast-message">{toast.message}</span>
        <button className="toast-close" onClick={() => setToast(null)} aria-label="Yopish">×</button>
        <motion.span
          className="toast-progress"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: 5, ease: 'linear' }}
        />
      </motion.div>
    )}
  </AnimatePresence>,
  document.body
)}
{documentViewer && (
  <div className="document-backdrop" onClick={() => setDocumentViewer(null)}>
    <motion.section className="document-sheet" role="dialog" aria-modal="true" aria-label={documentViewer.title}
      onClick={e => e.stopPropagation()}
      initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 260 }}>
      <div className="document-sheet-handle"/>
      <header><strong>{documentViewer.title}</strong><button type="button" onClick={() => setDocumentViewer(null)} aria-label="Yopish">×</button></header>
      <div className="document-paper-view"><iframe title={documentViewer.title} src={`${documentViewer.src}#toolbar=0&navpanes=0&view=FitH`} /></div>
    </motion.section>
  </div>
)}
{applicationSuccess && (
  <div className="success-overlay">
    <div className="success-modal">
      <div className="success-check">
        <svg viewBox="0 0 52 52">
          <path d="M14 27 L22 35 L39 17" />
        </svg>
      </div>

      <h2>Arizangiz muvaffaqiyatli yuborildi!</h2>
      <p>Arizangiz tizimga qabul qilindi.</p>

      <div className="application-number">
        Ariza raqamingiz:
        <strong>{applicationSuccess}</strong>
      </div>

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
<div className="site-global-search">
  <input value={publicSearch} onChange={event=>setPublicSearch(event.target.value)} placeholder="Saytdan qidirish..." aria-label="Sayt bo‘ylab qidirish" />
  {publicSearch && <button type="button" onClick={()=>setPublicSearch('')} aria-label="Qidiruvni tozalash">×</button>}
  {normalizedPublicSearch && <div className="site-search-results">
    {publicSearchResults.length ? publicSearchResults.map(result=><button type="button" key={result.key} onClick={()=>{go(result.page);setPublicSearch('')}}><small>{result.type}</small><strong>{result.title}</strong></button>) : <p>Hech qanday natija topilmadi.</p>}
  </div>}
</div>

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
    ['membership', 'A’zolik'],
    ['member', 'Shaxsiy kabinet']
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
  <button type="button" className="yp-theme-toggle" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Yorug‘ rejimga o‘tish' : 'Qorong‘i rejimga o‘tish'} title={theme === 'dark' ? 'Yorug‘ rejim' : 'Qorong‘i rejim'}>
    {theme === 'dark' ? '☀ Yorug‘' : '☾ Qorong‘i'}
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
{session?.user?.email?.toLowerCase() === 'obidofich@gmail.com' && (
<button
className={page === 'admin' ? 'active' : ''}
onClick={() => go('admin')}
>
<ShieldCheck size={18} />
Admin panel
</button>
)}
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
{session?.user?.email?.toLowerCase() === 'obidofich@gmail.com' && (
<button
className={`nav-item ${page === 'admin' ? 'active' : ''}`}
onClick={() => go('admin')}
>
<ShieldCheck size={18} />
<span>Admin panel</span>
</button>
)}

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

<section className="home-live-section">
  <div className="home-live-heading">
    <span className="eyebrow">KLUB FAOLIYATI RAQAMLARDA</span>
    <h2>Birgalikda amalga oshirilayotgan ishlar.</h2>
  </div>
  <div className="home-live-stats">
    <article><strong>12</strong><span>Jamoa a’zosi</span><small>Klub tarkibi</small></article>
    <article><strong>{events.length}</strong><span>Tadbir</span><small>Platformaga joylangan</small></article>
    <article><strong>{news.length}</strong><span>Yangilik</span><small>Klub xabarlari</small></article>
    <article><strong>{gallery.length}</strong><span>Foto lavha</span><small>Faoliyat galereyasi</small></article>
  </div>
</section>

<section className="home-upcoming-section">
  <div className="home-upcoming-heading">
    <div><span className="eyebrow">KALENDAR</span><h2>Yaqinlashayotgan tadbirlar</h2></div>
    <button className="ghost-btn" type="button" onClick={() => go('events')}>Barcha tadbirlar <ArrowRight size={16}/></button>
  </div>
  {upcomingEvents.length ? <div className="home-upcoming-grid">
    {upcomingEvents.map(event => <article key={event.id}>
      <small>{event.event_date ? new Date(`${String(event.event_date).slice(0,10)}T00:00:00`).toLocaleDateString('uz-UZ',{day:'numeric',month:'long',year:'numeric'}) : 'Sana belgilanmagan'}</small>
      <h3>{event.title}</h3><p>{event.description || 'Klub tadbiri haqida batafsil ma’lumot.'}</p>
    </article>)}
  </div> : <div className="home-upcoming-empty">Hozircha yaqinlashayotgan tadbirlar e’lon qilinmagan. Yangiliklarni kuzatib boring.</div>}
</section>
</>
)}


{page === 'about' && (
<>
<style>{`
.about-modern{color:#17263a}.about-hero{position:relative;overflow:hidden;border-radius:28px;padding:clamp(28px,5vw,58px);background:radial-gradient(circle at 85% 15%,rgba(211,174,105,.28),transparent 30%),linear-gradient(120deg,#0c1d32,#183653 68%,#254664);color:#fff;display:grid;grid-template-columns:1.2fr .8fr;gap:28px;align-items:center;min-height:330px;margin:18px 0 30px}.about-hero h1{font-size:clamp(34px,5vw,58px);line-height:1.05;letter-spacing:-.04em;margin:12px 0 16px}.about-hero p{max-width:620px;color:#d5dfeb;line-height:1.8}.about-tag{font-size:11px;letter-spacing:.2em;font-weight:800;color:#d8b574}.about-hero-mark{width:min(260px,100%);aspect-ratio:1;border:1px solid rgba(224,189,123,.45);border-radius:50%;display:grid;place-items:center;margin:auto;position:relative}.about-hero-mark:before,.about-hero-mark:after{content:'';position:absolute;inset:18px;border:1px solid rgba(224,189,123,.25);border-radius:50%}.about-hero-mark:after{inset:38px}.about-hero-mark svg{width:76px;height:76px;color:#e0bd7b;z-index:1}.about-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:0 0 38px}.about-metric{padding:20px;border:1px solid #e8eaf0;border-radius:18px;background:#fff;box-shadow:0 8px 26px rgba(16,34,56,.045)}.about-metric strong{display:block;font-size:30px;color:#b58b49}.about-metric span{font-size:12px;color:#667085}.about-section{display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:center;margin:36px 0}.about-section.reverse .about-section-art{order:2}.about-section-art{min-height:280px;border-radius:24px;overflow:hidden;position:relative;background:#e9edf2}.about-section-art img{width:100%;height:100%;min-height:280px;object-fit:cover;display:block}.about-section-copy{padding:14px 4px}.about-section-copy h2{font-size:clamp(26px,3vw,38px);line-height:1.13;letter-spacing:-.03em;margin:10px 0 14px}.about-section-copy p{line-height:1.85;color:#667085}.about-pill{display:inline-flex;padding:7px 11px;border-radius:99px;background:#f5eddf;color:#9b7438;font-size:10px;font-weight:800;letter-spacing:.15em}.about-team{background:#f5f7fa;border-radius:26px;padding:clamp(22px,4vw,38px);margin:40px 0}.about-team h2,.about-future h2{font-size:clamp(26px,3vw,38px);margin:8px 0 12px}.about-team-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:22px}.about-role{background:#fff;border:1px solid #e7eaf0;border-radius:16px;padding:18px}.about-role b{display:block;font-size:25px;color:#b58b49}.about-role span{font-weight:700}.about-role small{display:block;color:#7b8492;margin-top:5px}.about-future{padding:34px;border-radius:26px;background:linear-gradient(120deg,#f7f2e9,#fff);margin:38px 0}.about-future-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:22px}.about-future-card{padding:20px;background:#fff;border:1px solid #eee6d8;border-radius:18px}.about-future-card svg{color:#b58b49}.about-future-card h3{margin:12px 0 7px}.about-future-card p{font-size:13px;line-height:1.7;color:#667085;margin:0}.about-editor{margin-top:30px}@media(max-width:760px){.about-hero,.about-section{grid-template-columns:1fr}.about-hero-mark{width:150px}.about-metrics{grid-template-columns:1fr}.about-team-grid{grid-template-columns:repeat(2,1fr)}.about-future-grid{grid-template-columns:1fr}.about-section.reverse .about-section-art{order:0}}

html[data-yp-theme="dark"] .about-section-copy h2,
html[data-yp-theme="dark"] .about-team h2,
html[data-yp-theme="dark"] .about-future h2{color:#f3d69d!important}
html[data-yp-theme="dark"] .about-section-copy p,
html[data-yp-theme="dark"] .about-team p,
html[data-yp-theme="dark"] .about-future p{color:#d2dce8!important}
html[data-yp-theme="dark"] .about-metric{background:linear-gradient(145deg,#132f4c,#0d233b)!important;border-color:rgba(200,166,107,.4)!important}
html[data-yp-theme="dark"] .about-metric strong{color:#f0cc86!important}
html[data-yp-theme="dark"] .about-metric span{color:#d2dce8!important}
html[data-yp-theme="dark"] .about-role{background:#102944!important;color:#f0f3f7!important;border-color:rgba(200,166,107,.4)!important}
html[data-yp-theme="dark"] .about-role b{color:#e8c987!important}
html[data-yp-theme="dark"] .about-role span{color:#f0f3f7!important}
html[data-yp-theme="dark"] .about-role small{color:#c4d0de!important}
html[data-yp-theme="dark"] .about-pill{color:#f0d39d!important;background:rgba(200,166,107,.16)!important;border:1px solid rgba(200,166,107,.32)!important}


/* V9.2 — coordinated About page palettes */
.about-modern{color:#152b43!important}
.about-team{
  background:linear-gradient(135deg,#dce6f0 0%,#e8eef4 52%,#d5e0eb 100%)!important;
  border:1px solid #c3d1df!important;
  box-shadow:0 18px 42px rgba(18,43,68,.09)!important;
}
.about-team h2,.about-future h2{color:#102944!important}
.about-team p,.about-future p{color:#465d75!important}
.about-role{
  background:linear-gradient(150deg,#fbfcfe,#eef3f8)!important;
  border:1px solid #c5d2df!important;
  box-shadow:0 8px 22px rgba(16,41,68,.07)!important;
}
.about-role b{color:#a77d3d!important}
.about-role span{color:#152b43!important}
.about-role small{color:#53677d!important}
.about-metric{
  background:linear-gradient(145deg,#e4ebf3,#d7e1ec)!important;
  border-color:#c4d1df!important;
}
.about-metric strong{color:#a77d3d!important}
.about-metric span{color:#40566e!important}
.about-future{
  background:linear-gradient(135deg,#dce6f0,#e9eff5)!important;
  border:1px solid #c4d1df!important;
  box-shadow:0 18px 42px rgba(18,43,68,.08)!important;
}
.about-future-card{
  background:linear-gradient(145deg,#fbfcfe,#edf2f7)!important;
  border:1px solid #c8d4e0!important;
}
.about-future-card h3{color:#142b44!important}
.about-future-card p{color:#50657c!important}
.about-section-copy h2{color:#142b44!important}
.about-section-copy p{color:#465d75!important}
.about-pill{background:#e9dfca!important;color:#8c672f!important;border:1px solid #d7c39b!important}

/* Dark mode: all About page sections merge into the same navy environment */
html[data-yp-theme="dark"] .about-team{
  background:linear-gradient(135deg,#0b1d32 0%,#102944 55%,#0b2037 100%)!important;
  border:1px solid rgba(200,166,107,.3)!important;
  box-shadow:0 18px 42px rgba(0,0,0,.2)!important;
}
html[data-yp-theme="dark"] .about-team h2,
html[data-yp-theme="dark"] .about-future h2,
html[data-yp-theme="dark"] .about-section-copy h2{color:#f0d39b!important}
html[data-yp-theme="dark"] .about-team p,
html[data-yp-theme="dark"] .about-future p,
html[data-yp-theme="dark"] .about-section-copy p{color:#d0dbe7!important}
html[data-yp-theme="dark"] .about-role{
  background:linear-gradient(145deg,#142f4b,#0d2239)!important;
  border:1px solid rgba(200,166,107,.3)!important;
  box-shadow:0 8px 22px rgba(0,0,0,.16)!important;
}
html[data-yp-theme="dark"] .about-role b{color:#e4c17f!important}
html[data-yp-theme="dark"] .about-role span{color:#f0f4f8!important}
html[data-yp-theme="dark"] .about-role small{color:#bdcad8!important}
html[data-yp-theme="dark"] .about-metric{
  background:linear-gradient(145deg,#132f4c,#0d233b)!important;
  border-color:rgba(200,166,107,.3)!important;
}
html[data-yp-theme="dark"] .about-metric strong{color:#e7c783!important}
html[data-yp-theme="dark"] .about-metric span{color:#cbd6e2!important}
html[data-yp-theme="dark"] .about-future{
  background:linear-gradient(135deg,#0b1d32,#102944 60%,#0b2037)!important;
  border:1px solid rgba(200,166,107,.3)!important;
  box-shadow:0 18px 42px rgba(0,0,0,.2)!important;
}
html[data-yp-theme="dark"] .about-future-card{
  background:linear-gradient(145deg,#142f4b,#0d2239)!important;
  border-color:rgba(200,166,107,.28)!important;
}
html[data-yp-theme="dark"] .about-future-card h3{color:#f0d39b!important}
html[data-yp-theme="dark"] .about-future-card p{color:#cbd6e2!important}
html[data-yp-theme="dark"] .about-pill{
  background:rgba(200,166,107,.14)!important;
  color:#efd39e!important;
  border:1px solid rgba(200,166,107,.35)!important;
}
html[data-yp-theme="dark"] .about-section-art{background:#0b1d32!important}

`}</style>
<div className="about-modern">
  <section className="about-hero">
    <div>
      <span className="about-tag">YOUTH PARLIAMENT CLUB · 2026</span>
      <h1>Yoshlar ovozi.<br/><span style={{color:'#e0bd7b'}}>Yangi imkoniyatlar.</span></h1>
      <p>{settings.about_intro || 'Yoshlarning huquqiy bilimini, yetakchilik salohiyatini va ijtimoiy tashabbuslarini rivojlantiruvchi ochiq klub platformasi.'}</p>
      <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:22}}>
        <button className="gold-btn" onClick={()=>go('membership')}>Klubga qo‘shilish <ArrowRight size={16}/></button>
        <button className="ghost-btn" style={{color:'#fff',borderColor:'rgba(255,255,255,.35)'}} onClick={()=>go('events')}>Tadbirlarni ko‘rish</button>
      </div>
    </div>
    <div className="about-hero-mark"><Landmark/></div>
  </section>

  <div className="about-metrics">
    <div className="about-metric"><strong>12</strong><span>Jamoa a’zosi</span></div>
    <div className="about-metric"><strong>2026</strong><span>Tashkil topgan yil</span></div>
    <div className="about-metric"><strong>3</strong><span>Asosiy yo‘nalish: o‘tmish · bugun · kelajak</span></div>
  </div>

  <section className="about-section">
    <div className="about-section-art"><img src={settings.about_image || 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=85'} alt="Universitet binosi"/></div>
    <div className="about-section-copy"><span className="about-pill">KLUB HAQIDA</span><h2>Bir g‘oya atrofida birlashgan yoshlar.</h2><p>{settings.about_history || 'Yoshlar parlamenti klubi 2026-yil noyabr oyida Xalqaro ijtimoiy innovatsiyalar universiteti hududida tashkil etilgan. Klub yoshlarning fikr va takliflarini ilgari surish hamda ularning ijtimoiy hayotdagi ishtirokini kuchaytirish uchun maydon yaratadi.'}</p><p><b style={{color:'#b58b49'}}>Tashkil topgan sana:</b> 2026-yil, noyabr</p></div>
  </section>

  <section className="about-team">
    <span className="about-pill">BUGUNGI JAMOA</span><h2>12 a’zo — yagona maqsad.</h2><p style={{color:'#667085',lineHeight:1.7}}>{settings.about_today || 'Klub faoliyati vazifalar taqsimoti, hamkorlik va mas’uliyat tamoyillariga asoslanadi.'}</p>
    <div className="about-team-grid">
      <div className="about-role"><b>01</b><span>Spiker</span><small>1 nafar</small></div>
      <div className="about-role"><b>02</b><span>Koordinatorlar</span><small>2 nafar</small></div>
      <div className="about-role"><b>03</b><span>Media jamoasi</span><small>2 nafar</small></div>
      <div className="about-role"><b>04</b><span>Klub a’zolari</span><small>7 nafar</small></div>
    </div>
  </section>

  <section className="about-section reverse">
    <div className="about-section-art"><img src={settings.about_history_image || 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=85'} alt="Majlislar zali"/></div>
    <div className="about-section-copy"><span className="about-pill">BIZNING YONDASHUV</span><h2>Fikr bildirishdan — amaliy yechimgacha.</h2><p>Klub a’zolari dolzarb masalalarni muhokama qiladi, takliflar ishlab chiqadi va jamoaviy loyihalarni amalga oshiradi. Har bir tashabbus hamkorlik va mas’uliyat bilan rivojlantiriladi.</p></div>
  </section>

  <section className="about-future"><span className="about-pill">KELAJAK REJALARI</span><h2>G‘oyalarni natijaga aylantiramiz.</h2><p style={{color:'#667085',lineHeight:1.8,maxWidth:850}}>{settings.about_future || 'Klubning istiqboldagi maqsadi — universitet miqyosida yoshlar tashabbuslarini kengaytirish, huquqiy va intellektual loyihalarni amalga oshirish hamda faol yoshlar hamkorligini rivojlantirish.'}</p><div className="about-future-grid"><article className="about-future-card"><Landmark/><h3>Huquqiy bilim</h3><p>Huquqiy savodxonlik va fuqarolik faolligini oshirish.</p></article><article className="about-future-card"><Users/><h3>Hamkorlik</h3><p>Tashabbuskor yoshlarni yagona maqsad atrofida birlashtirish.</p></article><article className="about-future-card"><ArrowUpRight/><h3>Yangi loyihalar</h3><p>Ijtimoiy ahamiyatga ega g‘oyalarni ro‘yobga chiqarish.</p></article></div></section>
  <div style={{textAlign:'center',padding:'18px 8px 30px',color:'#a47b35',fontSize:11,fontWeight:800,letterSpacing:'.18em'}}>YOSHLAR OVOZI · YANGI G‘OYALAR · YANGI KELAJAK</div>
  {session?.user?.email?.toLowerCase() === 'obidofich@gmail.com' && (
    <section className="form-card about-editor"><h2>“Klub haqida” bo‘limini tahrirlash</h2><p>Matnlarni o‘zgartiring, rasmlarni yuklang va saqlang.</p>
      <label>Kirish matni<textarea rows="3" value={draft.about_intro || ''} onChange={e=>setDraft({...draft,about_intro:e.target.value})}/></label>
      <label>Tarix matni<textarea rows="4" value={draft.about_history || ''} onChange={e=>setDraft({...draft,about_history:e.target.value})}/></label>
      <label>Bugungi faoliyat matni<textarea rows="3" value={draft.about_today || ''} onChange={e=>setDraft({...draft,about_today:e.target.value})}/></label>
      <label>Kelajak matni<textarea rows="3" value={draft.about_future || ''} onChange={e=>setDraft({...draft,about_future:e.target.value})}/></label>
      <label>Universitet rasmi<input type="file" accept="image/*" onChange={e=>uploadSettingImage('about_image',e.target.files?.[0])}/></label>
      <label>Tarix rasmi<input type="file" accept="image/*" onChange={e=>uploadSettingImage('about_history_image',e.target.files?.[0])}/></label>
      <button className="gold-btn" type="button" onClick={saveSettings} disabled={busy}>O‘zgarishlarni saqlash <Save size={16}/></button>
    </section>
  )}
</div>
</>
)}

{page === 'membership' && (
<>
<PageHead
kicker="JAMOAMIZGA QO‘SHILING"
title="O‘zgarishlar sizdan boshlanadi."
desc="Klub a’zoligiga ariza topshiring."
/>

<section className="application-status-check">
  <div>
    <span className="status-check-kicker">ARIZA HOLATI</span>
    <h2>Arizangizni kuzatib boring</h2>
    <p>Ariza yuborilganda berilgan raqamni kiriting. Faqat ariza holati ko‘rsatiladi.</p>
  </div>
  <form onSubmit={checkApplicationStatus}>
    <input
      value={applicationLookupCode}
      onChange={event => setApplicationLookupCode(event.target.value.toUpperCase())}
      placeholder="YPC-XXXXXXXX"
      aria-label="Ariza raqami"
      maxLength={12}
      required
    />
    <button type="submit" disabled={applicationLookupBusy}>
      {applicationLookupBusy ? 'Tekshirilmoqda...' : 'Holatni tekshirish'}
    </button>
  </form>
  {applicationLookupResult && (
    <div className="status-check-result" role="status">
      <strong>{applicationLookupResult.status}</strong>
      <span>Ariza raqami: {applicationLookupResult.applicationCode}</span>
    </div>
  )}
</section>

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
<PageHead kicker="RASMIY HUJJATLAR" title="Faoliyatimizning huquqiy asoslari." desc="Klub nizomi va konsepsiyasi bilan tanishing." />
<div className="doc-grid">
  <article className="doc-card">
    <div className="doc-top"><span>ASOSIY HUJJAT</span><FileText size={18}/></div>
    <div className="paper"><div className="paper-seal"><Landmark size={22}/></div><div className="paper-title">NIZOM</div><div className="paper-lines"/><div className="paper-lines short"/></div>
    <div className="doc-info"><div><h3>Klub Nizomi</h3><p>Klubning maqomi, maqsadlari, a’zolik va boshqaruv tartibi.</p></div></div>
    <button className="gold-btn" type="button" onClick={() => setDocumentViewer({title:'Yoshlar parlamenti klubi — Nizom',src:'/Nizom.pdf'})}>Hujjatni ochish <ArrowUpRight size={16}/></button>
  </article>
  <article className="doc-card">
    <div className="doc-top"><span>STRATEGIK HUJJAT</span><FileText size={18}/></div>
    <div className="paper"><div className="paper-seal"><Landmark size={22}/></div><div className="paper-title">KONSEPSIYA</div><div className="paper-lines"/><div className="paper-lines short"/></div>
    <div className="doc-info"><div><h3>Klub Konsepsiyasi</h3><p>Klubning missiyasi, ustuvor yo‘nalishlari va rivojlanish rejasi.</p></div></div>
    <button className="gold-btn" type="button" onClick={() => setDocumentViewer({title:'Yoshlar parlamenti klubi — Konsepsiya',src:'/Konsepsiya.pdf'})}>Hujjatni ochish <ArrowUpRight size={16}/></button>
  </article>
</div>
</>
)}
{page === 'feedback' && (
<>
<PageHead kicker="OCHIQ MULOQOT" title="Sizning fikringiz biz uchun muhim." desc="Taklif, savol yoki murojaatingizni yuboring. Ismingizni ko‘rsatmasdan ham murojaat qilishingiz mumkin." />
<div className="feedback-layout">
  <div className="feedback-note"><MessageCircle size={28}/><h2>Talaba ovozi — muhim.</h2><p>Har bir taklif va murojaat klub faoliyatini yaxshilashga xizmat qiladi.</p><div className="note-line"/><span>FIKR · MULOQOT · TASHABBUS · YECHIM</span></div>
  <form className="form-card" onSubmit={submitFeedback}>
    <div className="feedback-warning"><strong>Eslatma:</strong> Anonim yuborilgan murojaatlar o‘rganib chiqiladi, ammo ularga javob xati yuborilmaydi. Javob olishni istasangiz, anonim rejimni tanlamang, ism-familiyangiz va telefon raqamingiz yoki emailingizni kiriting. Javob siz ko‘rsatgan aloqa manziliga yuborish uchun tayyorlanadi.</div>
    <label className="feedback-anon"><input type="checkbox" checked={feedbackAnonymous} onChange={e=>setFeedbackAnonymous(e.target.checked)}/> Anonim murojaat qilish</label>
    {!feedbackAnonymous && <>
      <label>Ism va familiya<input value={feedbackName} onChange={e=>setFeedbackName(e.target.value)} placeholder="Ism-familiyangiz"/></label>
      <label>Telefon raqami yoki email<input value={feedbackContact} onChange={e=>setFeedbackContact(e.target.value)} placeholder="+998 90 123 45 67 yoki email@example.com"/></label>
    </>}
    <label>Murojaat matni<textarea rows="6" value={feedbackMessage} onChange={e=>setFeedbackMessage(e.target.value)} placeholder="Taklif yoki murojaatingizni yozing..." required/></label>
    <button className="gold-btn" type="submit" disabled={feedbackBusy}>{feedbackBusy?'Yuborilmoqda...':'Murojaatni yuborish'} <Send size={16}/></button>
  </form>
</div>
</>
)}

{page === 'events' && (
<>
<PageHead
kicker="KLUB HAYOTI · TADBIRLAR"
title="Uchrashuvlar, tashabbuslar va yangi imkoniyatlar."
desc="Klubimizda bo‘lib o‘tadigan uchrashuvlar, muhokamalar va loyihalarni kuzating. O‘zingizga qiziq tadbirni tanlang."
/>
<section style={{margin:'8px 0 30px'}}>
  <div style={{display:'flex',justifyContent:'space-between',alignItems:'end',gap:12,flexWrap:'wrap',marginBottom:16}}>
    <div><div className="eyebrow">OLDINDA KUTILAYOTGANLAR</div><h2 style={{margin:'5px 0',fontSize:26}}>Yaqinlashayotgan tadbirlar</h2></div>
    <span style={{color:'#8a6a35',fontWeight:700,fontSize:13}}>{upcomingEvents.length} ta yaqin tadbir</span>
  </div>
  {upcomingEvents.length ? (
    <div className="two-col" style={{gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,300px),1fr))',gap:18}}>
      {upcomingEvents.map((row,index)=>{
        const eventDate = row.event_date ? new Date(row.event_date) : null;
        const dateLabel = eventDate && !Number.isNaN(eventDate.getTime()) ? eventDate.toLocaleDateString('uz-UZ',{day:'numeric',month:'long',year:'numeric'}) : 'Sana belgilanmagan';
        const timeLabel = eventDate && !Number.isNaN(eventDate.getTime()) ? eventDate.toLocaleTimeString('uz-UZ',{hour:'2-digit',minute:'2-digit'}) : '';
        return <motion.article key={row.id} className="info-panel" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:index*.07,duration:.35}} style={{padding:0,overflow:'hidden',borderRadius:20,border:'1px solid #e8eaf0',background:'#fff',boxShadow:'0 12px 30px rgba(16,36,61,.06)'}}>
          {row.image_url ? <img src={row.image_url} alt={row.title} style={{width:'100%',height:190,objectFit:'cover',display:'block'}}/> : <div style={{height:150,display:'grid',placeItems:'center',background:'linear-gradient(135deg,#10243d,#284b70)',color:'#e5c58b'}}><CalendarDays size={42}/></div>}
          <div style={{padding:20}}>
            <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap',color:'#9b7638',fontSize:12,fontWeight:800,marginBottom:10}}><CalendarDays size={15}/>{dateLabel}{timeLabel && <><span>·</span>{timeLabel}</>}</div>
            <h3 style={{fontSize:20,lineHeight:1.3,margin:'0 0 9px',color:'#17263a'}}>{row.title}</h3>
            <p style={{fontSize:14,lineHeight:1.7,color:'#667085',margin:'0 0 16px',whiteSpace:'pre-line'}}>{row.description || 'Tadbir tafsilotlari tez orada e’lon qilinadi.'}</p>
            <button type="button" className="gold-btn" onClick={()=>{setSelectedCalendarDate(String(row.event_date||'').slice(0,10));setCalendarMonth(new Date(eventDate && !Number.isNaN(eventDate.getTime()) ? eventDate.getFullYear() : new Date().getFullYear(),eventDate && !Number.isNaN(eventDate.getTime()) ? eventDate.getMonth() : new Date().getMonth(),1));document.getElementById('events-calendar')?.scrollIntoView({behavior:'smooth',block:'center'})}} style={{display:'inline-flex',alignItems:'center',gap:8}}>Kalendar orqali ko‘rish <ArrowRight size={16}/></button>
          </div>
        </motion.article>
      })}
    </div>
  ) : <div className="form-card" style={{textAlign:'center',padding:'30px 20px'}}><CalendarDays size={34} color="#a47b35"/><h3 style={{margin:'12px 0 6px'}}>Hozircha yaqin tadbirlar yo‘q</h3><p style={{color:'#667085',margin:0}}>Yangi tadbirlar e’lon qilinganda shu yerda paydo bo‘ladi.</p></div>}
</section>
<section style={{margin:'0 0 34px'}}>
  <div style={{marginBottom:15}}><div className="eyebrow">TADBIRLAR ARXIVI</div><h2 style={{margin:'5px 0',fontSize:25}}>Barcha tadbirlar</h2><p style={{margin:0,color:'#667085'}}>Klub faoliyatidagi uchrashuvlar va tadbirlar ro‘yxati.</p></div>
  {events.length ? <div className="two-col" style={{gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,280px),1fr))',gap:14}}>{[...events].sort((a,b)=>String(b.event_date||'').localeCompare(String(a.event_date||''))).map(row=>{
    const d=row.event_date?new Date(row.event_date):null;
    const valid=d&&!Number.isNaN(d.getTime());
    const isPast=valid&&d<new Date();
    return <article className="info-panel" key={row.id} style={{borderRadius:16}}>
      {row.image_url&&<img src={row.image_url} alt={row.title} style={{width:'100%',height:160,objectFit:'cover',borderRadius:12,marginBottom:12}}/>}
      <div style={{display:'flex',justifyContent:'space-between',gap:8,alignItems:'center',marginBottom:9}}><span style={{fontSize:12,fontWeight:800,color:'#9b7638'}}>{valid?d.toLocaleDateString('uz-UZ',{day:'numeric',month:'long',year:'numeric'}):'Sana belgilanmagan'}</span><span style={{fontSize:10,fontWeight:800,padding:'5px 8px',borderRadius:20,background:isPast?'#f1f2f4':'#edf7f1',color:isPast?'#667085':'#23734a'}}>{isPast?'YAKUNLANGAN':'REJADA'}</span></div>
      {editing?.id === row.id && editing?.type === 'events' ? (
        <div style={{display:'grid',gap:10,marginTop:12}}>
          <label style={{color:'#17263a'}}>Tadbir nomi<input value={editing.title} onChange={e=>setEditing({...editing,title:e.target.value})}/></label>
          <label style={{color:'#17263a'}}>Sana va vaqt<input type="datetime-local" value={editing.event_date} onChange={e=>setEditing({...editing,event_date:e.target.value})}/></label>
          <label style={{color:'#17263a'}}>Tavsif<textarea rows="3" value={editing.description} onChange={e=>setEditing({...editing,description:e.target.value})}/></label>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            <button type="button" className="gold-btn" disabled={busy} onClick={updateContent}><Save size={15}/> {busy?'Saqlanmoqda...':'Saqlash'}</button>
            <button type="button" className="ghost-btn" onClick={()=>setEditing(null)}>Bekor qilish</button>
          </div>
        </div>
      ) : (
        <>
          <h3 style={{margin:'0 0 8px',fontSize:18,color:'#17263a'}}>{row.title}</h3>
          <p style={{margin:0,color:'#667085',fontSize:13,lineHeight:1.65,whiteSpace:'pre-line'}}>{row.description||'Tadbir haqida qo‘shimcha ma’lumot mavjud emas.'}</p>
          {session?.user?.email?.toLowerCase() === 'obidofich@gmail.com' && (
            <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:14}}>
              <button type="button" className="gold-btn" onClick={()=>startEdit('events',row)}><FileText size={15}/> Tahrirlash</button>
              <button type="button" className="ghost-btn" onClick={()=>deleteContent('events',row.id)}><Trash2 size={15}/> O‘chirish</button>
            </div>
          )}
        </>
      )}
    </article>
  })}</div> : <p className="empty-state">Hozircha tadbirlar joylashtirilmagan.</p>}
</section>
<section id="events-calendar" className="events-calendar form-card" style={{scrollMarginTop:100}}>
  <div style={{marginBottom:15}}><div className="eyebrow">SANALAR BO‘YICHA</div><h2 style={{margin:'5px 0'}}>Tadbirlar kalendari</h2><p style={{margin:0,color:'#667085'}}>Nuqta bilan belgilangan sanalarda tadbir bor. Sanani tanlab, tafsilotlarini ko‘ring.</p></div>
  <div className="calendar-heading">
    <button type="button" className="ghost-btn" onClick={()=>setCalendarMonth(new Date(calendarYear,calendarMonthIndex-1,1))} aria-label="Oldingi oy">‹</button>
    <h2>{calendarMonth.toLocaleDateString('uz-UZ',{month:'long',year:'numeric'})}</h2>
    <button type="button" className="ghost-btn" onClick={()=>setCalendarMonth(new Date(calendarYear,calendarMonthIndex+1,1))} aria-label="Keyingi oy">›</button>
  </div>
  <div className="calendar-grid">
    {['Du','Se','Ch','Pa','Ju','Sh','Ya'].map(day=><b key={day}>{day}</b>)}
    {calendarCells.map((day,index)=>{
      if(!day) return <span className="calendar-empty" key={`empty-${index}`}/>;
      const dateKey=`${calendarYear}-${String(calendarMonthIndex+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      const hasEvent=calendarEventDates.has(dateKey);
      return <button type="button" key={dateKey} className={`${selectedCalendarDate===dateKey?'selected':''} ${hasEvent?'has-event':''}`} onClick={()=>setSelectedCalendarDate(dateKey)}>{day}{hasEvent&&<i/>}</button>
    })}
  </div>
  <div className="calendar-event-list">
    <h3>{selectedCalendarDate ? `Tadbirlar — ${new Date(`${selectedCalendarDate}T00:00:00`).toLocaleDateString('uz-UZ')}` : 'Tadbir sanasini tanlang'}</h3>
    {selectedCalendarDate ? (selectedDateEvents.length ? selectedDateEvents.map(row=><article key={row.id} style={{background:'#fff',color:'#17263a',border:'1px solid #e4e8ef'}}><b style={{display:'block',color:'#17263a'}}>{row.title}</b><p style={{color:'#536174'}}>{row.description || ''}</p></article>) : <p style={{color:'#dce5ef'}}>Bu sanada rejalashtirilgan tadbir yo‘q.</p>) : <p style={{color:'#dce5ef'}}>Nuqta bilan belgilangan kunlarda tadbir mavjud.</p>}
  </div>
</section>
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
kicker="🤝 BIZ BILAN BOG‘LANING"
title="Har bir fikr — yangi imkoniyat."
desc="Savol, taklif yoki hamkorlik bo‘yicha bizga yozing. Jamoamiz siz bilan muloqot qilishdan mamnun."
/>

<motion.div
  initial={{ opacity: 0, y: 18 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: .6 }}
  style={{
    margin: '8px 0 26px', padding: '22px 24px', borderRadius: 22,
    background: 'linear-gradient(120deg,#10243d,#1b3858 65%,#294767)',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: 18, overflow: 'hidden', position: 'relative'
  }}
>
  <div style={{ position: 'relative', zIndex: 1 }}>
    <div style={{ color: '#e0bd7b', fontSize: 11, fontWeight: 800, letterSpacing: 2, marginBottom: 7 }}>YOUTH PARLIAMENT CLUB</div>
    <div style={{ fontSize: 18, fontWeight: 750, lineHeight: 1.35 }}>Hamkorlikka va yangi tashabbuslarga ochiqmiz!</div>
    <div style={{ color: 'rgba(255,255,255,.75)', fontSize: 13, marginTop: 6 }}>Sizning murojaatingiz biz uchun muhim.</div>
  </div>
  <motion.div aria-hidden="true" animate={{ y: [0,-7,0], rotate: [0,5,0] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }} style={{ fontSize: 48, flex: '0 0 auto' }}>💬</motion.div>
</motion.div>

<div className="contact-grid" style={{ gap: 18 }}>
<Contact I={Phone} title="TELEFON" value={settings.phone} emoji="📞" delay={0} />
<Contact I={Send} title="TELEGRAM" value={settings.telegram} emoji="✈️" delay={.08} />
<Contact I={Mail} title="ELEKTRON POCHTA" value={settings.email} emoji="✉️" delay={.16} />
<Contact I={MapPin} title="MANZIL" value={settings.address} emoji="📍" delay={.24} />
</div>

{(settings.instagram || settings.youtube) && (
  <div style={{ marginTop: 28, padding: '20px 22px', borderRadius: 20, background: 'linear-gradient(135deg,#10243d,#1b3858)', border: '1px solid rgba(216,179,109,.35)' }}>
    <div style={{ color: '#e7bd70', fontSize: 11, fontWeight: 850, letterSpacing: 1.9, marginBottom: 13 }}>📲 IJTIMOIY TARMOQLAR</div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      {settings.instagram && <a href={settings.instagram.startsWith('http') ? settings.instagram : `https://instagram.com/${settings.instagram.replace('@','')}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '11px 16px', borderRadius: 13, background: 'rgba(255,255,255,.97)', color: '#14263e', fontWeight: 800, textDecoration: 'none', boxShadow: '0 7px 20px rgba(0,0,0,.16)' }}><Instagram size={18}/> Instagram ↗</a>}
      {settings.youtube && <a href={settings.youtube.startsWith('http') ? settings.youtube : `https://youtube.com/${settings.youtube}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '11px 16px', borderRadius: 13, background: 'rgba(255,255,255,.97)', color: '#14263e', fontWeight: 800, textDecoration: 'none', boxShadow: '0 7px 20px rgba(0,0,0,.16)' }}><Youtube size={18}/> YouTube ↗</a>}
    </div>
  </div>
)}
</>
)}
{page === 'reset-password' && (
  <>
    <PageHead
      kicker="AKKAUNT XAVFSIZLIGI"
      title="Yangi parol o‘rnatish"
      desc="Shaxsiy kabinetingiz uchun yangi parol yarating."
    />
    <form className="form-card" onSubmit={updatePassword}>
      <label htmlFor="new-member-password">Yangi parol</label>
      <input
        id="new-member-password"
        type="password"
        name="newPassword"
        minLength="8"
        autoComplete="new-password"
        placeholder="Kamida 8 ta belgi"
        required
      />

      <label htmlFor="confirm-member-password">Yangi parolni takrorlang</label>
      <input
        id="confirm-member-password"
        type="password"
        name="confirmPassword"
        minLength="8"
        autoComplete="new-password"
        placeholder="Parolni qayta kiriting"
        required
      />

      <button className="gold-btn" type="submit" disabled={resetBusy}>
        {resetBusy ? 'Saqlanmoqda...' : 'Parolni saqlash'}
      </button>
    </form>
  </>
)}
{page === 'member' && (
  <>
    <PageHead
      kicker="A’ZOLAR UCHUN"
      title="Shaxsiy kabinet"
      desc="Yoshlar parlamenti klubi a’zosi uchun shaxsiy ma’lumotlar va elektron guvohnoma."
    />

    {memberLoading ? (
      <div className="form-card">Ma’lumotlar yuklanmoqda...</div>
    ) : !session ? (
      <form className="form-card member-login-form" onSubmit={login}>
        <h2>A’zolar uchun yagona kirish</h2>
        <p>Qabul qilingan a’zolar ro‘yxatdan o‘tgan elektron pochta manzili va shaxsiy paroli orqali kiradi.</p>
        <label htmlFor="member-login-email">Elektron pochta</label>
        <input
          id="member-login-email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={event => setEmail(event.target.value)}
          placeholder="email@example.com"
          required
        />
        <label htmlFor="member-login-password">Parol</label>
        <input
          id="member-login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={event => setPassword(event.target.value)}
          placeholder="Shaxsiy parolingiz"
          required
        />
        <button className="gold-btn" type="submit" disabled={busy}>
          {busy ? 'Tekshirilmoqda...' : 'Shaxsiy kabinetga kirish'}
          <ArrowRight size={18} />
        </button>
      </form>
    ) : !memberApplication ? (
      <div className="form-card">
        Sizda tasdiqlangan a’zolik guvohnomasi mavjud emas.
      </div>
    ) : (
      <>
        <div className="form-card">
  <h3>Profil rasmini yangilash</h3>
  <p>Guvohnomada ko‘rinadigan rasmingizni yuklang.</p>

  {memberApplication.photo_url && (
    <img
      src={memberApplication.photo_url}
      alt="Profil rasmi"
      style={{
        width: '110px',
        height: '130px',
        objectFit: 'cover',
        borderRadius: '10px',
        marginBottom: '12px'
      }}
    />
  )}

  <input
    type="file"
    accept="image/*"
    disabled={uploading}
    onChange={e => {
      uploadMemberPhoto(e.target.files?.[0])
      e.target.value = ''
    }}
  />

  {uploading && <p>Rasm yuklanmoqda...</p>}
</div>
        <div className="form-card">
  <h3>Tadbirda davomatni tasdiqlash</h3>
  <p>Tadbir joyidagi QR-kodni kamerangiz orqali skanerlang.</p>

  {!scannerOpen && (
    <button
      className="primary-btn"
      type="button"
      onClick={() => setScannerOpen(true)}
    >
      QR-kodni skanerlash
    </button>
  )}

  {scannerOpen && (
    <>
      <div id="member-qr-reader" style={{ width: '100%' }} />

      <button
        className="ghost-btn"
        type="button"
        onClick={() => setScannerOpen(false)}
      >
        Kamerani yopish
      </button>
    </>
  )}
</div>
        {scannerBusy && (
  <p className="admin-notice">Davomat tasdiqlanmoqda...</p>
)}

{notice && (
  <p className="admin-notice" role="status">
    {notice}
  </p>
)}
        <MembershipCertificate
  member={memberApplication}
  settings={settings}
/>
        <button className="ghost-btn" type="button" onClick={logout}>
          <LogOut size={16} /> Kabinetdan chiqish
        </button>
      </>
    )}
  </>
)}
{page === 'admin' && (
<>
<PageHead
kicker="BOSHQARUV"
title="Admin panel"
desc="Sayt ma’lumotlari, yangiliklar, tadbirlar va galereyani boshqaring."
/>

{!session || session.user.email?.toLowerCase() !== 'obidofich@gmail.com' ? (
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
<section className="admin-dashboard">
  <div className="admin-dashboard-top">
    <div>
      <span className="admin-eyebrow">YOSHLAR PARLAMENTI · BOSHQARUV</span>
      <h2>Boshqaruv markazi</h2>
      <p>Kerakli bo‘limni tanlang va ishni bir joydan boshqaring.</p>
    </div>
    <button type="button" className="admin-refresh" onClick={() => {
      loadApplications()
      loadAttendanceEvents()
      loadFeedback()
      loadContent()
    }}><RefreshCw size={15}/> Ma’lumotlarni yangilash</button>
  </div>
  <div className="admin-stat-grid">
    <button type="button" onClick={() => setAdminTab('applications')}><span>Arizalar</span><strong>{applications.length}</strong><small>{pendingApplicationsCount} ta ko‘rib chiqilmoqda</small></button>
    <button type="button" onClick={() => setAdminTab('feedback')}><span>Murojaatlar</span><strong>{feedbackRows.length}</strong><small>{unreadFeedbackCount} ta yangi / o‘qilmagan</small></button>
    <button type="button" onClick={() => setAdminTab('attendance')}><span>Davomat</span><strong>{attendanceRecords.length}</strong><small>Tanlangan tadbir</small></button>
    <button type="button" onClick={() => setAdminTab('content')}><span>Kontent</span><strong>{events.length + news.length + gallery.length}</strong><small>Tadbir · yangilik · foto</small></button>
  </div>
  <nav className="admin-tabs" aria-label="Admin bo‘limlari">
    {[
      ['overview','Umumiy'],
      ['attendance','Davomat'],
      ['applications','Arizalar'],
      ['feedback','Murojaatlar'],
      ['content','Kontent'],
      ['settings','Sozlamalar']
    ].map(([key,label]) => (
      <button key={key} type="button" className={adminTab === key ? 'active' : ''} onClick={() => setAdminTab(key)}>
        {label}
        {key === 'applications' && pendingApplicationsCount > 0 && <span className="admin-tab-count">{pendingApplicationsCount}</span>}
        {key === 'feedback' && unreadFeedbackCount > 0 && <span className="admin-tab-count">{unreadFeedbackCount}</span>}
      </button>
    ))}
  </nav>
  <div className="admin-search-wrap">
    <span aria-hidden="true">⌕</span>
    <input
      value={adminSearch}
      onChange={event => setAdminSearch(event.target.value)}
      placeholder="Ariza yoki murojaatni ism, raqam, telefon orqali qidiring..."
      aria-label="Admin ma’lumotlarini qidirish"
    />
    {adminSearch && <button type="button" onClick={() => setAdminSearch('')}>Tozalash</button>}
  </div>
</section>
{adminTab === 'overview' && normalizedAdminSearch && (
  <section className="form-card admin-global-results">
    <h3>Qidiruv natijalari: “{adminSearch}”</h3>
    <div className="admin-result-shortcuts">
      <button type="button" onClick={()=>setAdminTab('applications')}>Arizalar <b>{filteredApplications.length}</b></button>
      <button type="button" onClick={()=>setAdminTab('feedback')}>Murojaatlar <b>{filteredFeedbackRows.length}</b></button>
      <button type="button" onClick={()=>setAdminTab('attendance')}>Davomat <b>{filteredAttendanceRecords.length}</b></button>
      <button type="button" onClick={()=>setAdminTab('content')}>Kontent <b>{filteredEvents.length + filteredNews.length + filteredGallery.length}</b></button>
    </div>
    {filteredApplications.length + filteredFeedbackRows.length + filteredAttendanceRecords.length + filteredEvents.length + filteredNews.length + filteredGallery.length === 0 && <p>Mos ma’lumot topilmadi. Boshqa kalit so‘z bilan urinib ko‘ring.</p>}
  </section>
)}
{adminTab === 'overview' && (
  <section className="admin-overview-grid">
    <button type="button" onClick={() => setAdminTab('applications')}><Users size={21}/><strong>Arizalarni ko‘rib chiqish</strong><span>Yangi a’zolik arizalarini qabul qilish yoki rad etish</span><b>Bo‘limni ochish →</b></button>
    <button type="button" onClick={() => setAdminTab('feedback')}><MessageCircle size={21}/><strong>Murojaatlarni boshqarish</strong><span>Kelgan murojaatlarni o‘qish va javob tayyorlash</span><b>Bo‘limni ochish →</b></button>
    <button type="button" onClick={() => setAdminTab('attendance')}><QrCode size={21}/><strong>Davomat va QR-kod</strong><span>Tadbirni tanlash va qatnashuvchilarni ko‘rish</span><b>Bo‘limni ochish →</b></button>
    <button type="button" onClick={() => setAdminTab('settings')}><Settings size={21}/><strong>Sayt sozlamalari</strong><span>Aloqa, rasmlar va guvohnoma ko‘rinishi</span><b>Bo‘limni ochish →</b></button>
  </section>
)}
{adminTab === 'attendance' && (
<div className="admin-section">
<div className="form-card">
  <h2>Davomat boshqaruvi</h2>

  <label>Tadbirni tanlang</label>
  <select
    value={selectedAttendanceEvent}
    onChange={(e) => {
      setSelectedAttendanceEvent(e.target.value)
      loadAttendanceRecords(e.target.value)
    }}
  >
    <option value="">Tadbirni tanlang</option>
    {attendanceEvents.map((event) => (
      <option key={event.id} value={event.id}>
        {event.title}
      </option>
    ))}
  </select>

  <div className="applications-heading" style={{ marginTop: '16px', marginBottom: '12px' }}>
    <h3>Davomatdan o‘tganlar: {attendanceRecords.length} nafar</h3>
    <button
      type="button"
      className="gold-btn"
      onClick={() => loadAttendanceRecords()}
      disabled={attendanceLoading || !selectedAttendanceEvent}
    >
      {attendanceLoading ? 'Yuklanmoqda...' : 'Ro‘yxatni yangilash'}
    </button>
  </div>

  {attendanceLoading ? (
    <p>Davomat ro‘yxati yuklanmoqda...</p>
  ) : attendanceRecords.length === 0 ? (
    <p>Ushbu tadbir uchun tasdiqlangan davomat yozuvi hozircha yo‘q.</p>
  ) : filteredAttendanceRecords.length === 0 ? (
    <p>Qidiruv bo‘yicha davomat yozuvi topilmadi.</p>
  ) : (
    <div className="applications-list">
      {filteredAttendanceRecords.map((record, index) => (
        <article className="application-item" key={record.id}>
          <strong>{index + 1}. {record.member?.full_name || 'Ism topilmadi'}</strong>
          <p><b>A’zolik raqami:</b> {record.member?.application_code || '—'}</p>
          <p><b>Telefon:</b> {record.member?.phone || '—'} · <b>Email:</b> {record.member?.email || '—'}</p>
          <p><b>Yo‘nalish:</b> {record.member?.study_direction || record.member?.faculty || '—'} · <b>Kurs/guruh:</b> {record.member?.course || '—'} / {record.member?.group_number || '—'}</p>
          <p><b>Davomat vaqti:</b> {record.attendance_time
            ? new Date(record.attendance_time).toLocaleString('uz-UZ', { dateStyle: 'short', timeStyle: 'short' })
            : '—'}</p>
          <p><b>Usul:</b> {record.method || '—'}</p>
          <p><b>Holati:</b> {record.status || '—'}</p>
        </article>
      ))}
    </div>
  )}

 <button
  className="gold-btn"
  type="button"
  onClick={() => createEventQR(selectedAttendanceEvent)}
  disabled={qrBusy || !selectedAttendanceEvent}
>
  {qrBusy ? 'QR-kod tayyorlanmoqda...' : 'Tadbir QR-kodini yaratish'}
</button>
{notice && (
  <p className="admin-notice" role="status" aria-live="polite">
    {notice}
  </p>
)}
  {activeEventQR && (
    <div>
      <h3>Tadbir QR-kodi</h3>
      <img
        src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=12&data=${encodeURIComponent(activeEventQR.token)}`}
        alt="Tadbir QR-kodi"
        width="300"
        height="300"
        loading="eager"
      />
      <p>Token: <code>{activeEventQR.token}</code></p>
    </div>
  )}
</div>
</div>
)}
{adminTab === 'feedback' && (
<div className="admin-section">
<div className="form-card">
  <div className="applications-heading">
    <h2>Kelgan murojaatlar</h2>
    <button className="gold-btn" type="button" onClick={loadFeedback} disabled={feedbackLoading}>{feedbackLoading?'Yuklanmoqda...':'Murojaatlarni ko‘rish'}</button>
  </div>
  {feedbackLoading ? (
    <p>Murojaatlar yuklanmoqda...</p>
  ) : feedbackRows.length === 0 ? (
    <p>Hozircha murojaatlar mavjud emas. Ro‘yxatni yangilang.</p>
  ) : filteredFeedbackRows.length === 0 ? (
    <p>Qidiruv bo‘yicha murojaat topilmadi.</p>
  ) : (
    <div className="applications-list">
      {filteredFeedbackRows.map(row => (
        <article className="application-item" key={row.id}>
          <div className="applications-heading">
            <strong>{row.is_anonymous ? 'Anonim murojaat' : (row.full_name || 'Ism ko‘rsatilmagan')}</strong>
            <span className={`feedback-status ${row.status === 'O‘qildi' ? 'is-read' : 'is-new'}`}>
              {row.status || 'Yangi'}
            </span>
          </div>
          <p>{row.message}</p>
          {!row.is_anonymous && row.contact_info && <p><b>Aloqa:</b> {row.contact_info}</p>}
          <small>{row.created_at ? new Date(row.created_at).toLocaleString('uz-UZ') : ''}</small>

          {row.admin_reply && (
            <div className="feedback-admin-reply">
              <b>Administrator javobi:</b>
              <p>{row.admin_reply}</p>
              {row.replied_at && <small>{new Date(row.replied_at).toLocaleString('uz-UZ')}</small>}
            </div>
          )}

          <label>
            Javob yozish
            <textarea
              rows="3"
              value={feedbackReplyDrafts[row.id] ?? row.admin_reply ?? ''}
              onChange={event => setFeedbackReplyDrafts(drafts => ({
                ...drafts,
                [row.id]: event.target.value
              }))}
              placeholder="Murojaatga javobingizni yozing..."
            />
          </label>

          <div className="application-actions">
            <button
              type="button"
              className="gold-btn"
              onClick={() => replyToFeedback(row.id)}
              disabled={feedbackReplyBusy === row.id}
            >
              {feedbackReplyBusy === row.id ? 'Saqlanmoqda...' : 'Javobni saqlash'}
            </button>
            <button
              type="button"
              className="ghost-btn"
              onClick={() => updateFeedbackStatus(row.id, row.status === 'O‘qildi' ? 'Yangi' : 'O‘qildi')}
            >
              {row.status === 'O‘qildi' ? 'Yangi deb belgilash' : 'O‘qildi deb belgilash'}
            </button>
            <button
              type="button"
              className="ghost-btn"
              onClick={() => deleteFeedback(row.id)}
            >
              <Trash2 size={15} /> O‘chirish
            </button>
          </div>
        </article>
      ))}
    </div>
  )}
</div>
</div>
)}
{adminTab === 'applications' && (
<div className="admin-section">
<div className="form-card applications-admin">
  <div className="applications-heading">
    <h2>Klubga a’zolik arizalari</h2>
    <button
      className="gold-btn"
      onClick={loadApplications}
    >
      Yangilash
    </button>
  </div>

  <p>Jami arizalar: {applications.length} ta</p>

  {applications.length === 0 ? (
    <p>Hozircha arizalar mavjud emas.</p>
  ) : filteredApplications.length === 0 ? (
    <p>Qidiruv bo‘yicha ariza topilmadi.</p>
  ) : (
    <div className="applications-list">
      {filteredApplications.map((app) => (
       <details className="application-item" key={app.id}>
          <summary>
  <strong>{app.full_name}</strong> — {app.application_code} · {app.status}
</summary>
          <p><b>Ariza raqami:</b> {app.application_code}</p>
          <p><b>Telefon:</b> {app.phone}</p>
          <p><b>Email:</b> {app.email}</p>
          <p><b>Universitet:</b> {app.university}</p>
          <p><b>Fakultet:</b> {app.faculty}</p>
          <p><b>Yo‘nalish:</b> {app.study_direction}</p>
          <p><b>Kurs:</b> {app.course}</p>
          <p><b>Guruh:</b> {app.group_number}</p>
          <p><b>Faoliyat:</b> {app.activity_direction}</p>
          <p><b>Sabab:</b> {app.motivation || 'Ko‘rsatilmagan'}</p>
          <p><b>Holati:</b> {app.status}</p>
          <div className="application-actions">
  <button
    type="button"
    onClick={() => updateApplicationStatus(app.id, 'Ko‘rib chiqilmoqda')}
  >
    Ko‘rib chiqish
  </button>

  <button
    type="button"
    onClick={() => updateApplicationStatus(app.id, 'Qabul qilindi')}
  >
    Qabul qilish
  </button>

  <button
    type="button"
    onClick={() => updateApplicationStatus(app.id, 'Rad etildi')}
  >
    Rad etish
  </button>
            <button
  type="button"
  onClick={() => deleteApplication(app.id)}
>
  O‘chirish
</button>
</div>
          <small>
            {new Date(app.created_at).toLocaleString('uz-UZ')}
          </small>
        </details>
      ))}
    </div>
  )}
</div>
</div>
)}
{adminTab === 'settings' && (
<div className="admin-section">
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
  <h2>Guvohnoma dizayni</h2>

  <label>
    Guvohnomadagi klub nomi
    <input
      value={draft.certificate_club_name || ''}
      onChange={event =>
        setDraft({
          ...draft,
          certificate_club_name: event.target.value
        })
      }
      placeholder="YOUTH PARLIAMENT"
    />
  </label>

  <label>
    Guvohnoma logotipi
    <input
      type="file"
      accept="image/*"
      onChange={event =>
        uploadSettingImage('certificate_logo', event.target.files?.[0])
      }
    />
  </label>

  {draft.certificate_logo && (
    <img
      src={draft.certificate_logo}
      alt="Guvohnoma logotipi"
      style={{ maxWidth: '120px', display: 'block', margin: '10px 0' }}
    />
  )}

  <label>
    Guvohnoma fon rasmi
    <input
      type="file"
      accept="image/*"
      onChange={event =>
        uploadSettingImage('certificate_background', event.target.files?.[0])
      }
    />
  </label>

  {draft.certificate_background && (
    <img
      src={draft.certificate_background}
      alt="Guvohnoma foni"
      style={{ maxWidth: '260px', display: 'block', margin: '10px 0' }}
    />
  )}

  <button
    className="gold-btn"
    onClick={saveSettings}
    disabled={busy || uploading}
  >
    <Save size={16} /> Dizaynni saqlash
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
</div>
)}
{adminTab === 'content' && (
<div className="admin-section">
<div className="two-col">
{contentForm('news', 'Yangilik')}
{contentForm('events', 'Tadbir')}
{contentForm('gallery', 'Galereya rasmi')}
</div>
<div className="form-card" style={{marginTop:18}}>
  <h2>Tadbirlarni boshqarish</h2>
  <p>Har bir tadbir kartochkasidagi Tahrirlash yoki O‘chirish tugmasidan foydalaning.</p>
  {contentList('events', events)}
</div>
<div className="form-card" style={{marginTop:18}}>
  <h2>Yangiliklar va galereyani boshqarish</h2>
  {contentList('news', news)}
  {contentList('gallery', gallery)}
</div>
<div className="form-card" style={{marginTop:18}}>
  <h2>Kontent bo‘yicha qidiruv natijalari</h2>
  {!normalizedAdminSearch ? <p>Yuqoridagi qidiruv maydoniga tadbir, yangilik yoki galereya sarlavhasini yozing.</p> : (
    <>
      <h3>Tadbirlar ({filteredEvents.length})</h3>
      {filteredEvents.map(row => <p key={row.id}><b>{row.title}</b> — {row.event_date || 'Sana ko‘rsatilmagan'}</p>)}
      <h3>Yangiliklar ({filteredNews.length})</h3>
      {filteredNews.map(row => <p key={row.id}><b>{row.title}</b> — {row.description || ''}</p>)}
      <h3>Galereya ({filteredGallery.length})</h3>
      {filteredGallery.map(row => <p key={row.id}><b>{row.title || 'Galereya rasmi'}</b> — {row.description || ''}</p>)}
      {filteredEvents.length + filteredNews.length + filteredGallery.length === 0 && <p>Kontent bo‘yicha mos natija topilmadi.</p>}
    </>
  )}
</div>
</div>
)}
</>
)}

{notice && <p className="admin-notice">{notice}</p>}
</>
)}
</motion.div>
</AnimatePresence>

<AnimatePresence>
  {galleryPreview && (
    <motion.div
      className="gallery-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Galereya rasmi"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setGalleryPreview(null)}
    >
      <motion.div
        className="gallery-lightbox-panel"
        initial={{ scale: .94, y: 18 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: .96, y: 12 }}
        onClick={event => event.stopPropagation()}
      >
        <button type="button" className="gallery-lightbox-close" onClick={() => setGalleryPreview(null)} aria-label="Yopish">×</button>
        <img src={galleryPreview.image_url} alt={galleryPreview.title || 'Klub galereyasi'} />
        {galleryPreview.title && <h3>{galleryPreview.title}</h3>}
        {galleryPreview.description && <p>{galleryPreview.description}</p>}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


<section className="yp-assistant" aria-label="Sayt yordamchisi">
 {assistantOpen&&<div className="yp-assistant-panel" role="dialog" aria-label="Youth Parliament sayt yordamchisi">
  <div className="yp-assistant-head"><div className="yp-assistant-avatar"><MessageCircle size={20}/></div><div><strong>YPC yordamchi</strong><small>AI yordamchi · faqat ochiq klub ma’lumotlari</small></div><button type="button" className="yp-assistant-close" onClick={()=>setAssistantOpen(false)} aria-label="Chatni yopish">×</button></div>
  <div className="yp-assistant-messages" aria-live="polite">{assistantMessages.map((m,i)=><div key={i} className={`yp-assistant-bubble ${m.role==='user'?'user':''}`}>{m.text}</div>)}</div>
  {assistantBusy && <div className="yp-assistant-bubble" role="status">AI javob tayyorlamoqda…</div>}
  <div className="yp-assistant-quick"><button type="button" disabled={assistantBusy} onClick={()=>sendAssistantMessage('Klubga qanday a’zo bo‘laman?')}>A’zolik</button><button type="button" disabled={assistantBusy} onClick={()=>sendAssistantMessage('Yaqin tadbirlar qachon?')}>Tadbirlar</button><button type="button" disabled={assistantBusy} onClick={()=>sendAssistantMessage('Klub haqida ma’lumot ber')}>Klub haqida</button></div>
  <form className="yp-assistant-compose" onSubmit={e=>{e.preventDefault();sendAssistantMessage()}}><input value={assistantInput} onChange={e=>setAssistantInput(e.target.value)} placeholder="Savolingizni yozing..." aria-label="Savolingiz" disabled={assistantBusy}/><button type="submit" aria-label="Yuborish" disabled={assistantBusy || !assistantInput.trim()}>➤</button></form>
  <div className="yp-assistant-privacy">AI javobi Google Gemini orqali yaratiladi. Faqat savolingiz va klubning hammaga ochiq ma’lumotlari yuboriladi. A’zolik arizalari, shaxsiy kabinet, davomat va maxfiy ma’lumotlar yuborilmaydi. Parol yoki shaxsiy hujjat raqamini yozmang.</div>
 </div>}
 <button type="button" className="yp-assistant-launch" onClick={()=>setAssistantOpen(o=>!o)} aria-expanded={assistantOpen} aria-label={assistantOpen?'Chatni yopish':'AI yordamchini ochish'}><span className="yp-assistant-launch-icon"><img src="/diplomat-robot.gif" alt="Kostyum kiygan robot yordamchi"/></span><span className="yp-assistant-launch-label">{assistantOpen?'Chatni yopish':'Yordam kerakmi?'}</span></button>
</section>

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
