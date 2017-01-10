// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  * @flow
//  */


import React, { Component } from 'react';
import { AppRegistry, Dimensions } from 'react-native';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import App from './src/app';

const initState = {
  key: 'My Initial Scene',
  photos: [],
  largePhoto: { url: '0' }
};

function globalStore(state = initState, action) {

  if ( action.type === 'ADD_PHOTOS' ) {
    state.photos = [...state.photos];
    action.payload.forEach((photo) => {
      state.photos.push(photo);
    });

    return { ...state };

  } else if ( action.type === 'LOAD_LARGE_PHOTO' ) {
    state.largePhoto.url = action.payload.image_url;
    return { ...state };

  } else if (action.type === 'CLOSE_LARGE_PHOTO') {
    state.largePhoto.url = '0';
    return { ...state };
  }

  return state;
}

const store = createStore(globalStore, applyMiddleware(thunk));


export default class nativeApp extends Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
};

AppRegistry.registerComponent('nativeApp', () => nativeApp);