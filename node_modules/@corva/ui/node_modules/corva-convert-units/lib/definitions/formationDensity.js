const metric = {
  Sg: {
    name: {
      singular: 'Specific Gravity',
      plural: 'Specific Gravity',
      display: 'Sg'
    },
    to_anchor: 1
  },
  'kg/m3': {
    name: {
      singular: 'Kilogram per Cubic Meter',
      plural: 'Kilograms per Cubic Meter',
      display: 'kg/m³'
    },
    to_anchor: 1
  },
  'g/m3': {
    name: {
      singular: 'Gram per Cubic Meter',
      plural: 'Grams per Cubic Meter',
      display: 'g/m³'
    },
    to_anchor: 1 / 1000
  },
  'g/cm3': {
    name: {
      singular: 'Gram per Cubic Centimeter',
      plural: 'Grams per Cubic Centimeter',
      display: 'g/cm³'
    },
    to_anchor: 1000
  },
  'g/l': {
    name: {
      singular: 'Gram per Litre',
      plural: 'Grams per Litre',
      display: 'g/cm³'
    },
    to_anchor: 1000
  },
  'lb/in3': {
    name: {
      singular: 'Pound per Cubic Inch',
      plural: 'Pounds per Cubic Inch',
      display: 'lb/in³'
    },
    to_anchor: 0.0361273
  },
  'lb/ft3': {
    name: {
      singular: 'Pound per Cubic Foot',
      plural: 'Pounds per Cubic Foot',
      display: 'lb/ft³'
    },
    to_anchor: 62.42797
  },

};

module.exports = {
  metric: metric,
  imperial: metric,
  _anchors: {
    metric: {
      unit: 'g/cm3',
      ratio: 1
    },
    imperial: {
      unit: 'g/cm3',
      ratio: 1
    }
  }
};
