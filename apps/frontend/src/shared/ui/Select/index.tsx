import { Select as MantineSelect } from '@mantine/core';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';

import style from './Select.module.scss';

interface Props {
  data: { label: string; value: string }[];
  field: ControllerRenderProps<FieldValues, never>;
  custom?: boolean;
  label?: string;
  placeholder?: string;
  w?: number;
}

export const Select = ({ field, ...props }: Props) => {
  return <MantineSelect {...field} {...props} className={style.select} />;
};
