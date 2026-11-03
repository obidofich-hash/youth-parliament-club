
import { QRCodeSVG } from 'qrcode.react'

export default function MembershipCertificate({ member }) {
  if (!member) return null

  const issued = member.membership_issued_at
    ? new Date(member.membership_issued_at).toLocaleDateString('uz-UZ')
    : '—'

  const expires = member.membership_expires_at
    ? new Date(member.membership_expires_at).toLocaleDateString('uz-UZ')
    : '—'

  return (
    <div className="membership-certificate">
      <div className="certificate-inner">
        <div className="certificate-top">
          <div className="certificate-flag">
            <span>🇺🇿</span>
            <span>O‘ZBEKISTON RESPUBLIKASI</span>
          </div>
          <div className="certificate-seal">YP</div>
        </div>

        <div className="certificate-heading">
          <p>YOSHLAR PARLAMENTI KLUBI</p>
          <h1>A’ZOLIK GUVOHNOMASI</h1>
          <span>MEMBERSHIP CERTIFICATE</span>
        </div>

        <div className="certificate-divider" />

        <div className="certificate-member">
          <p className="certificate-label">GUVOHNOMA EGASI</p>
          <h2>{member.full_name}</h2>
          <p><b>A’zolik raqami:</b> {member.membership_code}</p>
          <p><b>Universitet:</b> {member.university}</p>
          <p><b>Fakultet:</b> {member.faculty}</p>
          <p><b>Yo‘nalish:</b> {member.study_direction}</p>
          <p><b>Kurs / Guruh:</b> {member.course} / {member.group_number}</p>
        </div>

        <div className="certificate-bottom">
          <div>
            <p><b>Berilgan sana:</b> {issued}</p>
            <p><b>Amal qilish muddati:</b> {expires}</p>
            <p className="certificate-status">FAOL A’ZO</p>
          </div>

          <div className="certificate-qr">
            <QRCodeSVG
              value={member.membership_code || 'Yoshlar parlamenti klubi'}
              size={105}
              level="H"
            />
            <small>QR IDENTIFIKATSIYA</small>
          </div>
        </div>

        <div className="certificate-footer">
          YOSHLAR PARLAMENTI KLUBI
        </div>
      </div>

      <button
        className="gold-btn certificate-download"
        onClick={() => window.print()}
      >
        PDF shaklida yuklab olish
      </button>
    </div>
  )
}
