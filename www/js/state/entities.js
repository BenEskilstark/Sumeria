export const makeFarm = ({x, y}) => {
  return {
    type: 'FARM',
    x, y,
    isIrrigated: true,
    hydrated: false,
  };
};
