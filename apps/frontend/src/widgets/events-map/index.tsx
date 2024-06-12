import { IconArrowsMaximize } from '@tabler/icons-react';
import { NavLink } from 'react-router-dom';
import { MAP_ROUTE } from 'shared/constants/const';
import { Button } from 'shared/ui/Button';
import { Map } from 'shared/ui/Map';
import { WidgetWrapper } from 'shared/ui/Wrappers/WidgetWrapper';

interface EventsMapProps {
  id: string | (string | null)[] | null;
  months: { value: number; label: string }[];
  monthsIndex: number;
}

export const EventsMap = ({ id, months, monthsIndex }: EventsMapProps) => {
  return (
    <WidgetWrapper
      button={
        <NavLink
          to={`${MAP_ROUTE}?month=${months[monthsIndex].value}&${
            id ? `id=${id}` : ''
          }`}
        >
          <Button
            label="Развернуть карту"
            icon={<IconArrowsMaximize width={18} height={18} />}
            type="light"
          />
        </NavLink>
      }
      title="События на карте"
    >
      <Map />
    </WidgetWrapper>
  );
};
