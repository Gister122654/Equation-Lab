const EPSILON = 1e-9
export const MAX_REALISTIC_SPEED = 300

const numberFrom = (value) => {
  if (typeof value === 'string' && value.trim() === '') return NaN
  return Number(value)
}

const clean = (value) => (Math.abs(value) < EPSILON ? 0 : value)

export const formatNumber = (value, digits = 3) => {
  if (!Number.isFinite(value)) return 'không xác định'
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: digits }).format(clean(value))
}

export const formatMathNumber = (value, digits = 3) => {
  if (!Number.isFinite(value)) return '0'
  return clean(value).toFixed(digits).replace(/\.?0+$/, '')
}

export const positionAt = (vehicle, time) => {
  const start = numberFrom(vehicle.position)
  const departure = numberFrom(vehicle.departure)
  const speed = numberFrom(vehicle.speed)
  const direction = numberFrom(vehicle.direction)
  if (time < departure) return start
  return start + direction * speed * (time - departure)
}

function invalidResult(errors, warnings = []) {
  return { status: 'invalid', errors, warnings, solution: null }
}

/**
 * Lập phương trình từ tọa độ có hướng:
 * p1 + d1*v1*(t - h1) = p2 + d2*v2*(t - h2), với t >= giờ khởi hành.
 */
