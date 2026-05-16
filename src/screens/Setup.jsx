import {
  Button,
  ScreenContainer,
  H1,
  Body,
} from '../components/ui.jsx';
import { useOnboarding } from '../state/onboarding.jsx';

export default function Setup() {
  const { next } = useOnboarding();
  return (
    <ScreenContainer footer={<Button onClick={next}>Begin</Button>}>
      <div
        style={{
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--s-6)',
          alignItems: 'center',
          textAlign: 'center',
          justifyContent: 'center',
        }}
      >
        <Figure />
        <H1>Sit somewhere you won't be interrupted.</H1>
        <Body>Phone can stay in your hand. Headphones are optional.</Body>
      </div>
    </ScreenContainer>
  );
}

function Figure() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" aria-hidden="true">
      <circle cx="80" cy="80" r="72" stroke="var(--cool-line)" strokeWidth="1" fill="none" />
      <circle cx="80" cy="62" r="11" fill="var(--ink-dim)" />
      {/* torso */}
      <path
        d="M60 100 Q80 86 100 100 L100 112 Q80 122 60 112 Z"
        fill="var(--ink-dim)"
        opacity="0.85"
      />
      {/* arm + small phone */}
      <rect x="98" y="106" width="14" height="22" rx="3" fill="var(--warm-soft)" stroke="var(--warm-line)" />
      {/* legs crossed */}
      <path
        d="M52 116 Q80 130 108 116"
        stroke="var(--ink-dim)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
