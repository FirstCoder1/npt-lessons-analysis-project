var metric, imperial;

metric = {
  'g': {
    name: {
      singular: 'gravity',
      plural: 'gravity',
      display: 'g'
    },
    to_anchor: 1
  },
};

imperial = {
  'g': {
    name: {
      singular: 'gravity',
      plural: 'gravity',
      display: 'g'
    },
    to_anchor: 1
  },
};

module.exports = {
  metric: metric,
  imperial: imperial,
  _anchors: {
    metric: {
      unit: 'g',
      ratio: 1
    },
    imperial: {
      unit: 'g',
      ratio: 1
    }
  }
};
