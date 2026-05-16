import { useState } from 'react';
import {
  Button,
  ScreenContainer,
  H1,
  FooterNote,
} from '../components/ui.jsx';
import { useOnboarding } from '../state/onboarding.jsx';

const CARDS = [
  {
    key: 'replace',
    title: 'Replace scrolling with a breath.',
    mock: <InterventionMock />,
  },
  {
    key: 'block',
    title: 'Block all of your biggest distractions.',
    mock: <LockedHome />,
  },
  {
    key: 'library',
    title: 'A pocket-sized practice library.',
    mock: <LibraryMock />,
  },
  {
    key: 'still',
    title: 'Replace Doomscrolling with Stillness.',
    mock: <BreathMock />,
  },
];

export default function Sales() {
  const { next } = useOnboarding();
  const [idx, setIdx] = useState(0);
  const card = CARDS[idx];

  function advance() {
    if (idx < CARDS.length - 1) setIdx(idx + 1);
    else next();
  }
  function back() {
    if (idx > 0) setIdx(idx - 1);
  }

  return (
    <ScreenContainer
      showHeader
      onBack={idx > 0 ? back : undefined}
      footer={
        <>
          <FooterNote>✓ No commitment — cancel anytime.</FooterNote>
          <Button onClick={advance}>Next</Button>
        </>
      }
    >
      <div
        style={{
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--s-5)',
          textAlign: 'center',
        }}
      >
        {card.mock}
        <H1>{card.title}</H1>
        <Dots count={CARDS.length} active={idx} />
      </div>
    </ScreenContainer>
  );
}

function Dots({ count, active }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background:
              i === active ? 'var(--cool)' : 'rgba(255,255,255,0.18)',
          }}
        />
      ))}
    </div>
  );
}

function InterventionMock() {
  return (
    <div
      style={{
        width: 180,
        padding: 'var(--s-5)',
        background: 'var(--surface)',
        border: '1px solid var(--warm-line)',
        borderRadius: 'var(--r-md)',
        textAlign: 'center',
        color: 'var(--ink)',
      }}
    >
      <div style={{ fontSize: 13, color: 'var(--warm-strong)', fontWeight: 600 }}>
        Instagram is paused.
      </div>
      <div style={{ fontSize: 12, color: 'var(--ink-dim)', marginTop: 4 }}>
        One minute of breath to continue.
      </div>
    </div>
  );
}

function LockedHome() {
  const tiles = ['IG', 'TT', 'YT', 'FB', 'X', 'R'];
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 10,
        width: 180,
      }}
    >
      {tiles.map((t) => (
        <div
          key={t}
          style={{
            aspectRatio: '1',
            background: 'var(--surface)',
            border: '1px solid var(--warm-line)',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--warm-strong)',
            fontSize: 12,
            opacity: 0.6,
          }}
        >
          {t}
        </div>
      ))}
    </div>
  );
}

function LibraryMock() {
  const items = ['Box Breathing', '4-7-8', 'One-Minute', 'Body Scan', '5-Senses'];
  return (
    <div
      style={{
        width: 200,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      {items.map((i) => (
        <div
          key={i}
          style={{
            padding: '8px 12px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            fontSize: 13,
            color: 'var(--ink)',
            textAlign: 'left',
          }}
        >
          {i}
        </div>
      ))}
    </div>
  );
}

function BreathMock() {
  return (
    <div
      style={{
        width: 140,
        height: 140,
        borderRadius: '50%',
        border: '1.5px solid var(--cool-line)',
        background: 'var(--cool-soft)',
        animation: 'breathe 5s ease-in-out infinite',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--cool-strong)',
        fontSize: 13,
      }}
    >
      breathe
    </div>
  );
}
