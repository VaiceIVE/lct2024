import { SegmentedControl as MantineSegmentControl } from '@mantine/core';

import styles from './SegmentControl.module.scss';

interface SegmentControlProps {
  onChange: (value: string) => void;
  value: string;
}

export const SegmentControl = ({ onChange, value }: SegmentControlProps) => {
  return (
    <MantineSegmentControl
      value={value}
      onChange={onChange}
      className={styles.segment}
      data={['Район', 'ЦТП/ИТП', 'Дома']}
    />
  );
};
