import { Grid, Stack } from '@mantine/core';
import { Card } from 'shared/ui/Card';
import { Title } from 'shared/ui/Title';

export const ForecastCards = () => {
  const data = ['Событий', 'Задействованные районы', 'Потребители'];

  return (
    <Grid gutter={18}>
      {data.map((item) => (
        <Grid.Col key={item} span={4}>
          <Card>
            <Stack gap={8}>
              <Title level={1} title="12" />
              <div className="text medium secondary">{item}</div>
            </Stack>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  );
};
