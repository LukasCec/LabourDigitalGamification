import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

export default function GameScene({ characterType }) {
  const floorRef = useRef()
  const isOffice = characterType === 'office'

  // Track environment objects for dynamic generation
  const [leftObjects, setLeftObjects] = useState(() =>
    Array.from({ length: 6 }, (_, i) => ({ id: i, z: -30 - i * 20 }))
  )
  const [rightObjects, setRightObjects] = useState(() =>
    Array.from({ length: 6 }, (_, i) => ({ id: i + 100, z: -30 - i * 20 }))
  )

  const nextLeftId = useRef(200)
  const nextRightId = useRef(300)

  // Animate floor and environment objects moving towards camera
  useFrame((state, delta) => {
    const moveSpeed = delta * 16 // Faster movement

    // Move floor
    if (floorRef.current) {
      floorRef.current.position.z += moveSpeed
      if (floorRef.current.position.z > 20) {
        floorRef.current.position.z = -20
      }
    }

    // Move left side objects
    setLeftObjects(prev => {
      const updated = prev.map(obj => ({
        ...obj,
        z: obj.z + moveSpeed
      }))

      // Remove objects that passed the camera
      const filtered = updated.filter(obj => obj.z < 10)

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

      const filtered = updated.filter(obj => obj.z < 10)

      if (filtered.length < 6) {
        const lastZ = Math.min(...filtered.map(o => o.z))
        filtered.push({ id: nextRightId.current++, z: lastZ - 20 })
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

      {/* Floor/Ground */}
      <mesh
        ref={floorRef}
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
        <OfficeEnvironment leftObjects={leftObjects} rightObjects={rightObjects} />
      ) : (
        <FactoryEnvironment leftObjects={leftObjects} rightObjects={rightObjects} />
      )}
    </>
  )
}

// Create grid texture for floor
function createGridTexture(isOffice) {
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

// Office environment decorations - dynamic
function OfficeEnvironment({ leftObjects, rightObjects }) {
  return (
    <>
      {/* Left wall with windows - dynamically positioned */}
      {leftObjects.map((obj) => (
        <group key={`left-${obj.id}`} position={[-8, 0, obj.z]}>
          <mesh position={[0, 2, 0]}>
            <boxGeometry args={[0.5, 8, 4]} />
            <meshStandardMaterial color="#3b82f6" roughness={0.3} />
          </mesh>
          {/* Windows */}
          <mesh position={[0.3, 2, 0]}>
            <boxGeometry args={[0.1, 3, 2]} />
            <meshStandardMaterial
              color="#87ceeb"
              transparent
              opacity={0.6}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>
        </group>
      ))}

      {/* Right wall with windows - dynamically positioned */}
      {rightObjects.map((obj) => (
        <group key={`right-${obj.id}`} position={[8, 0, obj.z]}>
          <mesh position={[0, 2, 0]}>
            <boxGeometry args={[0.5, 8, 4]} />
            <meshStandardMaterial color="#3b82f6" roughness={0.3} />
          </mesh>
          {/* Windows */}
          <mesh position={[-0.3, 2, 0]}>
            <boxGeometry args={[0.1, 3, 2]} />
            <meshStandardMaterial
              color="#87ceeb"
              transparent
              opacity={0.6}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>
        </group>
      ))}

      {/* Ceiling lights - more dynamic */}
      {leftObjects.slice(0, 4).map((obj, i) => (
        <pointLight
          key={`light-${obj.id}`}
          position={[0, 5, obj.z]}
          intensity={0.5}
          distance={15}
          color="#ffffff"
        />
      ))}
    </>
  )
}

// Factory environment decorations - dynamic
function FactoryEnvironment({ leftObjects, rightObjects }) {
  return (
    <>
      {/* Left wall - industrial - dynamically positioned */}
      {leftObjects.map((obj) => (
        <group key={`left-${obj.id}`} position={[-8, 0, obj.z]}>
          <mesh position={[0, 2, 0]}>
            <boxGeometry args={[0.5, 8, 4]} />
            <meshStandardMaterial
              color="#3f3f46"
              roughness={0.8}
              metalness={0.5}
            />
          </mesh>
          {/* Pipes */}
          <mesh position={[0.5, 3, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 4, 8]} />
            <meshStandardMaterial
              color="#71717a"
              roughness={0.4}
              metalness={0.8}
            />
          </mesh>
        </group>
      ))}

      {/* Right wall - industrial - dynamically positioned */}
      {rightObjects.map((obj) => (
        <group key={`right-${obj.id}`} position={[8, 0, obj.z]}>
          <mesh position={[0, 2, 0]}>
            <boxGeometry args={[0.5, 8, 4]} />
            <meshStandardMaterial
              color="#3f3f46"
              roughness={0.8}
              metalness={0.5}
            />
          </mesh>
          {/* Pipes */}
          <mesh position={[-0.5, 3, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 4, 8]} />
            <meshStandardMaterial
              color="#71717a"
              roughness={0.4}
              metalness={0.8}
            />
          </mesh>
        </group>
      ))}

      {/* Warning lights - dynamic */}
      {leftObjects.slice(0, 4).map((obj) => (
        <pointLight
          key={`warning-${obj.id}`}
          position={[0, 5, obj.z]}
          intensity={0.6}
          distance={12}
          color="#f59e0b"
        />
      ))}

      {/* Overhead cranes - moving */}
      {rightObjects.slice(0, 2).map((obj, i) => (
        <group key={`crane-${obj.id}`} position={[0, 6, obj.z]}>
          <mesh>
            <boxGeometry args={[10, 0.3, 0.8]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.8} />
          </mesh>
        </group>
      ))}
    </>
  )
}

