import { useEffect, useState } from 'react';
import {
  Button,
  ScreenContainer,
  H2,
  Body,
} from '../components/ui.jsx';
import { useOnboarding } from '../state/onboarding.jsx';

export default function Mechanic() {
  const { next } = useOnboarding();
  const [beat, setBeat] = useState(0);

  function handleNext() {
    if (beat === 0) setBeat(1);
    else next();
  }
  function handleBack() {
    if (beat === 1) setBeat(0);
  }

  return (
    <ScreenContainer
      tone={beat === 0 ? 'cool' : 'warm'}
      section="How it works"
      onBack={beat === 1 ? handleBack : undefined}
      footer={<Button onClick={handleNext}>Continue</Button>}
    >
      {beat === 0 ? <BreatheBeat /> : <ScrollBeat />}
    </ScreenContainer>
  );
}

// Layout for both beats: the descriptive text sits at the top (just under
// the "HOW IT WORKS" eyebrow), and the visual + counter + action label
// are centered in the remaining space below it.
const beatStyles = {
  intro: { textAlign: 'center', padding: '0 var(--s-2)' },
  group: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: 'var(--s-6)',
    justifyContent: 'center',
  },
};

function BreatheBeat() {
  return (
    <>
      <div style={beatStyles.intro}>
        <Body>In Stillscroll, you earn screen time with a breath.</Body>
      </div>
      <div style={beatStyles.group}>
        <PulseCircle />
        <Counter from={1} to={3} unit="min" tone="cool" />
        <H2>
          <span className="cool">Breathe</span>
        </H2>
      </div>
    </>
  );
}

function ScrollBeat() {
  return (
    <>
      <div style={beatStyles.intro}>
        <Body>Spend the time you earned, when you choose.</Body>
      </div>
      <div style={beatStyles.group}>
        <PhoneHand />
        <Counter from={9} to={4} unit="min" tone="warm" />
        <H2>
          <span className="warm">Scroll</span>
        </H2>
      </div>
    </>
  );
}

function Counter({ from, to, unit, tone }) {
  const [value, setValue] = useState(from);
  useEffect(() => {
    const start = performance.now();
    const dur = 1200;
    let raf;
    function tick(t) {
      const p = Math.min(1, (t - start) / dur);
      const v = Math.round(from + (to - from) * easeOut(p));
      setValue(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [from, to]);
  return (
    <span
      className={tone === 'warm' ? 'warm' : 'cool'}
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: 44,
        fontWeight: 700,
        letterSpacing: '-0.02em',
      }}
    >
      {value} {unit}
    </span>
  );
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

function PulseCircle() {
  return (
    <div
      aria-hidden="true"
      style={{
        width: 130,
        height: 130,
        borderRadius: '50%',
        border: '1.5px solid var(--cool-line)',
        background: 'var(--cool-soft)',
        animation: 'breathe 5s ease-in-out infinite',
      }}
    />
  );
}

function PhoneHand() {
  return (
    <svg
      width="120"
      height="130"
      viewBox="0 0 120 130"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="36"
        y="14"
        width="56"
        height="98"
        rx="12"
        stroke="var(--warm-line)"
        strokeWidth="1.5"
        fill="var(--warm-soft)"
      />
      <rect
        x="42"
        y="24"
        width="44"
        height="68"
        rx="4"
        fill="var(--warm-strong)"
        opacity="0.18"
      />
      <path
        d="M30 70 Q22 84 30 100 L96 116 Q108 110 108 96 L96 86"
        stroke="var(--warm-strong)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
