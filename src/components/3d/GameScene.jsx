import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

export default function GameScene({ characterType, speed = 0.08 }) {
  const floorRef1 = useRef()
  const floorRef2 = useRef()
  const floorRef3 = useRef()
  const isOffice = characterType === 'office'

  // Track environment objects for dynamic generation
  const [leftObjects, setLeftObjects] = useState(() =>
    Array.from({ length: 6 }, (_, i) => ({ id: i, z: -30 - i * 20 }))
  )
  const [rightObjects, setRightObjects] = useState(() =>
    Array.from({ length: 6 }, (_, i) => ({ id: i + 100, z: -30 - i * 20 }))
  )

  // Separate tracking for decorations (independent from walls)
  const [decorations, setDecorations] = useState(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i + 500,
      z: -20 - i * 25,
      type: i % 2 === 0 ? 'cooler' : 'plant',
      side: i % 2 === 0 ? 'left' : 'right'
    }))
  )
  const nextDecorationId = useRef(600)

  const nextLeftId = useRef(200)
  const nextRightId = useRef(300)

  const FLOOR_LENGTH = 100
  const FLOOR_RESET_THRESHOLD = 80 // Increased so floor disappears further behind camera
  const FLOOR_RESET_POSITION = -150

  // Animate floor and environment objects moving towards camera
  useFrame((state, delta) => {
    // Speed multiplier based on game speed (scales with difficulty)
    const moveSpeed = delta * speed * 200

    // Move floor tiles - creates infinite scrolling effect
    const floors = [floorRef1.current, floorRef2.current, floorRef3.current]
    floors.forEach(floor => {
      if (floor) {
        floor.position.z += moveSpeed
        if (floor.position.z > FLOOR_RESET_THRESHOLD) {
          // Find the furthest floor position
          const furthestZ = Math.min(...floors.filter(f => f !== floor).map(f => f.position.z))
          floor.position.z = furthestZ - FLOOR_LENGTH
        }
      }
    })

    // Move left side objects
    setLeftObjects(prev => {
      const updated = prev.map(obj => ({
        ...obj,
        z: obj.z + moveSpeed
      }))

      // Remove objects that passed the camera - increased to 30 so they disappear further behind
      const filtered = updated.filter(obj => obj.z < 30)

      // Add new object if needed (maintain 6 objects)
      if (filtered.length < 6) {
        const lastZ = Math.min(...filtered.map(o => o.z))
        filtered.push({ id: nextLeftId.current++, z: lastZ - 20 })
      }

      return filtered
    })

    // Move right side objects
    setRightObjects(prev => {
      const updated = prev.map(obj => ({
        ...obj,
        z: obj.z + moveSpeed
      }))

      // Remove objects that passed the camera - increased to 30
      const filtered = updated.filter(obj => obj.z < 30)

      if (filtered.length < 6) {
        const lastZ = Math.min(...filtered.map(o => o.z))
        filtered.push({ id: nextRightId.current++, z: lastZ - 20 })
      }

      return filtered
    })

    // Move decorations independently
    setDecorations(prev => {
      const updated = prev.map(obj => ({
        ...obj,
        z: obj.z + moveSpeed
      }))

      // Remove decorations that passed far behind camera
      const filtered = updated.filter(obj => obj.z < 35)

      // Add new decorations if needed (maintain 8 decorations)
      while (filtered.length < 8) {
        const lastZ = Math.min(...filtered.map(o => o.z))
        const newType = nextDecorationId.current % 3 === 0 ? 'cooler' : 'plant'
        const newSide = nextDecorationId.current % 2 === 0 ? 'left' : 'right'
        filtered.push({
          id: nextDecorationId.current++,
          z: lastZ - 25,
          type: newType,
          side: newSide
        })
      }

      return filtered
    })
  })

  return (
    <>
      {/* Background - solid color, no async loading */}
      <color attach="background" args={[isOffice ? '#87CEEB' : '#1a1a2e']} />

      {/* Fog for depth effect */}
      <fog attach="fog" args={[isOffice ? '#87CEEB' : '#1a1a2e', 30, 100]} />

      {/* Enhanced Lighting - replaces Environment */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 15, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        color={isOffice ? '#fff5e6' : '#ffffff'}
      />
      <directionalLight
        position={[-5, 10, -5]}
        intensity={0.4}
        color={isOffice ? '#ffe4c4' : '#4a6fa5'}
      />
      <hemisphereLight
        intensity={0.5}
        color={isOffice ? '#87CEEB' : '#4a6fa5'}
        groundColor={isOffice ? '#8B4513' : '#1a1a2e'}
      />
      {/* Point light for extra fill */}
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#ffffff" />

      {/* Floor/Ground - 3 tiles for seamless infinite scrolling */}
      <mesh
        ref={floorRef1}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.5, 0]}
        receiveShadow
      >
        <planeGeometry args={[20, 100]} />
        <meshStandardMaterial
          color={isOffice ? '#cbd5e1' : '#52525b'}
          roughness={0.8}
          metalness={0.2}
        >
          <primitive
            attach="map"
            object={createGridTexture(isOffice)}
          />
        </meshStandardMaterial>
      </mesh>

      <mesh
        ref={floorRef2}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.5, -100]}
        receiveShadow
      >
        <planeGeometry args={[20, 100]} />
        <meshStandardMaterial
          color={isOffice ? '#cbd5e1' : '#52525b'}
          roughness={0.8}
          metalness={0.2}
        >
          <primitive
            attach="map"
            object={createGridTexture(isOffice)}
          />
        </meshStandardMaterial>
      </mesh>

      <mesh
        ref={floorRef3}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.5, -200]}
        receiveShadow
      >
        <planeGeometry args={[20, 100]} />
        <meshStandardMaterial
          color={isOffice ? '#cbd5e1' : '#52525b'}
          roughness={0.8}
          metalness={0.2}
        >
          <primitive
            attach="map"
            object={createGridTexture(isOffice)}
          />
        </meshStandardMaterial>
      </mesh>

      {/* Contact shadows for better depth perception */}
      <ContactShadows
        position={[0, -0.49, 0]}
        opacity={0.5}
        scale={20}
        blur={2}
        far={10}
      />

      {/* Lane markers */}
      <LaneMarkers />

      {/* Environment decorations - dynamically generated */}
      {isOffice ? (
        <OfficeEnvironment leftObjects={leftObjects} rightObjects={rightObjects} decorations={decorations} />
      ) : (
        <FactoryEnvironment leftObjects={leftObjects} rightObjects={rightObjects} decorations={decorations} />
      )}
    </>
  )
}

