import { useOnboarding } from '../state/onboarding.jsx';
import './ui.css';

export function PhoneFrame({ children }) {
  return (
    <div className="phone" role="presentation">
      <div className="phone__statusbar" />
      <div className="phone__viewport">{children}</div>
    </div>
  );
}

export function ScreenContainer({
  showHeader = true,
  showBack = true,
  showProgress,
  progress,
  scroll = false,
  tone,
  onBack,
  children,
  footer,
}) {
  const { stepMeta, back, isFirst } = useOnboarding();
  const visibleProgress =
    showProgress ?? stepMeta?.showProgress ?? false;
  const progressValue = progress ?? stepMeta?.progress ?? 0;
  const handleBack = onBack ?? back;
  const toneClass = tone ? ` screen--${tone}` : '';

  return (
    <div className={`screen${toneClass}`}>
      {showHeader && (
        <div className="screen__head">
          {showBack && (
            <button
              type="button"
              className="back-btn"
              onClick={handleBack}
              disabled={isFirst && !onBack}
              aria-label="Back"
            >
              ‹
            </button>
          )}
          {visibleProgress && (
            <ProgressBar value={progressValue} />
          )}
        </div>
      )}
      <div className={`screen__body${scroll ? ' screen__body--scroll' : ''}`}>
        {children}
      </div>
      {footer && <div className="screen__foot">{footer}</div>}
    </div>
  );
}

export function ProgressBar({ value }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className="progress"
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="progress__fill" style={{ width: `${clamped}%` }} />
    </div>
  );
}

export function PreHead({ children }) {
  return <p className="pre-head">{children}</p>;
}

export function H1({ children, lg = false }) {
  return <h1 className={`h1${lg ? ' h1--lg' : ''}`}>{children}</h1>;
}

export function H2({ children }) {
  return <h2 className="h2">{children}</h2>;
}

export function Sub({ children }) {
  return <p className="sub">{children}</p>;
}

export function Body({ children }) {
  return <p className="body">{children}</p>;
}

export function FooterNote({ children }) {
  return <p className="footer-note">{children}</p>;
}

export function Button({
  children,
  variant = 'primary',
  type = 'button',
  ...rest
}) {
  const cls =
    variant === 'ghost'
      ? 'btn btn--ghost'
      : variant === 'text'
        ? 'btn btn--text'
        : 'btn';
  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  );
}

export function Chip({ tone = 'cool', children }) {
  return <span className={`chip chip--${tone}`}>{children}</span>;
}

export function ChipRow({ children }) {
  return <div className="chip-row">{children}</div>;
}

export function Stars({ count = 5 }) {
  return (
    <span className="stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} aria-hidden="true">
          ★
        </span>
      ))}
    </span>
  );
}

export function Testimonial({ quote, attribution }) {
  return (
    <figure className="testimonial">
      <Stars />
      <blockquote>{quote}</blockquote>
      {attribution && <figcaption>— {attribution}</figcaption>}
    </figure>
  );
}

export function ResearchCard({ title = 'The Research', children }) {
  return (
    <aside className="research">
      <span className="research__icon" aria-hidden="true">
        ◇
      </span>
      <div>
        <span className="research__title">{title}</span>
        {children}
      </div>
    </aside>
  );
}

export function AppIcon({ app, size = 'md' }) {
  if (!app) return null;
  const cls = size === 'lg' ? 'app-icon app-icon--lg' : 'app-icon';
  return (
    <span
      className={cls}
      style={{ background: app.tint ?? undefined }}
      aria-hidden="true"
    >
      {app.glyph}
    </span>
  );
}

export function BigNum({ value, label }) {
  return (
    <div className="bignum">
      <span className="bignum__num">{value}</span>
      {label && <span className="bignum__label">{label}</span>}
    </div>
  );
}

export function Divider() {
  return <div className="divider" role="separator" />;
}

export function Stub({ title }) {
  const { stepMeta } = useOnboarding();
  return (
    <ScreenContainer>
      <div className="stub">
        <span className="stub__tag">Not yet built</span>
        <span className="stub__title">{title ?? stepMeta.title}</span>
        <p className="body" style={{ maxWidth: 260 }}>
          This screen is scaffolded and will be implemented in a later phase.
        </p>
      </div>
    </ScreenContainer>
  );
}
