import { motion } from 'framer-motion'
import { BENEFITS } from '../config/gameData'
import { useLanguage } from '../context/LanguageContext'

export default function GameOver({ score, distance, benefitsCollected, collectedBenefits, onRestart, onMainMenu }) {
  const { t, language } = useLanguage()

  // Get translated benefit name
  const getBenefitName = (benefit) => {
    const translations = {
      en: {
        legal: 'Legal Protection',
        strike: 'Strike Assistance',
        accident: 'Accident Insurance',
        emergency: 'Emergency Aid',
        disciplinary: 'Disciplinary Protection',
        survivor: 'Survivor Assistance'
      },
      de: {
        legal: 'Rechtsschutz',
        strike: 'Streikunterstützung',
        accident: 'Unfallversicherung',
        emergency: 'Notfallhilfe',
        disciplinary: 'Disziplinarschutz',
        survivor: 'Hinterbliebenenunterstützung'
      }
    }
    return translations[language][benefit.id] || benefit.name
  }

  const getBenefitDesc = (benefit) => {
    const translations = {
      en: {
        legal: 'Free legal advice in employment law',
        strike: 'Financial support during strikes',
        accident: 'Worldwide leisure time coverage',
        emergency: 'Support in extraordinary emergencies',
        disciplinary: 'Protection against discrimination',
        survivor: 'Support for bereaved families'
      },
      de: {
        legal: 'Kostenlose Rechtsberatung im Arbeitsrecht',
        strike: 'Finanzielle Unterstützung bei Streiks',
        accident: 'Weltweiter Freizeitschutz',
        emergency: 'Unterstützung in außergewöhnlichen Notlagen',
        disciplinary: 'Schutz vor Diskriminierung',
        survivor: 'Unterstützung für trauernde Familien'
      }
    }
    return translations[language][benefit.id] || benefit.description
  }

  return (
    <div className="gameover-screen">
      <motion.div
        className="gameover-content"
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.6 }}
      >
        <h1 className="gameover-title">{t('gameOver')}</h1>

        <div className="final-stats">
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-value">{score}</div>
            <div className="stat-label">{t('finalScore')}</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📏</div>
            <div className="stat-value">{Math.floor(distance)}m</div>
            <div className="stat-label">{t('distanceTraveled')}</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🤝</div>
            <div className="stat-value">{benefitsCollected}</div>
            <div className="stat-label">{t('benefitsCollected')}</div>
          </div>
        </div>

        {collectedBenefits.length > 0 && (
          <div className="benefits-summary">
            <h2>{language === 'de' ? 'Entdeckte IG Metall Vorteile:' : 'IG Metall Benefits You Discovered:'}</h2>
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
                    <div className="benefit-name">{getBenefitName(benefit)}</div>
                    <div className="benefit-desc">{getBenefitDesc(benefit)}</div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        <div className="educational-section">
          <p className="info-text">
            {language === 'de'
              ? '💡 Die IG Metall Mitgliedschaft bietet umfassende Unterstützung für Arbeitnehmer in allen Situationen.'
              : '💡 IG Metall membership provides comprehensive support for workers in all situations.'}
          </p>
          <button className="learn-more-btn" onClick={() => window.open('https://www.igmetall.de', '_blank')}>
            {language === 'de' ? '📚 Mehr über IG Metall erfahren' : '📚 Learn More About IG Metall Benefits'}
          </button>
        </div>

        <div className="action-buttons">
          <button className="btn-restart" onClick={onRestart}>
            🔄 {t('playAgain')}
          </button>
          <button className="btn-menu" onClick={onMainMenu}>
            🏠 {t('mainMenu')}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

