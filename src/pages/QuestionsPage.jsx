import { useState } from 'react'
import { BookOpenCheck, Check, Lightbulb, Send } from 'lucide-react'
import Panel from '../components/Panel.jsx'
import { guidingQuestions } from '../data/questions.js'

export default function QuestionsPage() {
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState({})

  const checkAnswer = (index, keywords) => {
    const answer = (answers[index] || '').toLocaleLowerCase('vi')
    const hits = keywords.filter((keyword) => answer.includes(keyword.toLocaleLowerCase('vi'))).length
    setChecked((previous) => ({ ...previous, [index]: hits }))
  }

  return <div className="page-stack">
    <div className="page-title"><div><span className="eyebrow">TỰ GIẢI THÍCH · TỰ KIỂM CHỨNG</span><h1>Các câu hỏi dẫn dắt</h1><p>Hãy diễn đạt bằng lời của mình, sau đó đối chiếu với gợi ý toán học.</p></div><div className="page-title-mark"><BookOpenCheck size={23} /><span>Học chủ động</span></div></div>
    <Panel className="question-intro"><div className="question-intro-icon"><Lightbulb size={22} /></div><div><h2>Toán học không chỉ là tìm đáp số.</h2><p>Hãy giải thích vì sao mỗi bước hợp lí. Ứng dụng so khớp từ khóa để gợi ý những ý chính — đây là phản hồi học tập, không phải đánh giá năng lực.</p></div></Panel>
    <div className="question-list">{guidingQuestions.map((item, index) => {
      const score = checked[index]
      return <Panel className="question-card" key={item.question}>
        <div className="question-number">CÂU HỎI {String(index + 1).padStart(2, '0')}</div>
        <h2>{item.question}</h2>
        <label className="field answer-field"><span>Câu trả lời của em</span><textarea rows="3" placeholder="Viết suy nghĩ của em ở đây..." value={answers[index] || ''} onChange={(event) => { setAnswers((previous) => ({ ...previous, [index]: event.target.value })); setChecked((previous) => ({ ...previous, [index]: undefined })) }} /></label>
        <button className="button button-outline" onClick={() => checkAnswer(index, item.keywords)} disabled={!answers[index]?.trim()}><Send size={15} /> So sánh với lời giải</button>
        {score !== undefined && <div className={`answer-feedback ${score >= Math.ceil(item.keywords.length * 0.6) ? 'feedback-good' : 'feedback-hint'}`}>
          {score >= Math.ceil(item.keywords.length * 0.6) ? <Check size={17} /> : <Lightbulb size={17} />}
          <div><strong>{score >= Math.ceil(item.keywords.length * 0.6) ? 'Em đã nêu được ý chính!' : 'Gợi ý để em suy nghĩ thêm'}</strong><p>{item.answer}</p><small>Từ khóa ý chính: {item.keywords.join(' · ')}</small></div>
        </div>}
      </Panel>
    })}</div>
  </div>
}
