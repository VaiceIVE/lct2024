import { Stack } from '@mantine/core';
import style from './Card.module.scss';

interface Props {
  p?: string;
  gap?: number;
  children?: React.ReactNode;
  w?: number | string;
  h?: number | string;
  mt?: number;
  mb?: number;
  bg?: string;
  radius?: number | string;
  outline?: boolean;
}

export const Card = ({
  p = '32px',
  gap = 16,
  children,
  bg = '#EEF6FC',
  radius = '12px',
  outline,
  ...props
}: Props) => {
  return (
    <Stack
      p={p}
      gap={gap}
      bg={bg}
      style={{
        borderRadius: `${radius}`,
        border: outline ? '2px solid #DEE2E6' : 'none',
      }}
      className={style.card}
      {...props}
    >
      {children}
    </Stack>
  );
};
