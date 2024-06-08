import { ReactNode } from 'react';
import styles from './Button.module.scss';
import classNames from 'classnames';
import { Button as MantineButton } from '@mantine/core';

interface ButtonProps {
  label?: string;
  icon?: ReactNode;
  isIconLeft?: boolean;
  w?: number;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'light' | 'outline' | 'white';
  fullWidth?: boolean;
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
}: ButtonProps) => {
  return (
    <MantineButton
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        className && className,
        styles.button,
        type && styles[type],
        fullWidth && styles.full
      )}
      style={
        icon && !label
          ? { width: `${w}px`, padding: '14px' }
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
            !label && styles.solo
          )}
        >
          <div>{label}</div>
          <div className={styles.icon}>{icon}</div>
        </div>
      )}
    </MantineButton>
  );
};
