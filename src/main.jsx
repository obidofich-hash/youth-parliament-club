
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
                          ['home_image', 'Bosh sahifadagi qo‘shimcha rasm'],
                          ['about_intro_image', 'Klub haqida — missiya rasmi'],
                          ['about_history_image', 'Klub haqida — tarix rasmi']
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
