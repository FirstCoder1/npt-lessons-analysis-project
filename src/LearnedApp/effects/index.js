import { useEffect, useState, useRef } from 'react';
import { debounce, uniq, get, minBy, maxBy, isEqual, union } from 'lodash';

import {
  fetchNptData,
  fetchNptTypeData,
  fetchLessonsData,
  fetchLessonsCause,
  fetchLessonsSeverity,
  fetchLessonsTopic,
  fetchTutorialVideoUrl,
  fetchWells,
} from '../utils/apiCalls';

import { MAX_OFFSETS_SUPPORTED } from '../constants';

export function useFetchNptData(wellIds, savedNptTypeFilter) {
  const [isLoading, setIsLoading] = useState(false);
  const [nptData, setNptData] = useState([]);
  const [nptTypeFilter, setNptTypeData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const nptTypes = await fetchNptTypeData();
      const typeData = nptTypes.map(item => {
        return {
          key: item.value,
          title: item.label,
          color: item.color,
          checked: true,
        };
      });
      if (!savedNptTypeFilter) {
        setNptTypeData(typeData);
      } else {
        setNptTypeData(savedNptTypeFilter);
      }

      const allResult = await Promise.all(wellIds.map(assetId => fetchNptData(assetId)));
      const records = [];
      allResult.forEach(result =>
        result.forEach(item => {
          records.push(item);
        })
      );
      setNptData(records);

      setIsLoading(true);
    }

    fetchData();
  }, [wellIds]);

  return [isLoading, nptData, nptTypeFilter, setNptTypeData];
}

