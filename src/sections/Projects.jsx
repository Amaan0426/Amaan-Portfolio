import { useState, useRef, useEffect } from 'react';
import Section from '../components/Section';
import { siteData } from '../data/siteData';
import { Map } from 'lucide-react';
import useTextReveal from '../hooks/useTextReveal';
import useMagneticTilt from '../hooks/useMagneticTilt';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FILTERS = ['All', 'AI/LLM', 'Java/Backend', 'Python'];

function ProjectCard({ project }) {
  return (
    <div
      data-cursor-text="Explore"
      className="
        project-card group flex flex-col justify-between rounded-lg border border-accent-gold
        bg-bg-secondary p-6 transition-all duration-300 w-full
        md:w-[280px] lg:w-[320px] shrink-0
      "
      style={{ willChange: 'transform, opacity' }}
    >
      <div>
        {/* Header: Icon + Category Badge */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-accent-gold/25 bg-bg-primary/60">
            <Map className="h-5 w-5 text-accent-yellow" />
          </div>
          <span className="rounded-full bg-accent-gold/10 border border-accent-gold/25 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-gold">
            {project.categories[0]}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-heading text-lg font-bold tracking-wide text-text-primary sm:text-xl">
          {project.title}
        </h3>

        {/* Description */}
        <p className="mt-3 text-sm leading-relaxed text-text-muted line-clamp-3">
          {project.description}
        </p>
      </div>

      {/* Tech Tags */}
      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.tech.map((tag) => (
          <span
            key={tag}
            className="
              rounded-full border border-accent-gold/20 bg-bg-primary/40
              px-2.5 py-0.5 text-[10px] font-medium text-text-muted
            "
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [showProgress, setShowProgress] = useState(false);
  const headingRef = useRef(null);
  const containerRef = useRef(null);

  useTextReveal(headingRef);

  // Filter project cards based on the selected category
  const filteredProjects = activeFilter === 'All'
    ? siteData.projects
    : siteData.projects.filter((p) => p.categories.includes(activeFilter));

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const container = containerRef.current;
    if (!container) return;

    const scrollRow = container.querySelector('.projects-scroll-row');
    if (!scrollRow) return;

    if (isMobile) {
      setShowProgress(false);
      // Mobile fallback: simple fade-up stagger
      const cards = gsap.utils.toArray('.project-card', container);
      const ctx = gsap.context(() => {
        gsap.fromTo(cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      }, container);

      return () => ctx.revert();
    } else {
      // Desktop horizontal scroll
      const rowWidth = scrollRow.scrollWidth;
      const viewportWidth = window.innerWidth;
      const xVal = -(rowWidth - viewportWidth + 96); // Keep slight offset for margins

      const shouldScroll = rowWidth > viewportWidth;
      setShowProgress(shouldScroll);

      const ctx = gsap.context(() => {
        if (shouldScroll) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: container,
              start: 'top top',
              end: () => `+=${Math.abs(xVal)}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            }
          });

          // Horizontal scroll row movement
          tl.to(scrollRow, {
            x: xVal,
            ease: 'none',
          }, 0);

          // Progress bar growth
          tl.to('.projects-progress-bar', {
            width: '100%',
            ease: 'none',
          }, 0);
        }
      }, container);

      // Force recalculation when filters or layout updates
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);

      return () => ctx.revert();
    }
  }, [filteredProjects]);

  return (
    <Section id="projects" alt className="overflow-hidden relative">
      <div ref={containerRef} className="w-full relative">
        {/* ── Section heading ─────────────────────────────── */}
        <div className="mb-12 flex flex-col items-center text-center">
          <p className="mb-2 text-sm font-medium tracking-widest uppercase text-accent-gold">
            Featured Work
          </p>
          <h2 ref={headingRef} className="font-heading text-3xl font-bold text-text-primary md:text-5xl lg:text-6xl text-center leading-tight">
            <Map className="mx-auto mb-2 h-7 w-7 text-accent-yellow md:inline-block md:align-middle md:mr-3 md:mb-0 md:h-9 md:w-9" />
            <span className="block md:inline-block md:align-middle">
              <span className="inline-block">Voyages &amp;&nbsp;</span>
              <span className="inline-block text-accent-yellow">Projects</span>
            </span>
          </h2>
          <div className="mt-4 h-px w-20 bg-accent-gold/50" />
        </div>

        {/* ── Filter Buttons ───────────────────────────────── */}
        <div className="mb-12 flex flex-wrap justify-center gap-3 px-4">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`
                  rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider
                  transition-all duration-200 cursor-pointer
                  ${isActive
                    ? 'bg-accent-yellow text-bg-primary shadow-md shadow-accent-yellow/10'
                    : 'border border-accent-gold/25 text-text-muted hover:border-accent-yellow hover:text-accent-yellow'
                  }
                `}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* ── Projects Row/Grid ────────────────────────────── */}
        <div className="projects-scroll-row flex flex-col gap-6 md:flex-row md:flex-nowrap md:gap-8 items-stretch w-full md:w-max px-4 md:px-12">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* ── Progress Bar ── */}
        <div className={`hidden md:block w-72 h-[2px] bg-[#D4AF37]/20 mx-auto mt-12 rounded-full overflow-hidden transition-opacity duration-300 ${showProgress ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="projects-progress-bar h-full bg-[#D4AF37] w-0" />
        </div>
      </div>
    </Section>
  );
}
