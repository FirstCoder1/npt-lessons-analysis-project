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

import { useFetchInitialData, useSaveSettings } from './effects';

import { getFilteredWells, getFilteredBhasStep1, getFilteredBhasStep2 } from './utils/filtering';

import { useMetricsData, useSortedBhaHashValues } from './effects/metricsData';
import { calculateRanges } from './utils/calculations';

import { DEFAULT_SETTINGS } from './constants';

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

function ExploreApp({
  coordinates,
  offsetSetting,
  savedIsTutorialShown,
  savedCoRelationFilters,
  savedRssFilter,
  savedOneRunBhaFilter,
  savedStepOutFilter,
  savedMdFilter,
  savedInclinationFilter,
  savedTableSettings,
  savedChartExpanded,
  savedSortInfo,
  savedPageInfo,
  savedRemovedBhas,
  onSettingsChange,
  handleApplyBha,
}) {
  const classes = useStyles();
  const isMobile = isMobileDetected || isNativeDetected || coordinates.w <= 3;
  const { companyId } = offsetSetting;

  const offsetWellIds = useMemo(() => {
    const selectedWellIds = [
      ...(offsetSetting.selectedWellIds || []),
      ...(get(offsetSetting, 'bicWellIds') || []),
      ...(get(offsetSetting, 'bicManualWellIds') || []),
    ];
    return selectedWellIds;
  }, [offsetSetting]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(!isMobile);
  const [eventKind, handleChangeEventKind] = useState('npt');
  const [tableSettings, setTableSettings] = useState(DEFAULT_SETTINGS.savedTableSettings); // song
  const [chartExpanded, setChartExpanded] = useState(savedChartExpanded);
  const [showTutorial, setShowTutorial] = useState(!savedIsTutorialShown);
  const [showWellFullName, setShowWellFullName] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState({
    coRelationFilters: savedCoRelationFilters,
    rssFilter: savedRssFilter,
    oneRunBhaFilter: savedOneRunBhaFilter,
    mdFilter: savedMdFilter,
    stepOutFilter: savedStepOutFilter,
    inclinationFilter: savedInclinationFilter,
    sortInfo: savedSortInfo,
    pageInfo: savedPageInfo,
    removedBhas: savedRemovedBhas,
  });

  const {
    coRelationFilters,
    rssFilter,
    oneRunBhaFilter,
    mdFilter,
    stepOutFilter,
    inclinationFilter,
    sortInfo,
    pageInfo,
    removedBhas,
  } = loadingSettings;

  // NOTE: Fetch all the data for filtering
  const initialData = useFetchInitialData(companyId, offsetWellIds);

  const filteredWells = useMemo(() => {
    return getFilteredWells(initialData, coRelationFilters);
  }, [initialData, coRelationFilters]);

  const filteredBhasStep1 = useMemo(() => {
    return getFilteredBhasStep1(filteredWells, rssFilter, oneRunBhaFilter);
  }, [filteredWells, rssFilter, oneRunBhaFilter]);

  const {
    md_range: mdRange,
    inclination_range: inclinationRange,
    stepout_range: stepOutRange,
  } = useMemo(() => {
    return calculateRanges(filteredBhasStep1);
  }, [filteredBhasStep1]);

  const adjustedMdFilter = useMemo(() => {
    if (!mdFilter || !mdRange) {
      return mdRange;
    } else if (mdFilter[0] >= mdRange[0] && mdFilter[1] <= mdRange[1]) {
      return mdFilter;
    }

    return mdRange;
  }, [mdRange, mdFilter]);

  const adjustedInclinationFilter = useMemo(() => {
    if (!inclinationFilter || !inclinationRange) {
      return inclinationRange;
    } else if (
      inclinationFilter[0] >= inclinationRange[0] &&
      inclinationFilter[1] <= inclinationRange[1]
    ) {
      return inclinationFilter;
    }

    return inclinationRange;
  }, [inclinationRange, inclinationFilter]);

  const adjustedStepOutFilter = useMemo(() => {
    if (!stepOutFilter || !stepOutRange) {
      return stepOutRange;
    } else if (stepOutFilter[0] >= stepOutRange[0] && stepOutFilter[1] <= stepOutRange[1]) {
      return stepOutFilter;
    }

    return stepOutRange;
  }, [stepOutRange, stepOutFilter]);

  const filteredBhasStep2 = useMemo(() => {
    return getFilteredBhasStep2(
      filteredBhasStep1,
      adjustedMdFilter,
      adjustedInclinationFilter,
      adjustedStepOutFilter
    );
  }, [filteredBhasStep1, adjustedMdFilter, adjustedInclinationFilter, adjustedStepOutFilter]);

  const filteredBhasStep3 = useMemo(() => {
    if (!filteredBhasStep2) {
      return null;
    }

    return filteredBhasStep2.filter(bha => {
      const bhaKey = `${bha.asset_id}-${bha.bha_id}`;
      return !removedBhas[bhaKey];
    });
  }, [filteredBhasStep2, removedBhas]);

  useEffect(() => {
    setLoadingSettings(prev => ({
      ...prev,
      pageInfo: savedPageInfo,
    }));
  }, [filteredBhasStep2]);

  const bhaHashValuesToFetch = useSortedBhaHashValues(
    companyId,
    filteredBhasStep3,
    sortInfo,
    pageInfo
  );

  // NOTE: Fetch metrics data
  const metricsData = useMetricsData(companyId, bhaHashValuesToFetch, initialData);

  // Save all the settings
  useSaveSettings(
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
  );

  // Update table settings
  useEffect(() => {
    let newSetting = [];
    if (eventKind === 'all') {
      newSetting = tableSettings.map(item => ({ ...item, active: true }));
    } else if (eventKind === 'npt' || eventKind === 'lessons') {
      newSetting = tableSettings.map(item =>
        item.kind === eventKind || item.kind === 'all'
          ? { ...item, active: true }
          : { ...item, show: false, active: false }
      );
    } else {
      newSetting = tableSettings.map(item =>
        item.kind !== 'all' ? { ...item, show: false, active: false } : item
      );
    }
    setTableSettings(newSetting);
  }, [eventKind]);

  const handleToggleDrawer = useCallback(() => {
    setIsDrawerOpen(prev => !prev);
  }, []);

  const handleClearFilters = useCallback(() => {
    setLoadingSettings(prev => {
      return {
        ...prev,
        removedBhas: DEFAULT_SETTINGS.savedRemovedBhas,
        coRelationFilters: DEFAULT_SETTINGS.savedCoRelationFilters,
        rssFilter: DEFAULT_SETTINGS.savedRssFilter,
        oneRunBhaFilter: DEFAULT_SETTINGS.savedOneRunBhaFilter,
        mdFilter: DEFAULT_SETTINGS.savedMdFilter,
        stepOutFilter: DEFAULT_SETTINGS.savedStepoutFilter,
        inclinationFilter: DEFAULT_SETTINGS.savedInclinationFilter,
      };
    });
  }, []);

  const handleChangeCoRelationFilters = useCallback((key, newFilters) => {
    setLoadingSettings(prev => {
      return {
        ...prev,
        coRelationFilters: {
          ...prev.coRelationFilters,
          [key]: newFilters,
        },
      };
    });
  }, []);

  const handleChangeRssFilter = useCallback(newFilter => {
    setLoadingSettings(prev => {
      return {
        ...prev,
        rssFilter: newFilter,
      };
    });
  }, []);

  const handleChangeOneRunBhaFilter = useCallback(
    debounce(newFilter => {
      setLoadingSettings(prev => {
        return {
          ...prev,
          oneRunBhaFilter: newFilter,
        };
      });
    }, 1000),
    []
  );

  const handleChangeStepOutFilter = useCallback(
    debounce(newFilter => {
      setLoadingSettings(prev => {
        return {
          ...prev,
          stepOutFilter: newFilter,
        };
      });
    }, 1000),
    []
  );

  const handleChangeMdFilter = useCallback(
    debounce(newFilter => {
      setLoadingSettings(prev => {
        return {
          ...prev,
          mdFilter: newFilter,
        };
      });
    }, 1000),
    []
  );

  const handleChangeInclinationFilter = useCallback(
    debounce(newFilter => {
      setLoadingSettings(prev => {
        return {
          ...prev,
          inclinationFilter: newFilter,
        };
      });
    }, 1000),
    []
  );

  const handleChangeTableSettings = useCallback(newSettings => {
    setTableSettings(newSettings);
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

  const handleChangeSortInfo = useCallback(newSortInfo => {
    setLoadingSettings(prev => {
      return {
        ...prev,
        sortInfo: newSortInfo,
      };
    });
  }, []);

  const handleChangeShowWellFullName = useCallback(() => {
    setShowWellFullName(prev => !prev);
  }, []);

  const handleRemoveBHA = useCallback((wellId, bhaId) => {
    const bhaKey = `${wellId}-${bhaId}`;

    setLoadingSettings(prev => {
      return {
        ...prev,
        removedBhas: {
          ...prev.removedBhas,
          [bhaKey]: true,
        },
      };
    });

    // showSuccessNotificationMsg('BHA has been deleted successfully.');
  }, []);
  const hasNoOffsetWell = offsetWellIds.length < 1;
  const hasDataError = !!(initialData && initialData.error);
  const isDrawerDisabled = hasNoOffsetWell || hasDataError;

  const isLoading =
    !initialData ||
    !filteredWells ||
    !filteredBhasStep1 ||
    !filteredBhasStep2 ||
    !filteredBhasStep3 ||
    !metricsData;

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
          coRelationFilters={coRelationFilters}
          rssFilter={rssFilter}
          stepOutFilter={adjustedStepOutFilter}
          stepOutRange={stepOutRange}
          mdFilter={adjustedMdFilter}
          mdRange={mdRange}
          inclinationFilter={adjustedInclinationFilter}
          inclinationRange={inclinationRange}
          handleChangeEventKind={handleChangeEventKind}
          oneRunBhaFilter={oneRunBhaFilter}
          onChangeCoRelationFilters={handleChangeCoRelationFilters}
          onChangeRssFilter={handleChangeRssFilter}
          onChangeStepOutFilter={handleChangeStepOutFilter}
          onChangeMdFilter={handleChangeMdFilter}
          onChangeInclinationFilter={handleChangeInclinationFilter}
          onChangeOneRunBhaFilter={handleChangeOneRunBhaFilter}
        />
      </Drawer>
      {!hasNoOffsetWell ? (
        <>
          {!isLoading ? (
            <Content
              isMobile={isMobile}
              isDrawerOpen={isDrawerOpen}
              data={metricsData}
              initialData={initialData}
              tableSettings={tableSettings}
              chartExpanded={chartExpanded}
              sortInfo={sortInfo}
              showWellFullName={showWellFullName}
              removedBhas={removedBhas}
              onRemoveBHA={handleRemoveBHA}
              onChangeShowWellFullName={handleChangeShowWellFullName}
              onChangeTableSettings={handleChangeTableSettings}
              onChangeChartExpanded={handleChangeChartExpanded}
              onChangeSortInfo={handleChangeSortInfo}
              onShowTutorial={handleShowTutorial}
              handleApplyBha={handleApplyBha}
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

ExploreApp.propTypes = {
  coordinates: PropTypes.shape({
    w: PropTypes.number.isRequired,
  }).isRequired,
  offsetSetting: PropTypes.shape({
    companyId: PropTypes.number.isRequired,
    selectedWellIds: PropTypes.shape([]).isRequired,
    bicWellIds: PropTypes.shape([]).isRequired,
    bicManualWellIds: PropTypes.shape([]).isRequired,
  }).isRequired,
  savedIsTutorialShown: PropTypes.bool,
  savedCoRelationFilters: PropTypes.shape({}),
  savedRssFilter: PropTypes.string,
  savedStepOutFilter: PropTypes.arrayOf(PropTypes.number),
  savedMdFilter: PropTypes.arrayOf(PropTypes.number),
  savedInclinationFilter: PropTypes.arrayOf(PropTypes.number),
  savedOneRunBhaFilter: PropTypes.shape({}),
  savedTableSettings: PropTypes.arrayOf(PropTypes.shape({})),
  savedRemovedBhas: PropTypes.shape({}),
  savedChartExpanded: PropTypes.bool,
  savedSortInfo: PropTypes.shape({}),
  savedPageInfo: PropTypes.shape({}),
  onSettingsChange: PropTypes.func.isRequired,
  handleApplyBha: PropTypes.func.isRequired,
};

ExploreApp.defaultProps = {
  savedIsTutorialShown: DEFAULT_SETTINGS.savedIsTutorialShown,
  savedCoRelationFilters: DEFAULT_SETTINGS.savedCoRelationFilters,
  savedRssFilter: DEFAULT_SETTINGS.savedRssFilter,
  savedStepOutFilter: DEFAULT_SETTINGS.savedStepOutFilter,
  savedMdFilter: DEFAULT_SETTINGS.savedMdFilter,
  savedInclinationFilter: DEFAULT_SETTINGS.savedInclinationFilter,
  savedOneRunBhaFilter: DEFAULT_SETTINGS.savedOneRunBhaFilter,
  savedTableSettings: DEFAULT_SETTINGS.savedTableSettings,
  savedChartExpanded: DEFAULT_SETTINGS.savedChartExpanded,
  savedSortInfo: DEFAULT_SETTINGS.savedSortInfo,
  savedPageInfo: DEFAULT_SETTINGS.savedPageInfo,
  savedRemovedBhas: DEFAULT_SETTINGS.savedRemovedBhas,
};

export default memo(ExploreApp);
