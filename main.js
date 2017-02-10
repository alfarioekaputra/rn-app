import Exponent from 'exponent';
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  NavigatorIOS,
  Text,
  View,
} from 'react-native';

var HomeView = require('./views/HomeView');

class App extends Component{
  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'CDP',
          component: HomeView
        }}
      />
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

Exponent.registerRootComponent(App);

//module.exports = App;
