import { IconArrowsMaximize } from '@tabler/icons-react';
import { NavLink } from 'react-router-dom';
import { MAP_ROUTE } from 'shared/constants/const';
import { IBuilding } from 'shared/models/IBuilding';
import { IObj } from 'shared/models/IResponse';
import { Button } from 'shared/ui/Button';
import { Map } from 'shared/ui/Map';
import { WidgetWrapper } from 'shared/ui/Wrappers/WidgetWrapper';

interface EventsMapProps {
  id: string | (string | null)[] | null;
  months: { value: number; label: string }[];
  monthsIndex: number;
  objs?: IObj[] | undefined;
  buildings?: IBuilding[];
  title?: string;
  isResponse?: boolean;
}

export const EventsMap = ({
  id,
  months,
  monthsIndex,
  objs,
  buildings,
  title,
  isResponse,
}: EventsMapProps) => {
  return (
    <WidgetWrapper
      button={
        <NavLink
          to={
            isResponse
              ? `${MAP_ROUTE}?isResponse=true`
              : `${MAP_ROUTE}?month=${months[monthsIndex].value}&${
                  id ? `id=${id}` : ''
                }`
          }
        >
          <Button
            label="Развернуть карту"
            icon={<IconArrowsMaximize width={18} height={18} />}
            type="light"
          />
        </NavLink>
      }
      title={title ? title : 'События на карте'}
    >
      <Map simpleMap objs={objs} buildings={buildings} />
    </WidgetWrapper>
  );
};
