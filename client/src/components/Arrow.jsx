import { useRef, useState } from 'react'
import { Billboard, Text, Ring, Circle } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Arrow({ position, onClick, label, scale = 1, ...props }) {
  const [hovered, setHovered] = useState(false)
  const groupRef = useRef()
  const ringRef = useRef()

  // Animation Loop
  useFrame((state) => {
    if (ringRef.current) {
      // Create a time-based pulse
      const t = (state.clock.elapsedTime * 1.5) % 1
      
      // Scale goes from 1 to 2
      const s = 1 + t
      ringRef.current.scale.set(s, s, 1)
      
      // Opacity fades out as it gets larger (1 -> 0)
      ringRef.current.material.opacity = 0.8 * (1 - t)
    }
  })

  // baseScale allows passing a custom size from props (default 1)
  // hovered adds a 10% increase
  const finalScale = (scale || 1) * (hovered ? 1.1 : 1)

  return (
    <Billboard position={position} follow={true} lockX={false} lockY={false} lockZ={false}>
      <group
        ref={groupRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={finalScale}
        {...props}
      >
        {/* Label specific to this arrow */}
        {label && (
          <Text
            position={[0, 1.2, 0]} // Float above the disc
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {label}
          </Text>
        )}

        {/* Central Button */}
        <group>
            {/* Outer Ring (Border) */}
            <Ring args={[0.38, 0.42, 32]} material-color="white" material-opacity={0.9} material-transparent />
            
            {/* Inner Circle (Background) */}
            <Circle args={[0.38, 32]} material-color="black" material-opacity={0.4} material-transparent />

            {/* Chevron Arrow */}
            <mesh position={[0, -0.05, 0.01]} rotation={[0, 0, 0]}>
            <shapeGeometry args={[new THREE.Shape().moveTo(-0.15, -0.1).lineTo(0, 0.15).lineTo(0.15, -0.1).lineTo(0, 0.02)]} />
            <meshBasicMaterial color="white" />
            </mesh>
        </group>

        {/* Animated Pulse Ring */}
        <Ring 
            ref={ringRef}
            args={[0.42, 0.45, 32]} 
            material-color="white" 
            material-transparent 
            position={[0, 0, -0.01]} // Slightly behind
        />
      </group>
    </Billboard>
  )
}
