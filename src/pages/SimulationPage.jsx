import { Activity } from 'lucide-react'
import MotionSimulator from '../components/MotionSimulator.jsx'
import MotionChart from '../components/MotionChart.jsx'

export default function SimulationPage({ problem, result }) {
  return <div className="page-stack">
    <div className="page-title"><div><span className="eyebrow">QUAN SÁT VẬT LÍ</span><h1>Mô phỏng hành trình</h1><p>Điều khiển thời gian và theo dõi vị trí của từng xe trên đoạn AB.</p></div><div className="page-title-mark"><Activity size={23} /><span>s = s₀ + vt</span></div></div>
    <MotionSimulator problem={problem} result={result} />
    <MotionChart problem={problem} result={result} />
  </div>
}
