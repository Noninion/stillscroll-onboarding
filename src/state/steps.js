// Flow registry — single source of truth for step order, progress %, and
// whether the progress bar is visible. The plan reference is the section
// number in stillscroll-onboarding-plan.md.

export const STEPS = [
  { key: 'splash',        title: 'Splash + ATT',                showProgress: false },
  { key: 'quiz_intro',    title: 'Quiz intro',                  showProgress: false },
  { key: 'name',          title: 'Name',                        showProgress: true,  progress: 5  },
  { key: 'goals',         title: 'Goals',                       showProgress: true,  progress: 12 },
  { key: 'current_usage', title: 'Current phone usage',         showProgress: true,  progress: 25 },
  { key: 'target_usage',  title: 'Target phone usage',          showProgress: true,  progress: 30 },
  { key: 'social_proof',  title: 'Social proof gate',           showProgress: false },
  { key: 'apps',          title: 'Distracting apps',            showProgress: true,  progress: 38 },
  { key: 'hooks',         title: 'Why hard to put down',        showProgress: true,  progress: 45 },
  { key: 'emotions',      title: 'Emotional impact',            showProgress: true,  progress: 55 },
  { key: 'state_compare', title: 'Current state → after',       showProgress: false },
  { key: 'age',           title: 'Age',                         showProgress: true,  progress: 62 },
  { key: 'diagnostic',    title: 'Calm diagnostic',             showProgress: false },
  { key: 'life_math',     title: 'Life math',                   showProgress: false },
  { key: 'reframe',       title: 'Reframe to hope',             showProgress: false },
  { key: 'tried',         title: "What you've tried",           showProgress: true,  progress: 75 },
  { key: 'why_failed',    title: 'Why those failed',            showProgress: true,  progress: 78 },
  { key: 'pitch',         title: 'Replace, not quit',           showProgress: false },
  { key: 'mechanic',      title: 'Breathe → Scroll',            showProgress: false },
  { key: 'routine',       title: 'Routine commit',              showProgress: true,  progress: 82 },
  { key: 'practice_cta',  title: 'First practice CTA',          showProgress: false },
  { key: 'setup',         title: 'Setup tutorial',              showProgress: false },
  { key: 'practice',      title: 'First practice — breath',     showProgress: false },
  { key: 'baseline',      title: 'Practice baseline',           showProgress: true,  progress: 85 },
  { key: 'transition',    title: 'Transition',                  showProgress: false },
  { key: 'pre_st',        title: 'Pre-prompt: Screen Time',     showProgress: false },
  { key: 'native_st',     title: 'Native Screen Time prompt',   showProgress: false },
  { key: 'confirm_st',    title: 'Permission confirmation',     showProgress: false },
  { key: 'apps_intro',    title: 'App selection intro',         showProgress: false },
  { key: 'family_picker', title: 'Family Controls picker',      showProgress: false },
  { key: 'notif',         title: 'Notification permission',     showProgress: false },
  { key: 'rating',        title: 'Rating ask',                  showProgress: false },
  { key: 'account',       title: 'Account creation',            showProgress: false },
  { key: 'calculating',   title: 'Calculating',                 showProgress: false },
  { key: 'plan',          title: 'Plan reveal',                 showProgress: false },
  { key: 'sales',         title: 'Sales montage',               showProgress: false },
  { key: 'paywall',       title: 'Paywall',                     showProgress: false },
];

export const stepIndexByKey = STEPS.reduce((acc, s, i) => {
  acc[s.key] = i;
  return acc;
}, {});
