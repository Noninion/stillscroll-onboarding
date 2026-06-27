import { useEffect, useState } from 'react';
import { Button } from '../components/ui.jsx';
import { useOnboarding } from '../state/onboarding.jsx';
import './Splash.css';

const SLIDES = 3;
const SLIDE_MS = 3200;

export default function Splash() {
  const { next } = useOnboarding();
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDES), SLIDE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="splash">
      <div className="splash__brand">StillScroll</div>

      <h1 className="splash__title">
        Replace <span className="warm">Doomscrolling</span> with{' '}
        <span className="cool">Stillness</span>.
      </h1>

      <div className="splash__hero">
        <div className="mock" aria-hidden="true">
          <div className={`mock__slide${slide === 0 ? ' mock__slide--active' : ''}`}>
            <div className="mock__circle">Inhale</div>
            <div className="mock__counter">Round 1 of 4</div>
          </div>
          <div className={`mock__slide${slide === 1 ? ' mock__slide--active' : ''}`}>
            <div className="mock__toast">
              <strong>60 seconds of breath</strong> → 5 minutes of scroll.
            </div>
          </div>
          <div className={`mock__slide${slide === 2 ? ' mock__slide--active' : ''}`}>
            <div className="mock__lock">
              <span className="mock__lock-icon">✕</span>
              <span className="mock__lock-title">Instagram is paused</span>
              <span className="mock__lock-sub">One minute of breath to continue.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="splash__dots" aria-hidden="true">
        {Array.from({ length: SLIDES }).map((_, i) => (
          <span
            key={i}
            className={`splash__dot${i === slide ? ' splash__dot--active' : ''}`}
          />
        ))}
      </div>

      <Button onClick={next} style={{ width: '100%' }}>
        Get Started
      </Button>
    </div>
  );
}
