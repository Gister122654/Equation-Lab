import { useMemo, useState } from 'react'
import { Activity, ArrowRight, Atom, BookOpenCheck, FlaskConical, FunctionSquare, Home, Menu, Route, X } from 'lucide-react'
import HomePage from './pages/HomePage.jsx'
import SolverPage from './pages/SolverPage.jsx'
import SimulationPage from './pages/SimulationPage.jsx'
import TestCasesPage from './pages/TestCasesPage.jsx'
import QuestionsPage from './pages/QuestionsPage.jsx'
import { initialProblem } from './data/presets.js'
import { solveMotion } from './utils/solver.js'

const navigation = [
  { id: 'home', label: 'Trang chủ', icon: Home },
  { id: 'solve', label: 'Giải bài toán', icon: FunctionSquare },
  { id: 'simulation', label: 'Mô phỏng', icon: Activity },
  { id: 'tests', label: 'Test Cases', icon: FlaskConical },
  { id: 'questions', label: 'Câu hỏi dẫn dắt', icon: BookOpenCheck },
]

export default function App() {
  const [problem, setProblem] = useState(initialProblem)
  const [page, setPage] = useState('home')
  const [mobileMenu, setMobileMenu] = useState(false)
  const result = useMemo(() => solveMotion(problem), [problem])
  const navigate = (nextPage) => {
    setPage(nextPage)
    setMobileMenu(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const currentPage = {
    home: <HomePage problem={problem} result={result} onNavigate={navigate} />,
    solve: <SolverPage problem={problem} onChange={setProblem} result={result} />,
    simulation: <SimulationPage problem={problem} result={result} />,
    tests: <TestCasesPage />,
    questions: <QuestionsPage />,
  }[page]

  return <div className="app-shell">
    <div className="math-background" aria-hidden="true"><span>∑</span><span>π</span><span>Δx</span><span>∫</span><span>v = s/t</span><span>θ</span><span>√</span><span>ΣF</span><span>ax + b</span><span>λ</span><span>∴</span></div>
    <header className="topbar">
      <button className="brand" onClick={() => navigate('home')} aria-label="Về trang chủ"><span className="brand-symbol"><Atom size={21} /></span><span><strong>AI MOTION</strong><small>EQUATION LAB</small></span></button>
      <nav className="desktop-nav" aria-label="Điều hướng chính">{navigation.map(({ id, label, icon: Icon }) =>
        <button key={id} onClick={() => navigate(id)} className={page === id ? 'nav-item active' : 'nav-item'}><Icon size={15} />{label}</button>
      )}</nav>
      <div className="topbar-right"><span className="online-indicator"><i /> LAB SẴN SÀNG</span><button className="mobile-menu-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label={mobileMenu ? 'Đóng menu' : 'Mở menu'}>{mobileMenu ? <X /> : <Menu />}</button></div>
      {mobileMenu && <nav className="mobile-nav">{navigation.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => navigate(id)} className={page === id ? 'active' : ''}><Icon size={17} />{label}<ArrowRight size={14} /></button>)}</nav>}
    </header>
    <main className="main-content" key={page}>{currentPage}</main>
    <footer className="footer"><div className="footer-brand"><span className="brand-symbol small"><Atom size={16} /></span><span>AI MOTION EQUATION LAB</span></div><p>Một phòng thí nghiệm nhỏ cho những câu hỏi lớn.</p><span className="footer-tag"><Route size={14} /> TOÁN × VẬT LÍ · THCS</span></footer>
  </div>
}
