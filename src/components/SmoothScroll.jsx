import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * SmoothScroll component that integrates Lenis smooth scrolling into the app.
 * Automatically synchronizes with GSAP ScrollTrigger and GSAP's ticker loop.
 * Bypasses initialization on touch-only devices to ensure optimal native performance.
 */
export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Check if it's a touch-only device to preserve native scroll behavior
    const isTouchOnly = 'ontouchstart' in window && !window.matchMedia('(hover: hover)').matches;
    
    if (isTouchOnly) {
      return;
    }

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential out easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Tell ScrollTrigger to update when Lenis scrolls
    lenis.on('scroll', ScrollTrigger.update);

    // Sync Lenis updates with the GSAP ticker
    const tick = (time) => {
      // GSAP ticker gives time in seconds, Lenis expects milliseconds
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    
    // Disable lag smoothing to prevent animation jumps when frame rates drop
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
