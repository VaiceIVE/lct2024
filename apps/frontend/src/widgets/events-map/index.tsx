import { IconArrowsMaximize } from '@tabler/icons-react';
import { NavLink } from 'react-router-dom';
import { MAP_ROUTE } from 'shared/constants/const';
import { IBuilding } from 'shared/models/IBuilding';
import { Button } from 'shared/ui/Button';
import { Map } from 'shared/ui/Map';
import { WidgetWrapper } from 'shared/ui/Wrappers/WidgetWrapper';

interface EventsMapProps {
  id: string | (string | null)[] | null;
  months: { value: number; label: string }[];
  monthsIndex: number;
  data: IBuilding[];
  setSelectedBuilding: React.Dispatch<React.SetStateAction<IBuilding | null>>;
}

export const EventsMap = ({
  id,
  months,
  monthsIndex,
  data,
  setSelectedBuilding,
}: EventsMapProps) => {
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
      <Map
        onPlacemarkClick={(building) => setSelectedBuilding(building)}
        buildings={data}
      />
    </WidgetWrapper>
  );
};
