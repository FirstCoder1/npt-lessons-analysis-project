import PropTypes from 'prop-types';
import { MenuItem, Select, FormControl, InputLabel, Input, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  formControl: {
    width: '100%',
    marginTop: 12,
  },
});

function SingleSelect({ title, options, currentValue, onChange }) {
  const classes = useStyles();

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id={`c-bho-multi-select-label-${title}`}>
        {title}
      </InputLabel>
      <Select
        labelId={`c-bho-multi-select-label-${title}`}
        id={`c-bho-multi-select-${title}`}
        value={currentValue}
        onChange={onChange}
      >
        {options.map(item => (
          <MenuItem value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

SingleSelect.propTypes = {
  title: PropTypes.string,
  options: PropTypes.shape([]).isRequired,
  currentValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
};

SingleSelect.defaultProps = {
  title: '',
};

export default SingleSelect;
