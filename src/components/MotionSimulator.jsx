import { useEffect, useMemo, useState } from 'react'
import { Pause, Play, RotateCcw, Timer } from 'lucide-react'
import Panel from './Panel.jsx'
import { formatNumber, positionAt } from '../utils/solver.js'

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

export default function MotionSimulator({ problem, result }) {
  const [time, setTime] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speedMultiplier, setSpeedMultiplier] = useState(1)
  const distance = Number(problem.distance)
  const maxTime = useMemo(() => {
    const routeEnds = [problem.vehicle1, problem.vehicle2].map((vehicle) => {
      const pos = Number(vehicle.position)
      const direction = Number(vehicle.direction)
      const speed = Number(vehicle.speed)
      return Number(vehicle.departure) + (direction === 1 ? distance - pos : pos) / speed
    }).filter(Number.isFinite)
    return clamp(Math.max(2, ...(routeEnds.length ? routeEnds : [2]), ...(result.status === 'met' ? [result.solution.time + 0.5] : [])), 0.1, 48)
  }, [distance, problem, result])

  useEffect(() => {
    if (!playing) return undefined
    const interval = window.setInterval(() => {
      setTime((current) => {
        const next = current + 0.01 * speedMultiplier
        if (next >= maxTime) {
          setPlaying(false)
          return maxTime
        }
        return next
      })
    }, 50)
    return () => window.clearInterval(interval)
  }, [playing, speedMultiplier, maxTime])

  useEffect(() => {
    setTime(0)
    setPlaying(false)
  }, [problem])

  if (result.status === 'invalid' || !Number.isFinite(distance) || distance <= 0) {
    return <Panel><div className="empty-state"><Timer size={22} /><p>Nhập dữ liệu hợp lệ để mô phỏng chuyển động trên AB.</p></div></Panel>
  }

  const cars = [problem.vehicle1, problem.vehicle2].map((vehicle, index) => {
    const raw = positionAt(vehicle, time)
    return { vehicle, index, position: clamp(raw, 0, distance), waiting: time < Number(vehicle.departure), offRoad: raw < 0 || raw > distance }
  })
  const gap = Math.abs(positionAt(problem.vehicle1, time) - positionAt(problem.vehicle2, time))
  const roadStart = 8
  const roadWidth = 84

  return (
    <Panel className="simulation-panel">
      <div className="panel-heading">
        <div><span className="eyebrow">MÔ PHỎNG THỜI GIAN THỰC</span><h2>Chuyển động trên đoạn AB</h2></div>
        <span className="unit-chip">{speedMultiplier}× tốc độ</span>
      </div>
      <div className="road-scene">
        <div className="road-label road-label-a">A · 0 km</div>
        <div className="road-label road-label-b">B · {formatNumber(distance)} km</div>
        <div className="road-line"><span className="road-dashes" /></div>
        {cars.map(({ vehicle, index, position, waiting, offRoad }) => {
          const x = roadStart + (position / distance) * roadWidth
          return <div key={index} className={`vehicle-marker marker-${index + 1}`} style={{ left: `${x}%` }}>
            <div className="car-icon">{index === 0 ? '🚙' : '🚗'}</div>
            <span>{vehicle.name || `Xe ${index + 1}`}</span>
            {waiting && <small>chưa xuất phát</small>}
            {!waiting && offRoad && <small>ngoài AB</small>}
          </div>
        })}
        <div className="road-post post-a" /><div className="road-post post-b" />
      </div>
      <div className="time-readout"><Timer size={16} /><span>Thời gian mô phỏng</span><strong>{formatNumber(time)} giờ</strong></div>
      <input aria-label="Thanh trượt thời gian mô phỏng" className="time-slider" type="range" min="0" max={maxTime} step={Math.max(maxTime / 1000, 0.001)} value={time} onChange={(event) => { setTime(Number(event.target.value)); setPlaying(false) }} />
      <div className="slider-labels"><span>0 giờ</span><span>{formatNumber(maxTime)} giờ</span></div>
      <div className="sim-bottom">
        <div className="sim-controls">
          <button className="button button-primary" onClick={() => { if (time >= maxTime) setTime(0); setPlaying(!playing) }}><>{playing ? <Pause size={16} /> : <Play size={16} />}{playing ? 'Tạm dừng' : 'Phát'}</></button>
          <button className="icon-button" aria-label="Đặt lại mô phỏng" onClick={() => { setPlaying(false); setTime(0) }}><RotateCcw size={17} /></button>
          <label className="speed-select"><span>Tốc độ</span><select value={speedMultiplier} onChange={(event) => setSpeedMultiplier(Number(event.target.value))}><option value="0.5">0.5×</option><option value="1">1×</option><option value="2">2×</option></select></label>
        </div>
        <div className="live-stats">
          {cars.map(({ vehicle, index, position, waiting }) => <div key={index}><span className={`vehicle-dot vehicle-dot-${index + 1}`} /><small>{vehicle.name}</small><strong>{formatNumber(position)} km{waiting ? ' · chờ' : ''}</strong></div>)}
          <div className="gap-stat"><small>Khoảng cách</small><strong>{formatNumber(gap)} km</strong></div>
        </div>
      </div>
    </Panel>
  )
}
