import { IconArrowsMaximize } from '@tabler/icons-react';
import { Button } from 'shared/ui/Button';
import { WidgetWrapper } from 'shared/ui/Wrappers/WidgetWrapper';

export const ForecastMap = () => {
  return (
    <WidgetWrapper
      button={
        <Button
          label="Развернуть карту"
          icon={<IconArrowsMaximize width={18} height={18} />}
          type="light"
        />
      }
      title="События на карте"
    >
      123
    </WidgetWrapper>
  );
};
