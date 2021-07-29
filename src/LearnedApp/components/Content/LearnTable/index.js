import { memo, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  withTheme,
  makeStyles,
} from '@material-ui/core';

import {
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  KeyboardArrowRight as ArrowRightIcon,
  KeyboardArrowLeft as ArrowLeftIcon,
} from '@material-ui/icons';

import { getUnit } from '../../../utils/unitConversion';
import { HIGHLIGHTING_METRICS } from '../../../constants';
import LearnTableRow from './LearnTableRow';

const PX_PER_RATIO = 50;

const useStyles = makeStyles({
  headerCell: {
    padding: '6px 0 6px 10px',
    background: '#201f1f',
    borderTop: '1px solid #5C5C5C',
    color: '#9e9e9e',
    fontSize: '12px',
    lineHeight: '14px',
  },
  headerCellContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '12px',
    lineHeight: '14px',
  },
  headerCellInnerContent: {
    display: 'flex',
    alignItems: 'center',
  },
  sortIcon: {
    cursor: 'pointer',
    fontSize: '12px',
    '&:hover': {
      color: '#fff',
    },
    marginRight: '10px',
  },
});

function getCellStyles(key) {
  if (key === 'type') {
    return { left: 0, position: 'sticky' };
  } else if (key === 'wellName') {
    return { left: '40px', position: 'sticky', boxShadow: '5px 0px 5px grey' };
  }
  return {};
}

function LearnTable({
  theme,
  data,
  showWellFullName,
  onChangeShowWellFullName,
  tableSettings,
  activeBha,
  sortInfo,
  onMouseEvent,
  onRemoveBHA,
  onChangeSortInfo,
  handleApplyBha,
}) {
  const tableColumns = tableSettings.filter(column => column.show);
  const classes = useStyles({
    isLightTheme: theme.isLightTheme,
  });

  useEffect(() => {
    const { wellId, bhaId, eventFrom } = activeBha;
    if (!Number.isFinite(wellId) || !Number.isFinite(bhaId) || eventFrom === 'table') {
      return;
    }

    const uidToScroll = `${wellId}-${bhaId}`;
    document.getElementById(uidToScroll).focus();
  }, [activeBha]);

  const minMaxDict = useMemo(() => {
    const result = {};
    data.forEach(record => {
      HIGHLIGHTING_METRICS.forEach(key => {
        if (!result[key] && Number.isFinite(get(record, key))) {
          result[key] = {
            min: get(record, key),
            max: get(record, key),
          };
        } else if (Number.isFinite(get(record, key))) {
          result[key] = {
            min: Math.min(result[key].min, get(record, key)),
            max: Math.max(result[key].max, get(record, key)),
          };
        }
      });
    });
    return result;
  }, [data]);

  const handleClickHeaderCell = column => {
    if (!column.sortable) {
      return;
    }

    if (sortInfo.key === column.key) {
      onChangeSortInfo({
        ...sortInfo,
        direction: sortInfo.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      onChangeSortInfo({
        key: column.key,
        direction: 'asc',
      });
    }
  };

  return (
    <>
      <Table aria-label="npt table">
        <TableHead>
          <TableRow>
            {tableColumns.map(columnSettings => (
              <TableCell
                key={columnSettings.key}
                className={classes.headerCell}
                style={getCellStyles(columnSettings.key)}
              >
                <div
                  className={classes.headerCellContent}
                  onClick={() => handleClickHeaderCell(columnSettings)}
                  style={{
                    cursor: columnSettings.sortable ? 'pointer' : 'auto',
                    width: columnSettings.width - 10,
                  }}
                >
                  <span className={classes.headerCellInnerContent}>
                    {columnSettings.label}
                    {columnSettings.unitType ? getUnit(columnSettings.key) : ''}
                    {columnSettings.key === sortInfo.key && (
                      <>
                        {sortInfo.direction === 'asc' ? (
                          <ArrowUpwardIcon className={classes.sortIcon} />
                        ) : (
                          <ArrowDownwardIcon className={classes.sortIcon} />
                        )}
                      </>
                    )}
                  </span>

                  {columnSettings.key === 'wellName' && (
                    <>
                      {!showWellFullName ? (
                        <ArrowRightIcon
                          className={classes.sortIcon}
                          onClick={onChangeShowWellFullName}
                        />
                      ) : (
                        <ArrowLeftIcon
                          className={classes.sortIcon}
                          onClick={onChangeShowWellFullName}
                        />
                      )}
                    </>
                  )}
                </div>
              </TableCell>
            ))}
            <TableCell className={classes.headerCell}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(rowData => (
            <LearnTableRow
              key={`${rowData.wellId}-${rowData.bhaId}`}
              isActive={rowData.wellId === activeBha.wellId && rowData.bhaId === activeBha.bhaId}
              showWellFullName={showWellFullName}
              rowData={rowData}
              rowSettings={tableColumns}
              minMaxDict={minMaxDict}
              onMouseEvent={onMouseEvent}
              onRemove={onRemoveBHA}
              handleApplyBha={handleApplyBha}
              getCellStyles={getCellStyles}
            />
          ))}
        </TableBody>
      </Table>
    </>
  );
}

LearnTable.propTypes = {
  showWellFullName: PropTypes.bool.isRequired,
  onChangeShowWellFullName: PropTypes.func.isRequired,
  theme: PropTypes.shape({
    isLightTheme: PropTypes.bool.isRequired,
  }).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  tableSettings: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  activeBha: PropTypes.shape({
    wellId: PropTypes.number,
    bhaId: PropTypes.number,
    eventFrom: PropTypes.string,
  }).isRequired,
  sortInfo: PropTypes.shape({
    key: PropTypes.string.isRequired,
    direction: PropTypes.string.isRequired,
  }).isRequired,
  onChangeSortInfo: PropTypes.func.isRequired,
  onMouseEvent: PropTypes.func.isRequired,
  onRemoveBHA: PropTypes.func.isRequired,
  handleApplyBha: PropTypes.func.isRequired,
};

export default withTheme(memo(LearnTable));
