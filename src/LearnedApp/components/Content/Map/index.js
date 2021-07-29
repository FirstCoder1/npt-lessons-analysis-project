import { memo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

import Map from './Map';

const useStyles = makeStyles({
  mapContainer: {
    width: '100%',
    height: '100%',
  },
});

function MapContainer({ subjectWell, wells, offsetWells, radius }) {
  const classes = useStyles();

  return (
    <div className={classes.mapContainer}>
      <Map
        subjectWell={subjectWell}
        wells={wells}
        offsetWells={offsetWells}
        radius={radius}
        coordsDataPath="topHole.coordinates"
      />
    </div>
  );
}

MapContainer.propTypes = {
  subjectWell: PropTypes.shape({}),
  wells: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  offsetWells: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  radius: PropTypes.number,
};

MapContainer.defaultProps = {
  subjectWell: null,
  radius: null,
};

export default memo(MapContainer);
