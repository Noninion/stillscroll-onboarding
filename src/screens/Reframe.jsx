import {
  Button,
  ScreenContainer,
  H1,
  Body,
  FooterNote,
} from '../components/ui.jsx';
import { useOnboarding } from '../state/onboarding.jsx';
import { getLifetimeReclaimedYears } from '../state/usageMath.js';

export default function Reframe() {
  const { answers, next } = useOnboarding();
  const lifetimeGain = getLifetimeReclaimedYears(
    answers.currentHours,
    answers.targetHours,
  );
  const unit = lifetimeGain === 1 ? 'year' : 'years';

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
        <H1 lg>StillScroll can give you back</H1>
        <p className="mega cool">
          {lifetimeGain} {unit}+
        </p>
        <Body>of your life, undistracted.</Body>
        <FooterNote>
          Based on your profile and StillScroll's program.
        </FooterNote>
      </div>
    </ScreenContainer>
  );
}
