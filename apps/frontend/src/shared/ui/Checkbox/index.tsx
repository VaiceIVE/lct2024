import { Checkbox as MantineCheckbox } from '@mantine/core';
import classNames from 'classnames';

import styles from './Checkbox.module.scss';

interface CheckboxProps {
  value: string;
  label: string;
  className?: string;
  onChange?: React.Dispatch<React.SetStateAction<boolean>>;
  checked?: boolean;
}

export const Checkbox = ({
  value,
  label,
  className,
  onChange,
  checked,
}: CheckboxProps) => {
  return (
    <MantineCheckbox.Card
      className={classNames(styles.checkbox, className)}
      value={value}
      checked={checked}
      onClick={onChange ? () => onChange((prev: boolean) => !prev) : undefined}
    >
      <MantineCheckbox.Indicator />
      <label>{label}</label>
    </MantineCheckbox.Card>
  );
};
