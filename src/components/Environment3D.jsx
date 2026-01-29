import { motion } from 'framer-motion'
import './Environment3D.css'

export default function Environment3D({ characterType }) {
  const isOffice = characterType === 'office'

  return (
    <div className={`environment-3d ${characterType}`}>
      {/* 3D Perspective container */}
      <div className="perspective-container">

        {/* Floor/Ground with perspective */}
        <div className="floor-3d">
          <div className="floor-grid">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="grid-line"
                animate={{ z: [0, 1000] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: i * 0.1
                }}
              />
            ))}
          </div>

          {/* Lane markers */}
          <div className="lane-markers">
            <div className="lane-marker left" />
            <div className="lane-marker right" />
          </div>
        </div>

        {/* Background buildings/structures */}
        <div className="background-3d">
          {isOffice ? (
            <>
              {/* Office environment */}
              <div className="office-building left-building">
                <div className="building-face front">
                  <div className="window-grid">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div key={i} className="window" />
                    ))}
                  </div>
                </div>
                <div className="building-face side" />
              </div>

              <div className="office-building right-building">
                <div className="building-face front">
                  <div className="window-grid">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div key={i} className="window" />
                    ))}
                  </div>
                </div>
                <div className="building-face side" />
              </div>

              {/* Office elements */}
              <div className="office-elements">
                <motion.div
                  className="desk-3d obstacle-item"
                  animate={{ z: [-500, 1500] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="desk-top" />
                  <div className="desk-leg leg-1" />
                  <div className="desk-leg leg-2" />
                  <div className="desk-leg leg-3" />
                  <div className="desk-leg leg-4" />
                </motion.div>

                <motion.div
                  className="filing-cabinet obstacle-item"
                  animate={{ z: [-800, 1200] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'linear', delay: 1 }}
                >
                  <div className="cabinet-front" />
                  <div className="cabinet-side" />
                  <div className="cabinet-top" />
                </motion.div>
              </div>
            </>
          ) : (
            <>
              {/* Factory environment */}
              <div className="factory-wall left-wall">
                <div className="wall-panels">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="metal-panel" />
                  ))}
                </div>
                <div className="pipes">
                  <div className="pipe pipe-1" />
                  <div className="pipe pipe-2" />
                </div>
              </div>

              <div className="factory-wall right-wall">
                <div className="wall-panels">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="metal-panel" />
                  ))}
                </div>
                <div className="pipes">
                  <div className="pipe pipe-1" />
                  <div className="pipe pipe-2" />
                </div>
              </div>

              {/* Factory elements */}
              <div className="factory-elements">
                <motion.div
                  className="crate-3d obstacle-item"
                  animate={{ z: [-600, 1400] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="crate-face front" />
                  <div className="crate-face back" />
                  <div className="crate-face left" />
                  <div className="crate-face right" />
                  <div className="crate-face top" />
                </motion.div>

                <motion.div
                  className="barrel-3d obstacle-item"
                  animate={{ z: [-900, 1100] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: 'linear', delay: 1.5 }}
                >
                  <div className="barrel-body" />
                  <div className="barrel-ring ring-1" />
                  <div className="barrel-ring ring-2" />
                  <div className="barrel-top" />
                </motion.div>

                <motion.div
                  className="machinery-3d obstacle-item"
                  animate={{
                    z: [-700, 1300],
                    rotateY: [0, 360]
                  }}
                  transition={{
                    z: { duration: 4, repeat: Infinity, ease: 'linear', delay: 0.5 },
                    rotateY: { duration: 8, repeat: Infinity, ease: 'linear' }
                  }}
                >
                  <div className="machine-base" />
                  <div className="machine-gear" />
                </motion.div>
              </div>
            </>
          )}
        </div>

        {/* Ceiling/Sky */}
        <div className={`ceiling-3d ${isOffice ? 'office-ceiling' : 'factory-ceiling'}`}>
          {isOffice ? (
            <div className="ceiling-lights">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="ceiling-light" />
              ))}
            </div>
          ) : (
            <div className="overhead-cranes">
              <div className="crane crane-1" />
              <div className="crane crane-2" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

