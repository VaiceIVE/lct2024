import { Flex, Stack } from '@mantine/core';
import {
  IconFilterMinus,
  IconFilterPlus,
  IconMap,
  IconPencil,
} from '@tabler/icons-react';
import { IObj } from 'shared/models/IResponse';
import { Button } from 'shared/ui/Button';
import { IconBlock } from 'shared/ui/IconBlock';
import { Title } from 'shared/ui/Title';
import { WidgetWrapper } from 'shared/ui/Wrappers/WidgetWrapper';

import styles from './ResponseList.module.scss';
import classNames from 'classnames';
import { PriorityFilter } from 'shared/ui/PriorityFilter';
import { useState } from 'react';

interface ResponseListProps {
  obj: IObj[] | undefined;
  isPriority: boolean;
  setPriority: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedObj: React.Dispatch<React.SetStateAction<IObj | null>>;
  date: string | undefined;
}

export const ResponseList = ({
  obj,
  isPriority,
  setPriority,
  setSelectedObj,
  date,
}: ResponseListProps) => {
  const [isFiltersOpen, setFiltersOpen] = useState(false);

  return (
    <WidgetWrapper
      title="События по приоритету "
      button={
        <Flex gap={24} align={'center'}>
          <PriorityFilter setPriority={setPriority} isPriority={isPriority} />
          <Button
            fullWidth
            type="light"
            label="Фильтры"
            onClick={() => setFiltersOpen((prev) => !prev)}
            icon={
              isFiltersOpen ? (
                <IconFilterMinus size={18} />
              ) : (
                <IconFilterPlus size={18} />
              )
            }
          />
        </Flex>
      }
    >
      <Stack gap={8}>
        {obj &&
          obj.map((o, index) => (
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
                    <p className="text medium placeholder">
                      Количество потребителей
                    </p>
                    <p className="text medium">
                      {o.consumersCount ? o.consumersCount : 1}
                    </p>
                  </Flex>
                  <Flex gap={3}>
                    <p className="text medium placeholder">
                      Температура ниже 18° С:
                    </p>
                    <p className="text medium">⁓Через{o.normCooldown} часа</p>
                  </Flex>
                  <Flex gap={3}>
                    <p className="text medium placeholder">
                      Полное остывание трубы:
                    </p>
                    <p className="text medium">⁓Через {o.fullCooldown} часа</p>
                  </Flex>
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
          ))}
      </Stack>
    </WidgetWrapper>
  );
};
