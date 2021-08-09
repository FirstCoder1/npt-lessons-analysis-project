import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

import LessonsTypeIcon from '../LearnTable/LessonsTypeIcon';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '12px',
  },
  icon: ({ iconColor, iconSize }) => {
    return {
      display: 'block',
      width: `${iconSize}px`,
      height: `${iconSize}px`,
      borderRadius: '1px',
      background: iconColor,
    };
  },
  text: ({ textColor }) => {
    return {
      whiteSpace: 'nowrap',
      fontSize: '11px',
      marginLeft: '8px',
      color: textColor || '#bdbdbd',
    };
  },
});

function LegendItem({ iconType, iconColor, iconSize, textColor, text }) {
  const classes = useStyles({
    iconType,
    iconColor,
    iconSize,
    textColor,
  });

  return (
    <div className={classes.root}>
      {iconType === 'lessons' ? <LessonsTypeIcon /> : <span className={classes.icon} />}
      <span className={classes.text}>{text}</span>
    </div>
  );
}

LegendItem.propTypes = {
  iconType: PropTypes.string.isRequired,
  iconColor: PropTypes.string.isRequired,
  iconSize: PropTypes.number.isRequired,
  textColor: PropTypes.string,
  text: PropTypes.string.isRequired,
};

LegendItem.defaultProps = {
  textColor: '#bdbdbd',
};

export default LegendItem;
