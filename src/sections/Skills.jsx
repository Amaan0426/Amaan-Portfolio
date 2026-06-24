import { useRef, useEffect } from 'react';
import Section from '../components/Section';
import { Compass, Code, Layout, Server, Database, Brain, Wrench } from 'lucide-react';
import useTextReveal from '../hooks/useTextReveal';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SKILL_CATEGORIES = [
  {
    title: 'Languages',
    icon: Code,
    skills: ['Java', 'Python', 'JavaScript', 'C'],
  },
  {
    title: 'Frontend',
    icon: Layout,
    skills: ['React', 'Redux', 'HTML', 'CSS', 'Bootstrap'],
  },
  {
    title: 'Backend & Frameworks',
    icon: Server,
    skills: ['Spring Boot', 'Hibernate', 'JDBC', 'Spring Data JPA', 'Django'],
  },
  {
    title: 'Databases',
    icon: Database,
    skills: ['MySQL', 'SQLite'],
  },
  {
    title: 'AI / LLM APIs',
    icon: Brain,
    skills: ['Gemini', 'Grok', 'DeepSeek', 'Ollama', 'OpenAI', 'SerpAPI'],
  },
  {
    title: 'Tools & Libraries',
    icon: Wrench,
    skills: ['Postman', 'BeautifulSoup', 'Pandas', 'Requests', 'Lombok', 'n8n'],
  },
];

