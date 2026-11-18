import { AlertTriangle, ArrowLeftRight, Sparkles } from 'lucide-react'
import { presets } from '../data/presets.js'

const directionOptions = [
  { value: '1', label: 'A → B' },
  { value: '-1', label: 'B → A' },
]

function Field({ label, value, onChange, type = 'number', suffix, min, step = 'any', placeholder }) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className="input-wrap">
        <input type={type} value={value} onChange={onChange} min={min} step={step} placeholder={placeholder} />
        {suffix && <small>{suffix}</small>}
      </div>
    </label>
  )
}

function VehicleFields({ index, vehicle, onChange }) {
  const label = `Phương tiện ${index + 1}`
  return (
    <div className="vehicle-card">
      <div className="vehicle-card-title">
        <span className={`vehicle-dot vehicle-dot-${index + 1}`} />
        <h3>{label}</h3>
      </div>
      <Field label="Tên phương tiện" type="text" value={vehicle.name} placeholder="Ví dụ: Xe khách" onChange={(e) => onChange('name', e.target.value)} />
      <div className="form-grid">
        <Field label="Vận tốc" value={vehicle.speed} min="0" suffix="km/h" onChange={(e) => onChange('speed', e.target.value)} />
        <Field label="Giờ xuất phát" value={vehicle.departure} min="0" suffix="giờ" onChange={(e) => onChange('departure', e.target.value)} />
        <Field label="Vị trí xuất phát" value={vehicle.position} min="0" suffix="km từ A" onChange={(e) => onChange('position', e.target.value)} />
        <label className="field">
          <span>Chiều chuyển động</span>
          <select value={vehicle.direction} onChange={(e) => onChange('direction', e.target.value)}>
            {directionOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
      </div>
    </div>
  )
}

export default function ProblemForm({ problem, onChange, result }) {
  const updateVehicle = (index, key, value) => {
    const vehicleKey = index === 0 ? 'vehicle1' : 'vehicle2'
    onChange({ ...problem, [vehicleKey]: { ...problem[vehicleKey], [key]: value } })
  }

  return (
    <div className="form-layout">
      <div className="form-toolbar">
        <label className="field form-type">
          <span>Dạng chuyển động</span>
          <select value={problem.type} onChange={(e) => onChange({ ...problem, type: e.target.value })}>
            <option value="opposite">Hai xe đi ngược chiều</option>
            <option value="chase">Cùng chiều – đuổi kịp</option>
            <option value="staggered">Xuất phát lệch giờ</option>
          </select>
        </label>
        <div className="preset-picker">
          <Sparkles size={16} />
          <select aria-label="Chọn đề mẫu" defaultValue="" onChange={(e) => {
            const preset = presets[Number(e.target.value)]
            if (preset) onChange(structuredClone(preset.problem))
          }}>
            <option value="" disabled>Chọn đề mẫu</option>
            {presets.map((preset, index) => <option key={preset.label} value={index}>{preset.label}</option>)}
          </select>
        </div>
      </div>
      <div className="distance-row">
        <div className="distance-icon"><ArrowLeftRight size={18} /></div>
        <Field label="Độ dài đoạn đường AB" value={problem.distance} min="0" suffix="km" onChange={(e) => onChange({ ...problem, distance: e.target.value })} />
        <div className="route-mini"><span>A</span><i /><span>B</span></div>
      </div>
      <div className="vehicle-grid">
        <VehicleFields index={0} vehicle={problem.vehicle1} onChange={(key, value) => updateVehicle(0, key, value)} />
        <VehicleFields index={1} vehicle={problem.vehicle2} onChange={(key, value) => updateVehicle(1, key, value)} />
      </div>
      {result?.errors?.length > 0 && (
        <div className="alert alert-error">
          <AlertTriangle size={18} />
          <div><strong>Hãy kiểm tra dữ liệu</strong>{result.errors.map((error) => <p key={error}>{error}</p>)}</div>
        </div>
      )}
      {result?.warnings?.length > 0 && (
        <div className="alert alert-warning">
          <AlertTriangle size={18} />
          <div><strong>Lưu ý</strong>{result.warnings.map((warning) => <p key={warning}>{warning}</p>)}</div>
        </div>
      )}
    </div>
  )
}
