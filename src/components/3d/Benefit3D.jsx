import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'

export default function Benefit3D({ item, speed, onCollision }) {
  const groupRef = useRef()
  const ring1Ref = useRef()
  const ring2Ref = useRef()
  const ring3Ref = useRef()
  const positionZ = useRef(item.position[2])

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Move benefit towards camera (faster)
      positionZ.current += speed * 200 * delta
      groupRef.current.position.z = positionZ.current

      // Main rotation
      groupRef.current.rotation.y += delta * 2

      // Float animation (more pronounced)
      groupRef.current.position.y = item.position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.3

      // Rotate rings in different directions
      if (ring1Ref.current) ring1Ref.current.rotation.x += delta * 3
      if (ring2Ref.current) ring2Ref.current.rotation.y += delta * 4
      if (ring3Ref.current) ring3Ref.current.rotation.z += delta * 2.5

      // Check collision
      onCollision(positionZ.current)
    }
  })

  // Get benefit color
  const getBenefitColor = () => {
    return item.color || '#3b82f6'
  }

  return (
    <group
      ref={groupRef}
      position={[item.position[0], item.position[1], item.position[2]]}
    >
      {/* Multiple rotating outer rings for visibility */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[0.7, 0.08, 12, 24]} />
        <meshStandardMaterial
          color={getBenefitColor()}
          emissive={getBenefitColor()}
          emissiveIntensity={1.0}
          transparent
          opacity={0.7}
        />
      </mesh>

      <mesh ref={ring2Ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.6, 0.06, 12, 24]} />
        <meshStandardMaterial
          color={getBenefitColor()}
          emissive={getBenefitColor()}
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>

      <mesh ref={ring3Ref} rotation={[0, 0, Math.PI / 3]}>
        <torusGeometry args={[0.65, 0.07, 12, 24]} />
        <meshStandardMaterial
          color={getBenefitColor()}
          emissive={getBenefitColor()}
          emissiveIntensity={0.9}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* Main benefit sphere - larger and brighter */}
      <mesh castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={getBenefitColor()}
          emissive={getBenefitColor()}
          emissiveIntensity={0.6}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* Icon text - larger and bolder */}
      <Text
        position={[0, 0, 0.55]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        {item.icon}
      </Text>

      {/* Strong point light for glow effect */}
      <pointLight
        color={getBenefitColor()}
        intensity={2.0}
        distance={6}
      />

      {/* Outer glow particles (orbiting spheres) */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const radius = 1.0
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle * 2) * 0.3,
              Math.sin(angle) * radius
            ]}
          >
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial
              color={getBenefitColor()}
              emissive={getBenefitColor()}
              emissiveIntensity={1.2}
              transparent
              opacity={0.8}
            />
          </mesh>
        )
      })}
    </group>
  )
}

