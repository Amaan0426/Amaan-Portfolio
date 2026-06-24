import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS_DATA = [
  { targetValue: 10, suffix: '+', label: 'Months Experience' },
  { targetValue: 5, suffix: '+', label: 'Projects Built' },
  { targetValue: 3, suffix: '', label: 'LLM APIs Integrated' },
  { targetValue: 2, suffix: '', label: 'Production Systems' },
];

export default function StatsStrip() {
  const stripRef = useRef(null);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    const targets = strip.querySelectorAll('.stat-count');
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: strip,
        start: 'top 85%',
        onEnter: () => {
          targets.forEach((el) => {
            const targetVal = parseFloat(el.getAttribute('data-target'));
            const counterObj = { val: 0 };
            gsap.to(counterObj, {
              val: targetVal,
              duration: 1.8,
              ease: 'power2.out',
              onUpdate: () => {
                el.innerText = Math.floor(counterObj.val);
              }
            });
          });
        },
        once: true
      });
    }, strip);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={stripRef}
      className="w-full bg-[#0d1b2a] border-t border-b border-[#D4AF37]/45 py-8 md:py-12 relative z-20"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-2 gap-y-8 gap-x-4 md:grid-cols-4 text-center">
        {STATS_DATA.map((stat, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="font-heading text-4xl md:text-5xl font-bold text-[#FFC72C] flex items-center justify-center">
              <span className="stat-count" data-target={stat.targetValue}>0</span>
              <span>{stat.suffix}</span>
            </div>
            <div className="mt-2 text-xs md:text-sm text-text-muted font-body uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
