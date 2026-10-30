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
  const [uploading, setUploading] = useState(false)
  const [notice, setNotice] = useState('')
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

  function go(nextPage) {
    setPage(nextPage)
    setMenu(false)
    setNotice('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
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

            <h2>{row.title}</h2>

            {row.description && <p>{row.description}</p>}

            {row.event_date && (
              <p>{new Date(row.event_date).toLocaleString('uz-UZ')}</p>
            )}

            {session && (
              <button
                className="ghost-btn"
                onClick={() => deleteContent(type, row.id)}
              >
                <Trash2 size={15} /> O‘chirish
              </button>
            )}
          </article>
        ))}
      </div>
    )
  }
    return (
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
                        Kelajakni<br />
                        <em>birgalikda</em> quramiz.
                      </h1>

                      <p>
                        Yoshlarning huquqiy salohiyati, yetakchiligi va
                        tashabbuslarini birlashtiruvchi ochiq platforma.
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

                  <section
  className="welcome-row"
  style={{
    backgroundImage: settings.home_image
      ? `linear-gradient(rgba(5,18,35,.45), rgba(5,18,35,.65)), url("${settings.home_image}")`
      : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}
>
  <motion.div
    className="welcome-content"
    initial={{ opacity: 0, y: 65 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false, amount: 0.25 }}
    transition={{ duration: 1, ease: "easeOut" }}
  >
    <div className="eyebrow">BIZNING MAQSAD</div>
    <h2>
      Yoshlar ovozi —<br />
      <em>jamiyat kelajagi.</em>
    </h2>
    <p>
      Yoshlarning huquqiy bilimini oshirish, ijtimoiy
      faolligini kuchaytirish va tashabbuslarini
      qo‘llab-quvvatlash.
    </p>
  </motion.div>
</section>
                </>
              )}

              {page === 'about' && (
                <>
                  <PageHead
                    kicker="BIZ HAQIMIZDA"
                    title="G‘oya, maqsad va mas’uliyat."
                    desc="Yoshlar parlamenti klubi — faol, bilimli va tashabbuskor yoshlarni birlashtiruvchi jamoaviy maydon."
                  />

                  <div className="two-col">
                    <Info
                      title="Bizning missiya"
                      text="Yoshlarning huquqiy ongi va madaniyatini yuksaltirish, ularning jamiyat hayotidagi ishtirokini kengaytirish hamda tashabbuslarini qo‘llab-quvvatlash."
                    />

                    <Info
                      title="Istiqboldagi maqsad"
                      text="Yoshlar va davlat institutlari o‘rtasida muloqot ko‘prigini yaratish, yangi loyihalar va amaliy takliflarni ilgari surish."
                    />
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

                  <a
                    className="gold-btn link-btn"
                    href={formUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Anketani to‘ldirish <ArrowUpRight />
                  </a>
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

                  {!session ? (
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
                          ['home_image', 'Bosh sahifadagi qo‘shimcha rasm']
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
