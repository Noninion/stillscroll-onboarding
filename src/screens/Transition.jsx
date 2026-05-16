import { useEffect, useState } from 'react';
import { Button, ScreenContainer } from '../components/ui.jsx';
import { useOnboarding } from '../state/onboarding.jsx';

export default function Transition() {
  const { answers, next } = useOnboarding();
  const name = answers.name.trim() || 'Friend';
  const full = `${name}, let's connect Stillscroll to your phone.`;
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (shown >= full.length) return;
    const id = setTimeout(() => setShown((s) => s + 1), 28);
    return () => clearTimeout(id);
  }, [shown, full]);

  const done = shown >= full.length;

  return (
    <ScreenContainer
      showProgress={false}
      footer={
        done ? <Button onClick={next}>Set Up</Button> : null
      }
    >
      <div
        style={{
          flex: '1 1 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 'var(--s-6)',
        }}
      >
        <h1
          className="h1 h1--lg"
          style={{ maxWidth: 300 }}
          aria-label={full}
        >
          {full.slice(0, shown)}
          <span
            style={{
              display: 'inline-block',
              width: 2,
              height: '1em',
              background: 'var(--cool)',
              marginLeft: 2,
              verticalAlign: '-0.1em',
              opacity: done ? 0 : 1,
              animation: 'caret 700ms steps(1) infinite',
            }}
            aria-hidden="true"
          />
        </h1>
      </div>
      <style>{`
        @keyframes caret { 50% { opacity: 0; } }
      `}</style>
    </ScreenContainer>
  );
}
