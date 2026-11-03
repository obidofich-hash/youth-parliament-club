
import { QRCodeSVG } from 'qrcode.react'

export default function MembershipCertificate({ member, settings = {} }) {
  if (!member) return null

  const issued = member.membership_issued_at
    ? new Date(member.membership_issued_at).toLocaleDateString('uz-UZ')
    : '—'

  const expires = member.membership_expires_at
    ? new Date(member.membership_expires_at).toLocaleDateString('uz-UZ')
    : '—'

  const initials = (member.full_name || 'YP')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase()

  const clubName = settings.certificate_club_name || 'YOUTH PARLIAMENT'
  const logo = settings.certificate_logo
  const background = settings.certificate_background

  return (
    <div className="idcard-wrapper">
      <div
        className="idcard"
        style={{
          backgroundImage: background
            ? `url("${background}")`
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="idcard-glow" />

        <div className="idcard-header">
          <div className="idcard-brand">
            <div className="idcard-emblem">
              {logo ? (
                <img
                  src={logo}
                  alt="Klub logotipi"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              ) : (
                'YP'
              )}
            </div>

            <div>
              <strong>{clubName}</strong>
              <span>CLUB · UZBEKISTAN</span>
            </div>
          </div>

          <div className="idcard-title">
            A’ZOLIK<br />GUVОHNOMASI
          </div>
        </div>

        <div className="idcard-content">
          <div className="idcard-photo">
            {member.photo_url ? (
              <img src={member.photo_url} alt={member.full_name} />
            ) : (
              <div className="idcard-initials">{initials}</div>
            )}
          </div>

          <div className="idcard-details">
            <div className="idcard-name">{member.full_name}</div>

            <div className="idcard-line">
              <b>UNIVERSITET</b>
              <span>{member.university || '—'}</span>
            </div>

            <div className="idcard-line">
              <b>FAKULTET</b>
              <span>{member.faculty || '—'}</span>
            </div>

            <div className="idcard-line">
              <b>YO‘NALISH</b>
              <span>{member.study_direction || '—'}</span>
            </div>

            <div className="idcard-line">
              <b>KURS / GURUH</b>
              <span>
                {member.course || '—'} / {member.group_number || '—'}
              </span>
            </div>
          </div>

          <div className="idcard-qr">
            <div className="idcard-qr-box">
              <QRCodeSVG
                value={member.membership_code || 'YPC'}
                size={125}
                level="H"
                bgColor="#ffffff"
                fgColor="#071b35"
              />
            </div>
            <span>DAVOMAT QR</span>
          </div>
        </div>

        <div className="idcard-footer">
          <div className="idcard-number">
            <small>A’ZOLIK RAQAMI</small>
            <strong>{member.membership_code || '—'}</strong>
          </div>

          <div className="idcard-validity">
            <small>BERILGAN SANA</small>
            <strong>{issued}</strong>
          </div>

          <div className="idcard-validity">
            <small>AMAL QILISH MUDDATI</small>
            <strong>{expires}</strong>
          </div>

          <div className="idcard-status">
            <span>✓</span> FAOL A’ZO
          </div>
        </div>

        <div className="idcard-bottom-line">
          {clubName} · YOSHLAR OVOZI · YANGI KELAJAK
        </div>
      </div>

      <div className="idcard-actions">
        <button
          className="gold-btn"
          onClick={() => window.print()}
        >
          PDF shaklida yuklab olish
        </button>
      </div>
    </div>
  )
}
