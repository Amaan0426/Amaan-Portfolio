import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * Premium custom cursor component that renders a follow-dot and ring cursor.
 * Tracks global mouse position with gsap.quickTo and expands/displays custom label
 * when hovering over elements containing `data-cursor-text`.
 * Completely disabled on touch devices.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorText, setCursorText] = useState('');

  useEffect(() => {
    // Only display cursor on hover-capable desktop devices
    const isHoverable = window.matchMedia('(hover: hover)').matches;
    if (!isHoverable) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Set initial positions offscreen and transparent
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    // Use gsap.quickTo for fluid frame-rate updates
    const quickXDot = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3.out' });
    const quickYDot = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3.out' });
    
    const quickXRing = gsap.quickTo(ring, 'x', { duration: 0.25, ease: 'power3.out' });
    const quickYRing = gsap.quickTo(ring, 'y', { duration: 0.25, ease: 'power3.out' });

    const handleMouseMove = (e) => {
      quickXDot(e.clientX);
      quickYDot(e.clientY);
      quickXRing(e.clientX);
      quickYRing(e.clientY);

      if (!isVisible) {
        setIsVisible(true);
        gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
      }
    };

    const handleMouseLeaveWindow = () => {
      setIsVisible(false);
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    };

    // Event delegation to detect hovering over data-cursor-text items
    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-cursor-text]');
      if (target) {
        const text = target.getAttribute('data-cursor-text');
        setCursorText(text);
        
        // Expand ring and change to transparent yellow background with gold border
        gsap.to(ring, {
          width: 80,
          height: 80,
          backgroundColor: 'rgba(255, 199, 44, 0.15)',
          borderColor: '#FFC72C',
          duration: 0.3,
          ease: 'power2.out',
        });
        // Scale inner dot to 0
        gsap.to(dot, {
          scale: 0,
          duration: 0.2,
        });
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest('[data-cursor-text]');
      if (target) {
        setCursorText('');
        
        // Return ring to original size and color
        gsap.to(ring, {
          width: 32,
          height: 32,
          backgroundColor: 'transparent',
          borderColor: '#D4AF37',
          duration: 0.3,
          ease: 'power2.out',
        });
        // Scale inner dot back to normal
        gsap.to(dot, {
          scale: 1,
          duration: 0.2,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isVisible]);

  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-[9999] select-none">
      {/* Outer Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 flex items-center justify-center rounded-full border border-accent-gold pointer-events-none"
        style={{
          width: '32px',
          height: '32px',
          transform: 'translate3d(-50%, -50%, 0)',
        }}
      >
        {cursorText && (
          <span className="text-[10px] uppercase font-bold text-accent-yellow tracking-widest pointer-events-none select-none">
            {cursorText}
          </span>
        )}
      </div>

      {/* Inner Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 rounded-full bg-accent-yellow pointer-events-none"
        style={{
          width: '8px',
          height: '8px',
          transform: 'translate3d(-50%, -50%, 0)',
        }}
      />
    </div>
  );
}
