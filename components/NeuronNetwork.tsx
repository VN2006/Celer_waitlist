"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom, DepthOfField } from "@react-three/postprocessing";
import { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";

const NEURON_COUNT = 90;
const CONNECTIONS_PER_NEURON = 4;

interface NeuronProps {
  position: [number, number, number];
  index: number;
}

function Neuron({ position, index }: NeuronProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [intensity, setIntensity] = useState(0);

  useEffect(() => {
    const fireInterval = 1500 + Math.random() * 1500;
    const burstChance = 0.15;

    const intervalId = setInterval(() => {
      if (Math.random() < burstChance) {
        setTimeout(() => setIntensity(1), Math.random() * 200);
      } else {
        setIntensity(1);
      }
      setTimeout(() => setIntensity(0), 400 + Math.random() * 200);
    }, fireInterval);

    return () => clearInterval(intervalId);
  }, [index]);

  useFrame(() => {
    if (meshRef.current) {
      const currentIntensity = (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity || 0;
      const targetIntensity = intensity * 2;
      (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = THREE.MathUtils.lerp(
        currentIntensity,
        targetIntensity,
        0.1
      );
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial
        color="#7C3AED"
        emissive="#7C3AED"
        emissiveIntensity={0}
        roughness={0.3}
        metalness={0.8}
      />
    </mesh>
  );
}

function ConnectionLines({ neurons }: { neurons: [number, number, number][] }) {
  const lines = useMemo(() => {
    const connections: { start: [number, number, number]; end: [number, number, number] }[] = [];

    neurons.forEach((neuron, i) => {
      for (let j = 0; j < CONNECTIONS_PER_NEURON; j++) {
        const targetIndex = (i + 1 + Math.floor(Math.random() * 10)) % neurons.length;
        const target = neurons[targetIndex];

        const curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(...neuron),
          new THREE.Vector3(
            (neuron[0] + target[0]) / 2 + (Math.random() - 0.5) * 0.5,
            (neuron[1] + target[1]) / 2 + (Math.random() - 0.5) * 0.5,
            (neuron[2] + target[2]) / 2 + (Math.random() - 0.5) * 0.5
          ),
          new THREE.Vector3(...target)
        );

        connections.push({ start: neuron, end: target });
      }
    });

    return connections;
  }, [neurons]);

  return (
    <>
      {lines.map((line, i) => {
        const curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(...line.start),
          new THREE.Vector3(
            (line.start[0] + line.end[0]) / 2 + (Math.random() - 0.5) * 0.5,
            (line.start[1] + line.end[1]) / 2 + (Math.random() - 0.5) * 0.5,
            (line.start[2] + line.end[2]) / 2 + (Math.random() - 0.5) * 0.5
          ),
          new THREE.Vector3(...line.end)
        );
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        return (
          <primitive key={i} object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: "#A78BFA", transparent: true, opacity: 0.15 }))} />
        );
      })}
    </>
  );
}

function NetworkScene() {
  const groupRef = useRef<THREE.Group>(null);

  const neurons = useMemo(() => {
    const positions: [number, number, number][] = [];
    const radius = 5;

    for (let i = 0; i < NEURON_COUNT; i++) {
      const phi = Math.acos(-1 + (2 * i) / NEURON_COUNT);
      const theta = Math.sqrt(NEURON_COUNT * Math.PI) * phi;

      const x = radius * Math.cos(theta) * Math.sin(phi) * (0.8 + Math.random() * 0.4);
      const y = radius * Math.sin(theta) * Math.sin(phi) * (0.8 + Math.random() * 0.4);
      const z = radius * Math.cos(phi) * (0.8 + Math.random() * 0.4);

      positions.push([x, y, z]);
    }

    return positions;
  }, []);

  return (
    <group ref={groupRef}>
      <ConnectionLines neurons={neurons} />
      {neurons.map((position, i) => (
        <Neuron key={i} position={position} index={i} />
      ))}
    </group>
  );
}

export default function NeuronNetwork() {
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setUseFallback(true);
      return;
    }

    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.warn('WebGL not available, using fallback animation');
      setUseFallback(true);
    }

    const handler = (e: MediaQueryListEvent) => setUseFallback(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  if (useFallback) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="absolute inset-0 opacity-30">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 55 }} 
        shadows
        onCreated={({ gl }) => {
          console.log('WebGL context created successfully');
        }}
        onError={(error) => {
          console.error('Canvas error:', error);
          setUseFallback(true);
        }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 4]} intensity={1.5} />
        <NetworkScene />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          dampingFactor={0.1}
          enableDamping
        />
        <EffectComposer>
          <Bloom intensity={1.5} luminanceThreshold={0.2} luminanceSmoothing={0.3} />
          <DepthOfField focusDistance={0.01} focalLength={0.03} bokehScale={2} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
