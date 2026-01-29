import { motion } from 'framer-motion'
import { BENEFITS } from '../config/gameData'

export default function GameOver({ score, distance, benefitsCollected, collectedBenefits, onRestart, onMainMenu }) {
  return (
    <div className="gameover-screen">
      <motion.div
        className="gameover-content"
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.6 }}
      >
        <h1 className="gameover-title">Shift Complete!</h1>

        <div className="final-stats">
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-value">{score}</div>
            <div className="stat-label">Final Score</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📏</div>
            <div className="stat-value">{Math.floor(distance)}m</div>
            <div className="stat-label">Distance Run</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🤝</div>
            <div className="stat-value">{benefitsCollected}</div>
            <div className="stat-label">Benefits Collected</div>
          </div>
        </div>

        {collectedBenefits.length > 0 && (
          <div className="benefits-summary">
            <h2>IG Metall Benefits You Discovered:</h2>
            <div className="benefits-grid">
              {collectedBenefits.map((benefitId, index) => {
                const benefit = BENEFITS.find(b => b.id === benefitId)
                if (!benefit) return null

                return (
                  <motion.div
                    key={index}
                    className="benefit-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="benefit-icon">{benefit.icon}</div>
                    <div className="benefit-name">{benefit.name}</div>
                    <div className="benefit-desc">{benefit.description}</div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        <div className="educational-section">
          <p className="info-text">
            💡 IG Metall membership provides comprehensive support for workers in all situations.
          </p>
          <button className="learn-more-btn" onClick={() => window.open('https://www.igmetall.de', '_blank')}>
            📚 Learn More About IG Metall Benefits
          </button>
        </div>

        <div className="action-buttons">
          <button className="btn-restart" onClick={onRestart}>
            🔄 Play Again
          </button>
          <button className="btn-menu" onClick={onMainMenu}>
            🏠 Main Menu
          </button>
        </div>
      </motion.div>
    </div>
  )
}

