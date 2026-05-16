import { OnboardingProvider, useOnboarding } from './state/onboarding.jsx';
import { STEPS } from './state/steps.js';
import { PhoneFrame, Stub } from './components/ui.jsx';
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
import PastAttempts from './screens/PastAttempts.jsx';
import PracticeBaseline from './screens/PracticeBaseline.jsx';
import Diagnostic from './screens/Diagnostic.jsx';
import LifeMath from './screens/LifeMath.jsx';
import Reframe from './screens/Reframe.jsx';
import WhyFailed from './screens/WhyFailed.jsx';
import Pitch from './screens/Pitch.jsx';
import Mechanic from './screens/Mechanic.jsx';
import Routine from './screens/Routine.jsx';
import PracticeCTA from './screens/PracticeCTA.jsx';
import Setup from './screens/Setup.jsx';
import Practice from './screens/Practice.jsx';
import Transition from './screens/Transition.jsx';
import PreScreenTime from './screens/PreScreenTime.jsx';
import NativeScreenTime from './screens/NativeScreenTime.jsx';
import ConfirmScreenTime from './screens/ConfirmScreenTime.jsx';
import AppsIntro from './screens/AppsIntro.jsx';
import FamilyPicker from './screens/FamilyPicker.jsx';
import NotificationPermission from './screens/NotificationPermission.jsx';
import Rating from './screens/Rating.jsx';
import Account from './screens/Account.jsx';
import Calculating from './screens/Calculating.jsx';
import Plan from './screens/Plan.jsx';
import Sales from './screens/Sales.jsx';
import Paywall from './screens/Paywall.jsx';
import './App.css';

export default function App() {
  return (
    <OnboardingProvider>
      <div className="stage">
        <PhoneFrame>
          <CurrentScreen />
        </PhoneFrame>
        <DevNav />
      </div>
    </OnboardingProvider>
  );
}

function CurrentScreen() {
  const { stepMeta } = useOnboarding();
  switch (stepMeta.key) {
    case 'splash':
      return <Splash />;
    case 'quiz_intro':
      return <QuizIntro />;
    case 'name':
      return <Name />;
    case 'goals':
      return <Goals />;
    case 'current_usage':
      return <CurrentUsage />;
    case 'target_usage':
      return <TargetUsage />;
    case 'social_proof':
      return <SocialProof />;
    case 'apps':
      return <Apps />;
    case 'hooks':
      return <Hooks />;
    case 'emotions':
      return <Emotions />;
    case 'state_compare':
      return <StateCompare />;
    case 'age':
      return <Age />;
    case 'tried':
      return <PastAttempts />;
    case 'baseline':
      return <PracticeBaseline />;
    case 'diagnostic':
      return <Diagnostic />;
    case 'life_math':
      return <LifeMath />;
    case 'reframe':
      return <Reframe />;
    case 'why_failed':
      return <WhyFailed />;
    case 'pitch':
      return <Pitch />;
    case 'mechanic':
      return <Mechanic />;
    case 'routine':
      return <Routine />;
    case 'practice_cta':
      return <PracticeCTA />;
    case 'setup':
      return <Setup />;
    case 'practice':
      return <Practice />;
    case 'transition':
      return <Transition />;
    case 'pre_st':
      return <PreScreenTime />;
    case 'native_st':
      return <NativeScreenTime />;
    case 'confirm_st':
      return <ConfirmScreenTime />;
    case 'apps_intro':
      return <AppsIntro />;
    case 'family_picker':
      return <FamilyPicker />;
    case 'notif':
      return <NotificationPermission />;
    case 'rating':
      return <Rating />;
    case 'account':
      return <Account />;
    case 'calculating':
      return <Calculating />;
    case 'plan':
      return <Plan />;
    case 'sales':
      return <Sales />;
    case 'paywall':
      return <Paywall />;
    default:
      return <Stub />;
  }
}

function DevNav() {
  const { step, stepMeta, back, next, isFirst, isLast } = useOnboarding();
  return (
    <div className="devnav">
      <button onClick={back} disabled={isFirst}>
        ← Prev
      </button>
      <span className="devnav__label">
        {step + 1} / {STEPS.length} — {stepMeta.title}
      </span>
      <button onClick={next} disabled={isLast}>
        Next →
      </button>
    </div>
  );
}
