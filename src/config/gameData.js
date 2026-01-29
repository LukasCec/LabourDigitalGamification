// IG Metall Benefits Configuration
export const BENEFITS = [
  {
    id: 'legal',
    name: 'Legal Protection',
    icon: '⚖️',
    shortDesc: 'Free legal advice',
    description: 'Legal protection in employment and social welfare law',
    color: '#3b82f6',
    points: 50
  },
  {
    id: 'strike',
    name: 'Strike Assistance',
    icon: '✊',
    shortDesc: 'Financial support',
    description: 'Financial support during authorized strikes',
    color: '#ef4444',
    points: 75
  },
  {
    id: 'accident',
    name: 'Accident Insurance',
    icon: '🏥',
    shortDesc: 'Worldwide coverage',
    description: 'Leisure time accident insurance valid worldwide',
    color: '#10b981',
    points: 60
  },
  {
    id: 'emergency',
    name: 'Emergency Aid',
    icon: '🆘',
    shortDesc: 'Financial assistance',
    description: 'Support in extraordinary emergencies',
    color: '#f59e0b',
    points: 65
  },
  {
    id: 'discipline',
    name: 'Disciplinary Protection',
    icon: '🛡️',
    shortDesc: 'Full support',
    description: 'Protection against employer discrimination',
    color: '#8b5cf6',
    points: 55
  },
  {
    id: 'death',
    name: 'Death Benefit',
    icon: '🕊️',
    shortDesc: 'Survivor support',
    description: 'Financial assistance for bereaved families',
    color: '#6b7280',
    points: 70
  }
]

// Obstacles for Office environment
export const OFFICE_OBSTACLES = [
  { id: 'desk', icon: '🪑', name: 'Chair', damage: 1 },
  { id: 'box', icon: '📦', name: 'Box', damage: 1 },
  { id: 'printer', icon: '🖨️', name: 'Printer', damage: 1 },
  { id: 'plant', icon: '🪴', name: 'Plant', damage: 1 },
  { id: 'cabinet', icon: '🗄️', name: 'Cabinet', damage: 2 }
]

// Obstacles for Factory environment
export const FACTORY_OBSTACLES = [
  { id: 'barrel', icon: '🛢️', name: 'Barrel', damage: 1 },
  { id: 'crate', icon: '📦', name: 'Crate', damage: 1 },
  { id: 'forklift', icon: '🚜', name: 'Forklift', damage: 2 },
  { id: 'hazard', icon: '⚠️', name: 'Hazard', damage: 2 },
  { id: 'machinery', icon: '⚙️', name: 'Machinery', damage: 1 }
]

export function getRandomBenefit() {
  return BENEFITS[Math.floor(Math.random() * BENEFITS.length)]
}

export function getRandomObstacle(characterType) {
  const obstacles = characterType === 'office' ? OFFICE_OBSTACLES : FACTORY_OBSTACLES
  return obstacles[Math.floor(Math.random() * obstacles.length)]
}

