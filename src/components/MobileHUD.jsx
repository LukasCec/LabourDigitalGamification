import { motion } from 'framer-motion'

export default function MobileHUD({ score, lives }) {
  return (
    <div className="mobile-hud">
      {/* Top bar - Score and Lives */}
      <div className="hud-top-bar">
        <div className="hud-stat-group">
          <div className="hud-label">Score</div>
          <motion.div
            className="hud-value score"
            key={score}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.2 }}
          >
            {score}
          </motion.div>
        </div>

        <div className="hud-lives">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className={`heart ${i < lives ? 'active' : 'inactive'}`}
              animate={{
                scale: i < lives ? 1 : 0.7,
                opacity: i < lives ? 1 : 0.3
              }}
            >
              {i < lives ? '❤️' : '🖤'}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

