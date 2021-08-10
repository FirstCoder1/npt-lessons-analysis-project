import { memo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { makeStyles, Typography } from '@material-ui/core';

export const SUBSCRIPTIONS = [
  {
    provider: 'corva',
    collection: 'wits',
  },
  {
    /* NOTE: Subscription for new summaries */
    provider: 'corva',
    collection: 'data.operation-summaries',
    meta: {
      allowEmpty: true,
    },
    params: {
      limit: 1000,
      behavior: 'accumulate',
    },
  },
  {
    /* NOTE: Subscription for updated summaries */
    provider: 'corva',
    collection: 'data.operation-summaries',
    event: 'update',
    meta: {
      allowEmpty: true,
    },
  },
];

const useStyles = makeStyles({
  footer: {
    bottom: '10px',
    color: '#999',
    fontSize: '0.7rem',
    left: ({ isDrawerOpen }) => (isDrawerOpen ? '264px' : '60px'),
    right: 0,
    paddingLeft: '15px',
    position: 'absolute',
  },
  lastUpdate: {
    color: 'rgb(200, 200, 200)',
    fontSize: 10,
  },
});

function formatTimestamp(timestamp, format) {
  return moment.unix(timestamp).format(format);
}

function AppFooter({ isDrawerOpen }) {
  const classes = useStyles({ isDrawerOpen });
  const timestamp = new Date().getTime() / 1000;
  
  return (
    <div className={classes.footer}>
      {timestamp && (
        <Typography variant="body2" className={classes.lastUpdate}>
          Last update: {formatTimestamp(timestamp, 'MM/DD/YYYY hh:mm a')}
        </Typography>
      )}
    </div>
  );
}

AppFooter.propTypes = {
  isDrawerOpen: PropTypes.bool.isRequired,
};

export default memo(AppFooter);
