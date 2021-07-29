var metric, imperial;

metric = {
  ppm: {
    name: {
      singular: 'ppm',
      plural: 'ppm',
      display: 'ppm'
    },
    to_anchor: 1,
  },
};

imperial = {
  ppm: {
    name: {
      singular: 'ppm',
      plural: 'ppm',
      display: 'ppm'
    },
    to_anchor: 1
  }
};

module.exports = {
  metric: metric,
  imperial: imperial,
  _anchors: {
    metric: {
      unit: 'ppm',
      ratio: 1,
    },
    imperial: {
      unit: 'ppm',
      ratio: 1,
    },
  },
};
