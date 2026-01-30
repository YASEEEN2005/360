import { Canvas } from '@react-three/fiber'
import { OrbitControls, useTexture, DeviceOrientationControls } from '@react-three/drei'
import * as THREE from 'three'
import { useState, useEffect, Suspense } from 'react'
import Arrow from './Arrow'
import { locations } from '../data/locations'

function PanoramaScene({ locationId, onNavigate, isGyroEnabled }) {
  const currentLocation = locations.find(loc => loc.id === locationId)
  const texture = useTexture(currentLocation.image)
  
  // Preload neighbors
  useEffect(() => {
    Object.values(currentLocation.links).forEach(nextId => {
      if (nextId) {
        const nextLoc = locations.find(loc => loc.id === nextId)
        if (nextLoc) useTexture.preload(nextLoc.image)
      }
    })
  }, [currentLocation])

  const arrowPositions = {
    forward: [0, -2, -15], // Closer and higher
    back: [0, -2, 15],
    left: [-15, -2, 0],
    right: [15, -2, 0]
  }

  return (
    <>
      <mesh rotation={[0, -Math.PI / 2, 0]}>
        <sphereGeometry args={[500, 60, 40]} />
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      </mesh>
      
      {Object.entries(currentLocation.links).map(([dir, nextId]) => (
        nextId && (
          <Arrow 
            key={dir}
            position={arrowPositions[dir]}
            onClick={() => onNavigate(nextId)}
          />
        )
      ))}

      {/* Conditionally use Gyro or Orbit controls */}
      {isGyroEnabled ? (
        <DeviceOrientationControls />
      ) : (
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          rotateSpeed={-0.5} 
        />
      )}
    </>
  )
}

export default function PanoramaViewer() {
  const [currentId, setCurrentId] = useState('road')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [opacity, setOpacity] = useState(0)
  const [isGyroEnabled, setIsGyroEnabled] = useState(false)
  
  // Clean up gyro state if it's not supported or on unmount
  useEffect(() => {
    return () => setIsGyroEnabled(false)
  }, [])

  const handleNavigate = (nextId) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setOpacity(1)
    
    setTimeout(() => {
      setCurrentId(nextId)
      setTimeout(() => {
        setOpacity(0)
        setIsTransitioning(false)
      }, 100)
    }, 500)
  }

  return (
    <div className="w-full h-screen relative bg-black">
      {/* Performance Optimization: Cap dpr at 2 for high density screens */}
      <Canvas 
        camera={{ position: [0, 0, 0.1] }}
        dpr={[1, 2]} 
        gl={{ powerPreference: "high-performance", antialias: false }} // Disable antialias for performance
      >
        <Suspense fallback={null}>
          <PanoramaScene 
            locationId={currentId} 
            onNavigate={handleNavigate} 
            isGyroEnabled={isGyroEnabled}
          />
        </Suspense>
      </Canvas>
      
      {/* UI Controls */}
      <div className="absolute bottom-6 right-6 z-20 flex gap-2">
        <button
          onClick={() => setIsGyroEnabled(!isGyroEnabled)}
          className={`px-4 py-2 rounded-full font-bold backdrop-blur-md transition-colors ${
            isGyroEnabled 
              ? 'bg-blue-500/80 text-white' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          {isGyroEnabled ? 'Gyro On' : 'Gyro Off'}
        </button>
      </div>

      {/* Transition Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none bg-black transition-opacity duration-500 ease-in-out z-50"
        style={{ opacity: opacity }}
      />
    </div>
  )
}
