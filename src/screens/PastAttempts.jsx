import {
  Button,
  ScreenContainer,
  H1,
  PreHead,
} from '../components/ui.jsx';
import { ChoiceList } from '../components/inputs.jsx';
import { useOnboarding } from '../state/onboarding.jsx';
import { PAST_OPTIONS, EMOTION_OPTIONS, labelFor } from '../state/options.js';

export default function PastAttempts() {
  const { answers, set, next } = useOnboarding();
  const firstEmotion = labelFor(EMOTION_OPTIONS, answers.emotions[0]);
  const canContinue = answers.pastAttempts.length > 0;
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
        You said these apps leave you feeling{' '}
        {firstEmotion ? firstEmotion.toLowerCase() : 'drained'}, so we want to
        ask:
      </PreHead>
      <H1>What have you already tried?</H1>
      <ChoiceList
        options={PAST_OPTIONS}
        value={answers.pastAttempts}
        onChange={(v) => set('pastAttempts', v)}
        max={PAST_OPTIONS.length}
      />
    </ScreenContainer>
  );
}
