import { Flex, Stack } from '@mantine/core';
import {
  IconBuildingCommunity,
  IconBuildingHospital,
  IconHome,
} from '@tabler/icons-react';
import classNames from 'classnames';

import styles from './MapFilters.module.scss';
import { SegmentControl } from 'shared/ui/SegmentControl';

const filters = [
  { icon: <IconHome size={20} />, label: 'МКД', color: 'orange', type: 'mkd' },
  {
    icon: <IconBuildingCommunity size={20} />,
    label: 'Прочее',
    color: 'gray',
    type: 'prom',
  },
  {
    icon: <IconBuildingHospital size={20} />,
    label: 'Социальные объекты',
    color: 'blue',
    type: 'Социальные объекты',
  },
];

interface MapFiltersProps {
  setTypeFilters: React.Dispatch<React.SetStateAction<string[]>>;
  typeFilters: string[];
  showConnected: string;
  setShowConnected: React.Dispatch<React.SetStateAction<string>>;
  regionFilter: string;
  setRegionFilter: React.Dispatch<React.SetStateAction<string>>;
}

export const MapFilters = ({
  setTypeFilters,
  typeFilters,
  setShowConnected,
  showConnected,
  setRegionFilter,
  regionFilter,
}: MapFiltersProps) => {
  return (
    <>
      <Stack className={styles.wrapper} gap={18} align="flex-end">
        {filters.map((f) => (
          <Flex
            key={f.label}
            onClick={
              typeFilters.includes(f.type)
                ? () =>
                    setTypeFilters((prev) => prev.filter((p) => p !== f.type))
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
        <SegmentControl
          data={['Район', 'ЦТП/ИТП', 'Дома']}
          onChange={setShowConnected}
          value={showConnected}
        />
      </Stack>
      <Stack className={styles['bottom-wrapper']}>
        <SegmentControl
          data={['ВАО', 'Вся Москва']}
          onChange={setRegionFilter}
          value={regionFilter}
          disabled={showConnected !== 'ЦТП/ИТП'}
        />
      </Stack>
    </>
  );
};
