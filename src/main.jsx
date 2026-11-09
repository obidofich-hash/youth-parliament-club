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
const [adminTab, setAdminTab] = useState('overview')
const [adminSearch, setAdminSearch] = useState('')
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
    const { data, error } = await supabase.functions.invoke('check-application-status', {
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
{settings.about_intro || 'Yoshlarning huquqiy bilimini oshirish, ijtimoiy faolligini kuchaytirish va yangi tashabbuslarini qo‘llab-quvvatlash — klub faoliyatining asosiy yo‘nalishidir.'}
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
src={settings.about_history_image || "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=85"}
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
{settings.about_history || '2026-yil noyabr oyida Xalqaro ijtimoiy innovatsiyalar universiteti hududida Yoshlar parlamenti klubi ochilgan. Klub yoshlarning fikr va takliflarini ilgari surish, ularning ijtimoiy hayotdagi ishtirokini kuchaytirish maqsadida tashkil etilgan.'}
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
{settings.about_today || 'Klub faoliyati vazifalar taqsimoti, hamkorlik va mas’uliyat tamoyillariga asoslanadi. Har bir ishtirokchi umumiy maqsad yo‘lida o‘z yo‘nalishi bo‘yicha faoliyat olib boradi.'}
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
{settings.about_future || 'Klubning istiqboldagi maqsadi — universitet miqyosida yoshlar tashabbuslarini kengaytirish, huquqiy va intellektual loyihalarni amalga oshirish hamda faol yoshlar hamkorligini rivojlantirish.'}
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
{session?.user?.email?.toLowerCase() === 'obidofich@gmail.com' && (
  <section className="form-card about-editor">
    <h2>“Klub haqida” bo‘limini tahrirlash</h2>
    <p>Matnlarni o‘zgartiring, rasmlarni yuklang va saqlang. O‘zgarishlar ommaga ko‘rinadi.</p>
    <label>Kirish matni<textarea rows="3" value={draft.about_intro || ''} onChange={e=>setDraft({...draft,about_intro:e.target.value})} placeholder="Missiya matni"/></label>
    <label>Tarix matni<textarea rows="4" value={draft.about_history || ''} onChange={e=>setDraft({...draft,about_history:e.target.value})} placeholder="Klub tashkil topishi tarixi"/></label>
    <label>Bugungi faoliyat matni<textarea rows="3" value={draft.about_today || ''} onChange={e=>setDraft({...draft,about_today:e.target.value})} placeholder="Bugungi faoliyat"/></label>
    <label>Kelajak matni<textarea rows="3" value={draft.about_future || ''} onChange={e=>setDraft({...draft,about_future:e.target.value})} placeholder="Istiqboldagi maqsadlar"/></label>
    <label>Universitet rasmi<input type="file" accept="image/*" onChange={e=>uploadSettingImage('about_image',e.target.files?.[0])}/></label>
    <label>Tarix rasmi<input type="file" accept="image/*" onChange={e=>uploadSettingImage('about_history_image',e.target.files?.[0])}/></label>
    <button className="gold-btn" type="button" onClick={saveSettings} disabled={busy}>O‘zgarishlarni saqlash <Save size={16}/></button>
  </section>
)}
</div>
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
