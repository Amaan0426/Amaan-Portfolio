import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* Track scroll position to toggle solid navbar background */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Prevent body scroll while mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleLinkClick = () => setIsOpen(false);

  return (
    <>
      {/* ── Top navbar bar ────────────────────────────────── */}
      <nav
        className={`
          fixed top-0 left-0 z-40 w-full transition-all duration-300
          ${scrolled ? 'shadow-lg shadow-bg-primary/40' : ''}
        `}
        style={{
          backgroundColor: scrolled ? 'rgba(10, 22, 40, 0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
          {/* Logo / Name */}
          <a
            href="#home"
            className="font-heading text-xl font-bold tracking-wider text-accent-yellow sm:text-2xl"
          >
            AFK<span className="text-text-primary">.</span>
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  className="
                    relative font-body text-sm font-medium tracking-wide text-text-muted
                    transition-colors duration-200 hover:text-accent-yellow
                    after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0
                    after:bg-accent-yellow after:transition-all after:duration-300
                    hover:after:w-full
                  "
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* Spacer for mobile — hamburger is rendered outside <nav> */}
          <div className="h-7 w-7 lg:hidden" />
        </div>
      </nav>

      {/* ── Hamburger / Close button (lives in root stacking context) ── */}
      <button
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setIsOpen((v) => !v)}
        className="fixed top-4 right-6 z-[60] text-text-primary lg:hidden"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* ── Mobile menu overlay ───────────────────────────── */}
      <div
        className={`
          fixed inset-0 z-50 flex flex-col items-center justify-center
          bg-bg-primary transition-all duration-300
          lg:hidden
          ${isOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'}
        `}
      >
        <ul className="flex flex-col items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                onClick={handleLinkClick}
                className="
                  font-heading text-2xl font-semibold tracking-wider text-text-primary
                  transition-colors duration-200 hover:text-accent-yellow
                "
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Decorative gold line */}
        <div className="mt-12 h-px w-32 bg-accent-gold/40" />
      </div>
    </>
  );
}
