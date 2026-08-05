"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, Stars, MeshDistortMaterial } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

/* ---------- 鼠标跟踪（window 级别，不依赖 canvas 指针事件） ---------- */
const pointer = { x: 0, y: 0 };
function usePointerTracking() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
}

/* ---------- 全屏中国风景背景（雪山星空 + Ken Burns CSS 动画驱动动态感） ---------- */
function SceneryBackground() {
  const texture = useTexture("/images/backgrounds/hero-misty-mountains.jpg");
  return (
    <mesh frustumCulled={false} renderOrder={-10}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial map={texture} depthTest={false} depthWrite={false} />
    </mesh>
  );
}

/* ---------- 液态金属中央体 ---------- */
function Central() {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const rings = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (inner.current) {
      inner.current.rotation.y += delta * 0.2;
      inner.current.rotation.x += delta * 0.07;
    }
    if (rings.current) {
      rings.current.rotation.z += delta * 0.12;
      rings.current.rotation.x = Math.sin(performance.now() * 0.0002) * 0.3;
    }
    if (group.current) {
      const tx = pointer.y * 0.35;
      const ty = pointer.x * 0.5;
      group.current.rotation.x += (tx - group.current.rotation.x) * 0.05;
      group.current.rotation.y += (ty - group.current.rotation.y) * 0.05;
    }
    if (halo.current) {
      const s = 1 + Math.sin(performance.now() * 0.0012) * 0.06;
      halo.current.scale.setScalar(s);
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={1.1}>
      <group ref={group}>
        {/* 柔光晕（伪 bloom） */}
        <mesh ref={halo} scale={2.6}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            color="#3fd9b6"
            transparent
            opacity={0.08}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* 中央液态金属晶体 */}
        <group ref={inner}>
          <mesh>
            <icosahedronGeometry args={[1.55, 12]} />
            <MeshDistortMaterial
              color="#d4af37"
              emissive="#a67c1f"
              emissiveIntensity={0.5}
              roughness={0.12}
              metalness={1}
              distort={0.42}
              speed={2.2}
            />
          </mesh>
          {/* 发光内核 */}
          <mesh scale={0.55}>
            <icosahedronGeometry args={[1, 1]} />
            <meshBasicMaterial color="#f7ecc9" />
          </mesh>
          {/* 青色光环 */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2.55, 0.025, 18, 120]} />
            <meshStandardMaterial
              color="#7ff0d4"
              emissive="#3fd9b6"
              emissiveIntensity={1.1}
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
        </group>

        {/* 环绕光环组（随鼠标/时间旋转） */}
        <group ref={rings}>
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[3.1, 0.012, 16, 140]} />
            <meshBasicMaterial color="#d4af37" transparent opacity={0.5} />
          </mesh>
          <mesh rotation={[0, Math.PI / 4, Math.PI / 6]}>
            <torusGeometry args={[3.5, 0.01, 16, 140]} />
            <meshBasicMaterial color="#7ff0d4" transparent opacity={0.35} />
          </mesh>
        </group>

        {/* 外围旋转线框 */}
        <mesh scale={4.2}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color="#d4af37" wireframe transparent opacity={0.12} />
        </mesh>
      </group>
    </Float>
  );
}

export default function Scene() {
  usePointerTracking();
  return (
    <Canvas
      camera={{ position: [0, 0, 6.2], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <SceneryBackground />

      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={60} color="#f7ecc9" />
      <pointLight position={[-6, -3, 2]} intensity={40} color="#3fd9b6" />
      <pointLight position={[0, -4, -3]} intensity={25} color="#d4af37" />

      <Stars radius={90} depth={50} count={3500} factor={4} fade speed={0.6} />
      <Sparkles count={140} scale={[12, 12, 6]} size={3.2} speed={0.4} color="#f7ecc9" />
      <Sparkles count={60} scale={[9, 9, 4]} size={5} speed={0.25} color="#7ff0d4" />
      <Central />
    </Canvas>
  );
}
