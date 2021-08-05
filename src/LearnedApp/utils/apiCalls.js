import { get, range, uniqBy } from 'lodash';
import { mapbox } from '@corva/ui/utils';
import * as api from '@corva/ui/clients/jsonApi';

import { getAssetIdFromHashValue, hashFunction } from './hashValue';
import { TABLE_LIST } from '../constants';

const { getAssetV2Coordinates } = mapbox;

const MAX_WELL_NUMBER = 50;

export async function fetchTutorialVideoUrl() {
  const result = await api.getPicklist('bha_optimization_tutorial_video_url');
  return get(result, ['options', 'value']) || '';
}

export async function fetchWells(wellIds) {
  if (wellIds.length === 0) {
    return [];
  }

  const chunkSize = Math.floor(wellIds.length / MAX_WELL_NUMBER) + 1;

  const records = await Promise.all(
    range(chunkSize).map(async (_, index) => {
      let response = null;
      try {
        response = await api.getAssets({
          ids: wellIds.slice(MAX_WELL_NUMBER * index, MAX_WELL_NUMBER * (index + 1)),
          fields: [
            'asset.name',
            'asset.settings',
            'asset.status',
            'asset.stats',
            'asset.root_asset_name',
            'asset.parent_asset_name',
            'asset.parent_asset',
            'asset.visibility',
            'asset.last_active_at',
          ],
          sort: 'name',
        });
      } catch (e) {
        console.error(e);
      }

      return response
        ? response.data.map(item => {
            const coords = getAssetV2Coordinates(item, 'attributes.settings.top_hole');
            return {
              id: Number(item.id),
              name: get(item, 'attributes.name'),
              status: get(item, 'attributes.status'),
              visibility: get(item, 'attributes.visibility'),
              totalDepth: get(item, 'attributes.stats.total_depth'),
              totalTime: get(item, 'attributes.stats.total_time'),
              lastActiveDate: get(item, 'attributes.last_active_at'),
              rigId: Number(get(item, 'relationships.parent_asset.data.id')),
              rigName: get(item, 'attributes.parent_asset_name', 'Null'),
              basin: get(item, 'attributes.settings.basin', 'Null'),
              formation: get(item, 'attributes.settings.target_formation', 'Null'),
              driller: get(item, 'attributes.settings.directional_driller'),
              apiNumber: get(item, 'attributes.settings.api_number', '-'),
              topHole: get(item, 'attributes.settings.top_hole'),
              coords,
            };
          })
        : [];
    })
  );

  const result = [];
  records.forEach(data => result.push(...data));
  return result;
}

export async function fetchInclinations(wellIds) {
  if (wellIds.length === 0) {
    return [];
  }

  const chunkSize = Math.floor(wellIds.length / MAX_WELL_NUMBER) + 1;

  const records = await Promise.all(
    range(chunkSize).map(async (_, index) => {
      const $match = {
        asset_id: {
          $in: wellIds.slice(MAX_WELL_NUMBER * index, MAX_WELL_NUMBER * (index + 1)),
        },
        'data.stations': { $exists: true },
      };
      // NOTE: Get the last record in data.stations array to get inclination
      const $project = {
        _id: 0,
        asset_id: 1,
        lastRecord: {
          $arrayElemAt: ['$data.stations', -1],
        },
      };
      const queryJson = {
        aggregate: JSON.stringify([{ $match }, { $project }]),
      };

      let response = null;
      try {
        response = await api.getAppStorage('corva', 'data.actual_survey', null, queryJson);
      } catch (e) {
        console.error(e);
      }

      return response
        ? response.map(item => ({
            asset_id: item.asset_id,
            inclination: get(item, 'lastRecord.inclination', null),
          }))
        : [];
    })
  );

  const result = [];
  records.forEach(data => result.push(...data));
  return result;
}

