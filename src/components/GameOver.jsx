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
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      overflow: 'auto',
      zIndex: 1000
    }}>
      {/* Background effects */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 30% 20%, rgba(239, 68, 68, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.6 }}
        style={{
          width: '100%',
          maxWidth: '450px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ textAlign: 'center' }}
        >
          <h1 style={{
            fontSize: 'clamp(2rem, 8vw, 3rem)',
            fontWeight: 900,
            margin: 0,
            background: 'linear-gradient(135deg, #ef4444, #f97316, #eab308)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
            filter: 'drop-shadow(0 4px 20px rgba(239, 68, 68, 0.4))'
          }}>
            {t('gameOver')}
          </h1>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px'
          }}
        >
          {/* Score */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.05))',
            borderRadius: '16px',
            padding: '16px 12px',
            textAlign: 'center',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.15)'
          }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '4px' }}>🎯</div>
            <div style={{
              fontSize: 'clamp(1.2rem, 5vw, 1.6rem)',
              fontWeight: 800,
              color: '#3b82f6',
              textShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
            }}>{score}</div>
            <div style={{
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.6)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginTop: '4px'
            }}>{t('finalScore')}</div>
          </div>

          {/* Distance */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.05))',
            borderRadius: '16px',
            padding: '16px 12px',
            textAlign: 'center',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            boxShadow: '0 4px 20px rgba(34, 197, 94, 0.15)'
          }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '4px' }}>📏</div>
            <div style={{
              fontSize: 'clamp(1.2rem, 5vw, 1.6rem)',
              fontWeight: 800,
              color: '#22c55e',
              textShadow: '0 0 20px rgba(34, 197, 94, 0.5)'
            }}>{Math.floor(distance)}m</div>
            <div style={{
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.6)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginTop: '4px'
            }}>{t('distanceTraveled')}</div>
          </div>

          {/* Benefits */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(168, 85, 247, 0.05))',
            borderRadius: '16px',
            padding: '16px 12px',
            textAlign: 'center',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            boxShadow: '0 4px 20px rgba(168, 85, 247, 0.15)'
          }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '4px' }}>🤝</div>
            <div style={{
              fontSize: 'clamp(1.2rem, 5vw, 1.6rem)',
              fontWeight: 800,
              color: '#a855f7',
              textShadow: '0 0 20px rgba(168, 85, 247, 0.5)'
            }}>{benefitsCollected}</div>
            <div style={{
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.6)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginTop: '4px'
            }}>{t('benefitsCollected')}</div>
          </div>
        </motion.div>

        {/* Collected Benefits */}
        {collectedBenefits.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '16px',
              padding: '16px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <h2 style={{
              fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.9)',
              margin: '0 0 14px 0',
              fontWeight: 700,
              textAlign: 'center'
            }}>
              ✨ {language === 'de' ? 'Entdeckte IG Metall Vorteile' : 'IG Metall Benefits Discovered'}
            </h2>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              {collectedBenefits.map((benefitId, index) => {
                const benefit = BENEFITS.find(b => b.id === benefitId)
                if (!benefit) return null

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    style={{
                      background: `linear-gradient(135deg, ${benefit.color}22, ${benefit.color}08)`,
                      borderRadius: '12px',
                      padding: '12px 14px',
                      border: `1px solid ${benefit.color}33`,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: `linear-gradient(135deg, ${benefit.color}44, ${benefit.color}22)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <span style={{ fontSize: '1.3rem' }}>{benefit.icon}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '0.85rem',
                        color: '#ffffff',
                        fontWeight: 700,
                        marginBottom: '4px'
                      }}>{getBenefitName(benefit)}</div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: 'rgba(255,255,255,0.6)',
                        lineHeight: 1.4
                      }}>{getBenefitDesc(benefit)}</div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* IG Metall Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
            borderRadius: '16px',
            padding: '16px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            textAlign: 'center'
          }}
        >
          <p style={{
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.8)',
            margin: '0 0 12px 0',
            lineHeight: 1.5
          }}>
            💡 {language === 'de'
              ? 'IG Metall bietet umfassende Unterstützung für Arbeitnehmer.'
              : 'IG Metall provides comprehensive support for workers.'}
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.open('https://www.igmetall.de', '_blank')}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 20px',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
            }}
          >
            📚 {language === 'de' ? 'Mehr erfahren' : 'Learn More'}
          </motion.button>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            display: 'flex',
            gap: '12px'
          }}
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onRestart}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              border: 'none',
              borderRadius: '14px',
              padding: '16px',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(34, 197, 94, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            🔄 {t('playAgain')}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onMainMenu}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.1)',
              border: '2px solid rgba(255,255,255,0.2)',
              borderRadius: '14px',
              padding: '16px',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            🏠 {t('mainMenu')}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}

