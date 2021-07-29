import { get, orderBy } from 'lodash';

import { convertDepthFilterValue } from './unitConversion';

export function hashFunction(assetId, bhaId) {
  return assetId * 100 + bhaId;
}

export function getAssetIdFromHashValue(value) {
  return Math.floor(value / 100);
}

export function getBhaIdFromHashValue(value) {
  return value % 100;
}

export function getBhaHashValuesFromHoleSectionData(
  filterTable, wellIds, depthFilter, selectedSections, selectedSizes,
) {
  // NOTE: Filter bhas that drilled selected hole sections(if hole size is selected, the hole sections with that size)
  // and return the result with array of asset_id * 100 + bha_id
  const bhaHashValues = [];

  // NOTE: For depth filter, we have to do unit conversion (only support ft and m)
  // The app calculates everything(in filtering stage) with imperial unit values
  const minDepthFilterValue = convertDepthFilterValue(depthFilter.min);
  const maxDepthFilterValue = convertDepthFilterValue(depthFilter.max);

  if (depthFilter.option === 'custom' && minDepthFilterValue >= maxDepthFilterValue) {
    return [];
  }

  filterTable.holeSections
    .filter(record => (
      wellIds.includes(get(record, 'asset_id')) &&
      (selectedSections.length === 0 || selectedSections.includes(get(record, 'data.name'))) &&
      (selectedSizes.length === 0 || selectedSizes.includes(get(record, 'data.diameter'))) &&
      !(
        get(record, 'data.top_depth') > maxDepthFilterValue ||
        get(record, 'data.bottom_depth') < minDepthFilterValue
      )
    ))
    .forEach((record) => {
      const assetId = get(record, 'asset_id');
      const diameter = get(record, 'data.diameter');
      const topDepth = get(record, 'data.top_depth');
      const bottomDepth = get(record, 'data.bottom_depth');

      // NOTE: Different bhas can be used in a hole section
      // And a bha can be used in different hole sections
      const sortedBHAs = orderBy(
        filterTable.bitData.filter(item => get(item, 'asset_id') === assetId),
        ['start_depth'],
        ['asc'],
      );

      // NOTE: Add end_depth(not accurate, but we can use here) to each bha
      const adjustedBHAs = sortedBHAs.map((bha, index) => ({
        ...bha,
        start_depth: bha.start_depth + 1,
        end_depth: get(sortedBHAs[index + 1], 'start_depth') - 1,
      }));

      // NOTE: Get bhas used in the hole section
      const possibleBHAs = adjustedBHAs.filter(item => (
        get(item, 'component[0].size') === diameter &&
        !(
          get(item, 'start_depth') >= bottomDepth ||
          (get(item, 'end_depth') && get(item, 'end_depth') <= topDepth)
        ) &&
        !(
          get(item, 'start_depth') >= maxDepthFilterValue ||
          (get(item, 'end_depth') && (get(item, 'end_depth') <= minDepthFilterValue))
        )
      ));

      // NOTE: Extract hash values
      possibleBHAs
        .filter(item => Number.isInteger(get(item, 'bha_id')))
        .forEach((item) => {
          const hashValue = hashFunction(get(item, 'asset_id'), get(item, 'bha_id'));
          bhaHashValues.push(hashValue);
        });
    });

  return bhaHashValues;
}
