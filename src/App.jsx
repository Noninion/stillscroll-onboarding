import { useEffect } from 'react';
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
import { initAnalytics, trackPageView } from './analytics/index.js';
import './App.css';

// ─────────────────────────────────────────────────────────────────────────────
//  LOCAL_DEV
//  ---------
//  When true, a fixed dev-nav strip appears at the bottom of the viewport with
//  Prev / Next / step indicator / jump-to-step controls.
//
//  Defaults to local Vite dev only. Set VITE_SHOW_DEV_NAV=true to force it
//  for a local production-preview build.
// ─────────────────────────────────────────────────────────────────────────────
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);
const LOCAL_DEV =
  typeof window !== 'undefined' &&
  LOCAL_HOSTS.has(window.location.hostname) &&
  (import.meta.env.DEV || import.meta.env.VITE_SHOW_DEV_NAV === 'true');

export default function App() {
  useVisualViewportVars();
  useAnalyticsBootstrap();

  return (
    <OnboardingProvider>
      <AppShell />
    </OnboardingProvider>
  );
}

function useAnalyticsBootstrap() {
  useEffect(() => {
    initAnalytics();
    trackPageView();
  }, []);
}

function useVisualViewportVars() {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const root = document.documentElement;
    let frame = 0;

    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const viewport = window.visualViewport;
        const height = viewport?.height ?? window.innerHeight;
        const width = viewport?.width ?? window.innerWidth;
        const offsetTop = viewport?.offsetTop ?? 0;

        root.style.setProperty('--app-height', `${Math.round(height)}px`);
        root.style.setProperty('--app-width', `${Math.round(width)}px`);
        root.style.setProperty('--app-offset-top', `${Math.round(offsetTop)}px`);
      });
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    window.visualViewport?.addEventListener('resize', update);
    window.visualViewport?.addEventListener('scroll', update);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      window.visualViewport?.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('scroll', update);
    };
  }, []);
}

function AppShell() {
  const { transition } = useOnboarding();
  const transitionClass =
    transition.phase === 'idle'
      ? ''
      : ` screen-route--${transition.phase} screen-route--${transition.direction}`;
  const choiceHoldClass = transition.holdChoices ? ' screen-route--choice-held' : '';

  return (
    <>
      {/* web-stage -> web-frame -> web-viewport mirrors the old
          .stage → .phone → .phone__viewport hierarchy but without
          the visible device chrome.  All layout rules live in ui.css. */}
      <div className="web-stage">
        <div className="web-frame">
          <div className="web-viewport">
            <div className={`screen-route${transitionClass}${choiceHoldClass}`}>
              <CurrentScreen />
            </div>
          </div>
        </div>
      </div>
      {LOCAL_DEV && <DevNav />}
    </>
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
