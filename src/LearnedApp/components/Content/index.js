import { memo, useState, useMemo, useCallback } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { makeStyles, TableContainer } from '@material-ui/core';

import Header from './Header';
import Settings from './Settings';
import LearnTable from './LearnTable';
import WellsMap from './Map';
import AppFooter from './AppFooter';
import { TABLE_KIND } from '../../constants';

const useStyles = makeStyles({
  contentWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '12px',
    paddingRight: '12px',
    paddingBottom: '35px',
    minWidth: 0,
  },
  noDataWrapper: {
    position: 'relative',
    flexGrow: 100,
    display: 'flex',
    alignItems: 'center',
  },
  headerWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    marginBottom: '8px',
  },
  mapWrapper: ({ isMobile }) => {
    const widthPercent = 100;

    return {
      display: 'flex',
      height: '240px',
      overflowX: 'auto',
      minWidth: isMobile ? '100%' : '200px',
      width: `${widthPercent}%`,
    };
  },
  tableWrapper: {
    flex: 1,
    overflowX: 'auto',
    '&::-webkit-scrollbar-corner': {
      background: 'rgba(0, 0, 0, 0)',
    },
  },
  legendWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap-reverse',
  },
  paginationToolbar: {
    padding: '0px 10px',
  },
});

function Content({
  isMobile,
  isDrawerOpen,
  eventKind,
  nptData,
  lessonsData,
  nptTypeFilter,
  lessonsFilter,
  opFilter,
  depthFilter,
  dateFilter,
  offsetWells,
  tableSettings,
  sortInfo,
  showWellFullName,
  onChangeShowWellFullName,
  onChangeTableSettings,
  onShowTutorial,
}) {
  const [mapExpanded, setMapExpanded] = useState(true);
  const [showChartView, setShowChartView] = useState(true);
  const [activeBha, setActiveBha] = useState({});
  const [isOpenSettingsPopover, setIsOpenSettingsPopover] = useState(false);
  const classes = useStyles({ isMobile });
  const filteredData = useMemo(() => {
    if (eventKind === TABLE_KIND.npt || eventKind === TABLE_KIND.all) {
      // Filtered NPT data
      console.log('nptData=', nptData);
      const data = nptData?.map(row => ({
        wellName: get(
          offsetWells.find(well => well.id === get(row, 'asset_id')),
          'name'
        ),
        rigName: get(
          offsetWells.find(well => well.id === get(row, 'asset_id')),
          'rigName'
        ),
        type: get(
          nptTypeFilter.find(item => item.key === row.data.type),
          'color'
        ),
        description: get(row.data, 'comment'),
        holeSection: get(row.data, 'depth'),
        startTime: get(row.data, 'start_time'),
        endTime: get(row.data, 'end_time'),
      }));
      return data;
    }
    // Filtered Lessons Data
    const data = lessonsData;
    return data;
  }, [nptData, lessonsData, nptTypeFilter, lessonsFilter, opFilter, depthFilter, dateFilter]);

  const handleMouseEvent = useCallback(newActiveBha => {
    setActiveBha(newActiveBha);
  }, []);

  const handleOpenSettingsPopover = useCallback(() => {
    setIsOpenSettingsPopover(true);
  }, []);

  const handleCloseSettingsPopover = useCallback(() => {
    setIsOpenSettingsPopover(false);
  }, []);

  const handleSaveSettings = useCallback(
    settings => {
      onChangeTableSettings(settings.tableSettings);
      setIsOpenSettingsPopover(false);
    },
    [onChangeTableSettings]
  );

  const handleExportCsv = () => {};

  const handleShowTutorial = () => {
    setIsOpenSettingsPopover(false);
    onShowTutorial();
  };

  const handleChartTableView = useCallback(tab => {
    setShowChartView(tab);
  }, []);

  return (
    <div className={classes.contentWrapper}>
      <div className={classes.headerWrapper}>
        <Header
          mapExpanded={mapExpanded}
          showChartView={showChartView}
          onOpenSettingsPopover={handleOpenSettingsPopover}
          onChangeMapExpanded={() => setMapExpanded(!mapExpanded)}
          onChangeChartTableView={handleChartTableView}
        />

        {isOpenSettingsPopover && (
          <Settings
            tableSettings={tableSettings}
            onClose={handleCloseSettingsPopover}
            onSave={handleSaveSettings}
            onExportCsv={handleExportCsv}
            onShowTutorial={handleShowTutorial}
          />
        )}
      </div>
      {mapExpanded && (
        <div className={classes.mapWrapper}>
          <WellsMap wells={offsetWells} offsetWells={offsetWells} activeWellId={null} />
        </div>
      )}
      <TableContainer className={classes.tableWrapper}>
        <LearnTable
          showWellFullName={showWellFullName}
          onChangeShowWellFullName={onChangeShowWellFullName}
          data={filteredData}
          tableSettings={tableSettings}
          activeBha={activeBha}
          sortInfo={sortInfo}
          onMouseEvent={handleMouseEvent}
        />
      </TableContainer>
      <AppFooter isDrawerOpen={isDrawerOpen} />
    </div>
  );
}

Content.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  isDrawerOpen: PropTypes.bool.isRequired,
  showWellFullName: PropTypes.bool.isRequired,
  onChangeShowWellFullName: PropTypes.func.isRequired,
  eventKind: PropTypes.number.isRequired,
  nptData: PropTypes.shape([]).isRequired,
  lessonsData: PropTypes.shape([]).isRequired,
  nptTypeFilter: PropTypes.shape([]).isRequired,
  lessonsFilter: PropTypes.shape([]).isRequired,
  opFilter: PropTypes.shape([]).isRequired,
  depthFilter: PropTypes.shape({}).isRequired,
  dateFilter: PropTypes.shape([]).isRequired,
  offsetWells: PropTypes.shape([]),
  tableSettings: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  sortInfo: PropTypes.shape({}).isRequired,
  pageInfo: PropTypes.shape({
    pageNo: PropTypes.number,
    perPage: PropTypes.number,
  }).isRequired,
  onChangeTableSettings: PropTypes.func.isRequired,
  onShowTutorial: PropTypes.func.isRequired,
};

Content.defaultProps = {
  offsetWells: null,
};

export default memo(Content);
