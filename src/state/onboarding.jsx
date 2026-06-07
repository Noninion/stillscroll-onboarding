import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { STEPS } from './steps.js';
import { clampTargetHours } from './usageMath.js';
import {
  trackAnswerUpdated,
  trackFunnelStarted,
  trackNextButtonClicked,
  trackStepCompleted,
  trackStepViewed,
} from '../analytics/index.js';

const initialAnswers = {
  // quiz
  name: '',
  goals: [],
  currentHours: 4,
  targetHours: 3,
  distractingApps: [],
  hooks: [],
  emotions: [],
  ageBucket: null,
  pastAttempts: [],
  // conversion
  email: '',
  waitlistSubmitted: false,
};

const initial = { step: 0, answers: initialAnswers };

function reducer(state, action) {
  switch (action.type) {
    case 'set': {
      const answers = { ...state.answers, [action.field]: action.value };
      if (action.field === 'currentHours') {
        answers.targetHours = clampTargetHours(answers.targetHours, action.value);
      }
      if (action.field === 'targetHours') {
        answers.targetHours = clampTargetHours(action.value, answers.currentHours);
      }
      return {
        ...state,
        answers,
      };
    }
    case 'next':
      return { ...state, step: Math.min(state.step + 1, STEPS.length - 1) };
    case 'back':
      return { ...state, step: Math.max(state.step - 1, 0) };
    case 'goto':
      return { ...state, step: action.step };
    case 'reset':
      return initial;
    default:
      return state;
  }
}

const Ctx = createContext(null);

function stepMetaAt(index) {
  return {
    ...STEPS[index],
    index,
  };
}

const CHOICE_FADE_MS = 277;
const CHOICE_STACK_MS = 410;
const TEXT_EXIT_BASE_MS = 257;
const TEXT_ENTER_BASE_MS = 297;
const TEXT_CASCADE_STEP_MS = 38;
const ITEM_EXIT_MS = 297;
const ITEM_ENTER_MS = 317;
const ITEM_PHASE_GAP_MS = 20;
const ITEM_ENTER_STAGGER_MS = 18;
const FORM_ENTER_GAP_MS = 80;

const idleTransition = {
  phase: 'idle',
  direction: null,
  holdChoices: false,
};

const MOTION_TEXT_SELECTOR = [
  '.motion-text',
  '.mega',
  '.splash__brand',
  '.splash__title',
  '.plan__section-title',
  '.plan__day-title',
  '.plan__day-note',
  '.plan__bar-value',
  '.plan__bar-label',
  '.wc__email-confirm',
  '.wc__discount-label',
  '.wc__discount-note',
  '.wc__plan-title',
  '.wc__plan-stat-value',
  '.wc__plan-stat-label',
  '.ec__label',
  '.ec__badge-note',
  '.ec__spots-label',
  '.ec__spots-count',
  '.practice__title',
  '.practice__counter',
].join(',');

const MOTION_ITEM_SELECTOR = [
  '.motion-item',
  '.splash__hero',
  '.splash__dots',
  '.mock',
  '.choice-list',
  '.slider',
  '.text-input',
  '.plan__card',
  '.plan__bullets',
  '.plan__timeline',
  '.plan__grid',
  '.plan__sticky',
  '.ec__badge',
  '.ec__field',
  '.ec__spots',
  '.wc__check',
  '.wc__discount',
  '.wc__plan',
  '.wc__spots',
  '.practice',
  '.practice__toast',
  '.bc',
  'svg',
].join(',');

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

function byTopThenLeft(a, b) {
  const aBox = a.getBoundingClientRect();
  const bBox = b.getBoundingClientRect();
  return aBox.top - bBox.top || aBox.left - bBox.left;
}

function visibleElement(element) {
  const box = element.getBoundingClientRect();
  return box.width > 0 && box.height > 0;
}

function fixedChromeElement(element) {
  return Boolean(
    element.closest('.screen__head, .screen__foot, .plan__sticky'),
  );
}

function topLevelElements(elements) {
  const elementSet = new Set(elements);
  return elements.filter((element) => {
    let parent = element.parentElement;
    while (parent) {
      if (elementSet.has(parent)) return false;
      parent = parent.parentElement;
    }
    return true;
  });
}

function textKind(element) {
  if (element.matches('h1, h2, .splash__title')) return 'title';
  if (
    element.matches(
      '.mega, .slider__value, .bignum__num, .wc__plan-stat-value, .plan__bar-value',
    )
  ) {
    return 'huge';
  }
  return 'small';
}

