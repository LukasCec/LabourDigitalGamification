import { motion } from 'framer-motion'
import { useEffect } from 'react'

export default function Collectible({ item, onMiss }) {
  useEffect(() => {
    // Auto-miss after timeout
    const timer = setTimeout(() => {
      onMiss(item)
    }, 4000)

    return () => clearTimeout(timer)
  }, [item, onMiss])

  return (
    <motion.div
      className="collectible"
      initial={{ y: -100, opacity: 0, scale: 0.5 }}
      animate={{
        y: window.innerHeight + 100,
        opacity: [0, 1, 1, 1, 0],
        scale: 1,
        rotate: [0, 360]
      }}
      transition={{
        y: { duration: 3.5, ease: 'linear' },
        opacity: { duration: 3.5, times: [0, 0.1, 0.5, 0.9, 1] },
        rotate: { duration: 3.5, ease: 'linear' }
      }}
      exit={{ scale: 0, opacity: 0 }}
      style={{
        left: item.position
      }}
      onAnimationComplete={() => onMiss(item)}
    >
      <motion.div
        className={`collectible-inner ${item.type}`}
        style={{
          background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
          boxShadow: `0 0 20px ${item.color}88`
        }}
        whileHover={{ scale: 1.2 }}
      >
        <div className="collectible-icon">{item.icon}</div>
        {item.type === 'benefit' && (
          <motion.div
            className="collectible-glow"
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              repeat: Infinity,
              duration: 1
            }}
          />
        )}
      </motion.div>
      {item.type === 'benefit' && (
        <div className="collectible-label">{item.shortDesc}</div>
      )}
    </motion.div>
  )
}

