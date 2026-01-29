import { Canvas } from '@react-three/fiber'
import { useEffect, useRef, useState, useCallback, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './App.css'

// 3D Components
import GameScene from './components/3d/GameScene'
import Player3DModel from './components/3d/Player3DModel'
import Obstacle3D from './components/3d/Obstacle3D'
import Benefit3D from './components/3d/Benefit3D'

// UI Components
import CharacterSelect from './components/CharacterSelect'
import MobileHUD from './components/MobileHUD'
import GameOver from './components/GameOver'
import BenefitNotification from './components/BenefitNotification'
import DamageVignette from './components/DamageVignette'

// Game data
import { getRandomBenefit, getRandomObstacle } from './config/gameData'

// Game constants
const GAME_CONFIG = {
  LANES: 3,
  LANE_WIDTH: 3,
  STARTING_LIVES: 3,
  BASE_SPEED: 0.08,
  MAX_SPEED: 0.25,
  SPEED_INCREASE_INTERVAL: 8000, // Increase every 8 seconds
  SPAWN_INTERVAL: 1800, // Spawn every 1.8 seconds
}

function App() {
  // Game state
  const [gameState, setGameState] = useState('select') // select, playing, gameover
  const [characterType, setCharacterType] = useState(null)

  // Player state
  const [playerLane, setPlayerLane] = useState(1) // 0 = left, 1 = center, 2 = right
  const [smoothLaneX, setSmoothLaneX] = useState(0) // Smooth interpolated X position
  const [isJumping, setIsJumping] = useState(false)
  const [isDucking, setIsDucking] = useState(false)
  const [isDamaged, setIsDamaged] = useState(false) // Red flash on damage
  const [showBenefitNotification, setShowBenefitNotification] = useState(null) // Current benefit collected
  const [showDamageVignette, setShowDamageVignette] = useState(false) // Red screen edge effect

  // Game progress
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(GAME_CONFIG.STARTING_LIVES)
  const [distance, setDistance] = useState(0)
  const [speed, setSpeed] = useState(GAME_CONFIG.BASE_SPEED)
  const [benefitsCollected, setBenefitsCollected] = useState(0)
  const [collectedBenefitIds, setCollectedBenefitIds] = useState([])

  // Items on screen (3D objects)
  const [items, setItems] = useState([])

  // Refs
  const nextItemId = useRef(0)
  const lastSpawn = useRef(0)
  const lastSpeedIncrease = useRef(0)
  const gameStartTime = useRef(null)
  const touchStartX = useRef(null)
  const touchStartY = useRef(null)

  // Get lane X position in 3D space
  const getLanePosition = useCallback((lane) => {
    return (lane - 1) * GAME_CONFIG.LANE_WIDTH // -3, 0, 3
  }, [])

  // Smooth lane interpolation - runs continuously
  useEffect(() => {
    if (gameState !== 'playing') return

    let animationFrameId
    const interpolate = () => {
      setSmoothLaneX(prev => {
        const targetX = getLanePosition(playerLane)
        const diff = targetX - prev

        // If difference is very small, snap to target
        if (Math.abs(diff) < 0.01) {
          return targetX
        }

        // Otherwise, interpolate smoothly (0.15 = 15% closer each frame)
        return prev + diff * 0.15
      })

      animationFrameId = requestAnimationFrame(interpolate)
    }

    interpolate()

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [gameState, playerLane, getLanePosition])

  // Character selection
  const handleCharacterSelect = (type) => {
    setCharacterType(type)
    setGameState('playing')
    gameStartTime.current = Date.now()
    lastSpawn.current = Date.now()
    lastSpeedIncrease.current = Date.now()
    setSmoothLaneX(0)
  }


  // Touch controls - optimized for mobile
  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }, [])

  const handleTouchEnd = useCallback((e) => {
    if (!touchStartX.current || !touchStartY.current) return

    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY

    const deltaX = touchEndX - touchStartX.current
    const deltaY = touchEndY - touchStartY.current

    const threshold = 30 // Lower threshold for mobile

    // Determine swipe direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe - change lanes
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          setPlayerLane(prev => Math.min(2, prev + 1))
        } else {
          setPlayerLane(prev => Math.max(0, prev - 1))
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > threshold) {
        if (deltaY < 0 && !isJumping && !isDucking) {
          // Swipe up - jump
          setIsJumping(true)
          setTimeout(() => setIsJumping(false), 600)
        } else if (deltaY > 0 && !isDucking && !isJumping) {
          // Swipe down - duck
          setIsDucking(true)
          setTimeout(() => setIsDucking(false), 500)
        }
      }
    }

    touchStartX.current = null
    touchStartY.current = null
  }, [isJumping, isDucking])

  // Keyboard controls (for testing on desktop)
  useEffect(() => {
    if (gameState !== 'playing') return

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setPlayerLane(prev => Math.max(0, prev - 1))
      } else if (e.key === 'ArrowRight') {
        setPlayerLane(prev => Math.min(2, prev + 1))
      } else if (e.key === 'ArrowUp' || e.key === ' ') {
        if (!isJumping && !isDucking) {
          setIsJumping(true)
          setTimeout(() => setIsJumping(false), 600)
        }
      } else if (e.key === 'ArrowDown') {
        if (!isDucking && !isJumping) {
          setIsDucking(true)
          setTimeout(() => setIsDucking(false), 500)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState, isJumping, isDucking])

  // Spawn items (benefits and obstacles)
  const spawnItem = useCallback(() => {
    const isBenefit = Math.random() < 0.35 // 35% benefits, 65% obstacles
    const lane = Math.floor(Math.random() * GAME_CONFIG.LANES)

    const itemId = nextItemId.current++
    let newItem

    if (isBenefit) {
      const benefit = getRandomBenefit()
      newItem = {
        id: itemId,
        uniqueKey: `benefit-${itemId}`,
        type: 'benefit',
        lane,
        position: [getLanePosition(lane), 0.5, -80], // [x, y, z] - Spawned further away
        processed: false,
        ...benefit
      }
    } else {
      const obstacle = getRandomObstacle(characterType)
      newItem = {
        id: itemId,
        uniqueKey: `obstacle-${itemId}`,
        type: 'obstacle',
        lane,
        position: [getLanePosition(lane), 0, -80], // Spawned further away
        processed: false,
        ...obstacle
      }
    }

    setItems(prev => [...prev, newItem])
  }, [characterType, getLanePosition])

  // Collision detection - only triggers once per item
  const checkCollision = useCallback((item, itemZ) => {
    // Remove items that passed the player (far behind)
    if (itemZ > 5) {
      setItems(prev => prev.filter(i => i.id !== item.id))
      return true
    }

    // Check if item is in collision zone (tight zone near player)
    if (itemZ > -1 && itemZ < 1.5) {
      // Check if item already processed
      if (item.processed) return false

      // Mark as processed
      item.processed = true

      if (item.lane === playerLane) {
        if (item.type === 'benefit') {
          // Collect benefit - use benefit's actual ID (e.g., 'legal', 'strike')
          setScore(prev => prev + item.points)
          setBenefitsCollected(prev => prev + 1)
          // Store the benefit type ID, not the item ID
          setCollectedBenefitIds(prev => [...new Set([...prev, item.id])])

          // Show benefit notification
          setShowBenefitNotification({
            name: item.name,
            icon: item.icon,
            points: item.points
          })
          setTimeout(() => setShowBenefitNotification(null), 3000) // Hide after 3 seconds

          setItems(prev => prev.filter(i => i.id !== item.id))
          return true
        } else {
          // Hit obstacle - check if jumping/ducking
          if (!isJumping && !isDucking) {
            // Damage flash effect on player
            setIsDamaged(true)
            setTimeout(() => setIsDamaged(false), 500)

            // Damage vignette effect on screen
            setShowDamageVignette(true)
            setTimeout(() => setShowDamageVignette(false), 600)

            setLives(prev => {
              const newLives = Math.max(0, prev - item.damage)
              if (newLives <= 0) {
                setGameState('gameover')
              }
              return newLives
            })
            setItems(prev => prev.filter(i => i.id !== item.id))
            return true
          } else {
            // Successfully avoided by jumping/ducking
            setScore(prev => prev + 10)
            setItems(prev => prev.filter(i => i.id !== item.id))
            return true
          }
        }
      } else {
        // Item in different lane - no collision, remove it
        setTimeout(() => {
          setItems(prev => prev.filter(i => i.id !== item.id))
        }, 500)
      }
    }

    return false
  }, [playerLane, isJumping, isDucking])

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return

    const gameLoop = setInterval(() => {
      const now = Date.now()

      // Update distance
      setDistance(prev => prev + speed * 100)

      // Spawn items
      if (now - lastSpawn.current > GAME_CONFIG.SPAWN_INTERVAL) {
        lastSpawn.current = now
        spawnItem()
      }

      // Increase speed over time (slower increment)
      if (now - lastSpeedIncrease.current > GAME_CONFIG.SPEED_INCREASE_INTERVAL) {
        lastSpeedIncrease.current = now
        setSpeed(prev => Math.min(GAME_CONFIG.MAX_SPEED, prev + 0.005))
      }
    }, 100)

    return () => clearInterval(gameLoop)
  }, [gameState, speed, spawnItem])

  // Reset game
  const resetGame = useCallback(() => {
    setGameState('playing')
    setPlayerLane(1)
    setSmoothLaneX(0) // Reset smooth position to center
    setIsJumping(false)
    setIsDucking(false)
    setScore(0)
    setLives(GAME_CONFIG.STARTING_LIVES)
    setDistance(0)
    setSpeed(GAME_CONFIG.BASE_SPEED)
    setBenefitsCollected(0)
    setCollectedBenefitIds([])
    setItems([])
    nextItemId.current = 0
    lastSpawn.current = Date.now()
    lastSpeedIncrease.current = Date.now()
    gameStartTime.current = Date.now()
  }, [])

  const goToMainMenu = useCallback(() => {
    setGameState('select')
    setCharacterType(null)
    resetGame()
  }, [resetGame])

  // Control body overflow based on game state
  useEffect(() => {
    if (gameState === 'playing') {
      document.body.classList.add('game-active')
    } else {
      document.body.classList.remove('game-active')
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('game-active')
    }
  }, [gameState])

  // Render character selection
  if (gameState === 'select') {
    return <CharacterSelect onSelect={handleCharacterSelect} />
  }

  // Render game over
  if (gameState === 'gameover') {
    return (
      <GameOver
        score={score}
        distance={distance}
        benefitsCollected={benefitsCollected}
        collectedBenefits={collectedBenefitIds}
        onRestart={resetGame}
        onMainMenu={goToMainMenu}
      />
    )
  }

  // Render 3D game
  return (
    <motion.div
      className="game-3d-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >

      {/* Benefit Notification - Top Center */}
      <BenefitNotification benefit={showBenefitNotification} />

      {/* Damage Vignette Effect */}
      <DamageVignette isVisible={showDamageVignette} />

      {/* Mobile HUD */}
      <MobileHUD
        score={score}
        lives={lives}
        distance={distance}
        benefitsCollected={benefitsCollected}
        speed={speed}
      />

      {/* 3D Canvas */}
      <Canvas
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0
        }}
        camera={{
          position: [0, 5, 10],
          fov: 70,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 2]} // Limit pixel ratio for mobile performance
      >

        <Suspense fallback={null}>
          {/* Game Scene (environment, lighting) */}
          <GameScene characterType={characterType} />

          {/* Player */}
          <Player3DModel
            characterType={characterType}
            position={[smoothLaneX, isJumping ? 2 : isDucking ? -0.5 : 0, 0]}
            isJumping={isJumping}
            isDucking={isDucking}
            isDamaged={isDamaged}
            isRunning={true}
          />

          {/* Items (obstacles and benefits) */}
          {items.map(item => {
            const ItemComponent = item.type === 'benefit' ? Benefit3D : Obstacle3D
            return (
              <ItemComponent
                key={item.uniqueKey || item.id}
                item={item}
                speed={speed}
                onCollision={(itemZ) => checkCollision(item, itemZ)}
              />
            )
          })}
        </Suspense>
      </Canvas>
    </motion.div>
  )
}

export default App

