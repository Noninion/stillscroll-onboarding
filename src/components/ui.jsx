import { useOnboarding } from '../state/onboarding.jsx';
import './ui.css';

function joinClass(...classes) {
  return classes.filter(Boolean).join(' ');
}

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
  section,
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
              className="back-btn motion-item"
              onClick={handleBack}
              disabled={isFirst && !onBack}
              aria-label="Back"
            >
              ‹
            </button>
          )}
          {visibleProgress ? (
            <ProgressBar value={progressValue} />
          ) : section ? (
            <>
              <span className="screen__section motion-text">{section}</span>
              {/* Spacer matches back-btn width so the label visually centers */}
              {showBack && <span className="screen__head-spacer" aria-hidden="true" />}
            </>
          ) : null}
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
      className="progress motion-item"
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
  return <p className="pre-head motion-text">{children}</p>;
}

export function H1({ children, lg = false }) {
  return <h1 className={joinClass('h1 motion-text', lg && 'h1--lg')}>{children}</h1>;
}

export function H2({ children }) {
  return <h2 className="h2 motion-text">{children}</h2>;
}

export function Sub({ children }) {
  return <p className="sub motion-text">{children}</p>;
}

export function Body({ children }) {
  return <p className="body motion-text">{children}</p>;
}

export function FooterNote({ children }) {
  return <p className="footer-note motion-text">{children}</p>;
}

export function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled,
  ...rest
}) {
  const { transition } = useOnboarding();
  const cls =
    variant === 'ghost'
      ? 'btn btn--ghost motion-item'
      : variant === 'text'
        ? 'btn btn--text motion-item'
        : 'btn motion-item';
  return (
    <button
      type={type}
      className={cls}
      disabled={disabled || transition.isNavigating}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Chip({ tone = 'cool', children }) {
  return <span className={`chip chip--${tone} motion-item`}>{children}</span>;
}

export function ChipRow({ children }) {
  return <div className="chip-row motion-item">{children}</div>;
}

export function Stars({ count = 5 }) {
  return (
    <span className="stars motion-item" aria-label={`${count} out of 5 stars`}>
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
    <figure className="testimonial motion-item">
      <Stars />
      <blockquote>{quote}</blockquote>
      {attribution && <figcaption>— {attribution}</figcaption>}
    </figure>
  );
}

export function ResearchCard({ title = 'The Research', children }) {
  return (
    <aside className="research motion-item">
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
  const cls = size === 'lg' ? 'app-icon app-icon--lg motion-item' : 'app-icon motion-item';
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
    <div className="bignum motion-item">
      <span className="bignum__num">{value}</span>
      {label && <span className="bignum__label">{label}</span>}
    </div>
  );
}

export function Divider() {
  return <div className="divider motion-item" role="separator" />;
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