// Cache for floor textures
const textureCache = {
  office: null,
  factory: null
}

// Create grid texture for floor (with caching)
function createGridTexture(isOffice) {
  const cacheKey = isOffice ? 'office' : 'factory'
  if (textureCache[cacheKey]) {
    return textureCache[cacheKey]
  }

  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = isOffice ? '#cbd5e1' : '#52525b'
  ctx.fillRect(0, 0, 512, 512)

  // Grid lines
  ctx.strokeStyle = isOffice ? 'rgba(100, 116, 139, 0.3)' : 'rgba(255, 165, 0, 0.3)'
  ctx.lineWidth = 2

  const gridSize = 64
  for (let i = 0; i <= 512; i += gridSize) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i, 512)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(0, i)
    ctx.lineTo(512, i)
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(4, 20)

  textureCache[cacheKey] = texture
  return texture
}

// Lane markers
function LaneMarkers() {
  return (
    <>
      {[-3, 3].map((x, i) => (
        <mesh key={i} position={[x, -0.48, 0]}>
          <boxGeometry args={[0.1, 0.02, 100]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </>
  )
}

// Office environment decorations - dynamic with walls, ceiling, windows
function OfficeEnvironment({ leftObjects, rightObjects, decorations }) {
  return (
    <>
      {/* === LEFT WALL === */}
      {leftObjects.map((obj) => (
        <group key={`left-${obj.id}`} position={[-9, 0, obj.z]}>
          {/* Main wall */}
          <mesh position={[0, 3, 0]}>
            <boxGeometry args={[0.3, 7, 18]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
          </mesh>

          {/* Window frame */}
          <mesh position={[0.2, 3.5, 0]}>
            <boxGeometry args={[0.1, 4, 8]} />
            <meshStandardMaterial color="#64748b" metalness={0.5} roughness={0.3} />
          </mesh>

          {/* Window glass with sky reflection */}
          <mesh position={[0.25, 3.5, 0]}>
            <boxGeometry args={[0.05, 3.6, 7.6]} />
            <meshStandardMaterial
              color="#87ceeb"
              transparent
              opacity={0.5}
              roughness={0.05}
              metalness={0.95}
              envMapIntensity={1}
            />
          </mesh>

          {/* Window dividers */}
          <mesh position={[0.28, 3.5, 0]}>
            <boxGeometry args={[0.02, 3.6, 0.1]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
          <mesh position={[0.28, 3.5, 2]}>
            <boxGeometry args={[0.02, 3.6, 0.1]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
          <mesh position={[0.28, 3.5, -2]}>
            <boxGeometry args={[0.02, 3.6, 0.1]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>

          {/* Baseboard */}
          <mesh position={[0.2, 0.1, 0]}>
            <boxGeometry args={[0.15, 0.2, 18]} />
            <meshStandardMaterial color="#475569" />
          </mesh>

          {/* Wall art / poster */}
          <mesh position={[0.2, 2, 5]}>
            <boxGeometry args={[0.05, 1.5, 1]} />
            <meshStandardMaterial color="#3b82f6" />
          </mesh>
        </group>
      ))}

      {/* === RIGHT WALL === */}
      {rightObjects.map((obj) => (
        <group key={`right-${obj.id}`} position={[9, 0, obj.z]}>
          {/* Main wall */}
          <mesh position={[0, 3, 0]}>
            <boxGeometry args={[0.3, 7, 18]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
          </mesh>

          {/* Window frame */}
          <mesh position={[-0.2, 3.5, 0]}>
            <boxGeometry args={[0.1, 4, 8]} />
            <meshStandardMaterial color="#64748b" metalness={0.5} roughness={0.3} />
          </mesh>

          {/* Window glass */}
          <mesh position={[-0.25, 3.5, 0]}>
            <boxGeometry args={[0.05, 3.6, 7.6]} />
            <meshStandardMaterial
              color="#87ceeb"
              transparent
              opacity={0.5}
              roughness={0.05}
              metalness={0.95}
            />
          </mesh>

          {/* Window dividers */}
          <mesh position={[-0.28, 3.5, 0]}>
            <boxGeometry args={[0.02, 3.6, 0.1]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
          <mesh position={[-0.28, 3.5, 2]}>
            <boxGeometry args={[0.02, 3.6, 0.1]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
          <mesh position={[-0.28, 3.5, -2]}>
            <boxGeometry args={[0.02, 3.6, 0.1]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>

          {/* Baseboard */}
          <mesh position={[-0.2, 0.1, 0]}>
            <boxGeometry args={[0.15, 0.2, 18]} />
            <meshStandardMaterial color="#475569" />
          </mesh>

          {/* Whiteboard */}
          <mesh position={[-0.2, 2.5, -5]}>
            <boxGeometry args={[0.05, 1.8, 2.5]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[-0.18, 2.5, -5]}>
            <boxGeometry args={[0.02, 1.6, 2.3]} />
            <meshStandardMaterial color="#e2e8f0" />
          </mesh>
        </group>
      ))}

      {/* === CEILING === Continuous ceiling panels */}
      {leftObjects.map((obj) => (
        <group key={`ceiling-${obj.id}`} position={[0, 6.5, obj.z]}>
          {/* Ceiling panel - larger to eliminate gaps */}
          <mesh rotation={[Math.PI / 2, 0, 0]} receiveShadow={false}>
            <planeGeometry args={[18, 22]} />
            <meshStandardMaterial
              color="#f1f5f9"
              roughness={0.95}
              side={2}
            />
          </mesh>
        </group>
      ))}

      {/* === CEILING LIGHTS (fluorescent panels) === */}
      {leftObjects.map((obj, i) => (
        <group key={`light-panel-${obj.id}`}>
          {/* Light panel left */}
          <mesh position={[-3, 6.3, obj.z]}>
            <boxGeometry args={[2, 0.1, 4]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.8}
            />
          </mesh>
          <pointLight
            position={[-3, 5.5, obj.z]}
            intensity={0.6}
            distance={12}
            color="#fff5e6"
          />

          {/* Light panel right */}
          <mesh position={[3, 6.3, obj.z]}>
            <boxGeometry args={[2, 0.1, 4]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.8}
            />
          </mesh>
          <pointLight
            position={[3, 5.5, obj.z]}
            intensity={0.6}
            distance={12}
            color="#fff5e6"
          />
        </group>
      ))}

      {/* === DECORATIVE ELEMENTS - Independent movement === */}
      {decorations.map((dec) => {
        if (dec.type === 'cooler' && dec.side === 'left') {
          return (
            <group key={`cooler-${dec.id}`} position={[-7.5, 0, dec.z]}>
              <mesh position={[0, 0.6, 0]}>
                <cylinderGeometry args={[0.3, 0.35, 1.2, 16]} />
                <meshStandardMaterial color="#e0f2fe" transparent opacity={0.7} />
              </mesh>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.5, 0.3, 0.5]} />
                <meshStandardMaterial color="#64748b" />
              </mesh>
            </group>
          )
        }
        if (dec.type === 'plant' && dec.side === 'right') {
          return (
            <group key={`plant-${dec.id}`} position={[7.5, 0, dec.z]}>
              {/* Pot */}
              <mesh position={[0, 0.3, 0]}>
                <cylinderGeometry args={[0.25, 0.2, 0.5, 16]} />
                <meshStandardMaterial color="#92400e" />
              </mesh>
              {/* Plant */}
              <mesh position={[0, 0.8, 0]}>
                <sphereGeometry args={[0.4, 8, 8]} />
                <meshStandardMaterial color="#22c55e" />
              </mesh>
            </group>
          )
        }
        if (dec.type === 'plant' && dec.side === 'left') {
          return (
            <group key={`plant-l-${dec.id}`} position={[-7.5, 0, dec.z]}>
              <mesh position={[0, 0.3, 0]}>
                <cylinderGeometry args={[0.25, 0.2, 0.5, 16]} />
                <meshStandardMaterial color="#92400e" />
              </mesh>
              <mesh position={[0, 0.8, 0]}>
                <sphereGeometry args={[0.4, 8, 8]} />
                <meshStandardMaterial color="#22c55e" />
              </mesh>
            </group>
          )
        }
        if (dec.type === 'cooler' && dec.side === 'right') {
          return (
            <group key={`cooler-r-${dec.id}`} position={[7.5, 0, dec.z]}>
              <mesh position={[0, 0.6, 0]}>
                <cylinderGeometry args={[0.3, 0.35, 1.2, 16]} />
                <meshStandardMaterial color="#e0f2fe" transparent opacity={0.7} />
              </mesh>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.5, 0.3, 0.5]} />
                <meshStandardMaterial color="#64748b" />
              </mesh>
            </group>
          )
        }
        return null
      })}
    </>
  )
}

// Factory environment decorations - dynamic industrial setting
function FactoryEnvironment({ leftObjects, rightObjects, decorations }) {
  return (
    <>
      {/* === LEFT WALL - Industrial with corrugated metal look === */}
      {leftObjects.map((obj) => (
        <group key={`left-${obj.id}`} position={[-9, 0, obj.z]}>
          {/* Main wall - corrugated metal */}
          <mesh position={[0, 3.5, 0]}>
            <boxGeometry args={[0.4, 8, 18]} />
            <meshStandardMaterial
              color="#52525b"
              roughness={0.7}
              metalness={0.6}
            />
          </mesh>

          {/* Yellow safety stripe at bottom */}
          <mesh position={[0.25, 0.5, 0]}>
            <boxGeometry args={[0.1, 1, 18]} />
            <meshStandardMaterial color="#eab308" />
          </mesh>

          {/* Horizontal pipes running along wall */}
          <mesh position={[0.4, 5, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 18, 8]} />
            <meshStandardMaterial color="#f97316" roughness={0.4} metalness={0.8} />
          </mesh>
          <mesh position={[0.4, 4, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 18, 8]} />
            <meshStandardMaterial color="#3b82f6" roughness={0.4} metalness={0.8} />
          </mesh>

          {/* Vertical support beam */}
          <mesh position={[0.3, 3.5, 6]}>
            <boxGeometry args={[0.2, 8, 0.2]} />
            <meshStandardMaterial color="#78716c" metalness={0.7} roughness={0.5} />
          </mesh>
          <mesh position={[0.3, 3.5, -6]}>
            <boxGeometry args={[0.2, 8, 0.2]} />
            <meshStandardMaterial color="#78716c" metalness={0.7} roughness={0.5} />
          </mesh>

          {/* Warning sign */}
          <mesh position={[0.25, 2.5, 3]}>
            <boxGeometry args={[0.05, 0.8, 0.8]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.2} />
          </mesh>
        </group>
      ))}

      {/* === RIGHT WALL - Industrial === */}
      {rightObjects.map((obj) => (
        <group key={`right-${obj.id}`} position={[9, 0, obj.z]}>
          {/* Main wall */}
          <mesh position={[0, 3.5, 0]}>
            <boxGeometry args={[0.4, 8, 18]} />
            <meshStandardMaterial
              color="#52525b"
              roughness={0.7}
              metalness={0.6}
            />
          </mesh>

          {/* Yellow safety stripe */}
          <mesh position={[-0.25, 0.5, 0]}>
            <boxGeometry args={[0.1, 1, 18]} />
            <meshStandardMaterial color="#eab308" />
          </mesh>

          {/* Electrical conduit */}
          <mesh position={[-0.4, 5.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 18, 8]} />
            <meshStandardMaterial color="#71717a" roughness={0.3} metalness={0.9} />
          </mesh>

          {/* Control panel */}
          <mesh position={[-0.2, 2, -4]}>
            <boxGeometry args={[0.15, 1.5, 1]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[-0.12, 2.2, -4]}>
            <boxGeometry args={[0.02, 0.15, 0.15]} />
            <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[-0.12, 1.9, -4]}>
            <boxGeometry args={[0.02, 0.15, 0.15]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
          </mesh>

          {/* Vertical support beam */}
          <mesh position={[-0.3, 3.5, 5]}>
            <boxGeometry args={[0.2, 8, 0.2]} />
            <meshStandardMaterial color="#78716c" metalness={0.7} roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* === CEILING - Industrial with metal beams === */}
      {leftObjects.map((obj) => (
        <group key={`ceiling-${obj.id}`} position={[0, 7.5, obj.z]}>
          {/* Main ceiling panel - dark industrial */}
          <mesh rotation={[Math.PI / 2, 0, 0]} receiveShadow={false}>
            <planeGeometry args={[18, 22]} />
            <meshStandardMaterial
              color="#27272a"
              roughness={0.9}
              metalness={0.3}
              side={2}
            />
          </mesh>

          {/* Cross beams */}
          <mesh position={[0, -0.3, 0]}>
            <boxGeometry args={[18, 0.4, 0.3]} />
            <meshStandardMaterial color="#f97316" metalness={0.7} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.3, 8]}>
            <boxGeometry args={[18, 0.4, 0.3]} />
            <meshStandardMaterial color="#f97316" metalness={0.7} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.3, -8]}>
            <boxGeometry args={[18, 0.4, 0.3]} />
            <meshStandardMaterial color="#f97316" metalness={0.7} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* === INDUSTRIAL LIGHTING === */}
      {leftObjects.map((obj) => (
        <group key={`light-${obj.id}`}>
          {/* Hanging industrial light left */}
          <group position={[-4, 6.5, obj.z]}>
            <mesh>
              <cylinderGeometry args={[0.4, 0.5, 0.3, 8]} />
              <meshStandardMaterial color="#18181b" metalness={0.8} />
            </mesh>
            <mesh position={[0, -0.2, 0]}>
              <cylinderGeometry args={[0.35, 0.35, 0.1, 8]} />
              <meshStandardMaterial
                color="#fef3c7"
                emissive="#fbbf24"
                emissiveIntensity={1}
              />
            </mesh>
            <pointLight
              position={[0, -0.5, 0]}
              intensity={0.8}
              distance={10}
              color="#fbbf24"
            />
          </group>

          {/* Hanging industrial light right */}
          <group position={[4, 6.5, obj.z]}>
            <mesh>
              <cylinderGeometry args={[0.4, 0.5, 0.3, 8]} />
              <meshStandardMaterial color="#18181b" metalness={0.8} />
            </mesh>
            <mesh position={[0, -0.2, 0]}>
              <cylinderGeometry args={[0.35, 0.35, 0.1, 8]} />
              <meshStandardMaterial
                color="#fef3c7"
                emissive="#fbbf24"
                emissiveIntensity={1}
              />
            </mesh>
            <pointLight
              position={[0, -0.5, 0]}
              intensity={0.8}
              distance={10}
              color="#fbbf24"
            />
          </group>
        </group>
      ))}

      {/* === OVERHEAD CRANE RAILS === */}
      {leftObjects.slice(0, 3).map((obj) => (
        <group key={`crane-rail-${obj.id}`} position={[0, 6.8, obj.z]}>
          {/* I-beam rail */}
          <mesh>
            <boxGeometry args={[16, 0.15, 0.4]} />
            <meshStandardMaterial color="#f97316" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[16, 0.1, 0.15]} />
            <meshStandardMaterial color="#f97316" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* === DECORATIONS - Industrial objects === */}
      {decorations.map((dec) => {
        // Barrels on left side
        if (dec.type === 'cooler' && dec.side === 'left') {
          return (
            <group key={`barrel-${dec.id}`} position={[-7.5, 0, dec.z]}>
              {/* Oil barrel */}
              <mesh position={[0, 0.6, 0]}>
                <cylinderGeometry args={[0.35, 0.35, 1.2, 16]} />
                <meshStandardMaterial color="#1e40af" roughness={0.6} metalness={0.4} />
              </mesh>
              {/* Barrel rings */}
              <mesh position={[0, 0.9, 0]}>
                <torusGeometry args={[0.36, 0.03, 8, 16]} />
                <meshStandardMaterial color="#71717a" metalness={0.8} />
              </mesh>
              <mesh position={[0, 0.3, 0]}>
                <torusGeometry args={[0.36, 0.03, 8, 16]} />
                <meshStandardMaterial color="#71717a" metalness={0.8} />
              </mesh>
            </group>
          )
        }
        // Toolbox/crate on right side
        if (dec.type === 'plant' && dec.side === 'right') {
          return (
            <group key={`crate-${dec.id}`} position={[7.5, 0, dec.z]}>
              {/* Metal toolbox */}
              <mesh position={[0, 0.3, 0]}>
                <boxGeometry args={[0.8, 0.5, 0.5]} />
                <meshStandardMaterial color="#dc2626" roughness={0.6} metalness={0.5} />
              </mesh>
              <mesh position={[0, 0.6, 0]}>
                <boxGeometry args={[0.6, 0.1, 0.3]} />
                <meshStandardMaterial color="#7f1d1d" metalness={0.6} />
              </mesh>
            </group>
          )
        }
        // Pallet stack on left
        if (dec.type === 'plant' && dec.side === 'left') {
          return (
            <group key={`pallet-${dec.id}`} position={[-7.5, 0, dec.z]}>
              {/* Wooden pallet */}
              <mesh position={[0, 0.1, 0]}>
                <boxGeometry args={[1, 0.15, 1]} />
                <meshStandardMaterial color="#92400e" roughness={0.9} />
              </mesh>
              {/* Boxes on pallet */}
              <mesh position={[0, 0.4, 0]}>
                <boxGeometry args={[0.7, 0.5, 0.7]} />
                <meshStandardMaterial color="#78716c" />
              </mesh>
            </group>
          )
        }
        // Safety cone on right
        if (dec.type === 'cooler' && dec.side === 'right') {
          return (
            <group key={`cone-${dec.id}`} position={[7.5, 0, dec.z]}>
              {/* Safety cone */}
              <mesh position={[0, 0.35, 0]}>
                <coneGeometry args={[0.2, 0.7, 8]} />
                <meshStandardMaterial color="#f97316" />
              </mesh>
              {/* White stripe */}
              <mesh position={[0, 0.4, 0]}>
                <torusGeometry args={[0.12, 0.03, 8, 16]} />
                <meshStandardMaterial color="#ffffff" />
              </mesh>
              {/* Base */}
              <mesh position={[0, 0.02, 0]}>
                <boxGeometry args={[0.4, 0.04, 0.4]} />
                <meshStandardMaterial color="#1e1e1e" />
              </mesh>
            </group>
          )
        }
        return null
      })}
    </>
  )
}

