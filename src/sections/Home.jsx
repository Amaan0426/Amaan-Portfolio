import { useEffect, useRef, useState } from 'react';
import Section from '../components/Section';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { Compass } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ROLES = [
  'Full-Stack Developer',
  'AI/ML Engineer',
  'LLM Integration',
];

export default function Home() {
  const heroRef = useRef(null);
  const canvasMountRef = useRef(null);

  // Typewriter effect state
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Detect mobile to conditionally disable WebGL/Three.js background
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ── Typewriter effect ──────────────────────────────────
  useEffect(() => {
    let timer;
    const fullText = ROLES[roleIndex];
    const delay = isDeleting ? 30 : 80;

    if (!isDeleting && displayText === fullText) {
      timer = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    } else {
      timer = setTimeout(() => {
        setDisplayText((prev) =>
          isDeleting
            ? fullText.substring(0, prev.length - 1)
            : fullText.substring(0, prev.length + 1)
        );
      }, delay);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex]);

  // ── GSAP Entrance animations ──────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.animate-gsap', { opacity: 0, y: 30 });
      gsap.set('.animate-fade', { opacity: 0 });

      // Animate text elements
      gsap.to('.animate-gsap', {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.15,
        delay: 0.1,
      });

      // Animate profile photo with clipPath & scale reveal
      gsap.fromTo('.hero-photo-reveal',
        {
          opacity: 0,
          scale: 0.95,
          clipPath: 'inset(100% 0% 0% 0%)'
        },
        {
          opacity: 1,
          scale: 1,
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.6,
        }
      );

      // Animate compass scroll indicator
      gsap.to('.animate-fade', {
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.6,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // ── Pinned Hero-to-About Transition ScrollTrigger ─────
  useEffect(() => {
    const isDesktop = window.innerWidth >= 768;
    let ctx;

    const timer = setTimeout(() => {
      const heroPhoto = document.querySelector('.hero-photo-reveal');
      const aboutPhoto = document.querySelector('.about-photo-wrapper');
      const heroText = document.querySelector('.hero-text-content');
      const aboutContent = document.querySelector('.about-content-fade');

      ctx = gsap.context(() => {
        if (isDesktop) {
          if (!heroPhoto || !aboutPhoto) return;

          // Make sure aboutPhoto is hidden at the start
          gsap.set(aboutPhoto, { opacity: 0 });

          const heroRect = heroPhoto.getBoundingClientRect();
          const aboutRect = aboutPhoto.getBoundingClientRect();

          const deltaX = aboutRect.left - heroRect.left;
          const deltaY = aboutRect.top - heroRect.top;
          const scaleRatio = aboutRect.width / heroRect.width;
          const scrollDistance = window.innerHeight * 1.2;
          const targetDeltaY = deltaY - scrollDistance;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: '#home',
              start: 'top top',
              end: `+=${scrollDistance}`, // Pin for 120vh of scroll distance
              pin: true,
              pinSpacing: false, // Let About section scroll up over Hero
              scrub: 1,
              invalidateOnRefresh: true,
            }
          });

          if (heroText) {
            tl.to(heroText, {
              opacity: 0,
              y: -40,
              ease: 'power1.out',
            }, 0);
          }

          tl.to(heroPhoto, {
            x: deltaX,
            y: targetDeltaY,
            scale: scaleRatio,
            ease: 'power1.inOut',
          }, 0);

          if (aboutContent) {
            tl.fromTo(aboutContent,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, ease: 'power1.out' },
              0.3
            );
          }

          // Swapping opacity seamlessly at the end
          tl.to(aboutPhoto, { opacity: 1, duration: 0.05 }, '+=0');
          tl.to(heroPhoto, { opacity: 0, duration: 0.05 }, '<');

          // Subtle image scroll parallax inside hero container
          gsap.fromTo('.hero-photo-reveal img',
            { yPercent: -15 },
            {
              yPercent: 15,
              ease: 'none',
              scrollTrigger: {
                trigger: '#home',
                start: 'top top',
                end: `+=${scrollDistance}`,
                scrub: true,
              }
            }
          );
        } else {
          // Mobile scroll-scrubbed text fade out
          if (heroText) {
            gsap.to(heroText, {
              opacity: 0,
              y: -40,
              ease: 'none',
              scrollTrigger: {
                trigger: '#home',
                start: 'top top',
                end: 'bottom top',
                scrub: true,
              }
            });
          }
        }
      });
    }, 200);

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, []);

  // ── Three.js Neural Net Background ─────────────────────
  useEffect(() => {
    if (isMobile) return;
    const container = canvasMountRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 10));
    container.appendChild(renderer.domElement);

    // Particle nodes definition
    const particleCount = 500;
    const coords = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount * 3);

    const xLimit = 22;
    const yLimit = 12;
    const zLimit = 8;

    for (let i = 0; i < particleCount; i++) {
      coords[i * 3] = (Math.random() - 0.5) * xLimit * 2;
      coords[i * 3 + 1] = (Math.random() - 0.5) * yLimit * 2;
      coords[i * 3 + 2] = (Math.random() - 0.5) * zLimit * 2;

      speeds[i * 3] = (Math.random() - 0.5) * 0.015;
      speeds[i * 3 + 1] = (Math.random() - 0.5) * 0.015;
      speeds[i * 3 + 2] = (Math.random() - 0.5) * 0.015;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(coords, 3));

    // Dynamic procedural circle texture for soft round particles
    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255, 199, 44, 1)'); // --accent-yellow
      gradient.addColorStop(0.3, 'rgba(255, 199, 44, 0.7)');
      gradient.addColorStop(0.7, 'rgba(212, 175, 55, 0.15)'); // --accent-gold
      gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
      return new THREE.CanvasTexture(canvas);
    };

    const material = new THREE.PointsMaterial({
      size: 0.6,
      map: createCircleTexture(),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.40,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Connection lines setup
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xD4AF37, // --accent-gold
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
    });

    const lineGeometry = new THREE.BufferGeometry();
    const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineMesh);

    // Mouse parallax tracking
    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const handleMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let animationId;
    const animate = () => {
      const positions = geometry.attributes.position.array;

      // Update particle positions
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += speeds[i * 3];
        positions[i * 3 + 1] += speeds[i * 3 + 1];
        positions[i * 3 + 2] += speeds[i * 3 + 2];

        if (Math.abs(positions[i * 3]) > xLimit) speeds[i * 3] *= -1;
        if (Math.abs(positions[i * 3 + 1]) > yLimit) speeds[i * 3 + 1] *= -1;
        if (Math.abs(positions[i * 3 + 2]) > zLimit) speeds[i * 3 + 2] *= -1;
      }
      geometry.attributes.position.needsUpdate = true;

      // Connect close nodes
      const linePositions = [];
      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dx = positions[i * 3] - positions[j * 3];
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
          const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 6.5) {
            linePositions.push(
              positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
              positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
            );
          }
        }
      }

      lineGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(linePositions, 3)
      );

      // Interpolated camera tilt
      target.x += (mouse.x * 6.2 - target.x) * 0.04;
      target.y += (mouse.y * 4.2 - target.y) * 0.04;
      camera.position.x = target.x;
      camera.position.y = target.y;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, [isMobile]);

  return (
    <Section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-20 md:pt-36 lg:pt-40"
    >
      {/* ── Animated noise/grain overlay ── */}
      <div className="hero-grain-overlay" />

      <div ref={heroRef} className="w-full">
        {/* ── Subtle 3D WebGL Background (Confined & Lowest Layer) ── */}
        {!isMobile && (
          <div
            ref={canvasMountRef}
            className="absolute inset-0 z-0 pointer-events-none opacity-45"
          />
        )}

        {/* ── Subtle Fallback Mobile Gradient Background ── */}
        {isMobile && (
          <div className="absolute inset-0 z-0 bg-radial-[circle_at_center,_var(--color-bg-secondary)_0%,_var(--color-bg-primary)_100%] opacity-80 pointer-events-none" />
        )}

        <div
          className="relative z-10 flex w-full flex-col-reverse items-center justify-between gap-12 lg:flex-row lg:gap-16 min-h-[500px]"
        >
          {/* Left Column: Biography and Headings */}
          <div className="hero-text-content flex flex-col items-center text-center lg:items-start lg:text-left">
            {/* <p className="animate-gsap mb-3 text-sm font-medium tracking-widest text-accent-gold uppercase opacity-0">
              Portfolio Website
            </p> */}
            <h1 className="animate-gsap font-heading text-4xl font-bold leading-tight text-text-primary sm:text-6xl lg:text-7xl opacity-0">
              Amaan F. <span className="text-accent-yellow">Khatib</span>
            </h1>

            {/* Fixed height typewriter container to prevent layout jumping */}
            <div className="animate-gsap mt-3 h-8 sm:h-10 text-lg font-semibold tracking-wide text-accent-yellow sm:text-xl md:text-2xl opacity-0">
              <span>{displayText}</span>
              <span className="ml-1 inline-block w-1 animate-pulse bg-accent-yellow">
                |
              </span>
            </div>

            <p className="animate-gsap mt-6 max-w-md text-base leading-relaxed text-text-muted sm:text-lg opacity-0">
              Charting new territory at the intersection of code and AI.
            </p>

            <div className="animate-gsap mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto opacity-0">
              <a
                href="#projects"
                className="
                text-center rounded-sm bg-accent-yellow px-6 py-3
                text-sm font-semibold tracking-wide text-bg-primary
                transition-all duration-200 hover:bg-accent-yellow/90 hover:shadow-lg
                hover:shadow-accent-yellow/20
              "
              >
                View Projects
              </a>
              <a
                href="/Amaan_Khatib_Resume.pdf"
                download
                className="
                text-center rounded-sm border border-accent-gold/40 px-6 py-3
                text-sm font-semibold tracking-wide text-text-primary
                transition-all duration-200 hover:border-accent-yellow hover:text-accent-yellow
              "
              >
                Download Resume
              </a>
            </div>
          </div>

          {/* Right Column: Sharp Profile Photo */}
          <div className="hero-photo-reveal flex items-center justify-center lg:justify-end opacity-0">
            <div
              className="
              relative shrink-0 rounded-full
              w-[280px] h-[280px] md:w-[360px] md:h-[360px] lg:w-[420px] lg:h-[420px]
              overflow-hidden bg-bg-secondary
            "
              style={{
                aspectRatio: '1 / 1',
                borderRadius: '50%',
                border: '3px solid #D4AF37',
                boxShadow: '0 0 0 6px rgba(212, 175, 55, 0.15), 0 0 40px rgba(212, 175, 55, 0.25)',
              }}
            >
              <img
                src="/images/Amaan_Hero_Photo.png"
                alt="Amaan F. Khatib Headshot"
                className="w-120 h-130 object-cover rounded-full"
                style={{
                  objectPosition: 'center -160%',
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Bouncing Scroll Down Compass Indicator ── */}
        <div className="animate-fade absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 z-10">
          <a
            href="#about"
            aria-label="Scroll down to About section"
            className="text-accent-yellow/60 hover:text-accent-yellow transition-colors duration-200"
          >
            <Compass className="h-6 w-6 animate-bounce" />
          </a>
        </div>
      </div>
    </Section>
  );
}
