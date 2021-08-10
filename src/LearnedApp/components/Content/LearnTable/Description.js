import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  text: {
    fontSize: 13,
    wordBreak: 'break-word',
  },
  more: {
    color: '#03BCD4',
    fontSize: 14,
    zIndex: 1000,
    marginLeft: '4px',
    '&:hover': {
      cursor: 'pointer',
      opacity: '40%',
    },
  },
});

const MAX_LENGTH = 112;

function formatText(text) {
  const formatedText = text.length > MAX_LENGTH ? `${text.slice(0, MAX_LENGTH)} ...` : text;
  return formatedText;
}

function Description({ text, isMore, onClickMore }) {
  const classes = useStyles();

  if (text.length > MAX_LENGTH) {
    if (isMore) {
      return (
        <div className={classes.root}>
          <div className={classes.text}>
            {formatText(text)}
            <span className={classes.more} onClick={onClickMore}>
              More
            </span>
          </div>
        </div>
      );
    } else {
      return (
        <div className={classes.root}>
          <div className={classes.text}>
            {text}
            <span className={classes.more} onClick={onClickMore}>
              Less
            </span>
          </div>
        </div>
      );
    }
  } else {
    return (
      <div className={classes.root}>
        <span className={classes.text}>{text}</span>
      </div>
    );
  }
}

Description.propTypes = {
  text: PropTypes.string.isRequired,
  isMore: PropTypes.bool,
  onClickMore: PropTypes.func.isRequired,
};

Description.defaultProps = {
  isMore: true,
};

export default Description;
