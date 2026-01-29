import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Obstacle3D({ item, speed, onCollision }) {
  const meshRef = useRef()
  const positionZ = useRef(item.position[2])

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Move obstacle towards camera (faster)
      positionZ.current += speed * 200 * delta
      meshRef.current.position.z = positionZ.current

      // Rotate for visual effect
      meshRef.current.rotation.y += delta * 2

      // Check collision
      onCollision(positionZ.current)
    }
  })

  // Different obstacle models based on type - detailed 3D models
  const renderObstacle = () => {
    switch (item.icon) {
      case '🪑': // Chair - detailed office chair
        return (
          <group>
            {/* Seat with cushion detail */}
            <mesh position={[0, 0.3, 0]} castShadow>
              <boxGeometry args={[0.8, 0.1, 0.8]} />
              <meshStandardMaterial color="#92400e" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.35, 0]} castShadow>
              <boxGeometry args={[0.75, 0.05, 0.75]} />
              <meshStandardMaterial color="#b45309" roughness={0.5} />
            </mesh>
            {/* Backrest */}
            <mesh position={[0, 0.7, -0.35]} castShadow>
              <boxGeometry args={[0.8, 0.7, 0.08]} />
              <meshStandardMaterial color="#92400e" />
            </mesh>
            <mesh position={[0, 0.7, -0.38]} castShadow>
              <boxGeometry args={[0.7, 0.6, 0.03]} />
              <meshStandardMaterial color="#b45309" />
            </mesh>
            {/* Legs */}
            {[[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]].map((pos, i) => (
              <mesh key={i} position={[pos[0], 0, pos[1]]} castShadow>
                <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
                <meshStandardMaterial color="#78350f" metalness={0.4} />
              </mesh>
            ))}
          </group>
        )

      case '📦': // Box/Crate - detailed wooden crate
        return (
          <group>
            {/* Main box */}
            <mesh castShadow>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial
                color="#d97706"
                roughness={0.9}
              />
            </mesh>
            {/* Wooden planks (vertical) */}
            {[-0.35, 0, 0.35].map((x, i) => (
              <mesh key={`v-${i}`} position={[x, 0, 0.51]} castShadow>
                <boxGeometry args={[0.15, 1, 0.03]} />
                <meshStandardMaterial color="#92400e" roughness={0.95} />
              </mesh>
            ))}
            {/* Wooden planks (horizontal) */}
            {[-0.35, 0.35].map((y, i) => (
              <mesh key={`h-${i}`} position={[0, y, 0.51]} castShadow>
                <boxGeometry args={[1.05, 0.1, 0.03]} />
                <meshStandardMaterial color="#78350f" roughness={0.95} />
              </mesh>
            ))}
            {/* Metal corners */}
            {[
              [-0.5, 0.5, 0.5], [0.5, 0.5, 0.5],
              [-0.5, -0.5, 0.5], [0.5, -0.5, 0.5]
            ].map((pos, i) => (
              <mesh key={`corner-${i}`} position={pos}>
                <boxGeometry args={[0.05, 0.05, 0.05]} />
                <meshStandardMaterial color="#3f3f46" metalness={0.9} />
              </mesh>
            ))}
          </group>
        )

      case '🖨️': // Printer - detailed office printer
        return (
          <group>
            {/* Main body */}
            <mesh position={[0, 0.2, 0]} castShadow>
              <boxGeometry args={[0.8, 0.4, 0.6]} />
              <meshStandardMaterial color="#71717a" metalness={0.6} roughness={0.3} />
            </mesh>
            {/* Top scanner part */}
            <mesh position={[0, 0.45, 0]} castShadow>
              <boxGeometry args={[0.75, 0.1, 0.55]} />
              <meshStandardMaterial color="#52525b" metalness={0.5} />
            </mesh>
            {/* Scanner glass */}
            <mesh position={[0, 0.51, 0]} castShadow>
              <boxGeometry args={[0.6, 0.01, 0.4]} />
              <meshStandardMaterial
                color="#87ceeb"
                transparent
                opacity={0.3}
                metalness={0.9}
              />
            </mesh>
            {/* Paper tray */}
            <mesh position={[0, -0.05, 0.35]} castShadow>
              <boxGeometry args={[0.6, 0.05, 0.3]} />
              <meshStandardMaterial color="#e5e5e5" />
            </mesh>
            {/* Paper in tray */}
            <mesh position={[0, 0, 0.35]} castShadow>
              <boxGeometry args={[0.55, 0.03, 0.25]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            {/* Control panel */}
            <mesh position={[0.3, 0.25, 0.25]} castShadow>
              <boxGeometry args={[0.15, 0.2, 0.05]} />
              <meshStandardMaterial color="#1f2937" metalness={0.7} />
            </mesh>
            {/* Buttons */}
            {[0, 0.08, 0.16].map((y, i) => (
              <mesh key={i} position={[0.3, 0.18 + y, 0.28]}>
                <boxGeometry args={[0.03, 0.03, 0.02]} />
                <meshStandardMaterial
                  color={i === 0 ? '#22c55e' : '#3b82f6'}
                  emissive={i === 0 ? '#22c55e' : '#3b82f6'}
                  emissiveIntensity={0.3}
                />
              </mesh>
            ))}
          </group>
        )

      case '🪴': // Plant - detailed potted plant
        return (
          <group>
            {/* Decorative pot */}
            <mesh position={[0, 0.2, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.2, 0.4, 16]} />
              <meshStandardMaterial color="#dc2626" roughness={0.4} metalness={0.1} />
            </mesh>
            {/* Pot rim */}
            <mesh position={[0, 0.41, 0]}>
              <cylinderGeometry args={[0.32, 0.3, 0.05, 16]} />
              <meshStandardMaterial color="#991b1b" />
            </mesh>
            {/* Soil */}
            <mesh position={[0, 0.38, 0]}>
              <cylinderGeometry args={[0.28, 0.28, 0.05, 16]} />
              <meshStandardMaterial color="#78350f" roughness={0.95} />
            </mesh>
            {/* Plant leaves (multiple spheres) */}
            {[
              [0, 0.6, 0], [-0.2, 0.55, 0.1], [0.2, 0.55, -0.1],
              [0.1, 0.65, 0.15], [-0.15, 0.7, -0.1]
            ].map((pos, i) => (
              <mesh key={i} position={pos}>
                <sphereGeometry args={[0.15, 8, 8]} />
                <meshStandardMaterial color="#22c55e" roughness={0.7} />
              </mesh>
            ))}
            {/* Stems */}
            {[
              [0, 0.5, 0], [-0.1, 0.48, 0.05], [0.1, 0.48, -0.05]
            ].map((pos, i) => (
              <mesh key={`stem-${i}`} position={pos}>
                <cylinderGeometry args={[0.02, 0.02, 0.2, 6]} />
                <meshStandardMaterial color="#15803d" />
              </mesh>
            ))}
          </group>
        )

      case '🗄️': // Filing Cabinet - detailed metal cabinet
        return (
          <group>
            {/* Main body */}
            <mesh castShadow>
              <boxGeometry args={[0.6, 1.2, 0.8]} />
              <meshStandardMaterial
                color="#52525b"
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            {/* Drawers (3 levels) */}
            {[-0.35, 0, 0.35].map((y, i) => (
              <group key={i} position={[0, y, 0]}>
                {/* Drawer face */}
                <mesh position={[0, 0, 0.41]}>
                  <boxGeometry args={[0.55, 0.35, 0.02]} />
                  <meshStandardMaterial color="#71717a" metalness={0.7} />
                </mesh>
                {/* Handle */}
                <mesh position={[0, 0, 0.43]}>
                  <boxGeometry args={[0.25, 0.04, 0.03]} />
                  <meshStandardMaterial color="#3f3f46" metalness={0.9} />
                </mesh>
                {/* Label holder */}
                <mesh position={[0, 0.12, 0.43]}>
                  <boxGeometry args={[0.3, 0.08, 0.01]} />
                  <meshStandardMaterial color="#e5e5e5" />
                </mesh>
              </group>
            ))}
          </group>
        )

      case '🛢️': // Barrel - detailed oil drum
        return (
          <group>
            {/* Main barrel */}
            <mesh castShadow>
              <cylinderGeometry args={[0.4, 0.4, 1, 16]} />
              <meshStandardMaterial
                color="#dc2626"
                metalness={0.6}
                roughness={0.4}
              />
            </mesh>
            {/* Metal rings */}
            {[-0.35, 0, 0.35].map((y, i) => (
              <mesh key={i} position={[0, y, 0]}>
                <cylinderGeometry args={[0.42, 0.42, 0.05, 16]} />
                <meshStandardMaterial color="#3f3f46" metalness={0.9} roughness={0.2} />
              </mesh>
            ))}
            {/* Top lid */}
            <mesh position={[0, 0.51, 0]}>
              <cylinderGeometry args={[0.38, 0.38, 0.03, 16]} />
              <meshStandardMaterial color="#1f2937" metalness={0.8} />
            </mesh>
            {/* Warning label */}
            <mesh position={[0, 0, 0.41]}>
              <boxGeometry args={[0.3, 0.2, 0.01]} />
              <meshStandardMaterial
                color="#fef08a"
                emissive="#f59e0b"
                emissiveIntensity={0.3}
              />
            </mesh>
          </group>
        )

      case '🚜': // Forklift - detailed industrial forklift
        return (
          <group>
            {/* Main body */}
            <mesh position={[0, 0.3, 0]} castShadow>
              <boxGeometry args={[1.2, 0.5, 0.8]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.5} roughness={0.6} />
            </mesh>
            {/* Cabin roof */}
            <mesh position={[0, 0.65, 0]} castShadow>
              <boxGeometry args={[1.1, 0.1, 0.7]} />
              <meshStandardMaterial color="#d97706" metalness={0.4} />
            </mesh>
            {/* Seat */}
            <mesh position={[0, 0.4, -0.1]} castShadow>
              <boxGeometry args={[0.4, 0.15, 0.4]} />
              <meshStandardMaterial color="#1f2937" />
            </mesh>
            {/* Steering wheel */}
            <mesh position={[0, 0.5, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.15, 0.03, 8, 16]} />
              <meshStandardMaterial color="#3f3f46" metalness={0.8} />
            </mesh>
            {/* Front forks */}
            {[-0.3, 0.3].map((x, i) => (
              <mesh key={i} position={[x, 0.25, 0.7]} castShadow>
                <boxGeometry args={[0.08, 0.08, 0.6]} />
                <meshStandardMaterial color="#71717a" metalness={0.9} />
              </mesh>
            ))}
            {/* Fork support */}
            <mesh position={[0, 0.5, 0.6]} castShadow>
              <boxGeometry args={[0.8, 0.5, 0.1]} />
              <meshStandardMaterial color="#52525b" metalness={0.8} />
            </mesh>
            {/* Wheels */}
            {[
              [-0.5, 0.1, 0.3], [0.5, 0.1, 0.3],
              [-0.5, 0.1, -0.3], [0.5, 0.1, -0.3]
            ].map((pos, i) => (
              <mesh key={i} position={pos} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
                <meshStandardMaterial color="#1f2937" roughness={0.9} />
              </mesh>
            ))}
            {/* Warning light */}
            <mesh position={[0, 0.75, 0]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial
                color="#f59e0b"
                emissive="#f59e0b"
                emissiveIntensity={0.5}
              />
            </mesh>
          </group>
        )

      case '⚠️': // Hazard Cone - detailed traffic cone
        return (
          <group>
            {/* Cone body */}
            <mesh position={[0, 0.4, 0]} castShadow>
              <coneGeometry args={[0.35, 0.8, 4]} />
              <meshStandardMaterial
                color="#f59e0b"
                roughness={0.7}
              />
            </mesh>
            {/* Reflective stripes */}
            {[0.2, 0.5].map((y, i) => (
              <mesh key={i} position={[0, y, 0]}>
                <cylinderGeometry args={[0.25 - i * 0.08, 0.28 - i * 0.08, 0.08, 4]} />
                <meshStandardMaterial
                  color="#fef08a"
                  emissive="#fef08a"
                  emissiveIntensity={0.4}
                  metalness={0.3}
                />
              </mesh>
            ))}
            {/* Base */}
            <mesh position={[0, 0.02, 0]} castShadow>
              <boxGeometry args={[0.6, 0.04, 0.6]} />
              <meshStandardMaterial color="#1f2937" />
            </mesh>
            {/* Base corners */}
            {[
              [-0.28, 0, -0.28], [0.28, 0, -0.28],
              [-0.28, 0, 0.28], [0.28, 0, 0.28]
            ].map((pos, i) => (
              <mesh key={i} position={pos}>
                <cylinderGeometry args={[0.05, 0.05, 0.04, 8]} />
                <meshStandardMaterial color="#3f3f46" />
              </mesh>
            ))}
          </group>
        )

      case '⚙️': // Machinery - detailed industrial machine
        return (
          <group>
            {/* Main base */}
            <mesh position={[0, 0.25, 0]} castShadow>
              <boxGeometry args={[1, 0.5, 0.8]} />
              <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Control panel */}
            <mesh position={[0.4, 0.55, 0]} castShadow>
              <boxGeometry args={[0.15, 0.3, 0.6]} />
              <meshStandardMaterial color="#1f2937" metalness={0.7} />
            </mesh>
            {/* Panel screen */}
            <mesh position={[0.48, 0.6, 0]}>
              <boxGeometry args={[0.02, 0.15, 0.25]} />
              <meshStandardMaterial
                color="#22c55e"
                emissive="#22c55e"
                emissiveIntensity={0.5}
              />
            </mesh>
            {/* Buttons */}
            {[-0.15, 0, 0.15].map((z, i) => (
              <mesh key={i} position={[0.48, 0.45, z]}>
                <cylinderGeometry args={[0.03, 0.03, 0.02, 8]} />
                <meshStandardMaterial
                  color={['#ef4444', '#fbbf24', '#22c55e'][i]}
                  emissive={['#ef4444', '#fbbf24', '#22c55e'][i]}
                  emissiveIntensity={0.3}
                />
              </mesh>
            ))}
            {/* Main gear */}
            <mesh position={[-0.2, 0.65, 0]} castShadow>
              <cylinderGeometry args={[0.35, 0.35, 0.15, 8]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.4} />
            </mesh>
            {/* Gear teeth */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i / 8) * Math.PI * 2
              return (
                <mesh
                  key={i}
                  position={[-0.2 + Math.cos(angle) * 0.4, 0.65, Math.sin(angle) * 0.4]}
                >
                  <boxGeometry args={[0.1, 0.15, 0.08]} />
                  <meshStandardMaterial color="#d97706" metalness={0.7} />
                </mesh>
              )
            })}
            {/* Hydraulic pistons */}
            {[-0.3, 0.3].map((x, i) => (
              <group key={i}>
                <mesh position={[x, 0.3, 0.3]} castShadow>
                  <cylinderGeometry args={[0.06, 0.06, 0.4, 12]} />
                  <meshStandardMaterial color="#71717a" metalness={0.9} />
                </mesh>
                <mesh position={[x, 0.45, 0.3]}>
                  <cylinderGeometry args={[0.08, 0.08, 0.1, 12]} />
                  <meshStandardMaterial color="#52525b" metalness={0.8} />
                </mesh>
              </group>
            ))}
            {/* Warning stripes */}
            <mesh position={[0, 0.02, 0.41]}>
              <boxGeometry args={[0.8, 0.4, 0.02]} />
              <meshStandardMaterial
                color="#fef08a"
              />
            </mesh>
            {Array.from({ length: 5 }).map((_, i) => (
              <mesh key={i} position={[-0.32 + i * 0.16, 0.02, 0.42]}>
                <boxGeometry args={[0.08, 0.4, 0.01]} />
                <meshStandardMaterial color="#1f2937" />
              </mesh>
            ))}
          </group>
        )

      default:
        return (
          <mesh castShadow>
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
        )
    }
  }

  return (
    <group
      ref={meshRef}
      position={[item.position[0], item.position[1], item.position[2]]}
    >
      {renderObstacle()}
    </group>
  )
}

