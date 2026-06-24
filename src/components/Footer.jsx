import { FaLinkedinIn, FaGithub } from 'react-icons/fa';

const SOCIALS = [
  {
    icon: FaLinkedinIn,
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/amaan-khatib-5116b8220',
  },
  {
    icon: FaGithub,
    label: 'GitHub',
    href: 'https://github.com/Amaan0426',
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer 
      className="relative z-10 border-t border-accent-gold/20 py-10"
      style={{ backgroundColor: 'rgba(10, 22, 40, 0.85)' }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          {/* Logo */}
          <p className="font-heading text-sm tracking-wider text-accent-yellow">
            AFK<span className="text-text-primary">.</span>
          </p>

          {/* Social icons */}
          <div className="flex gap-3">
            {SOCIALS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="
                  flex h-8 w-8 items-center justify-center rounded-md
                  border border-accent-gold/25 text-text-muted
                  transition-all duration-200
                  hover:border-accent-yellow/50 hover:text-accent-yellow
                "
              >
                <Icon size={14} />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-sm text-text-muted">
            &copy; {year} Amaan F. Khatib. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
