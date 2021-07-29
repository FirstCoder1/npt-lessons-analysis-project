import { get } from 'lodash';
import { convertValue, getUnitPreference } from '@corva/ui/utils';

import { CO_RELATION_FILTERS } from '../constants';
import { hashFunction } from './hashValue';

export function getFilteredWells(initialData, coRelationFilters) {
  if (!initialData) {
    return null;
  }

  let result = [];

  initialData.wells.forEach(well => {
    let filteredHoleSections = well.holeSections;
    let isMatching = true;
    for (let i = 0; i < CO_RELATION_FILTERS.length; i += 1) {
      const { key: filterKey, path } = CO_RELATION_FILTERS[i];
      if (filterKey === 'driller' || filterKey === 'rigName') {
        if (
          coRelationFilters[filterKey] &&
          coRelationFilters[filterKey].length > 0 &&
          !coRelationFilters[filterKey].includes(well[filterKey])
        ) {
          isMatching = false;
          break;
        }
      }
      if (filterKey === 'holeSectionName' || filterKey === 'holeSectionSize') {
        if (coRelationFilters[filterKey] && coRelationFilters[filterKey].length > 0) {
          filteredHoleSections = filteredHoleSections.filter(matchingSection => {
            return coRelationFilters[filterKey].includes(get(matchingSection, path));
          });
          if (filteredHoleSections.length === 0) {
            isMatching = false;
            break;
          }
        }
      }
    }

    if (isMatching) {
      result.push({
        ...well,
        filteredHoleSections: filteredHoleSections,
      });
    }
  });

  return result;
}

export function getFilteredBhasStep1(wells, rssFilter, oneRunBhaFilter) {
  if (!wells) {
    return null;
  }

  if (wells.length === 0) {
    return [];
  }

  const filteredBhas = wells.reduce((result, well) => {
    const { rssBhaHashValues, bhaData, casings, filteredHoleSections, holeSections } = well;

    const isSectionFilterOn = filteredHoleSections.length !== holeSections.length;

    const filteredWellBhas = [];
    bhaData.forEach(bha => {
      const bitSize = get(bha, 'component[0].size');
      const bhaStartDepth = get(bha, 'start_depth');
      const bhaEndDepth = get(bha, 'end_depth');
      const hashValue = hashFunction(get(bha, 'asset_id'), get(bha, 'bha_id'));

      const isRssFilterSatisfied =
        rssFilter === 'all' ||
        (rssFilter === 'conventional' && !rssBhaHashValues.includes(hashValue)) ||
        (rssFilter === 'rss' && rssBhaHashValues.includes(hashValue));

      if (isRssFilterSatisfied) {
        const matchingHoleSections = filteredHoleSections.filter(matching => {
          const diameter = get(matching, 'data.diameter');
          const sectionTopDepth = get(matching, 'data.top_depth');
          const sectionBottomDepth = get(matching, 'data.bottom_depth');

          return (
            bhaStartDepth <= sectionBottomDepth &&
            bhaEndDepth >= sectionTopDepth &&
            diameter === bitSize
          );
        });

        const isSectionFilterSatisfied = !isSectionFilterOn || matchingHoleSections.length > 0;

        if (oneRunBhaFilter.on) {
          if (oneRunBhaFilter.objective === 'section') {
            const filteredHoleSections = matchingHoleSections.filter(section => {
              const sectionTopDepth = get(section, 'data.top_depth');
              const sectionBottomDepth = get(section, 'data.bottom_depth');
              const drilled =
                Math.min(bhaEndDepth, sectionBottomDepth) -
                Math.max(sectionTopDepth, bhaStartDepth);
              const length = sectionBottomDepth - sectionTopDepth;
              return (drilled / length) * 100 >= oneRunBhaFilter.percent;
            });

            if (filteredHoleSections.length > 0) {
              filteredWellBhas.push(bha);
            }
          } else {
            const filteredCasings = casings.filter(casing => {
              const casingTopDepth = get(casing, 'data.top_depth');
              const casingBottomDepth = get(casing, 'data.bottom_depth');

              const drilled =
                Math.min(bhaEndDepth, casingBottomDepth) - Math.max(bhaStartDepth, casingTopDepth);
              const length = casingBottomDepth - casingTopDepth;

              return (drilled / length) * 100 > oneRunBhaFilter.percent;
            });

            if (filteredCasings.length > 0) {
              filteredWellBhas.push(bha);
            }
          }
        } else if (isSectionFilterSatisfied) {
          filteredWellBhas.push(bha);
        } else {
          // Do nothing. BHA is filtered out.
        }
      }
    });

    return result.concat(filteredWellBhas);
  }, []);

  return filteredBhas;
}

export function getFilteredBhasStep2(bhas, mdFilter, inclinationFilter, stepOutFilter) {
  if (!bhas || !mdFilter || !inclinationFilter) {
    return null;
  }

  const minInc = convertValue(inclinationFilter[0], 'angle', getUnitPreference('angle'), 'deg');
  const maxInc = convertValue(inclinationFilter[1], 'angle', getUnitPreference('angle'), 'deg');
  const minDepth = convertValue(mdFilter[0], 'length', getUnitPreference('length'), 'ft');
  const maxDepth = convertValue(mdFilter[1], 'length', getUnitPreference('length'), 'ft');
  const minStepOut = convertValue(stepOutFilter[0], 'length', getUnitPreference('length'), 'ft');
  const maxStepOut = convertValue(stepOutFilter[1], 'length', getUnitPreference('length'), 'ft');

  const filteredBhas = bhas.filter(bha => {
    const bhaStartDepth = get(bha, 'start_depth');
    const bhaEndDepth = get(bha, 'end_depth');
    const bhaMinInc = get(bha, 'min_inclination');
    const bhaMaxInc = get(bha, 'max_inclination');
    const bhaStepOut = get(bha, 'step_out');

    if (
      bhaStartDepth >= minDepth &&
      bhaStartDepth <= maxDepth &&
      bhaEndDepth >= minDepth &&
      bhaEndDepth <= maxDepth
    ) {
      if (
        !bhaMinInc ||
        !bhaMaxInc ||
        (bhaMinInc >= minInc && bhaMinInc <= maxInc && bhaMaxInc >= minInc && bhaMaxInc <= maxInc)
      ) {
        if (!bhaStepOut || (bhaStepOut >= minStepOut && bhaStepOut <= maxStepOut)) {
          return true;
        }
        return false;
      }
      return false;
    }

    return false;

    // FIXME: Min, MAX inc, vs KPIS are not available for all the wells at this time of writing.
    // Until we rerun all the wells, we should not filter based on inc and step out filter.
    // return (
    //   bhaStartDepth >= minDepth &&
    //   bhaStartDepth <= maxDepth &&
    //   bhaEndDepth >= minDepth &&
    //   bhaEndDepth <= maxDepth &&
    //   bhaMinInc >= minInc &&
    //   bhaMinInc <= maxInc &&
    //   bhaMaxInc >= minInc &&
    //   bhaMaxInc <= maxInc &&
    //   bhaStepOut >= minStepOut &&
    //   bhaStepOut <= maxStepOut
    // );
  });

  return filteredBhas;
}
