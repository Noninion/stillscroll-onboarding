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
import {
  analyticsPayload,
  identifyLead,
  trackEvent,
  trackEmailStarted,
  trackWaitlistSubmitFailed,
  trackWaitlistSubmitted,
} from '../analytics/index.js';
import { FEATURE_FLAGS } from '../config/features.js';
import './EmailCapture.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const APP_STORE_URL =
  'https://apps.apple.com/il/app/stillscroll-breathe-to-scroll/id6780034589';

function isIosDevice() {
  if (typeof window === 'undefined') return false;

  const { maxTouchPoints, platform, userAgent } = window.navigator;

  return (
    /iPad|iPhone|iPod/.test(userAgent) ||
    (platform === 'MacIntel' && maxTouchPoints > 1)
  );
}

export default function EmailCapture() {
  const { answers, stepMeta, set, next } = useOnboarding();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailStarted, setEmailStarted] = useState(false);
  const inputRef = useRef(null);
  const cleanLaunchCopy = FEATURE_FLAGS.cleanLaunchCopy;
  const isIos = isIosDevice();

  const name = answers.name.trim();
  const email = answers.email;
  const isValid = EMAIL_RE.test(email.trim());
  const emailDomain = email.trim().split('@')[1]?.toLowerCase() ?? '';

  function buildWaitlistPayload() {
    return {
      name,
      email: email.trim(),
      submittedAt: new Date().toISOString(),
      goals: answers.goals,
      currentHours: answers.currentHours,
      targetHours: answers.targetHours,
      distractingApps: answers.distractingApps,
      hooks: answers.hooks,
      emotions: answers.emotions,
      ageBucket: answers.ageBucket,
      pastAttempts: answers.pastAttempts,
      attribution: analyticsPayload(),
    };
  }

  function buildLeadAnalyticsPayload() {
    return {
      step_key: stepMeta.key,
      step_index: stepMeta.index,
      email_domain: emailDomain,
      goals: answers.goals,
      current_hours: answers.currentHours,
      target_hours: answers.targetHours,
      distracting_apps: answers.distractingApps,
      hooks: answers.hooks,
      emotions: answers.emotions,
      age_bucket: answers.ageBucket,
      past_attempts: answers.pastAttempts,
    };
  }

  function markEmailStarted() {
    if (emailStarted) return;
    setEmailStarted(true);
    trackEmailStarted(stepMeta);
  }

  // Auto-focus the email field after a short delay so the keyboard doesn't
  // pop immediately and obscure the screen copy.
  useEffect(() => {
    if (isIos) return undefined;

    const id = setTimeout(() => inputRef.current?.focus(), 380);
    return () => clearTimeout(id);
  }, [isIos]);

  async function handleSubmit() {
    if (!isValid || loading) return;
    setLoading(true);
    setError('');
    const waitlistPayload = buildWaitlistPayload();
    const analyticsPayload = buildLeadAnalyticsPayload();

    try {
      await submitToWaitlist(waitlistPayload);
      await identifyLead({
        email: email.trim(),
        name,
        properties: analyticsPayload,
      });
      trackWaitlistSubmitted(analyticsPayload);
      set('waitlistSubmitted', true);
      next();
    } catch (submitError) {
      trackWaitlistSubmitFailed({
        ...analyticsPayload,
        error_message: submitError?.message ?? 'Unknown waitlist submit failure',
      });
      setError('Something went wrong — please try again.');
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit();
  }

  function handleAppStoreClick() {
    trackEvent('app_store_clicked', {
      step_key: stepMeta.key,
      step_index: stepMeta.index,
      destination: 'app_store',
      platform: 'ios',
    });
  }

  return (
    <ScreenContainer
      showBack={!loading}
      footer={
        <div className="ec__footer">
          {!isIos && error && (
            <p className="ec__error" role="alert">
              {error}
            </p>
          )}
          {isIos ? (
            <a
              className="btn motion-item ec__app-store-link"
              href={APP_STORE_URL}
              onClick={handleAppStoreClick}
            >
              Open in App Store →
            </a>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isValid || loading}
              style={{ width: '100%' }}
            >
              {loading ? (
                <span className="ec__spinner-wrap">
                  <Spinner /> {cleanLaunchCopy ? 'Joining waitlist…' : 'Saving your spot…'}
                </span>
              ) : (
                cleanLaunchCopy ? 'Join Early-Access Waitlist →' : 'Claim Early-Bird Spot →'
              )}
            </Button>
          )}
          <FooterNote style={{ textAlign: 'center' }}>
            {isIos ? (
              'No email needed. Continue through the App Store.'
            ) : (
              '🔒 No spam. Unsubscribe any time.'
            )}
          </FooterNote>
        </div>
      }
    >
      {/* ── Header ── */}
      <PreHead>Your plan is ready{name ? `, ${name}` : ''}.</PreHead>
      {isIos ? (
        <H1>
          Get <span className="cool">Stillscroll</span> on the App Store.
        </H1>
      ) : cleanLaunchCopy ? (
        <H1>
          Join the early-access waitlist for{' '}
          <span className="cool">Stillscroll.</span>
        </H1>
      ) : (
        <H1>
          Be first when{' '}
          <span className="cool">Stillscroll</span> launches.
        </H1>
      )}

      {/* ── Early-bird badge ── */}
      <div className="ec__badge">
        <span className="ec__badge-pill">
          {isIos ? (
            'Available now for iPhone'
          ) : cleanLaunchCopy ? (
            'Early-access app waitlist'
          ) : (
            <>
              <Stars count={5} /> Early-bird offer
            </>
          )}
        </span>
        <div className="ec__badge-row">
          <span className="ec__badge-price">
            <span className="ec__badge-new">$0<span className="ec__badge-unit">/yr</span></span>
            <span className="ec__badge-was">
              {isIos
                ? 'App Store listing'
                : cleanLaunchCopy
                  ? 'planned founding price'
                  : 'was $29.99'}
            </span>
          </span>
          <span className="ec__badge-tag">
            {isIos
              ? 'iOS'
              : cleanLaunchCopy
                ? 'Mobile app first'
                : '40% off at launch'}
          </span>
        </div>
        <p className="ec__badge-note">
          {isIos
            ? 'Install Stillscroll directly from the App Store and start from there.'
            : cleanLaunchCopy
              ? 'You will get product updates, launch timing, and first access when Stillscroll opens to early users.'
              : 'Your discount is locked in the moment you join — no strings attached.'}
        </p>
      </div>

      {/* ── Email input ── */}
      {!isIos && (
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
            onFocus={markEmailStarted}
            onChange={(e) => {
              markEmailStarted();
              set('email', e.target.value);
              if (error) setError('');
            }}
            onKeyDown={handleKeyDown}
            placeholder="you@example.com"
            aria-describedby={error ? 'ec-error' : undefined}
            disabled={loading}
          />
        </div>
      )}

      {/* ── Scarcity nudge ── */}
      <SpotCounter />
    </ScreenContainer>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SpotCounter() {
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
