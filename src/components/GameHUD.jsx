import { motion } from 'framer-motion'

export default function GameHUD({ score, lives, distance, benefitsCollected }) {
  return (
    <div className="game-hud">
      <div className="hud-top">
        <div className="hud-left">
          <div className="score-display">
            <div className="label">Score</div>
            <motion.div
              className="value"
              key={score}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.2 }}
            >
              {score}
            </motion.div>
          </div>

          <div className="distance-display">
            <div className="label">Distance</div>
            <div className="value">{Math.floor(distance)}m</div>
          </div>
        </div>

        <div className="hud-right">
          <div className="lives-display">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className={`heart ${i < lives ? 'alive' : 'dead'}`}
                animate={{ scale: i < lives ? 1 : 0.5 }}
                transition={{ type: 'spring' }}
              >
                {i < lives ? '❤️' : '🖤'}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="hud-bottom">
        <div className="benefits-counter">
          <span className="icon">🤝</span>
          <span className="count">{benefitsCollected} Benefits Collected</span>
        </div>
      </div>
    </div>
  )
}

