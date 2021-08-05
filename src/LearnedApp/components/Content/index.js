import { memo, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, TableContainer } from '@material-ui/core';
import { csvExport } from '@corva/ui/utils';

import Header from './Header';
import Settings from './Settings';
import LearnTable from './LearnTable';
import WellsMap from './Map';
import AppFooter from './AppFooter';

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
  data,
  initialData,
  tableSettings,
  sortInfo,
  showWellFullName,
  removedBhas,
  onChangeShowWellFullName,
  onChangeTableSettings,
  onChangeSortInfo,
  onRemoveBHA,
  onShowTutorial,
  handleApplyBha,
}) {
  const [mapExpanded, setMapExpanded] = useState(true);
  const [showChartView, setShowChartView] = useState(true);
  const [activeBha, setActiveBha] = useState({});
  const [isOpenSettingsPopover, setIsOpenSettingsPopover] = useState(false);
  const classes = useStyles({ isMobile });

  const filteredData = useMemo(() => {
    if (!data) {
      return null;
    }

    return data.filter(bha => {
      const bhaKey = `${bha.wellId}-${bha.bhaId}`;
      return !removedBhas[bhaKey];
    });
  }, [data, removedBhas]);

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

  const handleExportCsv = () => {
    const tableColumns = tableSettings.filter(column => column.show);

    const csvTitles = tableColumns.reduce(
      (result, item) => ({
        ...result,
        [item.key]: `${item.label}`,
      }),
      {}
    );

    const csvData = data.map(item => {
      const newItem = {};

      tableColumns.forEach(column => {
        newItem[column.key] = item[column.key];
      });

      return newItem;
    });

    const content = csvExport.convertJsonToCsv(csvData, csvTitles);
    csvExport.downloadFile('BHA Optimization.csv', content);
  };

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
          <WellsMap
            wells={initialData.wells}
            offsetWells={initialData.wells}
            activeWellId={activeBha.wellId}
          />
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
          onChangeSortInfo={onChangeSortInfo}
          onRemoveBHA={onRemoveBHA}
          onMouseEvent={handleMouseEvent}
          handleApplyBha={handleApplyBha}
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
  data: PropTypes.arrayOf(PropTypes.shape({})),
  initialData: PropTypes.shape({
    wells: PropTypes.shape([]),
  }),
  tableSettings: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  sortInfo: PropTypes.shape({}).isRequired,
  pageInfo: PropTypes.shape({
    pageNo: PropTypes.number,
    perPage: PropTypes.number,
  }).isRequired,
  onChangeTableSettings: PropTypes.func.isRequired,
  onChangeSortInfo: PropTypes.func.isRequired,
  onRemoveBHA: PropTypes.func.isRequired,
  onShowTutorial: PropTypes.func.isRequired,
  removedBhas: PropTypes.shape({}).isRequired,
  handleApplyBha: PropTypes.func.isRequired,
};

Content.defaultProps = {
  initialData: null,
  data: null,
};

export default memo(Content);
