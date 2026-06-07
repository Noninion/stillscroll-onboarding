import {
  Button,
  ScreenContainer,
  H1,
  PreHead,
  Sub,
  AppIcon,
} from '../components/ui.jsx';
import { ChoiceList } from '../components/inputs.jsx';
import { useOnboarding } from '../state/onboarding.jsx';
import { APP_OPTIONS } from '../state/options.js';

export default function Apps() {
  const { answers, set, next } = useOnboarding();
  const canContinue = answers.distractingApps.length > 0;
  return (
    <ScreenContainer
      scroll
      footer={
        <Button onClick={next} disabled={!canContinue}>
          Continue
        </Button>
      }
    >
      <PreHead>Now, let's find where it's going.</PreHead>
      <H1>Which apps are taking most of your time?</H1>
      <Sub>Choose up to 3</Sub>
      <ChoiceList
        className="choice-list--apps"
        options={APP_OPTIONS}
        value={answers.distractingApps}
        onChange={(v) => set('distractingApps', v)}
        max={3}
        renderIcon={(opt) => <AppIcon app={opt} />}
      />
    </ScreenContainer>
  );
}
