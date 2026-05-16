import {
  Button,
  ScreenContainer,
  H2,
  Chip,
  AppIcon,
  ResearchCard,
  Divider,
} from '../components/ui.jsx';
import { useOnboarding } from '../state/onboarding.jsx';
import {
  appFor,
  labelFor,
  EMOTION_OPTIONS,
  stateChipFromGoals,
} from '../state/options.js';

export default function StateCompare() {
  const { answers, next } = useOnboarding();
  const firstApp = appFor(answers.distractingApps[0]);
  const firstEmotion = labelFor(EMOTION_OPTIONS, answers.emotions[0]);
  const settled = stateChipFromGoals(answers.goals);

  return (
    <ScreenContainer footer={<Button onClick={next}>Continue</Button>}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--s-5)',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <H2>
          <span className="warm">Current State</span>
        </H2>
        <AppIcon app={firstApp} size="lg" />
        {firstEmotion && <Chip tone="warm">{firstEmotion}</Chip>}

        <Divider />

        <H2>
          With <span className="cool">Stillscroll</span>
        </H2>
        <Chip tone="cool">{settled}</Chip>

        <ResearchCard>
          Mindfulness practices reduce anxiety and improve sustained attention.{' '}
          <a href="#" onClick={(e) => e.preventDefault()}>
            From Goyal et al., JAMA 2014
          </a>
          .
        </ResearchCard>
      </div>
    </ScreenContainer>
  );
}
