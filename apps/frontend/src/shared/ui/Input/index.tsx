import { CloseButton, Input as MantineInput } from '@mantine/core';
import style from './Input.module.scss';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import classNames from 'classnames';

interface Props {
  field: ControllerRenderProps<FieldValues, any>;
  w?: number | string;
  size?: string;
  h?: number;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  type?: string;
  allowClear?: boolean;
  error?: string;
}

export const Input = ({
  field,
  size,
  label,
  onFocus,
  type,
  allowClear,
  error,
  ...props
}: Props) => {
  return (
    <MantineInput.Wrapper {...props} className={style.input} label={label}>
      <MantineInput
        type={type}
        autoFocus={false}
        onFocus={onFocus}
        autoComplete="on"
        {...props}
        size={size}
        onChange={field.onChange}
        value={field.value}
        className={classNames(style.input, { [style.error]: error })}
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
      {error ? <p className="text small error">{error}</p> : null}
    </MantineInput.Wrapper>
  );
};
