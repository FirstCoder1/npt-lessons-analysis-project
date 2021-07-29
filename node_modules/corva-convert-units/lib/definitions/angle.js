// NOTE: Source PR not merged yet into 'convert-units':
// https://github.com/jbmiles/convert-units/commit/4a0c96fe16037dfa119d5105016f5bbcba1a755d
var angle;

angle = {
  rad: {
    name: {
      singular: 'radian',
      plural: 'radians',
      display: 'rad',
    },
    to_anchor: 180/Math.PI,
  },
  deg: {
    name: {
      singular: 'degree',
      plural: 'degrees',
      display: 'deg',
    },
    to_anchor: 1,
  },
  grad: {
    name: {
      singular: 'gradian',
      plural: 'gradians',
      display: 'grad',
    },
    to_anchor: 9/10,
  },
  arcmin: {
    name: {
      singular: 'arcminute',
      plural: 'arcminutes',
      display: 'acrmin',
    },
    to_anchor: 1/60,
  },
  arcsec: {
    name: {
      singular: 'arcsecond',
      plural: 'arcseconds',
      display: 'arcsec',
    },
    to_anchor: 1/3600,
  },
};

module.exports = {
  metric: angle,
  imperial: angle,
  _anchors: {
    metric: {
      unit: 'deg',
      ratio: 1,
    },
    imperial: {
      unit: 'deg',
      ratio: 1,
    },
  },
};
