import { Flex } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

import styles from './PredictionDatePicker.module.scss';
import classNames from 'classnames';

interface PredictionDatePickerProps {
  monthsIndex: number;
  setMonthsIndex: React.Dispatch<React.SetStateAction<number>>;
  months: { label: string; value: number }[];
}

export const PredictionDatePicker = ({
  months,
  monthsIndex,
  setMonthsIndex,
}: PredictionDatePickerProps) => {
  const isLeft = monthsIndex > 0;
  const isRight = monthsIndex < months.length - 1;

  return (
    <Flex className={styles.wrapper} gap={12} align={'center'}>
      <IconChevronLeft
        onClick={
          isLeft ? () => setMonthsIndex((prev: number) => prev - 1) : undefined
        }
        className={classNames(styles.icon, !isLeft && styles.disabled)}
        width={24}
        height={24}
      />
      <div className={classNames(styles.date, 'text medium')}>
        {months[monthsIndex].label}
      </div>
      <IconChevronRight
        onClick={
          isRight ? () => setMonthsIndex((prev: number) => prev + 1) : undefined
        }
        className={classNames(styles.icon, !isRight && styles.disabled)}
        width={24}
        height={24}
      />
    </Flex>
  );
};
