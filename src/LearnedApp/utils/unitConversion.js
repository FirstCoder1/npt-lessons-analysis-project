import { get } from 'lodash';

import { getUnitPreference, getUnitDescription, convertValue, metricsUtils } from '@corva/ui/utils';

import { TABLE_NPT_LIST } from '../constants';

const { getMetricUnitDisplay, getConvertedMetricValue } = metricsUtils;

export function getUnit(key) {
  if (!key) {
    return '';
  }

  if (['hole_size', 'motorData.outer_diameter'].includes(key)) {
    const { system } = getUnitDescription(getUnitPreference('shortLength'));
    return system === 'imperial' ? '(in)' : '(mm)';
  }

  const metricConfig = TABLE_NPT_LIST.find(item => item.key === key);
  const unitDisplay = getMetricUnitDisplay(metricConfig);
  return unitDisplay ? `(${unitDisplay})` : '';
}

function getConvertedHoleSize(value) {
  const { system } = getUnitDescription(getUnitPreference('shortLength'));
  return system === 'imperial' ? value : convertValue(value, 'shortLength', 'in', 'mm');
}

export function getUnitConvertedValue(value, key, isMotorData = false) {
  if (!key) {
    return null;
  }

  if (!value) {
    return value;
  }

  if (isMotorData) {
    return {
      ...value,
      outer_diameter: getConvertedHoleSize(get(value, 'outer_diameter')),
      bit_to_bend: convertValue(get(value, 'bit_to_bend'), 'length', 'ft'),
    };
  }

  if (key === 'hole_size') {
    return getConvertedHoleSize(value);
  }

  if (key === 'min_vertical_section' || key === 'max_vertical_section') {
    return convertValue(value, 'length', 'ft');
  }

  if (key === 'min_inclination' || key === 'max_inclination') {
    return convertValue(value, 'angle', 'deg');
  }

  if (key === 'max_dls') {
    return convertValue(value, 'anglePerLength', 'dp100f');
  }

  const metricConfig = TABLE_NPT_LIST.find(item => item.key === key);
  return getConvertedMetricValue(value, metricConfig);
}

// NOTE: The app only supports mi and km for radius (filter)
export function getUnitForRadiusFilter() {
  const { system } = getUnitDescription(getUnitPreference('length'));
  return system === 'imperial' ? 'mi' : 'km';
}

// NOTE: The app calculates everything(in filtering stage) with imperial unit values
// because collection data is imperial unit values
export function convertRadiusFilterValue(value) {
  return convertValue(value, 'length', getUnitForRadiusFilter(), 'mi');
}

// NOTE: The app only supports ft and m for depth (filter)
export function getUnitForDepthFilter() {
  const { system } = getUnitDescription(getUnitPreference('length'));
  return system === 'imperial' ? 'ft' : 'm';
}

// NOTE: The app calculates everything(in filtering stage) with imperial unit values
// because collection data is imperial unit values
export function convertDepthFilterValue(value) {
  return convertValue(value, 'length', getUnitForDepthFilter(), 'ft');
}

// NOTE: The app only supports mm and in for hole size
export function formatHoleSize(value) {
  const { system } = getUnitDescription(getUnitPreference('shortLength'));
  return system === 'imperial'
    ? `${parseFloat(value).toFixed(3)} in`
    : `${parseFloat(convertValue(value, 'shortLength', 'in', 'mm')).toFixed(3)} mm`;
}

export function getSymbolOfMotorSize() {
  const { system } = getUnitDescription(getUnitPreference('shortLength'));
  return system === 'imperial' ? '"' : 'mm';
}

export function getUnitConvertedWellTime(value) {
  return parseFloat(convertValue(value, 'time', 's', 'd')).toFixed(2);
}
