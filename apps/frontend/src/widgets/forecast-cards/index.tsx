import { Grid, Stack } from '@mantine/core';
import { Card } from 'shared/ui/Card';
import { Title } from 'shared/ui/Title';

export const ForecastCards = () => {
  const data = ['Событий', 'Задействованные районы', 'Потребители'];

  return (
    <Stack gap={44}>
      <div>23</div>
      <Grid gutter={18}>
        {data.map((item) => (
          <Grid.Col span={4}>
            <Card>
              <Stack gap={8}>
                <Title level={1} title="12" />
                <div className="text medium secondary">{item}</div>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  );
};
