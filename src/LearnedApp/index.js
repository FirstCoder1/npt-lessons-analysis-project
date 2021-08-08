import { memo, useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { debounce, get } from 'lodash';
import { makeStyles } from '@material-ui/core';
import { LoadingIndicator, EmptyView } from '@corva/ui/components';
import { isNativeDetected, isMobileDetected } from '@corva/ui/utils/mobileDetect';

import Drawer from './components/Drawer';
import Filters from './components/Filters';
import Content from './components/Content';
import Tutorial from './components/Tutorial';

import {
  useFetchNptData,
  useFetchLessonsData,
  useFetchInitialData,
  useSaveSettings,
} from './effects';
import { DEFAULT_SETTINGS, TABLE_KIND } from './constants';

const useStyles = makeStyles({
  exploreView: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    minHeight: 0,
    position: 'relative',
  },
  loadingWrapper: {
    position: 'relative',
    flexGrow: 100,
    display: 'flex',
    alignItems: 'center',
  },
  emptyViewArrow: {
    right: '190px',
  },
});

function LearnedApp(props) {
  const {
    well,
    coordinates,
    offsetSetting,
    savedEvent,
    savedNptTypeFilter,
    savedLessonsFilter,
    savedOpFilter,
    savedDepthFilter,
    savedDateFilter,
    savedIsTutorialShown,
    savedStepOutFilter,
    savedTableSettings,
    savedChartExpanded,
    savedSortInfo,
    onSettingsChange,
  } = props;

  const classes = useStyles();
  const isMobile = isMobileDetected || isNativeDetected || coordinates.w <= 3;
  const { companyId } = offsetSetting;

  const offsetWellIds = useMemo(() => {
    const selectedWellIds = [
      ...(offsetSetting.addedWellIds || []),
      ...(get(offsetSetting, 'bicWellIds') || []),
    ];
    return selectedWellIds;
  }, [offsetSetting]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(!isMobile);
  const [eventKind, setEventKind] = useState(savedEvent);
  const [isNptLoading, nptData, nptTypeFilter, onChangeTypeFilter] = useFetchNptData(
    get(well, 'asset_id'),
    savedNptTypeFilter
  );
  const [
    isLessonsLoading,
    lessonsData,
    depthFilter,
    onChangeDepthFilter,
    opFilter,
    onChangeOpFilter,
    lessonsFilter,
    onChangeLessonsFilter,
  ] = useFetchLessonsData(
    get(well, 'asset_id'),
    savedLessonsFilter,
    savedOpFilter,
    savedDepthFilter
  );
  const [dateFilter, setDateFilter] = useState(savedDateFilter);
  const [tableSettings, setTableSettings] = useState(savedTableSettings);
  const [chartExpanded, setChartExpanded] = useState(savedChartExpanded);
  const [showTutorial, setShowTutorial] = useState(!savedIsTutorialShown);
  const [showWellFullName, setShowWellFullName] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState({
    stepOutFilter: savedStepOutFilter,
    sortInfo: savedSortInfo,
  });
  const { stepOutFilter, sortInfo } = loadingSettings;

  // NOTE: Fetch all the data for filtering
  const initialData = useFetchInitialData(companyId, offsetWellIds);
  const filteredWells = useMemo(() => {
    return initialData?.wells;
  }, [initialData]);

  // Save all the settings
  useSaveSettings(
    eventKind,
    nptTypeFilter,
    lessonsFilter,
    opFilter,
    depthFilter,
    stepOutFilter,
    dateFilter,
    sortInfo,
    tableSettings,
    chartExpanded,
    onSettingsChange
  );

  const handleToggleDrawer = useCallback(() => {
    setIsDrawerOpen(prev => !prev);
  }, []);

  const handleClearFilters = useCallback(() => {
    setLoadingSettings(prev => {
      return {
        ...prev,
        stepOutFilter: DEFAULT_SETTINGS.savedStepoutFilter,
      };
    });
  }, []);

  const handleChangeChartExpanded = useCallback(() => {
    setChartExpanded(prev => !prev);
  }, []);

  const handleSkipTutorial = useCallback(() => {
    setShowTutorial(false);
    onSettingsChange({ savedIsTutorialShown: true });
  }, [onSettingsChange]);

  const handleShowTutorial = useCallback(() => {
    setShowTutorial(true);
  }, []);

  const handleChangeShowWellFullName = useCallback(() => {
    setShowWellFullName(prev => !prev);
  }, []);

  const hasNoOffsetWell = offsetWellIds.length < 1;
  const hasDataError = !!(initialData && initialData.error);
  const isDrawerDisabled = hasNoOffsetWell || hasDataError;

  const isLoading = !initialData || !filteredWells || !isNptLoading || !isLessonsLoading;

  return (
    <div className={classes.exploreView}>
      <Drawer
        isDisabled={isDrawerDisabled}
        isOpen={isDrawerOpen}
        isTemporary={isMobile}
        onToggle={handleToggleDrawer}
        onClear={handleClearFilters}
      >
        <Filters
          initialData={initialData}
          eventKind={eventKind}
          nptTypeFilter={nptTypeFilter}
          lessonsFilter={lessonsFilter}
          opFilter={opFilter}
          depthFilter={depthFilter}
          dateFilter={dateFilter}
          tableSettings={tableSettings}
          onChangeEventKind={setEventKind}
          onChangeTableSettings={setTableSettings}
          onChangeTypeFilter={onChangeTypeFilter}
          onChangeLessonsFilter={onChangeLessonsFilter}
          onChangeOpFilter={onChangeOpFilter}
          onChangeDepthFilter={onChangeDepthFilter}
          onChangeDateFilter={setDateFilter}
        />
      </Drawer>
      {!hasNoOffsetWell ? (
        <>
          {!isLoading ? (
            <Content
              isMobile={isMobile}
              isDrawerOpen={isDrawerOpen}
              eventKind={eventKind}
              nptData={nptData}
              lessonsData={lessonsData}
              nptTypeFilter={nptTypeFilter}
              lessonsFilter={lessonsFilter}
              opFilter={opFilter}
              depthFilter={depthFilter}
              dateFilter={dateFilter}
              offsetWells={initialData?.wells}
              tableSettings={tableSettings}
              chartExpanded={chartExpanded}
              sortInfo={sortInfo}
              showWellFullName={showWellFullName}
              onChangeShowWellFullName={handleChangeShowWellFullName}
              onChangeTableSettings={setTableSettings}
              onChangeChartExpanded={handleChangeChartExpanded}
              onShowTutorial={handleShowTutorial}
            />
          ) : (
            <div className={classes.loadingWrapper}>
              <LoadingIndicator />
            </div>
          )}
        </>
      ) : (
        <EmptyView
          title="No Wells Selected"
          description="Select Offset Wells to Analyze BHAs"
          showArrow={!isMobile}
          customStyles={{ arrow: classes.emptyViewArrow }}
        />
      )}
      {showTutorial && initialData && (
        <Tutorial
          isMobile={isMobile}
          videoUrl={initialData.tutorialVideoUrl}
          onSkip={handleSkipTutorial}
        />
      )}
    </div>
  );
}

LearnedApp.propTypes = {
  coordinates: PropTypes.shape({
    w: PropTypes.number.isRequired,
  }).isRequired,
  offsetSetting: PropTypes.shape({
    companyId: PropTypes.number.isRequired,
    addedWellIds: PropTypes.shape([]).isRequired,
    bicWellIds: PropTypes.shape([]).isRequired,
    bicManualWellIds: PropTypes.shape([]).isRequired,
  }).isRequired,
  savedIsTutorialShown: PropTypes.bool,
  savedEvent: PropTypes.number,
  savedNptTypeFilter: PropTypes.shape([]),
  savedLessonsFilter: PropTypes.shape([]),
  savedOpFilter: PropTypes.shape([]),
  savedDepthFilter: PropTypes.shape({}),
  savedDateFilter: PropTypes.shape([]),
  savedStepOutFilter: PropTypes.arrayOf(PropTypes.number),
  savedTableSettings: PropTypes.arrayOf(PropTypes.shape({})),
  savedChartExpanded: PropTypes.bool,
  savedSortInfo: PropTypes.shape({}),
  onSettingsChange: PropTypes.func.isRequired,
};

LearnedApp.defaultProps = {
  savedIsTutorialShown: DEFAULT_SETTINGS.savedIsTutorialShown,
  savedEvent: TABLE_KIND.npt,
  savedNptTypeFilter: [],
  savedLessonsFilter: [],
  savedOpFilter: [],
  savedDepthFilter: {},
  savedDateFilter: [null, null],
  savedStepOutFilter: DEFAULT_SETTINGS.savedStepOutFilter,
  savedTableSettings: DEFAULT_SETTINGS.savedTableSettings,
  savedChartExpanded: DEFAULT_SETTINGS.savedChartExpanded,
  savedSortInfo: DEFAULT_SETTINGS.savedSortInfo,
};

export default memo(LearnedApp);
