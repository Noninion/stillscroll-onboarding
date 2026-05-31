import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import { STEPS } from './steps.js';

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
    case 'set':
      return {
        ...state,
        answers: { ...state.answers, [action.field]: action.value },
      };
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

export function OnboardingProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial);

  const set = useCallback(
    (field, value) => dispatch({ type: 'set', field, value }),
    [],
  );
  const next = useCallback(() => dispatch({ type: 'next' }), []);
  const back = useCallback(() => dispatch({ type: 'back' }), []);
  const goto = useCallback((step) => dispatch({ type: 'goto', step }), []);
  const reset = useCallback(() => dispatch({ type: 'reset' }), []);

  const value = useMemo(
    () => ({
      ...state,
      stepMeta: STEPS[state.step],
      isFirst: state.step === 0,
      isLast: state.step === STEPS.length - 1,
      set,
      next,
      back,
      goto,
      reset,
    }),
    [state, set, next, back, goto, reset],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useOnboarding() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useOnboarding must be used inside OnboardingProvider');
  return ctx;
}
