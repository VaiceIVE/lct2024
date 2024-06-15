import { Divider, Flex, Grid, Stack } from '@mantine/core';
import { buildingTypes } from 'shared/constants/buildingTypes';
import { IBuilding } from 'shared/models/IBuilding';
import { Card } from 'shared/ui/Card';
import { Chance } from 'shared/ui/Chance';
import { IconBlock } from 'shared/ui/IconBlock';
import { Title } from 'shared/ui/Title';

interface ObjectCardProps {
  selectedBuilding: IBuilding;
}

export const ObjectInfo = ({ selectedBuilding }: ObjectCardProps) => {
  const data: { [key: string]: string | number } = {
    'Год постройки': 1967,
    'Материал стен': 'Кирпич',
    Этажность: 8,
    'Кол-во квартир': 200,
    'Теплопроводность стен': 'Низкая',
    'Износ объекта по БТИ': 'Высокий',
    'Класс энергоэфективности': 'Высокий',
    'Признак аварийности здания': 'Признак',
  };

  return (
    <Stack gap={44}>
      <Stack gap={16}>
        <Card type="dark">
          <Stack gap={26}>
            <IconBlock iconType={selectedBuilding?.socialType} />
            <Stack gap={12}>
              <Title level={3} title={selectedBuilding?.address} />
              <p className="text medium">
                {buildingTypes[selectedBuilding.socialType]}
              </p>
            </Stack>
          </Stack>
        </Card>
        <Card type="error">
          <Stack gap={14}>
            <Flex align={'center'} gap={24}>
              <p className="text medium secondary">Сокорость остывания</p>
              <Divider color="#CAD5DD" style={{ flex: 1 }} />
              <Title
                color="error"
                level={4}
                title={`${selectedBuilding.coolingRate} гр./час`}
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
        <Card type="outline">
          <Stack gap={26}>
            <Title level={4} title="Характеристики" />
            <Stack gap={12}>
              {Object.keys(data).map((key) => (
                <Flex key={key} align={'center'} gap={24}>
                  <p className="text medium placeholder">{key}</p>
                  <Divider color="#CAD5DD" style={{ flex: 1 }} />
                  <p className="text medium">{data[key]}</p>
                </Flex>
              ))}
            </Stack>
          </Stack>
        </Card>
        <Card>
          <Stack gap={26}>
            <Title level={4} title="Ответственный за объект ТЭЦ" />
            <Flex gap={12} align={'center'}>
              <IconBlock iconType="tp" />
              <p className="text medium">Адрес ТЭЦ</p>
            </Flex>
          </Stack>
        </Card>
      </Stack>
      <Stack gap={16}>
        <Title
          level={4}
          title={`Выявленные события на объекте (${selectedBuilding.events.length})`}
        />
        <Grid gutter={12}>
          {selectedBuilding.events.map((e, index) => (
            <Grid.Col key={index} span={6}>
              <Card h={'100%'} p="20px" radius={'8px'} type="dark">
                <Stack gap={8}>
                  <p
                    style={{
                      textWrap: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      cursor: 'default',
                    }}
                    className="text medium"
                  >
                    {e.eventName}
                  </p>
                  <Flex align={'center'} gap={8}>
                    <Chance value={e.chance} />
                    <p className="text medium placeholder">|</p>
                    <p className="text medium placeholder">{e.date}</p>
                  </Flex>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Stack>
    </Stack>
  );
};
