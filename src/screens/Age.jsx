import {
  ScreenContainer,
  H1,
  PreHead,
  Sub,
} from '../components/ui.jsx';
import { ChoiceList } from '../components/inputs.jsx';
import { useOnboarding } from '../state/onboarding.jsx';
import { AGE_OPTIONS } from '../state/options.js';

export default function Age() {
  const { answers, set, next } = useOnboarding();
  return (
    <ScreenContainer>
      <PreHead>This helps us shape the practices we suggest.</PreHead>
      <H1>How old are you?</H1>
      <Sub>Choose one</Sub>
      <ChoiceList
        options={AGE_OPTIONS}
        value={answers.ageBucket}
        onChange={(v) => set('ageBucket', v)}
        max={1}
        autoAdvance
        onAutoAdvance={() => next()}
      />
    </ScreenContainer>
  );
}
