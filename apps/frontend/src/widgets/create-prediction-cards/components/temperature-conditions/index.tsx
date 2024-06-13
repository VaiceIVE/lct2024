import { Flex, Stack, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import {
  IconCalendarPlus,
  IconChevronLeft,
  IconCircleCheckFilled,
  IconLayoutGridAdd,
  IconTrashX,
} from '@tabler/icons-react';

import { Button } from 'shared/ui/Button';
import { Card } from 'shared/ui/Card';
import { Drawer } from 'shared/ui/Drawer';
import { Title } from 'shared/ui/Title';
import { TemperatureDrawer } from '../temperature-drawer';
import { ITemperatureConditions } from 'shared/models/ITemperatureConditions';
import { Notice } from 'shared/ui/Notice';

interface TemperatureConditionsProps {
  conditions: ITemperatureConditions[];
  setConditions: React.Dispatch<React.SetStateAction<ITemperatureConditions[]>>;
}

export const TemperatureConditions = ({
  setConditions,
  conditions,
}: TemperatureConditionsProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [isNoticeShow, setNoticeShow] = useState(false);

  const theme = useMantineTheme();

  const [tempConditions, setTempConditions] = useState<
    ITemperatureConditions[]
  >([]);

  const handleAddConditions = () => {
    if (
      tempConditions.filter((c) => c.anomalies.length && c.date).length ===
        tempConditions.length &&
      tempConditions.length !== 0
    ) {
      setConditions(tempConditions);
      close();
    } else {
      setNoticeShow(true);
    }
  };

  const handleDeleteCondition = (id: string) => {
    const filledArray = conditions.filter((c) => c.id !== id);
    setConditions(filledArray);
  };

  useEffect(() => {
    if (!opened && tempConditions.length) {
      setTempConditions([]);
      setNoticeShow(false);
    }
  }, [opened, tempConditions.length]);

  return (
    <>
      <Drawer
        footer={
          <Flex style={{ position: 'relative' }} gap={12}>
            {isNoticeShow ? (
              <Notice
                type="error"
                message={
                  !tempConditions.length
                    ? 'Добавьте и заполните как минимум одну дату'
                    : 'Все даты должны быть заполнены'
                }
                close={() => setNoticeShow(false)}
              />
            ) : null}
            <Button
              fullWidth
              label="Отменить"
              onClick={close}
              isIconLeft
              icon={<IconChevronLeft size={18} />}
              type="white"
            />
            <Button
              fullWidth
              onClick={handleAddConditions}
              label="Добавить"
              icon={<IconLayoutGridAdd size={18} />}
            />
          </Flex>
        }
        opened={opened}
        close={close}
        title="Добавление дней"
      >
        <TemperatureDrawer
          opened={opened}
          conditions={conditions}
          tempConditions={tempConditions}
          setTempConditions={setTempConditions}
        />
      </Drawer>
      <Card type="outline">
        <Stack gap={28}>
          <Flex align={'center'} gap={12}>
            <Title level={3} title="Температурные условия" />
            {conditions.length ? (
              <IconCircleCheckFilled color={theme.colors.myBlue[1]} size={24} />
            ) : null}
          </Flex>
          <Stack gap={18}>
            <p className="text medium secondary">
              Добавьте один или несколько дней, когда произойдут изменения
              погодных условий
            </p>
            {conditions.length ? (
              <Stack gap={8}>
                {conditions.map((c) => (
                  <Card key={c.id} type="dark" p="20px">
                    <Flex align={'center'} justify={'space-between'}>
                      <Flex gap={32} align={'flex-start'}>
                        <Stack gap={8}>
                          <p className="text small placeholder">Дата</p>
                          <p className="text medium">
                            {c.date
                              ? dayjs(new Date(c.date)).format('DD.MM.YYYY')
                              : null}
                          </p>
                        </Stack>
                        <Stack w={558} gap={8}>
                          <p className="text small placeholder">
                            Погодные условия
                          </p>
                          <p className="text">{c.anomalies.join(', ')}</p>
                        </Stack>
                      </Flex>
                      <IconTrashX
                        onClick={() => handleDeleteCondition(c.id)}
                        style={{ cursor: 'pointer' }}
                        size={18}
                        color={theme.colors.myState[1]}
                      />
                    </Flex>
                  </Card>
                ))}
              </Stack>
            ) : null}
            <Button
              onClick={open}
              type="outline"
              label="Изменить дни"
              icon={<IconCalendarPlus size={18} />}
            />
          </Stack>
        </Stack>
      </Card>
    </>
  );
};
