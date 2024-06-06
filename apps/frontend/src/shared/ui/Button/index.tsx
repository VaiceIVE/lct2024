import { ReactNode } from 'react';
import styles from './Button.module.scss';
import classNames from 'classnames';
import { Button as MantineButton } from '@mantine/core';

interface ButtonProps {
  title?: string;
  icon?: ReactNode;
  outline?: boolean;
  isWhite?: boolean;
  w?: number;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const Button = ({
  title,
  icon,
  outline,
  isWhite,
  w,
  className,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <MantineButton
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        className && className,
        styles.button,
        outline && styles.outline,
        isWhite && styles.white
      )}
      style={
        icon && !title
          ? { width: `${w}px`, padding: '14px' }
          : { width: `${w}px` }
      }
    >
      {!icon ? (
        title
      ) : (
        <div
          className={classNames(
            styles['button-wrapper'],
            !title && styles.solo
          )}
        >
          <div>{title}</div>
          <div className={styles.icon}>{icon}</div>
        </div>
      )}
    </MantineButton>
  );
};
