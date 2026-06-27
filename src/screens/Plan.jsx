import {
  Button,
  ScreenContainer,
  H1,
  Chip,
  ChipRow,
  Stars,
} from '../components/ui.jsx';
import { useOnboarding } from '../state/onboarding.jsx';
import { shortGoalLabel } from '../state/options.js';
import { getYearlySavedDays } from '../state/usageMath.js';
import { FEATURE_FLAGS } from '../config/features.js';
import './Plan.css';

const FEATURES = [
  'Breath-Based Unlocking',
  'App Blocking',
  'Screen Time Budget',
  'Practice Streaks',
  'Library Access',
  'Adaptive Practice Length',
];

const TIMELINE = [
  { day: 'Day 0', title: 'First breath', note: 'Earn your first minutes.', check: true },
  { day: 'Day 1', title: 'Pause before pickup', note: 'The app waits for you.' },
  { day: 'Day 2', title: 'Urge ride-out', note: '60 seconds of breath defuses most cravings.' },
  { day: 'Day 3', title: 'Clearer focus', note: 'Less reactivity, more deliberateness.' },
  { day: 'Mid-week', title: 'Checkpoint', note: "You're not in a tug-of-war with your phone anymore.", highlight: true },
  { day: 'Day 4', title: 'Calmer evenings', note: 'Sleep starts earlier.' },
  { day: 'Day 5', title: 'Screen time drops', note: "The minutes you didn't spend, you got back." },
  { day: 'Day 6', title: 'Stronger choice', note: 'Open apps with intention.' },
  { day: 'Day 7', title: 'New reflex', note: 'The breath becomes the new pickup habit.' },
  { day: 'End of Week 1', title: 'Steady', note: 'Repeat.', highlight: true },
];

export default function Plan() {
  const { answers, next } = useOnboarding();
  const yearlySavedDays = getYearlySavedDays(
    answers.currentHours,
    answers.targetHours,
  );
  const target = new Date();
  target.setDate(target.getDate() + 7);
  const targetStr = target.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  return (
    <>
      <ScreenContainer scroll showHeader={false}>
        <div className="plan">
          <header className="plan__hero">
            <Stars />
            {!FEATURE_FLAGS.cleanLaunchCopy && (
              <span style={{ fontSize: 13, color: 'var(--ink-dim)' }}>
                4.7 rating
              </span>
            )}
            <H1 lg>
              Your nervous system has work to do.
              <br />
              <span className="cool">Let's start.</span>
            </H1>
          </header>

          <Section title="Projection">
            <div className="plan__card">
              <Projection
                currentH={answers.currentHours}
                targetH={answers.targetHours}
              />
              <Chip tone="cool">
                {FEATURE_FLAGS.cleanLaunchCopy
                  ? `First checkpoint: ${targetStr}`
                  : `You'll feel differences by: ${targetStr}`}
              </Chip>
            </div>
          </Section>

          <Section title="Outcomes">
            <div className="plan__bullets">
              <Bullet icon="◉">Practice every day or more</Bullet>
              <Bullet icon="◇">Healthier coping than scrolling</Bullet>
              <Bullet icon="∿">
                {FEATURE_FLAGS.cleanLaunchCopy
                  ? 'Make pickup urges less automatic'
                  : 'Feel 30% calmer'}
              </Bullet>
              <Bullet icon="⏳">
                Save <span className="cool">{yearlySavedDays} days</span> this year
              </Bullet>
            </div>
          </Section>

          <Section title="Before · After">
            <div className="plan__card">
              <BeforeAfter
                currentH={answers.currentHours}
                targetH={answers.targetHours}
              />
            </div>
          </Section>

          <Section title="7-Day Journey">
            <div className="plan__timeline">
              {TIMELINE.map((d) => (
                <div
                  key={d.day + d.title}
                  className={`plan__day${d.check ? ' plan__day--check' : ''}${d.highlight ? ' plan__day--highlight' : ''}`}
                >
                  <div className="plan__day-title">
                    {d.check ? '✓ ' : ''}
                    {d.day}: {d.title}
                  </div>
                  <div className="plan__day-note">{d.note}</div>
                </div>
              ))}
            </div>
          </Section>

          {answers.goals.length > 0 && (
            <Section title="Goals set">
              <ChipRow>
                {answers.goals.map((g) => (
                  <Chip key={g} tone="cool">
                    {shortGoalLabel(g)}
                  </Chip>
                ))}
              </ChipRow>
            </Section>
          )}

          <Section title="Unlock">
            <div className="plan__grid">
              {FEATURES.map((f) => (
                <div key={f} className="plan__feature">
                  {f}
                </div>
              ))}
            </div>
          </Section>

          <footer
            style={{
              textAlign: 'center',
              padding: 'var(--s-4) 0',
              color: 'var(--ink-dim)',
              fontSize: 13,
            }}
          >
            {FEATURE_FLAGS.cleanLaunchCopy ? (
              'Join the early-access waitlist for Stillscroll'
            ) : (
              <>
                <Stars /> Join 1M+ people learning to pause
              </>
            )}
          </footer>
        </div>
      </ScreenContainer>
      <div className="plan__sticky">
        <Button onClick={next}>Join Stillscroll</Button>
      </div>
    </>
  );
}