function itemKind(element) {
  if (element.matches('.choice-list, .slider, .text-input, .ec__field')) {
    return 'form';
  }
  return 'visual';
}

function setMotionStyles(element, { className, index, count, exitDelay, enterDelay }) {
  element.classList.add(className);
  element.style.setProperty('--motion-index', String(index));
  element.style.setProperty('--motion-count', String(count));
  element.style.setProperty('--motion-exit-delay', `${exitDelay}ms`);
  element.style.setProperty('--motion-enter-delay', `${enterDelay}ms`);
}

function clearScreenMotionTargets(route) {
  if (typeof document === 'undefined') return;
  route ??= document.querySelector('.screen-route');
  if (!route) return;
  route
    .querySelectorAll('.screen-motion-text, .screen-motion-item')
    .forEach((element) => {
      element.classList.remove('screen-motion-text', 'screen-motion-item');
      element.style.removeProperty('--motion-index');
      element.style.removeProperty('--motion-count');
      element.style.removeProperty('--motion-exit-delay');
      element.style.removeProperty('--motion-enter-delay');
    });
  route.style.removeProperty('--motion-text-count');
  route.style.removeProperty('--motion-item-count');
}

function prepareScreenMotionTargets() {
  if (typeof document === 'undefined') return { textCount: 0, itemCount: 0 };
  const route = document.querySelector('.screen-route');
  if (!route) return { textCount: 0, itemCount: 0 };

  clearScreenMotionTargets(route);

  const textTargets = Array.from(route.querySelectorAll(MOTION_TEXT_SELECTOR))
    .filter(visibleElement)
    .filter((element) => !fixedChromeElement(element))
    .sort(byTopThenLeft);

  const textSet = new Set(textTargets);
  const itemTargets = topLevelElements(
    Array.from(route.querySelectorAll(MOTION_ITEM_SELECTOR))
      .filter(visibleElement)
      .filter((element) => !fixedChromeElement(element))
      .filter((element) => !textSet.has(element)),
  ).sort(byTopThenLeft);

  const titleTargets = textTargets.filter((element) => textKind(element) === 'title');
  const smallTextTargets = textTargets.filter((element) => textKind(element) === 'small');
  const hugeTextTargets = textTargets.filter((element) => textKind(element) === 'huge');
  const visualTargets = itemTargets.filter((element) => itemKind(element) === 'visual');
  const formTargets = itemTargets.filter((element) => itemKind(element) === 'form');

  const titleExitStart = 0;
  const smallExitStart =
    titleTargets.length > 0
      ? titleExitStart + TEXT_EXIT_BASE_MS + ITEM_PHASE_GAP_MS
      : 0;
  const hugeAndVisualExitStart =
    smallExitStart +
    (smallTextTargets.length > 0
      ? TEXT_EXIT_BASE_MS +
        Math.max(0, smallTextTargets.length - 1) * TEXT_CASCADE_STEP_MS +
        ITEM_PHASE_GAP_MS
      : titleTargets.length > 0
        ? 0
        : 0);

  const visualEnterStart = visualTargets.length > 0 ? 0 : null;
  const titleEnterStart =
    visualTargets.length > 0
      ? ITEM_ENTER_MS +
        Math.max(0, visualTargets.length - 1) * ITEM_ENTER_STAGGER_MS +
        ITEM_PHASE_GAP_MS
      : 0;
  const smallEnterStart =
    titleEnterStart +
    (titleTargets.length > 0
      ? TEXT_ENTER_BASE_MS +
        Math.max(0, titleTargets.length - 1) * TEXT_CASCADE_STEP_MS +
        ITEM_PHASE_GAP_MS
      : 0);
  const formEnterStart =
    smallEnterStart +
    (smallTextTargets.length > 0
      ? TEXT_ENTER_BASE_MS +
        Math.max(0, smallTextTargets.length - 1) * TEXT_CASCADE_STEP_MS +
        FORM_ENTER_GAP_MS
      : FORM_ENTER_GAP_MS);
  const hugeEnterStart =
    Math.max(
      smallEnterStart,
      formTargets.length > 0
        ? formEnterStart +
            ITEM_ENTER_MS +
            Math.max(0, formTargets.length - 1) * ITEM_ENTER_STAGGER_MS +
            ITEM_PHASE_GAP_MS
        : 0,
    );

  titleTargets.forEach((element, index) => {
    setMotionStyles(element, {
      className: 'screen-motion-text',
      index,
      count: textTargets.length,
      exitDelay: titleExitStart + index * TEXT_CASCADE_STEP_MS,
      enterDelay: titleEnterStart + index * TEXT_CASCADE_STEP_MS,
    });
  });

  smallTextTargets.forEach((element, index) => {
    setMotionStyles(element, {
      className: 'screen-motion-text',
      index: titleTargets.length + index,
      count: textTargets.length,
      exitDelay: smallExitStart + index * TEXT_CASCADE_STEP_MS,
      enterDelay: smallEnterStart + index * TEXT_CASCADE_STEP_MS,
    });
  });

  hugeTextTargets.forEach((element, index) => {
    setMotionStyles(element, {
      className: 'screen-motion-text',
      index: titleTargets.length + smallTextTargets.length + index,
      count: textTargets.length,
      exitDelay: hugeAndVisualExitStart + index * TEXT_CASCADE_STEP_MS,
      enterDelay: hugeEnterStart + index * TEXT_CASCADE_STEP_MS,
    });
  });

  visualTargets.forEach((element, index) => {
    setMotionStyles(element, {
      className: 'screen-motion-item',
      index,
      count: itemTargets.length,
      exitDelay: hugeAndVisualExitStart + index * ITEM_ENTER_STAGGER_MS,
      enterDelay: (visualEnterStart ?? titleEnterStart) + index * ITEM_ENTER_STAGGER_MS,
    });
  });

  formTargets.forEach((element, index) => {
    setMotionStyles(element, {
      className: 'screen-motion-item',
      index: visualTargets.length + index,
      count: itemTargets.length,
      exitDelay: hugeAndVisualExitStart + (visualTargets.length + index) * ITEM_ENTER_STAGGER_MS,
      enterDelay: formEnterStart + index * ITEM_ENTER_STAGGER_MS,
    });
  });

  route.style.setProperty('--motion-text-count', String(textTargets.length));
  route.style.setProperty('--motion-item-count', String(itemTargets.length));

  const exitDuration = Math.max(
    ...textTargets.map((element) =>
      (parseFloat(element.style.getPropertyValue('--motion-exit-delay')) || 0) +
      TEXT_EXIT_BASE_MS,
    ),
    ...itemTargets.map((element) =>
      (parseFloat(element.style.getPropertyValue('--motion-exit-delay')) || 0) +
      ITEM_EXIT_MS,
    ),
    0,
  );
  const enterDuration = Math.max(
    ...textTargets.map((element) =>
      (parseFloat(element.style.getPropertyValue('--motion-enter-delay')) || 0) +
      TEXT_ENTER_BASE_MS,
    ),
    ...itemTargets.map((element) =>
      (parseFloat(element.style.getPropertyValue('--motion-enter-delay')) || 0) +
      ITEM_ENTER_MS,
    ),
    0,
  );

  return {
    textCount: textTargets.length,
    itemCount: itemTargets.length,
    exitDuration,
    enterDuration,
  };
}

