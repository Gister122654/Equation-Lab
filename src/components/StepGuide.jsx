import { useState } from 'react'
import { BlockMath } from 'react-katex'
import { ArrowLeft, ArrowRight, BookOpenCheck } from 'lucide-react'
import Panel from './Panel.jsx'
import { getSolutionSteps } from '../utils/solver.js'

export default function StepGuide({ problem, result }) {
  const [index, setIndex] = useState(0)
  const steps = getSolutionSteps(problem, result)
  const [showAll, setShowAll] = useState(false)

  if (!steps.length) {
    return <Panel><div className="empty-state"><BookOpenCheck size={22} /><p>Hãy nhập dữ liệu hợp lệ để xem lời giải từng bước.</p></div></Panel>
  }

  const visibleSteps = showAll ? steps : [steps[index]]
  return (
    <Panel className="step-panel">
      <div className="panel-heading">
        <div><span className="eyebrow">LỜI GIẢI CÓ HƯỚNG DẪN</span><h2>Đi từng bước một</h2></div>
        <button className={`toggle-button ${showAll ? 'active' : ''}`} onClick={() => setShowAll(!showAll)}>{showAll ? 'Xem từng bước' : 'Xem toàn bộ'}</button>
      </div>
      <div className="steps-list">
        {visibleSteps.map((step, visibleIndex) => (
          <article className="step-card" key={step.title}>
            <div className="step-number">{showAll ? steps.indexOf(step) + 1 : index + 1}</div>
            <div className="step-content">
              <div className="step-title-row"><h3>{step.title}</h3>{!showAll && <span>{index + 1} / {steps.length}</span>}</div>
              <div className="math-block"><BlockMath math={step.formula} /></div>
              <div className="why-note"><strong>Vì sao làm vậy?</strong><p>{step.reason}</p></div>
            </div>
          </article>
        ))}
      </div>
      {!showAll && <div className="step-controls">
        <button className="button button-outline" onClick={() => setIndex(Math.max(0, index - 1))} disabled={index === 0}><ArrowLeft size={16} /> Trước</button>
        <div className="step-dots">{steps.map((step, i) => <button key={step.title} aria-label={`Bước ${i + 1}`} onClick={() => setIndex(i)} className={index === i ? 'selected' : ''} />)}</div>
        <button className="button button-primary" onClick={() => setIndex(Math.min(steps.length - 1, index + 1))} disabled={index === steps.length - 1}>Tiếp <ArrowRight size={16} /></button>
      </div>}
    </Panel>
  )
}
