var metric, imperial;

metric = {
  'gRMS': {
    name: {
      singular: 'gravity gRMS',
      plural: 'gravity gRMS',
      display: 'gRMS'
    },
    to_anchor: 1
  },
};

imperial = {
  'gRMS': {
    name: {
      singular: 'gravity gRMS',
      plural: 'gravity gRMS',
      display: 'gRMS'
    },
    to_anchor: 1
  },
};

module.exports = {
  metric: metric,
  imperial: imperial,
  _anchors: {
    metric: {
      unit: 'gRMS',
      ratio: 1
    },
    imperial: {
      unit: 'gRMS',
      ratio: 1
    }
  }
};
