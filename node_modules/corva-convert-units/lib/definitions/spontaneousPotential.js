var metric, imperial;

metric = {
  mV: {
    name: {
      singular: 'mV',
      plural: 'mV',
      display: 'mV'
    },
    to_anchor: 1,
  },
};

imperial = {
  mV: {
    name: {
      singular: 'mV',
      plural: 'mV',
      display: 'mV'
    },
    to_anchor: 1
  }
};

module.exports = {
  metric: metric,
  imperial: imperial,
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
