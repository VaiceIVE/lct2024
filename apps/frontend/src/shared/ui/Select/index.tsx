import { Select as MantineSelect } from '@mantine/core';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';

import style from './Select.module.scss';

interface Props {
  data: { label: string; value: string }[];
  field: ControllerRenderProps<FieldValues, any>;
  custom?: boolean;
  label?: string;
  placeholder?: string;
  w?: number;
  defaultValue?: string;
  searchable?: boolean;
  disabled?: boolean;
  limit?: number;
  allowDeselect?: boolean;
}

export const Select = ({ field, allowDeselect = false, ...props }: Props) => {
  return (
    <MantineSelect
      allowDeselect={allowDeselect}
      value={field.value}
      onChange={field.onChange}
      {...props}
      className={style.select}
    />
  );
};
