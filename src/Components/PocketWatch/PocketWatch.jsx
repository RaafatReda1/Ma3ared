import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useMemo } from 'react'
import * as THREE from 'three'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js'
import audioTic from '../../../public/freesound_community-tactactac-103657.mp3'

export function PocketWatch({
  handColor = '#ffd24d',
  animateHands = true,
  ...props
}) {
  const group = useRef()

  const { scene: rawScene } = useGLTF('/models/pocket_watch3/s3.glb')
  // Clone scene so every canvas/instance has its own isolated scene graph
  const scene = useMemo(() => {
    if (!rawScene) return null
    return SkeletonUtils.clone(rawScene)
  }, [rawScene])

  const minutePivotRef = useRef()
  const hourPivotRef = useRef()

  // زاوية البداية الحقيقية للعقربين في الموديل
  const minuteStartAngleRef = useRef(0)
  const hourStartAngleRef = useRef(0)

  const animationStartRef = useRef(null)

  // الصوت
  const tickAudioRef = useRef(null)

  // آخر حركة تم تشغيل صوتها
  const lastStepRef = useRef(-1)


  /*
    إعداد الموديل
  */

  useEffect(() => {
    if (!scene) return

    scene.updateMatrixWorld(true)

    const pivotPoint = new THREE.Vector3(
      0.04761042,
      -0.00672,
      -0.04251513
    )

    const minutePivot = new THREE.Group()
    const hourPivot = new THREE.Group()

    minutePivot.position.copy(pivotPoint)
    hourPivot.position.copy(pivotPoint)

    scene.add(minutePivot)
    scene.add(hourPivot)

    minutePivotRef.current = minutePivot
    hourPivotRef.current = hourPivot

    const lineHand = scene.getObjectByName('Line001')
    const cylHand = scene.getObjectByName('Cylinder005')

    if (lineHand) {
      minutePivot.attach(lineHand)
    }

    if (cylHand) {
      hourPivot.attach(cylHand)
    }


    /*
      نحسب اتجاه العقرب الحقيقي داخل الموديل
    */

    if (lineHand) {
      const box = new THREE.Box3().setFromObject(lineHand)
      const center = new THREE.Vector3()

      box.getCenter(center)

      const pivotWorld = new THREE.Vector3()
      minutePivot.getWorldPosition(pivotWorld)

      const direction = center.clone().sub(pivotWorld)

      minuteStartAngleRef.current =
        Math.atan2(direction.y, direction.x)
    }

    if (cylHand) {
      const box = new THREE.Box3().setFromObject(cylHand)
      const center = new THREE.Vector3()

      box.getCenter(center)

      const pivotWorld = new THREE.Vector3()
      hourPivot.getWorldPosition(pivotWorld)

      const direction = center.clone().sub(pivotWorld)

      hourStartAngleRef.current =
        Math.atan2(direction.y, direction.x)
    }


    /*
      Material
    */

    const boldHandMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(handColor),
      metalness: 0.9,
      roughness: 0.15,
      transparent: false,
      opacity: 1,
      depthWrite: true,
      emissive: new THREE.Color(handColor).multiplyScalar(0.15),
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

          // Premium gold and crystal materials
          if (child.material.metalness !== undefined) {
            child.material.metalness = 0.85
            child.material.roughness = 0.2
          }

          child.material.transparent = false
          child.material.opacity = 1
          child.material.needsUpdate = true
        }
      }
    })

  }, [scene, handColor])


  /*
    تجهيز الصوت
  */

  useEffect(() => {

    const audio = new Audio(audioTic)

    audio.preload = 'auto'
    audio.volume = 0.5

    tickAudioRef.current = audio

    return () => {

      audio.pause()
      audio.currentTime = 0

      tickAudioRef.current = null

    }

  }, [])


  /*
    Unlock للصوت على الموبايل
  */

  useEffect(() => {

    const unlockAudio = () => {

      const audio = tickAudioRef.current

      if (!audio) return

      audio
        .play()
        .then(() => {

          audio.pause()
          audio.currentTime = 0

        })
        .catch(() => {})

    }


    window.addEventListener(
      'touchstart',
      unlockAudio,
      { once: true }
    )

    window.addEventListener(
      'click',
      unlockAudio,
      { once: true }
    )


    return () => {

      window.removeEventListener(
        'touchstart',
        unlockAudio
      )

      window.removeEventListener(
        'click',
        unlockAudio
      )

    }

  }, [])


  /*
    بداية الـ Loop
  */

  useEffect(() => {

    if (!animateHands) {

      animationStartRef.current = null
      lastStepRef.current = -1

      return
    }

    animationStartRef.current = performance.now()

    lastStepRef.current = -1

  }, [animateHands])


  /*
    Animation
  */

  useFrame(() => {

    if (!animateHands) {
      // Freeze both hands at their initial 12-o'clock rest positions
      if (minutePivotRef.current) {
        minutePivotRef.current.rotation.z =
          -minuteStartAngleRef.current + Math.PI / 2
      }
      if (hourPivotRef.current) {
        hourPivotRef.current.rotation.z =
          -hourStartAngleRef.current + Math.PI / 2
      }
      return
    }

    if (
      !minutePivotRef.current ||
      !hourPivotRef.current ||
      animationStartRef.current === null
    ) {
      return
    }


    const elapsed =
      performance.now() - animationStartRef.current


    /*
      5 ثواني Forward
      5 ثواني Reverse

      Loop كامل = 10 ثواني
    */

    const duration = 5000
    const loopDuration = duration * 2

    const loopTime =
      elapsed % loopDuration


    /*
      15 حركة خلال 5 ثواني

      كل حركة = 6 درجات
    */

    const totalSteps = 15

    const stepDuration =
      duration / totalSteps


    let currentStep = 0
    let progress = 0

    let reverse = false


    /*
      Forward

      12 → 3
    */

    if (loopTime < duration) {

      currentStep = Math.min(
        Math.floor(
          loopTime / stepDuration
        ),
        totalSteps
      )

      progress =
        (loopTime % stepDuration) /
        stepDuration

    }


    /*
      Reverse

      3 → 12
    */

    else {

      reverse = true

      const reverseTime =
        loopTime - duration

      currentStep = Math.min(
        Math.floor(
          reverseTime / stepDuration
        ),
        totalSteps
      )

      progress =
        (reverseTime % stepDuration) /
        stepDuration

    }


    /*
      الصوت

      Forward:
      كل انتقال إلى Step جديد = تكة

      Reverse:
      كل انتقال إلى Step جديد = تكة
    */

    const stepKey = reverse
      ? totalSteps + currentStep
      : currentStep


    if (
      stepKey !== lastStepRef.current &&
      currentStep > 0
    ) {

      const audio = tickAudioRef.current

      if (audio) {

        audio.currentTime = 0

        audio.play().catch(() => {})

      }

      lastStepRef.current = stepKey
    }


    /*
      الزاوية

      Forward:
      0 → -90°

      Reverse:
      -90° → 0
    */

    const maxAngle =
      THREE.MathUtils.degToRad(90)

    let baseAngle


    if (!reverse) {

      baseAngle =
        -currentStep *
        THREE.MathUtils.degToRad(6)

    } else {

      baseAngle =
        -maxAngle +
        currentStep *
        THREE.MathUtils.degToRad(6)

    }


    /*
      اهتزاز خفيف بعد كل نقلة
    */

    let shake = 0

    if (progress < 0.22) {

      const shakeProgress =
        progress / 0.22

      shake =
        Math.sin(
          shakeProgress * Math.PI * 4
        ) *
        THREE.MathUtils.degToRad(0.7) *
        (1 - shakeProgress)

    }


    /*
      عقرب الدقائق
    */

    minutePivotRef.current.rotation.z =
      -minuteStartAngleRef.current +
      Math.PI / 2 +
      baseAngle +
      shake


    /*
      عقرب الساعات ثابت عند 12
    */

    hourPivotRef.current.rotation.z =
      -hourStartAngleRef.current +
      Math.PI / 2

  })


  return (
    <primitive
      ref={group}
      object={scene}
      {...props}
    />
  )
}


useGLTF.preload('/models/pocket_watch3/s3.glb')