export async function fetchHoleSections(wellIds) {
  if (wellIds.length === 0) {
    return [];
  }

  const chunkSize = Math.floor(wellIds.length / MAX_WELL_NUMBER) + 1;

  const records = await Promise.all(
    range(chunkSize).map(async (_, index) => {
      const $match = {
        asset_id: {
          $in: wellIds.slice(MAX_WELL_NUMBER * index, MAX_WELL_NUMBER * (index + 1)),
        },
      };
      const $project = {
        _id: 0,
        asset_id: 1,
        data: {
          top_depth: '$data.top_depth',
          bottom_depth: '$data.bottom_depth',
          diameter: '$data.diameter',
          name: '$data.name',
        },
      };

      const queryJson = {
        aggregate: JSON.stringify([{ $match }, { $project }]),
      };

      let response = null;
      try {
        response = await api.getAppStorage('corva', 'data.well-sections', null, queryJson);
      } catch (e) {
        console.error(e);
      }

      return response || [];
    })
  );

  const result = [];
  records.forEach(data => result.push(...data));
  return result;
}

export async function fetchCasings(wellIds) {
  if (wellIds.length === 0) {
    return [];
  }

  const chunkSize = Math.floor(wellIds.length / MAX_WELL_NUMBER) + 1;

  const records = await Promise.all(
    range(chunkSize).map(async (_, index) => {
      const $match = {
        asset_id: {
          $in: wellIds.slice(MAX_WELL_NUMBER * index, MAX_WELL_NUMBER * (index + 1)),
        },
      };
      const $project = {
        _id: 0,
        asset_id: 1,
        data: {
          top_depth: '$data.top_depth',
          bottom_depth: '$data.bottom_depth',
        },
      };

      const queryJson = {
        aggregate: JSON.stringify([{ $match }, { $project }]),
      };

      let response = null;
      try {
        response = await api.getAppStorage('corva', 'data.casing', null, queryJson);
      } catch (e) {
        console.error(e);
      }

      return response || [];
    })
  );

  const result = [];
  records.forEach(data => result.push(...data));
  return result;
}

export async function fetchRssData(wellIds) {
  if (wellIds.length === 0) {
    return [];
  }

  const chunkSize = Math.floor(wellIds.length / MAX_WELL_NUMBER) + 1;

  const records = await Promise.all(
    range(chunkSize).map(async (_, index) => {
      // NOTE: The result contains the wells that are only visible to admin(api bug)
      const $match = {
        asset_id: {
          $in: wellIds.slice(MAX_WELL_NUMBER * index, MAX_WELL_NUMBER * (index + 1)),
        },
        'data.id': { $type: 'int' },
        'data.components': {
          $elemMatch: { family: 'rss' },
        },
      };
      const $project = {
        _id: 0,
        asset_id: 1,
        bha_id: '$data.id',
      };

      const queryJson = {
        aggregate: JSON.stringify([{ $match }, { $project }]),
      };

      let response = null;
      try {
        response = await api.getAppStorage('corva', 'data.drillstring', null, queryJson);
      } catch (e) {
        console.error(e);
      }

      return response
        ? response.map(item => hashFunction(get(item, 'asset_id'), get(item, 'bha_id')))
        : [];
    })
  );

  const result = [];
  records.forEach(data => result.push(...data));
  return result;
}

// NOTE: Fetch start_depth & bit size of all bits
export async function fetchBhaData(wellIds) {
  if (wellIds.length === 0) {
    return [[], []];
  }

  const chunkSize = Math.floor(wellIds.length / MAX_WELL_NUMBER) + 1;

  const records = await Promise.all(
    range(chunkSize).map(async (_, index) => {
      const $match = {
        asset_id: {
          $in: wellIds.slice(MAX_WELL_NUMBER * index, MAX_WELL_NUMBER * (index + 1)),
        },
        'data.id': { $type: 'int' },
      };
      // NOTE: Projection stage to get bit component only
      const $project = {
        _id: 0,
        component: {
          $filter: {
            input: '$data.components',
            as: 'component',
            cond: { $eq: ['$$component.family', 'bit'] },
          },
        },
        bha_id: '$data.id',
        asset_id: '$asset_id',
        start_depth: '$data.start_depth',
        end_depth: '$data.end_depth',
      };

      const queryJson = {
        aggregate: JSON.stringify([{ $match }, { $project }]),
      };

      let response = null;
      try {
        response = await api.getAppStorage('corva', 'data.drillstring', null, queryJson);
      } catch (e) {
        console.error(e);
      }

      return response || [];
    })
  );

  // NOTE: Concat query result
  const result = [];
  records.forEach(data => result.push(...data));
  return [result, result.map(item => hashFunction(get(item, 'asset_id'), get(item, 'bha_id')))];
}

