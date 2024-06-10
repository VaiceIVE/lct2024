import { ReactNode } from 'react';
import styles from './Button.module.scss';
import classNames from 'classnames';
import { Loader, Button as MantineButton } from '@mantine/core';

export interface ButtonProps {
  label?: string;
  icon?: ReactNode;
  isIconLeft?: boolean;
  w?: number;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'light' | 'outline' | 'white';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button = ({
  label,
  icon,
  isIconLeft,
  w,
  className,
  onClick,
  disabled,
  type,
  fullWidth,
  isLoading,
}: ButtonProps) => {
  return (
    <MantineButton
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        className && className,
        styles.button,
        type && styles[type],
        fullWidth && styles.full,
        disabled && styles.disabled
      )}
      style={
        icon && !label
          ? { width: `${w}px`, padding: '18px 16px' }
          : { width: `${w}px` }
      }
    >
      {!icon ? (
        label
      ) : (
        <div
          className={classNames(
            styles['button-wrapper'],
            isIconLeft && styles.reverse,
            !label && styles.solo,
            isLoading && styles.loading
          )}
        >
          <div className={styles.label}>{label}</div>
          <div className={styles.icon}>{icon}</div>
          {isLoading ? (
            <Loader className={styles.loader} color="white" type="dots" />
          ) : null}
        </div>
      )}
    </MantineButton>
  );
};
