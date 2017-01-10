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
  Dimensions,
  PixelRatio,
  NavigationExperimental
} from 'react-native';


import styles from './styles';

import { asyncGetPhoto } from './actions/asyncGetPhotos';
import { asyncGetLargePhoto } from './actions/asyncGetLargePhoto';

import { connect } from 'react-redux';

const {
  CardStack: NavigationCardStack,
  StateUtils: NavigationStateUtils,
} = NavigationExperimental;


class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      navigationState: {
        index: 0,
        routes: [this.props.globalStore],
      },
    };
    this._onNavigationChange = this._onNavigationChange.bind(this);
  }

  _onNavigationChange(type) {
    let {navigationState} = this.state;

    switch (type) {
      case 'push':
        const route = {
          key: 'Route-' + Date.now(),
          photos: this.props.globalStore.photos
        };
        navigationState = NavigationStateUtils.push(navigationState, route);
        break;
      case 'pop':
        navigationState = NavigationStateUtils.pop(navigationState);
        break;
    }

    if (this.state.navigationState !== navigationState) {
      this.setState({navigationState});
    }
  };

  render() {
    if (!this.props.globalStore.photos.length) {
      this.props.onLoadPhotos(1);
    }
    return (
      <MyVerySimpleNavigator
        navigationState={this.state.navigationState}
        onNavigationChange={this._onNavigationChange}
        onExit={this._exit}
        getLargePhoto={this.props.onLoadLargePhoto}
        globalStore={this.props.globalStore}
        onClosePhoto={this.props.onClosePhoto}
      />
    );
  }
};

class MyVerySimpleNavigator extends Component {
  constructor(props, context) {
    super(props, context);

    this._onPushRoute = this.props.onNavigationChange.bind(null, 'push');
    this._onPopRoute = this.props.onNavigationChange.bind(null, 'pop');

    this._renderScene = this._renderScene.bind(this);
  };
  
  render() {
    return (
      <NavigationCardStack
        onNavigateBack={this._onPopRoute}
        navigationState={this.props.navigationState}
        renderScene={this._renderScene}
      />
    );
  };

  _renderScene(sceneProps) {
    let index = this.props.navigationState.index;

    if (index === 0) {
      return (
        <Thumbs 
          route={sceneProps.scene.route}
          onPushRoute={this._onPushRoute}
          getLargePhoto={this.props.getLargePhoto}
          globalStore={this.props.globalStore}
        />
      );
    } else if (index === 1) {
      return (
        <LargePhoto
          onPopRoute={this._onPopRoute}
          globalStore={this.props.globalStore}
          onClosePhoto={this.props.onClosePhoto}
        />
      );
    }
  }
};

class LargePhoto extends Component {
  render() {
    return (
      <View style={{flex: 1, alignItems: 'stretch'}} >
        <TouchableHighlight
          style={styles.backBtn}
          onPress={() => {
            this.props.onPopRoute();
            this.props.onClosePhoto();
          }}
        >
          <Text
            style={styles.btnBackTxt}
          >
            {'< Back'}
          </Text>
        </TouchableHighlight>
        <Image
          style={styles.largeImg__img}
          source={{uri: this.props.globalStore.largePhoto.url}}
        />
      </View>
    );
  };
};

class Thumbs extends Component {
  createListItem(photo) {
    return (
      <TouchableNativeFeedback
        key={ photo.id }
        onPress={() => {
          this.props.getLargePhoto(photo.id);
          this.props.onPushRoute();
        }}
      >
        <View style={styles.thumbs__listItem} >
          <Image
            style={styles.thumbs__img}
            source={{uri: photo.image_url}}
          />
          <View style={styles.thumbs__info}>
            <Text style={styles.thumbs__photoName}>{ photo.name }</Text>
            <Text style={styles.thumbs__author}>{ photo.user.fullname }</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  };

  render() {
    return(
      <ScrollView style={styles.thumbs}>
        { this.props.route.photos.map( (photo) => { return this.createListItem(photo) }) }
      </ScrollView>
    );
  };
};

export default connect(
  state => ({
    globalStore: state
  }),
  dispatch => ({
    onAddPhotos: (photos) => {
      dispatch({ type: 'ADD_PHOTOS', payload: photos })
    },
    onLoadPhotos: (page) => {
      dispatch( asyncGetPhoto(page) );
    },
    onLoadLargePhoto: (id) => {
      dispatch( asyncGetLargePhoto(id) );
    },
    onClosePhoto: () => {
      dispatch({ type: 'CLOSE_LARGE_PHOTO'});
    }
  })
)(App);