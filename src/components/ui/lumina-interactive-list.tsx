"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { cn } from "@/lib/utils";

// --- Exported Types ---

export interface LuminaSlide {
  id: string;
  media: string;
  label: string;
  title?: string;
  description?: string;
}

export interface LuminaInteractiveListProps {
  slides: LuminaSlide[];
  mode?: "full" | "minimal";
  config?: {
    effect?: "glass" | "frost" | "ripple" | "plasma" | "timeshift";
    transitionDuration?: number;
    autoSlideSpeed?: number;
  };
  className?: string;
}

// --- Shaders ---

const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform sampler2D uTexture1, uTexture2;
  uniform float uProgress;
  uniform vec2 uResolution, uTexture1Size, uTexture2Size;
  uniform int uEffectType;
  uniform float uGlobalIntensity, uSpeedMultiplier, uDistortionStrength, uColorEnhancement;
  uniform float uGlassRefractionStrength, uGlassChromaticAberration, uGlassBubbleClarity, uGlassEdgeGlow, uGlassLiquidFlow;
  uniform float uFrostIntensity, uFrostCrystalSize, uFrostIceCoverage, uFrostTemperature, uFrostTexture;
  uniform float uRippleFrequency, uRippleAmplitude, uRippleWaveSpeed, uRippleRippleCount, uRippleDecay;
  uniform float uPlasmaIntensity, uPlasmaSpeed, uPlasmaEnergyIntensity, uPlasmaContrastBoost, uPlasmaTurbulence;
  uniform float uTimeshiftDistortion, uTimeshiftBlur, uTimeshiftFlow, uTimeshiftChromatic, uTimeshiftTurbulence;
  varying vec2 vUv;

  vec2 getCoverUV(vec2 uv, vec2 textureSize) {
    vec2 s = uResolution / textureSize;
    float scale = max(s.x, s.y);
    vec2 scaledSize = textureSize * scale;
    vec2 offset = (uResolution - scaledSize) * 0.5;
    return (uv * uResolution - offset) / scaledSize;
  }
  float noise(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  vec4 glassEffect(vec2 uv, float progress) {
    float time = progress * 5.0 * uSpeedMultiplier;
    vec2 uv1 = getCoverUV(uv, uTexture1Size); vec2 uv2 = getCoverUV(uv, uTexture2Size);
    float maxR = length(uResolution) * 0.85; float br = progress * maxR;
    vec2 p = uv * uResolution; vec2 c = uResolution * 0.5;
    float d = length(p - c); float nd = d / max(br, 0.001);
    float param = smoothstep(br + 3.0, br - 3.0, d);
    vec4 img;
    if (param > 0.0) {
      float ro = 0.08 * uGlassRefractionStrength * uDistortionStrength * uGlobalIntensity * pow(smoothstep(0.3 * uGlassBubbleClarity, 1.0, nd), 1.5);
      vec2 dir = (d > 0.0) ? (p - c) / d : vec2(0.0);
      vec2 distUV = uv2 - dir * ro;
      distUV += vec2(sin(time + nd * 10.0), cos(time * 0.8 + nd * 8.0)) * 0.015 * uGlassLiquidFlow * uSpeedMultiplier * nd * param;
      float ca = 0.02 * uGlassChromaticAberration * uGlobalIntensity * pow(smoothstep(0.3, 1.0, nd), 1.2);
      img = vec4(texture2D(uTexture2, distUV + dir * ca * 1.2).r, texture2D(uTexture2, distUV + dir * ca * 0.2).g, texture2D(uTexture2, distUV - dir * ca * 0.8).b, 1.0);
      if (uGlassEdgeGlow > 0.0) {
        float rim = smoothstep(0.95, 1.0, nd) * (1.0 - smoothstep(1.0, 1.01, nd));
        img.rgb += rim * 0.08 * uGlassEdgeGlow * uGlobalIntensity;
      }
    } else { img = texture2D(uTexture2, uv2); }
    vec4 oldImg = texture2D(uTexture1, uv1);
    if (progress > 0.95) img = mix(img, texture2D(uTexture2, uv2), (progress - 0.95) / 0.05);
    return mix(oldImg, img, param);
  }
  vec4 frostEffect(vec2 uv, float progress) { return mix(texture2D(uTexture1, getCoverUV(uv, uTexture1Size)), texture2D(uTexture2, getCoverUV(uv, uTexture2Size)), progress); }
  vec4 rippleEffect(vec2 uv, float progress) { return mix(texture2D(uTexture1, getCoverUV(uv, uTexture1Size)), texture2D(uTexture2, getCoverUV(uv, uTexture2Size)), progress); }
  vec4 plasmaEffect(vec2 uv, float progress) { return mix(texture2D(uTexture1, getCoverUV(uv, uTexture1Size)), texture2D(uTexture2, getCoverUV(uv, uTexture2Size)), progress); }
  vec4 timeshiftEffect(vec2 uv, float progress) { return mix(texture2D(uTexture1, getCoverUV(uv, uTexture1Size)), texture2D(uTexture2, getCoverUV(uv, uTexture2Size)), progress); }

  void main() {
    if (uEffectType == 0) gl_FragColor = glassEffect(vUv, uProgress);
    else if (uEffectType == 1) gl_FragColor = frostEffect(vUv, uProgress);
    else if (uEffectType == 2) gl_FragColor = rippleEffect(vUv, uProgress);
    else if (uEffectType == 3) gl_FragColor = plasmaEffect(vUv, uProgress);
    else gl_FragColor = timeshiftEffect(vUv, uProgress);
  }
`;

// --- Constants ---

const EFFECT_INDEX: Record<string, number> = {
  glass: 0,
  frost: 1,
  ripple: 2,
  plasma: 3,
  timeshift: 4,
};

const PROGRESS_UPDATE_INTERVAL = 50;
const SWIPE_THRESHOLD = 50;

function checkWebGLSupport(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

// --- Component ---

export function LuminaInteractiveList({
  slides,
  mode = "full",
  config,
  className,
}: LuminaInteractiveListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Refs for WebGL objects
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const texturesRef = useRef<THREE.Texture[]>([]);

  // Refs for imperative state
  const currentIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const sliderEnabledRef = useRef(false);
  const texturesLoadedRef = useRef(false);
  const isInViewRef = useRef(false);
  const rafIdRef = useRef(0);
  const autoSlideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressAnimationRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartRef = useRef({ x: 0, y: 0 });

  // Refs for progress bar elements
  const progressRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navRef = useRef<HTMLElement>(null);

  // Refs for full-mode text elements
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const slideNumberRef = useRef<HTMLSpanElement>(null);
  const slideTotalRef = useRef<HTMLSpanElement>(null);

  // Bridge ref: exposes navigateToSlide to the click handler
  const navigateToSlideRef = useRef<(index: number) => void>(() => { });

  // Resolved config values
  const transitionDuration = config?.transitionDuration ?? 2.5;
  const autoSlideSpeed = config?.autoSlideSpeed ?? 5000;
  const effect = config?.effect ?? "glass";

  // --- Main effect: WebGL setup, textures, render loop, events ---
  useEffect(() => {
    if (!canvasRef.current || slides.length < 2) return;
    if (!checkWebGLSupport()) {
      console.warn("WebGL not supported — Lumina gallery requires WebGL");
      return;
    }

    // --- Shader settings ---
    const settings: Record<string, number | string> = {
      transitionDuration,
      autoSlideSpeed,
      currentEffect: effect,
      globalIntensity: 1.0,
      speedMultiplier: 1.0,
      distortionStrength: 1.0,
      colorEnhancement: 1.0,
      glassRefractionStrength: 1.0,
      glassChromaticAberration: 1.0,
      glassBubbleClarity: 1.0,
      glassEdgeGlow: 1.0,
      glassLiquidFlow: 1.0,
      frostIntensity: 1.5,
      frostCrystalSize: 1.0,
      frostIceCoverage: 1.0,
      frostTemperature: 1.0,
      frostTexture: 1.0,
      rippleFrequency: 25.0,
      rippleAmplitude: 0.08,
      rippleWaveSpeed: 1.0,
      rippleRippleCount: 1.0,
      rippleDecay: 1.0,
      plasmaIntensity: 1.2,
      plasmaSpeed: 0.8,
      plasmaEnergyIntensity: 0.4,
      plasmaContrastBoost: 0.3,
      plasmaTurbulence: 1.0,
      timeshiftDistortion: 1.6,
      timeshiftBlur: 1.5,
      timeshiftFlow: 1.4,
      timeshiftChromatic: 1.5,
      timeshiftTurbulence: 1.4,
    };

    const updateShaderUniforms = () => {
      const mat = materialRef.current;
      if (!mat) return;
      const u = mat.uniforms;
      for (const key in settings) {
        const uName = "u" + key.charAt(0).toUpperCase() + key.slice(1);
        if (u[uName]) u[uName].value = settings[key];
      }
      u.uEffectType.value = EFFECT_INDEX[settings.currentEffect as string] ?? 0;
    };

    // --- Text helpers (full mode only) ---
    const splitText = (text: string): string =>
      text
        .split("")
        .map(
          (char) =>
            `<span style="display:inline-block;opacity:0">${char === " " ? "&nbsp;" : char}</span>`
        )
        .join("");

    const updateContent = (idx: number) => {
      if (mode === "minimal") return;
      const titleEl = titleRef.current;
      const descEl = descRef.current;
      if (!titleEl || !descEl) return;
      const slide = slides[idx];

      gsap.to(titleEl.children, {
        y: -20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.02,
        ease: "power2.in",
      });
      gsap.to(descEl, { y: -10, opacity: 0, duration: 0.4, ease: "power2.in" });

      setTimeout(() => {
        titleEl.innerHTML = splitText(slide.title ?? slide.label);
        descEl.textContent = slide.description ?? "";
        gsap.set(titleEl.children, { opacity: 0 });
        gsap.set(descEl, { y: 20, opacity: 0 });

        const children = titleEl.children;
        switch (idx % 6) {
          case 0:
            gsap.set(children, { y: 20 });
            gsap.to(children, { y: 0, opacity: 1, duration: 0.8, stagger: 0.03, ease: "power3.out" });
            gsap.to(descEl, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" });
            break;
          case 1:
            gsap.set(children, { y: -20 });
            gsap.to(children, { y: 0, opacity: 1, duration: 0.8, stagger: 0.03, ease: "back.out(1.7)" });
            gsap.to(descEl, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" });
            break;
          case 2:
            gsap.set(children, { filter: "blur(10px)", scale: 1.5, y: 0 });
            gsap.to(children, { filter: "blur(0px)", scale: 1, opacity: 1, duration: 1, stagger: { amount: 0.5, from: "random" }, ease: "power2.out" });
            gsap.to(descEl, { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: "power2.out" });
            break;
          case 3:
            gsap.set(children, { scale: 0, y: 0 });
            gsap.to(children, { scale: 1, opacity: 1, duration: 0.6, stagger: 0.05, ease: "back.out(1.5)" });
            gsap.to(descEl, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" });
            break;
          case 4:
            gsap.set(children, { rotationX: 90, y: 0, transformOrigin: "50% 50%" });
            gsap.to(children, { rotationX: 0, opacity: 1, duration: 0.8, stagger: 0.04, ease: "power2.out" });
            gsap.to(descEl, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power2.out" });
            break;
          case 5:
            gsap.set(children, { x: 30, y: 0 });
            gsap.to(children, { x: 0, opacity: 1, duration: 0.8, stagger: 0.03, ease: "power3.out" });
            gsap.to(descEl, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" });
            break;
        }
      }, 500);
    };

    const updateCounter = (idx: number) => {
      if (mode === "minimal") return;
      if (slideNumberRef.current)
        slideNumberRef.current.textContent = String(idx + 1).padStart(2, "0");
      if (slideTotalRef.current)
        slideTotalRef.current.textContent = String(slides.length).padStart(2, "0");
    };

    // --- Progress bar helpers ---
    const updateSlideProgress = (idx: number, prog: number) => {
      const el = progressRefs.current[idx];
      if (el) {
        el.style.width = `${prog}%`;
        el.style.opacity = "1";
      }
    };

    const fadeSlideProgress = (idx: number) => {
      const el = progressRefs.current[idx];
      if (el) {
        el.style.opacity = "0";
        setTimeout(() => {
          el.style.width = "0%";
        }, 300);
      }
    };

    const quickResetProgress = (idx: number) => {
      const el = progressRefs.current[idx];
      if (el) {
        el.style.transition = "width 0.2s ease-out";
        el.style.width = "0%";
        setTimeout(() => {
          el.style.transition = "";
        }, 200);
      }
    };

    // --- Timer ---
    const stopAutoSlideTimer = () => {
      if (progressAnimationRef.current) clearInterval(progressAnimationRef.current);
      if (autoSlideTimerRef.current) clearTimeout(autoSlideTimerRef.current);
      progressAnimationRef.current = null;
      autoSlideTimerRef.current = null;
    };

    const handleSlideChange = () => {
      if (
        isTransitioningRef.current ||
        !texturesLoadedRef.current ||
        !sliderEnabledRef.current
      )
        return;
      navigateToSlide((currentIndexRef.current + 1) % slides.length);
    };

    const startAutoSlideTimer = () => {
      if (
        !texturesLoadedRef.current ||
        !sliderEnabledRef.current ||
        !isInViewRef.current
      )
        return;
      stopAutoSlideTimer();
      let progress = 0;
      const increment = (100 / autoSlideSpeed) * PROGRESS_UPDATE_INTERVAL;
      progressAnimationRef.current = setInterval(() => {
        if (!sliderEnabledRef.current || !isInViewRef.current) {
          stopAutoSlideTimer();
          return;
        }
        progress += increment;
        updateSlideProgress(currentIndexRef.current, progress);
        if (progress >= 100) {
          if (progressAnimationRef.current)
            clearInterval(progressAnimationRef.current);
          progressAnimationRef.current = null;
          fadeSlideProgress(currentIndexRef.current);
          if (!isTransitioningRef.current) handleSlideChange();
        }
      }, PROGRESS_UPDATE_INTERVAL);
    };

    const safeStartTimer = (delay = 0) => {
      stopAutoSlideTimer();
      if (
        sliderEnabledRef.current &&
        texturesLoadedRef.current &&
        isInViewRef.current
      ) {
        if (delay > 0)
          autoSlideTimerRef.current = setTimeout(startAutoSlideTimer, delay);
        else startAutoSlideTimer();
      }
    };

    // --- Navigation ---
    const navigateToSlide = (targetIndex: number) => {
      if (isTransitioningRef.current || targetIndex === currentIndexRef.current)
        return;
      const mat = materialRef.current;
      if (!mat) return;

      stopAutoSlideTimer();
      quickResetProgress(currentIndexRef.current);

      const currentTexture = texturesRef.current[currentIndexRef.current];
      const targetTexture = texturesRef.current[targetIndex];
      if (!currentTexture || !targetTexture) return;

      isTransitioningRef.current = true;
      mat.uniforms.uTexture1.value = currentTexture;
      mat.uniforms.uTexture2.value = targetTexture;
      mat.uniforms.uTexture1Size.value = currentTexture.userData.size;
      mat.uniforms.uTexture2Size.value = targetTexture.userData.size;

      updateContent(targetIndex);
      currentIndexRef.current = targetIndex;
      setActiveIndex(targetIndex);
      updateCounter(targetIndex);

      gsap.fromTo(
        mat.uniforms.uProgress,
        { value: 0 },
        {
          value: 1,
          duration: transitionDuration,
          ease: "power2.inOut",
          onComplete: () => {
            mat.uniforms.uProgress.value = 0;
            mat.uniforms.uTexture1.value = targetTexture;
            mat.uniforms.uTexture1Size.value = targetTexture.userData.size;
            isTransitioningRef.current = false;
            safeStartTimer(100);
          },
        }
      );
    };

    // Expose to click handler via ref
    navigateToSlideRef.current = navigateToSlide;

    // --- Texture loading ---
    const loadImageTexture = (src: string): Promise<THREE.Texture> =>
      new Promise((resolve, reject) => {
        const loader = new THREE.TextureLoader();
        loader.load(
          src,
          (texture) => {
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.userData = {
              size: new THREE.Vector2(
                texture.image.width,
                texture.image.height
              ),
            };
            resolve(texture);
          },
          undefined,
          reject
        );
      });

    // --- WebGL initialization ---
    const initRenderer = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        alpha: false,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      sceneRef.current = scene;
      cameraRef.current = camera;
      rendererRef.current = renderer;

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTexture1: { value: null },
          uTexture2: { value: null },
          uProgress: { value: 0 },
          uResolution: {
            value: new THREE.Vector2(window.innerWidth, window.innerHeight),
          },
          uTexture1Size: { value: new THREE.Vector2(1, 1) },
          uTexture2Size: { value: new THREE.Vector2(1, 1) },
          uEffectType: { value: 0 },
          uGlobalIntensity: { value: 1.0 },
          uSpeedMultiplier: { value: 1.0 },
          uDistortionStrength: { value: 1.0 },
          uColorEnhancement: { value: 1.0 },
          uGlassRefractionStrength: { value: 1.0 },
          uGlassChromaticAberration: { value: 1.0 },
          uGlassBubbleClarity: { value: 1.0 },
          uGlassEdgeGlow: { value: 1.0 },
          uGlassLiquidFlow: { value: 1.0 },
          uFrostIntensity: { value: 1.0 },
          uFrostCrystalSize: { value: 1.0 },
          uFrostIceCoverage: { value: 1.0 },
          uFrostTemperature: { value: 1.0 },
          uFrostTexture: { value: 1.0 },
          uRippleFrequency: { value: 25.0 },
          uRippleAmplitude: { value: 0.08 },
          uRippleWaveSpeed: { value: 1.0 },
          uRippleRippleCount: { value: 1.0 },
          uRippleDecay: { value: 1.0 },
          uPlasmaIntensity: { value: 1.2 },
          uPlasmaSpeed: { value: 0.8 },
          uPlasmaEnergyIntensity: { value: 0.4 },
          uPlasmaContrastBoost: { value: 0.3 },
          uPlasmaTurbulence: { value: 1.0 },
          uTimeshiftDistortion: { value: 1.6 },
          uTimeshiftBlur: { value: 1.5 },
          uTimeshiftFlow: { value: 1.4 },
          uTimeshiftChromatic: { value: 1.5 },
          uTimeshiftTurbulence: { value: 1.4 },
        },
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
      });
      materialRef.current = material;
      scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

      // Load all textures
      for (const slide of slides) {
        try {
          texturesRef.current.push(await loadImageTexture(slide.media));
        } catch {
          console.warn(`Failed to load texture: ${slide.media}`);
        }
      }

      if (texturesRef.current.length >= 2) {
        material.uniforms.uTexture1.value = texturesRef.current[0];
        material.uniforms.uTexture2.value = texturesRef.current[1];
        material.uniforms.uTexture1Size.value =
          texturesRef.current[0].userData.size;
        material.uniforms.uTexture2Size.value =
          texturesRef.current[1].userData.size;
        texturesLoadedRef.current = true;
        sliderEnabledRef.current = true;
        updateShaderUniforms();
        setIsLoaded(true);
        if (isInViewRef.current) safeStartTimer(500);
      }

      // Render loop — only renders when in view
      const render = () => {
        rafIdRef.current = requestAnimationFrame(render);
        if (
          isInViewRef.current &&
          rendererRef.current &&
          sceneRef.current &&
          cameraRef.current
        ) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      };
      render();
    };

    // --- Initialize text content (full mode) ---
    if (mode === "full") {
      updateCounter(0);
      const titleEl = titleRef.current;
      const descEl = descRef.current;
      if (titleEl && descEl && slides[0]) {
        titleEl.innerHTML = splitText(slides[0].title ?? slides[0].label);
        descEl.textContent = slides[0].description ?? "";
        gsap.fromTo(
          titleEl.children,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.03,
            ease: "power3.out",
            delay: 0.5,
          }
        );
        gsap.fromTo(
          descEl,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.8 }
        );
      }
    }

    initRenderer();

    // --- Event listeners ---
    const handleVisibility = () => {
      if (document.hidden) stopAutoSlideTimer();
      else if (!isTransitioningRef.current) safeStartTimer();
    };

    const handleResize = () => {
      if (rendererRef.current && materialRef.current) {
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        materialRef.current.uniforms.uResolution.value.set(
          window.innerWidth,
          window.innerHeight
        );
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("resize", handleResize);

    // --- Touch/swipe ---
    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
      const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
      if (
        Math.abs(deltaX) > Math.abs(deltaY) &&
        Math.abs(deltaX) > SWIPE_THRESHOLD
      ) {
        if (deltaX < 0) {
          navigateToSlide(
            (currentIndexRef.current + 1) % slides.length
          );
        } else {
          navigateToSlide(
            (currentIndexRef.current - 1 + slides.length) % slides.length
          );
        }
      }
    };

    const canvas = canvasRef.current;
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: true });

    // --- IntersectionObserver ---
    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasInView = isInViewRef.current;
        isInViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !wasInView) {
          if (sliderEnabledRef.current && !isTransitioningRef.current)
            safeStartTimer();
        } else if (!entry.isIntersecting && wasInView) {
          stopAutoSlideTimer();
        }
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    // --- Cleanup ---
    return () => {
      stopAutoSlideTimer();
      cancelAnimationFrame(rafIdRef.current);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.forceContextLoss();
        rendererRef.current = null;
      }
      texturesRef.current.forEach((t) => t.dispose());
      texturesRef.current = [];
      if (materialRef.current) {
        materialRef.current.dispose();
        materialRef.current = null;
      }
      sceneRef.current = null;
      cameraRef.current = null;
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
      observer.disconnect();
      sliderEnabledRef.current = false;
      texturesLoadedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Nav click handler ---
  const handleNavClick = (index: number) => {
    navigateToSlideRef.current(index);
  };

  // --- Listen for external navigation via custom event ---
  useEffect(() => {
    const handler = (e: Event) => {
      const index = (e as CustomEvent).detail?.index;
      if (typeof index === "number") navigateToSlideRef.current(index);
    };
    window.addEventListener("lumina-navigate", handler);
    return () => window.removeEventListener("lumina-navigate", handler);
  }, []);

  // --- Auto-scroll active nav item into view on mobile ---
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const navEl = navRef.current;
    if (!navEl) return;
    const activeItem = navEl.children[activeIndex] as HTMLElement | undefined;
    activeItem?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeIndex]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-screen h-dvh overflow-hidden bg-black transition-opacity duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
        isLoaded ? "opacity-100" : "opacity-0 pointer-events-none",
        className
      )}
    >
      <canvas ref={canvasRef} className="block w-full h-full bg-black" />

      {/* Full mode: slide indicators + text overlay */}
      {mode === "full" && (
        <>
          <span
            ref={slideNumberRef}
            className="absolute top-1/2 left-6 md:left-12 -translate-y-1/2 font-display text-2xl font-medium text-white z-[3] tracking-[4px] uppercase [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]"
          >
            01
          </span>
          <span
            ref={slideTotalRef}
            className="absolute top-1/2 right-6 md:right-12 -translate-y-1/2 font-display text-2xl font-medium text-white z-[3] tracking-[4px] uppercase [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]"
          >
            {String(slides.length).padStart(2, "0")}
          </span>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-[4] w-4/5 max-w-[800px] pointer-events-none">
            <h1
              ref={titleRef}
              className="font-display text-[clamp(3rem,8vw,6rem)] font-medium text-white mb-4 -tracking-[0.02em] leading-none [text-shadow:0_4px_20px_rgba(0,0,0,0.3)] [perspective:1000px] [&>span]:inline-block"
            />
            <p
              ref={descRef}
              className="font-sans text-[clamp(1rem,1.5vw,1.25rem)] text-white/70 max-w-[600px] mx-auto leading-relaxed [text-shadow:0_2px_10px_rgba(0,0,0,0.3)]"
            />
          </div>
        </>
      )}

      {/* Bottom navigation */}
      <nav
        ref={navRef}
        className="absolute bottom-4 left-4 right-4 md:bottom-12 md:left-12 md:right-12 flex overflow-x-auto md:overflow-visible z-[3] pointer-events-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            onClick={() => handleNavClick(i)}
            className="flex flex-col cursor-pointer px-3 py-4 md:px-6 flex-shrink-0 md:flex-1 min-w-[100px] md:min-w-0 transition-transform duration-300 ease-out hover:-translate-y-0.5"
          >
            <div
              className={cn(
                "w-full h-px mb-3 overflow-hidden",
                activeIndex === i ? "bg-white/25" : "bg-white/15"
              )}
            >
              <div
                ref={(el) => {
                  progressRefs.current[i] = el;
                }}
                className="h-full w-0 bg-gradient-to-r from-bodega-yellow to-white [transition:width_0.1s_ease,opacity_0.3s_ease]"
              />
            </div>
            <span
              className={cn(
                "font-display text-[11px] md:text-xs uppercase font-normal transition-all duration-[400ms] ease-out",
                activeIndex === i
                  ? "text-white tracking-[3px]"
                  : "text-white/50 tracking-[2px]"
              )}
            >
              {slide.label}
            </span>
          </div>
        ))}
      </nav>
    </div>
  );
}
