var metric, imperial;

metric = {
  md: {
    name: {
      singular: 'millidarcy',
      plural: 'millidarcy',
      display: 'md'
    },
    to_anchor: 1,
  },
};

imperial = {
  md: {
    name: {
      singular: 'millidarcy',
      plural: 'millidarcy',
      display: 'md'
    },
    to_anchor: 1
  }
};

module.exports = {
  metric: metric,
  imperial: imperial,
  _anchors: {
    metric: {
      unit: 'md',
      ratio: 1,
    },
    imperial: {
      unit: 'md',
      ratio: 1,
    },
  },
};
