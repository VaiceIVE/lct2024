import { SegmentedControl as MantineSegmentControl } from '@mantine/core';

import styles from './SegmentControl.module.scss';

interface SegmentControlProps {
  onChange: (value: string) => void;
  value: string;
  data: string[];
  disabled?: boolean;
}

export const SegmentControl = ({
  onChange,
  value,
  data,
  disabled,
}: SegmentControlProps) => {
  return (
    <MantineSegmentControl
      value={value}
      onChange={onChange}
      className={styles.segment}
      data={data}
      disabled={disabled}
    />
  );
};
