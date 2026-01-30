import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Player3DModel({
  characterType,
  position,
  isJumping,
  isDucking,
  isDamaged,
  isRunning
}) {
  const groupRef = useRef()
  const bodyRef = useRef()
  const headRef = useRef()
  const leftArmRef = useRef()
  const rightArmRef = useRef()
  const leftLegRef = useRef()
  const rightLegRef = useRef()

  // Store all meshes for damage flash effect
  const allMeshes = useRef([])

  const isOffice = characterType === 'office'
  const time = useRef(0)

  // Helper function to add mesh to tracking array
  const addMeshRef = (el) => {
    if (el && !allMeshes.current.includes(el)) {
      allMeshes.current.push(el)
    }
  }

  // Running animation
  useFrame((state, delta) => {
    time.current += delta * 10

    // Apply damage flash effect to all meshes
    if (isDamaged && allMeshes.current.length > 0) {
      const pulseIntensity = Math.abs(Math.sin(state.clock.elapsedTime * 15)) * 0.8 + 0.2
      allMeshes.current.forEach(mesh => {
        if (mesh && mesh.material && mesh.material.emissive) {
          // Clone material if needed to avoid shared material issues
          if (!mesh.material.userData.isDamageClone) {
            mesh.material = mesh.material.clone()
            mesh.material.userData.isDamageClone = true
          }
          mesh.material.emissive.set('#ef4444')
          mesh.material.emissiveIntensity = pulseIntensity
        }
      })
    } else if (allMeshes.current.length > 0) {
      // Reset to normal
      allMeshes.current.forEach(mesh => {
        if (mesh && mesh.material && mesh.material.emissive) {
          mesh.material.emissive.set('#000000')
          mesh.material.emissiveIntensity = 0
        }
      })
    }

    // Check if player is in the air based on actual Y position
    const isInAir = position[1] > 0.1

    // Smooth interpolation factor for arm animations
    const lerpFactor = 0.12 // How fast arms move (0.1 = slow, 0.3 = fast)

    // Helper function for smooth interpolation
    const lerp = (current, target, factor) => current + (target - current) * factor

    if (isRunning && !isInAir && !isDucking) {
      // Arm swing - normal running (smoothly transition back from jump pose)
      const targetLeftArmX = Math.sin(time.current) * 0.5
      const targetRightArmX = Math.sin(time.current + Math.PI) * 0.5

      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = lerp(leftArmRef.current.rotation.x, targetLeftArmX, lerpFactor)
        leftArmRef.current.rotation.z = lerp(leftArmRef.current.rotation.z, 0, lerpFactor)
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = lerp(rightArmRef.current.rotation.x, targetRightArmX, lerpFactor)
        rightArmRef.current.rotation.z = lerp(rightArmRef.current.rotation.z, 0, lerpFactor)
      }

      // Leg movement
      if (leftLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(time.current) * 0.6
      }
      if (rightLegRef.current) {
        rightLegRef.current.rotation.x = Math.sin(time.current + Math.PI) * 0.6
      }

      // Head bob (subtle)
      if (headRef.current) {
        headRef.current.position.y = 1.6 + Math.sin(time.current * 2) * 0.05
      }
    } else if (isInAir) {
      // Jump animation - arms raised up smoothly
      const targetArmX = -2.8 // Arms up (pointing up/back)

      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = lerp(leftArmRef.current.rotation.x, targetArmX, lerpFactor)
        leftArmRef.current.rotation.z = lerp(leftArmRef.current.rotation.z, 0.3, lerpFactor)
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = lerp(rightArmRef.current.rotation.x, targetArmX, lerpFactor)
        rightArmRef.current.rotation.z = lerp(rightArmRef.current.rotation.z, -0.3, lerpFactor)
      }

      // Legs tucked slightly during jump
      if (leftLegRef.current) {
        leftLegRef.current.rotation.x = lerp(leftLegRef.current.rotation.x, -0.3, lerpFactor)
      }
      if (rightLegRef.current) {
        rightLegRef.current.rotation.x = lerp(rightLegRef.current.rotation.x, -0.3, lerpFactor)
      }
    }

    // Direct position update (smoothing is handled in App.jsx now)
    if (groupRef.current) {
      groupRef.current.position.set(position[0], position[1], position[2])
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Head - positioned on neck, rotated to face forward */}
      <group ref={headRef} position={[0, 1.6, 0]} rotation={[0, Math.PI, 0]}>
        <mesh
          castShadow
          ref={addMeshRef}
        >
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.1, 0.05, 0.21]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh position={[0.1, 0.05, 0.21]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>

        {/* Hardhat for factory worker */}
        {!isOffice && (
          <mesh position={[0, 0.3, 0]} ref={addMeshRef}>
            <cylinderGeometry args={[0.25, 0.3, 0.2, 16]} />
            <meshStandardMaterial
              color="#f59e0b"
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
        )}

        {/* Hair for office worker */}
        {isOffice && (
          <mesh position={[0, 0.25, 0]} ref={addMeshRef}>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial color="#451a03" />
          </mesh>
        )}
      </group>

      {/* Body - rotated to face forward */}
      <group ref={bodyRef} position={[0, 0.8, 0]} rotation={[0, Math.PI, 0]}>
        <mesh castShadow ref={addMeshRef}>
          <boxGeometry args={[0.6, 0.8, 0.4]} />
          <meshStandardMaterial
            color={isOffice ? '#93c5fd' : '#fb923c'}
          />
        </mesh>

        {/* Tie for office worker */}
        {isOffice && (
          <mesh position={[0, 0.2, 0.21]} ref={addMeshRef}>
            <boxGeometry args={[0.1, 0.5, 0.02]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
        )}

        {/* Safety vest stripe for factory worker */}
        {!isOffice && (
          <mesh position={[0, 0, 0.21]} ref={addMeshRef}>
            <boxGeometry args={[0.65, 0.2, 0.02]} />
            <meshStandardMaterial color="#fef08a" />
          </mesh>
        )}
      </group>

      {/* Left Arm - rotated to face forward */}
      <group ref={leftArmRef} position={[-0.4, 1.1, 0]} rotation={[0, Math.PI, 0]}>
        <mesh castShadow ref={addMeshRef}>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
          <meshStandardMaterial
            color={isOffice ? '#60a5fa' : '#f97316'}
          />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.35, 0]} ref={addMeshRef}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
      </group>

      {/* Right Arm - rotated to face forward */}
      <group ref={rightArmRef} position={[0.4, 1.1, 0]} rotation={[0, Math.PI, 0]}>
        <mesh castShadow ref={addMeshRef}>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
          <meshStandardMaterial
            color={isOffice ? '#60a5fa' : '#f97316'}
          />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.35, 0]} ref={addMeshRef}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
      </group>

      {/* Left Leg - rotated to face forward */}
      <group ref={leftLegRef} position={[-0.15, 0.15, 0]} rotation={[0, Math.PI, 0]}>
        <mesh castShadow ref={addMeshRef}>
          <cylinderGeometry args={[0.1, 0.1, 0.7, 8]} />
          <meshStandardMaterial
            color={isOffice ? '#1e293b' : '#92400e'}
          />
        </mesh>
        {/* Foot */}
        <mesh position={[0, -0.4, 0.1]} ref={addMeshRef}>
          <boxGeometry args={[0.15, 0.1, 0.25]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      </group>

      {/* Right Leg - rotated to face forward */}
      <group ref={rightLegRef} position={[0.15, 0.15, 0]} rotation={[0, Math.PI, 0]}>
        <mesh castShadow ref={addMeshRef}>
          <cylinderGeometry args={[0.1, 0.1, 0.7, 8]} />
          <meshStandardMaterial
            color={isOffice ? '#1e293b' : '#92400e'}
          />
        </mesh>
        {/* Foot */}
        <mesh position={[0, -0.4, 0.1]} ref={addMeshRef}>
          <boxGeometry args={[0.15, 0.1, 0.25]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      </group>
    </group>
  )
}

