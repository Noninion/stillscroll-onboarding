import { useEffect, useState } from 'react';
import { ScreenContainer, H1, Sub } from '../components/ui.jsx';
import { useOnboarding } from '../state/onboarding.jsx';

const TOTAL_MS = 3000;

export default function Calculating() {
  const { next } = useOnboarding();
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf;
    function tick(t) {
      const p = Math.min(1, (t - start) / TOTAL_MS);
      setPct(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(next, 250);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [next]);

  return (
    <ScreenContainer showHeader={false}>
      <div
        style={{
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--s-6)',
          textAlign: 'center',
        }}
      >
        <H1>Building your plan</H1>
        <Ring pct={pct} />
        <Sub>📋 Finalizing</Sub>
      </div>
    </ScreenContainer>
  );
}

function Ring({ pct }) {
  const size = 140;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - pct / 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="var(--cool-strong)"
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={off}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 80ms linear' }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="var(--font-display)"
        fontSize="28"
        fontWeight="700"
        fill="var(--ink)"
      >
        {pct}%
      </text>
    </svg>
  );
}
