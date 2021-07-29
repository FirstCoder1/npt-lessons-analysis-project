import { memo } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Tooltip, makeStyles } from '@material-ui/core';
import {
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@material-ui/icons';

import ChartTableToggle from './ChartTableToggle';

const useStyles = makeStyles({
  expandButton: {
    padding: '8px',
  },
  expandIcon: {
    fontSize: '16px',
  },
  buttonsContainer: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: '10px',
  },
  chartSettingsButtonContainer: {
    marginLeft: '8px',
  },
  chartSettingsButton: {
    backgroundColor: '#333333',
    padding: '8px',
  },
  chartSettingsIcon: {
    fontSize: '16px',
  },  
});

function Header({
  mapExpanded,
  showChartView,
  onChangeMapExpanded,
  onOpenSettingsPopover,
  onChangeChartTableView,
}) {
  const classes = useStyles();

  return (
    <>
      <div>
        <Tooltip title={mapExpanded ? 'Collapse Map' : 'Expand Map'}>
          <IconButton
            data-not-migrated-MuiIconButton
            className={classes.expandButton}
            onClick={onChangeMapExpanded}
          >
            {mapExpanded ? (
              <ExpandLessIcon className={classes.expandIcon} />
            ) : (
              <ExpandMoreIcon className={classes.expandIcon} />
            )}
          </IconButton>
        </Tooltip>
        Maps
      </div>
      <div className={classes.buttonsContainer}>
        <ChartTableToggle value={showChartView} onChange={onChangeChartTableView} />
        <div className={classes.chartSettingsButtonContainer}>
          <IconButton
            data-not-migrated-MuiIconButton
            className={classes.chartSettingsButton}
            onClick={onOpenSettingsPopover}
          >
            <SettingsIcon className={classes.chartSettingsIcon} />
          </IconButton>
        </div>
      </div>
    </>
  );
}

Header.propTypes = {
  mapExpanded: PropTypes.bool.isRequired,
  showChartView: PropTypes.bool.isRequired,
  onChangeMapExpanded: PropTypes.func.isRequired,
  onOpenSettingsPopover: PropTypes.func.isRequired,
  onChangeChartTableView: PropTypes.func.isRequired,
};
export default memo(Header);
