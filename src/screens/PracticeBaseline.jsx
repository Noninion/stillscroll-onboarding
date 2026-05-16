import {
  ScreenContainer,
  H1,
  PreHead,
  Sub,
} from '../components/ui.jsx';
import { ChoiceList } from '../components/inputs.jsx';
import { useOnboarding } from '../state/onboarding.jsx';
import { BASELINE_OPTIONS } from '../state/options.js';

export default function PracticeBaseline() {
  const { answers, set, next } = useOnboarding();
  return (
    <ScreenContainer>
      <PreHead>Speaking of practice,</PreHead>
      <H1>Have you tried meditation or breathwork before?</H1>
      <Sub>Choose one</Sub>
      <ChoiceList
        options={BASELINE_OPTIONS}
        value={answers.practiceFrequency}
        onChange={(v) => set('practiceFrequency', v)}
        max={1}
        autoAdvance
        onAutoAdvance={() => next()}
      />
    </ScreenContainer>
  );
}