function Section({ title, children }) {
  return (
    <section className="plan__section">
      <span className="plan__section-title">{title}</span>
      {children}
    </section>
  );
}

function Bullet({ icon, children }) {
  return (
    <div className="plan__bullet">
      <span className="plan__bullet-icon" aria-hidden="true">
        {icon}
      </span>
      <span>{children}</span>
    </div>
  );
}

function Projection({ currentH, targetH }) {
  // Two curves over Day 0 → Day 30.
  // Stillscroll: smooth descent currentH → targetH.
  // Conventional: oscillates and rises.
  const days = 30;
  const w = 280;
  const h = 100;
  const xs = Array.from({ length: days + 1 }, (_, i) => (i / days) * w);

  const still = xs.map((x, i) => {
    const p = i / days;
    const y = currentH + (targetH - currentH) * easeOut(p);
    return [x, mapY(y, currentH + 1)];
  });
  const conv = xs.map((x, i) => {
    const p = i / days;
    const wave = Math.sin(p * Math.PI * 3) * 0.6;
    const drift = currentH * (1 + p * 0.15);
    const y = drift + wave;
    return [x, mapY(y, currentH + 1)];
  });

  function mapY(v, scaleMax) {
    return h - (v / scaleMax) * h;
  }
  function toPath(pts) {
    return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  }
  function easeOut(t) {
    return 1 - Math.pow(1 - t, 2);
  }

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} aria-hidden="true">
      <path d={toPath(conv)} stroke="var(--warm-strong)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d={toPath(still)} stroke="var(--cool-strong)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <text x="2" y="14" fontSize="10" fill="var(--ink-mute)">{currentH}h</text>
      <text x="2" y={h - 4} fontSize="10" fill="var(--ink-mute)">{targetH}h</text>
      <text x={w - 30} y={h - 4} fontSize="10" fill="var(--ink-mute)">Day 30</text>
    </svg>
  );
}

function BeforeAfter({ currentH, targetH }) {
  const max = Math.max(currentH, targetH, 1);
  return (
    <div className="plan__bars">
      <div className="plan__bar">
        <span className="plan__bar-value">{currentH}h</span>
        <div
          className="plan__bar-fill"
          style={{
            background: 'var(--warm-soft)',
            border: '1px solid var(--warm-line)',
            height: `${(currentH / max) * 100}%`,
          }}
        />
        <span className="plan__bar-label">Before</span>
      </div>
      <div className="plan__bar">
        <span className="plan__bar-value">{targetH}h</span>
        <div
          className="plan__bar-fill"
          style={{
            background: 'var(--cool-soft)',
            border: '1px solid var(--cool-line)',
            height: `${(targetH / max) * 100}%`,
          }}
        />
        <span className="plan__bar-label">After</span>
      </div>
    </div>
  );
}
