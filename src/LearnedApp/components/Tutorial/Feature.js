import { memo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  feature: {
    display: 'flex',
    marginTop: 15,
  },
  icon: {
    width: 40,
    height: 40,
  },
  content: {
    marginLeft: 12,
    paddingTop: 10,
  },
  title: {
    fontSize: '14px',
    fontWeight: 700,
  },
  description: {
    fontSize: '14px',
    fontWeight: '400',
    marginTop: '8px',
    lineHeight: '20px',
  },
});
function Feature({ info }) {
  const classes = useStyles();

  const IconComponent = info.icon;
  return (
    <div className={classes.feature}>
      <div className={classes.icon}>
        <IconComponent />
      </div>
      <div className={classes.content}>
        <div className={classes.title}>{info.title}</div>
        <div className={classes.description}>{info.description}</div>
      </div>
    </div>
  );
}

Feature.propTypes = {
  info: PropTypes.shape({
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default memo(Feature);
