import {
  Button,
  ScreenContainer,
  H1,
  Sub,
  PreHead,
  AppIcon,
} from '../components/ui.jsx';
import { useOnboarding } from '../state/onboarding.jsx';
import { APP_OPTIONS, appFor } from '../state/options.js';

// A small constellation: prefer the user's chosen apps, then fill with
// generic ones so the cluster looks full even when the user picked only one.
function pickConstellation(selected) {
  const chosen = selected.map(appFor).filter(Boolean);
  const fill = APP_OPTIONS.filter((a) => !selected.includes(a.value)).slice(
    0,
    Math.max(0, 6 - chosen.length),
  );
  return [...chosen, ...fill];
}

export default function AppsIntro() {
  const { answers, next } = useOnboarding();
  const apps = pickConstellation(answers.distractingApps);
  return (
    <ScreenContainer footer={<Button onClick={next}>Select Apps</Button>}>
      <PreHead>Let's set up Stillscroll.</PreHead>
      <H1>Choose the apps that pull you in most.</H1>
      <Sub>You can always change this later.</Sub>

      <div
        style={{
          flex: '1 1 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--s-4)',
          alignItems: 'center',
          justifyItems: 'center',
          padding: 'var(--s-6) 0',
        }}
      >
        {apps.map((a) => (
          <AppIcon key={a.value} app={a} size="lg" />
        ))}
      </div>
    </ScreenContainer>
  );
}
