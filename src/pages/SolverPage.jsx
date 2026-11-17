import { Check, CircleHelp, Equal, Sigma } from 'lucide-react'
import { BlockMath } from 'react-katex'
import Panel from '../components/Panel.jsx'
import ProblemForm from '../components/ProblemForm.jsx'
import StepGuide from '../components/StepGuide.jsx'
import MotionChart from '../components/MotionChart.jsx'
import { formatMathNumber, formatNumber } from '../utils/solver.js'

export default function SolverPage({ problem, onChange, result }) {
  const solved = result.status === 'met'
  return (
    <div className="page-stack">
      <div className="page-title"><div><span className="eyebrow">MÔ HÌNH HÓA · GIẢI · KIỂM TRA</span><h1>Giải bài toán chuyển động</h1><p>Điền dữ kiện để lập phương trình từ vị trí của hai phương tiện.</p></div><div className="page-title-mark"><Sigma size={23} /><span>ax + b = 0</span></div></div>
      <Panel>
        <div className="panel-heading"><div><span className="eyebrow">DỮ KIỆN BÀI TOÁN</span><h2>Thiết lập hành trình</h2></div><span className="unit-chip">vị trí tính từ A</span></div>
        <ProblemForm problem={problem} onChange={onChange} result={result} />
      </Panel>
      <Panel className="equation-panel">
        <div className="panel-heading"><div><span className="eyebrow">MÔ HÌNH ĐẠI SỐ</span><h2>Phương trình gặp nhau</h2></div><Equal size={21} className="subtle-icon" /></div>
        {result.equation ? <div className="equation-content">
          <div className="equation-display"><BlockMath math={result.equation.latex} /></div>
          <div className={`solution-result ${solved ? 'success' : result.status === 'invalid' ? 'muted' : 'warning'}`}>
            {solved ? <Check size={18} /> : <CircleHelp size={18} />}
            {solved ? <span>Nghiệm phù hợp: <strong>t = {formatNumber(result.solution.time)} giờ</strong>, gặp tại <strong>s = {formatNumber(result.solution.position)} km từ A</strong>.</span> :
              <span>{result.status === 'infinite' ? 'Phương trình có vô số thời điểm trùng vị trí (hai quỹ đạo trùng nhau).' : result.status === 'no_solution' ? 'Phương trình vô nghiệm: hai quỹ đạo không giao nhau.' : result.status === 'no_meeting' ? 'Có nghiệm đại số nhưng nghiệm không thỏa miền chuyển động thực tế.' : 'Nhập dữ liệu hợp lệ để lập phương trình.'}</span>}
          </div>
          {result.condition && <p className="condition-note"><strong>Miền nghiệm thực tế:</strong> {result.condition}. Điều kiện được đặt trước khi biến đổi để loại nghiệm ngoài ý nghĩa vật lí.</p>}
        </div> : <div className="empty-equation">Phương trình sẽ xuất hiện khi dữ liệu đầu vào hợp lệ.</div>}
        <p className="model-note"><strong>Từ công thức chuyển động:</strong> <span>t = s/v</span> nên <span>s = v·t</span>. Gắn dấu theo chiều đi và cộng vị trí xuất phát để lập tọa độ từng xe.</p>
      </Panel>
      <StepGuide problem={problem} result={result} />
      <Panel className="check-panel">
        <div className="panel-heading"><div><span className="eyebrow">THAY NGHIỆM VÀO ĐỀ BÀI GỐC</span><h2>Kiểm tra lại kết quả</h2></div><Check size={20} className={solved ? 'success-icon' : 'subtle-icon'} /></div>
        {solved ? <div className="check-grid">
          <div className="equation-substitution"><span>Phương trình bậc nhất sau khi thay nghiệm</span><BlockMath math={`${formatMathNumber(result.equation.coefficient)}\\cdot${formatMathNumber(result.solution.time)}=${formatMathNumber(result.equation.constant)}\\quad\\Longleftrightarrow\\quad ${formatMathNumber(result.check.equationLeft)}=${formatMathNumber(result.check.equationRight)}`} /></div>
          <div className="check-equation"><span>{problem.vehicle1.name}</span><BlockMath math={`s_1(${formatMathNumber(result.solution.time)})=${formatMathNumber(result.check.firstPosition)}\\;\\text{km}`} /></div>
          <div className="check-equal"><Equal size={20} /></div>
          <div className="check-equation"><span>{problem.vehicle2.name}</span><BlockMath math={`s_2(${formatMathNumber(result.solution.time)})=${formatMathNumber(result.check.secondPosition)}\\;\\text{km}`} /></div>
          <div className="check-pass"><Check size={17} /> ĐÚNG · Hai vị trí trùng nhau</div>
        </div> : <p className="muted-copy">Chỉ xác nhận phép thử khi nghiệm thỏa điều kiện thực tế.</p>}
      </Panel>
      <MotionChart problem={problem} result={result} />
    </div>
  )
}
