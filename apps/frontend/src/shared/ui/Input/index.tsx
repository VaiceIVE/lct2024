import { Input as MantineInput } from '@mantine/core';
import style from './Input.module.scss';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';

interface Props {
  field: ControllerRenderProps<FieldValues, never>;
  w?: number;
  size?: string;
  h?: number;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  type?: string;
}

export const Input = ({
  field,
  size,
  label,
  onFocus,
  type,
  ...props
}: Props) => {
  return (
    <MantineInput.Wrapper className={style.input} label={label}>
      <MantineInput
        type={type}
        onFocus={onFocus}
        {...props}
        size={size}
        {...field}
        className={style.input}
      />
    </MantineInput.Wrapper>
  );
};