function SkillCard({ title, icon: Icon, skills, isMobile, index, total }) {
  const angle = (360 / total) * index;
  
  if (isMobile) {
    return (
      <div
        className="
          mobile-skill-card w-full rounded-[16px] border border-[#D4AF37] bg-[#0d1b2a]
          p-6 flex flex-col select-none
        "
      >
        <Icon className="h-[28px] w-[28px] text-[#FFC72C] mb-4 shrink-0" />
        <h3 className="font-heading text-[16px] font-bold text-[#F5F0E6] mb-4">
          {title}
        </h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="
                font-body rounded-full border border-[#FFC72C] bg-transparent
                px-3 py-1 text-[12px] font-medium text-[#FFC72C] tracking-wide
              "
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        desktop-skill-card select-none bg-[#0d1b2a] rounded-[16px] p-6 border-[1.5px] border-[#D4AF37]
      "
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(380px) rotateY(0deg)`,
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        width: '260px',
        minHeight: '320px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Icon className="h-[28px] w-[28px] text-[#FFC72C] mb-4 shrink-0" />
      <h3 className="font-heading text-[16px] font-bold text-[#F5F0E6] mb-4">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="
              font-body rounded-full border border-[#FFC72C] bg-transparent
              px-3 py-1 text-[12px] font-medium text-[#FFC72C] tracking-wide
            "
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const headingRef = useRef(null);
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  useTextReveal(headingRef);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      const cards = gsap.utils.toArray('.mobile-skill-card', container);
      if (cards.length === 0) return;

      const ctx = gsap.context(() => {
        gsap.fromTo(cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      }, container);

      return () => ctx.revert();
    } else {
      const stage = stageRef.current;
      const cards = gsap.utils.toArray('.desktop-skill-card', container);
      const N = cards.length;
      if (!stage || N === 0) return;

      const ctx = gsap.context(() => {
        // Center the stage using GSAP transforms to avoid conflicts
        gsap.set(stage, {
          xPercent: -50,
          yPercent: -50,
          left: '50%',
          top: '50%',
          rotateY: 0,
        });

        const updateCarousel = (stageRotation) => {
          cards.forEach((card, index) => {
            const cardAngle = (360 / N) * index;
            let diff = (stageRotation + cardAngle) % 360;
            if (diff > 180) diff -= 360;
            if (diff < -180) diff += 360;
            const absDiff = Math.abs(diff);

            let opacity = 0.3;
            let blur = 1;
            let isFront = false;

            if (absDiff <= 30) {
              opacity = 1;
              blur = 0;
              isFront = true;
            } else if (absDiff < 90) {
              const factor = (absDiff - 30) / 60; // 0 to 1
              opacity = 1 - 0.7 * factor;
              blur = factor * 1.5; // Up to 1.5px blur
            }

            gsap.set(card, {
              opacity: opacity,
              filter: `blur(${blur}px)`,
              boxShadow: isFront 
                ? '0 0 30px rgba(255, 199, 44, 0.3)' 
                : 'none',
              zIndex: isFront ? 10 : 1,
            });
          });
        };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: '+=3000',
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const stageRotation = -360 * self.progress;
              updateCarousel(stageRotation);

              // Direct DOM update of dots for high performance
              const activeIndex = Math.round(self.progress * N) % N;
              const dots = container.querySelectorAll('.carousel-dot');
              dots.forEach((dot, idx) => {
                if (idx === activeIndex) {
                  dot.style.backgroundColor = '#D4AF37';
                } else {
                  dot.style.backgroundColor = 'transparent';
                }
              });
            }
          }
        });

        tl.to(stage, {
          rotateY: -360,
          ease: 'none',
        }, 0);

        // Initial render update
        updateCarousel(0);

        // Refresh ScrollTrigger to ensure clean release
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);
      }, container);

      return () => ctx.revert();
    }
  }, []);

  return (
    <Section id="skills" className="min-h-screen">
      <div ref={containerRef} className="w-full relative">
        {/* ── Section heading ─────────────────────────────── */}
        <div className="mb-16 flex flex-col items-center text-center">
          <p className="mb-2 text-sm font-medium tracking-widest uppercase text-accent-gold">
            What I Work With
          </p>
          <h2 ref={headingRef} className="flex items-center gap-3 font-heading text-3xl font-bold text-text-primary md:text-5xl lg:text-6xl">
            <Compass className="h-7 w-7 text-accent-yellow md:h-9 md:w-9" />
            My <span className="text-accent-yellow">Arsenal</span>
          </h2>
          <div className="mt-4 h-px w-20 bg-accent-gold/50" />
        </div>

        {/* ── Desktop Carousel view ───────────────────────── */}
        <div className="hidden md:block relative w-full h-[600px] overflow-visible">
          {/* Ambient light spotlight behind front card */}
          <div 
            className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] pointer-events-none rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255, 199, 44, 0.08) 0%, transparent 70%)',
              zIndex: 2,
            }}
          />

          <div
            ref={stageRef}
            style={{
              position: 'absolute',
              width: '300px',
              height: '380px',
              perspective: '1200px',
              transformStyle: 'preserve-3d',
              perspectiveOrigin: '50% 40%',
              zIndex: 3,
            }}
          >
            {SKILL_CATEGORIES.map(({ title, icon, skills }, index) => (
              <SkillCard
                key={title}
                title={title}
                icon={icon}
                skills={skills}
                isMobile={false}
                index={index}
                total={SKILL_CATEGORIES.length}
              />
            ))}
          </div>
        </div>

        {/* Dot Indicators for Carousel */}
        <div className="hidden md:flex justify-center gap-3 mt-4 mb-8 relative z-10">
          {SKILL_CATEGORIES.map((_, idx) => (
            <div
              key={idx}
              className="carousel-dot w-2.5 h-2.5 rounded-full border border-[#D4AF37] transition-all duration-300"
              style={{ backgroundColor: idx === 0 ? '#D4AF37' : 'transparent' }}
            />
          ))}
        </div>

        {/* ── Mobile Stack view ───────────────────────────── */}
        <div className="block md:hidden space-y-6 w-full px-2">
          {SKILL_CATEGORIES.map(({ title, icon, skills }, index) => (
            <SkillCard
              key={title}
              title={title}
              icon={icon}
              skills={skills}
              isMobile={true}
              index={index}
              total={SKILL_CATEGORIES.length}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
