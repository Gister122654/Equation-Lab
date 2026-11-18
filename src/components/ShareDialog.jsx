import { useEffect, useState } from 'react'
import { Copy, Download, X } from 'lucide-react'
import QRCode from 'qrcode'

export default function ShareDialog({ onClose }) {
  const shareUrl = new URL(import.meta.env.BASE_URL, window.location.origin).href
  const [qrCode, setQrCode] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true
    QRCode.toDataURL(shareUrl, {
      width: 240,
      margin: 1,
      color: { dark: '#10202b', light: '#ffffff' },
    }).then((dataUrl) => {
      if (active) setQrCode(dataUrl)
    }).catch((error) => {
      console.error('Không thể tạo mã QR chia sẻ.', error)
      if (active) setMessage('Không thể tạo mã QR. Hãy tải lại trang và thử lại.')
    })
    return () => { active = false }
  }, [shareUrl])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setMessage('Đã sao chép đường dẫn.')
    } catch (error) {
      console.error('Không thể sao chép đường dẫn.', error)
      setMessage('Không thể tự sao chép. Hãy chọn và sao chép đường dẫn bên trên.')
    }
  }

  return <div className="share-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section className="share-dialog" role="dialog" aria-modal="true" aria-labelledby="share-dialog-title">
      <div className="share-dialog-heading">
        <div><span className="eyebrow">CHIA SẺ PHÒNG THÍ NGHIỆM</span><h2 id="share-dialog-title">Liên kết truy cập</h2></div>
        <button className="share-close" onClick={onClose} aria-label="Đóng hộp thoại"><X size={17} /></button>
      </div>
      <input className="share-url" aria-label="Đường dẫn chia sẻ" value={shareUrl} readOnly onFocus={(event) => event.currentTarget.select()} />
      <div className="share-actions">
        <button className="button button-primary" onClick={copyLink}><Copy size={15} /> Sao chép liên kết</button>
        {qrCode && <a className="button button-secondary" href={qrCode} download="ai-motion-equation-lab-qr.png"><Download size={15} /> Tải mã QR</a>}
      </div>
      <p className="share-message" role="status">{message}</p>
      <div className="share-qr">
        {qrCode ? <img src={qrCode} alt={`Mã QR dẫn đến ${shareUrl}`} /> : <span>Đang tạo mã QR…</span>}
        <span>Quét để mở AI Motion Equation Lab</span>
      </div>
      <p className="share-note">Liên kết và mã QR không hết hạn khi trang GitHub Pages còn được xuất bản tại địa chỉ này.</p>
    </section>
  </div>
}
