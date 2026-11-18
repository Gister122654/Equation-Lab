export default function VehicleIllustration({ className = '', direction = 1, vehicleName = 'Phương tiện' }) {
  const facingLeft = Number(direction) === -1

  return (
    <svg
      className={`vehicle-illustration ${facingLeft ? 'facing-left' : ''} ${className}`}
      viewBox="0 0 144 84"
      role="img"
      aria-label={`${vehicleName}, hướng ${facingLeft ? 'B đến A' : 'A đến B'}`}
    >
      <ellipse cx="72" cy="69" rx="54" ry="7" className="vehicle-shadow" />
      <path className="vehicle-body" d="M12 57v-9c0-4 3-7 7-8l13-3 11-19c2-4 6-7 11-7h34c7 0 12 3 17 9l13 17 11 3c5 1 8 5 8 10v7H12Z" />
      <path className="vehicle-window" d="m47 34 8-14c1-2 3-3 6-3h10v17H47Zm30 0V17h10c4 0 7 2 10 5l9 12H77Z" />
      <path className="vehicle-window-glint" d="m53 31 6-10h7v10H53Zm28-10h5c3 0 5 1 7 4l4 6H81V21Z" />
      <path className="vehicle-door" d="M74 38v17h20V38M69 39H45v14h24" />
      <path className="vehicle-trim" d="M18 53h116M16 58h119" />
      <path className="vehicle-light" d="M132 43h8v8h-8z" />
      <path className="vehicle-tail-light" d="M12 44h5v9h-5z" />
      <g className="vehicle-wheel">
        <circle cx="43" cy="58" r="11" className="vehicle-tire" />
        <circle cx="43" cy="58" r="5" className="vehicle-rim" />
        <path d="M43 54v8m-4-4h8" className="vehicle-spokes" />
      </g>
      <g className="vehicle-wheel">
        <circle cx="111" cy="58" r="11" className="vehicle-tire" />
        <circle cx="111" cy="58" r="5" className="vehicle-rim" />
        <path d="M111 54v8m-4-4h8" className="vehicle-spokes" />
      </g>
    </svg>
  )
}
