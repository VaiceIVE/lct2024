import { ICtp } from 'shared/models/IBuilding';
import { CTP_LIST } from '../constants/CTP_LIST';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface ObjectData {
  UF_GEO_COORDINATES: string;
  UF_REG_NOMER_AKTA: string;
  UF_OBSHHAJA_INFORMAC: string;
  UF_NAZNACHENIE_OBEKT: string;
  UF_NAIMENOVANIE_OBEK: string;
  UF_STATUS: string;
  UF_TYPE: string;
}

interface Square {
  center: Coordinates;
  objectData: ObjectData;
}

const squares = createSquaresFromObjects();

function parseCoordinates(coords: string): Coordinates {
  const [latitude, longitude] = coords.split(',').map(Number);
  return { latitude, longitude };
}

function createSquare(center: Coordinates, objectData: ObjectData): Square {
  return {
    center,
    objectData,
  };
}

function createSquaresFromObjects(): Square[] {
  return CTP_LIST.map((obj) => {
    const center = parseCoordinates(obj.UF_GEO_COORDINATES);
    return createSquare(center, obj);
  });
}

function calculateDistance(point1: Coordinates, point2: Coordinates): number {
  const latDiff = point1.latitude - point2.latitude;
  const longDiff = point1.longitude - point2.longitude;
  return Math.sqrt(latDiff * latDiff + longDiff * longDiff);
}

export function findSquareForHouse(house: number[]): ICtp | null {
  let closestSquare: Square | null = null;
  let shortestDistance = Infinity;

  const houseCoordinates: Coordinates = {
    latitude: +house[0],
    longitude: +house[1],
  };

  for (const square of squares) {
    const distance = calculateDistance(houseCoordinates, square.center);

    if (distance < shortestDistance) {
      closestSquare = square;
      shortestDistance = distance;
    }
  }

  return closestSquare
    ? {
        address: closestSquare.objectData.UF_OBSHHAJA_INFORMAC,
        name: closestSquare.objectData.UF_NAIMENOVANIE_OBEK,
        coords: [
          +closestSquare.objectData.UF_GEO_COORDINATES.split(', ')[0],
          +closestSquare.objectData.UF_GEO_COORDINATES.split(', ')[1],
        ],
      }
    : null;
}
