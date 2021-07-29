var current;

current = {
  A: {
    name: {
      singular: 'Ampere',
      plural: 'Amperes',
      display: 'A',
    },
    to_anchor: 1000,
  },
  mA: {
    name: {
      singular: 'Milliampere',
      plural: 'Milliamperes',
      display: 'mA',
    },
    to_anchor: 1,
  },
};

module.exports = {
  metric: current,
  imperial: current,
  _anchors: {
    metric: {
      unit: 'mA',
      ratio: 1,
    },
    imperial: {
      unit: 'mA',
      ratio: 1,
    },
  },
};
