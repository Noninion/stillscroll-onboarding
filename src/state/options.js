// Shared option lists for the quiz steps. Centralized so screens that
// reference each other's selections (e.g. step 8 quoting the first chosen
// app) can look up labels by value without duplicating arrays.

export const GOAL_OPTIONS = [
  { value: 'reduce_screen_time', label: 'Reduce screen time' },
  { value: 'stop_late_night',    label: 'Stop late-night / early-morning scrolling' },
  { value: 'self_control',       label: 'Build self-control' },
  { value: 'focus',              label: 'Better focus' },
  { value: 'less_anxiety',       label: 'Less anxiety' },
  { value: 'sleep',              label: 'Sleep better' },
  { value: 'present',            label: 'Be more present' },
  { value: 'stress',             label: 'Manage stress' },
  { value: 'deliberate',         label: 'Less reactive, more deliberate' },
  { value: 'reconnect',          label: 'Reconnect with what I was doing before I picked up the phone' },
];

export const APP_OPTIONS = [
  { value: 'tiktok',     label: 'TikTok',          glyph: 'T', tint: '#1f2230' },
  { value: 'youtube',    label: 'YouTube',         glyph: 'Y', tint: '#3a1e1e' },
  { value: 'instagram',  label: 'Instagram',       glyph: 'I', tint: '#33223a' },
  { value: 'facebook',   label: 'Facebook',        glyph: 'F', tint: '#1c2538' },
  { value: 'games',      label: 'Mobile games',    glyph: 'G', tint: '#2a2233' },
  { value: 'twitter',    label: 'Twitter (X)',     glyph: 'X', tint: '#171a23' },
  { value: 'reddit',     label: 'Reddit',          glyph: 'R', tint: '#3a2618' },
  { value: 'discord',    label: 'Discord',         glyph: 'D', tint: '#1f2238' },
  { value: 'shopping',   label: 'Online shopping', glyph: 'S', tint: '#1f2a2a' },
  { value: 'twitch',     label: 'Twitch',          glyph: 'T', tint: '#251c33' },
  { value: 'streaming',  label: 'Netflix (or other streaming)', glyph: 'N', tint: '#2c1818' },
];

export const HOOK_OPTIONS = [
  { value: 'fomo',           label: 'FOMO' },
  { value: 'addictive',      label: 'Addictive app design (infinite scroll, algorithm, notifications)' },
  { value: 'automatic',      label: "It's just automatic" },
  { value: 'boredom',        label: 'Fills boring moments' },
  { value: 'procrastinate',  label: 'Procrastinating harder tasks' },
  { value: 'cope',           label: 'Coping with stress / low mood' },
  { value: 'calms_me',       label: 'It calms me down' },
  { value: 'numb',           label: 'Helps me not feel' },
  { value: 'compare',        label: 'Comparing myself to others' },
  { value: 'work_requires',  label: 'My job requires me online' },
  { value: 'too_easy',       label: "It's too easy to reach" },
];

export const EMOTION_OPTIONS = [
  { value: 'irritable',         label: 'Irritable' },
  { value: 'not_present',       label: 'Not present' },
  { value: 'mentally_drained',  label: 'Mentally drained' },
  { value: 'regretful',         label: 'Regretful' },
  { value: 'empty',             label: 'Empty' },
  { value: 'powerless',         label: 'Powerless' },
  { value: 'anxious',           label: 'Anxious' },
  { value: 'insecure',          label: 'Insecure' },
  { value: 'overstimulated',    label: 'Overstimulated' },
  { value: 'wired_tired',       label: 'Wired and tired' },
];

export const AGE_OPTIONS = [
  { value: 'under_18',  label: 'Under 18' },
  { value: '18_24',     label: '18–24' },
  { value: '25_29',     label: '25–29' },
  { value: '30_40',     label: '30–40' },
  { value: '40_plus',   label: '40 and over' },
];

export const PAST_OPTIONS = [
  { value: 'nothing',      label: 'Nothing yet' },
  { value: 'limiters',     label: 'Screen time limiters' },
  { value: 'uninstall',    label: 'Uninstalling addictive apps' },
  { value: 'browser_only', label: 'Browser-only version' },
  { value: 'detox',        label: 'Digital detox' },
  { value: 'grayscale',    label: 'Grayscale mode' },
  { value: 'mindset',      label: 'Working on mindset' },
  { value: 'out_of_reach', label: 'Keeping phone out of reach' },
  { value: 'dumb_phone',   label: 'Buying a dumb phone' },
  { value: 'routines',     label: 'Morning / night routines' },
  { value: 'meditation',   label: 'Meditation apps (used briefly)' },
  { value: 'nfc',          label: 'NFC tag to block apps' },
];

export const BASELINE_OPTIONS = [
  { value: 'never',       label: 'Never' },
  { value: 'few_times',   label: 'Tried once or twice' },
  { value: 'occasional',  label: 'Occasionally' },
  { value: 'regular',     label: 'I have a regular practice' },
];

export function labelFor(options, value) {
  return options.find((o) => o.value === value)?.label ?? '';
}

