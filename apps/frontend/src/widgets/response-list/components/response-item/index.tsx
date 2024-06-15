import { Flex, Stack } from '@mantine/core';
import { Title } from 'shared/ui/Title';
import { IconBlock } from 'shared/ui/IconBlock';
import { Button } from 'shared/ui/Button';
import { IconMap, IconPencil } from '@tabler/icons-react';
import { IObj } from 'shared/models/IResponse';

import classNames from 'classnames';

import styles from './ResponseItem.module.scss';

interface ResponseItemProps {
  index: number;
  o: IObj;
  setSelectedObj: React.Dispatch<React.SetStateAction<IObj | null>>;
  date: string | undefined;
}

export const ResponseItem = ({
  index,
  o,
  date,
  setSelectedObj,
}: ResponseItemProps) => {
  return (
    <Flex
      className={classNames(styles.obj, {
        [styles.first]: index === 0,
      })}
      align={'center'}
      gap={44}
      key={index}
    >
      <Flex gap={16} align={'flex-start'} flex={1}>
        <Title level={4} title={index + 1} color="gray" />
        <Stack gap={16}>
          <IconBlock iconType={o.socialType} />
          <Stack gap={8}>
            <Title level={4} title={o.address} />
            <p className="text medium">{o.event}</p>
            <p className="text placeholder">Условия события: {date}</p>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1} align={'center'} justify={'space-between'}>
        <Stack gap={8}>
          <Flex gap={3}>
            <p className="text medium placeholder">Количество потребителей:</p>
            <p className="text medium">
              {o.consumersCount ? o.consumersCount : 1}
            </p>
          </Flex>
          {o.normCooldown ? (
            <Flex gap={3}>
              <p className="text medium placeholder">Температура ниже 18° С:</p>
              <p className="text medium">
                ⁓Через {Math.trunc(o.normCooldown)} часа
              </p>
            </Flex>
          ) : null}
          {o.fullCooldown ? (
            <Flex gap={3}>
              <p className="text medium placeholder">Полное остывание трубы:</p>
              <p className="text medium">
                ⁓Через {Math.trunc(o.fullCooldown)} часа
              </p>
            </Flex>
          ) : null}
        </Stack>
        <Flex gap={8}>
          <Button
            w={57}
            type="outline"
            icon={<IconPencil size={18} />}
            onClick={() => setSelectedObj(o)}
          />
          <Button w={57} type="outline" icon={<IconMap size={18} />} />
        </Flex>
      </Flex>
    </Flex>
  );
};
