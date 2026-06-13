import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, MeshTransmissionMaterial, Float } from "@react-three/drei"
import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"

const orange = "#ff5a00"

function GlassMaterial({ roughness = 0.08, thickness = 1.2, chromaticAberration = 0.05 }) {
  return (
    <MeshTransmissionMaterial
      backside
      samples={4}
      resolution={256}
      transmission={1}
      roughness={roughness}
      thickness={thickness}
      ior={1.35}
      chromaticAberration={chromaticAberration}
      anisotropy={0.15}
      distortion={0.08}
      distortionScale={0.25}
      temporalDistortion={0.05}
      color="#ffffff"
    />
  )
}

function Orbit({ radius = 2.2, rotation = [1.2, 0.2, 0.1] }) {
  return (
    <mesh rotation={rotation}>
      <torusGeometry args={[radius, 0.012, 12, 180]} />
      <meshBasicMaterial color={orange} toneMapped={false} />
    </mesh>
  )
}

function HeroSculpture({ detail }) {
  const group = useRef()
  const rings = useMemo(() => Array.from({ length: detail === "full" ? 9 : 6 }), [detail])

  useFrame((state, delta) => {
    group.current.rotation.y += delta * 0.08
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, state.pointer.y * 0.12, 0.035)
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -state.pointer.x * 0.09, 0.035)
  })

  return (
    <group ref={group}>
      {rings.map((_, index) => (
        <mesh
          key={index}
          rotation={[index * 0.43, index * 0.72, index * 0.26]}
          scale={1 + index * 0.025}
        >
          <torusGeometry args={[1.5, 0.25, detail === "full" ? 32 : 16, detail === "full" ? 96 : 48]} />
          <GlassMaterial thickness={0.85} />
        </mesh>
      ))}
      <mesh>
        <icosahedronGeometry args={[0.48, 3]} />
        <meshStandardMaterial color={orange} emissive={orange} emissiveIntensity={2.2} roughness={0.15} />
      </mesh>
      <Orbit radius={2.25} />
      <pointLight color={orange} intensity={25} distance={9} />
    </group>
  )
}

function CubeSystem({ detail }) {
  const group = useRef()
  useFrame((state) => {
    group.current.rotation.y = state.clock.elapsedTime * 0.13 + state.pointer.x * 0.18
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.12
  })

  return (
    <group ref={group}>
      <mesh rotation={[0.45, 0.5, 0.1]}>
        <boxGeometry args={[2.5, 2.5, 2.5, detail === "full" ? 4 : 1, detail === "full" ? 4 : 1, detail === "full" ? 4 : 1]} />
        <GlassMaterial roughness={0.04} thickness={1.8} chromaticAberration={0.08} />
      </mesh>
      {[-0.62, 0, 0.62].map((x) => (
        <mesh key={x} position={[x, 0, 0]}>
          <torusGeometry args={[0.45, 0.13, 20, 64]} />
          <meshStandardMaterial color={x === 0 ? orange : "#111111"} roughness={0.25} metalness={0.6} />
        </mesh>
      ))}
      <Orbit radius={2.1} rotation={[1.5, 0.4, 0.5]} />
      <pointLight color={orange} position={[1, 1, 2]} intensity={18} />
    </group>
  )
}

function LiquidImpact({ detail }) {
  const group = useRef()
  const knots = useMemo(() => Array.from({ length: detail === "full" ? 5 : 3 }), [detail])

  useFrame((state, delta) => {
    group.current.rotation.y -= delta * 0.1
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.12
  })

  return (
    <group ref={group}>
      {knots.map((_, index) => (
        <mesh key={index} rotation={[index * 0.65, index * 0.35, index * 0.86]} scale={1 - index * 0.08}>
          <torusKnotGeometry args={[1.25, 0.18, detail === "full" ? 180 : 80, 18, 2 + (index % 2), 3]} />
          <GlassMaterial thickness={0.7} chromaticAberration={0.1} />
        </mesh>
      ))}
      <mesh scale={0.36}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color={orange} toneMapped={false} />
      </mesh>
      <pointLight color={orange} intensity={35} distance={10} />
    </group>
  )
}

function ServiceForm({ detail }) {
  const group = useRef()
  useFrame((state) => {
    group.current.rotation.y = state.clock.elapsedTime * 0.09
    group.current.rotation.z = state.pointer.x * 0.08
  })

  return (
    <group ref={group}>
      <mesh rotation={[0.2, 0.4, 0]}>
        <torusKnotGeometry args={[1.25, 0.32, detail === "full" ? 160 : 70, 24, 3, 5]} />
        <GlassMaterial roughness={0.12} thickness={1.4} />
      </mesh>
      {[0, 1, 2].map((index) => (
        <mesh key={index} position={[Math.cos(index * 2.1) * 1.65, Math.sin(index * 2.1) * 1.3, 0]}>
          <octahedronGeometry args={[index === 1 ? 0.28 : 0.18]} />
          <meshStandardMaterial color={orange} emissive={orange} emissiveIntensity={1.4} />
        </mesh>
      ))}
      <Orbit radius={2.05} rotation={[0.3, 1.1, 0.8]} />
    </group>
  )
}

function StageScene({ detail }) {
  const { viewport } = useThree()
  const [section, setSection] = useState(0)
  const root = useRef()

  useEffect(() => {
    const update = () => {
      const marker = window.innerHeight * 0.52
      const sections = [...document.querySelectorAll("[data-scene]")]
      const index = sections.findIndex((node) => {
        const rect = node.getBoundingClientRect()
        return rect.top <= marker && rect.bottom >= marker
      })
      if (index >= 0) setSection(index)
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  useFrame(() => {
    const xTarget = section === 0 ? viewport.width * 0.22 : section % 2 ? -viewport.width * 0.22 : viewport.width * 0.22
    root.current.position.x = THREE.MathUtils.lerp(root.current.position.x, xTarget, 0.035)
    root.current.scale.setScalar(THREE.MathUtils.lerp(root.current.scale.x, section === 2 ? 1.18 : 1, 0.035))
  })

  const forms = [
    <HeroSculpture detail={detail} />,
    <CubeSystem detail={detail} />,
    <LiquidImpact detail={detail} />,
    <ServiceForm detail={detail} />,
    <HeroSculpture detail={detail} />,
    <LiquidImpact detail={detail} />,
  ]

  return (
    <group ref={root}>
      <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.2}>
        {forms.map((form, index) => (
          <group key={index} visible={section === index}>
            {form}
          </group>
        ))}
      </Float>
    </group>
  )
}

export function WebGLStage({ quality }) {
  if (quality === "fallback") {
    return <div className="fallback-sculpture" aria-hidden="true" />
  }

  return (
    <div className="webgl-stage" aria-hidden="true">
      <Canvas
        dpr={quality === "full" ? [1, 1.6] : 1}
        camera={{ position: [0, 0, 7], fov: 38 }}
        gl={{ antialias: quality === "full", alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={1.4} />
        <directionalLight position={[4, 5, 5]} intensity={4} color="#ffffff" />
        <directionalLight position={[-4, -2, 3]} intensity={2} color="#ff5a00" />
        <Suspense fallback={null}>
          <StageScene detail={quality} />
          <Environment preset="studio" environmentIntensity={0.65} />
        </Suspense>
      </Canvas>
    </div>
  )
}
