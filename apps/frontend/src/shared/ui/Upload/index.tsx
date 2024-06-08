import { FileButton } from '@mantine/core';
import { Button, ButtonProps } from '../Button';

interface UploadProps extends ButtonProps {
  onChange: React.Dispatch<React.SetStateAction<File[]>>;
  resetRef: React.ForwardedRef<() => void> | undefined;
}

export const Upload = ({ onChange, resetRef, ...buttonProps }: UploadProps) => {
  return (
    <FileButton
      resetRef={resetRef}
      onChange={onChange}
      accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      multiple
    >
      {(props) => <Button {...props} {...buttonProps} />}
    </FileButton>
  );
};
