import {
  Button,
  ScreenContainer,
  H1,
  Sub,
} from '../components/ui.jsx';
import { useOnboarding } from '../state/onboarding.jsx';

const PRACTICES = [
  { key: 'box',  label: 'Box breathing' },
  { key: '478',  label: '4-7-8 breath' },
  { key: 'body', label: 'One-minute body scan' },
];

export default function PracticeCTA() {
  const { next } = useOnboarding();
  return (
    <ScreenContainer
      footer={
        <Button variant="text" onClick={next}>
          Try Later
        </Button>
      }
    >
      <H1>Try a practice.</H1>
      <Sub>Or skip — you can come back later.</Sub>

      <div
        style={{
          marginTop: 'var(--s-2)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--s-2)',
          color: 'var(--ink-dim)',
          fontSize: 13,
        }}
      >
        <Hourglass /> Earn your first minutes.
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--s-2)',
          marginTop: 'var(--s-3)',
        }}
      >
        {PRACTICES.map((p) => (
          <PracticeCard key={p.key} label={p.label} onClick={next} />
        ))}
      </div>

      <p
        style={{
          marginTop: 'auto',
          fontSize: 12,
          color: 'var(--ink-mute)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Shield /> Audio stays on your device.
      </p>
    </ScreenContainer>
  );
}

function PracticeCard({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--s-4) var(--s-5)',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-md)',
        color: 'var(--ink)',
        fontSize: 16,
        textAlign: 'left',
      }}
    >
      <span>{label}</span>
      <span style={{ color: 'var(--ink-mute)', fontSize: 20 }}>›</span>
    </button>
  );
}

function Hourglass() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path
        d="M3 2h8M3 12h8M4 2v2c0 1.5 1 2.5 3 3 2-.5 3-1.5 3-3V2M4 12v-2c0-1.5 1-2.5 3-3 2 .5 3 1.5 3 3v2"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Shield() {
  return (
    <svg width="13" height="14" viewBox="0 0 13 14" aria-hidden="true">
      <path
        d="M6.5 1.2L1.5 3v4c0 3 2 5 5 6 3-1 5-3 5-6V3l-5-1.8z"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}
