/** Only required for local environment */
/** Dirty hack because dev center doesn't support environment variable yet */
import L from 'mapbox.js';

if (window.location.hostname.search('corva') === -1) {
  const MAP_BOX_ACCESS_TOKEN =
    'pk.eyJ1IjoiYm9yaXMtcGV0cm92IiwiYSI6ImNqMG5nbXV4ZTAwYW8yd2xkZmJldjQ3b2QifQ.AYJSB4RNRS7kpk0q_Z4kgw';
  L.mapbox.accessToken = MAP_BOX_ACCESS_TOKEN;
}
