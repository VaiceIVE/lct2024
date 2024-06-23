import { Divider, Flex, Grid, Stack } from '@mantine/core';
import { buildingTypes } from 'shared/constants/buildingTypes';
import { IBuilding, IEvents } from 'shared/models/IBuilding';
import { IObj } from 'shared/models/IResponse';
import { Card } from 'shared/ui/Card';
import { Chance } from 'shared/ui/Chance';
import { IconBlock } from 'shared/ui/IconBlock';
import { Title } from 'shared/ui/Title';
import { BuildingStat } from './components/BuildingStat';
import { ObjStat } from './components/ObjStat';
import dayjs from 'dayjs';

interface ObjectCardProps {
  selectedBuilding: IBuilding | null;
  selectedObj: IObj | null;
}

export const ObjectInfo = ({
  selectedBuilding,
  selectedObj,
}: ObjectCardProps) => {
  const item = selectedBuilding ? selectedBuilding : selectedObj;

  const compare = (a: IEvents, b: IEvents) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    return +dateA - +dateB;
  };

  return (
    <Stack gap={44}>
      <Stack gap={16}>
        <Card type="dark">
          <Stack gap={26}>
            <IconBlock iconType={item?.socialType ? item.socialType : 'mkd'} />
            <Stack gap={12}>
              <Title level={3} title={item?.address} />
              <p className="text medium">
                {buildingTypes[item?.socialType ? item.socialType : 'mkd']}
              </p>
            </Stack>
          </Stack>
        </Card>
        {selectedBuilding ? (
          <BuildingStat selectedBuilding={selectedBuilding} />
        ) : selectedObj &&
          (selectedObj.fullCooldown || selectedObj?.normCooldown) ? (
          <ObjStat selectedObj={selectedObj} />
        ) : null}
        {item?.characteristics && Object.keys(item?.characteristics).length ? (
          <Card type="outline">
            <Stack gap={26}>
              <Title level={4} title="Характеристики" />
              <Stack gap={12}>
                {Object.keys(item.characteristics).map((key) => (
                  <Flex align={'center'} key={key} gap={24}>
                    <p
                      style={{
                        textAlign: 'left',
                        width: 'min-content',
                      }}
                      className="text medium placeholder"
                    >
                      {key}
                    </p>
                    <Divider color="#CAD5DD" style={{ flex: 1 }} />
                    <p
                      style={{
                        textAlign: 'right',
                        width: 'min-content',
                      }}
                      className="text medium"
                    >
                      {item?.characteristics[key]
                        .toString()
                        .replace('муниципальный округ', '')}
                    </p>
                  </Flex>
                ))}
              </Stack>
            </Stack>
          </Card>
        ) : null}
        {item?.socialType !== 'tp' && item?.connectionInfo ? (
          <Card>
            <Stack gap={26}>
              <Title level={4} title="Ответственный за объект ЦТП" />
              <Flex
                style={{ overflow: 'hidden' }}
                gap={12}
                align={'flex-start'}
              >
                <IconBlock iconType="tp" />
                <p
                  style={{
                    maxWidth: '380px',
                  }}
                  className="text medium"
                >
                  {item.connectionInfo.address}
                </p>
              </Flex>
            </Stack>
          </Card>
        ) : null}
      </Stack>
      {selectedBuilding ? (
        <Stack gap={16}>
          <Title
            level={4}
            title={`Выявленные события на объекте (${selectedBuilding.events.length})`}
          />
          <Grid gutter={12}>
            {selectedBuilding.events
              .sort(compare)
              .sort((a, b) => (a.eventName > b.eventName ? 1 : -1))
              .map((e, index) => (
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
                        <p className="text medium placeholder">
                          {dayjs(e.date).format('DD.MM')}
                        </p>
                      </Flex>
                    </Stack>
                  </Card>
                </Grid.Col>
              ))}
          </Grid>
        </Stack>
      ) : null}
    </Stack>
  );
};
