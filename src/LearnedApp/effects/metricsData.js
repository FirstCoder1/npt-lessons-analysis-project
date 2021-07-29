import { useState, useEffect } from 'react';
import { get, uniqBy, sortBy } from 'lodash';
import { convertRecordToPref } from '@corva/ui/utils/drillstring/conversion';
import { getBHASchematic } from '@corva/ui/utils/drillstring/schematic';

import { fetchMetricsData, fetchInitMetrics, fetchDrillstringData } from '../utils/apiCalls';
import { calculateMedian } from '../utils/calculations';
import { getUnitConvertedValue } from '../utils/unitConversion';
import { hashFunction, getAssetIdFromHashValue, getBhaIdFromHashValue } from '../utils/hashValue';

function getWhiskerPlots(values, key) {
  if (!Array.isArray(values)) {
    return getUnitConvertedValue(values, key);
  }

  const sortedValues = sortBy(values);
  const size = values.length;

  const p5 = getUnitConvertedValue(sortedValues[Math.floor(size * 0.05)], `${key}.median`);
  const p20 = getUnitConvertedValue(sortedValues[Math.floor(size * 0.2)], `${key}.median`);
  const median = getUnitConvertedValue(calculateMedian(sortedValues), `${key}.median`);
  const p80 = getUnitConvertedValue(sortedValues[Math.floor(size * 0.8)], `${key}.median`);
  const p95 = getUnitConvertedValue(sortedValues[Math.floor(size * 0.95)], `${key}.median`);

  return {
    p5,
    p20,
    median,
    p80,
    p95,
  };
}

function combineData(bhaHashValues, metricsData, drillstringData, initialData) {
  const { wells } = initialData;

  const wellsDict = wells.reduce((result, well) => {
    return {
      ...result,
      [well.id]: {
        wellName: well.name,
        rigName: well.rigName,
        driller: well.driller,
      },
    };
  }, {});

  const drillstringsDict = drillstringData.reduce((result, drillstring) => {
    const components = get(drillstring, 'data.components') || [];

    const bitData = components.find(component => component.family === 'bit');
    const motorData = components.find(component => component.family === 'pdm');
    const hwdpData = components.find(component => component.family === 'hwdp');

    return {
      ...result,
      [drillstring.hashValue]: {
        start_depth: getUnitConvertedValue(get(drillstring, 'start_depth'), 'start_depth'),
        hole_size: getUnitConvertedValue(get(bitData, 'size'), 'hole_size'),
        bitMake: get(bitData, 'make', '-'),
        bitReasonPulled: get(bitData, 'bit_reason_pulled', '-'),
        bitModel: get(bitData, 'model', '-'),
        bitTFA: get(bitData, 'tfa', '-'),
        motorData: getUnitConvertedValue(motorData, 'motorData', true),
        hwdpLength: getUnitConvertedValue(get(hwdpData, 'length'), 'hwdpLength'),
        schematic: getBHASchematic(components),
        drillstring: convertRecordToPref(drillstring),
      },
    };
  }, {});

  const metricsDict = metricsData.reduce((result, metric) => {
    const { hashValue } = metric;
    const metricKey = get(metric, 'data.key');
    const value = get(metric, 'data.value');

    if (result[hashValue]) {
      const subResult = result[hashValue];
      return {
        ...result,
        [hashValue]: {
          ...subResult,
          [metricKey]: getWhiskerPlots(value, metricKey),
        },
      };
    }

    return {
      ...result,
      [hashValue]: {
        [metricKey]: getWhiskerPlots(value, metricKey),
      },
    };
  }, {});

  const allData = bhaHashValues.reduce((result, bhaHashValue) => {
    const wellId = getAssetIdFromHashValue(bhaHashValue);
    const bhaId = getBhaIdFromHashValue(bhaHashValue);

    const well = wellsDict[wellId];
    const drillstring = drillstringsDict[bhaHashValue];
    const metrics = metricsDict[bhaHashValue];

    if (well && drillstring) {
      return [
        ...result,
        {
          wellId,
          bhaId,
          ...well,
          ...drillstring,
          ...metrics,
        },
      ];
    }

    return result;
  }, []);

  return allData;
}

export function useMetricsData(companyId, bhaHashValuesToFetch, initialData) {
  const [metricsData, setMetricsData] = useState(null);

  useEffect(() => {
    async function handleFetchInitialMetricsData() {
      if (!bhaHashValuesToFetch || !initialData) {
        return;
      }

      if (bhaHashValuesToFetch.length === 0) {
        setMetricsData([]);
      }

      const [metricsData, drillstringData] = await Promise.all([
        fetchMetricsData(companyId, bhaHashValuesToFetch),
        fetchDrillstringData(companyId, bhaHashValuesToFetch),
      ]);

      const allData = combineData(bhaHashValuesToFetch, metricsData, drillstringData, initialData);

      setMetricsData(allData);
    }

    setMetricsData(null);
    handleFetchInitialMetricsData();
  }, [bhaHashValuesToFetch]);

  return metricsData;
}

export function useSortedBhaHashValues(companyId, filteredBhas, sortingInfo, pageInfo) {
  const [bhasWithSortingValue, setBhasWithSortingValue] = useState(null);
  const [bhasToFetch, setBhasToFetch] = useState(null);

  useEffect(() => {
    async function fetchSortingMetric() {
      if (!filteredBhas) {
        return;
      }

      const wellIds = uniqBy(filteredBhas.map(bha => get(bha, 'asset_id')));

      const metricsKeys = [sortingInfo.key.split('.')[0]];

      const metricsData = await fetchInitMetrics(companyId, wellIds, metricsKeys);

      const bhasWithSortingValue = filteredBhas.map(bha => {
        const metricsKey = `${get(bha, 'asset_id')}--${get(bha, 'bha_id')}--${sortingInfo.key}`;
        return {
          ...bha,
          sortingKey: metricsData[metricsKey],
        };
      });

      setBhasWithSortingValue(bhasWithSortingValue);
    }

    setBhasWithSortingValue(null);
    fetchSortingMetric();
  }, [companyId, filteredBhas, sortingInfo.key]);

  useEffect(() => {
    if (!bhasWithSortingValue) {
      setBhasToFetch(null);
      return;
    }

    const sortedBhas =
      sortingInfo.direction === 'asc'
        ? sortBy(bhasWithSortingValue, 'sortingKey')
        : sortBy(bhasWithSortingValue, 'sortingKey').reverse();

    const paginatedBhas = sortedBhas.slice(
      pageInfo.perPage * pageInfo.pageNo,
      pageInfo.perPage * (pageInfo.pageNo + 1)
    );

    const bhaHashValues = paginatedBhas.map(bha => {
      const hashValue = hashFunction(get(bha, 'asset_id'), get(bha, 'bha_id'));
      return hashValue;
    });

    setBhasToFetch(bhaHashValues);
  }, [bhasWithSortingValue, sortingInfo.direction, pageInfo]);

  return bhasToFetch;
}
