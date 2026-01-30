import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'

export default function BenefitNotification({ benefit, onComplete }) {
  const { t, language } = useLanguage()

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (benefit && onComplete) {
      const timer = setTimeout(() => {
        onComplete()
      }, 3000) // 3 seconds

      return () => clearTimeout(timer)
    }
  }, [benefit, onComplete])

  if (!benefit) return null

  // Get translated benefit name
  const getBenefitName = () => {
    const benefitKeyMap = {
      legal: 'legal',
      strike: 'strike',
      accident: 'accident',
      emergency: 'emergency',
      disciplinary: 'disciplinary',
      survivor: 'survivor'
    }
    const key = benefitKeyMap[benefit.benefitId] || benefit.benefitId
    return t(key) || benefit.name
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: '80px',
        zIndex: 1000,
        pointerEvents: 'none'
      }}
    >
      <AnimatePresence>
        <motion.div
          className="benefit-notification-wrapper"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20
          }}
        >
          <motion.div
            className="benefit-notification-content"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 0.8,
              ease: "easeInOut"
            }}
          >
            <div className="benefit-icon-large">{benefit.icon}</div>
            <div className="benefit-info">
              <div className="benefit-collected-text">{t('benefitCollected')}</div>
              <div className="benefit-name">{getBenefitName()}</div>
              <div className="benefit-points">+{benefit.points} {language === 'de' ? 'Punkte' : 'points'}</div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
