import { func, bool } from 'prop-types';

import ToggleButton from './ToggleButton';

import { Assessment as ChartIcon, ViewList as TableIcon } from '@material-ui/icons';

const TABS = [
  {
    label: <ChartIcon fontSize="small" />,
    key: true,
  },
  {
    label: <TableIcon fontSize="small" />,
    key: false,
  },
];

const ChartTableToggle = ({ onChange, value }) => {
  const handleTabChange = active => {
    onChange(active.key);
  };
  return (
    <ToggleButton
      tabs={TABS}
      onChange={handleTabChange}
      index={TABS.findIndex(item => item.key === value)}
    />
  );
};

ChartTableToggle.propTypes = {
  onChange: func.isRequired,
  value: bool.isRequired,
};

export default ChartTableToggle;
