import { Flex, Stack } from '@mantine/core';
import { IObj } from 'shared/models/IResponse';
import { Card } from 'shared/ui/Card';
import { IconBlock } from 'shared/ui/IconBlock';

import styles from './ObjItem.module.scss';

interface ObjItemProps {
  o: IObj;
  setSelectedObj: React.Dispatch<React.SetStateAction<IObj | null>>;
}

export const ObjItem = ({ o, setSelectedObj }: ObjItemProps) => {
  return (
    <Card
      onClick={() => setSelectedObj(o)}
      className={styles.obj}
      p="20px"
      type="dark"
    >
      <Flex align={'center'} gap={24}>
        <Flex align={'center'} gap={16}>
          <IconBlock iconType={o.socialType} />
          <Stack gap={7}>
            <p className="text medium">{o.address}</p>
            <p className="text">{o.event}</p>
          </Stack>
        </Flex>
      </Flex>
    </Card>
  );
};
