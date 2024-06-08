import {
  Checkbox as MantineCheckbox,
  Flex,
  Stack,
  useMantineTheme,
} from '@mantine/core';
import { IconCalendarPlus, IconTrashX } from '@tabler/icons-react';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import { anomalies } from 'shared/constants/anomalies';
import { ITemperatureConditions } from 'shared/models/ITemperatureConditions';
import { Button } from 'shared/ui/Button';
import { Card } from 'shared/ui/Card';
import { Checkbox } from 'shared/ui/Checkbox';
import { DateInput } from 'shared/ui/DateInput';
import { Title } from 'shared/ui/Title';

interface TemperatureDrawerProps {
  conditions: ITemperatureConditions[];
  opened: boolean;
  tempConditions: ITemperatureConditions[];
  setTempConditions: React.Dispatch<
    React.SetStateAction<ITemperatureConditions[]>
  >;
}

export const TemperatureDrawer = ({
  conditions,
  opened,
  tempConditions,
  setTempConditions,
}: TemperatureDrawerProps) => {
  const theme = useMantineTheme();

  const [isAdded, setAdded] = useState<boolean>(false);

  const handleDateDelete = (id: string) => {
    const filteredArray = tempConditions.filter((c) => c.id !== id);
    setTempConditions(filteredArray);
  };

  useEffect(() => {
    if (opened && !tempConditions.length && !isAdded) {
      setTempConditions((prev) => [
        ...prev,
        { date: null, anomalies: [], id: nanoid() },
      ]);
      setAdded(true);
    }
  }, [opened, tempConditions, isAdded, setTempConditions]);

  useEffect(() => {
    if (opened && conditions.length) {
      setTempConditions(conditions);
    }
  }, [conditions, opened, setTempConditions]);

  return (
    <Stack gap={40}>
      <Stack gap={12}>
        <Button
          fullWidth
          label="Добавить дату"
          type="outline"
          icon={<IconCalendarPlus size={18} />}
          onClick={() =>
            setTempConditions((prev) => [
              { date: null, anomalies: [], id: nanoid() },
              ...prev,
            ])
          }
        />
        <Card p="16px 18px">
          Заполнено:{' '}
          {tempConditions.filter((c) => c.anomalies.length && c.date).length}{' '}
          дат
        </Card>
      </Stack>
      {tempConditions.map((c, index) => (
        <Stack key={c.id} gap={18}>
          <Flex align={'center'} gap={8}>
            <Title level={4} title={`Дата ${tempConditions.length - index}`} />
            <IconTrashX
              onClick={() => handleDateDelete(c.id)}
              style={{ cursor: 'pointer' }}
              size={20}
              color={theme.colors.myState[1]}
            />
          </Flex>
          <DateInput
            onChange={(e) =>
              setTempConditions((prev) =>
                prev.map((p) => (p.id === c.id ? { ...p, date: e } : p))
              )
            }
            value={tempConditions.find((p) => p.id === c.id)?.date}
            placeholder="Выберите датy"
            allowClear
          />
          <MantineCheckbox.Group
            onChange={(e) =>
              setTempConditions((prev) =>
                prev.map((p) => (p.id === c.id ? { ...p, anomalies: e } : p))
              )
            }
            value={tempConditions.find((p) => p.id === c.id)?.anomalies}
          >
            <Stack gap={8}>
              {anomalies.map((a) => (
                <Checkbox key={a} value={a} label={a} />
              ))}
            </Stack>
          </MantineCheckbox.Group>
        </Stack>
      ))}
    </Stack>
  );
};
