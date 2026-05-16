import {
  Button,
  ScreenContainer,
  H1,
  Sub,
  Stars,
} from '../components/ui.jsx';
import { useOnboarding } from '../state/onboarding.jsx';

const CARDS = [
  {
    title: 'Digital detox',
    rating: 4,
    note: 'Short breaks feel good. Staying off long-term is hard — relapse is common.',
  },
  {
    title: 'Grayscale',
    rating: 2,
    note: 'The principle is real, but inconsistent — and it makes useful apps and text harder to read.',
  },
  {
    title: 'Meditation apps',
    rating: 3,
    note: "Practicing helps. But the practice doesn't show up at the moment you'd actually scroll. You still pick up the phone first.",
  },
  {
    title: 'Discipline / mindset',
    rating: 2,
    note: "Willpower matters, but it's not a fair fight against companies designing for your attention. Tools help more than pep talks.",
  },
];

export default function WhyFailed() {
  const { next } = useOnboarding();
  return (
    <ScreenContainer
      scroll
      footer={<Button onClick={next}>See how Stillscroll works</Button>}
    >
      <Stars />
      <H1>Big respect for tackling something tough.</H1>
      <Sub>Here's what the research says about each:</Sub>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--s-3)',
          marginTop: 'var(--s-2)',
        }}
      >
        {CARDS.map((c) => (
          <RatedCard key={c.title} {...c} />
        ))}
      </div>
    </ScreenContainer>
  );
}

function RatedCard({ title, rating, note }) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
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
