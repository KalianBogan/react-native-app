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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF'
  },
  thumbs: {
    flex: 1
  },
  thumbs__listItem: {
    flex: 1,
    flexDirection: 'row'
  },
  thumbs__img: {
    width: 150,
    height: 150
  },
  thumbs__info: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#999'
  },
  thumbs__author: {
    fontSize: 14,
    color: '#666'
  },
  thumbs__photoName: {
    fontSize: 18,
    color: '#000'
  },
  largeImg__img: {
    position: 'relative',
    flex: 1,
    zIndex: 1
  },
  backBtn: {
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 40,
    zIndex: 10,
    backgroundColor: '#c1c1c1'
  },
  btnBackTxt: {
    color: '#000',
    fontSize: 16
  }
});

export default styles;