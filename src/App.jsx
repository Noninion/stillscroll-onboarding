import { OnboardingProvider, useOnboarding } from './state/onboarding.jsx';
import { STEPS } from './state/steps.js';
import Splash from './screens/Splash.jsx';
import QuizIntro from './screens/QuizIntro.jsx';
import Name from './screens/Name.jsx';
import Goals from './screens/Goals.jsx';
import CurrentUsage from './screens/CurrentUsage.jsx';
import TargetUsage from './screens/TargetUsage.jsx';
import SocialProof from './screens/SocialProof.jsx';
import Apps from './screens/Apps.jsx';
import Hooks from './screens/Hooks.jsx';
import Emotions from './screens/Emotions.jsx';
import StateCompare from './screens/StateCompare.jsx';
import Age from './screens/Age.jsx';
import Diagnostic from './screens/Diagnostic.jsx';
import LifeMath from './screens/LifeMath.jsx';
import Reframe from './screens/Reframe.jsx';
import PastAttempts from './screens/PastAttempts.jsx';
import WhyFailed from './screens/WhyFailed.jsx';
import Pitch from './screens/Pitch.jsx';
import Mechanic from './screens/Mechanic.jsx';
import Calculating from './screens/Calculating.jsx';
import Plan from './screens/Plan.jsx';
import EmailCapture from './screens/EmailCapture.jsx';
import WaitlistConfirmation from './screens/WaitlistConfirmation.jsx';
import './App.css';

// ─────────────────────────────────────────────────────────────────────────────
//  LOCAL_DEV
//  ---------
//  When true, a fixed dev-nav strip appears at the bottom of the viewport with
//  Prev / Next / step indicator / jump-to-step controls.
//
//  Defaults to `import.meta.env.DEV` so it auto-shows in `npm run dev` and
//  auto-hides in `npm run build`.  Hard-code to `true` or `false` to force
//  either behavior (e.g. to preview the dev nav against a production build).
// ─────────────────────────────────────────────────────────────────────────────
const LOCAL_DEV = import.meta.env.DEV;

export default function App() {
  return (
    <OnboardingProvider>
      {/* web-stage → web-frame → web-viewport mirrors the old
          .stage → .phone → .phone__viewport hierarchy but without
          the visible device chrome.  All layout rules live in ui.css. */}
      <div className="web-stage">
        <div className="web-frame">
          <div className="web-viewport">
            <CurrentScreen />
          </div>
        </div>
      </div>
      {LOCAL_DEV && <DevNav />}
    </OnboardingProvider>
  );
}

function DevNav() {
  const { step, back, next, goto, isFirst, isLast } = useOnboarding();
  return (
    <div className="devnav" role="toolbar" aria-label="Dev navigation">
      <button onClick={back} disabled={isFirst} aria-label="Previous step">
        ← Prev
      </button>
      <select
        className="devnav__select"
        value={step}
        onChange={(e) => goto(Number(e.target.value))}
        aria-label="Jump to step"
      >
        {STEPS.map((s, i) => (
          <option key={s.key} value={i}>
            {String(i + 1).padStart(2, '0')} — {s.title}
          </option>
        ))}
      </select>
      <span className="devnav__count">
        {step + 1}/{STEPS.length}
      </span>
      <button onClick={next} disabled={isLast} aria-label="Next step">
        Next →
      </button>
    </div>
  );
}

function CurrentScreen() {
  const { stepMeta } = useOnboarding();
  switch (stepMeta.key) {
    case 'splash':        return <Splash />;
    case 'quiz_intro':    return <QuizIntro />;
    case 'name':          return <Name />;
    case 'goals':         return <Goals />;
    case 'current_usage': return <CurrentUsage />;
    case 'target_usage':  return <TargetUsage />;
    case 'social_proof':  return <SocialProof />;
    case 'apps':          return <Apps />;
    case 'hooks':         return <Hooks />;
    case 'emotions':      return <Emotions />;
    case 'state_compare': return <StateCompare />;
    case 'age':           return <Age />;
    case 'diagnostic':    return <Diagnostic />;
    case 'life_math':     return <LifeMath />;
    case 'reframe':       return <Reframe />;
    case 'tried':         return <PastAttempts />;
    case 'why_failed':    return <WhyFailed />;
    case 'pitch':         return <Pitch />;
    case 'mechanic':      return <Mechanic />;
    case 'calculating':   return <Calculating />;
    case 'plan':          return <Plan />;
    case 'email_capture': return <EmailCapture />;
    case 'waitlist':      return <WaitlistConfirmation />;
    default:              return null;
  }
}
