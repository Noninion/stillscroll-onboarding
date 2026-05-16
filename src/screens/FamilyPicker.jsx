import {
  Button,
  ScreenContainer,
  H1,
  Sub,
  AppIcon,
} from '../components/ui.jsx';
import { useOnboarding } from '../state/onboarding.jsx';
import { APP_OPTIONS } from '../state/options.js';

export default function FamilyPicker() {
  const { answers, set, next } = useOnboarding();
  const preselected = new Set(answers.distractingApps);

  function done() {
    set('familyControlsSelection', Array.from(preselected));
    next();
  }

  return (
    <ScreenContainer showHeader={false} footer={<Button onClick={done}>Done</Button>}>
      <H1>Choose Apps</H1>
      <Sub>iOS-controlled picker in the real app — preview shown.</Sub>

      <div
        style={{
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--s-2)',
          marginTop: 'var(--s-2)',
        }}
      >
        {APP_OPTIONS.map((a) => {
          const checked = preselected.has(a.value);
          return (
            <div
              key={a.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--s-3)',
                padding: 'var(--s-3) var(--s-4)',
                background: 'var(--surface)',
                border: `1px solid ${checked ? 'var(--cool-line)' : 'var(--border)'}`,
                borderRadius: 'var(--r-md)',
                color: 'var(--ink)',
                fontSize: 15,
              }}
            >
              <AppIcon app={a} />
              <span style={{ flex: 1 }}>{a.label}</span>
              <span
                style={{
                  color: checked ? 'var(--cool-strong)' : 'var(--ink-mute)',
                  fontSize: 18,
                }}
              >
                {checked ? '✓' : ' '}
              </span>
            </div>
          );
        })}
      </div>
    </ScreenContainer>
  );
}
