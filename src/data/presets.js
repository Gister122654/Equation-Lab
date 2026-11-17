export const initialProblem = {
  type: 'opposite',
  distance: '180',
  vehicle1: { name: 'Xe khách', speed: '60', departure: '0', position: '0', direction: '1' },
  vehicle2: { name: 'Xe máy', speed: '30', departure: '0', position: '180', direction: '-1' },
}

export const presets = [
  {
    label: 'Hai xe đi ngược chiều',
    problem: {
      type: 'opposite',
      distance: '180',
      vehicle1: { name: 'Xe khách', speed: '60', departure: '0', position: '0', direction: '1' },
      vehicle2: { name: 'Xe máy', speed: '30', departure: '0', position: '180', direction: '-1' },
    },
  },
  {
    label: 'Cùng chiều – đuổi kịp',
    problem: {
      type: 'chase',
      distance: '120',
      vehicle1: { name: 'Xe trước', speed: '40', departure: '0', position: '30', direction: '1' },
      vehicle2: { name: 'Xe đuổi', speed: '70', departure: '0', position: '0', direction: '1' },
    },
  },
  {
    label: 'Xuất phát lệch giờ',
    problem: {
      type: 'staggered',
      distance: '200',
      vehicle1: { name: 'Xe xuất phát sớm', speed: '50', departure: '0', position: '0', direction: '1' },
      vehicle2: { name: 'Xe xuất phát muộn', speed: '75', departure: '1', position: '0', direction: '1' },
    },
  },
]
