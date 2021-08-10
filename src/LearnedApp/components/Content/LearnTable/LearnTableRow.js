import { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
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

import LessonsTypeIcon from './LessonsTypeIcon';
import Description from './Description';
import { HIGHLIGHTING_METRICS, LOW_VALUE_GOOD_METRICS } from '../../../constants';

const useStyles = makeStyles({
  tableRow: {
    '&:hover': {
      background: '#2c2c2c',
    },
  },
  bodyCell: {
    padding: '8px 0 8px 10px',
    background: '#202020',
  },
  tickCellValue: ({ showWellFullName }) => {
    if (showWellFullName) {
      return {
        fontSize: 13,
        position: 'sticky',
        marginRight: '8px',
      };
    } else {
      return {
        fontSize: 13,
        position: 'sticky',
      };
    }
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

function formatType(color) {
  if (color === 'lessons') {
    return (
      <div
        style={{
          background: '#3B3B3B',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <LessonsTypeIcon />
      </div>
    );
  }
  return (
    <div
      style={{
        background: color,
        marginLeft: '6px',
        width: '12px',
        height: '12px',
        borderRadius: '2px',
      }}
    />
  );
}

function formatDescription(row, text, isMore, onClickMore) {
  const handleClickMoreButton = () => {
    onClickMore(row);
  };

  return (
    <div>
      <Description text={text} isMore={isMore} onClickMore={handleClickMoreButton} />
    </div>
  );
}

function formatDateTime(timestamp) {
  return moment.unix(timestamp).format('MM/DD/YYYY HH:mm');
}

function formatCell(rowData, dataKey, isMore, onClickMore) {
  let result;
  switch (dataKey) {
    case 'type':
      result = formatType(get(rowData, dataKey));
      break;
    case 'tvd':
      result = formatNumber(get(rowData, dataKey), 3);
      break;
    case 'startTime':
    case 'endTime':
      result = formatDateTime(get(rowData, dataKey));
      break;
    case 'link':
      result = '-';
      break;
    case 'description':
      result = formatDescription(rowData, get(rowData, dataKey), isMore, onClickMore);
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
  return wellName.length > 26 ? `${wellName.slice(0, 26)}...` : wellName;
}

function formatWellNameTooltip(wellName, showWellFullName) {
  if (showWellFullName) {
    return '';
  }
  return wellName.length > 26 ? wellName : '';
}

const debouncedMouseEvent = debounce((data, cb) => cb(data), 500);

function LearnTableRow({
  showWellFullName,
  rowData,
  rowSettings,
  minMaxDict,
  onMouseEvent,
  onRemove,
  handleClickMoreCell,
  getCellStyles,
}) {
  const classes = useStyles({ showWellFullName });
  const rowStyle = { background: '#2c2c2c' };
  const [actionAnchorEl, setActionAnchorEl] = useState(null);

  const handleMouseEnter = () => {
    // const data = {
    //   wellId: rowData.wellId,
    //   bhaId: rowData.bhaId,
    //   eventFrom: 'table',
    // };
    // debouncedMouseEvent(data, onMouseEvent);
  };

  const handleMouseLeave = () => {
    // debouncedMouseEvent({}, onMouseEvent);
  };

  const handleOpenActionMenu = e => {
    setActionAnchorEl(e.currentTarget);
  };

  const handleCloseActionMenu = () => {
    setActionAnchorEl(null);
  };

  const handleRemove = () => {
    setActionAnchorEl(null);
  };

  return (
    <TableRow
      id={`${rowData.wellId}`}
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
          style={getCellStyles(columnSettings.key, 2)}
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
              className={classes.bodyCellValue}
              style={getFontStyle(minMaxDict, rowData, columnSettings.key)}
            >
              {formatCell(rowData, columnSettings.key, rowData.isMore, handleClickMoreCell)}
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
    wellId: PropTypes.number,
    wellName: PropTypes.string,
    type: PropTypes.string,
    isMore: PropTypes.bool,
  }).isRequired,
  rowSettings: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  minMaxDict: PropTypes.shape({}).isRequired,
  onMouseEvent: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  handleClickMoreCell: PropTypes.func.isRequired,
  getCellStyles: PropTypes.func.isRequired,
};

export default LearnTableRow;
