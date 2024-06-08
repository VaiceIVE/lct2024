import { CloseButton, Input as MantineInput } from '@mantine/core';
import style from './Input.module.scss';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';

interface Props {
  field: ControllerRenderProps<FieldValues, any>;
  w?: number;
  size?: string;
  h?: number;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  type?: string;
  allowClear?: boolean;
}

export const Input = ({
  field,
  size,
  label,
  onFocus,
  type,
  allowClear,
  ...props
}: Props) => {
  return (
    <MantineInput.Wrapper className={style.input} label={label}>
      <MantineInput
        type={type}
        defaultValue={''}
        onFocus={onFocus}
        {...props}
        size={size}
        onChange={field.onChange}
        value={field.value}
        className={style.input}
        rightSectionPointerEvents="all"
        rightSection={
          allowClear ? (
            <CloseButton
              aria-label="Clear input"
              onClick={() => field.onChange('')}
              style={{
                display: field?.value ? undefined : 'none',
                marginRight: '24px',
              }}
            />
          ) : null
        }
      />
    </MantineInput.Wrapper>
  );
};
