import {
  Button,
  ScreenContainer,
  H1,
  Sub,
} from '../components/ui.jsx';
import { useOnboarding } from '../state/onboarding.jsx';

export default function Account() {
  const { set, next } = useOnboarding();
  function pick(method) {
    set('authMethod', method);
    next();
  }
  return (
    <ScreenContainer
      footer={
        <>
          <Button variant="ghost" onClick={() => pick('apple')}>
            <AppleMark /> Continue with Apple
          </Button>
          <Button variant="ghost" onClick={() => pick('email')}>
            Continue with Email
          </Button>
          <Button onClick={() => pick('skip')}>Skip</Button>
        </>
      }
    >
      <div
        style={{
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--s-5)',
          textAlign: 'center',
        }}
      >
        <TransformFigure />
        <H1>
          Join <span className="cool">StillScroll.</span>
        </H1>
        <Sub>See the plan we've built for you, and join the community.</Sub>
      </div>
    </ScreenContainer>
  );
}

function AppleMark() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M11.5 8.4c0-1.7 1.4-2.5 1.4-2.6-.8-1.1-2-1.3-2.4-1.3-1-.1-2 .6-2.5.6s-1.3-.6-2.2-.6c-1.1 0-2.2.7-2.7 1.7-1.2 2-.3 5 .8 6.6.6.8 1.2 1.7 2.1 1.7.9 0 1.2-.5 2.2-.5s1.3.5 2.2.5c.9 0 1.5-.8 2.1-1.6.7-1 .9-1.9.9-2 0 0-1.9-.7-1.9-2.9zM9.6 3.1c.5-.6.8-1.3.7-2.1-.7 0-1.5.4-2 1-.4.5-.8 1.3-.7 2.1.7.1 1.5-.3 2-1z"
      />
    </svg>
  );
}

function TransformFigure() {
  return (
    <svg width="200" height="120" viewBox="0 0 200 120" aria-hidden="true">
      {/* Looking at phone */}
      <g opacity="0.5">
        <circle cx="50" cy="46" r="8" fill="var(--warm-strong)" />
        <path
          d="M38 78 Q50 64 62 78 L62 96 Q50 102 38 96 Z"
          fill="var(--warm-strong)"
          opacity="0.7"
        />
        <rect x="58" y="74" width="10" height="14" rx="2" fill="var(--warm)" />
      </g>
      <path
        d="M88 60 L112 60 M104 54 L112 60 L104 66"
        stroke="var(--ink-mute)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Sitting in stillness */}
      <g>
        <circle cx="150" cy="46" r="8" fill="var(--cool-strong)" />
        <path
          d="M138 80 Q150 66 162 80 L162 96 Q150 102 138 96 Z"
          fill="var(--cool-strong)"
          opacity="0.85"
        />
        <path
          d="M134 100 Q150 110 166 100"
          stroke="var(--cool-strong)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
}
