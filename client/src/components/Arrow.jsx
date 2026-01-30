import { useRef, useState } from 'react'
import { Billboard } from '@react-three/drei'

export default function Arrow({ position, onClick, ...props }) {
  const [hovered, setHovered] = useState(false)
  const ref = useRef()

  return (
    <Billboard position={position} follow={true} lockX={false} lockY={false} lockZ={false}>
      <group
        ref={ref}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
        {...props}
      >
        {/* Arrow Head */}
        <mesh position={[0, 0.6, 0]} scale={[2, 2, 2]}> {/* Scaled up */}
          <coneGeometry args={[0.3, 0.6, 32]} />
          <meshStandardMaterial 
            color="white" 
            emissive="white" 
            emissiveIntensity={1} 
            toneMapped={false}
          />
        </mesh>
        
        {/* Arrow Shaft */}
        <mesh position={[0, 0, 0]} scale={[2, 2, 2]}> {/* Scaled up */}
          <cylinderGeometry args={[0.10, 0.10, 0.6, 32]} />
          <meshStandardMaterial 
            color="white" 
            emissive="white" 
            emissiveIntensity={1} 
            toneMapped={false}
          />
        </mesh>
      </group>
    </Billboard>
  )
}
