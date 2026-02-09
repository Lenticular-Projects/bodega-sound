"use client";

import { useRef, useMemo, useState, useCallback, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, Html } from "@react-three/drei";
import * as THREE from "three";

// Types per Agent 4 protocol: data-driven props
export interface VinylItem {
  id: string;
  url: string;
  title: string;
  artist?: string;
  coverUrl?: string;
}

interface VinylGlobeProps {
  items: VinylItem[];
  className?: string;
  onItemClick?: (item: VinylItem) => void;
}

// Individual Vinyl Disc Component
function VinylDisc({
  item,
  position,
  onHover,
  onClick,
  isHovered,
}: {
  item: VinylItem;
  position: [number, number, number];
  onHover: (id: string | null) => void;
  onClick: () => void;
  isHovered: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [textureLoaded, setTextureLoaded] = useState(false);

  // Only load texture if coverUrl is provided
  const hasCoverUrl = !!item.coverUrl;
  const texture = hasCoverUrl
    ? useTexture(item.coverUrl!, (tex) => {
        setTextureLoaded(true);
        if (tex instanceof THREE.Texture) {
          tex.colorSpace = THREE.SRGBColorSpace;
        }
      })
    : null;

  // Vinyl disc geometry - thin cylinder
  const geometry = useMemo(
    () => new THREE.CylinderGeometry(0.5, 0.5, 0.02, 32),
    [],
  );

  // Material with or without texture
  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      map: textureLoaded && texture ? texture : null,
      color: textureLoaded && texture ? 0xffffff : 0x1a1a1a,
      metalness: 0.3,
      roughness: 0.4,
    });
    return mat;
  }, [texture, textureLoaded]);

  // Hover animation
  useFrame((state) => {
    if (meshRef.current) {
      const targetScale = isHovered ? 1.15 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1,
      );

      // Subtle floating animation
      if (isHovered) {
        meshRef.current.position.y =
          position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      }
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
          onHover(item.id);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "auto";
          onHover(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        rotation={[Math.PI / 2, 0, 0]}
      >
        {/* Vinyl grooves - concentric rings */}
        <mesh position={[0, 0.015, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.15, 0.48, 32]} />
          <meshStandardMaterial
            color={0x0a0a0a}
            metalness={0.1}
            roughness={0.9}
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* Center label */}
        <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.15, 32]} />
          <meshStandardMaterial
            color={0xe5ff00}
            metalness={0}
            roughness={0.8}
          />
        </mesh>

        {/* Center hole */}
        <mesh position={[0, 0.025, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.02, 16]} />
          <meshStandardMaterial color={0x000000} />
        </mesh>
      </mesh>

      {/* Tooltip on hover */}
      {isHovered && (
        <Html distanceFactor={10}>
          <div className="bg-black/90 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2">
            <p className="font-bold">{item.title}</p>
            {item.artist && <p className="text-xs opacity-70">{item.artist}</p>}
          </div>
        </Html>
      )}
    </group>
  );
}

// Globe container with physics
function Globe({
  items,
  onItemClick,
}: {
  items: VinylItem[];
  onItemClick?: (item: VinylItem) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Physics state - high inertia per risk mitigation
  const velocity = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Distribute items in spherical pattern
  const positions = useMemo(() => {
    const pos: [number, number, number][] = [];
    const count = items.length;
    const radius = 2.5;

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      pos.push([x, y, z]);
    }

    return pos;
  }, [items]);

  // High inertia physics - feels heavy like physical object
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Apply velocity with damping (high inertia = slow decay)
      const damping = 0.985; // Slow decay = heavy feel
      velocity.current.x *= damping;
      velocity.current.y *= damping;

      // Apply rotation
      groupRef.current.rotation.y += velocity.current.x * delta;
      groupRef.current.rotation.x += velocity.current.y * delta;

      // Auto-rotation when idle (very slow, subtle)
      if (Math.abs(velocity.current.x) < 0.001 && !isDragging.current) {
        groupRef.current.rotation.y += delta * 0.05;
      }
    }
  });

  // Mouse handlers for inertia-based interaction
  const handlePointerDown = useCallback((e: any) => {
    isDragging.current = true;
    lastMouse.current = { x: e.pointer.x, y: e.pointer.y };
    e.target.setPointerCapture(e.pointerId);
    document.body.style.cursor = "grabbing";
  }, []);

  const handlePointerMove = useCallback((e: any) => {
    if (isDragging.current && groupRef.current) {
      const deltaX = e.pointer.x - lastMouse.current.x;
      const deltaY = e.pointer.y - lastMouse.current.y;

      // High sensitivity input but heavy mass feel
      velocity.current.x = deltaX * 2;
      velocity.current.y = deltaY * 2;

      lastMouse.current = { x: e.pointer.x, y: e.pointer.y };
    }
  }, []);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = "auto";
  }, []);

  return (
    <group
      ref={groupRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {items.map((item, index) => (
        <VinylDisc
          key={item.id}
          item={item}
          position={positions[index]}
          onHover={setHoveredId}
          onClick={() => onItemClick?.(item)}
          isHovered={hoveredId === item.id}
        />
      ))}
    </group>
  );
}

// Main component - redesigned as a contained section
export function VinylGlobe({ items, className, onItemClick }: VinylGlobeProps) {
  return (
    <div
      className={`relative w-full h-[600px] lg:h-[800px] ${className || ""}`}
      aria-label="Interactive 3D vinyl archive globe"
      role="application"
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]} // Performance optimization
        style={{ background: "transparent" }}
      >
        {/* Ambient lighting for vinyl sheen */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#e5ff00" />

        <Suspense fallback={null}>
          <Globe items={items} onItemClick={onItemClick} />
        </Suspense>
      </Canvas>
    </div>
  );
}
