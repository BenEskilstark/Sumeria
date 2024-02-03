export const config = {
  isRealtime: false,
  turnTime: 0, // ms

  width: 35, height: 35,

  seasons: ['NORMAL', 'DRY', 'WET'],
  seasonProbabilities: { // arrays ordered normal, dry, wet too
    'NORMAL': [25, 25, 25],
    'DRY': [10, 20, 5],
    'WET': [10, 5, 10],
  },
  seasonMultipliers: {
    'NORMAL': 1,
    'DRY': 0.25,
    'WET': 1.5,
  },

  waterSpoutQuantity: 50,

  forestGrowthTurns: 4,

  // ai
  apm: 150,
};

