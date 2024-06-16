export const buildingTypes: { [key: string]: string } = {
  mkd: 'Многоквартирный дом',
  medicine: 'Объект здравоохранения',
  education: 'Образовательное учереждение',
  tp: 'Тепловой пункт',
  prom: 'Прочее',
};

export const simpleBuildingTypes: { [key: string]: string } = {
  mkd: 'МКД',
  medicine: 'Здравоохранение',
  education: 'Образование',
  tp: 'ТП',
  prom: 'Прочее',
};

export const buildingTypesByFilters: { value: string; label: string }[] = [
  { value: 'mkd', label: 'Многоквартирный дом' },
  { value: 'medicine', label: 'Объект здравоохранения' },
  { value: 'education', label: 'Образовательное учереждение' },
  { value: 'tp', label: 'Тепловой пункт' },
  { value: 'prom', label: 'Прочее' },
];