function getChoiceMotionDuration(hasSelectedChoices) {
  return hasSelectedChoices ? CHOICE_FADE_MS + CHOICE_STACK_MS : 0;
}

function getScreenMotionDuration(phase, targets) {
  if (phase === 'exit') return targets.exitDuration ?? 0;
  if (phase === 'enter') return targets.enterDuration ?? 0;
  return 0;
}

function getSelectedChoicesOnScreen() {
  if (typeof document === 'undefined') return [];
  return Array.from(
    document.querySelectorAll('.screen-route .choice-list .choice--selected'),
  );
}

function prepareChoiceStackAnimation(selectedChoices) {
  if (typeof document === 'undefined') return;
  const route = document.querySelector('.screen-route');
  if (!route) return;

  const routeBox = route.getBoundingClientRect();
  const centerY = routeBox.top + routeBox.height / 2;
  const choiceList = selectedChoices[0]?.closest('.choice-list');
  const choiceListStyle = choiceList ? getComputedStyle(choiceList) : null;
  const rowGap = choiceListStyle ? parseFloat(choiceListStyle.rowGap) || 0 : 0;
  const choiceBoxes = selectedChoices.map((choice) => choice.getBoundingClientRect());
  const stackHeight =
    choiceBoxes.reduce((sum, box) => sum + box.height, 0) +
    Math.max(0, selectedChoices.length - 1) * rowGap;
  let nextTop = centerY - stackHeight / 2;

  selectedChoices.forEach((choice, index) => {
    const choiceBox = choiceBoxes[index];
    const choiceCenterY = choiceBox.top + choiceBox.height / 2;
    const targetCenterY = nextTop + choiceBox.height / 2;
    const stackOffset = targetCenterY - choiceCenterY;
    nextTop += choiceBox.height + rowGap;
    choice.style.setProperty('--choice-stack-offset', `${stackOffset}px`);
  });
}

