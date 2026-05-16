import {
  Button,
  ScreenContainer,
  H1,
  PreHead,
  Sub,
} from '../components/ui.jsx';
import { ChoiceList } from '../components/inputs.jsx';
import { useOnboarding } from '../state/onboarding.jsx';
import { EMOTION_OPTIONS } from '../state/options.js';

export default function Emotions() {
  const { answers, set, next } = useOnboarding();
  const canContinue = answers.emotions.length > 0;
  return (
    <ScreenContainer
      scroll
      footer={
        <Button onClick={next} disabled={!canContinue}>
          Continue
        </Button>
      }
    >
      <PreHead>Let's zoom in…</PreHead>
      <H1>How does using these apps for too long make you feel?</H1>
      <Sub>Choose up to 2</Sub>
      <ChoiceList
        options={EMOTION_OPTIONS}
        value={answers.emotions}
        onChange={(v) => set('emotions', v)}
        max={2}
      />
    </ScreenContainer>
  );
}
