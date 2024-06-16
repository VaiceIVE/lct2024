import { Divider, Flex, Stack } from '@mantine/core';
import { IBuilding } from 'shared/models/IBuilding';
import { Card } from 'shared/ui/Card';
import { Title } from 'shared/ui/Title';

interface BuildingStatProps {
  selectedBuilding: IBuilding;
}

export const BuildingStat = ({ selectedBuilding }: BuildingStatProps) => {
  return (
    <Card type="error">
      <Stack gap={14}>
        <Flex align={'center'} gap={24}>
          <p className="text medium secondary">Сокорость остывания</p>
          <Divider color="#CAD5DD" style={{ flex: 1 }} />
          <Title
            color="error"
            level={4}
            title={`${selectedBuilding.coolingRate.toFixed(2)} гр./час`}
          />
        </Flex>
        <Flex align={'center'} gap={24}>
          <p className="text medium secondary">Количество потребителей</p>
          <Divider color="#CAD5DD" style={{ flex: 1 }} />
          <Title
            level={4}
            title={
              selectedBuilding.consumersCount
                ? selectedBuilding.consumersCount
                : 1
            }
          />
        </Flex>
      </Stack>
    </Card>
  );
};
