import {
  Button,
  ScreenContainer,
  BigNum,
  Chip,
  ChipRow,
  Testimonial,
} from '../components/ui.jsx';
import { useOnboarding } from '../state/onboarding.jsx';
import { shortGoalLabel } from '../state/options.js';

export default function SocialProof() {
  const { answers, next } = useOnboarding();
  return (
    <ScreenContainer
      scroll
      showHeader={false}
      footer={<Button onClick={next}>I'm next</Button>}
    >
      <div
        style={{
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 'var(--s-6)',
          padding: 'var(--s-6) 0',
        }}
      >
        <BigNum value="1,000,000+" label="people started here too" />
        {answers.goals.length > 0 && (
          <ChipRow>
            {answers.goals.map((g) => (
              <Chip key={g} tone="cool">
                {shortGoalLabel(g)}
              </Chip>
            ))}
          </ChipRow>
        )}
        <Testimonial
          quote="It makes me pause and breathe before I scroll. That single beat changed my whole relationship to my phone."
          attribution="Stillscroll user"
        />
      </div>
    </ScreenContainer>
  );
}
