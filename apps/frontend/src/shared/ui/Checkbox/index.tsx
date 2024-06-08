import { Checkbox as MantineCheckbox } from '@mantine/core';

import styles from './Checkbox.module.scss';

interface CheckboxProps {
  value: string;
  label: string;
}

export const Checkbox = ({ value, label }: CheckboxProps) => {
  return (
    <MantineCheckbox.Card className={styles.checkbox} value={value}>
      <MantineCheckbox.Indicator />
      <label>{label}</label>
    </MantineCheckbox.Card>
  );
};
