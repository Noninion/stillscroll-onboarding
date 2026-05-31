import {
  Button,
  ScreenContainer,
  H1,
  Body,
  FooterNote,
} from '../components/ui.jsx';
import { useOnboarding } from '../state/onboarding.jsx';
import { diagnosticVariant } from '../state/options.js';

// Four diagnostic moods.  Picked by `diagnosticVariant()` on a best-effort
// read of the first emotion (with hooks as fallback).
const VARIANTS = {
  hot: {
    title: 'Your system has been running hot.',
    body: 'Based on your answers, your nervous system is spending a lot of time in a low-grade stress state.',
  },
  low: {
    title: "You've been running on empty.",
    body: "When the brain gets constant input without recovery, it stops registering rest — even when you're sitting still.",
  },
  absent: {
    title: "You've been somewhere else.",
    body: "Your attention's been pulled away from your own life — into other people's lives, feeds, and headlines — for hours every day.",
  },
  measuring: {
    title: "You've been measuring yourself against the wrong yardstick.",
    body: 'Constant comparison is wired into our attention. It distorts what you feel about yourself — and you barely notice it happening.',
  },
};

export default function Diagnostic() {
  const { answers, next } = useOnboarding();
  const variant = diagnosticVariant(answers.emotions, answers.hooks);
  const { title, body } = VARIANTS[variant];

  return (
    <ScreenContainer
      tone="warm"
      footer={<Button onClick={next}>Continue</Button>}
    >
      <div
        style={{
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--s-6)',
          justifyContent: 'center',
        }}
      >
        <H1 lg>{title}</H1>
        <Body>{body}</Body>
        <Waves />
        <FooterNote>This isn't a clinical diagnosis.</FooterNote>
      </div>
    </ScreenContainer>
  );
}

function Waves() {
  return (
    <svg
      viewBox="0 0 300 120"
      width="100%"
      height="140"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id="warmStroke" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="var(--warm)" stopOpacity="0.5" />
          <stop offset="50%" stopColor="var(--warm-strong)" />
          <stop offset="100%" stopColor="var(--warm)" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="coolStroke" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="var(--cool)" stopOpacity="0.5" />
          <stop offset="50%" stopColor="var(--cool-strong)" />
          <stop offset="100%" stopColor="var(--cool)" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* Current: high-amplitude, jagged */}
      <path
        d="M0,40 L20,12 L34,58 L48,18 L62,52 L78,8 L94,46 L110,22 L128,54 L148,16 L168,50 L188,18 L210,58 L232,14 L254,52 L276,20 L300,42"
        fill="none"
        stroke="url(#warmStroke)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Settled: low-amplitude, smooth */}
      <path
        d="M0,92 Q40,82 80,92 T160,92 T240,92 T300,92"
        fill="none"
        stroke="url(#coolStroke)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
