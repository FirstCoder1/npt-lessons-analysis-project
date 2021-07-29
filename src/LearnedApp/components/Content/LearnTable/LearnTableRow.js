import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { get, debounce } from 'lodash';
import {
  TableCell,
  TableRow,
  Typography,
  Tooltip,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
} from '@material-ui/core';

import { MoreVert as MoreVertIcon } from '@material-ui/icons';

import { getSymbolOfMotorSize } from '../../../utils/unitConversion';
import { HIGHLIGHTING_METRICS, LOW_VALUE_GOOD_METRICS } from '../../../constants';

const useStyles = makeStyles({
  tableRow: {
    '&:hover': {
      background: '#2c2c2c',
    },
  },
  bodyCell: {
    padding: '8px 0 8px 10px',
    background: '#201f1f',
  },
  tickCellValue: {
    fontSize: 13,
    position: 'sticky',
  },
  bodyCellValue: {
    fontSize: 13,
  },
  actionButton: {
    padding: '8px',
  },
  actionIcon: {
    fontSize: '16px',
    color: '#ccc',
  },
});

function getFontStyle(minMaxDict, rowData, dataKey) {
  const fontStyle = {};
  if (
    HIGHLIGHTING_METRICS.includes(dataKey) &&
    minMaxDict &&
    minMaxDict[dataKey] &&
    minMaxDict[dataKey].min !== minMaxDict[dataKey].max
  ) {
    if (get(rowData, dataKey) === minMaxDict[dataKey].min) {
      fontStyle.color = LOW_VALUE_GOOD_METRICS.includes(dataKey) ? '#3c3' : '#f30';
    } else if (get(rowData, dataKey) === minMaxDict[dataKey].max) {
      fontStyle.color = LOW_VALUE_GOOD_METRICS.includes(dataKey) ? '#f30' : '#3c3';
    }
  }
  return fontStyle;
}

function formatNumber(value, precision) {
  return Number.isFinite(parseFloat(value)) ? parseFloat(value).toFixed(precision) : '-';
}

function formatMotorConfig(motorData, isForCSV = false) {
  if (!motorData) {
    return '-';
  }

  const motorDiameter = formatNumber(get(motorData, 'outer_diameter'), 1);
  const motorStages = formatNumber(get(motorData, 'stages'), 1);
  const motorRotorlobe = formatNumber(get(motorData, 'number_rotor_lobes'), 1);
  const motorStatorlobe = formatNumber(get(motorData, 'number_stator_lobes'), 1);
  const motorRPG = formatNumber(get(motorData, 'rpg'), 2);
  const motorBend = formatNumber(get(motorData, 'bend_range'), 2);
  const motorMfr = get(motorData, 'make', '-');

  if (isForCSV) {
    return [
      `${motorDiameter}${getSymbolOfMotorSize()}`,
      motorMfr,
      `${motorRotorlobe}/${motorStatorlobe}`,
      motorStages,
      `${motorRPG}RPG`,
      motorBend,
    ].join(' ');
  }

  return (
    <span>
      {motorDiameter}
      <small>{getSymbolOfMotorSize()}</small>&nbsp;
      {motorMfr}&nbsp;
      <br />
      {motorRotorlobe}/{motorStatorlobe}&nbsp;
      {motorStages}&nbsp;
      {motorRPG}&nbsp;RPG&nbsp;
      {motorBend}
      <small>&ordm;</small>&nbsp;
    </span>
  );
}

function formatCell(rowData, dataKey) {
  let result;
  switch (dataKey) {
    case 'start_depth':
    case 'hole_depth':
    case 'hole_depth_change':
    case 'drilled_feet_rotary':
    case 'drilled_feet_slide':
    case 'rop_rotary_percentiles.median':
    case 'rop_slide_percentiles.median':
    case 'on_bottom_percentage':
    case 'drilled_feet_slide_percentage':
    case 'cost_per_ft':
    case 'mse_percentiles.median':
    case 'bit_rpm_percentiles.median':
    case 'rpm_percentiles.median':
    case 'flow_in_percentiles.median':
    case 'diff_pressure_percentiles.median':
    case 'wob_percentiles.median':
      result = formatNumber(get(rowData, dataKey), 0);
      break;
    case 'hole_size':
    case 'motorData.outer_diameter':
      result = formatNumber(get(rowData, dataKey), 3);
      break;
    case 'gross_time':
    case 'bitTFA':
    case 'motorData.bend_range':
    case 'motorData.bit_to_bend':
    case 'motorData.rpg':
    case 'build_rate':
    case 'turn_rate':
    case 'on_bottom_time':
    case 'hwdpLength':
    case 'min_inclination':
    case 'max_inclination':
    case 'min_vertical_section':
    case 'max_vertical_section':
    case 'rop_rotary':
    case 'rop_slide':
    case 'step_out':
    case 'rop':
      result = formatNumber(get(rowData, dataKey), 2);
      break;
    case 'max_dls':
      result = formatNumber(get(rowData, dataKey), 2);
      break;
    case 'motorConfig':
      result = formatMotorConfig(rowData.motorData);
      break;
    default:
      result = get(rowData, dataKey) || '-';
  }
  return result;
}

