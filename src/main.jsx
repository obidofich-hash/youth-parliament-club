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
