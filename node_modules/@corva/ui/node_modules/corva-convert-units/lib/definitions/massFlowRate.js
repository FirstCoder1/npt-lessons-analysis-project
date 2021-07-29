var metric, imperial;

metric = {
  'mcg/s': {
    name: {
      singular: 'Microgram per second',
      plural: 'Micrograms per second',
      display: 'mcg/s'
    },
    to_anchor: 1 / 1000000
  },
  'mcg/min': {
    name: {
      singular: 'Microgram per minute',
      plural: 'Micrograms per minute',
      display: 'mcg/min'
    },
    to_anchor: 1 / (1000000 * 60)
  },
  'mcg/h': {
    name: {
      singular: 'Microgram per hour',
      plural: 'Micrograms per hour',
      display: 'mcg/h'
    },
    to_anchor: 1 / (1000000 * 3600)
  },
  'mg/s': {
    name: {
      singular: 'Milligram per second',
      plural: 'Milligrams per second',
      display: 'mg/s'
    },
    to_anchor: 1 / 1000
  },
  'mg/min': {
    name: {
      singular: 'Milligram per minute',
      plural: 'Milligrams per minute',
      display: 'mg/min'
    },
    to_anchor: 1 / (1000 * 60)
  },
  'mg/h': {
    name: {
      singular: 'Milligram per hour',
      plural: 'Milligrams per hour',
      display: 'mg/h'
    },
    to_anchor: 1 / (1000 * 3600)
  },
  'g/s': {
    name: {
      singular: 'Gram per second',
      plural: 'Grams per second',
      display: 'g/s'
    },
    to_anchor: 1
  },
  'g/min': {
    name: {
      singular: 'Gram per minute',
      plural: 'Grams per minute',
      display: 'g/min'
    },
    to_anchor: 1 / 60
  },
  'g/h': {
    name: {
      singular: 'Gram per hour',
      plural: 'Grams per hour',
      display: 'g/h'
    },
    to_anchor: 1 / 3600
  },
  'kg/s': {
    name: {
      singular: 'Kilogram per second',
      plural: 'Kilograms per second',
      display: 'kg/s'
    },
    to_anchor: 1000
  },
  'kg/min': {
    name: {
      singular: 'Kilogram per minute',
      plural: 'Kilograms per minute',
      display: 'kg/min'
    },
    to_anchor: 1000 / 60
  },
  'kg/h': {
    name: {
      singular: 'Kilogram per hour',
      plural: 'Kilograms per hour',
      display: 'kg/h'
    },
    to_anchor: 1000 / 3600
  },
  'ton/s': {
    name: {
      singular: 'Ton per second',
      plural: 'Tons per second',
      display: 't/s'
    },
    to_anchor: 1000 * 1000
  },
  'ton/min': {
    name: {
      singular: 'Ton per minute',
      plural: 'Tons per minute',
      display: 't/min'
    },
    to_anchor: (1000 * 1000) / 60
  },
  'ton/h': {
    name: {
      singular: 'Ton per hour',
      plural: 'Tons per hour',
      display: 't/h'
    },
    to_anchor: (1000 * 1000) / 3600
  }
};

imperial = {
  'oz/s': {
    name: {
      singular: 'Ounce per second',
      plural: 'Ounces per second',
      display: 'oz/s'
    },
    to_anchor: 1 / 16
  },
  'oz/min': {
    name: {
      singular: 'Ounce per minute',
      plural: 'Ounces per minute',
      display: 'oz/min'
    },
    to_anchor: 1 / (16 * 60)
  },
  'oz/h': {
    name: {
      singular: 'Ounce per hour',
      plural: 'Ounces per hour',
      display: 'oz/h'
    },
    to_anchor: 1 / (16 * 3600)
  },
  'lb/s': {
    name: {
      singular: 'Pound per second',
      plural: 'Pounds per second',
      display: 'lb/s'
    },
    to_anchor: 1
  },
  'lb/min': {
    name: {
      singular: 'Pound per minute',
      plural: 'Pounds per minute',
      display: 'lb/min'
    },
    to_anchor: 1 / 60
  },
  'lb/h': {
    name: {
      singular: 'Pound per hour',
      plural: 'Pounds per hour',
      display: 'lb/h'
    },
    to_anchor: 1 / 3600
  }
};

module.exports = {
  metric: metric,
  imperial: imperial,
  _anchors: {
    metric: {
      unit: 'g/s',
      ratio: 1 / 453.592
    },
    imperial: {
      unit: 'lb/s',
      ratio: 453.592
    }
  }
};