function formatWellName(wellName, showWellFullName) {
  if (showWellFullName) {
    return wellName;
  }
  return wellName.length > 20 ? `${wellName.slice(0, 20)}...` : wellName;
}

function formatWellNameTooltip(wellName, showWellFullName) {
  if (showWellFullName) {
    return '';
  }
  return wellName.length > 20 ? wellName : '';
}

const debouncedMouseEvent = debounce((data, cb) => cb(data), 500);

function LearnTableRow({
  showWellFullName,
  rowData,
  rowSettings,
  minMaxDict,
  isActive,
  onMouseEvent,
  onRemove,
  getCellStyles,
}) {
  const classes = useStyles();
  const rowStyle = isActive ? { background: '#2c2c2c' } : null;
  const [actionAnchorEl, setActionAnchorEl] = useState(null);

  const handleMouseEnter = () => {
    const data = {
      wellId: rowData.wellId,
      bhaId: rowData.bhaId,
      eventFrom: 'table',
    };
    debouncedMouseEvent(data, onMouseEvent);
  };

  const handleMouseLeave = () => {
    debouncedMouseEvent({}, onMouseEvent);
  };

  const handleOpenActionMenu = e => {
    setActionAnchorEl(e.currentTarget);
  };

  const handleCloseActionMenu = () => {
    setActionAnchorEl(null);
  };

  const handleRemove = () => {
    onRemove(rowData.wellId, rowData.bhaId);
    setActionAnchorEl(null);
  };
  return (
    <TableRow
      id={`${rowData.wellId}-${rowData.bhaId}`}
      tabIndex={0}
      className={classes.tableRow}
      style={rowStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {rowSettings.map(columnSettings => (
        <TableCell
          key={columnSettings.key}
          className={classes.bodyCell}
          style={getCellStyles(columnSettings.key)}
        >
          {columnSettings.key === 'wellName' ? (
            <Tooltip title={formatWellNameTooltip(rowData.wellName, showWellFullName)}>
              <Typography
                className={classes.tickCellValue}
                component="a"
                style={{ whiteSpace: 'nowrap', color: '#fff' }}
                href={`/assets/${rowData.wellId}`}
              >
                {formatWellName(rowData.wellName, showWellFullName)}
              </Typography>
            </Tooltip>
          ) : (
            <Typography
              className={
                columnSettings.key === 'type' ? classes.tickCellValue : classes.bodyCellValue
              }
              style={getFontStyle(minMaxDict, rowData, columnSettings.key)}
            >
              {formatCell(rowData, columnSettings.key)}
            </Typography>
          )}
        </TableCell>
      ))}

      <TableCell className={classes.bodyCell}>
        <Tooltip title="More">
          <IconButton
            data-not-migrated-MuiIconButton
            className={classes.actionButton}
            aria-haspopup="true"
            onClick={handleOpenActionMenu}
          >
            <MoreVertIcon className={classes.actionIcon} />
          </IconButton>
        </Tooltip>
      </TableCell>

      <Menu
        anchorEl={actionAnchorEl}
        keepMounted
        open={Boolean(actionAnchorEl)}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={handleCloseActionMenu}
      >
        {/* <MenuItem onClick={handleApplyOffsetWellBha}>Apply for Current BHA</MenuItem>
        <MenuItem onClick={handleSelectComponent}>Select Specific Component</MenuItem> */}
        <MenuItem onClick={handleRemove}>Delete</MenuItem>
      </Menu>
    </TableRow>
  );
}

LearnTableRow.propTypes = {
  showWellFullName: PropTypes.bool.isRequired,
  rowData: PropTypes.shape({
    wellId: PropTypes.number.isRequired,
    drillstring: PropTypes.shape({}).isRequired,
    wellName: PropTypes.string.isRequired,
    bhaId: PropTypes.number.isRequired,
    schematic: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }).isRequired,
  rowSettings: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  minMaxDict: PropTypes.shape({}).isRequired,
  isActive: PropTypes.bool.isRequired,
  onMouseEvent: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  getCellStyles: PropTypes.func.isRequired,
};

export default LearnTableRow;
