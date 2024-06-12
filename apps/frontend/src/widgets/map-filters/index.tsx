import { Flex, Stack } from '@mantine/core';
import {
  IconBuildingFactory,
  IconBuildingHospital,
  IconHome,
} from '@tabler/icons-react';
import classNames from 'classnames';

import styles from './MapFilters.module.scss';

const filters = [
  { icon: <IconHome size={20} />, label: 'МКД', color: 'orange', type: '1' },
  {
    icon: <IconBuildingFactory size={20} />,
    label: 'Пункты отопления',
    color: 'gray',
    type: '2',
  },
  {
    icon: <IconBuildingHospital size={20} />,
    label: 'Социальные объекты',
    color: 'blue',
    type: '3',
  },
];

interface MapFiltersProps {
  setTypeFilters: React.Dispatch<React.SetStateAction<string[]>>;
  typeFilters: string[];
}

export const MapFilters = ({
  setTypeFilters,
  typeFilters,
}: MapFiltersProps) => {
  return (
    <Stack className={styles.wrapper} gap={18} align="flex-end">
      {filters.map((f) => (
        <Flex
          key={f.label}
          onClick={
            typeFilters.includes(f.type)
              ? () => setTypeFilters((prev) => prev.filter((p) => p !== f.type))
              : () => setTypeFilters((prev) => [...prev, f.type])
          }
          className={classNames(styles.button, styles[f.color], {
            [styles.active]: typeFilters.includes(f.type),
          })}
          align={'center'}
          gap={10}
        >
          {f.icon}
          <p className="text">{f.label}</p>
          <div className={classNames(styles.circle, styles[f.color])}></div>
        </Flex>
      ))}
    </Stack>
  );
};