export function solveMotion(problem) {
  const distance = numberFrom(problem.distance)
  const vehicles = [problem.vehicle1, problem.vehicle2]
  const errors = []
  const warnings = []

  if (!Number.isFinite(distance) || distance <= 0) {
    errors.push('Quãng đường AB phải là một số lớn hơn 0.')
  }

  vehicles.forEach((vehicle, index) => {
    const label = vehicle.name?.trim() || `Phương tiện ${index + 1}`
    const speed = numberFrom(vehicle.speed)
    const departure = numberFrom(vehicle.departure)
    const position = numberFrom(vehicle.position)
    const direction = numberFrom(vehicle.direction)

    if (!Number.isFinite(speed) || speed <= 0) errors.push(`${label}: vận tốc phải là số lớn hơn 0.`)
    else if (speed > MAX_REALISTIC_SPEED) warnings.push(`${label}: ${formatNumber(speed)} km/h rất cao; hãy kiểm tra lại dữ liệu.`)
    if (!Number.isFinite(departure) || departure < 0) errors.push(`${label}: giờ xuất phát phải là số không âm (giờ tính từ mốc 0).`)
    if (!Number.isFinite(position) || position < 0 || (Number.isFinite(distance) && position > distance)) {
      errors.push(`${label}: vị trí xuất phát phải nằm trong đoạn AB.`)
    }
    if (![1, -1].includes(direction)) errors.push(`${label}: hãy chọn chiều A → B hoặc B → A.`)
  })

  if (errors.length) return invalidResult(errors, warnings)

  const [first, second] = vehicles
  const v1 = numberFrom(first.speed)
  const v2 = numberFrom(second.speed)
  const h1 = numberFrom(first.departure)
  const h2 = numberFrom(second.departure)
  const p1 = numberFrom(first.position)
  const p2 = numberFrom(second.position)
  const d1 = numberFrom(first.direction)
  const d2 = numberFrom(second.direction)
  if (problem.type === 'opposite' && d1 === d2) {
    warnings.push('Dạng bài đang chọn là đi ngược chiều nhưng hai xe cùng hướng; hãy kiểm tra lại chiều chuyển động.')
  } else if (problem.type === 'chase' && d1 !== d2) {
    warnings.push('Dạng bài đang chọn là đuổi kịp nhưng hai xe ngược hướng; hãy kiểm tra lại chiều chuyển động.')
  } else if (problem.type === 'staggered' && Math.abs(h1 - h2) < EPSILON) {
    warnings.push('Dạng bài đang chọn là xuất phát lệch giờ nhưng hai giờ xuất phát đang bằng nhau.')
  }
  const coefficient = d1 * v1 - d2 * v2
  const constant = p2 - p1 + d1 * v1 * h1 - d2 * v2 * h2
  const lowerTime = Math.max(h1, h2)
  const routeTime1 = h1 + (d1 === 1 ? distance - p1 : p1) / v1
  const routeTime2 = h2 + (d2 === 1 ? distance - p2 : p2) / v2
  const sharedRouteEnd = Math.min(routeTime1, routeTime2)
  if (![coefficient, constant, lowerTime, routeTime1, routeTime2].every(Number.isFinite)) {
    return invalidResult(['Dữ liệu quá lớn hoặc quá nhỏ để tính ổn định; hãy nhập các giá trị thực tế hơn.'], warnings)
  }
  const equation = {
    coefficient: clean(coefficient),
    constant: clean(constant),
    latex: `${formatMathNumber(coefficient)}t = ${formatMathNumber(constant)}`,
  }

  if (Math.abs(coefficient) < EPSILON) {
    if (Math.abs(constant) < EPSILON) {
      if (sharedRouteEnd < lowerTime - EPSILON) {
        return {
          status: 'no_meeting',
          warnings: [...warnings, 'Hai xe không có khoảng thời gian cùng ở trên đoạn AB.'],
          equation,
          solution: null,
        }
      }
      if (Math.abs(sharedRouteEnd - lowerTime) < EPSILON) {
        const meetingPosition = positionAt(first, lowerTime)
        const otherPosition = positionAt(second, lowerTime)
        return {
          status: 'met',
          equation,
          solution: { time: clean(lowerTime), position: clean(meetingPosition), otherPosition: clean(otherPosition) },
          warnings,
          condition: `t ≥ ${formatNumber(lowerTime)} giờ; 0 ≤ s ≤ ${formatNumber(distance)} km`,
          check: {
            firstPosition: meetingPosition,
            secondPosition: otherPosition,
            residual: Math.abs(meetingPosition - otherPosition),
            equationLeft: coefficient * lowerTime,
            equationRight: constant,
          },
        }
      }
      return {
        status: 'infinite',
        warnings: [...warnings, 'Hai phương trình vị trí trùng nhau; hai xe ở cùng vị trí trong toàn bộ khoảng thời gian cùng chuyển động trên AB.'],
        equation,
        solution: null,
        condition: `t ∈ [${formatNumber(lowerTime)}, ${formatNumber(sharedRouteEnd)}] giờ`,
      }
    }
    const chaseWarning = d1 === d2 && Math.abs(v1 - v2) < EPSILON
    return {
      status: 'no_solution',
      warnings: [
        ...warnings,
        chaseWarning
          ? 'Hai xe cùng chiều và cùng vận tốc nhưng không xuất phát cùng vị trí: khoảng cách không đổi nên không gặp nhau.'
          : 'Hai đường biểu diễn vị trí song song, vì vậy không có thời điểm hai xe gặp nhau.',
      ],
      equation,
      solution: null,
    }
  }

  const time = constant / coefficient
  const meetingPosition = positionAt(first, time)
  const otherPosition = positionAt(second, time)
  if (![time, meetingPosition, otherPosition].every(Number.isFinite)) {
    return invalidResult(['Không thể tính nghiệm hữu hạn từ dữ liệu này; hãy giảm các giá trị đầu vào.'], warnings)
  }
  const solution = { time: clean(time), position: clean(meetingPosition), otherPosition: clean(otherPosition) }
  const reasons = []

  if (time < lowerTime - EPSILON) reasons.push('Nghiệm xảy ra trước khi cả hai xe cùng bắt đầu chuyển động.')
  if (time < -EPSILON) reasons.push('Thời điểm gặp âm, nằm trước mốc thời gian bắt đầu.')
  if (meetingPosition < -EPSILON || meetingPosition > distance + EPSILON) {
    reasons.push('Vị trí gặp nằm ngoài đoạn đường AB.')
  }
  if (time > routeTime1 + EPSILON || time > routeTime2 + EPSILON) {
    reasons.push('Một xe đã đi ra khỏi đoạn AB trước thời điểm nghiệm.')
  }
  if (Math.abs(meetingPosition - otherPosition) > 1e-6) {
    reasons.push('Thay nghiệm vào hai biểu thức vị trí không cho cùng kết quả; hãy kiểm tra dữ liệu.')
  }

  const sameDirection = d1 === d2
  const firstPositionAtStart = positionAt(first, lowerTime)
  const secondPositionAtStart = positionAt(second, lowerTime)
  const follower = sameDirection
    ? (d1 === 1
      ? (firstPositionAtStart <= secondPositionAtStart ? first : second)
      : (firstPositionAtStart >= secondPositionAtStart ? first : second))
    : null
  if (sameDirection && follower) {
    const leader = follower === first ? second : first
    if (numberFrom(follower.speed) <= numberFrom(leader.speed) && Math.abs(firstPositionAtStart - secondPositionAtStart) > EPSILON) {
      warnings.push('Xe phía sau chạy chậm hơn hoặc bằng xe phía trước nên không thể đuổi kịp trên đoạn đường này.')
    }
  }

  if (reasons.length) {
    return {
      status: 'no_meeting',
      equation,
      solution,
      warnings: [...warnings, ...reasons],
      condition: `t ≥ ${formatNumber(lowerTime)} giờ; 0 ≤ s ≤ ${formatNumber(distance)} km`,
    }
  }

  return {
    status: 'met',
    equation,
    solution,
    warnings,
    condition: `t ≥ ${formatNumber(lowerTime)} giờ; 0 ≤ s ≤ ${formatNumber(distance)} km`,
    check: {
      firstPosition: positionAt(first, time),
      secondPosition: positionAt(second, time),
      residual: Math.abs(meetingPosition - otherPosition),
      equationLeft: coefficient * time,
      equationRight: constant,
    },
  }
}

