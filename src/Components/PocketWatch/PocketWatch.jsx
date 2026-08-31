import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function PocketWatch({
  handColor = '#ffd24d', // Bright Luxury Gold (or '#ffffff' / '#1a1a1a')
  animateHands = true,   // Rotate the clock hands clockwise
  handSpeed = 1,         // Speed multiplier
  ...props
}) {
  const group = useRef()
  const { scene } = useGLTF('/models/pocket_watch3/s3.glb')

  // Pivot groups for the two hands
  const minutePivotRef = useRef()
  const hourPivotRef = useRef()

  useEffect(() => {
    if (!scene) return

    scene.updateMatrixWorld(true)

    // 1. Exact pivot pin connection point between the two hands
    const pivotPoint = new THREE.Vector3(0.04761042, -0.00672, -0.04251513)

    // 2. Create 2 pivot groups located at the pin center
    const minutePivot = new THREE.Group()
    const hourPivot = new THREE.Group()

    minutePivot.position.copy(pivotPoint)
    hourPivot.position.copy(pivotPoint)

    scene.add(minutePivot)
    scene.add(hourPivot)

    minutePivotRef.current = minutePivot
    hourPivotRef.current = hourPivot

    // 3. Attach hand meshes to the pivot groups without displacing them
    const lineHand = scene.getObjectByName('Line001')
    const cylHand = scene.getObjectByName('Cylinder005')

    if (lineHand) minutePivot.attach(lineHand)
    if (cylHand) hourPivot.attach(cylHand)

    // 4. Bold, non-transparent material for the hands
    const boldHandMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(handColor),
      metalness: 0.85,
      roughness: 0.15,
      transparent: false,
      opacity: 1.0,
      depthWrite: true,
      emissive: new THREE.Color(handColor).multiplyScalar(0.12),
    })

    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = false
        child.receiveShadow = false

        const isHand =
          child.name === 'Line001' ||
          child.name === 'Cylinder005' ||
          child.material?.name === 'Material__13'

        if (isHand) {
          child.material = boldHandMaterial
        } else if (child.material) {
          if (child.material.map) {
            child.material.map.colorSpace = THREE.SRGBColorSpace
            child.material.needsUpdate = true
          }
          child.material.transparent = false
          child.material.opacity = 1.0
        }
      }
    })
  }, [scene, handColor])

  // 5. Rotate the clock hands CLOCKWISE around their center pin
  useFrame((state, delta) => {
    if (animateHands) {
      // Minute Hand rotation (faster)
      if (minutePivotRef.current) {
        minutePivotRef.current.rotation.z -= delta * 1.5 * handSpeed
      }
      // Hour Hand rotation (slower)
      if (hourPivotRef.current) {
        hourPivotRef.current.rotation.z -= (delta * 1.5 * handSpeed) / 12
      }
    }
  })

  return <primitive ref={group} object={scene} {...props} />
}

useGLTF.preload('/models/pocket_watch3/s3.glb')
// wkfnkwnfkwnfen