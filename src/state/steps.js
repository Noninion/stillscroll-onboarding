// Web-funnel flow — single source of truth for step order, progress % and
// progress-bar visibility.
//
// Dropped vs. iOS build:
//   routine, practice_cta, setup, practice, baseline, transition,
//   pre_st, native_st, confirm_st, apps_intro, family_picker,
//   notif, rating, account, sales (→ kept), paywall (→ replaced by
//   email_capture + waitlist).

export const STEPS = [
  { key: 'splash',        title: 'Splash',                      showProgress: false },
  // { key: 'quiz_intro',    title: 'Quiz intro',                  showProgress: false },
  // { key: 'name',          title: 'Name',                        showProgress: true,  progress: 5  },
  // { key: 'goals',         title: 'Goals',                       showProgress: true,  progress: 12 },
  // { key: 'current_usage', title: 'Current phone usage',         showProgress: true,  progress: 22 },
  // { key: 'target_usage',  title: 'Target phone usage',          showProgress: true,  progress: 30 },
  // { key: 'social_proof',  title: 'Social proof gate',           showProgress: false },
  // { key: 'apps',          title: 'Distracting apps',            showProgress: true,  progress: 40 },
  // { key: 'hooks',         title: 'Why hard to put down',        showProgress: true,  progress: 50 },
  // { key: 'emotions',      title: 'Emotional impact',            showProgress: true,  progress: 58 },
  // { key: 'state_compare', title: 'Current state → after',       showProgress: false },
  // { key: 'age',           title: 'Age',                         showProgress: true,  progress: 65 },
  // { key: 'diagnostic',    title: 'Calm diagnostic',             showProgress: false },
  // { key: 'life_math',     title: 'Life math',                   showProgress: false },
  // { key: 'reframe',       title: 'Reframe to hope',             showProgress: false },
  // { key: 'tried',         title: "What you've tried",           showProgress: true,  progress: 75 },
  // { key: 'why_failed',    title: 'Why those failed',            showProgress: true,  progress: 80 },
  // { key: 'pitch',         title: 'Replace, not quit',           showProgress: false },
  // { key: 'mechanic',      title: 'Breathe → Scroll',            showProgress: false },
  // { key: 'calculating',   title: 'Calculating your plan',       showProgress: false },
  // { key: 'plan',          title: 'Plan reveal',                 showProgress: false },
  { key: 'email_capture', title: 'Join the waitlist',           showProgress: false },
  { key: 'waitlist',      title: 'Waitlist confirmation',       showProgress: false },
];

export const stepIndexByKey = STEPS.reduce((acc, s, i) => {
  acc[s.key] = i;
  return acc;
}, {});
