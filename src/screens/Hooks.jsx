import {
  Button,
  ScreenContainer,
  H1,
  PreHead,
  Sub,
} from '../components/ui.jsx';
import { ChoiceList } from '../components/inputs.jsx';
import { useOnboarding } from '../state/onboarding.jsx';
import { HOOK_OPTIONS, appFor } from '../state/options.js';

export default function Hooks() {
  const { answers, set, next } = useOnboarding();
  const firstApp = appFor(answers.distractingApps[0]);
  const canContinue = answers.hooks.length > 0;
  return (
    <ScreenContainer
      scroll
      footer={
        <Button onClick={next} disabled={!canContinue}>
          Continue
        </Button>
      }
    >
      <PreHead>
        Take a second to reflect on apps like {firstApp?.label ?? 'that one'}.
      </PreHead>
      <H1>What usually makes it hard to put down?</H1>
      <Sub>Choose up to 3</Sub>
      <ChoiceList
        options={HOOK_OPTIONS}
        value={answers.hooks}
        onChange={(v) => set('hooks', v)}
        max={3}
      />
    </ScreenContainer>
  );
}
