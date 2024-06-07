import { Stack } from '@mantine/core';
import { Card } from 'shared/ui/Card';

interface ObjectCardProps {
  selectedId: number | null;
}

export const ObjectCard = ({ selectedId }: ObjectCardProps) => {
  return (
    <Stack gap={40}>
      <Stack gap={16}>
        <Card type="dark">213</Card>
        <Card type="outline">213</Card>
        <Card>213</Card>
      </Stack>
    </Stack>
  );
};
