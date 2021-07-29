var metric, imperial;

metric = {
  mm3: {
    name: {
      singular: 'Cubic Millimeter',
      plural: 'Cubic Millimeters',
      display: 'mm³'
    },
    to_anchor: 1 / 1000000
  },
  cm3: {
    name: {
      singular: 'Cubic Centimeter',
      plural: 'Cubic Centimeters',
      display: 'cm³'
    },
    to_anchor: 1 / 1000
  },
  ml: {
    name: {
      singular: 'Millilitre',
      plural: 'Millilitres',
      display: 'ml'
    },
    to_anchor: 1 / 1000
  },
  cl: {
    name: {
      singular: 'Centilitre',
      plural: 'Centilitres',
      display: 'cl'
    },
    to_anchor: 1 / 100
  },
  dl: {
    name: {
      singular: 'Decilitre',
      plural: 'Decilitres',
      display: 'dl'
    },
    to_anchor: 1 / 10
  },
  l: {
    name: {
      singular: 'Litre',
      plural: 'Litres',
      display: 'l'
    },
    to_anchor: 1
  },
  m3: {
    name: {
      singular: 'Cubic meter',
      plural: 'Cubic meters',
      display: 'm³'
    },
    to_anchor: 1000
  },
  km3: {
    name: {
      singular: 'Cubic kilometer',
      plural: 'Cubic kilometers',
      display: 'km³'
    },
    to_anchor: 1000000000000
  }

  // Swedish units
  ,
  krm: {
    name: {
      singular: 'Matsked',
      plural: 'Matskedar',
      display: 'krm'
    },
    to_anchor: 1 / 1000
  },
  tsk: {
    name: {
      singular: 'Tesked',
      plural: 'Teskedar',
      display: 'tsk'
    },
    to_anchor: 5 / 1000
  },
  msk: {
    name: {
      singular: 'Matsked',
      plural: 'Matskedar',
      display: 'msk'
    },
    to_anchor: 15 / 1000
  },
  kkp: {
    name: {
      singular: 'Kaffekopp',
      plural: 'Kaffekoppar',
      display: 'kkp'
    },
    to_anchor: 150 / 1000
  },
  glas: {
    name: {
      singular: 'Glas',
      plural: 'Glas',
      display: 'glas'
    },
    to_anchor: 200 / 1000
  },
  kanna: {
    name: {
      singular: 'Kanna',
      plural: 'Kannor',
      display: 'kanna'
    },
    to_anchor: 2.617
  }
};

imperial = {
  tsp: {
    name: {
      singular: 'Teaspoon',
      plural: 'Teaspoons',
      display: 'tsp'
    },
    to_anchor: 1 / 6
  },
  Tbs: {
    name: {
      singular: 'Tablespoon',
      plural: 'Tablespoons',
      display: 'tbsp'
    },
    to_anchor: 1 / 2
  },
  in3: {
    name: {
      singular: 'Cubic inch',
      plural: 'Cubic inches',
      display: 'in³'
    },
    to_anchor: 0.55411
  },
  'fl-oz': {
    name: {
      singular: 'Fluid Ounce',
      plural: 'Fluid Ounces',
      display: 'fl-oz'
    },
    to_anchor: 1
  },
  cup: {
    name: {
      singular: 'Cup',
      plural: 'Cups',
      display: 'cup'
    },
    to_anchor: 8
  },
  pnt: {
    name: {
      singular: 'Pint',
      plural: 'Pints',
      display: 'pint'
    },
    to_anchor: 16
  },
  qt: {
    name: {
      singular: 'Quart',
      plural: 'Quarts',
      display: 'qt'
    },
    to_anchor: 32
  },
  gal: {
    name: {
      singular: 'Gallon',
      plural: 'Gallons',
      display: 'gal'
    },
    to_anchor: 128
  },
  ft3: {
    name: {
      singular: 'Cubic foot',
      plural: 'Cubic feet',
      display: 'ft³'
    },
    to_anchor: 957.506
  },
  yd3: {
    name: {
      singular: 'Cubic yard',
      plural: 'Cubic yards',
      display: 'yd³'
    },
    to_anchor: 25852.7
  },
  bbl: {
    name: {
      singular: 'Oil barrel',
      plural: 'Oil barrels',
      display: 'bbl'
    },
    to_anchor: 5376
  }
};

module.exports = {
  metric: metric,
  imperial: imperial,
  _anchors: {
    metric: {
      unit: 'l',
      ratio: 33.8140226
    },
    imperial: {
      unit: 'fl-oz',
      ratio: 1 / 33.8140226
    }
  }
};
