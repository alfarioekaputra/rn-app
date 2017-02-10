import React, { Component } from 'react';
import {
  AppRegistry,
  ListView,
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Image,
  AsyncStorage,
  ScrollView
} from 'react-native';

const t = require('tcomb-form-native')
const Form = t.form.Form

const User = t.struct({
	email: t.String,
	password: t.String
})

const options = {
	fields: {
    email: {
      autoCapitalize: 'none',
      autoCorrect: false
    },
    password: {
      autoCapitalize: 'none',
      password: true,
      autoCorrect: false,
      secureTextEntry: true,
    }
  }
}

class ProtectedView extends Component {
  //Initialize the harcoded data
  constructor(props){
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      isLoading: false,
      offset: 0,
      loaded: false
    };
  }

  componentDidMount() {
    this._characters = [];
    this.fetchData(this.state.offset);
    this._loadJwToken().done();
  }

  async _loadJwToken() {
    try {
      var value = await AsyncStorage.getItem('jwt');
      if (value !== null){
        this.setState({jwt_token: value});
        console.log('Recovered selection from disk: ' + value);
      } else {
        console.log('Initialized with no selection on disk.');
      }
    } catch (error) {
      console.log('AsyncStorage error: ' + error);
    }
  }

  fetchData(offset) {
    fetch('https://reqres.in/api/users?page=2')
      .then((response) => response.json())
      .then((data) => {
        //alert(data);
        this._characters = this._characters.concat(data.data);
        console.log(data.data);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(this._characters),
          loaded: true,
          isLoading: false,
        });
      })
      .done();
  }



  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    if(!this.state.jwt_token){
      return this.renderNoLogin();
    }

    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderCharacter.bind(this)}
          style={styles.listView} />
      </View>


    );
  }

  renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  renderNoLogin() {
    return (
      <ScrollView style={styles.containerLogin}>
				<Form
					ref='form'
					options={options}
					type={User}
					value={this.state.value}
					onChange={this._onChange}
				/>
				<TouchableHighlight onPress={this._handleAdd}>
		          <Text style={[styles.button, styles.greenButton]}>Log In</Text>
		        </TouchableHighlight>

			</ScrollView>
    )
  }

  onPress(character: Object) {
    this.props.navigator.push({
      title: character.first_name,
      component: Character,
      passProps: {character},
    });
  }

  renderCharacter(character) {
    let imagePath = character.avatar;
    return (

      <TouchableHighlight onPress={() => this.onPress(character)}>
        <View style={styles.container}>
          <Image source={{uri: imagePath}} style={styles.thumbnail} />
          <View style={styles.rightContainer}>
            <Text style={styles.title}>{character.first_name}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingTop: 50,
  },

  containerLogin: {
    padding: 20,
    flex: 1,
    flexDirection: 'column'
  },

  rightContainer: {
    flex: 1,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center'
  },
  thumbnail: {
    width: 53,
    height: 81
  },

  button: {
    borderRadius: 8,
    padding: 20,
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff'
  },
  greenButton: {
    backgroundColor: '#4CD964'
  },
});
module.exports = ProtectedView
