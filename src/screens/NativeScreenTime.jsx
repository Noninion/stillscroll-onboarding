import { Button, ScreenContainer, Body } from '../components/ui.jsx';
import { useOnboarding } from '../state/onboarding.jsx';

export default function NativeScreenTime() {
  const { set, next } = useOnboarding();
  function allow() {
    set('screenTimePermission', true);
    next();
  }
  function deny() {
    set('screenTimePermission', false);
    next();
  }
  return (
    <ScreenContainer showHeader={false} showProgress={false}>
      <div
        style={{
          flex: '1 1 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--s-4)',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 300,
            background: '#1c2030',
            borderRadius: 16,
            padding: 'var(--s-5)',
            textAlign: 'center',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 8 }}>
            "StillScroll" Would Like to Access Screen Time
          </div>
          <Body>
            This lets StillScroll see which apps you use and apply your
            blocking rules.
          </Body>
          <div
            style={{
              marginTop: 'var(--s-4)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
            }}
          >
            <Button variant="ghost" onClick={deny}>
              Don't Allow
            </Button>
            <Button onClick={allow}>Continue</Button>
          </div>
          <p
            style={{
              marginTop: 'var(--s-3)',
              fontSize: 11,
              color: 'var(--ink-mute)',
            }}
          >
            iOS-controlled in the real app
          </p>
        </div>
      </div>
    </ScreenContainer>
  );
}
