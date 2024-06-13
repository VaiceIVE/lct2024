import { Flex, Radio as MantineRadio } from '@mantine/core';

import styles from './Radio.module.scss';

interface RadioProps {
  label: string;
  value: string;
}

export const Radio = ({ label, value }: RadioProps) => {
  return (
    <MantineRadio.Card value={value} className={styles.radio}>
      <Flex align={'center'} gap={8}>
        <MantineRadio.Indicator />
        <p className="text medium">{label}</p>
      </Flex>
    </MantineRadio.Card>
  );
};
