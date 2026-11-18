import { useState } from 'react'
import { Check, CircleAlert, FlaskConical, Play } from 'lucide-react'
import Panel from '../components/Panel.jsx'
import { runTestCase, testCases } from '../utils/testCases.js'
import { formatNumber } from '../utils/solver.js'

const statusNames = { met: 'Gặp nhau', met_with_warning: 'Gặp · có cảnh báo', no_meeting: 'Nghiệm ngoài miền', no_solution: 'Vô nghiệm', infinite: 'Vô số nghiệm', invalid: 'Dữ liệu sai' }

function describeActual(run) {
  if (run.result.solution) return `${statusNames[run.actual]} · t=${formatNumber(run.result.solution.time)} giờ, s=${formatNumber(run.result.solution.position)} km`
  return statusNames[run.actual] || run.actual
}

export default function TestCasesPage() {
  const [runs, setRuns] = useState(null)
  const passed = runs?.filter((item) => item.passed).length ?? 0
  return <div className="page-stack">
    <div className="page-title"><div><span className="eyebrow">KIỂM THỬ LOGIC TOÁN HỌC</span><h1>Test Cases</h1><p>15 trường hợp bình thường, biên và dữ liệu không hợp lệ.</p></div><div className="page-title-mark"><FlaskConical size={23} /><span>15 test</span></div></div>
    <Panel className="test-toolbar">
      <div><span className="eyebrow">BỘ KIỂM THỬ TỰ ĐỘNG</span><h2>Kiểm tra bộ giải chuyển động</h2><p>Mỗi test chạy qua cùng hàm giải được dùng trong ứng dụng.</p></div>
      <button className="button button-primary" onClick={() => setRuns(testCases.map(runTestCase))}><Play size={16} /> Chạy tất cả test</button>
    </Panel>
    {runs && <div className={`test-summary ${passed === runs.length ? 'all-pass' : 'some-fail'}`}><div>{passed === runs.length ? <Check /> : <CircleAlert />}<strong>{passed}/{runs.length} test đạt</strong><span>{passed === runs.length ? 'Bộ giải cho kết quả như mong đợi.' : 'Có test chưa đạt, hãy kiểm tra lại logic.'}</span></div><div className="summary-meter"><i style={{ width: `${(passed / runs.length) * 100}%` }} /></div></div>}
    <Panel className="table-panel">
      <div className="table-scroll"><table className="test-table">
        <thead><tr><th>Test case / dữ liệu vào</th><th>Kết quả mong đợi</th><th>Kết quả thực tế</th><th>Trạng thái</th></tr></thead>
        <tbody>{testCases.map((testCase, index) => {
          const run = runs?.[index]
          const inputText = `AB ${testCase.input.distance} km · ${testCase.input.vehicle1.speed}/${testCase.input.vehicle2.speed} km/h · ${testCase.input.vehicle1.direction === testCase.input.vehicle2.direction ? 'cùng chiều' : 'ngược chiều'}`
          return <tr key={testCase.id}>
            <td><div className="test-name"><strong>{testCase.id} · {testCase.title}</strong><span>{inputText}</span><small>{testCase.explanation}</small></div></td>
            <td><span className="expected-tag">{statusNames[testCase.expected]}</span></td>
            <td>{run ? describeActual(run) : <span className="not-run">Chưa chạy</span>}</td>
            <td>{run ? <span className={`pass-badge ${run.passed ? 'passed' : 'failed'}`}>{run.passed ? 'PASS' : 'FAIL'}</span> : <span className="not-run">—</span>}</td>
          </tr>
        })}</tbody>
      </table></div>
    </Panel>
    <p className="test-footnote">* Ngưỡng cảnh báo vận tốc phi thực tế: trên 300 km/h. Một kết quả có nghiệm hợp lệ nhưng kèm cảnh báo được ghi nhận là “Gặp · có cảnh báo”.</p>
  </div>
}
