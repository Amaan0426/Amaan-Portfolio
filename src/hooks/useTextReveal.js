import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger to make it available
gsap.registerPlugin(ScrollTrigger);

/**
 * Hook to apply a premium scroll-scrubbed left-to-right clip-path mask reveal to a heading.
 * This ties the heading reveal speed directly to the scroll progress as it enters the viewport.
 * 
 * @param {React.RefObject} elementRef - Ref to the heading element to animate
 */
export default function useTextReveal(elementRef) {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      // Animate clip-path inset from fully clipped (right-to-left) to fully visible.
      // Driven 1:1 by scroll progress.
      gsap.fromTo(element,
        {
          clipPath: 'inset(0% 100% 0% 0%)',
          WebkitClipPath: 'inset(0% 100% 0% 0%)',
        },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          WebkitClipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top 90%',
            end: '+=80',
            scrub: true,
          }
        }
      );
    }, element);

    return () => ctx.revert();
  }, [elementRef]);
}
