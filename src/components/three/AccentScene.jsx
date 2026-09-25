import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * The atmosphere layer behind the hero: a slowly drifting point field that
 * gives the section measurable depth. Deliberately quiet — it must never
 * compete with the headline for attention.
 *
 * Lighting note: the material here is PointsMaterial, which is unlit in the
 * same way MeshBasicMaterial is. Adding AmbientLight/DirectionalLight would
 * cost a light pass every frame for zero visible change, so the scene
 * deliberately has no lights.
 *
 * This module is only ever reached through the lazy import in HeroAccent.jsx,
 * so `three` lands in its own chunk rather than the main bundle.
 */
const AccentScene = () => {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const { clientWidth: width, clientHeight: height } = host;
    if (width === 0 || height === 0) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.z = 14;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setSize(width, height, false);
    // Clamping DPR is the difference between smooth and a melted phone.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    host.appendChild(renderer.domElement);

    const COUNT = 900;
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 34;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xa78bfa,
      size: 0.055,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let raf = 0;
    const tick = () => {
      points.rotation.y += 0.00035;
      points.rotation.x = Math.sin(performance.now() * 0.00008) * 0.08;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Pause entirely when off-screen: a hidden canvas still burns GPU.
    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !raf) {
          raf = requestAnimationFrame(tick);
        } else if (!visible && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 },
    );
    io.observe(host);

    const onResize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener('resize', onResize);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 opacity-70"
    />
  );
};

export default AccentScene;
