var voltage;

voltage = {
  V: {
    name: {
      singular: 'Volt',
      plural: 'Volts',
      display: 'V',
    },
    to_anchor: 1000,
  },
  mV: {
    name: {
      singular: 'Millivolt',
      plural: 'Millivolts',
      display: 'mV',
    },
    to_anchor: 1,
  },
};

module.exports = {
  metric: voltage,
  imperial: voltage,
  _anchors: {
    metric: {
      unit: 'mV',
      ratio: 1,
    },
    imperial: {
      unit: 'mV',
      ratio: 1,
    },
  },
};
