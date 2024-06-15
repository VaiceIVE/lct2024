import { Flex, Stack } from '@mantine/core';
import {
  IconBuildingFactory,
  IconBuildingHospital,
  IconHome,
} from '@tabler/icons-react';
import classNames from 'classnames';

import styles from './MapFilters.module.scss';
import { SegmentControl } from 'shared/ui/SegmentControl';

const filters = [
  { icon: <IconHome size={20} />, label: 'МКД', color: 'orange', type: 'mkd' },
  {
    icon: <IconBuildingFactory size={20} />,
    label: 'Пункты отопления',
    color: 'gray',
    type: 'tp',
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
}

export const MapFilters = ({
  setTypeFilters,
  typeFilters,
  setShowConnected,
  showConnected,
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
      {/* <Checkbox
        checked={isShowConnected}
        onChange={setShowConnected}
        className={styles['custom-checkbox']}
        value="1"
        label="Показать связанные объекты"
      /> */}
      <SegmentControl onChange={setShowConnected} value={showConnected} />
    </Stack>
  );
};
