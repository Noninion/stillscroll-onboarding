import { useEffect, useState } from 'react';
import {
  ScreenContainer,
  H1,
  Body,
  Stars,
  Chip,
  ChipRow,
} from '../components/ui.jsx';
import { useOnboarding } from '../state/onboarding.jsx';
import { shortGoalLabel } from '../state/options.js';
import {
  getLifetimeReclaimedYears,
  getSavedHoursPerDay,
} from '../state/usageMath.js';
import './WaitlistConfirmation.css';

export default function WaitlistConfirmation() {
  const { answers } = useOnboarding();
  const name = answers.name.trim();
  const email = answers.email.trim();
  const saved = getSavedHoursPerDay(answers.currentHours, answers.targetHours);
  const lifetimeGain = getLifetimeReclaimedYears(
    answers.currentHours,
    answers.targetHours,
  );

  return (
    <ScreenContainer showHeader={false} scroll>
      <div className="wc">
        {/* ── Animated check ── */}
        <AnimatedCheck />

        {/* ── Headline ── */}
        <div className="wc__hero">
          <H1>
            You&apos;re in{name ? `, ${name}` : ''}!{' '}
            <span className="cool">🎉</span>
          </H1>
          {email && (
            <p className="wc__email-confirm">
              We&apos;ll reach out to{' '}
              <strong>{email}</strong> the moment Stillscroll launches.
            </p>
          )}
        </div>

        {/* ── Discount badge ── */}
        <div className="wc__discount">
          <div className="wc__discount-header">
            <Stars count={5} />
            <span className="wc__discount-label">Early-bird discount — locked in</span>
          </div>
          <div className="wc__discount-body">
            <span className="wc__discount-price">
              $17.99<span className="wc__discount-unit">/yr</span>
            </span>
            <div className="wc__discount-detail">
              <span className="wc__discount-pill">40% off</span>
              <span className="wc__discount-orig">normally $29.99/yr</span>
            </div>
          </div>
          <p className="wc__discount-note">
            This price is yours at launch. No action needed.
          </p>
        </div>

        {/* ── Plan snapshot ── */}
        {(answers.goals.length > 0 || lifetimeGain > 0) && (
          <div className="wc__plan">
            <span className="wc__plan-title">Your plan</span>
            {answers.goals.length > 0 && (
              <ChipRow>
                {answers.goals.map((g) => (
                  <Chip key={g} tone="cool">
                    {shortGoalLabel(g)}
                  </Chip>
                ))}
              </ChipRow>
            )}
            {saved > 0 && (
              <div className="wc__plan-stat">
                <span className="wc__plan-stat-value cool">
                  {lifetimeGain}+ yr{lifetimeGain !== 1 ? 's' : ''}
                </span>
                <span className="wc__plan-stat-label">
                  reclaimed over a lifetime
                </span>
              </div>
            )}
          </div>
        )}

        {/* ── Social proof ── */}
        <SpotProgress />

        {/* ── Closing copy ── */}
        <div className="wc__closing">
          <Body>
            Stillscroll is launching soon. Until then, take a breath —
            you&apos;ve already made the decision that matters.
          </Body>
        </div>
      </div>
    </ScreenContainer>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function AnimatedCheck() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(id);
  }, []);
  return (
    <div className={`wc__check${visible ? ' wc__check--in' : ''}`} aria-hidden="true">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle
          cx="32"
          cy="32"
          r="30"
          stroke="var(--cool)"
          strokeWidth="2"
          fill="var(--cool-soft)"
        />
        <path
          className="wc__check-path"
          d="M18 32 L27 41 L46 22"
          stroke="var(--cool-strong)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

function SpotProgress() {
  const CLAIMED = 584; // one more than EmailCapture shows (this user claimed one)
  const TOTAL = 1000;
  const pct = Math.round((CLAIMED / TOTAL) * 100);

  return (
    <div className="wc__spots">
      <div className="wc__spots-header">
        <span>Early-bird spots</span>
        <span>
          <strong>{CLAIMED}</strong> / {TOTAL} claimed
        </span>
      </div>
      <div className="wc__spots-track">
        <div className="wc__spots-fill" style={{ '--pct': `${pct}%` }} />
      </div>
    </div>
  );
}
