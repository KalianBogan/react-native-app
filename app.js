import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TouchableHighlight,
  TouchableNativeFeedback,
  Navigator,
  Dimensions
} from 'react-native';

import styles from './styles';
import Thumbs from './thumbs';

import { connect } from 'react-redux';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      propsImgUrl: '0',
      self: this,
      imgSize: {
        w: 0,
        h: 0
      },
      largeImgDim: {
        w: 0,
        h: 0
      }
    };
  };

  getImgDim() {
    var devDim = {
      w: Dimensions.get('window').width, 
      h: Dimensions.get('window').height
    };
    var imgSize = this.self.state.imgSize;
    var height = imgSize.h * devDim.w / imgSize.w;

    this.self.setState({
      largeImgDim: {
        w: devDim.w,
        h: height
      }
    });
  };

  render() {
    console.log(this);
    const routes = [
      {
        index: 0,
        url: '0',
        imgSize: this.state.imgSize,
        largeImgDim: this.state.largeImgDim
      },
      {
        index: 1,
        url: this.state.propsImgUrl,
        imgSize: this.state.imgSize,
        largeImgDim: this.state.largeImgDim
      },
    ];

    return (
      <Navigator
        style={styles.container}
        initialRoute={routes[0]}
        initialRouteStack={routes}
        renderScene={(route, navigator) =>
          <Thumbs
            onForward={() => navigator.push(routes[1]) }
            onBack={() => navigator.pop() }
            index = {route.index}
            imgUrl={route.url}
            imgSize={route.imgSize}
            largeImgDim={route.largeImgDim}
            propsImgUrl={this.state.propsImgUrl} 
            self={this.state.self}
            getImgDim={this.getImgDim}
          /> 
        }
      />
    );
  }
};

export default connect(
  state => ({
    photoCollection: state
  }),
  dispatch => ({
    onAddPhotos: (photos) => {
      dispatch({ type: 'ADD_PHOTOS', payload: photos })
    }
  })
)(App);