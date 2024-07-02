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
import { DateInput } from 'shared/ui/DateInput';
import { IconCalendarEvent } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { DateValue } from '@mantine/dates';
import qs from 'query-string';
import PredictionServices from 'shared/services/PredictionServices';
import { useLocation } from 'react-router-dom';

interface ObjectCardProps {
  selectedBuilding: IBuilding | null;
  selectedObj: IObj | null;
  defaultId?: string | (string | null)[] | null;
  defaultMonth?: string;
}

export const ObjectInfo = ({
  selectedBuilding,
  selectedObj,
  defaultId,
  defaultMonth,
}: ObjectCardProps) => {
  const item = selectedBuilding ? selectedBuilding : selectedObj;

  const [date, setDate] = useState<DateValue>(null);
  const [events, setEvents] = useState<IEvents[]>([]);

  const location = useLocation();

  const { id, month } = qs.parse(location.search);

  const compare = (a: IEvents, b: IEvents) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    return +dateB - +dateA;
  };

  useEffect(() => {
    if (selectedBuilding && selectedBuilding?.socialType !== 'tp') {
      PredictionServices.getEvents(
        id || defaultId,
        month || defaultMonth,
        selectedBuilding.characteristics['УНОМ']
      ).then((response) => setEvents(response.data));
    }
  }, [defaultId, defaultMonth, id, month, selectedBuilding]);

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
              <Title
                level={4}
                title={`Ответственный за объект ${
                  item.connectionInfo?.type || 'ЦТП'
                }`}
              />
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
                  {item.connectionInfo?.address}
                </p>
              </Flex>
            </Stack>
          </Card>
        ) : null}
      </Stack>
      {selectedBuilding && events?.length ? (
        <Stack gap={16}>
          <Title
            level={4}
            title={`Выявленные события на объекте (${events.length})`}
          />
          <DateInput
            onChange={setDate}
            value={date}
            icon={
              <IconCalendarEvent
                size={18}
                style={{
                  marginRight: '24px',
                }}
              />
            }
            placeholder="Выберите датy"
            allowClear
          />
          <Grid gutter={12}>
            {events
              .sort(compare)
              .sort((a, b) => (a.eventName > b.eventName ? 1 : -1))
              .filter(
                (e) =>
                  !date ||
                  dayjs(e.date).format('DD.MM') === dayjs(date).format('DD.MM')
              )
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
