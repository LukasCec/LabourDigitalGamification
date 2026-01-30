import { motion } from 'framer-motion'

export default function MobileHUD({ score, lives, distance, benefitsCollected, speed }) {
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

      {/* Bottom bar - Distance, Benefits, Speed - with inline styles for guaranteed visibility */}
      <div
        className="hud-bottom-bar"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          display: 'flex',
          background: 'rgba(0, 0, 0, 0.95)',
          padding: '12px 10px',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))'
        }}
      >
        <div className="hud-stat distance" style={{ color: '#ffffff' }}>
          <span className="stat-icon">📏</span>
          <span className="stat-text" style={{ color: '#ffffff' }}>{Math.floor(distance)}m</span>
        </div>

        <div className="hud-stat benefits" style={{ color: '#ffffff' }}>
          <span className="stat-icon">🤝</span>
          <span className="stat-text" style={{ color: '#ffffff' }}>{benefitsCollected}</span>
        </div>

        <div className="hud-stat speed" style={{ color: '#ffffff' }}>
          <span className="stat-icon">⚡</span>
          <div className="speed-bar">
            <motion.div
              className="speed-fill"
              animate={{
                width: `${Math.min((speed / 0.25) * 100, 100)}%`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

