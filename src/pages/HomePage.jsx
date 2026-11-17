import { ArrowRight, Atom, Compass, FlaskConical, FunctionSquare, Route, Sparkles } from 'lucide-react'
import { BlockMath } from 'react-katex'
import Panel from '../components/Panel.jsx'
import { formatNumber } from '../utils/solver.js'

const features = [
  { icon: FunctionSquare, number: '01', title: 'Lập phương trình', description: 'Mô hình hóa chuyển động bằng tọa độ, vận tốc và thời gian.' },
  { icon: Route, number: '02', title: 'Theo dõi hành trình', description: 'Quan sát đồ thị vị trí–thời gian và điểm gặp nhau.' },
  { icon: FlaskConical, number: '03', title: 'Kiểm chứng nghiệm', description: 'Thử lại kết quả và phát hiện dữ liệu không hợp lí.' },
]

export default function HomePage({ problem, result, onNavigate }) {
  return (
    <div className="page-stack">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-kicker"><span className="pulse-dot" /> PHÒNG THÍ NGHIỆM TOÁN – VẬT LÍ</div>
          <h1>Biến chuyển động<br /><em>thành phương trình.</em></h1>
          <p>Khám phá cách hai phương tiện gặp nhau qua phương trình bậc nhất — từng bước, trực quan và có thể kiểm chứng.</p>
          <button className="button button-primary hero-cta" onClick={() => onNavigate('solve')}>Bắt đầu khám phá <ArrowRight size={17} /></button>
          <div className="hero-equation">
            <span>QUY LUẬT CHUYỂN ĐỘNG</span>
            <BlockMath math="s = s_0 + v(t-t_0)" />
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="orbit-label label-x">x(t)</div><div className="orbit-label label-v">v →</div>
          <div className="hero-road"><span> A </span><i /><span> B </span></div>
          <div className="hero-car car-a">🚙</div><div className="hero-car car-b">🚗</div>
          <div className="hero-coordinate">s = vt + s₀</div>
          <Atom className="atom-icon" size={40} strokeWidth={1} />
        </div>
        <div className="hero-index">LAB. 001 <span>·</span> MOTION EQUATIONS</div>
      </section>

      <section className="overview-grid">
        <Panel className="overview-card">
          <div className="overview-label"><Compass size={15} /> BÀI TOÁN HIỆN TẠI</div>
          <h2>{problem.vehicle1.name || 'Xe 1'} <span>×</span> {problem.vehicle2.name || 'Xe 2'}</h2>
          <p>Đoạn đường AB dài {formatNumber(Number(problem.distance))} km · {problem.type === 'opposite' ? 'ngược chiều' : problem.type === 'chase' ? 'cùng chiều' : 'lệch giờ'}</p>
          <button className="text-link" onClick={() => onNavigate('solve')}>Mở bài toán <ArrowRight size={15} /></button>
        </Panel>
        <Panel className="overview-equation">
          <div className="overview-label"><Sparkles size={15} /> Ý TƯỞNG TRỌNG TÂM</div>
          <BlockMath math="s_1(t)=s_2(t) \quad \Longrightarrow \quad \checkmark" />
          <small>Khi hai tọa độ bằng nhau, hai xe ở cùng vị trí cùng thời điểm.</small>
        </Panel>
      </section>
      <section className="feature-section">
        <div className="section-heading"><span className="eyebrow">HỌC BẰNG CÁCH KHÁM PHÁ</span><h2>Mỗi bước đều có lí do.</h2></div>
        <div className="feature-grid">{features.map(({ icon: Icon, number, title, description }) =>
          <Panel className="feature-card" key={number}><div className="feature-top"><span>{number}</span><Icon size={20} /></div><h3>{title}</h3><p>{description}</p></Panel>
        )}</div>
      </section>
      <Panel className="result-strip">
        <div><span className="eyebrow">KẾT QUẢ ĐANG KIỂM TRA</span><strong>{result.status === 'met' ? `Gặp nhau sau ${formatNumber(result.solution.time)} giờ` : result.status === 'invalid' ? 'Chưa có dữ liệu hợp lệ' : 'Chưa có giao điểm trên đoạn AB'}</strong></div>
        <button className="button button-outline" onClick={() => onNavigate('simulation')}>Xem mô phỏng <ArrowRight size={16} /></button>
      </Panel>
    </div>
  )
}
