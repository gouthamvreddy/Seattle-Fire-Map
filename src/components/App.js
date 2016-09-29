import React, {PropTypes} from 'react';
import styles from './App.css';
import GMap from './Map';

class App extends React.Component {
  render() {
    return (
      <main>
       <GMap initialCenter={initialCenter} />
      </main>
    );
  }
}

let initialCenter = {lng: -122.303345, lat: 47.610366};

export default App;
