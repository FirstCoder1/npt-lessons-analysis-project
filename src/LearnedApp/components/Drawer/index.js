import { memo } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Typography, withTheme, makeStyles } from '@material-ui/core';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  Clear as ClearIcon,
} from '@material-ui/icons';

const useStyles = makeStyles({
  backdrop: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    background: 'rgba(32, 32, 32, 0.8)',
    zIndex: 888,
  },
  placeholder: {
    width: 48,
  },
  drawer: ({ isLightTheme, isOpen, isDisabled, isTemporary }) => {
    const style = {
      width: '252px',
      background: '#272727',
    };

    if (!isOpen) {
      style.width = 48;
      style.cursor = 'pointer';
    }
    if (isLightTheme) {
      style.background = 'none';
    }
    if (isDisabled && !isLightTheme) {
      style.opacity = 0.5;
      style.pointerEvents = 'none';
    }
    if (isTemporary) {
      style.position = 'absolute';
      style.left = 0;
      style.top = 0;
      style.bottom = 0;
      style.zIndex = 888;
    }
    return style;
  },
  header: {
    display: 'flex',
    height: '48px',
    padding: '12px',
    borderBottom: '1px solid #333333',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    height: 'calc(100% - 96px)',
    paddingLeft: '12px',
    paddingRight: '12px',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  footer: {
    height: '48px',
    textAlign: 'right',
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
  filterButton: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  filterIcon: {
    fontSize: 24,
    lineHeight: '24px',
  },
  filterText: {
    marginLeft: 8,
    fontSize: 14,
    lineHeight: '16px',
  },
});

function Drawer({ children, theme, isTemporary, isOpen, isDisabled, onToggle, onClear }) {
  const classes = useStyles({
    isOpen,
    isDisabled,
    isLightTheme: theme.isLightTheme,
    isTemporary,
  });

  const handleClickBar = () => {
    if (!isOpen) {
      onToggle();
    }
  };

  const handleClickButton = e => {
    e.stopPropagation();
    onToggle();
  };

  return (
    <>
      {isTemporary && isOpen && <div className={classes.backdrop} onClick={onToggle} />}
      {isTemporary && <div className={classes.placeholder} />}
      <div className={classes.drawer} onClick={handleClickBar}>
        <div className={classes.header}>
          {isOpen ? (
            <>
              <div className={classes.filterButton}>
                <SortIcon className={classes.filterIcon} />
                <Typography variant="body2" className={classes.filterText}>
                  Filters
                </Typography>
              </div>
              <div className={classes.clearButton} onClick={onClear}>
                <ClearIcon className={classes.clearIcon} />
                <Typography variant="body2" className={classes.clearText}>
                  Clear All
                </Typography>
              </div>
            </>
          ) : (
            <div className={classes.filterButton} onClick={onToggle}>
              <FilterListIcon className={classes.filterIcon} />
            </div>
          )}
        </div>
        <div className={classes.content}>{isOpen ? children : null}</div>
        <div className={classes.footer}>
          <IconButton data-not-migrated-MuiIconButton onClick={handleClickButton}>
            {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
      </div>
    </>
  );
}

Drawer.propTypes = {
  theme: PropTypes.shape({
    isLightTheme: PropTypes.bool.isRequired,
  }).isRequired,
  isTemporary: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onToggle: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};

export default withTheme(memo(Drawer));
