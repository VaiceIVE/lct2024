import { Polygon } from '@pbe/react-yandex-maps';
import { District } from '../..';

interface DistrictsProps {
  districts: District[];
}

export const Districts = ({ districts }: DistrictsProps) => {
  const getDistrictColor = (
    index: number,
    total: number
  ): { fillColor: string; strokeColor: string } => {
    const ratio = index / (total - 1);

    if (total === 1)
      return {
        fillColor: 'rgba(255, 0, 0, 0.5)',
        strokeColor: 'rgba(255, 0, 0, 0.5)',
      };

    const red = Math.round(255 * (1 - ratio));
    const green = Math.round(255 * (1 - ratio));
    const blue = 50;

    const fillColor = `rgba(${red}, ${green}, ${blue}, 0.5)`;
    const strokeColor = `rgba(${red}, ${green}, ${blue}, 0.5)`;

    return { fillColor, strokeColor };
  };

  return (
    districts &&
    districts.map(({ name, coords }, index) => {
      const { fillColor, strokeColor } = getDistrictColor(
        index,
        districts.length || 1
      );

      return (
        <Polygon
          key={name}
          geometry={[coords]}
          options={{
            fillColor,
            strokeColor,
            strokeWidth: 2,
          }}
        />
      );
    })
  );
};
