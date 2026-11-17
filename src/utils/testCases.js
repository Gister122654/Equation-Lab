import { solveMotion } from './solver.js'

const create = (name, speed, departure, position, direction) => ({ name, speed, departure, position, direction })

export const testCases = [
  {
    id: 'T01',
    title: 'Hai xe ngược chiều gặp nhau',
    input: { distance: 180, vehicle1: create('Xe A', 60, 0, 0, 1), vehicle2: create('Xe B', 30, 0, 180, -1) },
    expected: 'met',
    explanation: 'Tổng vận tốc là 90 km/h; hai xe gặp sau 2 giờ tại km 120.',
  },
  {
    id: 'T02',
    title: 'Cùng chiều, xe sau nhanh hơn',
    input: { distance: 120, vehicle1: create('Xe trước', 40, 0, 30, 1), vehicle2: create('Xe sau', 70, 0, 0, 1) },
    expected: 'met',
    explanation: 'Vận tốc tương đối 30 km/h; khoảng cách đầu 30 km nên gặp sau 1 giờ.',
  },
  {
    id: 'T03',
    title: 'Xe thứ hai xuất phát muộn',
    input: { distance: 200, vehicle1: create('Xe sớm', 50, 0, 0, 1), vehicle2: create('Xe muộn', 75, 1, 0, 1) },
    expected: 'met',
    explanation: 'Tính theo mốc chung, xe nhanh xuất phát sau 1 giờ và đuổi kịp tại km 150.',
  },
  {
    id: 'T04',
    title: 'Nghiệm gặp trước giờ xe thứ hai đi',
    input: { distance: 100, vehicle1: create('Xe A', 40, 0, 0, 1), vehicle2: create('Xe B', 20, 2, 50, -1) },
    expected: 'no_meeting',
    explanation: 'Giao điểm của hai biểu thức kéo dài nằm trước giờ xe B xuất phát nên không phải nghiệm vật lí.',
  },
  {
    id: 'T05',
    title: 'Cùng chiều và cùng vận tốc, khác vị trí',
    input: { distance: 100, vehicle1: create('Xe A', 50, 0, 0, 1), vehicle2: create('Xe B', 50, 0, 20, 1) },
    expected: 'no_solution',
    explanation: 'Hai đường vị trí song song và khoảng cách không đổi.',
  },
  {
    id: 'T06',
    title: 'Hai xe ở cùng vị trí, cùng quỹ đạo',
    input: { distance: 100, vehicle1: create('Xe A', 40, 0, 0, 1), vehicle2: create('Xe B', 40, 0, 0, 1) },
    expected: 'infinite',
    explanation: 'Hai phương trình vị trí trùng nhau, không có một thời điểm gặp duy nhất.',
  },
  {
    id: 'T07',
    title: 'Xe đuổi chạy chậm hơn',
    input: { distance: 100, vehicle1: create('Xe trước', 60, 0, 20, 1), vehicle2: create('Xe sau', 40, 0, 0, 1) },
    expected: 'no_meeting',
    explanation: 'Xe sau chậm hơn xe trước; giao điểm đại số nằm ngoài đoạn đường.',
  },
  {
    id: 'T08',
    title: 'Vận tốc bằng 0 (dữ liệu sai)',
    input: { distance: 100, vehicle1: create('Xe A', 0, 0, 0, 1), vehicle2: create('Xe B', 30, 0, 100, -1) },
    expected: 'invalid',
    explanation: 'Vận tốc phải dương để mô tả phương tiện chuyển động và dùng t = s/v.',
  },
  {
    id: 'T09',
    title: 'Quãng đường âm (dữ liệu sai)',
    input: { distance: -10, vehicle1: create('Xe A', 20, 0, 0, 1), vehicle2: create('Xe B', 30, 0, 10, -1) },
    expected: 'invalid',
    explanation: 'Độ dài đoạn đường AB phải là số dương.',
  },
  {
    id: 'T10',
    title: 'Vận tốc vượt ngưỡng thực tế',
    input: { distance: 1000, vehicle1: create('Xe A', 400, 0, 0, 1), vehicle2: create('Xe B', 300, 0, 1000, -1) },
    expected: 'met_with_warning',
    explanation: 'Phương trình vẫn có nghiệm nhưng vận tốc trên 300 km/h được cảnh báo để kiểm tra dữ liệu.',
  },
  {
    id: 'T11',
    title: 'Vị trí xuất phát ngoài AB',
    input: { distance: 100, vehicle1: create('Xe A', 20, 0, 101, 1), vehicle2: create('Xe B', 30, 0, 100, -1) },
    expected: 'invalid',
    explanation: 'Vị trí ban đầu phải thuộc đoạn [0, AB].',
  },
  {
    id: 'T12',
    title: 'Thời gian khởi hành âm',
    input: { distance: 100, vehicle1: create('Xe A', 20, -1, 0, 1), vehicle2: create('Xe B', 30, 0, 100, -1) },
    expected: 'invalid',
    explanation: 'Giờ xuất phát âm không phù hợp quy ước mốc thời gian 0 của bài toán.',
  },
  {
    id: 'T13',
    title: 'Hai xe trùng quỹ đạo tại điểm B',
    input: { distance: 100, vehicle1: create('Xe A', 10, 0, 0, 1), vehicle2: create('Xe B', 10, 10, 100, 1) },
    expected: 'met',
    explanation: 'Hai quỹ đạo trùng nhau nhưng chỉ cùng ở trên AB tại t=10 giờ, đúng tại điểm B.',
  },
]

export function runTestCase(testCase) {
  const result = solveMotion(testCase.input)
  const actual = result.status === 'met' && result.warnings.length ? 'met_with_warning' : result.status
  return { ...testCase, result, actual, passed: actual === testCase.expected }
}
