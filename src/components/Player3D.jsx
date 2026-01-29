import { motion } from 'framer-motion'
import './Player3D.css'

export default function Player3D({ characterType, lane, isJumping, isDucking }) {
  const isOffice = characterType === 'office'

  // Calculate lane position (in percentage for centering)
  const getLaneX = (lane) => {
    const lanes = [25, 50, 75] // percentages for left, center, right
    return lanes[lane] || 50
  }

  return (
    <motion.div
      className="player-3d-container"
      animate={{
        left: `${getLaneX(lane)}%`,
        y: isJumping ? -150 : isDucking ? 80 : 0,
      }}
      transition={{
        left: { type: 'spring', stiffness: 400, damping: 30 },
        y: { type: 'spring', stiffness: 500, damping: 25 }
      }}
    >
      <motion.div
        className={`player-3d ${characterType}`}
        animate={{
          rotateX: isDucking ? 45 : 0,
          scaleY: isDucking ? 0.6 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Character body */}
        <div className="character-3d">
          {/* Head */}
          <div className="head">
            <div className="head-front face">
              <div className="eyes">
                <div className="eye eye-left" />
                <div className="eye eye-right" />
              </div>
              <div className="mouth" />
            </div>
            <div className="head-back" />
            <div className="head-left" />
            <div className="head-right" />
            <div className="head-top" />

            {/* Helmet for factory worker */}
            {!isOffice && (
              <div className="hardhat">
                <div className="hardhat-front" />
                <div className="hardhat-back" />
                <div className="hardhat-left" />
                <div className="hardhat-right" />
                <div className="hardhat-top" />
              </div>
            )}

            {/* Hair for office worker */}
            {isOffice && (
              <div className="hair">
                <div className="hair-front" />
                <div className="hair-back" />
                <div className="hair-left" />
                <div className="hair-right" />
                <div className="hair-top" />
              </div>
            )}
          </div>

          {/* Torso */}
          <div className="torso">
            <div className="torso-front">
              {isOffice && (
                <>
                  <div className="tie" />
                  <div className="shirt-buttons">
                    <div className="button" />
                    <div className="button" />
                    <div className="button" />
                  </div>
                </>
              )}
              {!isOffice && (
                <>
                  <div className="vest-stripe" />
                  <div className="safety-badge">⚠️</div>
                </>
              )}
            </div>
            <div className="torso-back" />
            <div className="torso-left" />
            <div className="torso-right" />
          </div>

          {/* Arms */}
          <motion.div
            className="arm arm-left"
            animate={{
              rotateZ: [0, 25, 0, -20, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 1,
              ease: 'linear'
            }}
          >
            <div className="upper-arm">
              <div className="arm-front" />
              <div className="arm-back" />
              <div className="arm-side" />
            </div>
            <div className="lower-arm">
              <div className="forearm-front" />
              <div className="forearm-back" />
            </div>
            <div className="hand" />
          </motion.div>

          <motion.div
            className="arm arm-right"
            animate={{
              rotateZ: [0, -20, 0, 25, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 1,
              ease: 'linear'
            }}
          >
            <div className="upper-arm">
              <div className="arm-front" />
              <div className="arm-back" />
              <div className="arm-side" />
            </div>
            <div className="lower-arm">
              <div className="forearm-front" />
              <div className="forearm-back" />
            </div>
            <div className="hand" />
          </motion.div>

          {/* Legs */}
          <motion.div
            className="leg leg-left"
            animate={{
              rotateX: [0, 40, 0, -30, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 0.8,
              ease: 'linear'
            }}
          >
            <div className="upper-leg">
              <div className="leg-front" />
              <div className="leg-back" />
              <div className="leg-side" />
            </div>
            <div className="lower-leg">
              <div className="shin-front" />
              <div className="shin-back" />
            </div>
            <div className="foot" />
          </motion.div>

          <motion.div
            className="leg leg-right"
            animate={{
              rotateX: [0, -30, 0, 40, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 0.8,
              ease: 'linear'
            }}
          >
            <div className="upper-leg">
              <div className="leg-front" />
              <div className="leg-back" />
              <div className="leg-side" />
            </div>
            <div className="lower-leg">
              <div className="shin-front" />
              <div className="shin-back" />
            </div>
            <div className="foot" />
          </motion.div>
        </div>

        {/* Shadow */}
        <motion.div
          className="character-shadow"
          animate={{
            scale: isJumping ? 0.7 : 1,
            opacity: isJumping ? 0.3 : 0.6,
          }}
        />
      </motion.div>
    </motion.div>
  )
}

