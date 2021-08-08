import PropTypes from 'prop-types';
import { MenuItem, Select, FormControl, InputLabel, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  formControl: {
    width: '100%',
    marginTop: 12,
  },
});

function SingleSelect({ title, options, currentValue, onChange, disabled }) {
  const classes = useStyles();

  return (
    <FormControl className={classes.formControl} disabled={disabled}>
      <InputLabel id={`c-bho-multi-select-label-${title}`}>{title}</InputLabel>
      <Select
        labelId={`c-bho-multi-select-label-${title}`}
        id={`c-bho-multi-select-${title}`}
        value={currentValue}
        onChange={onChange}
      >
        {options.map(item => (
          <MenuItem value={item}>{item}</MenuItem>
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
  disabled: PropTypes.bool,
};

SingleSelect.defaultProps = {
  title: '',
  disabled: false,
};

export default SingleSelect;
