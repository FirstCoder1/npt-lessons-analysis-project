import { useMemo } from 'react';
import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import { get, uniq } from 'lodash';

import LegendItem from './LegendItem';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px 10px 5px 10px',
    flexWrap: 'nowrap',
    overflowX: 'auto',
  },
  legendGroup: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    marginRight: '24px',
  },
});

function Legend({ records, typeFilter }) {
  const classes = useStyles();

  const legendData = useMemo(() => {
    const typeData = uniq(records.filter(item => item.type !== 'lessons').map(item => item.type));
    const nptData = typeData.map(type => {
      const title = get(
        typeFilter.find(item => item.color === type),
        'title'
      );
      return { title, color: type };
    });
    const lessonsData = records.find(item => item.type === 'lessons')
      ? [{ title: 'lessons', color: '' }]
      : [];
    const data = lessonsData.concat(nptData);
    return data;
  }, [records, typeFilter]);

  return (
    <div className={classes.container}>
      <div className={classes.legendGroup}>
        {legendData.map(row => (
          <LegendItem iconType={row.title} iconColor={row.color} iconSize={8} text={row.title} />
        ))}
      </div>
    </div>
  );
}

Legend.propTypes = {
  records: PropTypes.shape([]).isRequired,
  typeFilter: PropTypes.shape([]).isRequired,
};

export default Legend;
