import {
  Button,
  ScreenContainer,
  H1,
  Sub,
  Stars,
} from '../components/ui.jsx';
import { useOnboarding } from '../state/onboarding.jsx';

// Honest "research report" copy for every option on the PastAttempts screen.
// Keep keys 1:1 with PAST_OPTIONS in src/state/options.js — except 'nothing'
// which is handled as a special case below.
const CARDS = {
  limiters: {
    title: 'Screen time limiters',
    rating: 2,
    note: "Most people tap 'Ignore Limit' within a week. They show usage but don't change the impulse to pick up.",
  },
  uninstall: {
    title: 'Uninstalling addictive apps',
    rating: 3,
    note: "Buys a few days of relief. The apps come back when you're bored or out late — and the underlying habit is still there.",
  },
  browser_only: {
    title: 'Browser-only version',
    rating: 3,
    note: 'Cuts down a bit since the experience is worse. But the most addictive apps work well enough in mobile browsers.',
  },
  detox: {
    title: 'Digital detox',
    rating: 4,
    note: 'Short breaks feel good. Staying off long-term is hard — relapse is common.',
  },
  grayscale: {
    title: 'Grayscale mode',
    rating: 2,
    note: 'The principle is real, but inconsistent — and it makes useful apps and text harder to read.',
  },
  mindset: {
    title: 'Working on mindset',
    rating: 2,
    note: "Willpower matters, but it's not a fair fight against companies designing for your attention. Tools help more than pep talks.",
  },
  out_of_reach: {
    title: 'Keeping phone out of reach',
    rating: 3,
    note: 'Distance helps. But the phone is also your camera, map, alarm — eventually you reach for it and the friction is gone.',
  },
  dumb_phone: {
    title: 'Buying a dumb phone',
    rating: 4,
    note: 'Brilliant if it fits your life. Most people end up needing smartphone apps for work, family, or navigation.',
  },
  routines: {
    title: 'Morning / night routines',
    rating: 3,
    note: 'Bookends matter. The other 14 hours of the day are still wide open.',
  },
  meditation: {
    title: 'Meditation apps (used briefly)',
    rating: 3,
    note: "Practicing helps. But the practice doesn't show up at the moment you'd actually scroll. You still pick up the phone first.",
  },
  nfc: {
    title: 'NFC tag to block apps',
    rating: 3,
    note: 'Clever. But it relies on you remembering to tap, and most people give up the routine after a few weeks.',
  },
};

// When the user picked little or nothing, we pad with these in order so the
// page still feels like a substantive report.  Order = most commonly tried.
const FALLBACK_ORDER = ['detox', 'meditation', 'limiters', 'mindset'];

const TARGET_TOTAL = 4;

export default function WhyFailed() {
  const { answers, next } = useOnboarding();

  const onlyNothing =
    answers.pastAttempts.length === 1 &&
    answers.pastAttempts[0] === 'nothing';

  // Selected, in the order the user picked them, minus the "nothing" sentinel.
  const picked = answers.pastAttempts.filter((v) => v !== 'nothing' && CARDS[v]);

  // Pad with curated extras up to TARGET_TOTAL.
  const extras = FALLBACK_ORDER.filter((v) => !picked.includes(v)).slice(
    0,
    Math.max(0, TARGET_TOTAL - picked.length),
  );

  // Header copy differs depending on whether they tried anything.
  const head = onlyNothing
    ? {
        h1: "No judgement — most people don't know where to start.",
        sub: "Here's an honest report on the methods people usually try first:",
      }
    : {
        h1: 'Big respect for trying these.',
        sub: "Here's the honest report — yours first, then a few common others.",
      };

  return (
    <ScreenContainer
      scroll
      footer={<Button onClick={next}>See how StillScroll works</Button>}
    >
      <Stars />
      <H1>{head.h1}</H1>
      <Sub>{head.sub}</Sub>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--s-3)',
          marginTop: 'var(--s-2)',
        }}
      >
        {/* Picked items first */}
        {picked.map((key) => (
          <RatedCard key={key} {...CARDS[key]} highlight />
        ))}

        {/* Separator + extras if we need to pad */}
        {extras.length > 0 && (
          <>
            {picked.length > 0 && <SectionLabel>Other methods</SectionLabel>}
            {extras.map((key) => (
              <RatedCard key={key} {...CARDS[key]} />
            ))}
          </>
        )}
      </div>
    </ScreenContainer>
  );
}

function SectionLabel({ children }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--s-3)',
        margin: 'var(--s-3) 0 var(--s-1)',
      }}
      role="separator"
      aria-label={String(children)}
    >
      <span
        aria-hidden="true"
        style={{
          flex: '1 1 auto',
          height: 1,
          background: 'var(--border)',
        }}
      />
      <span
        style={{
          fontSize: 11,
          letterSpacing: 0.12,
          textTransform: 'uppercase',
          color: 'var(--ink-mute)',
        }}
      >
        {children}
      </span>
      <span
        aria-hidden="true"
        style={{
          flex: '1 1 auto',
          height: 1,
          background: 'var(--border)',
        }}
      />
    </div>
  );
}

function RatedCard({ title, rating, note, highlight = false }) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: `1px solid ${highlight ? 'var(--cool-line)' : 'var(--border)'}`,
        borderRadius: 'var(--r-md)',
        padding: 'var(--s-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--s-3)',
        }}
      >
        <span style={{ fontWeight: 600, color: 'var(--ink)', fontSize: 15 }}>
          {title}
        </span>
        <Stars count={rating} />
      </div>
      <p
        style={{
          fontSize: 13,
          color: 'var(--ink-dim)',
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        {note}
      </p>
    </div>
  );
}
