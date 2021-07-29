import { useEffect, useState, useRef } from 'react';
import { get, debounce } from 'lodash';

import {
  fetchTutorialVideoUrl,
  fetchWells,
  fetchInclinations,
  fetchRssData,
  fetchCasings,
  fetchHoleSections,
  fetchBhaData,
  fetchInitMetrics,
} from '../utils/apiCalls';
import { getAssetIdFromHashValue } from '../utils/hashValue';

import { MAX_OFFSETS_SUPPORTED } from '../constants';

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function useFetchInitialData(companyId, wellIds) {
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    async function fetchInitialData() {
      const metricsKeys = [
        'min_inclination',
        'max_inclination',
        'min_vertical_section',
        'max_vertical_section',
        'hole_depth',
        'step_out',
      ];

      const [
        tutorialVideoUrl,
        wells,
        inclinations,
        rssBhaHashValues,
        holeSections,
        casings,
        [bhaData, bhaHashValues],

        // FIXME: initial metrics are fetched for filtering purpose
        // min, max inc and vs are not included in drillstring collection
        // those KPIS are fetched initially to be used for filters
        // This will result in low performance.
        // We need to move all those min inc(vs), max in(vs) to drillstring collection
        metrics,
      ] = await Promise.all([
        fetchTutorialVideoUrl(),
        fetchWells(wellIds),
        fetchInclinations(wellIds),
        fetchRssData(wellIds),
        fetchHoleSections(wellIds),
        fetchCasings(wellIds),
        fetchBhaData(wellIds),
        fetchInitMetrics(companyId, wellIds, metricsKeys),
      ]);

      const adjustedBhaData = bhaData.map(bha => {
        const minInc = metrics[`${bha.asset_id}--${bha.bha_id}--min_inclination`];
        const maxInc = metrics[`${bha.asset_id}--${bha.bha_id}--max_inclination`];
        const minVS = metrics[`${bha.asset_id}--${bha.bha_id}--min_vertical_section`];
        const maxVS = metrics[`${bha.asset_id}--${bha.bha_id}--max_vertical_section`];
        const holeDepth = metrics[`${bha.asset_id}--${bha.bha_id}--hole_depth`];
        const stepout = metrics[`${bha.asset_id}--${bha.bha_id}--step_out`];
        return {
          ...bha,
          min_inclination: minInc,
          max_inclination: maxInc,
          min_vertical_section: minVS,
          max_vertical_section: maxVS,
          end_depth: holeDepth,
          step_out: stepout,
        };
      });

      const adjustedWells = wells.map(well => {
        const assetInclination = inclinations.find(inc => inc.asset_id === well.id);
        const assetHoleSections = holeSections.filter(section => section.asset_id === well.id);
        const sortedAssetCasings = casings
          .filter(casing => casing.asset_id === well.id)
          .sort((c1, c2) => get(c1, 'data.bottom_depth') - get(c2, 'data.bottom_depth'));
        const assetCasings = [];
        sortedAssetCasings.forEach((casing, idx) => {
          if (idx > 0) {
            assetCasings.push({
              ...casing,
              data: {
                ...casing.data,
                top_depth: get(sortedAssetCasings[idx - 1], 'data.bottom_depth'),
              },
            });
          } else {
            assetCasings.push(casing);
          }
        });

        const assetRssBhaHashValues = rssBhaHashValues.filter(
          value => getAssetIdFromHashValue(value) === well.id
        );
        const assetBhaHashValues = bhaHashValues.filter(
          value => getAssetIdFromHashValue(value) === well.id
        );

        const assetBhaData = adjustedBhaData.filter(bha => bha.asset_id === well.id);

        return {
          ...well,
          holeSections: assetHoleSections,
          casings: assetCasings,
          rssBhaHashValues: assetRssBhaHashValues,
          bhaHashValues: assetBhaHashValues,
          bhaData: assetBhaData,
          inclination: assetInclination && assetInclination.inclination,
        };
      });

      // NOTE: Get available rigs from well data
      const { rigs } = adjustedWells.reduce(
        (result, well) => {
          if (result.added.includes(well.rigId)) {
            return result;
          }

          return {
            rigs: result.rigs.concat({
              id: well.rigId,
              name: well.rigName,
            }),
            added: result.added.concat(well.rigId),
          };
        },
        {
          rigs: [],
          added: [],
        }
      );

      setInitialData({
        tutorialVideoUrl,
        wells: adjustedWells,
        rigs,
        holeSections,
        rssBhaHashValues,
        bhaHashValues,
        bhaData,
      });
    }

    if (wellIds.length > MAX_OFFSETS_SUPPORTED) {
      setInitialData({
        tutorialVideoUrl: '',
        wells: [],
        rigs: [],
        holeSections: [],
        rssBhaHashValues: [],
        bhaHashValues: [],
        bhaData: [],
        error: 'Too Many Offset Wells Selected, Narrow Search by Selecting Additional Filters.',
      });
    } else {
      setInitialData(null);
      fetchInitialData();
    }
  }, [companyId, wellIds]);

  return initialData;
}

// NOTE: App settings tend to change frequently, so make debounced func not to make api call a lot
const debouncedFunc = debounce(callback => {
  callback();
}, 1000);

export const useSaveSettings = (
  coRelationFilters,
  rssFilter,
  oneRunBhaFilter,
  mdFilter,
  stepOutFilter,
  inclinationFilter,
  sortInfo,
  tableSettings,
  chartExpanded,
  removedBhas,
  onSettingsChange
) => {
  const initialLoadingRef = useRef(true);

  const storeAppSettings = () => {
    onSettingsChange({
      savedCoRelationFilters: coRelationFilters,
      savedRssFilter: rssFilter,
      savedOneRunBhaFilter: oneRunBhaFilter,
      savedStepOutFilter: stepOutFilter,
      savedInclinationFilter: inclinationFilter,
      savedMdFilter: mdFilter,
      savedSortInfo: sortInfo,
      savedTableSettings: tableSettings,
      savedChartExpanded: chartExpanded,
      savedRemovedBhas: removedBhas,
    });
  };

  useEffect(() => {
    if (!onSettingsChange) {
      return;
    }

    if (!initialLoadingRef.current) {
      debouncedFunc(storeAppSettings);
    } else {
      initialLoadingRef.current = false;
    }
  }, [
    coRelationFilters,
    rssFilter,
    oneRunBhaFilter,
    mdFilter,
    stepOutFilter,
    inclinationFilter,
    sortInfo,
    tableSettings,
    chartExpanded,
    removedBhas,
  ]);
};
