import { useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import Player3DModel from './3d/Player3DModel'
import { useLanguage } from '../context/LanguageContext'

export default function CharacterSelect({ onSelect }) {
  const [selectedCharacter, setSelectedCharacter] = useState('office')
  const { language, setLanguage, t } = useLanguage()

  const handleSelect = (charId) => {
    setSelectedCharacter(charId)
  }

  const handleStart = () => {
    onSelect(selectedCharacter)
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      height: '100dvh',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0
    }}>
      {/* Background overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(245, 158, 11, 0.15) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />

      {/* Language Selector - Top Right */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{
          position: 'absolute',
          top: 'calc(10px + env(safe-area-inset-top, 0px))',
          right: '15px',
          display: 'flex',
          gap: '8px',
          zIndex: 100
        }}
      >
        {/* UK Flag Button */}
        <motion.button
          onClick={() => setLanguage('en')}
          whileTap={{ scale: 0.9 }}
          style={{
            width: '44px',
            height: '30px',
            borderRadius: '6px',
            border: language === 'en' ? '2px solid #22c55e' : '2px solid rgba(255,255,255,0.3)',
            background: '#012169',
            cursor: 'pointer',
            padding: 0,
            overflow: 'hidden',
            position: 'relative',
            boxShadow: language === 'en' ? '0 0 12px rgba(34, 197, 94, 0.6)' : '0 2px 8px rgba(0,0,0,0.3)',
            transition: 'all 0.2s ease'
          }}
        >
          {/* UK Flag Design */}
          <div style={{ position: 'absolute', inset: 0, background: '#012169' }}>
            {/* White diagonal stripes */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: '150%', height: '6px', background: '#fff', transform: 'translate(-50%, -50%) rotate(30deg)' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: '150%', height: '6px', background: '#fff', transform: 'translate(-50%, -50%) rotate(-30deg)' }} />
            {/* Red diagonal stripes */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: '150%', height: '3px', background: '#C8102E', transform: 'translate(-50%, -50%) rotate(30deg)' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: '150%', height: '3px', background: '#C8102E', transform: 'translate(-50%, -50%) rotate(-30deg)' }} />
            {/* White cross */}
            <div style={{ position: 'absolute', top: 0, left: '50%', width: '8px', height: '100%', background: '#fff', transform: 'translateX(-50%)' }} />
            <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '8px', background: '#fff', transform: 'translateY(-50%)' }} />
            {/* Red cross */}
            <div style={{ position: 'absolute', top: 0, left: '50%', width: '5px', height: '100%', background: '#C8102E', transform: 'translateX(-50%)' }} />
            <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '5px', background: '#C8102E', transform: 'translateY(-50%)' }} />
          </div>
        </motion.button>

        {/* German Flag Button */}
        <motion.button
          onClick={() => setLanguage('de')}
          whileTap={{ scale: 0.9 }}
          style={{
            width: '44px',
            height: '30px',
            borderRadius: '6px',
            border: language === 'de' ? '2px solid #22c55e' : '2px solid rgba(255,255,255,0.3)',
            background: '#000',
            cursor: 'pointer',
            padding: 0,
            overflow: 'hidden',
            position: 'relative',
            boxShadow: language === 'de' ? '0 0 12px rgba(34, 197, 94, 0.6)' : '0 2px 8px rgba(0,0,0,0.3)',
            transition: 'all 0.2s ease'
          }}
        >
          {/* German Flag - Black Red Gold horizontal stripes */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '33.33%', background: '#000000' }} />
          <div style={{ position: 'absolute', top: '33.33%', left: 0, right: 0, height: '33.33%', background: '#DD0000' }} />
          <div style={{ position: 'absolute', top: '66.66%', left: 0, right: 0, height: '33.34%', background: '#FFCC00' }} />
        </motion.button>
      </motion.div>

      {/* Title - Animated and exciting */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: '10px 15px',
          paddingTop: 'calc(50px + env(safe-area-inset-top, 0px))',
          textAlign: 'center',
          zIndex: 10
        }}
      >
        {/* Main title with gradient and glow */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          {/* Gear emoji - separate from gradient text */}
          <motion.span
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
              scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
            }}
            style={{
              display: 'inline-block',
              fontSize: 'clamp(2rem, 8vw, 3rem)',
              filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.6))'
            }}
          >
            ⚙️
          </motion.span>

          {/* Text with gradient */}
          <motion.h1
            style={{
              fontSize: 'clamp(2rem, 8vw, 3rem)',
              fontWeight: 900,
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #22c55e, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 2px 10px rgba(59, 130, 246, 0.5))'
            }}
          >
            <span>{t('title')}</span>
            <motion.span
              animate={{
                color: ['#22c55e', '#3b82f6', '#8b5cf6', '#22c55e']
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                WebkitTextFillColor: 'initial',
                fontStyle: 'italic'
              }}
            >
              {t('titleAccent')}
            </motion.span>
          </motion.h1>
        </div>

        {/* Subtitle with typing effect feel */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            fontSize: 'clamp(0.7rem, 2.5vw, 0.9rem)',
            color: 'rgba(255,255,255,0.7)',
            margin: '5px 0 0 0',
            fontWeight: 500,
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}
        >
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ⚡
          </motion.span>
          {' '}{t('subtitle')}{' '}
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            ⚡
          </motion.span>
        </motion.p>
      </motion.div>

      {/* 3D Character Preview - Reduced height, adjusted camera */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          flex: '0 0 auto',
          height: '25vh',
          minHeight: '140px',
          maxHeight: '200px',
          position: 'relative',
          zIndex: 5
        }}
      >
        <Canvas
          camera={{ position: [0, 1.5, 4], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <pointLight position={[-5, 5, 0]} intensity={0.5} color="#3b82f6" />

            <Player3DModel
              characterType={selectedCharacter}
              position={[0, -0.5, 0]}
              isJumping={false}
              isDucking={false}
              isDamaged={false}
              isRunning={true}
            />

            <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={3} blur={2} />
            <Environment preset="sunset" />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 2}
              autoRotate
              autoRotateSpeed={2}
              target={[0, 0.5, 0]}
            />
          </Suspense>
        </Canvas>
      </motion.div>

      {/* Play Button - Above character selection */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '15px',
          zIndex: 10
        }}
      >
        <motion.button
          onClick={handleStart}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            boxShadow: [
              '0 0 20px rgba(34, 197, 94, 0.4), 0 0 40px rgba(34, 197, 94, 0.2)',
              '0 0 30px rgba(34, 197, 94, 0.6), 0 0 60px rgba(34, 197, 94, 0.3)',
              '0 0 20px rgba(34, 197, 94, 0.4), 0 0 40px rgba(34, 197, 94, 0.2)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Play triangle */}
          <div style={{
            width: 0,
            height: 0,
            borderTop: '20px solid transparent',
            borderBottom: '20px solid transparent',
            borderLeft: '32px solid white',
            marginLeft: '8px',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
          }} />
          {/* Shine */}
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '35%',
            height: '35%',
            background: 'rgba(255,255,255,0.4)',
            borderRadius: '50%',
            filter: 'blur(8px)'
          }} />
        </motion.button>
        <p style={{
          color: 'rgba(255,255,255,0.7)',
          fontSize: '0.9rem',
          marginTop: '10px',
          fontWeight: 600
        }}>{t('tapToPlay')}</p>
      </motion.div>

      {/* Character Selection Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          padding: '10px 15px',
          zIndex: 10
        }}
      >
        <motion.button
          onClick={() => handleSelect('office')}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '12px 20px',
            borderRadius: '12px',
            border: selectedCharacter === 'office' ? '3px solid #3b82f6' : '3px solid rgba(255,255,255,0.1)',
            background: selectedCharacter === 'office' ? '#3b82f622' : 'rgba(255,255,255,0.05)',
            color: '#ffffff',
            fontSize: 'clamp(0.85rem, 3vw, 1rem)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            boxShadow: selectedCharacter === 'office' ? '0 4px 20px #3b82f644' : 'none'
          }}
        >
          <span style={{ fontSize: '1.3em' }}>👔</span>
          {t('officeWorker')}
        </motion.button>
        <motion.button
          onClick={() => handleSelect('factory')}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '12px 20px',
            borderRadius: '12px',
            border: selectedCharacter === 'factory' ? '3px solid #f59e0b' : '3px solid rgba(255,255,255,0.1)',
            background: selectedCharacter === 'factory' ? '#f59e0b22' : 'rgba(255,255,255,0.05)',
            color: '#ffffff',
            fontSize: 'clamp(0.85rem, 3vw, 1rem)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            boxShadow: selectedCharacter === 'factory' ? '0 4px 20px #f59e0b44' : 'none'
          }}
        >
          <span style={{ fontSize: '1.3em' }}>⚙️</span>
          {t('factoryWorker')}
        </motion.button>
      </motion.div>

      {/* IG Metall Benefits Info - Styled with glow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '15px',
          padding: '18px 24px',
          paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
          margin: '10px 15px',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))',
          borderRadius: '16px',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          boxShadow: '0 4px 24px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
          zIndex: 10
        }}
      >
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
          flexShrink: 0
        }}>
          <span style={{ fontSize: '1.5rem' }}>🤝</span>
        </div>
        <div style={{ textAlign: 'left' }}>
          <p style={{
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '1rem',
            margin: 0,
            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }}>{t('infoTitle')}</p>
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '0.8rem',
            margin: '4px 0 0 0',
            lineHeight: 1.3
          }}>{t('infoSubtitle')}</p>
        </div>
      </motion.div>
    </div>
  )
}


