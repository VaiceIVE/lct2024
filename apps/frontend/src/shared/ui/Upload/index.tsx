/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FileButton } from '@mantine/core';
import { Button, ButtonProps } from '../Button';

interface UploadProps extends ButtonProps {
  onChange?: React.Dispatch<React.SetStateAction<File | null>>;
  onChangeArray?: React.Dispatch<React.SetStateAction<File[]>>;
  resetRef?: React.ForwardedRef<() => void> | undefined;
  multiple?: boolean;
}

export const Upload = ({
  onChange,
  resetRef,
  multiple,
  onChangeArray,
  ...buttonProps
}: UploadProps) => {
  if (multiple) {
    return (
      <FileButton
        resetRef={resetRef}
        onChange={onChangeArray!}
        accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        multiple
      >
        {(props) => <Button {...props} {...buttonProps} />}
      </FileButton>
    );
  }

  return (
    <FileButton
      resetRef={resetRef}
      onChange={onChange!}
      accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    >
      {(props) => <Button {...props} {...buttonProps} />}
    </FileButton>
  );
};
