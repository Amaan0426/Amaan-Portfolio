import { useEffect } from 'react';
import gsap from 'gsap';

/**
 * Hook to apply a premium 3D magnetic tilt effect to a card or interactive element.
 * Moves the element slightly toward the cursor (magnetic pull) and tilts it (3D tilt)
 * based on the cursor's offset from the center of the element.
 * Automatically deactivates on touch/non-hoverable devices.
 * 
 * @param {React.RefObject} elementRef - Ref to the DOM element to animate
 * @param {object} options - Customization parameters
 * @param {number} options.maxTilt - Maximum rotation in degrees (default: 4)
 * @param {number} options.maxMove - Maximum translation in pixels (default: 10)
 */
export default function useMagneticTilt(elementRef, { maxTilt = 4, maxMove = 10 } = {}) {
  useEffect(() => {
    const card = elementRef.current;
    if (!card) return;

    // Check if device supports hover (desktop mouse interaction)
    const isHoverable = window.matchMedia('(hover: hover)').matches;
    if (!isHoverable) return;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      
      // Calculate cursor position relative to card boundaries
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Convert to normalized offsets from the card center (-0.5 to 0.5)
      const px = (x / rect.width) - 0.5;
      const py = (y / rect.height) - 0.5;
      
      // Compute tilt degrees (tiltX is rotation around X-axis, tiltY is rotation around Y-axis)
      const tiltX = -py * maxTilt;
      const tiltY = px * maxTilt;
      
      // Compute magnetic pull translations
      const moveX = px * maxMove;
      const moveY = py * maxMove;

      gsap.to(card, {
        x: moveX,
        y: moveY,
        rotateX: tiltX,
        rotateY: tiltY,
        transformPerspective: 1000,
        ease: 'power2.out',
        duration: 0.3,
        overwrite: 'auto'
      });
    };

    const handleMouseLeave = () => {
      // Smoothly animate back to resting position
      gsap.to(card, {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        ease: 'power3.out',
        duration: 0.5,
        overwrite: 'auto'
      });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      // Clean up GSAP tweens and reset transforms
      gsap.killTweensOf(card);
      gsap.set(card, {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        clearProps: 'transformPerspective'
      });
    };
  }, [elementRef, maxTilt, maxMove]);
}
