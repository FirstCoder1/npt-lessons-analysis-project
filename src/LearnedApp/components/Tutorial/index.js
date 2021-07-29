import { memo } from 'react';
import PropTypes from 'prop-types';
import { Typography, Button, makeStyles } from '@material-ui/core';

import Video from './Video';
import Feature from './Feature';

import { features } from './constants';

const useStyles = makeStyles({
  backdrop: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    background: 'rgba(32, 32, 32, 0.8)',
  },
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: ({ isMobile }) => (isMobile ? '100%' : '620px'),
    bottom: 0,
    zIndex: 1000,
    background: '#414141',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '40px',
  },
  header: {
    padding: ({ isMobile }) => (isMobile ? '0px 32px' : '0px 40px'),
  },
  title: {
    fontSize: '20px',
  },
  subtitle: {
    fontSize: '12px',
    color: '#bdbdbd',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: ({ isMobile }) => (isMobile ? '0px 32px' : '0px 40px'),
    marginTop: '16px',
    marginBottom: '16px',
  },
  footer: {
    height: '60px',
    background: '#414141',
    boxShadow: '0px -2px 8px rgba(0, 0, 0, 0.2)',
    padding: ({ isMobile }) => (isMobile ? '0px 32px' : '0px 40px'),
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  videoWrapper: {
    width: '100%',
  },
  featuresWrapper: {
    marginTop: '32px',
  },
  featuresLabel: {
    fontSize: '16px',
  },
});

const TutorialDialog = ({ isMobile, videoUrl, onSkip }) => {
  const classes = useStyles({
    isMobile,
  });

  return (
    <>
      <div className={classes.backdrop} />
      <div className={classes.container}>
        <div className={classes.header}>
          <Typography className={classes.title}>Hints on using NPT and Lessons Learned Analysis</Typography>
          <Typography className={classes.subtitle}>This is where the magic happens</Typography>
        </div>
        <div className={classes.content}>
          <div className={classes.videoWrapper}>
            <Video url={videoUrl} />
          </div>
          <div className={classes.featuresWrapper}>
            <div className={classes.featuresLabel}>With the new Functionality you can:</div>
            <div className={classes.features}>
              {features.map(feature => (
                <Feature key={feature.title} info={feature} />
              ))}
            </div>
          </div>
        </div>
        <div className={classes.footer}>
          <Button color="primary" variant="contained" onClick={onSkip}>
            Skip
          </Button>
        </div>
      </div>
    </>
  );
};

TutorialDialog.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  videoUrl: PropTypes.string.isRequired,
  onSkip: PropTypes.func.isRequired,
};

export default memo(TutorialDialog);
