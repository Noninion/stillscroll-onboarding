import { useEffect } from 'react';
import { ScreenContainer, Body } from '../components/ui.jsx';
import { useOnboarding } from '../state/onboarding.jsx';

export default function ConfirmScreenTime() {
  const { answers, next } = useOnboarding();
  const allowed = answers.screenTimePermission === true;

  useEffect(() => {
    const id = setTimeout(next, 1400);
    return () => clearTimeout(id);
  }, [next]);

  return (
    <ScreenContainer showHeader={false}>
      <div
        style={{
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--s-4)',
          textAlign: 'center',
        }}
      >
        <Tick allowed={allowed} />
        <Body>
          {allowed
            ? 'Screen Time connected.'
            : 'Skipped. You can grant access later.'}
        </Body>
      </div>
    </ScreenContainer>
  );
}

function Tick({ allowed }) {
  return (
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        background: allowed ? 'var(--cool-soft)' : 'var(--surface)',
        border: `1px solid ${allowed ? 'var(--cool-line)' : 'var(--border)'}`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: allowed ? 'var(--cool-strong)' : 'var(--ink-mute)',
        fontSize: 28,
      }}
      aria-hidden="true"
    >
      {allowed ? '✓' : '—'}
    </div>
  );
}
