import {
  Button,
  ScreenContainer,
  H1,
  PreHead,
} from '../components/ui.jsx';
import { TimeWheel } from '../components/Wheel.jsx';
import { useOnboarding } from '../state/onboarding.jsx';

export default function Routine() {
  const { answers, set, next } = useOnboarding();
  return (
    <ScreenContainer
      footer={
        <>
          <Button onClick={next}>Set Routine</Button>
          <Button variant="text" onClick={next}>
            Skip
          </Button>
        </>
      }
    >
      <PreHead>
        Reminders make it 65% more likely you'll stick with StillScroll after a
        week.
      </PreHead>
      <H1>What's the best time for you to practice?</H1>
      <div
        style={{
          flex: '1 1 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <TimeWheel
          value={answers.reminderTime}
          onChange={(v) => set('reminderTime', v)}
        />
      </div>
    </ScreenContainer>
  );
}
