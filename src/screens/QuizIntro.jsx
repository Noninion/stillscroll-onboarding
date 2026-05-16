import { Button, ScreenContainer, H1, Body } from '../components/ui.jsx';
import { useOnboarding } from '../state/onboarding.jsx';

export default function QuizIntro() {
  const { next } = useOnboarding();
  return (
    <ScreenContainer
      showProgress={false}
      footer={<Button onClick={next}>Start Quiz</Button>}
    >
      <div
        style={{
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--s-6)',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 'var(--s-6) 0',
        }}
      >
        <SittingFigure />
        <H1>Understanding more about your situation</H1>
        <Body>
          A few questions so we can shape Stillscroll around what you actually
          need.
        </Body>
      </div>
    </ScreenContainer>
  );
}

function SittingFigure() {
  return (
    <svg
      width="140"
      height="140"
      viewBox="0 0 140 140"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="70" cy="70" r="64" stroke="var(--cool-line)" strokeWidth="1" />
      <circle cx="70" cy="70" r="44" stroke="var(--cool-line)" strokeWidth="1" opacity="0.5" />
      {/* head */}
      <circle cx="70" cy="55" r="9" fill="var(--ink-dim)" />
      {/* body */}
      <path
        d="M55 90 Q70 78 85 90 L85 100 Q70 108 55 100 Z"
        fill="var(--ink-dim)"
        opacity="0.85"
      />
      {/* legs (crossed) */}
      <path
        d="M50 102 Q70 112 90 102"
        stroke="var(--ink-dim)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
