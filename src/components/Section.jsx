/**
 * Section – reusable wrapper that enforces the design-system layout rules:
 *   • max-w-7xl centered container
 *   • Consistent horizontal padding (px-6 mobile → px-12 desktop)
 *   • Consistent vertical padding (py-20 mobile → py-32 desktop)
 *   • Optional alternate background color
 *
 * Every page section MUST use this component so spacing can never drift.
 */

export default function Section({ id, children, className = '', alt = false }) {
  return (
    <section
      id={id}
      className={`
        relative z-10
        py-20 lg:py-32
        ${className}
      `}
      style={{
        backgroundColor: alt ? 'rgba(13, 27, 42, 0.88)' : 'rgba(10, 22, 40, 0.85)'
      }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {children}
      </div>
    </section>
  );
}
