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
  type?: 'light' | 'outline' | 'white' | 'orange';
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
        styles.button,
        { [styles.full]: fullWidth, [styles.disabled]: disabled },
        className && className,
        type && styles[type]
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
          className={classNames(styles['button-wrapper'], {
            [styles.reverse]: isIconLeft,
            [styles.solo]: !label,
            [styles.loading]: isLoading,
          })}
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
