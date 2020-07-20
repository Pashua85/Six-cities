import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import leaflet from 'leaflet';
import ActionCreator from '../../store/action-creator/action-creator';

class Map extends React.PureComponent {
  constructor(props) {
    super(props);

    this.mapRef = React.createRef();
    this.renderMarkers = this.renderMarkers.bind(this);
    this.markerHoverHandler = this.handleMarkerHover.bind(this);
    this.markerHoverHandler = this.handleMarkerUnhover.bind(this);
  }

  componentDidMount() {

    const {city} = this.props;
    const cityCoords = [city.location.latitude, city.location.longitude];
    const zoom = city.location.zoom;
    this.map = leaflet.map(this.mapRef.current, {
      center: cityCoords,
      zoom,
      zoomControl: false,
      marker: true
    });
    this.map.setView(cityCoords, zoom);
    leaflet
      .tileLayer(`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png`, {
        attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>`
      })
      .addTo(this.map);

    this.activeMarker = leaflet.layerGroup().addTo(this.map);
    this.simpleMarkers = leaflet.layerGroup().addTo(this.map);

    this.renderMarkers();
  }

  renderMarkers() {
    const {places, currentPlace} = this.props;

    const MarkerIcon = leaflet.Icon.extend({
      options: {
        iconSize: [27, 39],
        iconAnchor: [13.5, 39]
      }
    });

    places.forEach((place) => {
      const marker = leaflet
        .marker(place.coords, {icon: new MarkerIcon({iconUrl: `/img/pin.svg`})})
        .addTo(this.simpleMarkers);
      marker.addEventListener(`mouseover`, () => this.handleMarkerHover(place));
      marker.addEventListener(`mouseout`, () => this.handleMarkerUnhover());
    });
    if (currentPlace !== null) {
      const marker = leaflet
        .marker(currentPlace.coords, {icon: new MarkerIcon({iconUrl: `/img/pin-active.svg`})})
        .addTo(this.activeMarker);
      marker.addEventListener(`mouseout`, () => this.handleMarkerUnhover());
    }
  }

  handleMarkerHover(place) {
    this.props.onMarkerHover(place);
  }

  handleMarkerUnhover() {
    this.props.onMarkerUnhover();
  }

  componentDidUpdate(prevProps) {
    this.activeMarker.clearLayers();
    this.simpleMarkers.clearLayers();

    if (this.props.city.name !== prevProps.city.name) {
      const {city} = this.props;
      this.map.setView(new leaflet.LatLng(city.location.latitude, city.location.longitude));
    }

    this.renderMarkers();
  }

  componentWillUnmount() {
    this.simpleMarkers.clearLayers();
    this.activeMarker.clearLayers();
    this.props.onMarkerHover(null);
  }

  render() {
    const {className} = this.props;
    return (
      <section className={`${className} map`} ref={this.mapRef}></section>
    );
  }

}

Map.defaultProps = {
  className: `cities__map`,
  currentPlace: null
};

Map.propTypes = {
  // places: PropTypes.arrayOf(
  //     PropTypes.shape({
  //       id: PropTypes.number.isRequired,
  //       propertyName: PropTypes.string.isRequired,
  //       propertyType: PropTypes.oneOf([`apartment`, `room`, `house`, `hotel`]),
  //       propertyText: PropTypes.arrayOf(PropTypes.string),
  //       price: PropTypes.number.isRequired,
  //       rating: PropTypes.number.isRequired,
  //       isPremium: PropTypes.bool.isRequired,
  //       bedroomsAmount: PropTypes.number.isRequired,
  //       guestMax: PropTypes.number.isRequired,
  //       propertyItems: PropTypes.arrayOf(PropTypes.string),
  //       host: PropTypes.shape({
  //         name: PropTypes.string,
  //         avatar: PropTypes.string,
  //         isSuper: PropTypes.bool
  //       }).isRequired,
  //       titlePhoto: PropTypes.string.isRequired,
  //       photos: PropTypes.arrayOf(PropTypes.string).isRequired,
  //       reviews: PropTypes.arrayOf(
  //           PropTypes.shape({
  //             id: PropTypes.string,
  //             userName: PropTypes.string,
  //             avatar: PropTypes.string,
  //             rating: PropTypes.number,
  //             text: PropTypes.string
  //           })
  //       ),
  //       coords: PropTypes.arrayOf(PropTypes.number).isRequired
  //     })
  // ),
  places: PropTypes.arrayOf(PropTypes.object),
  className: PropTypes.string,
  currentPlace: PropTypes.object,
  onMarkerHover: PropTypes.func,
  onMarkerUnhover: PropTypes.func,
  city: PropTypes.object
};

const mapDispatchToProps = (dispatch) => ({
  onMarkerHover: (place) => {
    dispatch(ActionCreator.setActiveOffer(place));
  },
  onMarkerUnhover: () => {
    dispatch(ActionCreator.setActiveOffer(null));
  }
});

export default connect(null, mapDispatchToProps)(Map);
export {Map};
