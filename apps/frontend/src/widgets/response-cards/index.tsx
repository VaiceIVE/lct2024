import { Flex, Grid, Stack } from '@mantine/core';
import { DateValue } from '@mantine/dates';
import { IconCalendarEvent } from '@tabler/icons-react';
import { socialTypes } from 'shared/constants/socialTypes';
import { IObj } from 'shared/models/IResponse';
import { Card } from 'shared/ui/Card';
import { DateInput } from 'shared/ui/DateInput';
import { Title } from 'shared/ui/Title';

interface ResponseCardsProp {
  setDate: React.Dispatch<React.SetStateAction<DateValue>>;
  date: DateValue;
  obj: IObj[] | undefined;
}

export const ResponseCards = ({ setDate, date, obj }: ResponseCardsProp) => {
  const getConsumersCount = () => {
    let consumersCount = 0;
    obj?.forEach((o) => (consumersCount += o.consumersCount || 1));

    return consumersCount;
  };

  const getCountByType = (type: string) => {
    let count = 0;
    obj?.forEach((o) =>
      o.socialType === type
        ? (count += 1)
        : type === 'social' && socialTypes.includes(o.socialType)
        ? (count += 1)
        : null
    );

    return count;
  };

  const stats: {
    [key: number]: { label: string; count: number; color: string };
  } = {
    0: {
      label: 'Произошли в пунктах отопления',
      count: getCountByType('tp'),
      color: 'black',
    },
    1: {
      label: 'Произошли на соц. объектах',
      count: getCountByType('social'),
      color: 'blue',
    },
    2: {
      label: 'Произошли в МКД',
      count: getCountByType('mkd'),
      color: 'black',
    },
  };

  return (
    <Grid gutter={10}>
      <Grid.Col span={6}>
        <Card type="dark">
          <Stack gap={24}>
            <Stack gap={12}>
              <Title level={4} title="Дата по умолчанию" />
              <p className="text">
                Для симуляции возникновения инцидентов все события считаются
                произошедшими в один день. Вы можете изменить дату событий по
                умолчанию, приоритет так же подстроится под новые условия.
              </p>
            </Stack>
            <DateInput
              placeholder="Укажите дату по умолчанию"
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
            />
          </Stack>
        </Card>
      </Grid.Col>
      <Grid.Col span={6}>
        <Card type="blue" h={'100%'}>
          <Flex align={'flex-start'} justify={'space-between'}>
            <Stack gap={8} flex={1}>
              <Title level={'title'} title={obj?.length} color="blue" />
              <p className="text secondary">
                Событий произошло <br /> у{' '}
                <span className="text medium blue">{getConsumersCount()}</span>{' '}
                конечных потребителей
              </p>
            </Stack>
            <Stack gap={20} flex={1}>
              {Object.keys(stats).map((s) => (
                <Stack key={s} gap={8}>
                  <p className="text secondary">{stats[+s].label}</p>
                  <Flex gap={1}>
                    <Title
                      level={4}
                      color={stats[+s].color}
                      title={`${stats[+s].count}`}
                    />
                    <Title level={4} color="gray" title={`/`} />
                    <Title
                      level={4}
                      color="gray"
                      title={`${getConsumersCount()}`}
                    />
                  </Flex>
                </Stack>
              ))}
            </Stack>
          </Flex>
        </Card>
      </Grid.Col>
    </Grid>
  );
};
