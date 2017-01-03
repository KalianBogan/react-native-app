/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

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

export default class nativeApp extends Component {
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

class Thumbs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataArr: '',
      page: 1
    };
  };

  getData() {
    var page = '&page=' + this.state.page;
    
    var url = 'https://api.500px.com/v1/photos?feature=popular&consumer_key=wB4ozJxTijCwNuggJvPGtBGCRqaZVcF6jsrzUadF' + page;
    var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
    var xhr = new XHR();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Content-Type', 'application');

    xhr.onload = function() {
      var data = JSON.parse(xhr.responseText);
      var data = data.photos;
      this.setState({ dataArr: data });
    }.bind(this);

    xhr.onerror = function() {
      console.log( 'Ошибка ' + this.status );
    }
    xhr.send();
  };

  onPressHeandler() {
    var href = this.children.props.children[0].props.source.uri
    var start = href.indexOf('photo/') + 6;
    var end = href.indexOf('/', start);
    href = href.split('');
    var id = href.slice(start, end);
    id = id.join('');

    arguments[0].getLargePhoto(id, arguments[0]);
  };

  getLargePhoto(id, context) {
    var url = 'https://api.500px.com/v1/photos/'+id+'?consumer_key=wB4ozJxTijCwNuggJvPGtBGCRqaZVcF6jsrzUadF';
    var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
    var xhr = new XHR();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Content-Type', 'application');

    xhr.onload = function() {
      var data = JSON.parse(xhr.responseText);
      this.props.self.setState({
        propsImgUrl: data.photo.image_url,
        imgSize: {
          w: data.photo.width,
          h: data.photo.height
        }
      });
      context.props.getImgDim();
      setTimeout(function() {
        context.props.onForward();
      }, 1);
    }.bind(this);

    xhr.onerror = function() {
      console.log( 'Ошибка ' + this.status );
    }
    xhr.send();
  };

  render() {
    if (!this.state.dataArr) this.getData();
    var arr = (this.state.dataArr) ? this.state.dataArr : [];

    return (
      <ScrollView style={styles.thumbs}>
        { arr.map( (photo) => { return this.createListItem(photo) }) }
        { this.createLargeImg(arr) }
        
      </ScrollView>
    );
  }

  createListItem(photo) {
    var self = this;
    if (this.props.index !== 0) return false;

    return (
      <TouchableNativeFeedback
        key={ photo.id }
        onPress={function(){
          self.onPressHeandler.apply(this, [self]);
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

  createLargeImg(arr) {
    if (this.props.index !== 1) return false;
    var contHeight = this.props.largeImgDim.h;
    
    return (
      <View style={{flex: 1, alignItems: 'stretch', height: contHeight}} >
        <TouchableHighlight
          style={styles.backBtn}
          onPress={this.props.onBack}
        >
          <Text
            style={styles.btnBackTxt}
          >
            {'< Back'}
          </Text>
        </TouchableHighlight>
        <Image
          style={styles.largeImg__img}
          source={{uri: this.props.imgUrl}}
        />
      </View>
    );
  };
};

AppRegistry.registerComponent('nativeApp', () => nativeApp);