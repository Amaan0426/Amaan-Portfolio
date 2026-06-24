import { useState, useRef } from 'react';
import Section from '../components/Section';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { FaLinkedinIn, FaGithub } from 'react-icons/fa';
import useTextReveal from '../hooks/useTextReveal';

const CONTACT_INFO = [
  {
    icon: Mail,
    label: 'Email',
    value: 'amaanfkhatib@gmail.com',
    href: 'mailto:amaanfkhatib@gmail.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 7391880104',
    href: 'tel:+917391880104',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Pune, Maharashtra, India',
    href: null,
  },
];

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

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const headingRef = useRef(null);

  useTextReveal(headingRef);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear field-specific error dynamically when user starts typing
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!form.name.trim()) {
      tempErrors.name = 'Name is required';
    }
    if (!form.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      tempErrors.email = 'Please enter a valid email address';
    }
    if (!form.subject.trim()) {
      tempErrors.subject = 'Subject is required';
    }
    if (!form.message.trim()) {
      tempErrors.message = 'Message is required';
    } else if (form.message.trim().length < 10) {
      tempErrors.message = 'Message must be at least 10 characters';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const formId = import.meta.env.VITE_FORMSPREE_FORM_ID;

    // Check if configuration exists
    if (!formId) {
      setTimeout(() => {
        setIsSubmitting(false);
        setToast({
          show: true,
          message: 'Formspree Form ID is not configured in your .env file!',
          type: 'error',
        });
      }, 800);
      return;
    }

    fetch(`https://formspree.io/f/${formId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      }),
    })
      .then((response) => {
        setIsSubmitting(false);
        if (response.ok) {
          setForm({ name: '', email: '', subject: '', message: '' });
          setErrors({});
          setToast({
            show: true,
            message: 'Message sent successfully! Smooth sailing ahead.',
            type: 'success',
          });
        } else {
          setToast({
            show: true,
            message: 'Failed to send message. Please check inputs and try again.',
            type: 'error',
          });
        }
      })
      .catch((err) => {
        setIsSubmitting(false);
        console.error('Formspree submit error:', err);
        setToast({
          show: true,
          message: 'Failed to send message. Please check connection and try again.',
          type: 'error',
        });
      });
  };

  const inputClasses = (fieldName) => `
    w-full rounded-md border bg-bg-primary/60 px-4 py-3 text-sm text-text-primary
    placeholder:text-text-muted/50 outline-none transition-all duration-200
    ${errors[fieldName]
      ? 'border-accent-red focus:ring-1 focus:ring-accent-red/40'
      : 'border-accent-gold/25 focus:border-accent-yellow focus:ring-1 focus:ring-accent-yellow/40'
    }
  `;

  return (
    <Section id="contact" alt>
      {/* ── Section heading ─────────────────────────────── */}
      <div className="mb-16 flex flex-col items-center text-center">
        <p className="mb-2 text-sm font-medium tracking-widest uppercase text-accent-gold">
          Let's Connect
        </p>
        <h2 ref={headingRef} className="font-heading text-3xl font-bold text-text-primary md:text-5xl lg:text-6xl">
          Let's Set Sail <span className="text-accent-yellow">Together</span>
        </h2>
        <div className="mt-4 h-px w-20 bg-accent-gold/50" />
      </div>

      {/* ── Two-column: form + info ──────────────────────── */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Contact form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label htmlFor="contact-name" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-muted">
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              className={inputClasses('name')}
              aria-required="true"
              disabled={isSubmitting}
            />
            {errors.name && <p className="mt-1 text-xs text-accent-red">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="contact-email" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-muted">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              className={inputClasses('email')}
              aria-required="true"
              disabled={isSubmitting}
            />
            {errors.email && <p className="mt-1 text-xs text-accent-red">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="contact-subject" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-muted">
              Subject
            </label>
            <input
              id="contact-subject"
              name="subject"
              type="text"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
              className={inputClasses('subject')}
              aria-required="true"
              disabled={isSubmitting}
            />
            {errors.subject && <p className="mt-1 text-xs text-accent-red">{errors.subject}</p>}
          </div>

          <div>
            <label htmlFor="contact-message" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-muted">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              placeholder="Write your message…"
              value={form.message}
              onChange={handleChange}
              className={`${inputClasses('message')} resize-none`}
              aria-required="true"
              disabled={isSubmitting}
            />
            {errors.message && <p className="mt-1 text-xs text-accent-red">{errors.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="
              inline-flex items-center gap-2 rounded-sm bg-accent-yellow
              px-6 py-3 text-sm font-semibold tracking-wide text-bg-primary
              transition-all duration-200 hover:bg-accent-yellow/90
              disabled:opacity-75 disabled:cursor-not-allowed
              hover:shadow-lg hover:shadow-accent-yellow/20 cursor-pointer
            "
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Message
              </>
            )}
          </button>
        </form>

        {/* Contact info */}
        <div className="flex flex-col justify-center">
          <div className="space-y-6">
            {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-accent-gold/25 bg-bg-primary/60">
                  <Icon className="h-5 w-5 text-accent-yellow" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      className="text-sm text-text-primary transition-colors duration-200 hover:text-accent-yellow break-all"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm text-text-primary">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Social icons */}
          <div className="mt-10">
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-text-muted">
              Find me on
            </p>
            <div className="flex gap-3">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="
                    flex h-10 w-10 items-center justify-center rounded-lg
                    border border-accent-gold/25 bg-bg-primary/60
                    text-text-muted transition-all duration-200
                    hover:border-accent-yellow/50 hover:text-accent-yellow
                    hover:shadow-lg hover:shadow-accent-yellow/10
                  "
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Custom Theme Toasts ─────────────────────────── */}
      {toast.show && (
        <div
          className={`
            fixed bottom-6 right-6 z-[100] max-w-sm rounded-md border p-4 shadow-2xl
            transition-all duration-300 transform translate-y-0 opacity-100 flex items-start gap-3
            ${toast.type === 'success'
              ? 'bg-bg-secondary border-emerald-500/30 text-emerald-400'
              : 'bg-bg-secondary border-accent-red/30 text-accent-red'
            }
          `}
        >
          <div className="flex-grow">
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-0.5">
              {toast.type === 'success' ? 'Success' : 'Notice / Error'}
            </p>
            <p className="text-sm text-text-primary">{toast.message}</p>
          </div>
          <button
            onClick={() => setToast((prev) => ({ ...prev, show: false }))}
            className="text-text-muted hover:text-text-primary text-xs font-bold leading-none cursor-pointer"
          >
            ×
          </button>
        </div>
      )}
    </Section>
  );
}
