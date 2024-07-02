import { Divider, Flex, Stack } from '@mantine/core';
import { IObj } from 'shared/models/IResponse';
import { Card } from 'shared/ui/Card';
import { Title } from 'shared/ui/Title';

interface ObjStatProps {
  selectedObj: IObj;
}

export const ObjStat = ({ selectedObj }: ObjStatProps) => {
  return (
    <Card type="error">
      <Stack gap={14}>
        <Flex align={'center'} gap={24}>
          <p className="text medium secondary">Сокорость остывания</p>
          <Divider color="#CAD5DD" style={{ flex: 1 }} />
          <Title
            color="error"
            level={4}
            title={`${selectedObj?.coolingRate?.toFixed(2)} гр./час`}
          />
        </Flex>
        {selectedObj.normCooldown ? (
          <Flex align={'center'} gap={24}>
            <p className="text medium secondary">Температура ниже 18° С</p>
            <Divider color="#CAD5DD" style={{ flex: 1 }} />
            <Title
              level={4}
              title={`⁓Через ${selectedObj.normCooldown.toFixed(2)} часа`}
            />
          </Flex>
        ) : null}
        {selectedObj.fullCooldown ? (
          <Flex align={'center'} gap={24}>
            <p className="text medium secondary">До полного остывания</p>
            <Divider color="#CAD5DD" style={{ flex: 1 }} />
            <Title
              level={4}
              title={`⁓Через ${selectedObj.fullCooldown.toFixed(2)} часа`}
            />
          </Flex>
        ) : null}
      </Stack>
    </Card>
  );
};
