var metric, imperial;

metric = {
  ohmm: {
    name: {
      singular: 'ohm-meter',
      plural: 'ohm-meter',
      display: 'ohmm'
    },
    to_anchor: 1,
  },
};

imperial = {
  ohmm: {
    name: {
      singular: 'ohm-meter',
      plural: 'ohm-meter',
      display: 'ohmm'
    },
    to_anchor: 1
  }
};

module.exports = {
  metric: metric,
  imperial: imperial,
  _anchors: {
    metric: {
      unit: 'ohmm',
      ratio: 1,
    },
    imperial: {
      unit: 'ohmm',
      ratio: 1,
    },
  },
};
