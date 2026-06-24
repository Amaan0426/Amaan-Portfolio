import { useEffect, useRef, useState } from 'react';
import Section from '../components/Section';
import { Ship, GraduationCap, Briefcase } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useTextReveal from '../hooks/useTextReveal';

gsap.registerPlugin(ScrollTrigger);

const EXPERIENCES = [
  {
    role: 'Associate AI/ML Engineer',
    company: 'Oliware.ai',
    period: 'Sept 2025 – Present',
    isCurrent: true,
    bullets: [
      'Built AI-powered applications with multiple LLM API integrations (Gemini, Grok, DeepSeek, Ollama).',
      'Developed full-stack solutions using React, Spring Boot, Django, and MySQL.',
      'Created NLP-based systems for database management and social media analytics.',
    ],
  },
  {
    role: 'Java Developer Intern',
    company: 'iTpreneur Edutech',
    period: 'June 2024 – March 2025',
    isCurrent: false,
    bullets: [
      'Worked on core Java concepts including OOPs, JDBC, and basic backend development.',
      'Developed and tested Java-based applications as part of real-world projects.',
      'Gained hands-on experience in database connectivity and application logic implementation.',
    ],
  },
];

const EDUCATION = [
  {
    degree: 'Bachelor of Computer Engineering',
    school: 'S. B. Patil College of Engineering, Indapur',
    university: 'Savitribai Phule Pune University',
    year: '2024',
    score: 'CGPA: 6.78',
  },
  {
    degree: 'HSC',
    school: 'Shri Shivaji Vidyalaya, Bawada',
    university: null,
    year: '2020',
    score: '70.31%',
  },
  {
    degree: 'SSC',
    school: 'Shri Shivaji Vidyalaya, Bawada',
    university: null,
    year: '2018',
    score: '70.60%',
  },
];

