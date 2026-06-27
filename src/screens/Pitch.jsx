import {
  Button,
  ScreenContainer,
  FooterNote,
  Stars,
} from '../components/ui.jsx';
import { useOnboarding } from '../state/onboarding.jsx';
import { FEATURE_FLAGS } from '../config/features.js';

export default function Pitch() {
  const { next } = useOnboarding();
  return (
    <ScreenContainer
      section="How it works"
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
        <Stars />
        <h1 className="h1 h1--lg warm">Quitting is hard.</h1>
        {FEATURE_FLAGS.cleanLaunchCopy ? (
          <h1 className="h1 h1--lg">
            A useful method is to <span className="cool">Replace.</span>
          </h1>
        ) : (
          <h1 className="h1 h1--lg">
            Science agrees — the best method is to{' '}
            <span className="cool">Replace.</span>
          </h1>
        )}
        <h1 className="h1 h1--lg">
          And what better replacement than a <span className="cool">breath?</span>
        </h1>
        {FEATURE_FLAGS.cleanLaunchCopy ? (
          <FooterNote>
            Built around a simple behavior-change principle: make the automatic action less automatic.
          </FooterNote>
        ) : (
          <FooterNote>
            Backed by longitudinal studies, systematic reviews, and behavioral
            science experts.
          </FooterNote>
        )}
      </div>
    </ScreenContainer>
  );
}
