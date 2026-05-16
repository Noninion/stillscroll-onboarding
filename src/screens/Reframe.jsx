import {
  Button,
  ScreenContainer,
  H1,
  Body,
  FooterNote,
} from '../components/ui.jsx';
import { useOnboarding } from '../state/onboarding.jsx';

const LIFESPAN_YEARS = 85;

export default function Reframe() {
  const { answers, next } = useOnboarding();
  const saved = Math.max(0, answers.currentHours - answers.targetHours);
  const lifetimeGain = Math.round((saved * LIFESPAN_YEARS) / 24);
  const display = lifetimeGain > 0 ? lifetimeGain : 1;
  const unit = display === 1 ? 'year' : 'years';
  const suffix = lifetimeGain > 0 ? '+' : '';

  return (
    <ScreenContainer
      tone="cool"
      footer={<Button onClick={next}>Continue</Button>}
    >
      <div
        style={{
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--s-5)',
          justifyContent: 'center',
        }}
      >
        <H1 lg>Stillscroll can give you back</H1>
        <p className="mega cool">
          {display} {unit}
          {suffix}
        </p>
        <Body>of your life, undistracted.</Body>
        <FooterNote>
          Based on your profile and Stillscroll's program.
        </FooterNote>
      </div>
    </ScreenContainer>
  );
}
