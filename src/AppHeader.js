import { memo } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  IconButton,
  Typography,
  Tooltip,
  makeStyles,
} from '@material-ui/core';
import { AddCircle as AddCircleIcon } from '@material-ui/icons';

const useStyles = makeStyles({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: '5px 12px',
  },
  appInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '1.15rem',
  },
  subtitle: {
    color: '#888!important',
    fontSize: '0.755rem',
    fontWeight: 400,
    lineHeight: 1,
  },
  appControls: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  offsetContainer: {
    opacity: 1,
    pointerEvents: 'auto',
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
});

const AppHeader = ({ offsetSetting, onOpenOffsetsDialog }) => {
  const classes = useStyles();

  const offsetsCount =
    (get(offsetSetting, ['selectedWellIds']) || []).length +
    (get(offsetSetting, ['bicWellIds']) || []).length +
    (get(offsetSetting, ['bicManualWellIds']) || []).length;

  return (
    <div className={classes.header}>
      <div className={classes.appInfo}>
        <Typography className={classes.title} noWrap>
          NPT and Lessons Learned Analysis
        </Typography>
        <Typography className={classes.subtitle} noWrap>
          Identify Drilling Hazards and Lessons Learned in your area of operation.
        </Typography>
      </div>

      <div className={classes.appControls}>
        <div className={classes.offsetContainer}>
          <Typography variant="body2">Offset Wells({offsetsCount})</Typography>
          <Tooltip title="Add Offset Wells">
            <IconButton onClick={onOpenOffsetsDialog} color="primary">
              <AddCircleIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

AppHeader.propTypes = {
  offsetSetting: PropTypes.shape({}).isRequired,
  onOpenOffsetsDialog: PropTypes.func.isRequired,
};

export default memo(AppHeader);