export async function fetchInitMetrics(companyId, wellIds, metricsKeys) {
  if (wellIds.length === 0) {
    return {};
  }

  const $match = {
    company_id: companyId,
    'data.asset_id': { $in: wellIds },
    'data.key': { $in: metricsKeys },
    'data.type': 'bha',
    'data.bha_id': { $type: 'int' },
  };

  const $project = {
    _id: 0,
    key: '$data.key',
    value: '$data.value',
    bha_id: '$data.bha_id',
    asset_id: '$data.asset_id',
  };

  const queryJson = {
    aggregate: JSON.stringify([{ $match }, { $project }]),
  };

  let response = null;
  try {
    response = await api.getAppStorage('corva', 'metrics', null, queryJson);
  } catch (e) {
    console.error(e);
    return {};
  }

  return response.reduce((result, metric) => {
    const { asset_id: assetId, bha_id: bhaId, key, value } = metric;

    const uid = `${assetId}--${bhaId}--${key}`;
    return {
      ...result,
      [uid]: value,
    };
  }, {});
}

export async function fetchMetricsData(companyId, hashValues, defMetricsKeys) {
  const metricsKeys =
    defMetricsKeys ||
    TABLE_LIST.filter(item => item.isMetricsData).map(item => item.key.split('.')[0]);

  if (hashValues.length === 0) {
    return [];
  }

  const wellIds = uniqBy(hashValues.map(value => getAssetIdFromHashValue(value)));

  const $match1 = {
    company_id: companyId,
    'data.asset_id': { $in: wellIds },
    'data.key': { $in: metricsKeys },
    'data.type': 'bha',
    'data.bha_id': { $type: 'int' },
  };

  const $project = {
    _id: 0,
    data: {
      key: '$data.key',
      value: '$data.value',
      bha_id: '$data.bha_id',
    },
    asset_id: '$data.asset_id',
    hashValue: {
      $add: [{ $multiply: ['$data.asset_id', 100] }, '$data.bha_id'],
    },
  };

  // NOTE: We should just get the bhas data that match the filtering options
  // Detailed comments in utils/hashValue.js
  const $match2 = {
    hashValue: { $in: hashValues },
  };

  const queryJson = {
    aggregate: JSON.stringify([{ $match: $match1 }, { $project }, { $match: $match2 }]),
  };

  let response = null;
  try {
    response = await api.getAppStorage('corva', 'metrics', null, queryJson);
  } catch (e) {
    console.error(e);
  }

  return response || [];
}

export async function fetchDrillstringData(companyId, hashValues) {
  if (hashValues.length === 0) {
    return [];
  }

  const wellIds = uniqBy(hashValues.map(value => getAssetIdFromHashValue(value)));

  const chunkSize = Math.floor(wellIds.length / MAX_WELL_NUMBER) + 1;

  const records = await Promise.all(
    range(chunkSize).map(async (_, index) => {
      const $match1 = {
        company_id: companyId,
        asset_id: {
          $in: wellIds.slice(MAX_WELL_NUMBER * index, MAX_WELL_NUMBER * (index + 1)),
        },
        'data.id': { $type: 'int' },
      };

      const $project = {
        _id: 0,
        bha_id: '$data.id',
        asset_id: 1,
        'data.components': 1,
        start_depth: '$data.start_depth',
        end_depth: '$data.end_depth',
        hashValue: {
          $add: [{ $multiply: ['$asset_id', 100] }, '$data.id'],
        },
      };

      const $match2 = {
        hashValue: { $in: hashValues },
      };

      const queryJson = {
        aggregate: JSON.stringify([{ $match: $match1 }, { $project }, { $match: $match2 }]),
      };

      let response = null;
      try {
        response = await api.getAppStorage('corva', 'data.drillstring', null, queryJson);
      } catch (e) {
        console.error(e);
      }

      return response || [];
    })
  );

  const result = [];
  records.forEach(data => result.push(...data));
  return result;
}
