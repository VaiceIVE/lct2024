import { ReactNode } from 'react';
import styles from './Button.module.scss';
import classNames from 'classnames';
import { Button as MantineButton } from '@mantine/core';

interface ButtonProps {
  label?: string;
  icon?: ReactNode;
  outline?: boolean;
  isWhite?: boolean;
  w?: number;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'light' | 'outline';
}

export const Button = ({
  label,
  icon,
  outline,
  isWhite,
  w,
  className,
  onClick,
  disabled,
  type,
}: ButtonProps) => {
  return (
    <MantineButton
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        className && className,
        styles.button,
        type && styles[type],
        isWhite && styles.white
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
