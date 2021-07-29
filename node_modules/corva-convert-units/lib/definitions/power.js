var metric, imperial;

metric = {
  mhp: {
    name: {
      singular: 'metric horsepower',
      plural: 'metric horsepower',
      display: 'mhp'
    },
    to_anchor: 1,
  },
  watt: {
    name: {
      singular: 'watt',
      plural: 'watts',
      display: 'W'
    },
    to_anchor: 1/735.499,
  }
};

imperial = {
  hp: {
    name: {
      singular: 'horsepower',
      plural: 'horsepower',
      display: 'hp'
    },
    to_anchor: 1
  }
};

module.exports = {
  metric: metric,
  imperial: imperial,
  _anchors: {
    metric: {
      unit: 'mhp',
      ratio: 0.9863,
    },
    imperial: {
      unit: 'hp',
      ratio: 1/ 0.9863,
    },
  },
};
