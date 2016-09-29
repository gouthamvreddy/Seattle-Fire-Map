import React, {Component} from 'react';
import styles from './Map.css';
export default class GMap extends React.Component {

  constructor(props){
    super(props);
    this.state = {zoom: 10};
  }

  static propTypes() {
  	initialCenter: React.PropTypes.objectOf(React.PropTypes.number).isRequired
  }

	render() {
    return (
      <div className={styles.GMap}>
        <div className={styles.UpdatedText}>
          <p>Current Zoom: { this.state.zoom }</p>
        </div>
        <div className={styles.GMapCanvas} ref="mapCanvas"></div>
      </div>
    );
  }

  componentDidMount() {
    // create the map, marker and infoWindow after the component has
    // been rendered because we need to manipulate the DOM for Google =(
    this.map = this.createMap()
    this.marker = this.createMarker()
    this.infoWindow = this.createInfoWindow()

    $.ajax({
      method: "GET",
      url: "https://data.seattle.gov/resource/grwu-wqtk.json?$limit=10",
      cache: false
    }).then((res) => {
      res.forEach((dataObj)=>{
        this.createMorMarkers(this.getCoordinates(dataObj), this.map);
      });
    });
    // have to define google maps event listeners here too
    // because we can't add listeners on the map until its created
    google.maps.event.addListener(this.map, 'zoom_changed', ()=> this.handleZoomChange())
  }

  // clean up event listeners when component unmounts
  componentDidUnMount() {
    google.maps.event.clearListeners(map, 'zoom_changed')
  }

  createMap() {
    let mapOptions = {
      zoom: this.state.zoom,
      center: this.mapCenter()
    }
    return new google.maps.Map(this.refs.mapCanvas, mapOptions)
  }

  mapCenter() {
    return new google.maps.LatLng(
      this.props.initialCenter.lat,
      this.props.initialCenter.lng
    )
  }

  createMarker() {
    return new google.maps.Marker({
      position: this.mapCenter(),
      map: this.map
    })
	}

  getCoordinates (data) {
    return new google.maps.LatLng(
      data.latitude,
      data.longitude
    )
  }
  
  createMorMarkers(latLng, map) {
    return new google.maps.Marker({
      position: latLng,
      map: map
    })
  }

  createInfoWindow() {
    let contentString = "<div class='InfoWindow'>I'm a Window that contains Info Yay</div>"
    return new google.maps.InfoWindow({
      map: this.map,
      anchor: this.marker,
      content: contentString
    })
  }

  handleZoomChange() {
    this.setState({
      zoom: this.map.getZoom()
    })
  }
}
