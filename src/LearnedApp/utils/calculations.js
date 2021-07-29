import { get } from 'lodash';
import { convertValue, main as corvaMainUtils } from '@corva/ui/utils';

const { mathMin, mathMax } = corvaMainUtils.default;

export function calculateMedian(data) {
  if (!data || data.length === 0) {
    return null;
  }

  const size = data.length;
  return size % 2 === 0 ? (data[size / 2 - 1] + data[size / 2]) / 2 : data[(size - 1) / 2];
}

export function calculateRanges(filteredBhasStep1) {
  const MIN_DEPTH = 0;
  const MAX_DEPTH = Math.floor(convertValue(50000, 'length', 'ft'));
  const MIN_INC = 0;
  const MAX_INC = Math.floor(convertValue(360, 'angle', 'deg'));
  const MIN_STEPOUT = 0;
  const MAX_STEPOUT = Math.floor(convertValue(50000, 'length', 'ft'));

  if (!filteredBhasStep1) {
    return {
      md_range: null,
      inclination_range: null,
      stepout_range: null,
    };
  }

  let minDepth;
  let maxDepth;
  let minInc;
  let maxInc;
  let minStepOut;
  let maxStepOut;

  filteredBhasStep1.forEach(bha => {
    const startDepth = get(bha, 'start_depth');
    const endDepth = get(bha, 'end_depth');
    const startInc = get(bha, 'min_inclination');
    const endInc = get(bha, 'max_inclination');
    const stepout = get(bha, 'step_out');

    minDepth = mathMin(minDepth, mathMin(startDepth, endDepth));
    maxDepth = mathMax(maxDepth, mathMax(startDepth, endDepth));
    minInc = mathMin(minInc, mathMin(startInc, endInc));
    maxInc = mathMax(maxInc, mathMax(startInc, endInc));
    minStepOut = mathMin(minStepOut, stepout);
    maxStepOut = mathMax(maxStepOut, stepout);
  });

  return {
    md_range: [
      Math.floor(convertValue(minDepth, 'length', 'ft')) || MIN_DEPTH,
      Math.ceil(convertValue(maxDepth, 'length', 'ft')) || MAX_DEPTH,
    ],
    inclination_range: [
      Math.floor(convertValue(minInc, 'angle', 'deg')) || MIN_INC,
      Math.ceil(convertValue(maxInc, 'angle', 'deg')) || MAX_INC,
    ],
    stepout_range: [
      Math.floor(convertValue(minStepOut, 'length', 'ft')) || MIN_STEPOUT,
      Math.ceil(convertValue(maxStepOut, 'length', 'ft')) || MAX_STEPOUT,
    ],
  };
}
