import { useRef, useEffect, useState } from 'react';
import {
  Button,
  ScreenContainer,
  H1,
  PreHead,
  FooterNote,
  Stars,
} from '../components/ui.jsx';
import { useOnboarding } from '../state/onboarding.jsx';
import { submitToWaitlist } from '../api/waitlist.js';
import './EmailCapture.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailCapture() {
  const { answers, set, next } = useOnboarding();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const name = answers.name.trim();
  const email = answers.email;
  const isValid = EMAIL_RE.test(email.trim());

  // Auto-focus the email field after a short delay so the keyboard doesn't
  // pop immediately and obscure the screen copy.
  useEffect(() => {
    const id = setTimeout(() => inputRef.current?.focus(), 380);
    return () => clearTimeout(id);
  }, []);

  async function handleSubmit() {
    if (!isValid || loading) return;
    setLoading(true);
    setError('');
    try {
      await submitToWaitlist({
        name,
        email: email.trim(),
        goals: answers.goals,
        currentHours: answers.currentHours,
        targetHours: answers.targetHours,
        distractingApps: answers.distractingApps,
      });
      set('waitlistSubmitted', true);
      next();
    } catch {
      setError('Something went wrong — please try again.');
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit();
  }

  return (
    <ScreenContainer
      showBack={!loading}
      footer={
        <div className="ec__footer">
          {error && (
            <p className="ec__error" role="alert">
              {error}
            </p>
          )}
          <Button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            style={{ width: '100%' }}
          >
            {loading ? (
              <span className="ec__spinner-wrap">
                <Spinner /> Saving your spot…
              </span>
            ) : (
              'Claim Early-Bird Spot →'
            )}
          </Button>
          <FooterNote style={{ textAlign: 'center' }}>
            🔒 No spam. Unsubscribe any time.
          </FooterNote>
        </div>
      }
    >
      {/* ── Header ── */}
      <PreHead>Your plan is ready{name ? `, ${name}` : ''}.</PreHead>
      <H1>
        Be first when{' '}
        <span className="cool">Stillscroll</span> launches.
      </H1>

      {/* ── Early-bird badge ── */}
      <div className="ec__badge">
        <span className="ec__badge-pill">
          <Stars count={5} /> Early-bird offer
        </span>
        <div className="ec__badge-row">
          <span className="ec__badge-price">
            <span className="ec__badge-new">$17.99<span className="ec__badge-unit">/yr</span></span>
            <span className="ec__badge-was">was $29.99</span>
          </span>
          <span className="ec__badge-tag">40% off at launch</span>
        </div>
        <p className="ec__badge-note">
          Your discount is locked in the moment you join — no strings attached.
        </p>
      </div>

      {/* ── Email input ── */}
      <div className="ec__field">
        <label className="ec__label" htmlFor="ec-email">
          Your email address
        </label>
        <input
          ref={inputRef}
          id="ec-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          className={`ec__input${error ? ' ec__input--error' : ''}`}
          value={email}
          onChange={(e) => {
            set('email', e.target.value);
            if (error) setError('');
          }}
          onKeyDown={handleKeyDown}
          placeholder="you@example.com"
          aria-describedby={error ? 'ec-error' : undefined}
          disabled={loading}
        />
      </div>

      {/* ── Scarcity nudge ── */}
      <SpotCounter />
    </ScreenContainer>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SpotCounter() {
  // Static snapshot — update this via your backend / dashboard.
  const CLAIMED = 583;
  const TOTAL = 1000;
  const pct = Math.round((CLAIMED / TOTAL) * 100);

  return (
    <div className="ec__spots">
      <div className="ec__spots-header">
        <span className="ec__spots-label">Early-bird spots claimed</span>
        <span className="ec__spots-count">
          <strong>{CLAIMED}</strong> / {TOTAL}
        </span>
      </div>
      <div className="ec__spots-track">
        <div className="ec__spots-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="ec__spinner"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      aria-hidden="true"
    >
      <circle
        cx="9"
        cy="9"
        r="7"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeOpacity="0.25"
      />
      <path
        d="M9 2 A7 7 0 0 1 16 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
