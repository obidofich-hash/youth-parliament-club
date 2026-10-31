
Загрузка более ранних сообщений…















































import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'
@@ -73,9 +24,7 @@ const defaults = {
youtube: '',
hero_image: '',
club_logo: '',
  home_image: '',
  about_intro_image: '',
  about_history_image: ''
  home_image: ''
}

const nav = [
@@ -327,61 +276,6 @@ function App() {
.getPublicUrl(path)

setItem(current => ({

Загрузка более ранних сообщений…





















































...current,
image_url: data.publicUrl
}))
@@ -590,29 +484,12 @@ function App() {
<Brand logo={settings.club_logo} />
</button>

       
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

        <div className="top-links">
          <span>RASMIY KLUB PLATFORMASI</span>
          <button onClick={() => go('contact')}>
            Bog‘lanish <ArrowUpRight size={15} />
          </button>
        </div>
</header>

<AnimatePresence>
@@ -662,61 +539,6 @@ function App() {
<p>
Faol yoshlar, kuchli jamiyat va adolatli kelajak sari.
</p>

Загрузка более ранних сообщений…





















































<button onClick={() => go('membership')}>
Bizga qo‘shiling <ArrowRight size={14} />
</button>
@@ -812,180 +634,129 @@ function App() {
</>
)}


{page === 'about' && (
  <div className="about-v2">
             {page === 'about' && (
  <div className="about-page">
<PageHead
      kicker="YOSHLAR PARLAMENTI KLUBI"
      title="G‘oyadan — kelajakka."
      desc="Bilim, tashabbus va yetakchilikni birlashtirgan yoshlar platformasi."
      kicker="BIZNING TARIXIMIZ"
      title="O‘tmishdan — kelajak sari."
      desc="Yoshlar parlamenti klubi: bilim, tashabbus va mas’uliyatni birlashtirgan yoshlar jamoasi."
/>

<motion.section
      className="av-intro"
      initial={{ opacity: 0, y: 55 }}
      className="about-intro"
      initial={{ opacity: 0, y: 45 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.85 }}
      transition={{ duration: 0.8 }}
>
      <div className="av-intro-copy">
        <span className="av-kicker">BIZNING MISSIYAMIZ</span>
        <h2>Yoshlar ovozi — <em>jamiyat kelajagi.</em></h2>
      <div className="about-intro-image">
        <img
          src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=85"
          alt="Universitet talabalari"
        />
      </div>
      <div className="about-intro-text">
        <span className="eyebrow">TASHKIL TOPISH TARIXI</span>
        <h2>Yoshlar tashabbusidan boshlangan yo‘l.</h2>
<p>
          Yoshlarning huquqiy bilimini oshirish, ijtimoiy
          faolligini kuchaytirish va yangi tashabbuslarini
          qo‘llab-quvvatlash — klub faoliyatining asosiy
          yo‘nalishidir.
          Yoshlar parlamenti klubi Xalqaro ijtimoiy innovatsiyalar
          universiteti hududida tashkil etilgan. Klub yoshlarning
          huquqiy bilimini, siyosiy va ijtimoiy faolligini oshirish,
          ularning tashabbuslarini qo‘llab-quvvatlash maqsadida
          faoliyat yuritadi.
</p>
        <div className="av-meta">
          <span><CalendarDays size={17}/> 2026-yil, noyabr</span>
          <span><Users size={17}/> 12 nafar jamoa a’zosi</span>
        </div>
      </div>

      <div className="av-visual av-visual-one">
        <div className="av-image-frame">
          {settings.about_intro_image
            ? <img src={settings.about_intro_image} alt="Klub haqida — asosiy rasm" />
            : <span className="av-empty-image">RASM JOYI</span>}
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
          {settings.about_history_image
            ? <img src={settings.about_history_image} alt="Klub tarixi rasmi" />
            : <span className="av-empty-image">RASM JOYI</span>}
        </div>
        <div className="av-photo-stamp">YOSHLAR<br/>TASHABBUSI</div>
      </div>

      <motion.div
        className="av-history-copy"
        initial={{ opacity: 0, x: 55 }}
    <div className="about-timeline">
      <motion.article
        className="timeline-card past"
        initial={{ opacity: 0, x: -45 }}
whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, delay: 0.15 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
>
        <span className="av-kicker">TASHKIL TOPISH TARIXI</span>
        <h2>Har bir katta o‘zgarish <em>bir g‘oyadan</em> boshlanadi.</h2>
        <span className="timeline-number">01</span>
        <span className="eyebrow">O‘TMISH</span>
        <h2>G‘oyaning tug‘ilishi</h2>
<p>
2026-yil noyabr oyida Xalqaro ijtimoiy innovatsiyalar
          universiteti hududida Yoshlar parlamenti klubi ochilgan.
          Klub yoshlarning fikr va takliflarini ilgari surish,
          ularning ijtimoiy hayotdagi ishtirokini kuchaytirish
          maqsadida tashkil etilgan.
          universitetida Yoshlar parlamenti klubiga asos solindi.
          Bu tashabbus yoshlar uchun yangi fikrlar, huquqiy bilim
          va ijtimoiy faollik maydonini yaratishga qaratildi.
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
      </motion.article>

      <motion.article
        className="timeline-card present"
        initial={{ opacity: 0, y: 45 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <span className="timeline-number">02</span>
        <span className="eyebrow">BUGUN</span>
        <h2>12 kishilik faol jamoa</h2>
<p>
          Klub faoliyati vazifalar taqsimoti, hamkorlik va
          mas’uliyat tamoyillariga asoslanadi. Har bir ishtirokchi
          umumiy maqsad yo‘lida o‘z yo‘nalishi bo‘yicha faoliyat
          olib boradi.
          Bugun klub 12 nafar a’zodan iborat jamoa sifatida
          shakllangan. Spiker, koordinatorlar, media bo‘limi
          va a’zolar yagona maqsad yo‘lida faoliyat olib boradi.
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
        <div className="team-stats">
          <div><strong>1</strong><span>Spiker</span></div>
          <div><strong>2</strong><span>Koordinator</span></div>
          <div><strong>2</strong><span>Media</span></div>
          <div><strong>7</strong><span>A’zo</span></div>
</div>
      </div>
    </motion.section>

    <div className="av-divider">
      <span>03</span><i/><b>KELAJAK</b>
    </div>
      </motion.article>

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
      <motion.article
        className="timeline-card future"
        initial={{ opacity: 0, x: 45 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <span className="timeline-number">03</span>
        <span className="eyebrow">KELAJAK</span>
        <h2>Yangi marralar sari</h2>
<p>
Klubning istiqboldagi maqsadi — universitet miqyosida
          yoshlar tashabbuslarini kengaytirish, huquqiy va
          intellektual loyihalarni amalga oshirish hamda faol
          yoshlar tashabbuslarini kengaytirish, intellektual
          va huquqiy loyihalarni amalga oshirish hamda faol
yoshlar hamkorligini rivojlantirish.
</p>
      </div>
      </motion.article>
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
    <motion.section
      className="about-team"
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="eyebrow">KLUB JAMOASI</div>
      <h2>Bir maqsad — yagona jamoa.</h2>
      <p>
        Klubning tashkiliy tuzilmasi vazifalar taqsimoti va
        hamkorlik tamoyili asosida shakllantirilgan.
      </p>
      <div className="team-total">
        <Users size={30} />
        <strong>12</strong>
        <span>nafar jamoa a’zosi</span>
</div>

      <div className="av-final-line">
        YOSHLAR OVOZI. YANGI G‘OYALAR. YANGI KELAJAK.
      <div className="team-structure">
        <div><Landmark /><strong>1</strong><span>Spiker</span></div>
        <div><Users /><strong>2</strong><span>Koordinator</span></div>
        <div><Users /><strong>2</strong><span>Media bo‘limi</span></div>
        <div><Users /><strong>7</strong><span>Klub a’zolari</span></div>
</div>
</motion.section>
</div>
)}



{page === 'membership' && (
<>
<PageHead
@@ -997,61 +768,6 @@ function App() {
<a
className="gold-btn link-btn"
href={formUrl}

Загрузка более ранних сообщений…





















































target="_blank"
rel="noreferrer"
>
@@ -1227,9 +943,7 @@ function App() {
{[
['hero_image', 'Bosh sahifa banneri'],
['club_logo', 'Klub logotipi'],
                          ['home_image', 'Bosh sahifadagi qo‘shimcha rasm'],
                          ['about_intro_image', 'Klub haqida — missiya rasmi'],
                          ['about_history_image', 'Klub haqida — tarix rasmi']
                          ['home_image', 'Bosh sahifadagi qo‘shimcha rasm']
].map(([key, label]) => (
<label key={key}>
{label}
