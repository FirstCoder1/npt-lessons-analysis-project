import { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { Typography, Slider, Tooltip, makeStyles } from '@material-ui/core';

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
};

const useStyles = makeStyles({
  root: {
    width: '100%',
    marginTop: 12,
  },
  title: {
    fontSize: 12,
    color: '#BDBDBD',
  },
  sliderContainer: {
    paddingLeft: 5,
    paddingRight: 5,
  },
  slider: {
    marginBottom: 5,
    '& .MuiSlider-markLabel[data-index="0"]': {
      transform: 'translateX(-15%)',
    },
    '& .MuiSlider-markLabel[data-index="1"]': {
      transform: 'translateX(-90%)',
    },
  },
});

function RangeSlider(props) {
  const { tooltipTitle, title, min, max } = props;

  const [value, setValue] = useState(props.value);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const classes = useStyles();
  const marks = [
    {
      value: min,
      label: min,
    },
    {
      value: max,
      label: max,
    },
  ];

  const handleChange = (e, newValue) => {
    setValue(newValue);
    props.onChange(newValue);
  };

  return (
    <div className={classes.root}>
      <Tooltip title={tooltipTitle} placement="top-start">
        <Typography id="c-bho-range-slider" className={classes.title}>
          {title}
        </Typography>
      </Tooltip>
      <div className={classes.sliderContainer}>
        <Slider
          className={classes.slider}
          min={min}
          max={max}
          value={value}
          marks={marks}
          valueLabelDisplay="auto"
          aria-labelledby="c-bho-range-slider"
          ValueLabelComponent={ValueLabelComponent}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

RangeSlider.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.number).isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  tooltipTitle: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

RangeSlider.defaultProps = {
  tooltipTitle: null,
};

export default memo(RangeSlider);
