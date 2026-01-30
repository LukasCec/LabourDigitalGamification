import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Generate particles data outside component to avoid impure render
const generateParticles = (isOffice) => {
  const count = 50
  const particleColors = isOffice
    ? ['#93c5fd', '#60a5fa', '#fbbf24', '#1e293b', '#dc2626']
    : ['#fb923c', '#f97316', '#fbbf24', '#92400e', '#f59e0b']

  return Array.from({ length: count }, () => ({
    velocity: {
      x: (Math.random() - 0.5) * 8,
      y: Math.random() * 6 + 2,
      z: (Math.random() - 0.5) * 8,
      rotSpeed: (Math.random() - 0.5) * 10
    },
    size: Math.random() * 0.3 + 0.1,
    color: new THREE.Color(particleColors[Math.floor(Math.random() * particleColors.length)]),
    rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
    position: [0, 1, 0]
  }))
}

// Flash component that updates itself
function CentralFlash() {
  const meshRef = useRef()
  const time = useRef(0)

  useFrame((state, delta) => {
    time.current += delta
    if (meshRef.current) {
      const scale = 0.5 + time.current * 2
      meshRef.current.scale.setScalar(scale)
      meshRef.current.material.opacity = Math.max(0, 1 - time.current * 2)
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 1, 0]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={1}
      />
    </mesh>
  )
}

export default function PlayerExplosion({ position, characterType }) {
  const time = useRef(0)
  const meshRefs = useRef([])
  const isOffice = characterType === 'office'

  // Generate particles once on mount
  const [particles] = useState(() => generateParticles(isOffice))

  useFrame((state, delta) => {
    time.current += delta

    meshRefs.current.forEach((mesh, i) => {
      if (mesh && particles[i]) {
        const vel = particles[i].velocity
        const gravity = 15

        // Update position with velocity and gravity
        mesh.position.x += vel.x * delta
        mesh.position.y += vel.y * delta
        vel.y -= gravity * delta // Apply gravity
        mesh.position.z += vel.z * delta

        // Rotate
        mesh.rotation.x += vel.rotSpeed * delta
        mesh.rotation.y += vel.rotSpeed * delta * 0.7
        mesh.rotation.z += vel.rotSpeed * delta * 0.5

        // Fade out and shrink
        const fadeStart = 1.0
        const fadeDuration = 1.0
        if (time.current > fadeStart) {
          const fadeProgress = Math.min((time.current - fadeStart) / fadeDuration, 1)
          mesh.scale.setScalar(1 - fadeProgress)
          if (mesh.material) {
            mesh.material.opacity = 1 - fadeProgress
          }
        }
      }
    })
  })

  return (
    <group position={position}>
      {particles.map((particle, i) => (
        <mesh
          key={i}
          ref={el => meshRefs.current[i] = el}
          position={particle.position}
          rotation={particle.rotation}
        >
          <boxGeometry args={[particle.size, particle.size, particle.size]} />
          <meshStandardMaterial
            color={particle.color}
            emissive={particle.color}
            emissiveIntensity={0.5}
            transparent
            opacity={1}
          />
        </mesh>
      ))}

      {/* Central flash */}
      <CentralFlash />
    </group>
  )
}

