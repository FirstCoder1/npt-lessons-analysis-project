import { get, range, sortBy } from 'lodash';
import { mapbox } from '@corva/ui/utils';
import { getAppStorage, getPicklist, getAssets } from '@corva/ui/clients/jsonApi';

import { EVENTS_COLORS } from '../constants';

const { getAssetV2Coordinates } = mapbox;

const getNptColorByKey = key => {
  if (EVENTS_COLORS[key]) return EVENTS_COLORS[key];

  const randomColorHex = Math.floor(Math.random() * 16777215).toString(16);

  return `#${randomColorHex}`;
};

const handleFetchNptlist = async segment => {
  let response;
  try {
    response = await getPicklist('npt_types');
  } catch (e) {
    console.error(e);
    return [];
  }

  const { items } = response;
  // console.log(response, EVENTS_COLORS, segment);
  const nptTypes = items
    .filter(item => item.metadata.categories.includes(segment))
    .map(item => {
      return {
        value: item.name,
        label: item.metadata.label,
        color: getNptColorByKey(item.name),
      };
    });

  const sortedNptTypes = sortBy(nptTypes, 'label');

  return sortedNptTypes;
};

export async function fetchNTPData(assetId) {
  const nptTypes = await handleFetchNptlist('drilling');
  const records = await getAppStorage('corva', 'data.npt-events', assetId, { limit: 0 });
  const result = {
    nptTypes,
    records: sortBy(records, r => get(r, 'timestamp')),
  };
  return result;
}

export async function fetchLessonsData(assetId) {
  const result = await getAppStorage('corva', 'data.lessons-learned', assetId, {
    sort: '{timestamp: 1}',
    limit: 1000,
  });
  return result;
}

export async function fetchLessonsCause() {
  const result = await getPicklist('lesson_learned_cause');
  return result;
}

export async function fetchLessonsSeverity() {
  const result = await getPicklist('lesson_learned_severity');
  return result;
}

export async function fetchLessonsTopic() {
  const result = await getPicklist('lesson_learned_topic');
  return result;
}

const MAX_WELL_NUMBER = 50;

export async function fetchTutorialVideoUrl() {
  const result = await getPicklist('bha_optimization_tutorial_video_url');
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
        response = await getAssets({
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
