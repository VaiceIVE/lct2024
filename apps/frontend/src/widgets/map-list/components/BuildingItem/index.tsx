import { Flex, Stack } from '@mantine/core';
import { IBuilding } from 'shared/models/IBuilding';
import { Card } from 'shared/ui/Card';
import { IconBlock } from 'shared/ui/IconBlock';

import styles from './BuildingItem.module.scss';

interface BuildingItemProps {
  b: IBuilding;
  setSelectedBuilding: React.Dispatch<React.SetStateAction<IBuilding | null>>;
}

export const BuildingItem = ({ b, setSelectedBuilding }: BuildingItemProps) => {
  return (
    <Card
      className={styles.building}
      onClick={() => setSelectedBuilding(b)}
      p="20px"
      type="dark"
      overflow="hidden"
    >
      <Flex align={'center'} gap={24}>
        <Flex align={'center'} gap={16}>
          <IconBlock iconType={b.socialType} />
          <Stack style={{ overflow: 'hidden' }} gap={7}>
            <p className="text medium">{b.address}</p>
            <p
              style={{
                textWrap: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '390px',
              }}
              className="text"
            >
              {b.events.map((e) => e.eventName).join(', ')}
            </p>
          </Stack>
        </Flex>
      </Flex>
    </Card>
  );
};
