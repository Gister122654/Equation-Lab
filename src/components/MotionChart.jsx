import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceDot } from 'recharts'
import Panel from './Panel.jsx'
import { formatNumber, positionAt } from '../utils/solver.js'

export default function MotionChart({ problem, result }) {
  const distance = Number(problem.distance)
  const vehicles = [problem.vehicle1, problem.vehicle2]
  const departures = vehicles.map((vehicle) => Number(vehicle.departure)).filter(Number.isFinite)
  const routeEnds = vehicles.map((vehicle) => {
    const position = Number(vehicle.position)
    const direction = Number(vehicle.direction)
    const speed = Number(vehicle.speed)
    return Number(vehicle.departure) + (direction === 1 ? distance - position : position) / speed
  }).filter(Number.isFinite)
  const completeRouteEnd = Math.max(0.5, ...departures, ...routeEnds)
  const maximum = result.status === 'met'
    ? Math.max(result.solution.time * 1.15, ...departures, 0.5)
    : completeRouteEnd * 1.05
  const data = Array.from({ length: 41 }, (_, index) => {
    const time = (maximum * index) / 40
    const value = { time }
    ;[problem.vehicle1, problem.vehicle2].forEach((vehicle, vehicleIndex) => {
      const start = Number(vehicle.position)
      const departure = Number(vehicle.departure)
      const position = positionAt(vehicle, time)
      const onRoad = time < departure || (position >= 0 && position <= distance)
      value[`vehicle${vehicleIndex + 1}`] = onRoad ? position : null
      if (time < departure) value[`vehicle${vehicleIndex + 1}`] = start
    })
    return value
  })
  const meetingPoint = result.status === 'met' ? result.solution : null

  return (
    <Panel>
      <div className="panel-heading">
        <div><span className="eyebrow">ĐỒ THỊ ĐỘ DỊCH CHUYỂN – THỜI GIAN</span><h2>Hai hành trình trên cùng hệ trục</h2></div>
        <span className="unit-chip">s (km) · t (giờ)</span>
      </div>
      {result.status === 'invalid' ? <div className="chart-placeholder">Nhập dữ liệu hợp lệ để dựng đồ thị chuyển động.</div> :
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={310}>
            <LineChart data={data} margin={{ top: 16, right: 20, left: 0, bottom: 8 }}>
              <CartesianGrid stroke="#243442" strokeDasharray="3 5" />
              <XAxis dataKey="time" type="number" domain={[0, maximum]} tickFormatter={(value) => formatNumber(value, 1)} stroke="#8193a3" tick={{ fill: '#9aabba', fontSize: 11 }} />
              <YAxis domain={[0, Number.isFinite(distance) && distance > 0 ? distance : 'auto']} stroke="#8193a3" tick={{ fill: '#9aabba', fontSize: 11 }} tickFormatter={(value) => formatNumber(value, 0)} />
              <Tooltip contentStyle={{ background: '#101d29', border: '1px solid #2a3c4b', borderRadius: 12, color: '#edf4f8' }} labelFormatter={(value) => `t = ${formatNumber(Number(value))} giờ`} formatter={(value, name) => [`${formatNumber(Number(value))} km`, name]} />
              <Legend wrapperStyle={{ color: '#bdcbd5', fontSize: 12 }} />
              <Line type="linear" dataKey="vehicle1" name={problem.vehicle1.name || 'Phương tiện 1'} stroke="#43d6b2" strokeWidth={2.5} dot={false} connectNulls={false} />
              <Line type="linear" dataKey="vehicle2" name={problem.vehicle2.name || 'Phương tiện 2'} stroke="#ffb45c" strokeWidth={2.5} dot={false} connectNulls={false} />
              {meetingPoint && <ReferenceDot x={meetingPoint.time} y={meetingPoint.position} r={6} fill="#f3f5a2" stroke="#101d29" label={{ value: 'Gặp nhau', position: 'top', fill: '#f3f5a2', fontSize: 11 }} />}
            </LineChart>
          </ResponsiveContainer>
        </div>}
      {meetingPoint && <div className="chart-caption"><span className="meeting-pip" /> Giao điểm: t = {formatNumber(meetingPoint.time)} giờ · s = {formatNumber(meetingPoint.position)} km từ A</div>}
    </Panel>
  )
}