export function getSolutionSteps(problem, result) {
  if (result.status !== 'met') return []
  const [first, second] = [problem.vehicle1, problem.vehicle2]
  const f = formatNumber
  const fm = formatMathNumber
  const t = result.solution.time
  const position = result.solution.position
  const v1 = numberFrom(first.speed)
  const v2 = numberFrom(second.speed)
  const p1 = numberFrom(first.position)
  const p2 = numberFrom(second.position)
  const d1 = numberFrom(first.direction)
  const d2 = numberFrom(second.direction)
  const h1 = numberFrom(first.departure)
  const h2 = numberFrom(second.departure)
  if (Math.abs(result.equation.coefficient) < EPSILON) {
    return [
      {
        title: 'Đặt ẩn và điều kiện',
        formula: `t\\ge${fm(Math.max(h1, h2))}\\;\\text{(h)},\\qquad 0\\le s\\le${fm(Number(problem.distance))}\\;\\text{(km)}`,
        reason: 'Chỉ xét thời gian cả hai xe cùng bắt đầu chuyển động và vị trí còn thuộc đoạn AB.',
      },
      {
        title: 'Biểu diễn vị trí',
        formula: `s_1=${fm(p1)}${d1 === 1 ? '+' : '-'}${fm(v1)}(t-${fm(h1)}),\\qquad s_2=${fm(p2)}${d2 === 1 ? '+' : '-'}${fm(v2)}(t-${fm(h2)})`,
        reason: 'Từ t=s/v suy ra quãng đường bằng vận tốc nhân thời gian; dấu của v thể hiện chiều chuyển động.',
      },
      {
        title: 'Lập phương trình gặp nhau',
        formula: `s_1=s_2\\quad\\Longrightarrow\\quad ${result.equation.latex}`,
        reason: 'Hai biểu thức vị trí trùng nhau trên toàn đường thẳng nên phương trình rút gọn thành một đồng nhất thức.',
      },
      {
        title: 'Giao miền chuyển động',
        formula: `t=${fm(t)}\\;\\text{(h)}`,
        reason: 'Dù phương trình có dạng 0=0, hai xe chỉ cùng ở trên đoạn AB tại đúng thời điểm biên t = ' + f(t) + ' giờ.',
      },
      {
        title: 'Xác định vị trí gặp',
        formula: `s_1(${fm(t)})=${fm(result.check.firstPosition)}\\;\\text{km}=s_2(${fm(t)})`,
        reason: `Hai xe gặp tại vị trí ${f(position)} km tính từ A, thuộc đoạn AB.`,
      },
      {
        title: 'Thử lại và kết luận',
        formula: `${fm(result.check.equationLeft)}=${fm(result.check.equationRight)},\\qquad s_1=s_2`,
        reason: 'Phương trình và hai vị trí đều khớp; nghiệm được xác định duy nhất nhờ miền chuyển động chung chỉ có một thời điểm.',
      },
    ]
  }
  const steps = [
    {
      title: 'Đặt ẩn và điều kiện',
      formula: `t \\ge ${fm(Math.max(h1, h2))}\\;\\text{(h)},\\qquad 0\\le s\\le ${fm(Number(problem.distance))}\\;\\text{(km)}`,
      reason: 'Chọn t là thời gian tính từ mốc 0. Thời điểm gặp phải sau khi cả hai xe xuất phát và vị trí gặp phải thuộc đoạn AB.',
    },
    {
      title: 'Biểu diễn vị trí',
      formula: `s_1=${fm(p1)}${d1 === 1 ? '+' : '-'}${fm(v1)}(t-${fm(h1)}),\\qquad s_2=${fm(p2)}${d2 === 1 ? '+' : '-'}${fm(v2)}(t-${fm(h2)})`,
      reason: 'Từ t=s/v suy ra quãng đường bằng vận tốc nhân thời gian. Cộng quãng đường có hướng vào vị trí ban đầu; trước giờ xuất phát xe chưa di chuyển.',
    },
    {
      title: 'Lập phương trình gặp nhau',
      formula: `s_1=s_2\\quad\\Longrightarrow\\quad ${result.equation.latex}`,
      reason: 'Hai xe gặp nhau đúng khi tọa độ của chúng trên trục AB bằng nhau tại cùng một thời điểm.',
    },
    {
      title: 'Khử ngoặc và chuyển vế',
      formula: `${fm(result.equation.coefficient)}t=${fm(result.equation.constant)}`,
      reason: 'Thu gọn hai vế để đưa phương trình về dạng bậc nhất at = b. Chỉ chia cho hệ số của t khi hệ số đó khác 0.',
    },
    {
      title: 'Tìm nghiệm',
      formula: `t=\\frac{${fm(result.equation.constant)}}{${fm(result.equation.coefficient)}}=${fm(t)}\\;\\text{h}`,
      reason: 'Chia hai vế cho hệ số khác 0 của t để tìm thời điểm gặp.',
    },
    {
      title: 'Đối chiếu điều kiện',
      formula: `t=${fm(t)}\\ge ${fm(Math.max(h1, h2))},\\qquad s=${fm(position)}\\in[0,${fm(Number(problem.distance))}]`,
      reason: 'Nghiệm đại số chỉ được nhận nếu thời gian hợp lệ và vị trí gặp nằm trên đoạn AB.',
    },
    {
      title: 'Kết luận và thử lại',
      formula: `s_1(${fm(t)})=${fm(result.check.firstPosition)}\\;\\text{km}=s_2(${fm(t)})`,
      reason: `Hai vế vị trí bằng nhau (sai số ${f(result.check.residual, 8)} km), nên ${first.name} và ${second.name} gặp nhau tại t = ${f(t)} giờ, vị trí s = ${f(position)} km tính từ A.`,
    },
  ]
  return steps
}
