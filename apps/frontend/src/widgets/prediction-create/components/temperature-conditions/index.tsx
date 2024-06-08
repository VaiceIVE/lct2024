import { Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCalendarPlus } from '@tabler/icons-react';
import { Button } from 'shared/ui/Button';
import { Card } from 'shared/ui/Card';
import { Drawer } from 'shared/ui/Drawer';
import { Title } from 'shared/ui/Title';
import { TemperatureDrawer } from '../temperature-drawer';
import { ITemperatureConditions } from 'shared/models/ITemperatureConditions';

interface TemperatureConditionsProps {
  conditions: ITemperatureConditions[];
  setConditions: React.Dispatch<React.SetStateAction<ITemperatureConditions[]>>;
}

export const TemperatureConditions = ({
  setConditions,
  conditions,
}: TemperatureConditionsProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer opened={opened} close={close} title="Добавление дней">
        <TemperatureDrawer
          opened={opened}
          conditions={conditions}
          setConditions={setConditions}
        />
      </Drawer>
      <Card type="outline">
        <Stack gap={28}>
          <Title level={3} title="Температурные условия" />
          <Stack gap={18}>
            <p className="text medium secondary">
              Добавьте один или несколько дней, когда произойдут изменения
              погодных условий
            </p>
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
