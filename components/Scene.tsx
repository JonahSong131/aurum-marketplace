"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, Stars, MeshDistortMaterial } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

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

/* ---------- 全屏流体着色器背景（lusion 风格液态金/青流动） ---------- */
const fluidVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fluidFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uRes;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p); vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0,0.0));
    float c = hash(i + vec2(0.0,1.0));
    float d = hash(i + vec2(1.0,1.0));
    vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0; float a = 0.5;
    for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  void main(){
    vec2 uv = vUv;
    vec2 p = (uv - 0.5);
    p.x *= uRes.x / uRes.y;
    float t = uTime * 0.045;
    p += uMouse * 0.12;

    vec2 q = vec2(fbm(p*1.5 + t), fbm(p*1.5 + vec2(5.2,1.3) - t));
    vec2 r = vec2(
      fbm(p*1.5 + 2.0*q + vec2(1.7,9.2) + 0.5*t),
      fbm(p*1.5 + 2.0*q + vec2(8.3,2.8) - 0.5*t)
    );
    float f = fbm(p*1.5 + 2.0*r);

    vec3 ink  = vec3(0.020, 0.024, 0.039);
    vec3 teal = vec3(0.247, 0.851, 0.714);
    vec3 gold = vec3(0.831, 0.686, 0.216);

    vec3 col = ink;
    col = mix(col, teal, smoothstep(0.18, 0.72, f));
    col = mix(col, gold, smoothstep(0.55, 0.95, f) * 0.65);
    col += teal * 0.18 * smoothstep(0.40, 0.92, r.x);

    float d = length((uv - 0.5) * vec2(uRes.x/uRes.y, 1.0));
    float vig = smoothstep(1.15, 0.18, d);
    col *= mix(0.30, 1.0, vig);

    col = pow(col, vec3(0.92));
    gl_FragColor = vec4(col, 1.0);
  }
`;

function FluidBackground() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uRes: { value: new THREE.Vector2(1, 1) },
    }),
    []
  );

  useEffect(() => {
    uniforms.uRes.value.set(size.width, size.height);
  }, [size.width, size.height, uniforms]);

  useFrame((_, delta) => {
    if (matRef.current) {
      uniforms.uTime.value += delta;
      uniforms.uMouse.value.x += (pointer.x - uniforms.uMouse.value.x) * 0.04;
      uniforms.uMouse.value.y += (pointer.y - uniforms.uMouse.value.y) * 0.04;
    }
  });

  return (
    <mesh frustumCulled={false} renderOrder={-10}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={fluidVertex}
        fragmentShader={fluidFragment}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
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
            opacity={0.1}
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
      <FluidBackground />

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
