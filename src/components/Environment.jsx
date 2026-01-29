import { motion } from 'framer-motion'

const OFFICE_BACKGROUND = {
  primary: '#e0f2fe',
  secondary: '#bae6fd',
  accent: '#0ea5e9',
  floor: '#94a3b8'
}

const FACTORY_BACKGROUND = {
  primary: '#fed7aa',
  secondary: '#fdba74',
  accent: '#f97316',
  floor: '#78716c'
}

export default function Environment({ characterType }) {
  const theme = characterType === 'office' ? OFFICE_BACKGROUND : FACTORY_BACKGROUND

  return (
    <div className="environment" style={{ background: theme.primary }}>
      {/* Animated background elements */}
      <div className="bg-layer layer-1" style={{ background: `linear-gradient(180deg, ${theme.primary}, ${theme.secondary})` }}>
        {characterType === 'office' ? (
          <>
            {/* Office elements */}
            <motion.div
              className="bg-element window"
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
              🪟
            </motion.div>
            <motion.div
              className="bg-element computer"
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.5 }}
            >
              💻
            </motion.div>
          </>
        ) : (
          <>
            {/* Factory elements */}
            <motion.div
              className="bg-element gear"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            >
              ⚙️
            </motion.div>
            <motion.div
              className="bg-element factory-icon"
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              🏭
            </motion.div>
          </>
        )}
      </div>

      {/* Moving floor/ground lines */}
      <div className="floor-lines">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="floor-line"
            style={{
              background: theme.floor,
              top: `${i * 5}%`
            }}
            animate={{
              y: ['0%', '500%']
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: 'linear',
              delay: i * 0.1
            }}
          />
        ))}
      </div>

      {/* Lane dividers */}
      <div className="lane-dividers">
        <div className="lane-line" style={{ left: '33.33%', background: theme.accent }} />
        <div className="lane-line" style={{ left: '66.66%', background: theme.accent }} />
      </div>
    </div>
  )
}

