import { useEffect, useLayoutEffect, useRef } from 'react';
import './Wheel.css';

const ITEM_H = 44;

// Single scrolling column. `items` is an array of values; `value` must be one
// of them. Calls `onChange(items[i])` when the user lands on a new index.
export function WheelColumn({ items, value, onChange, format = (v) => v }) {
  const ref = useRef(null);
  const timer = useRef(null);
  const selectedIdx = Math.max(0, items.indexOf(value));

  useLayoutEffect(() => {
    if (ref.current) ref.current.scrollTop = selectedIdx * ITEM_H;
    // Only on mount — programmatic scrolls on value change would fight the
    // user's in-progress flick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  function handleScroll() {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const idx = Math.round(el.scrollTop / ITEM_H);
      const clamped = Math.max(0, Math.min(items.length - 1, idx));
      if (items[clamped] !== value) onChange(items[clamped]);
      // Snap to exact position in case the browser left us slightly off.
      const target = clamped * ITEM_H;
      if (Math.abs(el.scrollTop - target) > 0.5) {
        el.scrollTo({ top: target, behavior: 'smooth' });
      }
    }, 90);
  }

  function jumpTo(i) {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ top: i * ITEM_H, behavior: 'smooth' });
    if (items[i] !== value) onChange(items[i]);
  }

  return (
    <div className="wheel" ref={ref} onScroll={handleScroll}>
      <div className="wheel__list">
        {items.map((it, i) => {
          const distance = Math.abs(i - selectedIdx);
          const cls =
            distance === 0
              ? 'wheel__item wheel__item--selected'
              : distance === 1
                ? 'wheel__item wheel__item--neighbor'
                : 'wheel__item';
          return (
            <div key={it} className={cls} onClick={() => jumpTo(i)}>
              {format(it)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Two-column hour/minute picker. Value is a "HH:MM" string (24-hour).
export function TimeWheel({ value, onChange }) {
  const [hh, mm] = value.split(':').map((s) => parseInt(s, 10));
  const safeHH = Number.isFinite(hh) ? hh : 22;
  const safeMM = Number.isFinite(mm) ? mm : 0;

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const pad = (n) => String(n).padStart(2, '0');

  function setHour(h) {
    onChange(`${pad(h)}:${pad(safeMM)}`);
  }
  function setMinute(m) {
    onChange(`${pad(safeHH)}:${pad(m)}`);
  }

  return (
    <div className="wheel-group" role="group" aria-label="Practice time">
      <div className="wheel-group__selector" aria-hidden="true" />
      <WheelColumn
        items={hours}
        value={safeHH}
        onChange={setHour}
        format={pad}
      />
      <span className="wheel-group__divider" aria-hidden="true">
        :
      </span>
      <WheelColumn
        items={minutes}
        value={safeMM}
        onChange={setMinute}
        format={pad}
      />
    </div>
  );
}
