import {
  Button,
  ScreenContainer,
  H1,
  Body,
  Stars,
  Testimonial,
} from '../components/ui.jsx';
import { useOnboarding } from '../state/onboarding.jsx';

export default function Rating() {
  const { next } = useOnboarding();
  return (
    <ScreenContainer
      scroll
      footer={<Button onClick={next}>Continue</Button>}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--s-5)',
          padding: 'var(--s-4) 0',
          textAlign: 'center',
        }}
      >
        <H1>Give us a rating</H1>
        <Stars />
        <Body>Stillscroll was built for people like you.</Body>
        <SocialRow />
        <Testimonial
          quote="It makes me pause and breathe before I scroll. That single beat changed my whole relationship to my phone."
          attribution="Stillscroll user"
        />
      </div>
    </ScreenContainer>
  );
}

function SocialRow() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--s-3)',
      }}
    >
      <div style={{ display: 'flex' }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'var(--surface-2)',
              border: '2px solid var(--bg)',
              marginLeft: i === 0 ? 0 : -8,
              display: 'inline-block',
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: 13, color: 'var(--ink-dim)' }}>
        +1,000s of Stillscroll users
      </span>
    </div>
  );
}
