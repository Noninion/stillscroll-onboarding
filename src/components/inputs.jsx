import { useEffect, useRef } from 'react';
import './inputs.css';

export function TextInput({ value, onChange, placeholder, autoFocus = false }) {
  const ref = useRef(null);
  useEffect(() => {
    if (autoFocus && ref.current) ref.current.focus();
  }, [autoFocus]);
  return (
    <input
      ref={ref}
      type="text"
      className="text-input motion-item"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoCapitalize="words"
      autoComplete="off"
      spellCheck={false}
    />
  );
}

export function ChoiceList({
  options,
  value,
  onChange,
  max = 1,
  autoAdvance = false,
  onAutoAdvance,
  renderIcon,
  className = '',
}) {
  const isMulti = max > 1;
  const selected = isMulti ? value : value != null ? [value] : [];

  function toggle(optValue) {
    if (!isMulti) {
      onChange(optValue);
      if (autoAdvance && onAutoAdvance) {
        setTimeout(() => onAutoAdvance(optValue), 0);
      }
      return;
    }
    const has = selected.includes(optValue);
    if (has) {
      onChange(selected.filter((v) => v !== optValue));
    } else {
      if (selected.length >= max) return;
      onChange([...selected, optValue]);
    }
  }

  return (
    <div
      className={`choice-list motion-item${className ? ` ${className}` : ''}`}
      role={isMulti ? 'group' : 'radiogroup'}
    >
      {options.map((opt) => {
        const isSelected = selected.includes(opt.value);
        const atCap = isMulti && !isSelected && selected.length >= max;
        return (
          <button
            key={opt.value}
            type="button"
            role={isMulti ? 'checkbox' : 'radio'}
            aria-checked={isSelected}
            className={`choice${isSelected ? ' choice--selected' : ''}`}
            disabled={atCap}
            onClick={() => toggle(opt.value)}
          >
            {renderIcon ? (
              renderIcon(opt)
            ) : (
              <span className="choice__check" aria-hidden="true">
                ✓
              </span>
            )}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function HourSlider({ value, onChange, tone = 'cool', min = 1, max = 12 }) {
  const range = max - min;
  const fill = range > 0 ? ((value - min) / range) * 100 : 100;
  return (
    <div className="slider motion-item">
      <div
        className={`slider__value slider__value--${tone}`}
        aria-hidden="true"
      >
        {value}
        <span style={{ fontSize: 28, marginLeft: 4 }}>h</span>
      </div>
      <span className="slider__unit">per day</span>
      <input
        type="range"
        className="slider__input"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        style={{
          '--fill': `${fill}%`,
          '--track-color': tone === 'warm' ? 'var(--warm)' : 'var(--cool)',
        }}
        aria-label="Hours per day"
      />
      <div className="slider__scale">
        <span>{min}h</span>
        <span>{max}h</span>
      </div>
    </div>
  );
}