function clearChoiceStackAnimation() {
  if (typeof document === 'undefined') return;
  document
    .querySelectorAll('.screen-route .choice-list .choice--selected')
    .forEach((choice) => {
      choice.style.removeProperty('--choice-stack-offset');
    });
}

export function OnboardingProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const [transition, setTransition] = useState(idleTransition);
  const transitionRef = useRef(false);
  const startedRef = useRef(false);
  const stepMeta = useMemo(() => stepMetaAt(state.step), [state.step]);

  const set = useCallback(
    (field, value) => {
      const previousValue = state.answers[field];
      dispatch({ type: 'set', field, value });
      if (![ 'name'].includes(field)) {
        trackAnswerUpdated({
                field,
                value,
                previousValue,
                stepMeta,
              });
      };
      
    },
    [state.answers, stepMeta],
  );

  useEffect(() => {
    if (!startedRef.current) {
      trackFunnelStarted(stepMeta);
      startedRef.current = true;
    }
    trackStepViewed(stepMeta);
  }, [stepMeta]);

  const navigate = useCallback(async (type, step) => {
    if (transitionRef.current) return;
    transitionRef.current = true;

    const direction = type === 'back' ? 'back' : 'next';
    const currentStepMeta = stepMetaAt(state.step);

    if (type === 'next') {
      trackNextButtonClicked(currentStepMeta, {
        next_step_key: STEPS[Math.min(state.step + 1, STEPS.length - 1)]?.key,
      });
      trackStepCompleted(currentStepMeta, {
        next_step_key: STEPS[Math.min(state.step + 1, STEPS.length - 1)]?.key,
      });
    }

    const selectedChoices =
      direction === 'next' ? getSelectedChoicesOnScreen() : [];
    const shouldCollapseChoices = selectedChoices.length > 0;

    if (shouldCollapseChoices) {
      prepareChoiceStackAnimation(selectedChoices);
      setTransition({ phase: 'choice-fade', direction, holdChoices: false });
      await wait(CHOICE_FADE_MS);
      setTransition({ phase: 'choice-stack', direction, holdChoices: false });
      await wait(getChoiceMotionDuration(true) - CHOICE_FADE_MS);
    }

    const exitTargets = prepareScreenMotionTargets();
    setTransition({
      phase: 'exit',
      direction,
      holdChoices: shouldCollapseChoices,
    });
    await wait(getScreenMotionDuration('exit', exitTargets));

    if (type === 'next') {
      setTransition({ phase: 'pre-enter', direction, holdChoices: false });
      dispatch({ type: 'next' });
    } else if (type === 'back') {
      setTransition({ phase: 'pre-enter', direction, holdChoices: false });
      dispatch({ type: 'back' });
    } else {
      setTransition({ phase: 'pre-enter', direction, holdChoices: false });
      dispatch({ type: 'goto', step });
    }

    clearChoiceStackAnimation();
    await nextFrame();
    const enterTargets = prepareScreenMotionTargets();
    setTransition({ phase: 'enter', direction, holdChoices: false });
    await wait(getScreenMotionDuration('enter', enterTargets));
    clearScreenMotionTargets();
    setTransition(idleTransition);
    transitionRef.current = false;
  }, [state.step]);

  const next = useCallback(() => navigate('next'), [navigate]);
  const back = useCallback(() => navigate('back'), [navigate]);
  const goto = useCallback((step) => navigate('goto', step), [navigate]);
  const reset = useCallback(() => dispatch({ type: 'reset' }), []);

  const value = useMemo(
    () => ({
      ...state,
      stepMeta,
      isFirst: state.step === 0,
      isLast: state.step === STEPS.length - 1,
      transition: {
        ...transition,
        isNavigating: transition.phase !== 'idle',
      },
      set,
      next,
      back,
      goto,
      reset,
    }),
    [state, stepMeta, transition, set, next, back, goto, reset],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useOnboarding() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useOnboarding must be used inside OnboardingProvider');
  return ctx;
}
