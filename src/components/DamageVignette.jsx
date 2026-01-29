import { motion, AnimatePresence } from 'framer-motion'

export default function DamageVignette({ isVisible }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="damage-vignette"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0.7, 1, 0.5, 0.8, 0.3, 0],
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.6,
            times: [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1]
          }}
        />
      )}
    </AnimatePresence>
  )
}

