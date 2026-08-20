'use client';

import ReactSelect, { type Props as ReactSelectProps, type SingleValue } from 'react-select';
import { classNames } from '@/lib/format';
import { useMemo } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectProps extends Omit<ReactSelectProps<SelectOption, false>, 'options' | 'value' | 'onChange' | 'isRtl' | 'theme'> {
  label?: string;
  options: SelectOption[];
  value?: string | number;
  onChange?: (value: string | number | null) => void;
  error?: string;
}

export function Select({
  label,
  options,
  value,
  onChange,
  placeholder,
  error,
  className,
  ...props
}: SelectProps) {
  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value]
  );
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={classNames('w-full', className)}>
      {label && <label className="label">{label}</label>}
      <ReactSelect
        options={options}
        value={selectedOption}
        onChange={(option: SingleValue<SelectOption>) => {
          if (!onChange) return;
          onChange(option?.value ?? null);
        }}
        placeholder={placeholder}
        classNamePrefix="react-select"
        isRtl
        styles={{
          control: (base, state) => ({
            ...base,
            minHeight: 48,
            height: 48,
            borderRadius: 16,
            borderColor: state.isFocused ? '#6366f1' : isDark ? '#334155' : '#cbd5e1',
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.6)' : 'white',
            boxShadow: 'none',
            fontSize: '0.95rem',
            '&:hover': {
              borderColor: isDark ? '#475569' : '#94a3b8',
            },
          }),
          valueContainer: (base) => ({
            ...base,
            height: 48,
            padding: '0 0.75rem',
          }),
          singleValue: (base) => ({
            ...base,
            color: isDark ? '#f1f5f9' : '#0f172a',
            textAlign: 'right',
            fontSize: '0.8rem',
            lineHeight: '1.25rem',
          }),
          input: (base) => ({
            ...base,
            color: isDark ? '#f1f5f9' : '#0f172a',
          }),
          menu: (base) => ({
            ...base,
            borderRadius: 16,
            marginTop: 4,
            backgroundColor: isDark ? '#0f172a' : 'white',
            border: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
          }),
          option: (base, state) => ({
            ...base,
            textAlign: 'right',
            direction: 'rtl',
            backgroundColor: state.isFocused
              ? isDark ? 'rgba(99, 102, 241, 0.2)' : '#e0e7ff'
              : 'transparent',
            color: isDark ? '#f1f5f9' : '#0f172a',
            fontSize: '0.8rem',
          }),
          placeholder: (base) => ({
            ...base,
            color: isDark ? '#64748b' : '#94a3b8',
            textAlign: 'right',
            fontSize: '0.95rem',
          }),
          indicatorSeparator: (base) => ({
            ...base,
            backgroundColor: isDark ? '#334155' : '#e2e8f0',
          }),
          dropdownIndicator: (base) => ({
            ...base,
            color: isDark ? '#64748b' : '#94a3b8',
          }),
        }}
        theme={(t) => ({
          ...t,
          borderRadius: 16,
          colors: {
            ...t.colors,
            primary: '#4338ca',
            primary25: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.12)',
            primary50: 'rgba(99, 102, 241, 0.2)',
            neutral0: isDark ? '#0f172a' : '#fff',
            neutral20: isDark ? '#334155' : '#cbd5e1',
            neutral30: isDark ? '#475569' : '#94a3b8',
            neutral80: isDark ? '#f1f5f9' : '#0f172a',
          },
        })}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  );
}
