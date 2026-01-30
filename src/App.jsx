import React from 'react'
import { Canvas } from '@react-three/fiber'
import { useEffect, useRef, useState, useCallback, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './App.css'

// 3D Components
import GameScene from './components/3d/GameScene'
import Player3DModel from './components/3d/Player3DModel'
import Obstacle3D from './components/3d/Obstacle3D'
import Benefit3D from './components/3d/Benefit3D'
import PlayerExplosion from './components/3d/PlayerExplosion'

// UI Components
import CharacterSelect from './components/CharacterSelect'
import MobileHUD from './components/MobileHUD'
import GameOver from './components/GameOver'
import BenefitNotification from './components/BenefitNotification'
import DamageVignette from './components/DamageVignette'
import Win from './components/Win'

// Game data
import { getRandomBenefit, getRandomObstacle, BENEFITS } from './config/gameData'

// Game constants
const GAME_CONFIG = {
  LANES: 3,
  LANE_WIDTH: 3,
  STARTING_LIVES: 3,
  BASE_SPEED: 0.08,
  MAX_SPEED: 0.30,
  SPEED_INCREASE_INTERVAL: 5000, // Increase every 5 seconds
  SPAWN_INTERVAL: 1200, // Spawn every 1.2 seconds (more frequent obstacles)
  BENEFIT_DISTANCE_INTERVAL: 100, // Spawn benefit every 100 meters
}

function App() {
  // Game state
  const [gameState, setGameState] = useState('select') // select, playing, exploding, gameover, win
  const [characterType, setCharacterType] = useState(null)

  // Player state
  const [playerLane, setPlayerLane] = useState(1) // 0 = left, 1 = center, 2 = right
  const [smoothLaneX, setSmoothLaneX] = useState(0) // Smooth interpolated X position
  const [smoothJumpY, setSmoothJumpY] = useState(0) // Smooth interpolated Y position for jump
  const [isJumping, setIsJumping] = useState(false)
  const [isDucking, setIsDucking] = useState(false)
  const [isDamaged, setIsDamaged] = useState(false) // Red flash on damage
  const [isInvincible, setIsInvincible] = useState(false) // 1 second invincibility after damage
  const [isExploding, setIsExploding] = useState(false) // Player death explosion
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
  const [finishLineActive, setFinishLineActive] = useState(false)
  const [finishLineZ, setFinishLineZ] = useState(null)

  // Refs
  const nextItemId = useRef(0)
  const lastSpawn = useRef(0)
  const lastSpeedIncrease = useRef(0)
  const lastBenefitDistance = useRef(0) // Track distance when last benefit was spawned
  const gameStartTime = useRef(null)
  const touchStartX = useRef(null)
  const touchStartY = useRef(null)

  // Web Audio API refs for reliable mobile sound
  const audioContextRef = useRef(null)
  const audioBuffersRef = useRef({})
  const audioInitializedRef = useRef(false)

  // Initialize Web Audio API
  const initAudio = useCallback(async () => {
    if (audioInitializedRef.current) return

    try {
      // Create AudioContext (with webkit prefix for older Safari)
      const AudioContext = window.AudioContext || window.webkit.AudioContext
      audioContextRef.current = new AudioContext()

      // Resume context if suspended (required for mobile)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume()
      }

      // Load all sound files
      const soundFiles = {
        dash: '/sounds/dash_sound.wav',
        jump: '/sounds/jump_sound.wav',
        hurt: '/sounds/hurt_sound.wav',
        collect: '/sounds/collect_sound.wav'
      }

      for (const [name, url] of Object.entries(soundFiles)) {
        try {
          const response = await fetch(url)
          const arrayBuffer = await response.arrayBuffer()
          const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer)
          audioBuffersRef.current[name] = audioBuffer
        } catch (e) {
          console.warn(`Failed to load sound: ${name}`, e)
        }
      }

      audioInitializedRef.current = true
    } catch (e) {
      console.warn('Web Audio API not supported', e)
    }
  }, [])

  // Play sound using Web Audio API
  const playSound = useCallback((soundName, volume = 0.5) => {
    if (!audioContextRef.current || !audioBuffersRef.current[soundName]) return

    try {
      // Resume context if suspended
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume()
      }

      const source = audioContextRef.current.createBufferSource()
      const gainNode = audioContextRef.current.createGain()

      source.buffer = audioBuffersRef.current[soundName]
      gainNode.gain.value = volume

      source.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)

      source.start(0)
    } catch (e) {
      // Silently fail
    }
  }, [])

  // Initialize audio on first user interaction
  useEffect(() => {
    const handleInteraction = () => {
      initAudio()
    }

    document.addEventListener('touchstart', handleInteraction, { once: true })
    document.addEventListener('click', handleInteraction, { once: true })

    return () => {
      document.removeEventListener('touchstart', handleInteraction)
      document.removeEventListener('click', handleInteraction)
    }
  }, [initAudio])

  // Sound play functions
  const playDashSound = useCallback(() => playSound('dash', 0.5), [playSound])
  const playJumpSound = useCallback(() => playSound('jump', 0.5), [playSound])
  const playHurtSound = useCallback(() => playSound('hurt', 0.6), [playSound])
  const playCollectSound = useCallback(() => playSound('collect', 0.5), [playSound])

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

  // Helper: check if all benefits collected
  const allBenefitsCollected = BENEFITS.every(b => collectedBenefitIds.includes(b.id))

  // Spawn items (benefits and obstacles)
  const spawnItem = useCallback(() => {
    if (allBenefitsCollected && !finishLineActive) {
      // Place finish line far ahead
      setFinishLineActive(true)
      setFinishLineZ(-120)
      return
    }
    if (allBenefitsCollected) return // No more obstacles/benefits

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
  }, [characterType, getLanePosition, distance, allBenefitsCollected, finishLineActive])

  // In game loop: move finish line Z if active
  useEffect(() => {
    if (gameState !== 'playing' || isExploding) return

    const gameLoop = setInterval(() => {
      const now = Date.now()

      // Update distance (slower increment)
      setDistance(prev => prev + speed * 10)

      // Move finish line Z if active and only in playing state
      if (gameState === 'playing' && finishLineActive && finishLineZ !== null) {
        setFinishLineZ(z => z + speed * 10)
      }

      // Dynamic spawn interval - decreases as speed increases
      // At base speed (0.08): 1200ms, at max speed (0.30): ~600ms
      const dynamicSpawnInterval = Math.max(600, GAME_CONFIG.SPAWN_INTERVAL - (speed - 0.08) * 2500)

      // Spawn items with dynamic interval
      if (now - lastSpawn.current > dynamicSpawnInterval) {
        lastSpawn.current = now
        spawnItem()
      }

      // Increase speed over time (more noticeable increment)
      if (now - lastSpeedIncrease.current > GAME_CONFIG.SPEED_INCREASE_INTERVAL) {
        lastSpeedIncrease.current = now
        setSpeed(prev => Math.min(GAME_CONFIG.MAX_SPEED, prev + 0.012))
      }
    }, 100)

    return () => clearInterval(gameLoop)
  }, [gameState, speed, spawnItem, isExploding, finishLineActive, finishLineZ])

  // After win/gameover/exploding, stop finish line updates
  useEffect(() => {
    if (gameState === 'win' || gameState === 'gameover' || isExploding) {
      setFinishLineActive(false)
      setFinishLineZ(null)
    }
  }, [gameState, isExploding])

  // Reset game
  const resetGame = useCallback(() => {
    setGameState('playing')
    setPlayerLane(1)
    setSmoothLaneX(0)
    setIsJumping(false)
    setIsDucking(false)
    setIsExploding(false) // Reset explosion state
    setIsInvincible(false) // Reset invincibility
    setScore(0)
    setLives(GAME_CONFIG.STARTING_LIVES)
    setDistance(0)
    setSpeed(GAME_CONFIG.BASE_SPEED)
    setBenefitsCollected(0)
    setCollectedBenefitIds([])
    setItems([])
    setFinishLineActive(false)
    setFinishLineZ(null)
    nextItemId.current = 0
    lastSpawn.current = Date.now()
    lastSpeedIncrease.current = Date.now()
    lastBenefitDistance.current = 0 // Reset benefit distance tracker
    gameStartTime.current = Date.now()
  }, [])

  const goToMainMenu = useCallback(() => {
    // Reset all game state first
    setPlayerLane(1)
    setSmoothLaneX(0)
    setIsJumping(false)
    setIsDucking(false)
    setIsExploding(false)
    setIsInvincible(false)
    setScore(0)
    setLives(GAME_CONFIG.STARTING_LIVES)
    setDistance(0)
    setSpeed(GAME_CONFIG.BASE_SPEED)
    setBenefitsCollected(0)
    setCollectedBenefitIds([])
    setItems([])
    setFinishLineActive(false)
    setFinishLineZ(null)
    nextItemId.current = 0
    lastSpawn.current = Date.now()
    lastSpeedIncrease.current = Date.now()
    lastBenefitDistance.current = 0
    gameStartTime.current = Date.now()

    // Then set to select screen and clear character
    setCharacterType(null)
    setGameState('select')
  }, [])

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

  // === Background Music ===
  const bgMusicRef = useRef(null)
  const [musicStarted, setMusicStarted] = useState(false)
  const [musicMuted, setMusicMuted] = useState(false)

  // Try to play music on every user gesture if not playing
  useEffect(() => {
    const tryPlayMusic = () => {
      if (bgMusicRef.current) {
        if (bgMusicRef.current.paused || bgMusicRef.current.currentTime === 0) {
          bgMusicRef.current.muted = musicMuted
          bgMusicRef.current.volume = musicMuted ? 0 : 0.18
          bgMusicRef.current.loop = true
          const playPromise = bgMusicRef.current.play()
          if (playPromise) {
            playPromise.then(() => {
              console.log('BG music started')
              setMusicStarted(true)
            }).catch((e) => {
              console.log('BG music play error:', e)
            })
          }
        }
      }
    }
    window.addEventListener('pointerdown', tryPlayMusic)
    window.addEventListener('touchstart', tryPlayMusic)
    window.addEventListener('keydown', tryPlayMusic)
    return () => {
      window.removeEventListener('pointerdown', tryPlayMusic)
      window.removeEventListener('touchstart', tryPlayMusic)
      window.removeEventListener('keydown', tryPlayMusic)
    }
  }, [musicMuted])

  // Toggle mute
  const toggleMusic = () => {
    setMusicMuted(m => {
      if (bgMusicRef.current) {
        bgMusicRef.current.muted = !m
        bgMusicRef.current.volume = !m ? 0 : 0.18
      }
      return !m
    })
  }

  // --- Always render audio element (no mute button) ---
  const AudioAndMute = (
    <audio
      ref={bgMusicRef}
      src={'/sounds/bg_music_sound.mp3'}
      preload="auto"
      autoPlay={false}
      loop
      style={{ display: 'none' }}
    />
  )

  // === Collision detection function (must be inside App for state access) ===
  const checkCollision = useCallback((item, itemZ) => {
    // Získaj lane hráča a jeho výšku (Y)
    const playerLaneVal = typeof playerLane === 'function' ? playerLane() : playerLane;
    const playerY = typeof smoothJumpY === 'function' ? smoothJumpY() : smoothJumpY;
    if (item.processed) return;
    if (item.lane !== playerLaneVal) return;
    let collisionZ = false;
    if (item.type === 'benefit') {
      if (Math.abs(itemZ) < 1.2 && playerY >= -0.1) collisionZ = true;
    } else {
      if (Math.abs(itemZ) < 1.1 && playerY < 0.3) collisionZ = true;
    }
    if (!collisionZ) return;
    item.processed = true;
    if (item.type === 'benefit') {
      playCollectSound && playCollectSound();
      setShowBenefitNotification && setShowBenefitNotification(item);
      setBenefitsCollected && setBenefitsCollected(prev => prev + 1);
      setCollectedBenefitIds && setCollectedBenefitIds(prev => prev.includes(item.benefitId) ? prev : [...prev, item.benefitId]);
      setItems && setItems(prev => prev.filter(i => i.uniqueKey !== item.uniqueKey));
    } else {
      if (isInvincible) return;
      playHurtSound && playHurtSound();
      setIsDamaged && setIsDamaged(true);
      setIsInvincible && setIsInvincible(true);
      setTimeout(() => {
        setIsDamaged && setIsDamaged(false);
        setIsInvincible && setIsInvincible(false);
      }, 1000);
      setLives && setLives(prev => {
        if (prev <= 1) {
          setIsExploding && setIsExploding(true);
          setTimeout(() => {
            setGameState && setGameState('gameover');
          }, 1200);
          return 0;
        }
        return prev - 1;
      });
      setItems && setItems(prev => prev.filter(i => i.uniqueKey !== item.uniqueKey));
    }
  }, [playerLane, smoothJumpY, isInvincible, setIsDamaged, setIsInvincible, setLives, setIsExploding, setGameState, setShowBenefitNotification, setBenefitsCollected, setCollectedBenefitIds, playHurtSound, playCollectSound, setItems]);

  // Clear benefit notification callback
  const clearBenefitNotification = useCallback(() => {
    setShowBenefitNotification(null)
  }, [])

  // Render character selection
  if (gameState === 'select') {
    return <>
      {AudioAndMute}
      <CharacterSelect onSelect={handleCharacterSelect} />
    </>
  }

  // Render game over
  if (gameState === 'gameover') {
    return <>
      {AudioAndMute}
      <GameOver
        score={score}
        distance={distance}
        benefitsCollected={benefitsCollected}
        collectedBenefits={collectedBenefitIds}
        onRestart={resetGame}
        onMainMenu={goToMainMenu}
      />
    </>
  }

  // Render win screen
  if (gameState === 'win') {
    return <>
      {AudioAndMute}
      <Win
        score={score}
        distance={distance}
        benefitsCollected={benefitsCollected}
        collectedBenefits={collectedBenefitIds}
        onRestart={resetGame}
        onMainMenu={goToMainMenu}
      />
    </>
  }

  // Render 3D game
  return (
    <ErrorBoundary>
      <>
      {AudioAndMute}
      {/* Bottom HUD Bar - Rendered outside game container for guaranteed visibility */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 99999,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          gap: '20px',
          padding: '12px 20px',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
          background: 'rgba(0, 0, 0, 0.95)',
          borderTop: '2px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#ffffff' }}>
          <span style={{ fontSize: '1.5rem' }}>📏</span>
          <span style={{ fontWeight: 800, color: '#ffffff' }}>{Math.floor(distance)}m</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#ffffff' }}>
          <span style={{ fontSize: '1.5rem' }}>🤝</span>
          <span style={{ fontWeight: 800, color: '#ffffff' }}>{benefitsCollected}</span>
        </div>
      </div>

      <motion.div
        className="game-3d-container"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
      >

        {/* Benefit Notification - Top Center */}
        <BenefitNotification benefit={showBenefitNotification} onComplete={clearBenefitNotification} />

        {/* Damage Vignette Effect */}
        <DamageVignette isVisible={showDamageVignette} />

        {/* Mobile HUD - Top bar only */}
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
          {/* Debug log for Canvas mount */}
          {console.log('Canvas mounted, gameState:', gameState)}
          {/* Game Scene (environment, lighting) */}
          <GameScene characterType={characterType} speed={isExploding ? 0 : speed} />

          {/* Player - hide when exploding */}
          {!isExploding && (
            <Player3DModel
              characterType={characterType}
              position={[smoothLaneX, isDucking ? -0.5 : smoothJumpY, 3]}
              isJumping={isJumping}
              isDucking={isDucking}
              isDamaged={isDamaged}
              isRunning={true}
              speed={speed}
            />
          )}

          {/* Player Explosion Effect */}
          {isExploding && (
            <PlayerExplosion
              position={[smoothLaneX, smoothJumpY, 0]}
              characterType={characterType}
            />
          )}

          {/* Items (obstacles and benefits) - freeze when exploding */}
          {items.map(item => {
            const ItemComponent = item.type === 'benefit' ? Benefit3D : Obstacle3D
            // Debug log for item spawn
            console.log('Rendering item', item)
            return (
              <ItemComponent
                key={item.uniqueKey || item.id}
                item={item}
                speed={isExploding ? 0 : speed}
                onCollision={(itemZ) => checkCollision(item, itemZ)}
              />
            )
          })}

          {/* In Canvas, render checkered finish line only if finishLineActive and finishLineZ is a finite number */}
          {finishLineActive && typeof finishLineZ === 'number' && Number.isFinite(finishLineZ) && (
            <group position={[0, 0.1, finishLineZ]}>
              {[...Array(10)].map((_, i) => (
                <mesh key={'w'+i} position={[-4.5 + i, 0, 0]}>
                  <boxGeometry args={[0.9, 0.2, 0.5]} />
                  <meshStandardMaterial color={i % 2 === 0 ? '#fff' : '#111'} />
                </mesh>
              ))}
              {[...Array(10)].map((_, i) => (
                <mesh key={'b'+i} position={[-4.5 + i, 0, 0.5]}>
                  <boxGeometry args={[0.9, 0.2, 0.5]} />
                  <meshStandardMaterial color={i % 2 === 1 ? '#fff' : '#111'} />
                </mesh>
              ))}
            </group>
            )}
        </Suspense>
      </Canvas>
    </motion.div>
    </>
    </ErrorBoundary>
  )
}

// ErrorBoundary for catching runtime errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    // Log error to console for debugging
    console.error('ErrorBoundary caught:', error, errorInfo)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'white', background: '#1a1a2e', padding: 24, fontSize: 18 }}>
          <h2>App Error</h2>
          <pre>{this.state.error && this.state.error.toString()}</pre>
          <pre style={{ fontSize: 14, color: '#f87171' }}>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

export default App
