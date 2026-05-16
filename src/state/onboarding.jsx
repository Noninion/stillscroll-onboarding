import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import { STEPS } from './steps.js';

const initialAnswers = {
  // step 0
  attConsent: null,
  // step 2
  name: '',
  // step 3
  goals: [],
  // step 4
  currentHours: 4,
  // step 5
  targetHours: 3,
  // step 7
  distractingApps: [],
  // step 8
  hooks: [],
  // step 9
  emotions: [],
  // step 11
  ageBucket: null,
  // step 15
  pastAttempts: [],
  // step 19
  reminderTime: '22:00',
  // step 23
  practiceFrequency: null,
  // permissions
  screenTimePermission: null,
  notificationPermission: null,
  familyControlsSelection: null,
  // step 32
  authMethod: null,
  // step 36
  planChoice: null,
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
