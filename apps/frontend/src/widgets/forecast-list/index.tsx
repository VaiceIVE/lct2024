import { IconDownload } from '@tabler/icons-react';
import { Button } from 'shared/ui/Button';
import { WidgetWrapper } from 'shared/ui/Wrappers/WidgetWrapper';

export const ForecastList = () => {
  return (
    <WidgetWrapper
      button={
        <Button
          label="Скачать таблицу"
          icon={<IconDownload width={18} height={18} />}
          type="light"
        />
      }
      title="Список событий"
    >
      <div>123</div>
    </WidgetWrapper>
  );
};
