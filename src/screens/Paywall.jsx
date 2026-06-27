import { useState } from 'react';
import {
  Button,
  ScreenContainer,
  H1,
  Stars,
  Testimonial,
  AppIcon,
} from '../components/ui.jsx';
import { useOnboarding } from '../state/onboarding.jsx';
import { APP_OPTIONS } from '../state/options.js';

const PLANS = [
  { id: 'yearly',   tag: 'MOST POPULAR', label: 'Yearly',   price: '$29.99', sub: '$2.49 / mo' },
  { id: 'monthly',  tag: null,           label: 'Monthly',  price: '$4.99 / mo', sub: null },
  { id: 'lifetime', tag: null,           label: 'Lifetime', price: '$59.99', sub: 'one-time' },
];

export default function Paywall() {
  const { set, next } = useOnboarding();
  const [picked, setPicked] = useState('yearly');
  const cluster = APP_OPTIONS.slice(0, 5);

  function start() {
    set('planChoice', picked);
    next();
  }

  return (
    <ScreenContainer scroll showHeader={false}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--s-4)',
        }}
      >
        <button
          aria-label="Close"
          onClick={next}
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            color: 'var(--ink-dim)',
            fontSize: 14,
          }}
        >
          ✕
        </button>
        <div style={{ display: 'flex', gap: 'var(--s-3)', fontSize: 11, color: 'var(--ink-mute)' }}>
          <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'inherit' }}>Privacy</a>
          <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'inherit' }}>Restore</a>
          <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'inherit' }}>Terms</a>
        </div>
      </header>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--s-4)',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex' }}>
          {cluster.map((a, i) => (
            <span
              key={a.value}
              style={{
                marginLeft: i === 0 ? 0 : -10,
                opacity: 0.7,
              }}
            >
              <AppIcon app={a} />
            </span>
          ))}
        </div>
        <H1>Choose your plan</H1>
        <Stars />
        <Testimonial
          quote="It makes me pause and breathe before I scroll. That single beat changed my whole relationship to my phone."
          attribution="StillScroll user"
        />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--s-2)',
          marginTop: 'var(--s-5)',
        }}
      >
        {PLANS.map((p) => (
          <PlanRow
            key={p.id}
            plan={p}
            picked={picked === p.id}
            onPick={() => setPicked(p.id)}
          />
        ))}
      </div>

      <div style={{ marginTop: 'var(--s-5)' }}>
        <Button onClick={start} style={{ width: '100%' }}>
          Start 7-Day Free Trial
        </Button>
        <p
          style={{
            fontSize: 11,
            color: 'var(--ink-mute)',
            textAlign: 'center',
            marginTop: 'var(--s-3)',
          }}
        >
          Free for 7 days, then billed. Cancel anytime.
        </p>
      </div>
    </ScreenContainer>
  );
}

function PlanRow({ plan, picked, onPick }) {
  return (
    <button
      type="button"
      onClick={onPick}
      style={{
        position: 'relative',
        padding: 'var(--s-4)',
        background: 'var(--surface)',
        border: `1.5px solid ${picked ? 'var(--cool)' : 'var(--border)'}`,
        borderRadius: 'var(--r-md)',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--s-3)',
      }}
    >
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          border: `1.5px solid ${picked ? 'var(--cool)' : 'var(--border-strong)'}`,
          background: picked ? 'var(--cool)' : 'transparent',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 10,
          color: '#06121a',
        }}
      >
        {picked ? '✓' : ''}
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)' }}>
          <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{plan.label}</span>
          {plan.tag && (
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 0.08,
                padding: '2px 6px',
                borderRadius: 'var(--r-pill)',
                background: 'var(--cool-soft)',
                color: 'var(--cool-strong)',
                border: '1px solid var(--cool-line)',
                textTransform: 'uppercase',
              }}
            >
              {plan.tag}
            </span>
          )}
        </div>
        {plan.sub && (
          <div style={{ fontSize: 12, color: 'var(--ink-dim)', marginTop: 2 }}>
            {plan.sub}
          </div>
        )}
      </div>
      <span style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 600 }}>
        {plan.price}
      </span>
    </button>
  );
}
