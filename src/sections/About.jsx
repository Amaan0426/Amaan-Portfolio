import { useRef, useEffect } from 'react';
import Section from '../components/Section';
import { Anchor } from 'lucide-react';
import gsap from 'gsap';
import useTextReveal from '../hooks/useTextReveal';

export default function About() {
  const headingRef = useRef(null);

  useTextReveal(headingRef);

  useEffect(() => {
    // Parallax on About image inside circular container
    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop) {
      const ctx = gsap.context(() => {
        gsap.fromTo('.about-photo-wrapper img',
          { yPercent: -12, scale: 1.15 },
          {
            yPercent: 12,
            ease: 'none',
            scrollTrigger: {
              trigger: '#about',
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            }
          }
        );
      });
      return () => ctx.revert();
    }
  }, []);

  return (
    <Section id="about" alt>
      {/* ── Section heading ─────────────────────────────── */}
      <div className="mb-16 flex flex-col items-center text-center">
        <p className="mb-2 text-sm font-medium tracking-widest uppercase text-accent-gold">
          Who I Am
        </p>
        <h2 ref={headingRef} className="flex items-center gap-3 font-heading text-3xl font-bold text-text-primary md:text-5xl lg:text-6xl">
          <Anchor className="h-7 w-7 text-accent-yellow md:h-9 md:w-9" />
          About <span className="text-accent-yellow">Me</span>
        </h2>
        <div className="mt-4 h-px w-20 bg-accent-gold/50" />
      </div>

      {/* ── Two-column layout: photo + bio ───────────────── */}
      <div className="about-content-fade lg:opacity-0 w-full flex flex-col">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-16">
          {/* Image placeholder */}
          <div
            className="
              about-photo-wrapper shrink-0 lg:opacity-0 rounded-full border-4 border-accent-gold
              w-[220px] h-[220px] md:w-[300px] md:h-[300px] lg:w-[360px] lg:h-[360px]
              overflow-hidden bg-bg-secondary
            "
            style={{
              boxShadow: '0 0 24px rgba(212, 175, 55, 0.25)',
            }}
          >
            <img
              src="/images/mine black shirt.png"
              alt="Amaan F. Khatib Headshot"
              className="w-full h-full object-cover object-[center_top] rounded-full"
            />
          </div>

        {/* Bio text */}
        <div className="max-w-2xl text-center lg:text-left">
          <p className="text-base leading-relaxed text-text-muted sm:text-lg">
            I'm a Computer Engineering graduate and Associate AI/ML Engineer
            based in Pune, India, with hands-on experience in Java, Spring Boot,
            full-stack development, and AI-powered applications. I specialize in
            building scalable backend systems, REST APIs, and integrating
            multiple LLM APIs (Gemini, Grok, DeepSeek, Ollama, OpenAI) into
            real-world products.
          </p>
          <p className="mt-4 text-base leading-relaxed text-text-muted sm:text-lg">
            I'm passionate about writing clean, efficient, maintainable code and
            solving real problems at the intersection of software engineering and
            AI.
          </p>
        </div>
      </div>
      </div>
    </Section>
  );
}
