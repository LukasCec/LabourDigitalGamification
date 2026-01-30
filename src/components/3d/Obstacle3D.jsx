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

      // No rotation - obstacles face the camera

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

      case '📦': // Box/Crate - realistic wooden shipping crate
        return (
          <group>
            {/* Main crate frame */}
            <mesh castShadow>
              <boxGeometry args={[1.0, 0.8, 0.8]} />
              <meshStandardMaterial color="#b8860b" roughness={0.85} />
            </mesh>

            {/* Front face - horizontal wooden planks */}
            {[-0.3, -0.1, 0.1, 0.3].map((y, i) => (
              <mesh key={`front-${i}`} position={[0, y, 0.41]} castShadow>
                <boxGeometry args={[0.95, 0.15, 0.04]} />
                <meshStandardMaterial color={i % 2 === 0 ? '#a0522d' : '#8b4513'} roughness={0.9} />
              </mesh>
            ))}

            {/* Front face - vertical support beams */}
            {[-0.4, 0, 0.4].map((x, i) => (
              <mesh key={`front-v-${i}`} position={[x, 0, 0.43]} castShadow>
                <boxGeometry args={[0.08, 0.8, 0.03]} />
                <meshStandardMaterial color="#5d4037" roughness={0.95} />
              </mesh>
            ))}

            {/* Back face - horizontal planks */}
            {[-0.3, -0.1, 0.1, 0.3].map((y, i) => (
              <mesh key={`back-${i}`} position={[0, y, -0.41]} castShadow>
                <boxGeometry args={[0.95, 0.15, 0.04]} />
                <meshStandardMaterial color={i % 2 === 0 ? '#8b4513' : '#a0522d'} roughness={0.9} />
              </mesh>
            ))}

            {/* Side faces - planks */}
            {[-0.3, -0.1, 0.1, 0.3].map((y, i) => (
              <group key={`sides-${i}`}>
                <mesh position={[0.51, y, 0]} castShadow>
                  <boxGeometry args={[0.04, 0.15, 0.75]} />
                  <meshStandardMaterial color={i % 2 === 0 ? '#a0522d' : '#8b4513'} roughness={0.9} />
                </mesh>
                <mesh position={[-0.51, y, 0]} castShadow>
                  <boxGeometry args={[0.04, 0.15, 0.75]} />
                  <meshStandardMaterial color={i % 2 === 0 ? '#8b4513' : '#a0522d'} roughness={0.9} />
                </mesh>
              </group>
            ))}

            {/* Top planks */}
            {[-0.35, 0, 0.35].map((x, i) => (
              <mesh key={`top-${i}`} position={[x, 0.42, 0]} castShadow>
                <boxGeometry args={[0.25, 0.04, 0.75]} />
                <meshStandardMaterial color={i % 2 === 0 ? '#a0522d' : '#daa520'} roughness={0.85} />
              </mesh>
            ))}

            {/* Metal corner brackets */}
            {[
              [-0.5, 0.4, 0.4], [0.5, 0.4, 0.4], [-0.5, 0.4, -0.4], [0.5, 0.4, -0.4],
              [-0.5, -0.4, 0.4], [0.5, -0.4, 0.4], [-0.5, -0.4, -0.4], [0.5, -0.4, -0.4]
            ].map((pos, i) => (
              <mesh key={`bracket-${i}`} position={pos}>
                <boxGeometry args={[0.08, 0.08, 0.08]} />
                <meshStandardMaterial color="#4a4a4a" metalness={0.9} roughness={0.3} />
              </mesh>
            ))}

            {/* "FRAGILE" or shipping label on front */}
            <mesh position={[0, 0, 0.45]}>
              <planeGeometry args={[0.4, 0.2]} />
              <meshStandardMaterial color="#f5f5dc" roughness={0.5} />
            </mesh>
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

      case '🚜': // Forklift - realistic industrial forklift
        return (
          <group>
            {/* Main body/engine compartment */}
            <mesh position={[0, 0.35, -0.2]} castShadow>
              <boxGeometry args={[1.0, 0.5, 0.9]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.4} roughness={0.6} />
            </mesh>

            {/* Counterweight at back */}
            <mesh position={[0, 0.25, -0.7]} castShadow>
              <boxGeometry args={[0.9, 0.4, 0.3]} />
              <meshStandardMaterial color="#1f2937" metalness={0.6} roughness={0.4} />
            </mesh>

            {/* Operator cabin frame */}
            {/* Roof */}
            <mesh position={[0, 0.9, -0.1]} castShadow>
              <boxGeometry args={[1.1, 0.08, 1.0]} />
              <meshStandardMaterial color="#d97706" metalness={0.5} />
            </mesh>
            {/* Cabin pillars */}
            {[[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.35], [0.5, 0.35]].map((pos, i) => (
              <mesh key={`pillar-${i}`} position={[pos[0], 0.65, pos[1]]} castShadow>
                <boxGeometry args={[0.06, 0.5, 0.06]} />
                <meshStandardMaterial color="#d97706" metalness={0.5} />
              </mesh>
            ))}

            {/* Seat */}
            <mesh position={[0, 0.45, -0.15]} castShadow>
              <boxGeometry args={[0.45, 0.1, 0.4]} />
              <meshStandardMaterial color="#1f2937" roughness={0.8} />
            </mesh>
            {/* Seat back */}
            <mesh position={[0, 0.55, -0.35]} castShadow>
              <boxGeometry args={[0.45, 0.25, 0.08]} />
              <meshStandardMaterial color="#1f2937" roughness={0.8} />
            </mesh>

            {/* Steering wheel */}
            <mesh position={[0, 0.55, 0.15]} rotation={[Math.PI / 3, 0, 0]}>
              <torusGeometry args={[0.12, 0.02, 8, 16]} />
              <meshStandardMaterial color="#2d2d2d" metalness={0.7} />
            </mesh>
            {/* Steering column */}
            <mesh position={[0, 0.45, 0.1]} rotation={[Math.PI / 3, 0, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.25, 8]} />
              <meshStandardMaterial color="#4a4a4a" metalness={0.8} />
            </mesh>

            {/* Mast/Lift assembly - vertical rails */}
            {[-0.25, 0.25].map((x, i) => (
              <mesh key={`mast-${i}`} position={[x, 0.7, 0.55]} castShadow>
                <boxGeometry args={[0.08, 1.2, 0.08]} />
                <meshStandardMaterial color="#71717a" metalness={0.8} roughness={0.3} />
              </mesh>
            ))}
            {/* Mast crossbeams */}
            {[0.3, 0.7, 1.1].map((y, i) => (
              <mesh key={`crossbeam-${i}`} position={[0, y, 0.55]} castShadow>
                <boxGeometry args={[0.58, 0.06, 0.06]} />
                <meshStandardMaterial color="#52525b" metalness={0.7} />
              </mesh>
            ))}

            {/* Forks - L-shaped */}
            {[-0.2, 0.2].map((x, i) => (
              <group key={`fork-${i}`}>
                {/* Vertical part of fork */}
                <mesh position={[x, 0.25, 0.5]} castShadow>
                  <boxGeometry args={[0.1, 0.4, 0.08]} />
                  <meshStandardMaterial color="#4a4a4a" metalness={0.9} roughness={0.2} />
                </mesh>
                {/* Horizontal part of fork */}
                <mesh position={[x, 0.08, 0.85]} castShadow>
                  <boxGeometry args={[0.1, 0.06, 0.65]} />
                  <meshStandardMaterial color="#4a4a4a" metalness={0.9} roughness={0.2} />
                </mesh>
                {/* Fork tip (angled) */}
                <mesh position={[x, 0.06, 1.2]} rotation={[0.2, 0, 0]} castShadow>
                  <boxGeometry args={[0.1, 0.04, 0.1]} />
                  <meshStandardMaterial color="#4a4a4a" metalness={0.9} />
                </mesh>
              </group>
            ))}

            {/* Front wheels (larger) */}
            {[-0.45, 0.45].map((x, i) => (
              <group key={`front-wheel-${i}`} position={[x, 0.15, 0.3]}>
                <mesh rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.18, 0.18, 0.12, 20]} />
                  <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
                </mesh>
                {/* Wheel rim */}
                <mesh rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.08, 0.08, 0.13, 12]} />
                  <meshStandardMaterial color="#fbbf24" metalness={0.7} />
                </mesh>
              </group>
            ))}

            {/* Rear wheels (smaller) */}
            {[-0.4, 0.4].map((x, i) => (
              <group key={`rear-wheel-${i}`} position={[x, 0.12, -0.55]}>
                <mesh rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.12, 0.12, 0.1, 16]} />
                  <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
                </mesh>
                <mesh rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.05, 0.05, 0.11, 8]} />
                  <meshStandardMaterial color="#fbbf24" metalness={0.7} />
                </mesh>
              </group>
            ))}

            {/* Warning beacon light on roof */}
            <mesh position={[0, 1.0, -0.1]}>
              <cylinderGeometry args={[0.06, 0.08, 0.1, 12]} />
              <meshStandardMaterial color="#ff6b00" emissive="#ff6b00" emissiveIntensity={0.6} />
            </mesh>

            {/* Headlights */}
            {[-0.35, 0.35].map((x, i) => (
              <mesh key={`headlight-${i}`} position={[x, 0.4, 0.45]}>
                <cylinderGeometry args={[0.05, 0.05, 0.03, 12]} />
                <meshStandardMaterial color="#ffffcc" emissive="#ffffcc" emissiveIntensity={0.3} />
              </mesh>
            ))}

            {/* Safety stripes on mast */}
            <mesh position={[0, 0.15, 0.59]}>
              <boxGeometry args={[0.55, 0.12, 0.02]} />
              <meshStandardMaterial color="#fef08a" />
            </mesh>
            {[-0.2, -0.05, 0.1, 0.25].map((x, i) => (
              <mesh key={`stripe-${i}`} position={[x, 0.15, 0.6]}>
                <boxGeometry args={[0.06, 0.12, 0.01]} />
                <meshStandardMaterial color="#1a1a1a" />
              </mesh>
            ))}
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

      case '🚰': // Water Cooler - office water dispenser
        return (
          <group>
            {/* Water bottle (top) */}
            <mesh position={[0, 0.9, 0]} castShadow>
              <cylinderGeometry args={[0.25, 0.2, 0.6, 16]} />
              <meshStandardMaterial color="#87ceeb" transparent opacity={0.4} />
            </mesh>
            {/* Bottle neck */}
            <mesh position={[0, 0.55, 0]}>
              <cylinderGeometry args={[0.08, 0.12, 0.15, 12]} />
              <meshStandardMaterial color="#60a5fa" transparent opacity={0.5} />
            </mesh>
            {/* Main dispenser body */}
            <mesh position={[0, 0.2, 0]} castShadow>
              <boxGeometry args={[0.45, 0.5, 0.4]} />
              <meshStandardMaterial color="#e5e7eb" roughness={0.3} />
            </mesh>
            {/* Dispenser front panel */}
            <mesh position={[0, 0.25, 0.21]}>
              <boxGeometry args={[0.35, 0.35, 0.02]} />
              <meshStandardMaterial color="#d1d5db" />
            </mesh>
            {/* Taps */}
            {[-0.1, 0.1].map((x, i) => (
              <group key={i} position={[x, 0.15, 0.22]}>
                <mesh>
                  <boxGeometry args={[0.06, 0.08, 0.04]} />
                  <meshStandardMaterial color={i === 0 ? '#3b82f6' : '#ef4444'} />
                </mesh>
              </group>
            ))}
            {/* Drip tray */}
            <mesh position={[0, -0.05, 0.15]}>
              <boxGeometry args={[0.3, 0.03, 0.15]} />
              <meshStandardMaterial color="#9ca3af" metalness={0.5} />
            </mesh>
            {/* Base/stand */}
            <mesh position={[0, -0.2, 0]} castShadow>
              <boxGeometry args={[0.4, 0.25, 0.35]} />
              <meshStandardMaterial color="#f3f4f6" roughness={0.4} />
            </mesh>
          </group>
        )

      case '🛒': // Mail Cart - office mail/supply cart
        return (
          <group>
            {/* Cart basket */}
            <mesh position={[0, 0.35, 0]} castShadow>
              <boxGeometry args={[0.8, 0.4, 0.5]} />
              <meshStandardMaterial color="#3b82f6" roughness={0.6} />
            </mesh>
            {/* Cart basket interior (darker) */}
            <mesh position={[0, 0.38, 0]}>
              <boxGeometry args={[0.7, 0.35, 0.4]} />
              <meshStandardMaterial color="#1e40af" />
            </mesh>
            {/* Handle */}
            <mesh position={[0, 0.7, -0.2]} castShadow>
              <boxGeometry args={[0.7, 0.05, 0.05]} />
              <meshStandardMaterial color="#4b5563" metalness={0.7} />
            </mesh>
            {/* Handle vertical supports */}
            {[-0.3, 0.3].map((x, i) => (
              <mesh key={i} position={[x, 0.55, -0.2]} castShadow>
                <boxGeometry args={[0.04, 0.35, 0.04]} />
                <meshStandardMaterial color="#4b5563" metalness={0.7} />
              </mesh>
            ))}
            {/* Wheels */}
            {[[-0.3, 0.2], [0.3, 0.2], [-0.3, -0.2], [0.3, -0.2]].map((pos, i) => (
              <group key={i} position={[pos[0], 0.08, pos[1]]}>
                <mesh rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.08, 0.08, 0.04, 12]} />
                  <meshStandardMaterial color="#1f2937" roughness={0.8} />
                </mesh>
              </group>
            ))}
            {/* Some mail/packages in cart */}
            <mesh position={[-0.15, 0.45, 0.05]}>
              <boxGeometry args={[0.25, 0.15, 0.2]} />
              <meshStandardMaterial color="#fde68a" />
            </mesh>
            <mesh position={[0.15, 0.5, -0.05]}>
              <boxGeometry args={[0.2, 0.2, 0.18]} />
              <meshStandardMaterial color="#a3a3a3" />
            </mesh>
          </group>
        )

      case '🪵': // Pallet Stack - wooden pallets stacked
        return (
          <group>
            {/* Bottom pallet */}
            <group position={[0, 0.08, 0]}>
              {/* Pallet top boards */}
              {[-0.35, -0.18, 0, 0.18, 0.35].map((x, i) => (
                <mesh key={`top-${i}`} position={[x, 0.05, 0]} castShadow>
                  <boxGeometry args={[0.12, 0.03, 0.8]} />
                  <meshStandardMaterial color="#a0522d" roughness={0.9} />
                </mesh>
              ))}
              {/* Pallet support blocks */}
              {[-0.3, 0, 0.3].map((z, i) => (
                <group key={`support-${i}`}>
                  {[-0.35, 0, 0.35].map((x, j) => (
                    <mesh key={`block-${j}`} position={[x, -0.03, z]} castShadow>
                      <boxGeometry args={[0.12, 0.08, 0.12]} />
                      <meshStandardMaterial color="#8b4513" roughness={0.95} />
                    </mesh>
                  ))}
                </group>
              ))}
              {/* Pallet bottom boards */}
              {[-0.35, 0, 0.35].map((x, i) => (
                <mesh key={`bottom-${i}`} position={[x, -0.08, 0]} castShadow>
                  <boxGeometry args={[0.12, 0.02, 0.8]} />
                  <meshStandardMaterial color="#a0522d" roughness={0.9} />
                </mesh>
              ))}
            </group>

            {/* Middle pallet */}
            <group position={[0, 0.25, 0]}>
              {[-0.35, -0.18, 0, 0.18, 0.35].map((x, i) => (
                <mesh key={`mid-top-${i}`} position={[x, 0.05, 0]} castShadow>
                  <boxGeometry args={[0.12, 0.03, 0.8]} />
                  <meshStandardMaterial color="#b8860b" roughness={0.9} />
                </mesh>
              ))}
              {[-0.3, 0, 0.3].map((z, i) => (
                <group key={`mid-support-${i}`}>
                  {[-0.35, 0, 0.35].map((x, j) => (
                    <mesh key={`mid-block-${j}`} position={[x, -0.03, z]} castShadow>
                      <boxGeometry args={[0.12, 0.08, 0.12]} />
                      <meshStandardMaterial color="#8b4513" roughness={0.95} />
                    </mesh>
                  ))}
                </group>
              ))}
            </group>

            {/* Top pallet (slightly rotated) */}
            <group position={[0.02, 0.42, -0.02]} rotation={[0, 0.05, 0]}>
              {[-0.35, -0.18, 0, 0.18, 0.35].map((x, i) => (
                <mesh key={`top-pallet-${i}`} position={[x, 0.05, 0]} castShadow>
                  <boxGeometry args={[0.12, 0.03, 0.8]} />
                  <meshStandardMaterial color="#daa520" roughness={0.9} />
                </mesh>
              ))}
              {[-0.3, 0, 0.3].map((z, i) => (
                <group key={`top-support-${i}`}>
                  {[-0.35, 0, 0.35].map((x, j) => (
                    <mesh key={`top-block-${j}`} position={[x, -0.03, z]} castShadow>
                      <boxGeometry args={[0.12, 0.08, 0.12]} />
                      <meshStandardMaterial color="#8b4513" roughness={0.95} />
                    </mesh>
                  ))}
                </group>
              ))}
            </group>
          </group>
        )

      case '🏗️': // Industrial Crane/Heavy Forklift
        return (
          <group>
            {/* Main body - large industrial */}
            <mesh position={[0, 0.4, 0]} castShadow>
              <boxGeometry args={[1.5, 0.7, 1.0]} />
              <meshStandardMaterial color="#d97706" metalness={0.6} roughness={0.5} />
            </mesh>
            {/* Cabin */}
            <mesh position={[-0.3, 0.85, 0]} castShadow>
              <boxGeometry args={[0.7, 0.5, 0.8]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.4} />
            </mesh>
            {/* Cabin windows */}
            <mesh position={[-0.3, 0.9, 0.41]}>
              <boxGeometry args={[0.5, 0.35, 0.02]} />
              <meshStandardMaterial color="#87ceeb" transparent opacity={0.5} metalness={0.9} />
            </mesh>
            {/* Crane arm base */}
            <mesh position={[0.4, 0.9, 0]} castShadow>
              <boxGeometry args={[0.3, 0.6, 0.3]} />
              <meshStandardMaterial color="#71717a" metalness={0.8} />
            </mesh>
            {/* Crane arm - horizontal */}
            <mesh position={[0.4, 1.3, 0.4]} rotation={[Math.PI / 4, 0, 0]} castShadow>
              <boxGeometry args={[0.15, 1.2, 0.15]} />
              <meshStandardMaterial color="#52525b" metalness={0.7} />
            </mesh>
            {/* Crane hook */}
            <mesh position={[0.4, 0.9, 0.9]}>
              <torusGeometry args={[0.12, 0.03, 8, 16, Math.PI]} />
              <meshStandardMaterial color="#3f3f46" metalness={0.9} />
            </mesh>
            {/* Large wheels */}
            {[
              [-0.5, 0.2, 0.4], [0.5, 0.2, 0.4],
              [-0.5, 0.2, -0.4], [0.5, 0.2, -0.4]
            ].map((pos, i) => (
              <group key={i} position={pos}>
                <mesh rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
                  <meshStandardMaterial color="#1f2937" roughness={0.9} />
                </mesh>
                {/* Wheel rim */}
                <mesh rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.12, 0.12, 0.16, 8]} />
                  <meshStandardMaterial color="#71717a" metalness={0.8} />
                </mesh>
              </group>
            ))}
            {/* Warning lights */}
            {[-0.5, 0.5].map((x, i) => (
              <mesh key={i} position={[x, 1.15, 0]}>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshStandardMaterial
                  color="#ef4444"
                  emissive="#ef4444"
                  emissiveIntensity={0.8}
                />
              </mesh>
            ))}
            {/* Warning stripes on body */}
            <mesh position={[0, 0.75, 0.51]}>
              <boxGeometry args={[1.4, 0.15, 0.02]} />
              <meshStandardMaterial color="#fef08a" />
            </mesh>
            {Array.from({ length: 7 }).map((_, i) => (
              <mesh key={i} position={[-0.6 + i * 0.2, 0.75, 0.52]}>
                <boxGeometry args={[0.1, 0.15, 0.01]} />
                <meshStandardMaterial color="#1f2937" />
              </mesh>
            ))}
          </group>
        )

      case '🚧': // Unjumpable obstacles - Partition Wall (office) or Security Gate (factory)
        // Check if it's office partition or factory gate based on the item name
        if (item.name === 'Partition Wall') {
          // Office Partition Wall - glass/metal partition (narrow, single lane)
          return (
            <group>
              {/* Main frame - metal structure */}
              <mesh position={[0, 0.7, 0]} castShadow>
                <boxGeometry args={[1.0, 1.4, 0.15]} />
                <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
              </mesh>
              {/* Glass panels */}
              <mesh position={[0, 0.8, 0.02]}>
                <boxGeometry args={[0.85, 1.0, 0.05]} />
                <meshStandardMaterial
                  color="#93c5fd"
                  transparent
                  opacity={0.4}
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>
              {/* Top bar */}
              <mesh position={[0, 1.4, 0]} castShadow>
                <boxGeometry args={[1.1, 0.08, 0.18]} />
                <meshStandardMaterial color="#475569" metalness={0.8} />
              </mesh>
              {/* Bottom bar */}
              <mesh position={[0, 0.08, 0]} castShadow>
                <boxGeometry args={[1.1, 0.16, 0.18]} />
                <meshStandardMaterial color="#475569" metalness={0.8} />
              </mesh>
              {/* Side posts */}
              {[-0.45, 0.45].map((x, i) => (
                <mesh key={i} position={[x, 0.7, 0]} castShadow>
                  <boxGeometry args={[0.08, 1.4, 0.18]} />
                  <meshStandardMaterial color="#334155" metalness={0.8} />
                </mesh>
              ))}
              {/* Warning sign */}
              <mesh position={[0, 1.1, 0.1]}>
                <boxGeometry args={[0.4, 0.2, 0.02]} />
                <meshStandardMaterial color="#fef08a" />
              </mesh>
              {/* Warning stripes on sign */}
              {[-0.12, 0, 0.12].map((x, i) => (
                <mesh key={i} position={[x, 1.1, 0.12]}>
                  <boxGeometry args={[0.05, 0.16, 0.01]} />
                  <meshStandardMaterial color="#dc2626" />
                </mesh>
              ))}
              {/* Warning lights on top */}
              {[-0.25, 0.25].map((x, i) => (
                <mesh key={i} position={[x, 1.48, 0]}>
                  <sphereGeometry args={[0.06, 8, 8]} />
                  <meshStandardMaterial
                    color="#ef4444"
                    emissive="#ef4444"
                    emissiveIntensity={1.0}
                  />
                </mesh>
              ))}
            </group>
          )
        } else {
          // Factory Security Gate - industrial roller door/gate (narrow, single lane)
          return (
            <group>
              {/* Main gate frame */}
              <mesh position={[0, 0.7, 0]} castShadow>
                <boxGeometry args={[1.1, 1.5, 0.25]} />
                <meshStandardMaterial color="#78716c" metalness={0.6} roughness={0.4} />
              </mesh>
              {/* Horizontal roller slats */}
              {Array.from({ length: 6 }).map((_, i) => (
                <mesh key={i} position={[0, 0.15 + i * 0.22, 0.14]} castShadow>
                  <boxGeometry args={[0.95, 0.18, 0.04]} />
                  <meshStandardMaterial
                    color={i % 2 === 0 ? '#a8a29e' : '#78716c'}
                    metalness={0.7}
                    roughness={0.3}
                  />
                </mesh>
              ))}
              {/* Side pillars */}
              {[-0.6, 0.6].map((x, i) => (
                <mesh key={i} position={[x, 0.7, 0]} castShadow>
                  <boxGeometry args={[0.12, 1.6, 0.3]} />
                  <meshStandardMaterial color="#57534e" metalness={0.7} />
                </mesh>
              ))}
              {/* Top housing for roller mechanism */}
              <mesh position={[0, 1.5, 0]} castShadow>
                <boxGeometry args={[1.2, 0.15, 0.35]} />
                <meshStandardMaterial color="#44403c" metalness={0.6} />
              </mesh>
              {/* Warning stripes - yellow/black */}
              <mesh position={[0, 0.7, 0.14]}>
                <boxGeometry args={[0.95, 0.3, 0.02]} />
                <meshStandardMaterial color="#fef08a" />
              </mesh>
              {Array.from({ length: 5 }).map((_, i) => (
                <mesh key={i} position={[-0.35 + i * 0.19, 0.7, 0.15]}>
                  <boxGeometry args={[0.09, 0.3, 0.01]} />
                  <meshStandardMaterial color="#1f2937" />
                </mesh>
              ))}
              {/* Warning lights on posts */}
              {[-0.6, 0.6].map((x, i) => (
                <mesh key={i} position={[x, 1.55, 0.12]}>
                  <cylinderGeometry args={[0.06, 0.06, 0.1, 8]} />
                  <meshStandardMaterial
                    color="#f59e0b"
                    emissive="#f59e0b"
                    emissiveIntensity={1.0}
                  />
                </mesh>
              ))}
            </group>
          )
        }

      default:
        // Generic warning obstacle - striped barrier
        return (
          <group>
            {/* Main barrier body */}
            <mesh position={[0, 0.3, 0]} castShadow>
              <boxGeometry args={[0.8, 0.6, 0.3]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.6} />
            </mesh>
            {/* Warning stripes */}
            {[-0.2, 0, 0.2].map((y, i) => (
              <mesh key={i} position={[0, 0.15 + y, 0.16]}>
                <boxGeometry args={[0.75, 0.12, 0.02]} />
                <meshStandardMaterial color="#1f2937" />
              </mesh>
            ))}
            {/* Support legs */}
            {[-0.3, 0.3].map((x, i) => (
              <mesh key={`leg-${i}`} position={[x, -0.1, 0]} castShadow>
                <boxGeometry args={[0.1, 0.4, 0.25]} />
                <meshStandardMaterial color="#f97316" roughness={0.7} />
              </mesh>
            ))}
            {/* Warning light on top */}
            <mesh position={[0, 0.65, 0]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial
                color="#ef4444"
                emissive="#ef4444"
                emissiveIntensity={0.5}
              />
            </mesh>
          </group>
        )
    }
  }

  // Get scale based on item size property
  const getScale = () => {
    switch (item.size) {
      case 'small': return 1.5
      case 'medium': return 2.0
      case 'large': return 2.5
      case 'wide': return [2.5, 1.0, 2.5]
      case 'unjumpable': return 2.5 // Large scale for unjumpable obstacles
      default: return 2.0
    }
  }

  return (
    <group
      ref={meshRef}
      position={[item.position[0], item.position[1], item.position[2]]}
      scale={getScale()}
    >
      {renderObstacle()}
    </group>
  )
}

