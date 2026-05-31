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
  settledChipFromEmotion,
  researchForEmotion,
} from '../state/options.js';

export default function StateCompare() {
  const { answers, next } = useOnboarding();
  const firstApp = appFor(answers.distractingApps[0]);
  const firstEmotion = answers.emotions[0];
  const firstEmotionLabel = labelFor(EMOTION_OPTIONS, firstEmotion);
  const settled = settledChipFromEmotion(firstEmotion);
  const research = researchForEmotion(firstEmotion);

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
        {firstEmotionLabel && <Chip tone="warm">{firstEmotionLabel}</Chip>}

        <Divider />

        <H2>
          With <span className="cool">Stillscroll</span>
        </H2>
        <Chip tone="cool">{settled}</Chip>

        <ResearchCard>
          {research.text} <cite>From {research.cite}.</cite>
        </ResearchCard>
      </div>
    </ScreenContainer>
  );
}
