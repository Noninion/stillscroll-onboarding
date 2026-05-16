import { Button, ScreenContainer, H1, PreHead } from '../components/ui.jsx';
import { TextInput } from '../components/inputs.jsx';
import { useOnboarding } from '../state/onboarding.jsx';

export default function Name() {
  const { answers, set, next } = useOnboarding();
  const trimmed = answers.name.trim();
  const canContinue = trimmed.length > 0;

  function onSubmit(e) {
    e.preventDefault();
    if (canContinue) next();
  }

  return (
    <ScreenContainer
      footer={
        <Button onClick={next} disabled={!canContinue}>
          Continue
        </Button>
      }
    >
      <form
        onSubmit={onSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--s-5)',
          flex: '1 1 auto',
        }}
      >
        <PreHead>First things first,</PreHead>
        <H1>What should we call you?</H1>
        <TextInput
          value={answers.name}
          onChange={(v) => set('name', v)}
          placeholder="Name"
          autoFocus
        />
      </form>
    </ScreenContainer>
  );
}
