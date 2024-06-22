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
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);

  const R = 6371;
  const dLat = toRadians(point2.latitude - point1.latitude);
  const dLon = toRadians(point2.longitude - point1.longitude);
  const lat1 = toRadians(point1.latitude);
  const lat2 = toRadians(point2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
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
        coords: [closestSquare.center.latitude, closestSquare.center.longitude],
      }
    : null;
}
