import { motion, AnimatePresence } from 'framer-motion'

export default function BenefitNotification({ benefit }) {
  if (!benefit) return null

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
              <div className="benefit-collected-text">Collected!</div>
              <div className="benefit-name">{benefit.name}</div>
              <div className="benefit-points">+{benefit.points} points</div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

