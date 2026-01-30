import { useRef, useState } from 'react'
import { Billboard, Text, Ring, Circle } from '@react-three/drei'
import * as THREE from 'three'

export default function Arrow({ position, onClick, label, ...props }) {
  const [hovered, setHovered] = useState(false)
  const ref = useRef()

  return (
    <Billboard position={position} follow={true} lockX={false} lockY={false} lockZ={false}>
      <group
        ref={ref}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
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

        {/* Outer Ring (Border) */}
        <Ring args={[0.4, 0.5, 32]} material-color="white" material-opacity={0.9} material-transparent />
        
        {/* Inner Circle (Background) */}
        <Circle args={[0.4, 32]} material-color="black" material-opacity={0.4} material-transparent />

        {/* Chevron Arrow (Using a Triangle or Shape) */}
        <mesh position={[0, -0.05, 0.01]} rotation={[0, 0, 0]}>
          <shapeGeometry args={[new THREE.Shape().moveTo(-0.2, -0.1).lineTo(0, 0.2).lineTo(0.2, -0.1).lineTo(0, 0.05)]} />
          <meshBasicMaterial color="white" />
        </mesh>

        {/* Pulse Effect Ring (Optional) */}
        {hovered && (
             <Ring args={[0.5, 0.55, 32]} material-color="white" material-opacity={0.5} material-transparent />
        )}
      </group>
    </Billboard>
  )
}
