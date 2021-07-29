import { useState } from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import { Typography, makeStyles } from '@material-ui/core';

import PlayIcon from './icons/PlayIcon';
// import ScreenSaver from './screensaver.png';

const useStyles = makeStyles({
  container: {
    width: '100%',
    position: 'relative',
    paddingTop: '56.25%',
  },
  player: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  backdrop: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    // backgroundImage: `url('${ScreenSaver}')`,
    // backgroundRepeat: 'no-repeat',
    // backgroundSize: 'cover',
    // zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
      '& svg': {
        fill: '#03BCD4',
      },
      '& $playButtonText': {
        color: '#03BCD4',
      },
    },
  },
  playButtonText: {
    fontSize: '16px',
    marginTop: '12px',
  },
});

function Video({ url }) {
  const classes = useStyles();
  const [playing, setPlaying] = useState(false);

  const handlePlayPause = () => {
    setPlaying(prev => !prev);
  };

  return (
    <div className={classes.container}>
      {!playing && (
        <div className={classes.backdrop}>
          <div className={classes.playButton} onClick={handlePlayPause}>
            <PlayIcon />
            <Typography className={classes.playButtonText}> Watch Tutorial </Typography>
          </div>
        </div>
      )}
      <ReactPlayer
        className={classes.player}
        url={url}
        playing={playing}
        controls
        width="100%"
        height="100%"
      />
    </div>
  );
}

Video.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Video;
