import { useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import Player3DModel from './3d/Player3DModel'

const CHARACTER_TYPES = {
  OFFICE: {
    id: 'office',
    title: 'Office Worker',
    icon: '👔',
    description: 'Navigate through the modern office, collecting benefits while avoiding workplace hazards',
    color: '#3b82f6',
    gradient: 'from-blue-500 to-cyan-500'
  },
  FACTORY: {
    id: 'factory',
    title: 'Factory Worker',
    icon: '⚙️',
    description: 'Run through the industrial facility, gather union benefits and dodge obstacles',
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-600'
  }
}

export default function CharacterSelect({ onSelect }) {
  const [selectedCharacter, setSelectedCharacter] = useState('office')
  const [isHovering, setIsHovering] = useState(null)

  const handleSelect = (charId) => {
    setSelectedCharacter(charId)
  }

  const handleStart = () => {
    onSelect(selectedCharacter)
  }

  const currentChar = CHARACTER_TYPES[selectedCharacter.toUpperCase()]

  return (
    <div className="character-select-modern">
      {/* Background gradient overlay */}
      <div className="select-bg-overlay" />

      {/* Main content */}
      <div className="select-container">
        {/* Left side - Character preview */}
        <motion.div
          className="character-preview-section"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="preview-header">
            <h2 className="preview-title">Character Preview</h2>
            <div className="preview-subtitle">{currentChar.title}</div>
          </div>

          {/* 3D Preview */}
          <div className="character-3d-preview">
            <Canvas
              camera={{ position: [0, 2, 5], fov: 50 }}
              gl={{ antialias: true, alpha: true }}
            >
              <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <pointLight position={[-5, 5, 0]} intensity={0.5} color="#3b82f6" />

                <Player3DModel
                  characterType={selectedCharacter}
                  position={[0, 0, 0]}
                  isJumping={false}
                  isDucking={false}
                  isDamaged={false}
                  isRunning={true}
                />

                <ContactShadows
                  position={[0, -0.5, 0]}
                  opacity={0.4}
                  scale={3}
                  blur={2}
                />

                <Environment preset="sunset" />
                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  minPolarAngle={Math.PI / 3}
                  maxPolarAngle={Math.PI / 2}
                  autoRotate
                  autoRotateSpeed={2}
                />
              </Suspense>
            </Canvas>
          </div>
        </motion.div>

        {/* Right side - Selection & Info */}
        <motion.div
          className="character-selection-section"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Header */}
          <div className="selection-header">
            <motion.h1
              className="game-title-modern"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="title-icon">⚙️</span>
              IG Metall Runner
            </motion.h1>
            <p className="game-subtitle-modern">Choose Your Worker</p>
          </div>

          {/* Character cards */}
          <div className="character-cards-modern">
            {Object.values(CHARACTER_TYPES).map((char) => (
              <motion.div
                key={char.id}
                className={`character-card-modern ${selectedCharacter === char.id ? 'selected' : ''}`}
                onClick={() => handleSelect(char.id)}
                onHoverStart={() => setIsHovering(char.id)}
                onHoverEnd={() => setIsHovering(null)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="card-icon-badge">
                  {char.icon}
                </div>
                <div className="card-content">
                  <h3 className="card-title">{char.title}</h3>
                  <p className="card-description">{char.description}</p>
                </div>
                <div className={`card-selector ${selectedCharacter === char.id ? 'active' : ''}`}>
                  {selectedCharacter === char.id && (
                    <motion.div
                      className="selector-checkmark"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      ✓
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* IG Metall info */}
          <motion.div
            className="ig-metall-info-modern"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="info-icon">🤝</div>
            <div className="info-text">
              <strong>Collect IG Metall Benefits</strong>
              <span>Legal protection, strike assistance, accident insurance & more!</span>
            </div>
          </motion.div>

          {/* Start button */}
          <motion.button
            className="start-button-modern"
            onClick={handleStart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="button-text">Start Game</span>
            <span className="button-arrow">→</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

export { CHARACTER_TYPES }

