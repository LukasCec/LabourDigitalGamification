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
  SPAWN_INTERVAL: 1200, // Spawn every 1.2 seconds (more frequent obstacles)
  BENEFIT_DISTANCE_INTERVAL: 100, // Spawn benefit every 100 meters
}

function App() {
  // Game state
  const [gameState, setGameState] = useState('select') // select, playing, gameover
  const [characterType, setCharacterType] = useState(null)

  // Player state
  const [playerLane, setPlayerLane] = useState(1) // 0 = left, 1 = center, 2 = right
  const [smoothLaneX, setSmoothLaneX] = useState(0) // Smooth interpolated X position
  const [smoothJumpY, setSmoothJumpY] = useState(0) // Smooth interpolated Y position for jump
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
  const lastBenefitDistance = useRef(0) // Track distance when last benefit was spawned
  const gameStartTime = useRef(null)
  const touchStartX = useRef(null)
  const touchStartY = useRef(null)
  const dashSoundRef = useRef(null)
  const jumpSoundRef = useRef(null)
  const hurtSoundRef = useRef(null)
  const collectSoundRef = useRef(null)
  const audioUnlockedRef = useRef(false)

  // Initialize and preload sounds for mobile
  useEffect(() => {
    // Create audio elements with preload
    const createAudio = (src, volume) => {
      const audio = new Audio(src)
      audio.preload = 'auto'
      audio.volume = volume
      // Force load the audio
      audio.load()
      return audio
    }

    dashSoundRef.current = createAudio('/sounds/dash_sound.wav', 0.5)
    jumpSoundRef.current = createAudio('/sounds/jump_sound.wav', 0.5)
    hurtSoundRef.current = createAudio('/sounds/hurt_sound.wav', 0.6)
    collectSoundRef.current = createAudio('/sounds/collect_sound.wav', 0.5)

    // Unlock audio on first user interaction (required for mobile)
    const unlockAudio = () => {
      if (audioUnlockedRef.current) return

      // Play and immediately pause all sounds to unlock them
      const sounds = [dashSoundRef, jumpSoundRef, hurtSoundRef, collectSoundRef]
      sounds.forEach(ref => {
        if (ref.current) {
          ref.current.play().then(() => {
            ref.current.pause()
            ref.current.currentTime = 0
          }).catch(() => {})
        }
      })

      audioUnlockedRef.current = true
      // Remove listeners after unlock
      document.removeEventListener('touchstart', unlockAudio)
      document.removeEventListener('touchend', unlockAudio)
      document.removeEventListener('click', unlockAudio)
    }

    document.addEventListener('touchstart', unlockAudio, { once: false })
    document.addEventListener('touchend', unlockAudio, { once: false })
    document.addEventListener('click', unlockAudio, { once: false })

    return () => {
      document.removeEventListener('touchstart', unlockAudio)
      document.removeEventListener('touchend', unlockAudio)
      document.removeEventListener('click', unlockAudio)
    }
  }, [])

  // Optimized sound play function - clone node for better mobile performance
  const playSound = useCallback((audioRef) => {
    if (audioRef.current) {
      try {
        // Clone the audio node for overlapping sounds and better mobile performance
        const clone = audioRef.current.cloneNode()
        clone.volume = audioRef.current.volume
        clone.play().catch(() => {})
        // Clean up clone after it finishes
        clone.onended = () => clone.remove()
      } catch {
        // Fallback to original method
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(() => {})
      }
    }
  }, [])

  // Play dash sound function
  const playDashSound = useCallback(() => {
    playSound(dashSoundRef)
  }, [playSound])

  // Play jump sound function
  const playJumpSound = useCallback(() => {
    playSound(jumpSoundRef)
  }, [playSound])

  // Play hurt sound function
  const playHurtSound = useCallback(() => {
    playSound(hurtSoundRef)
  }, [playSound])

  // Play collect sound function
  const playCollectSound = useCallback(() => {
    playSound(collectSoundRef)
  }, [playSound])

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

  // Refs for physics-based jump
  const jumpVelocityRef = useRef(0)
  const isInAirRef = useRef(false)
  const currentJumpYRef = useRef(0)
  const jumpRequestedRef = useRef(false) // Track if jump was requested

  // Handle jump request - when isJumping becomes true, set the request flag
  useEffect(() => {
    if (isJumping) {
      jumpRequestedRef.current = true
    }
  }, [isJumping])

  // Physics-based jump - realistic parabolic arc
  useEffect(() => {
    if (gameState !== 'playing') return

    let animationFrameId
    let lastTime = performance.now()

    const GRAVITY = 22 // Gravity acceleration
    const JUMP_VELOCITY = 11 // Initial upward velocity (higher = higher jump)

    const updateJump = (currentTime) => {
      const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.05) // Cap delta to avoid huge jumps
      lastTime = currentTime

      // Check if jump was requested and player is on ground
      if (jumpRequestedRef.current && !isInAirRef.current && currentJumpYRef.current <= 0.01) {
        jumpVelocityRef.current = JUMP_VELOCITY
        isInAirRef.current = true
        jumpRequestedRef.current = false // Clear the request
      }

      // If in air, apply physics
      if (isInAirRef.current) {
        // Apply velocity
        currentJumpYRef.current += jumpVelocityRef.current * deltaTime

        // Apply gravity to velocity
        jumpVelocityRef.current -= GRAVITY * deltaTime

        // Check if landed
        if (currentJumpYRef.current <= 0) {
          currentJumpYRef.current = 0
          jumpVelocityRef.current = 0
          isInAirRef.current = false
        }

        setSmoothJumpY(currentJumpYRef.current)
      }

      animationFrameId = requestAnimationFrame(updateJump)
    }

    animationFrameId = requestAnimationFrame(updateJump)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [gameState])

  // Character selection
  const handleCharacterSelect = (type) => {
    setCharacterType(type)
    setGameState('playing')
    gameStartTime.current = Date.now()
    lastSpawn.current = Date.now()
    lastSpeedIncrease.current = Date.now()
    setSmoothLaneX(0)
    setSmoothJumpY(0)
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
        playDashSound() // Play dash sound on lane change
        if (deltaX > 0) {
          setPlayerLane(prev => Math.min(2, prev + 1))
        } else {
          setPlayerLane(prev => Math.max(0, prev - 1))
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > threshold) {
        // Allow jump only when player is on the ground
        const isOnGround = !isInAirRef.current && currentJumpYRef.current < 0.1
        if (deltaY < 0 && isOnGround && !isDucking) {
          // Swipe up - jump
          playJumpSound() // Play jump sound
          setIsJumping(true)
          setTimeout(() => setIsJumping(false), 50) // Short pulse, physics handles the rest
        } else if (deltaY > 0 && !isDucking && isOnGround) {
          // Swipe down - duck
          setIsDucking(true)
          setTimeout(() => setIsDucking(false), 500)
        }
      }
    }

    touchStartX.current = null
    touchStartY.current = null
  }, [isDucking, playDashSound, playJumpSound])

  // Keyboard controls (for testing on desktop)
  useEffect(() => {
    if (gameState !== 'playing') return

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        playDashSound() // Play dash sound on lane change
        setPlayerLane(prev => Math.max(0, prev - 1))
      } else if (e.key === 'ArrowRight') {
        playDashSound() // Play dash sound on lane change
        setPlayerLane(prev => Math.min(2, prev + 1))
      } else if (e.key === 'ArrowUp' || e.key === ' ') {
        const isOnGround = !isInAirRef.current && currentJumpYRef.current < 0.1
        if (isOnGround && !isDucking) {
          playJumpSound() // Play jump sound
          setIsJumping(true)
          setTimeout(() => setIsJumping(false), 50)
        }
      } else if (e.key === 'ArrowDown') {
        const isOnGround = !isInAirRef.current && currentJumpYRef.current < 0.1
        if (!isDucking && isOnGround) {
          setIsDucking(true)
          setTimeout(() => setIsDucking(false), 500)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState, isDucking, playDashSound, playJumpSound])

  // Spawn items (benefits and obstacles)
  const spawnItem = useCallback(() => {
    // Benefits spawn only every 200 meters
    const shouldSpawnBenefit = distance - lastBenefitDistance.current >= GAME_CONFIG.BENEFIT_DISTANCE_INTERVAL

    const newItems = []

    if (shouldSpawnBenefit) {
      lastBenefitDistance.current = distance // Update last benefit distance
      const lane = Math.floor(Math.random() * GAME_CONFIG.LANES)
      const itemId = nextItemId.current++
      const benefit = getRandomBenefit()
      newItems.push({
        id: itemId,
        uniqueKey: `benefit-${itemId}`,
        type: 'benefit',
        lane,
        position: [getLanePosition(lane), 0.5, -80],
        processed: false,
        avoided: false,
        benefitId: benefit.id,
        name: benefit.name,
        icon: benefit.icon,
        shortDesc: benefit.shortDesc,
        description: benefit.description,
        color: benefit.color,
        points: benefit.points
      })
    } else {
      // Determine how many obstacles to spawn (1 or 2, with 40% chance for 2)
      const spawnDouble = Math.random() < 0.4
      const numObstacles = spawnDouble ? 2 : 1

      // Get available lanes and shuffle them
      const availableLanes = [0, 1, 2]
      for (let i = availableLanes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableLanes[i], availableLanes[j]] = [availableLanes[j], availableLanes[i]]
      }

      // Spawn obstacles on different lanes
      for (let i = 0; i < numObstacles; i++) {
        const lane = availableLanes[i]
        const itemId = nextItemId.current++
        const obstacle = getRandomObstacle(characterType)
        newItems.push({
          id: itemId,
          uniqueKey: `obstacle-${itemId}`,
          type: 'obstacle',
          lane,
          position: [getLanePosition(lane), 0, -80],
          processed: false,
          avoided: false,
          obstacleId: obstacle.id,
          name: obstacle.name,
          icon: obstacle.icon,
          damage: obstacle.damage,
          size: obstacle.size
        })
      }
    }

    setItems(prev => [...prev, ...newItems])
  }, [characterType, getLanePosition, distance])

  // Collision detection - only triggers once per item
  const checkCollision = useCallback((item, itemZ) => {
    // Remove items that passed the player (far behind - increased to 20 so disappearing is not visible)
    if (itemZ > 20) {
      setItems(prev => prev.filter(i => i.id !== item.id))
      return true
    }

    // Check if item is in collision zone (tight zone near player)
    if (itemZ > -1 && itemZ < 1.5) {
      // Check if item already processed or avoided (use state, not direct mutation)
      if (item.processed || item.avoided) return false

      if (item.lane === playerLane) {
        if (item.type === 'benefit') {
          // Play collect sound
          playCollectSound()

          // Collect benefit - use benefit's actual ID (e.g., 'legal', 'strike')
          setScore(prev => prev + item.points)
          setBenefitsCollected(prev => prev + 1)
          // Store the benefit type ID (benefitId), not the item's unique ID
          setCollectedBenefitIds(prev => [...new Set([...prev, item.benefitId])])

          // Show benefit notification
          setShowBenefitNotification({
            name: item.name,
            icon: item.icon,
            points: item.points
          })
          setTimeout(() => setShowBenefitNotification(null), 3000) // Hide after 3 seconds

          // Remove only this specific item by its unique ID
          setItems(prev => prev.filter(i => i.id !== item.id))
          return true
        } else {
          // Hit obstacle - check if jumping high enough or ducking
          // Unjumpable obstacles ALWAYS deal damage - cannot be avoided by jumping
          const isUnjumpable = item.size === 'unjumpable'
          const isHighEnough = smoothJumpY > 1.0

          if (isUnjumpable || (!isHighEnough && !isDucking)) {
            // Play hurt sound
            playHurtSound()

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
            // Remove only this specific item by its unique ID
            setItems(prev => prev.filter(i => i.id !== item.id))
            return true
          } else {
            // Successfully avoided by jumping/ducking - add points
            // Mark as avoided in state to prevent re-processing
            setScore(prev => prev + 10)
            setItems(prev => prev.map(i =>
              i.id === item.id ? { ...i, avoided: true } : i
            ))
            return false // Don't remove, let it pass
          }
        }
      }
    }

    return false
  }, [playerLane, smoothJumpY, isDucking, playHurtSound, playCollectSound])

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return

    const gameLoop = setInterval(() => {
      const now = Date.now()

      // Update distance (slower increment)
      setDistance(prev => prev + speed * 10)

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
    lastBenefitDistance.current = 0 // Reset benefit distance tracker
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
            position={[smoothLaneX, isDucking ? -0.5 : smoothJumpY, 0]}
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

