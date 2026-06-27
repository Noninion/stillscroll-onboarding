import {
  Button,
  ScreenContainer,
  H1,
  Sub,
  FooterNote,
} from '../components/ui.jsx';
import { useOnboarding } from '../state/onboarding.jsx';

export default function PreScreenTime() {
  const { next } = useOnboarding();
  return (
    <ScreenContainer footer={<Button onClick={next}>Continue</Button>}>
      <H1>Connect StillScroll to Screen Time, securely.</H1>
      <Sub>
        To know which apps you're using, StillScroll needs your permission.
      </Sub>

      <div
        style={{
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--s-3)',
        }}
      >
        <SystemDialogMock />
        <Arrow />
      </div>

      <FooterNote>
        Your data is protected by Apple and never leaves your device.
      </FooterNote>
    </ScreenContainer>
  );
}

function SystemDialogMock() {
  return (
    <div
      style={{
        width: 240,
        background: 'rgba(40, 44, 56, 0.95)',
        border: '1px solid var(--cool-line)',
        borderRadius: 14,
        boxShadow: '0 0 0 4px rgba(58, 163, 163, 0.18)',
        padding: 'var(--s-4)',
        textAlign: 'center',
        color: 'var(--ink)',
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 600 }}>
        Allow "StillScroll" to access Screen Time?
      </div>
      <div
        style={{
          fontSize: 11,
          color: 'var(--ink-dim)',
          marginTop: 4,
          marginBottom: 14,
        }}
      >
        StillScroll will be able to see app usage and apply limits.
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <span
          style={{
            flex: 1,
            padding: '6px 10px',
            borderRadius: 8,
            background: 'rgba(255,255,255,0.06)',
            fontSize: 12,
            color: 'var(--ink-dim)',
          }}
        >
          Don't Allow
        </span>
        <span
          style={{
            flex: 1,
            padding: '6px 10px',
            borderRadius: 8,
            background: 'var(--cool)',
            color: '#06121a',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Continue
        </span>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <svg width="24" height="36" viewBox="0 0 24 36" aria-hidden="true">
      <path
        d="M12 32V8M5 16l7-8 7 8"
        stroke="var(--cool-strong)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
