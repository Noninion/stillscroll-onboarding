import {
  Button,
  ScreenContainer,
  H1,
  PreHead,
  Sub,
} from '../components/ui.jsx';
import { ChoiceList } from '../components/inputs.jsx';
import { useOnboarding } from '../state/onboarding.jsx';
import { GOAL_OPTIONS } from '../state/options.js';

export default function Goals() {
  const { answers, set, next } = useOnboarding();
  const trimmedName = answers.name.trim();
  const canContinue = answers.goals.length > 0;

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
        So, tell us{trimmedName ? `, ${trimmedName}` : ''},
      </PreHead>
      <H1>What do you want to get out of StillScroll?</H1>
      <Sub>Choose up to 3</Sub>
      <ChoiceList
        options={GOAL_OPTIONS}
        value={answers.goals}
        onChange={(v) => set('goals', v)}
        max={3}
      />
    </ScreenContainer>
  );
}
