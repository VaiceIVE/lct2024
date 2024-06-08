import { FileButton } from '@mantine/core';
import { Button, ButtonProps } from '../Button';

interface UploadProps extends ButtonProps {
  onChange: React.Dispatch<React.SetStateAction<File | null>>;
}

export const Upload = ({ onChange, ...buttonProps }: UploadProps) => {
  return (
    <FileButton
      onChange={onChange}
      accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    >
      {(props) => <Button {...props} {...buttonProps} />}
    </FileButton>
  );
};
