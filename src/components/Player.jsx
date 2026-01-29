import { motion } from 'framer-motion'
import { CHARACTER_TYPES } from './CharacterSelect'

export default function Player({ characterType, lane, isJumping, isDucking }) {
  const character = CHARACTER_TYPES[characterType?.toUpperCase()] || CHARACTER_TYPES.OFFICE

  const getLanePosition = (lane) => {
    // Lanes: 0 = left, 1 = center, 2 = right
    const positions = ['25%', '50%', '75%']
    return positions[lane] || '50%'
  }

  return (
    <motion.div
      className="player"
      animate={{
        left: getLanePosition(lane),
        y: isJumping ? -100 : isDucking ? 50 : 0,
      }}
      transition={{
        left: { type: 'spring', stiffness: 300, damping: 30 },
        y: { type: 'spring', stiffness: 400, damping: 20 }
      }}
    >
      <motion.div
        className={`player-character ${characterType}`}
        animate={{
          rotate: isJumping ? -10 : isDucking ? 10 : 0,
          scaleY: isDucking ? 0.6 : 1
        }}
      >
        {/* Character body */}
        <div className="character-body">
          <div className="character-icon">{character.icon}</div>

          {characterType === 'office' && (
            <div className="office-details">
              <div className="briefcase">💼</div>
            </div>
          )}

          {characterType === 'factory' && (
            <div className="factory-details">
              <div className="hardhat">🪖</div>
            </div>
          )}
        </div>

        {/* Running animation effect */}
        <motion.div
          className="run-effect"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1]
          }}
          transition={{
            repeat: Infinity,
            duration: 0.3
          }}
        />
      </motion.div>
    </motion.div>
  )
}

