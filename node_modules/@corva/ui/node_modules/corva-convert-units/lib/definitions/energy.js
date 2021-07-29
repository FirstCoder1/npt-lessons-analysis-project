var metric, imperial;

metric = {
  Nm: {
    name: {
      singular: 'Newton Meter',
      plural: 'Newton Meters',
      display: 'Nm'
    },
    to_anchor: 1
  },
  kNm: {
    name: {
      singular: 'Kilonewton meter',
      plural: 'Kilonewton meters',
      display: 'kNm',
    },
    to_anchor: 1000,
  },
  J: {
    name: {
      singular: 'Joule',
      plural: 'Joules',
      display: 'J'
    },
    to_anchor: 1
  }
};

imperial = {
  'ft-lbf': {
    name: {
      singular: 'Foot Pound',
      plural: 'Foot Pounds',
      display: 'ft-lbf'
    },
    to_anchor: 1
  },
  'ft-klbf': {
    name: {
      singular: 'Foot Kilopound',
      plural: 'Foot Kilopounds',
      display: 'ft-klbf'
    },
    to_anchor: 1000
  }
};

module.exports = {
  metric: metric,
  imperial: imperial,
  _anchors: {
    metric: {
      unit: 'nm',
      ratio: 0.73756214927727
    },
    imperial: {
      unit: 'ft-lbf',
      ratio: 1 / 0.73756214927727
    }
  }
};
