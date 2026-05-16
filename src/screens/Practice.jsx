import { useEffect, useState } from 'react';
import {
  Button,
  ScreenContainer,
  Body,
} from '../components/ui.jsx';
import { useOnboarding } from '../state/onboarding.jsx';
import './Practice.css';

// Box breathing: inhale 4s, hold 4s, exhale 4s, hold 4s — 4 rounds.
const PHASES = [
  { key: 'inhale',   label: 'Inhale',  scale: 1.0,  ms: 4000 },
  { key: 'hold_in',  label: 'Hold',    scale: 1.0,  ms: 4000 },
  { key: 'exhale',   label: 'Exhale',  scale: 0.55, ms: 4000 },
  { key: 'hold_out', label: 'Hold',    scale: 0.55, ms: 4000 },
];
const TOTAL_ROUNDS = 4;
const EARNED_MINUTES = 5;

export default function Practice() {
  const { next } = useOnboarding();
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [round, setRound] = useState(1);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const phase = PHASES[phaseIdx];
    const id = setTimeout(() => {
      const nextIdx = (phaseIdx + 1) % PHASES.length;
      if (nextIdx === 0) {
        // Completed a round.
        if (round >= TOTAL_ROUNDS) {
          setDone(true);
          return;
        }
        setRound((r) => r + 1);
      }
      setPhaseIdx(nextIdx);
    }, phase.ms);
    return () => clearTimeout(id);
  }, [phaseIdx, round, done]);

  if (done) {
    return (
      <ScreenContainer footer={<Button onClick={next}>Continue</Button>}>
        <div
          style={{
            flex: '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 'var(--s-5)',
          }}
        >
          <div className="practice__toast">
            <span style={{ fontSize: 13, color: 'var(--ink-dim)' }}>
              You earned
            </span>
            <span className="practice__toast-num">{EARNED_MINUTES} minutes</span>
            <Body>Spend them when you choose.</Body>
          </div>
        </div>
      </ScreenContainer>
    );
  }

  const phase = PHASES[phaseIdx];

  return (
    <ScreenContainer
      showBack={false}
      footer={
        <Button variant="text" onClick={next}>
          Skip
        </Button>
      }
    >
      <div className="practice">
        <p className="practice__title">Box Breathing</p>
        <p className="practice__counter">
          Round {round} of {TOTAL_ROUNDS}
        </p>

        <div
          className="bc"
          style={{ '--bc-scale': phase.scale }}
          aria-live="polite"
        >
          <span className="bc__ring" />
          <span className="bc__core" />
          <span className="bc__label">{phase.label}</span>
        </div>
      </div>
    </ScreenContainer>
  );
}
