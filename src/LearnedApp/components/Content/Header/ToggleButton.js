import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Tabs, Tab, withStyles } from '@material-ui/core';

const StyledTabs = withStyles({
  root: {
    height: 42,
    minHeight: 42,
  },
  scroller: {
    borderRadius: 22,
    overflow: 'hidden',
    flex: 'initial',
    width: 'auto',
  },
  indicator: {
    height: '100%',
    zIndex: 0,
  },
})(Tabs);

const StyledTab = withStyles({
  root: {
    minWidth: 50,
    fontWeight: 500,
    fontSize: 16,
    textTransform: 'none',
    minHeight: 30,
    height: 42,
    background: '#333333',
    paddingTop: 0,
    paddingBottom: 0,
  },
  selected: {
    color: '#fff',
    zIndex: 1,
    background: 'none',
  },
})(Tab);

const ToggleButton = ({ tabs, index, onChange, classes }) => {
  const handleChange = (event, newIndex) => {
    onChange(tabs[newIndex], newIndex);
  };

  return (
    <StyledTabs
      value={index}
      onChange={handleChange}
      indicatorColor="primary"
      classes={{
        indicator: classes.indicator,
      }}
      className={classNames(classes.tabs, [classes.small])}
    >
      {tabs.map(({ label, key, disabled }) => (
        <StyledTab
          label={label}
          key={key || label}
          disabled={disabled}
          className={classNames(classes.tab, [classes.smallTab])}
        />
      ))}
    </StyledTabs>
  );
};

ToggleButton.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.object.isRequired })).isRequired,
  onChange: PropTypes.func.isRequired,
  classes: PropTypes.object,
  index: PropTypes.number,
};

ToggleButton.defaultProps = {
  index: 0,
  classes: {},
};

export default withStyles({
  small: {
    height: 30,
    minHeight: 30,
  },
  smallTab: {
    height: 30,
    fontWeight: 500,
    fontSize: 14,
  },
})(ToggleButton);
