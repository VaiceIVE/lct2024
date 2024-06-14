import { Flex, useMantineTheme } from '@mantine/core';
import { IconSortDescending, IconSortAscending } from '@tabler/icons-react';

import styles from './PriorityFilter.module.scss';

interface PriorityFilterProps {
  isPriority: boolean;
  setPriority: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PriorityFilter = ({
  setPriority,
  isPriority,
}: PriorityFilterProps) => {
  const theme = useMantineTheme();

  return (
    <Flex
      className={styles.priority}
      align={'center'}
      onClick={() => setPriority((prev) => !prev)}
      gap={8}
    >
      <p className="text">
        {isPriority ? 'От высокого приоритета' : 'От низкого приоритета'}
      </p>
      {isPriority ? (
        <IconSortDescending size={20} color={theme.colors.myBlue[1]} />
      ) : (
        <IconSortAscending size={20} color={theme.colors.myBlue[1]} />
      )}
    </Flex>
  );
};