export function appFor(value) {
  return APP_OPTIONS.find((o) => o.value === value) ?? null;
}

// Maps the user's first matching goal to its settled-state chip. Falls
// back to "Settled" so the chip always renders.
export function stateChipFromGoals(goals) {
  const map = {
    less_anxiety: 'Steady',
    present:      'Present',
    focus:        'Clear',
    sleep:        'Restful',
    stress:       'Grounded',
  };
  for (const g of goals) {
    if (map[g]) return map[g];
  }
  return 'Settled';
}

// Maps the user's first picked emotion to its "with StillScroll" counterpart.
// Used by StateCompare so the cool-side chip directly answers the warm-side
// emotion the user just selected.
export function settledChipFromEmotion(emotion) {
  const map = {
    irritable:        'Calm',
    not_present:      'Present',
    mentally_drained: 'Restored',
    regretful:        'At peace',
    empty:            'Filled',
    powerless:        'In control',
    anxious:          'Grounded',
    insecure:         'Steady',
    overstimulated:   'Settled',
    wired_tired:      'Rested',
  };
  return map[emotion] ?? 'Settled';
}

// Maps each emotion to a different research citation + one-line takeaway, so
// the "Research" card on StateCompare speaks to what the user just selected
// instead of repeating the same generic line.
export function researchForEmotion(emotion) {
  const map = {
    irritable: {
      text: 'Mindful breathing reduces emotional reactivity and short-fuse responses.',
      cite: 'Goyal et al., JAMA Internal Medicine, 2014',
    },
    anxious: {
      text: 'Mindfulness-based interventions show robust effects on anxiety symptoms.',
      cite: 'Hofmann et al., Journal of Consulting and Clinical Psychology, 2010',
    },
    mentally_drained: {
      text: 'Brief mindfulness training measurably improves attention and reduces mental fatigue.',
      cite: 'Zeidan et al., Consciousness and Cognition, 2010',
    },
    overstimulated: {
      text: 'Slow breathing engages the parasympathetic nervous system within minutes.',
      cite: 'Russo et al., Breathe, 2017',
    },
    not_present: {
      text: 'Mindfulness training strengthens present-moment awareness and reduces mind-wandering.',
      cite: 'Mrazek et al., Psychological Science, 2013',
    },
    regretful: {
      text: 'Self-compassion practice reduces rumination and self-critical thought loops.',
      cite: 'Neff & Germer, Journal of Clinical Psychology, 2013',
    },
    empty: {
      text: 'Mindful awareness correlates with greater meaning and life satisfaction.',
      cite: 'Brown & Ryan, Journal of Personality and Social Psychology, 2003',
    },
    powerless: {
      text: 'Breath-based interventions improve perceived self-agency and reduce reactivity.',
      cite: 'Streeter et al., Medical Hypotheses, 2012',
    },
    insecure: {
      text: 'Self-compassion practice predicts lower self-criticism and higher resilience.',
      cite: 'MacBeth & Gumley, Clinical Psychology Review, 2012',
    },
    wired_tired: {
      text: 'Slow breathing improves heart-rate variability and parasympathetic tone.',
      cite: 'Lehrer & Gevirtz, Frontiers in Psychology, 2014',
    },
  };
  return (
    map[emotion] ?? {
      text: 'Mindfulness practices reduce anxiety and improve sustained attention.',
      cite: 'Goyal et al., JAMA Internal Medicine, 2014',
    }
  );
}

// Picks the Diagnostic-screen variant on a best-effort read of the user's
// first emotion, with hooks used as a fallback signal when no emotion was
// chosen.  Returns one of: 'hot' | 'low' | 'absent' | 'measuring'.
export function diagnosticVariant(emotions, hooks) {
  const e = emotions?.[0];

  if (['anxious', 'wired_tired', 'overstimulated', 'irritable'].includes(e)) {
    return 'hot';
  }
  if (['mentally_drained', 'empty', 'powerless'].includes(e)) {
    return 'low';
  }
  if (['not_present', 'regretful'].includes(e)) {
    return 'absent';
  }
  if (e === 'insecure' || hooks?.includes('compare')) {
    return 'measuring';
  }
  // Hook-based fallback when no emotion was picked
  if (hooks?.includes('cope') || hooks?.includes('numb')) return 'low';
  if (hooks?.includes('boredom') || hooks?.includes('automatic')) return 'absent';
  return 'hot';
}

// Short label used in chips (e.g. on the social-proof reflect screen).
// Most goal labels are already short; the two long ones get a tighter form.
export function shortGoalLabel(value) {
  const shorts = {
    reduce_screen_time: 'Less screen time',
    stop_late_night:    'No late-night scroll',
    self_control:       'Self-control',
    focus:              'Focus',
    less_anxiety:       'Less anxiety',
    sleep:              'Sleep better',
    present:            'Be present',
    stress:             'Manage stress',
    deliberate:         'Deliberate',
    reconnect:          'Reconnect',
  };
  return shorts[value] ?? labelFor(GOAL_OPTIONS, value);
}
