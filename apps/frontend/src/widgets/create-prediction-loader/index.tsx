import { Loader, Stack, useMantineTheme } from '@mantine/core';
import { Title } from 'shared/ui/Title';

export const CreatePredictionLoader = () => {
  const theme = useMantineTheme();

  return (
    <Stack flex={1} gap={24} justify="center" align="center">
      <Loader type="dots" color={theme.colors.myBlue[2]} />
      <Stack gap={12} align="center">
        <Title level={3} title="Идет анализ" />
        <p className="text secondary center">
          Пожалуйста, подождите. Обычно это занимает <br /> не больше минуты
        </p>
      </Stack>
    </Stack>
  );
};