export default function Experience() {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const shipRef = useRef(null);
  const mobileShipRef = useRef(null);
  const headingRef = useRef(null);

  useTextReveal(headingRef);

  // Detect mobile view to disable ThreeJS or ScrollTrigger paths
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // SVG path is hidden below lg break (1024px)
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ── GSAP ScrollTrigger Ship along Path ──────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let tl;

    if (!isMobile) {
      // ── Desktop Animation ──
      const path = pathRef.current;
      const ship = shipRef.current;
      if (!path || !ship) return;

      const totalLength = path.getTotalLength();

      // Position ship at start
      const startPt = path.getPointAtLength(0);
      ship.style.left = `${(startPt.x / 128) * 100}%`;
      ship.style.top = `${(startPt.y / 600) * 100}%`;
      ship.style.transform = 'translate(-50%, -50%) rotate(-90deg)'; // points straight down at Y=0

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 55%',
          end: 'bottom 45%',
          scrub: 0.5,
          onUpdate: (self) => {
            const progress = self.progress;
            const currentLength = progress * totalLength;

            // Compute tangent from two nearby points on the path
            const epsilon = 1;
            const p1Length = Math.max(0, currentLength - epsilon);
            const p2Length = Math.min(totalLength, currentLength + epsilon);

            const p1 = path.getPointAtLength(p1Length);
            const p2 = path.getPointAtLength(p2Length);

            // Get scaling factors based on container dimensions
            const rect = path.getBoundingClientRect();
            const scaleX = rect.width / 128;
            const scaleY = rect.height / 1000;

            const dx = (p2.x - p1.x) * scaleX;
            const dy = (p2.y - p1.y) * scaleY;

            // Convert heading vector to degrees
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);

            // Apply style updates
            ship.style.left = `${(p2.x / 128) * 100}%`;
            ship.style.top = `${(p2.y / 600) * 100}%`;
            // Rotate offset: -180 deg turns the left-facing default bow to the direction of travel
            ship.style.transform = `translate(-50%, -50%) rotate(${angle - 180}deg)`;
          },
        },
      });
    } else {
      // ── Mobile Animation ──
      const mobileShip = mobileShipRef.current;
      if (!mobileShip) return;

      // Position ship at start
      mobileShip.style.top = '0%';

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 55%',
          end: 'bottom 45%',
          scrub: 0.5,
          onUpdate: (self) => {
            const progress = self.progress;
            mobileShip.style.top = `${progress * 100}%`;
            mobileShip.style.transform = 'translate(-50%, -50%) rotate(-90deg)';
          },
        },
      });
    }

    return () => {
      if (tl && tl.scrollTrigger) tl.scrollTrigger.kill();
      if (tl) tl.kill();
    };
  }, [isMobile]);

  return (
    <Section id="experience">
      {/* ── Section heading ─────────────────────────────── */}
      <div className="mb-16 flex flex-col items-center text-center">
        <p className="mb-2 text-sm font-medium tracking-widest uppercase text-accent-gold">
          Where I've Been
        </p>
        <h2 ref={headingRef} className="flex items-center gap-3 font-heading text-3xl font-bold text-text-primary md:text-5xl lg:text-6xl">
          <Ship className="h-7 w-7 text-accent-yellow md:h-9 md:w-9" />
          The Journey <span className="text-accent-yellow">So Far</span>
        </h2>
        <div className="mt-4 h-px w-20 bg-accent-gold/50" />
      </div>

      {/* ── Timeline ─────────────────────────────────────── */}
      <div ref={containerRef} className="relative mx-auto max-w-4xl">
        {/* Simple straight vertical line — left on mobile, hidden on desktop */}
        <div className="absolute top-0 bottom-0 left-4 w-px bg-accent-gold/30 lg:hidden" />

        {/* Curved winding S-line and ship — desktop/tablet only */}
        {!isMobile && (
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-32 pointer-events-none z-0">
            <svg
              className="w-full h-full"
              viewBox="0 0 128 600"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="goldTimelineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFC72C" />
                  <stop offset="50%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#FFC72C" />
                </linearGradient>
              </defs>
              <path
                ref={pathRef}
                d="M 64,0 C 32,120 32,180 64,300 C 96,420 96,480 64,600"
                stroke="url(#goldTimelineGradient)"
                strokeWidth="3.5"
                strokeDasharray="6,6"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {/* Bouncing/Rotating Sailing Ship marker */}
            <div
              ref={shipRef}
              className="absolute h-50 w-50 flex items-center justify-center z-30 pointer-events-none"
              style={{ left: '50%', top: '0', transform: 'translate(-50%, -50%) rotate(-90deg)' }}
            >
              <img
                src="/images/ship-icon.png"
                alt="Sailing Ship Marker"
                className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
              />
            </div>
          </div>
        )}

        {/* Mobile ship — visible on < lg, hidden on >= lg */}
        {isMobile && (
          <div
            ref={mobileShipRef}
            className="absolute left-4 h-10 w-10 flex items-center justify-center z-30 pointer-events-none lg:hidden"
            style={{ top: '0', transform: 'translate(-50%, -50%) rotate(-90deg)' }}
          >
            <img
              src="/images/ship-icon.png"
              alt="Sailing Ship Marker (Mobile)"
              className="w-full h-full object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]"
            />
          </div>
        )}

        {/* ── Experience Entries ───────────────────────────── */}
        <div className="relative z-10">
          {EXPERIENCES.map((exp, i) => {
            const isLeft = i % 2 === 0; // alternating on desktop only

            return (
              <div
                key={exp.company}
                className={`
                  relative mb-16 last:mb-0
                  pl-12 lg:pl-0
                  lg:flex lg:items-start
                  ${isLeft ? 'lg:flex-row-reverse' : 'lg:flex-row'}
                `}
              >
                {/* ── Indicator node ── */}
                <div
                  className="
                    absolute left-2.5 top-1.5 h-3.5 w-3.5 rounded-full
                    border-2 border-accent-yellow bg-bg-primary z-20
                    lg:left-1/2 lg:-translate-x-1/2
                  "
                />

                {/* ── Spacer half (desktop only) ── */}
                <div className="hidden lg:block lg:w-[calc(50%+72px)]" />

                {/* ── Card ── */}
                <div
                  className="
                    w-full rounded-lg border border-accent-gold/20
                    bg-bg-secondary/85 p-5 sm:p-6
                    transition-all duration-300
                    hover:border-accent-yellow/40 hover:shadow-lg hover:shadow-accent-yellow/5
                    lg:w-[calc(50%-72px)]
                  "
                >
                  {/* Period + badge */}
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Briefcase className="h-4 w-4 text-accent-yellow" />
                    <span className="text-xs font-medium text-text-muted sm:text-sm">
                      {exp.period}
                    </span>
                    {exp.isCurrent && (
                      <span className="rounded-full bg-accent-yellow/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-yellow">
                        Current
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading text-lg font-semibold tracking-wide text-text-primary sm:text-xl">
                    {exp.role}
                  </h3>
                  <p className="mb-3 text-sm text-accent-gold">{exp.company}</p>

                  <ul className="space-y-2">
                    {exp.bullets.map((b, j) => (
                      <li key={j} className="flex gap-2 text-sm leading-relaxed text-text-muted">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-yellow/60" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Education sub-section ────────────────────────── */}
      <div className="mt-24">
        <div className="mb-12 flex flex-col items-center text-center">
          <h3 className="flex items-center gap-2 font-heading text-2xl font-bold text-text-primary md:text-3xl">
            <GraduationCap className="h-6 w-6 text-accent-yellow" />
            Education
          </h3>
          <div className="mt-3 h-px w-16 bg-accent-gold/40" />
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EDUCATION.map((edu) => (
            <div
              key={edu.degree}
              className="
                rounded-lg border border-accent-gold/20 bg-bg-secondary/85
                p-5 flex flex-col justify-between transition-all duration-300
                hover:border-accent-yellow/40 hover:shadow-lg hover:shadow-accent-yellow/5
              "
            >
              <div>
                <p className="font-heading text-base font-semibold tracking-wide text-text-primary sm:text-lg">
                  {edu.degree}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">
                  {edu.school}
                </p>
                {edu.university && (
                  <p className="text-xs text-text-muted/70 mt-0.5">({edu.university})</p>
                )}
              </div>
              <div className="mt-4 flex items-center gap-3 text-xs font-medium border-t border-accent-gold/10 pt-3">
                <span className="text-accent-gold">{edu.year}</span>
                <span className="h-3 w-px bg-accent-gold/30" />
                <span className="text-accent-yellow">{edu.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
