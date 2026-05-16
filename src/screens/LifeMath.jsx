import {
  Button,
  ScreenContainer,
  H1,
  Body,
  FooterNote,
} from '../components/ui.jsx';
import { useOnboarding } from '../state/onboarding.jsx';

const LIFESPAN_YEARS = 85;

export default function LifeMath() {
  const { answers, next } = useOnboarding();
  const hours = answers.currentHours;
  const daysPerYear = Math.round((hours * 365) / 24);
  const lifetimeYears = Math.round((hours * LIFESPAN_YEARS) / 24);

  return (
    <ScreenContainer
      tone="warm"
      footer={<Button onClick={next}>Continue</Button>}
    >
      <div
        style={{
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--s-5)',
          justifyContent: 'center',
          textAlign: 'left',
        }}
      >
        <H1 lg>
          At your current pace, you'll spend {daysPerYear} days on your phone
          over the next year.
        </H1>
        <Body>Across a lifetime, that's</Body>
        <p className="mega warm">{lifetimeYears} years</p>
        <Body>of looking down.</Body>
        <FooterNote>Based on an {LIFESPAN_YEARS}-year lifespan.</FooterNote>
      </div>
    </ScreenContainer>
  );
}
