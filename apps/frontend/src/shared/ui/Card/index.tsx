import { Stack } from '@mantine/core';
import classNames from 'classnames';

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
  type?: 'outline' | 'dark' | 'default';
  className?: string;
  overflow?: string;
}

export const Card = ({
  p = '32px',
  gap = 16,
  children,
  radius = '12px',
  type = 'default',
  overflow,
  className,
  ...props
}: Props) => {
  return (
    <Stack
      p={p}
      gap={gap}
      style={{
        borderRadius: `${radius}`,
        overflow: overflow,
      }}
      className={classNames(style.card, style[type], className)}
      {...props}
    >
      {children}
    </Stack>
  );
};
