import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import { FormControlLabel, Checkbox, Typography, makeStyles } from '@material-ui/core';
import { Clear as ClearIcon, Done as DoneIcon } from '@material-ui/icons';

const useStyles = makeStyles({
  container: {
    marginTop: 20,
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    '&:hover': {
      '& $dragIndicatorIcon': {
        display: 'block',
      },
    },
  },
  dragIndicatorIcon: {
    cursor: 'pointer',
    color: '#DADADA',
    display: 'none',
  },
  tableHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  clearButton: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
      '& $clearIcon': {
        color: '#fff',
      },
      '& $clearText': {
        color: '#fff',
      },
    },
  },
  clearIcon: {
    color: '#999999',
    fontSize: 12,
    marginRight: 5,
  },
  clearText: {
    color: '#999999',
    fontSize: 10,
  },
});

const SortableRow = SortableElement(({ item, onToggle }) => {
  const classes = useStyles();
  return (
    <div className={classes.tableRow}>
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            checked={item.show}
            name={item.label}
            onChange={e => onToggle(item.key, e.target.checked)}
          />
        }
        label={item.label}
        disabled={!item.active}
      />
    </div>
  );
});

SortableRow.propTypes = {
  item: PropTypes.shape({}).isRequired,
  onToggle: PropTypes.func.isRequired,
};

const SortableList = SortableContainer(({ items, onToggleRow }) => {
  return (
    <div>
      {items.map((item, index) => (
        <SortableRow key={item.key} index={index} item={item} onToggle={onToggleRow} />
      ))}
    </div>
  );
});

SortableList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onToggleRow: PropTypes.func.isRequired,
};

function TableSettings({ tableSettings, onChangeTableSettings }) {
  const classes = useStyles();

  const isAllSelected = useMemo(() => {
    let allChecked = true;
    for (let i = 0; i < tableSettings.length; i += 1) {
      if (!tableSettings[i].show && tableSettings[i].active) {
        allChecked = false;
        break;
      }
    }
    return allChecked;
  }, [tableSettings]);

  const handleSort = ({ oldIndex, newIndex }) => {
    onChangeTableSettings(arrayMove(tableSettings, oldIndex, newIndex));
  };

  const handleToggleRow = (key, checked) => {
    onChangeTableSettings(
      tableSettings.map(item => {
        if (item.key === key) {
          return {
            ...item,
            show: checked,
          };
        }
        return item;
      })
    );
  };

  const handleClearAll = () => {
    onChangeTableSettings(tableSettings.map(item => ({ ...item, show: false })));
  };

  const handleSelectAll = () => {
    onChangeTableSettings(
      tableSettings.map(item => (item.active ? { ...item, show: true } : item))
    );
  };

  return (
    <div className={classes.container}>
      <div className={classes.tableHeader}>
        <Typography> Select Table KPIs </Typography>
        {isAllSelected ? (
          <div className={classes.clearButton} onClick={handleClearAll}>
            <ClearIcon className={classes.clearIcon} />
            <Typography variant="body2" className={classes.clearText}>
              Clear All
            </Typography>
          </div>
        ) : (
          <div className={classes.clearButton} onClick={handleSelectAll}>
            <DoneIcon className={classes.clearIcon} />
            <Typography variant="body2" className={classes.clearText}>
              Select All
            </Typography>
          </div>
        )}
      </div>

      <SortableList
        useDragHandle
        items={tableSettings}
        onSortEnd={handleSort}
        onToggleRow={handleToggleRow}
      />
    </div>
  );
}

TableSettings.propTypes = {
  tableSettings: PropTypes.arrayOf(
    PropTypes.shape({
      show: PropTypes.bool.isRequired,
      active: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onChangeTableSettings: PropTypes.func.isRequired,
};

export default memo(TableSettings);
