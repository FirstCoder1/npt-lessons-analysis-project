const metric = {
  'Units (0-10000u)': {
    name: {
      singular: 'Unit (0-10000u)',
      plural: 'Units (0-10000u)',
      display: 'Units (0-10000u)'
    },
    to_anchor: 1 / 100
  },
  'Units (0-5000u)': {
    name: {
      singular: 'Unit (0-5000u)',
      plural: 'Units (0-5000u)',
      display: 'Units (0-5000u)'
    },
    to_anchor: 1 / 50
  },
  '%EMA': {
    name: {
      singular: '%EMA',
      plural: '%EMA',
      display: '%EMA'
    },
    to_anchor: 1
  },

};

module.exports = {
  metric: metric,
  imperial: metric,
  _anchors: {
    metric: {
      unit: '%EMA',
      ratio: 1
    },
    imperial: {
      unit: '%EMA',
      ratio: 1
    }
  }
};
