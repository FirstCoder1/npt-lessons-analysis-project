var metric, imperial;

metric = {
  pu: {
    name: {
      singular: 'pu',
      plural: 'pu',
      display: 'pu'
    },
    to_anchor: 1,
  },
};

imperial = {
  pu: {
    name: {
      singular: 'pu',
      plural: 'pu',
      display: 'pu'
    },
    to_anchor: 1
  }
};

module.exports = {
  metric: metric,
  imperial: imperial,
  _anchors: {
    metric: {
      unit: 'pu',
      ratio: 1,
    },
    imperial: {
      unit: 'pu',
      ratio: 1,
    },
  },
};
