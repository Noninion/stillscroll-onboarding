import {
  Button,
  ScreenContainer,
  H1,
  PreHead,
} from '../components/ui.jsx';
import { HourSlider } from '../components/inputs.jsx';
import { useOnboarding } from '../state/onboarding.jsx';
import { getMaxTargetHours } from '../state/usageMath.js';

export default function TargetUsage() {
  const { answers, set, next } = useOnboarding();
  const name = answers.name.trim();
  const maxTarget = getMaxTargetHours(answers.currentHours);
  return (
    <ScreenContainer footer={<Button onClick={next}>Continue</Button>}>
      <PreHead>
        Don't feel bad{name ? `, ${name}` : ''}. You're here to change that.
      </PreHead>
      <H1>How much would you like to spend instead?</H1>
      <HourSlider
        value={answers.targetHours}
        onChange={(v) => set('targetHours', v)}
        min={0}
        max={maxTarget}
        tone="cool"
      />
    </ScreenContainer>
  );
}