export function useFetchLessonsData(wellIds, savedLessonsFilter, savedOpFilter, savedDepthFilter) {
  const [isLoading, setIsLoading] = useState(false);
  const [lessonsRecord, setLessonRecord] = useState(null);
  const [lessonsFilterData, setLessonsFilterData] = useState(null);
  const [opFilterData, setOpFilterData] = useState(null);
  const [depthData, setDepthData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const allResult = await Promise.all(wellIds.map(assetId => fetchLessonsData(assetId)));
      const record = [];
      allResult.forEach(result =>
        result.forEach(item => {
          record.push(item);
        })
      );
      setLessonRecord(record);

      const [causeRes, severityRes, topicRes] = await Promise.all([
        fetchLessonsCause(),
        fetchLessonsSeverity(),
        fetchLessonsTopic(),
      ]);

      const topicList = ['All'].concat(topicRes.items.map(item => item.name).sort());
      const severityList = ['All'].concat(severityRes.items.map(item => item.name).sort());
      const causeList = ['All'].concat(causeRes.items.map(item => item.name).sort());

      if (
        savedLessonsFilter?.length > 0 &&
        isEqual(savedLessonsFilter[0].array, topicList) &&
        isEqual(savedLessonsFilter[1].array, severityList) &&
        isEqual(savedLessonsFilter[2].array, causeList)
      ) {
        setLessonsFilterData(savedLessonsFilter);
      } else {
        setLessonsFilterData([
          {
            key: 'topic',
            title: 'Event Topic',
            value: 'All',
            array: topicList,
          },
          {
            key: 'severity',
            title: 'Event Severity',
            value: 'All',
            array: severityList,
          },
          {
            key: 'cause',
            title: 'Event Cause',
            value: 'All',
            array: causeList,
          },
        ]);
      }

      const holeSectionList = ['All'].concat(uniq(record.map(item => item.data.section)).sort());
      const activityList = ['All'].concat(uniq(record.map(item => item.data.activity)).sort());
      const phaseList = ['All'].concat(uniq(record.map(item => item.data.phase)).sort());

      if (
        savedOpFilter?.length > 0 &&
        isEqual(savedOpFilter[0].array, holeSectionList) &&
        isEqual(savedOpFilter[1].array, activityList) &&
        isEqual(savedOpFilter[2].array, phaseList)
      ) {
        setOpFilterData(savedOpFilter);
      } else {
        setOpFilterData([
          {
            key: 'holesection',
            title: 'Hole Section',
            value: 'All',
            array: holeSectionList,
          },
          {
            key: 'activity',
            title: 'Activity',
            value: 'All',
            array: activityList,
          },
          {
            key: 'phase',
            title: 'Phase',
            value: 'All',
            array: phaseList,
          },
          {
            key: 'depth',
            title: 'Depth',
            value: 'Measured Depth',
            array: ['Measured Depth', 'True Vertical Depth'],
          },
        ]);
      }

      const mdData = record.map(item => [get(item.data, 'md_start'), get(item.data, 'md_end')]);
      const tvdData = record.map(item => [get(item.data, 'tvd_start'), get(item.data, 'tvd_end')]);
      const mdStartList = [
        mdData?.length === 0 ? 0 : Math.floor(minBy(mdData, item => item[0])[0]),
        mdData?.length === 0 ? 0 : Math.ceil(maxBy(mdData, item => item[0])[0]),
      ];
      const mdEndList = [
        mdData?.length === 0 ? 0 : Math.floor(minBy(mdData, item => item[1])[1]),
        mdData?.length === 0 ? 0 : Math.ceil(maxBy(mdData, item => item[1])[1]),
      ];
      const tvdStartList = [
        tvdData?.length === 0 ? 0 : Math.floor(minBy(tvdData, item => item[0])[0]),
        tvdData?.length === 0 ? 0 : Math.ceil(maxBy(tvdData, item => item[0])[0]),
      ];
      const tvdEndList = [
        tvdData?.length === 0 ? 0 : Math.floor(minBy(tvdData, item => item[1])[1]),
        tvdData?.length === 0 ? 0 : Math.ceil(maxBy(tvdData, item => item[1])[1]),
      ];

      if (
        isEqual(get(savedDepthFilter, ['Measured Depth', 'start']), mdStartList) &&
        isEqual(get(savedDepthFilter, ['Measured Depth', 'end']), mdEndList) &&
        isEqual(get(savedDepthFilter, ['True Vertical Depth', 'start']), tvdStartList) &&
        isEqual(get(savedDepthFilter, ['True Vertical Depth', 'end']), tvdEndList)
      ) {
        setDepthData(savedDepthFilter);
      } else {
        setDepthData({
          'Measured Depth': {
            unit: '(ft, MD)',
            start: mdStartList,
            end: mdEndList,
            startRange: mdStartList,
            endRange: mdEndList,
          },
          'True Vertical Depth': {
            unit: '(ft, TVD)',
            start: tvdStartList,
            end: tvdEndList,
            startRange: tvdStartList,
            endRange: tvdEndList,
          },
        });
      }

      setIsLoading(true);
    }

    fetchData();
  }, [wellIds]);

  return [
    isLoading,
    lessonsRecord,
    depthData,
    setDepthData,
    opFilterData,
    setOpFilterData,
    lessonsFilterData,
    setLessonsFilterData,
  ];
}

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
      const [tutorialVideoUrl, wells] = await Promise.all([
        fetchTutorialVideoUrl(),
        fetchWells(wellIds),
      ]);

      setInitialData({
        tutorialVideoUrl,
        wells,
      });
    }

    if (wellIds.length > MAX_OFFSETS_SUPPORTED) {
      setInitialData({
        tutorialVideoUrl: '',
        wells: [],
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
  eventKind,
  nptTypeFilter,
  lessonsFilter,
  opFilter,
  depthFilter,
  dateFilter,
  tableSettings,
  chartExpanded,
  onSettingsChange
) => {
  const initialLoadingRef = useRef(true);

  const storeAppSettings = () => {
    onSettingsChange({
      savedEvent: eventKind,
      savedNptTypeFilter: nptTypeFilter,
      savedLessonsFilter: lessonsFilter,
      savedOpFilter: opFilter,
      savedDepthFilter: depthFilter,
      savedDateFilter: dateFilter,
      savedTableSettings: tableSettings,
      savedChartExpanded: chartExpanded,
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
    eventKind,
    nptTypeFilter,
    lessonsFilter,
    opFilter,
    depthFilter,
    dateFilter,
    tableSettings,
    chartExpanded,
  ]);
};
