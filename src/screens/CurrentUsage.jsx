import {
  Button,
  ScreenContainer,
  H1,
  PreHead,
} from '../components/ui.jsx';
import { HourSlider } from '../components/inputs.jsx';
import { useOnboarding } from '../state/onboarding.jsx';

export default function CurrentUsage() {
  const { answers, set, next } = useOnboarding();
  return (
    <ScreenContainer footer={<Button onClick={next}>Continue</Button>}>
      <PreHead>Now let's look at the numbers.</PreHead>
      <H1>How much time do you spend on your phone each day?</H1>
      <HourSlider
        value={answers.currentHours}
        onChange={(v) => set('currentHours', v)}
        tone="warm"
      />
    </ScreenContainer>
  );
}
