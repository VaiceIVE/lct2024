import { Grid, Stack } from '@mantine/core';
import { DateValue } from '@mantine/dates';
import { IconCalendarEvent } from '@tabler/icons-react';
import { IObj } from 'shared/models/IResponse';
import { Card } from 'shared/ui/Card';
import { DateInput } from 'shared/ui/DateInput';
import { StatCard } from 'shared/ui/StatCard';
import { Title } from 'shared/ui/Title';

interface ResponseCardsProp {
  setDate: React.Dispatch<React.SetStateAction<DateValue>>;
  date: DateValue;
  obj: IObj[] | undefined;
  isLoading: boolean;
}

export const ResponseCards = ({
  setDate,
  date,
  obj,
  isLoading,
}: ResponseCardsProp) => {
  return (
    <Grid gutter={10}>
      <Grid.Col span={6}>
        <Card h={'100%'} type="dark">
          <Stack gap={35}>
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
        <StatCard obj={obj} isLoading={isLoading} />
      </Grid.Col>
    </Grid>
  );
};
