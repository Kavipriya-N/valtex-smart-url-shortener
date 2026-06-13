import { useState } from 'react';

/**
 * FormInput — Reusable premium input component for VΛLTEX
 * Handles: text, email, password, url, date, search, number
 * Features: floating label, show/hide password, error state,
 *           prefix icon, hint text, autofill fix
 */
export default function FormInput({
  id,
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  onBlur,
  error,
  hint,
  icon,
  required = false,
  disabled = false,
  autoComplete,
  maxLength,
  className = '',
  style = {},
  showStrength = false,
}) {
  const [showPass, setShowPass] = useState(false);
  const [strength, setStrength] = useState('');
  const inputType = type === 'password' && showPass ? 'text' : type;

  const checkStrength = (val) => {
    if (!val) return setStrength('');
    if (val.length < 6) return setStrength('weak');
    if (val.length < 10 || !/[A-Z]/.test(val) || !/[0-9]/.test(val))
      return setStrength('fair');
    setStrength('strong');
  };

  const handleChange = (e) => {
    if (showStrength && type === 'password') checkStrength(e.target.value);
    onChange?.(e);
  };

  return (
    <div className={`fg ${className}`} style={style}>
      {label && (
        <label htmlFor={id}>
          {label}
          {required && <span style={{ color: '#EF4444', marginLeft: 3 }}>*</span>}
        </label>
      )}

      <div className={icon ? 'fi-icon-wrap' : 'input-wrapper'}>
        {icon && <span className="fi-icon" aria-hidden="true">{icon}</span>}

        <input
          className={`fi ${error ? 'error' : ''}`}
          id={id}
          name={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        />

        {type === 'password' && (
          <button
            type="button"
            className="input-eye-btn"
            onClick={() => setShowPass(p => !p)}
            aria-label={showPass ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPass ? '👁' : '🔒'}
          </button>
        )}
      </div>

      {showStrength && type === 'password' && strength && (
        <div className="pw-strength">
          <div className="pw-strength-bar">
            <div className={`pw-strength-fill ${strength}`} />
          </div>
          <span className={`pw-strength-label ${strength}`}>
            {strength === 'weak' ? '⚠ Weak' : strength === 'fair' ? '◑ Fair' : '✓ Strong'}
          </span>
        </div>
      )}

      {error && (
        <span className="fi-error-msg" id={`${id}-error`} role="alert">
          ⚠ {error}
        </span>
      )}

      {hint && !error && (
        <span className="fi-hint" id={`${id}-hint`}>{hint}</span>
      )}
    </div>
  );
}
