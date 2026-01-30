import { Canvas } from '@react-three/fiber'
import { OrbitControls, useTexture, DeviceOrientationControls } from '@react-three/drei'
import * as THREE from 'three'
import { useState, useEffect, Suspense } from 'react'
import Arrow from './Arrow'

function PanoramaScene({ locationId, locations, onNavigate, isGyroEnabled }) {
  const currentLocation = locations.find(loc => loc.id === locationId)
  
  // Resolve asset path dynamically
  const imageUrl = new URL(`../assets/${currentLocation.image}`, import.meta.url).href
  const texture = useTexture(imageUrl)
  
  // Preload neighbors
  useEffect(() => {
    Object.values(currentLocation.links).forEach(link => {
      if (link && link.id) {
        const nextLoc = locations.find(loc => loc.id === link.id)
        if (nextLoc) {
          const nextUrl = new URL(`../assets/${nextLoc.image}`, import.meta.url).href
          useTexture.preload(nextUrl)
        }
      }
    })
  }, [currentLocation, locations])

  const arrowPositions = {
    forward: [0, -2, -15],
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
      
      {Object.entries(currentLocation.links).map(([dir, link]) => (
        link && (
          <Arrow 
            key={dir}
            position={arrowPositions[dir]}
            onClick={() => onNavigate(link.id)}
            label={link.label} // Pass label to Arrow
          />
        )
      ))}

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
  const [locations, setLocations] = useState([])
  const [currentId, setCurrentId] = useState('road')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [opacity, setOpacity] = useState(0)
  const [isGyroEnabled, setIsGyroEnabled] = useState(false)
  const [error, setError] = useState(null)

  // Fetch locations from Backend
  useEffect(() => {
    fetch('http://localhost:3000/api/locations')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch locations')
        return res.json()
      })
      .then(data => setLocations(data))
      .catch(err => {
        console.error(err)
        setError(err.message)
      })
  }, [])

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

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Error Loading Tour</h2>
          <p className="text-red-400">{error}</p>
          <p className="text-sm mt-4 text-slate-400">Make sure the backend server (port 3000) is running.</p>
        </div>
      </div>
    )
  }

  if (locations.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-900 text-white">
        <p>Loading Tour...</p>
      </div>
    )
  }

  return (
    <div className="w-full h-screen relative bg-black">
      <Canvas 
        camera={{ position: [0, 0, 0.1] }}
        dpr={[1, 2]} 
        gl={{ powerPreference: "high-performance", antialias: false }}
      >
        <Suspense fallback={null}>
          <PanoramaScene 
            locationId={currentId} 
            locations={locations}
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
