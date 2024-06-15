import { CloseButton } from '@mantine/core';
import { DateValue, DateInput as MantineDateInput } from '@mantine/dates';

import styles from './DateInput.module.scss';

interface Props {
  onChange: (value: DateValue) => void;
  value: DateValue;
  w?: number;
  size?: string;
  h?: number;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  type?: string;
  allowClear?: boolean;
  icon?: React.ReactNode;
}

export const DateInput = ({
  onChange,
  value,
  size,
  label,
  onFocus,
  type,
  allowClear,
  icon,
  ...props
}: Props) => {
  return (
    <MantineDateInput
      type={type}
      onFocus={onFocus}
      {...props}
      onChange={onChange}
      value={value}
      className={styles.input}
      rightSectionPointerEvents="all"
      rightSection={
        allowClear ? (
          <CloseButton
            aria-label="Clear input"
            onClick={() => onChange(null)}
            style={{
              display: value ? undefined : 'none',
              marginRight: '24px',
            }}
          />
        ) : icon ? (
          icon
        ) : null
      }
    />
  );
};
