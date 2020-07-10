// Components/FilmDetail.js

import React from 'react'
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, Share, Platform } from 'react-native'
import { getFilmDetailFromApi, getImageFromApi } from '../API/TMDBApi'
import { Image, Button, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux'
import  EnlargeShrink from '../Animations/EnlargeShrink'


class FilmDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      film: undefined,
      isLoading: true
    }
  }

  componentDidMount() {
    getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(data => {
      this.setState({
        film: data,
        isLoading: false
      })
    })
  }

  _displayLoading() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size='large' />
        </View>
      )
    }
  }

  _toggleFavorite() {
    const action = { type: "TOGGLE_FAVORITE", value: this.state.film }
    this.props.dispatch(action)
  }

  componentDidUpdate() {
    console.log(this.props.favoritesFilm);
  }

  _displayFavoriteImage() {
    var sourceImage = require('../Components/Images/ic_favorite_border.png')
    var shouldEnlarge = false
    if (this.props.favoritesFilm.findIndex(item => item.id === this.state.film.id) !== -1){
      sourceImage = require('../Components/Images/ic_favorite.png')
      shouldEnlarge = true
    }
    return (
      <EnlargeShrink
        shouldEnlarge={shouldEnlarge}>
      <Image
        source={sourceImage}
        style={styles.favorite_image}
      />
      </EnlargeShrink>
    )
  }

  _displayFilm() {
    if (this.state.film != undefined) {

      return (
        <ScrollView style={styles.scrollview_container}>
          <Text>{this.state.film.title}</Text>
          <TouchableOpacity
            style={styles.favorite_container}
            onPress={() => this._toggleFavorite()}>
            {this._displayFavoriteImage()}
          </TouchableOpacity>
          <Image
            style={styles.image}
            source={{uri: getImageFromApi(this.state.film.backdrop_path)}}
            />
            <View style={styles.description_film}>
              <Text>{this.state.film.overview}</Text>
            </View>
            <View style={styles.datesortie}>
              <Text style={styles.datesortie}>Sorti le {this.state.film.release_date}</Text>
            </View>
            <View style={styles.notevote}>
              <Text style={styles.notevote}>
                <Text style={{fontWeight: 'bold', fontSize: 26,}}>
                      Note :
                </Text>

                <Text>
                  {" "}
                </Text>

                    {this.state.film.vote_average} / 10
                </Text>
            </View>
            <View style={styles.nombrevote}>
              <Text style={styles.nombrevote}>Nombre de vote {this.state.film.vote_count}</Text>
            </View>
            <View style={styles.budgetargent}>
              <Text style={styles.budgetargent}>Budget : {this.state.film.budget} $</Text>
            </View>
            <View>
              <Text style={styles.default_text}>Genre(s) : {this.state.film.genres.map(function(genre){
              return genre.name;
              }).join(" / ")}
              </Text>
            </View>
            <View style={styles.compagniefilm}>
              <Text style={styles.compagniefilm}> Companies : {this.state.film.production_companies.map(function(name){
                return name.name;
                }).join(" / ")}
              </Text>
            </View>

          {/* Pour l'instant je n'affiche que le titre, je vous laisserais le soin de créer la vue. Après tout vous êtes aussi là pour ça non ? :)*/
          /*<Image source={{
            uri: 'https://api.themoviedb.org/3/movie/' + '{this.state.film.backdrop_path}'
          }} />*/}

        </ScrollView>
      )
    }
  }

  _shareFilm() {
    const { film } = this.state
    Share.share({ title: film.title, message: film.overview })
  }

  _displayFloatingActionButton() {
    const { film } = this.state
    if (film != undefined && Platform.OS === 'android') { // Uniquement sur Android et lorsque le film est chargé
      return (
        <TouchableOpacity
          style={styles.share_touchable_floatingactionbutton}
          onPress={() => this._shareFilm()}>
          <Image
            style={styles.share_image}
            source={require('../Components/Images/ic_share.png')} />
        </TouchableOpacity>
      )
    }
}

  render() {
    console.log(this.props);
    return (
      <View style={styles.main_container}>
        {this._displayLoading()}
        {this._displayFilm()}
        {this._displayFloatingActionButton()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1
  },

  share_touchable_floatingactionbutton: {
    position: 'absolute',
    width: 60,
    height: 60,
    right: 30,
    bottom: 30,
    borderRadius: 30,
    backgroundColor: '#e91e63',
    justifyContent: 'center',
    alignItems: 'center'
  },
  share_image: {
    width: 30,
    height: 30
  },
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollview_container: {
    flex: 1
  },
  imageDetails:{

  },

  image: {
    width: 120,
    height: 180,
    margin: 5,
    backgroundColor: 'gray'
  },

  description_film: {
    fontStyle: 'italic',
    color: '#666666'
  },

  datesortie: {
    textAlign: 'right',
    fontSize: 14
  },

  notevote: {
    fontSize: 16,
    color: '#666666'
  },

  genrefilm: {
    fontWeight: 'bold',
    fontSize: 26,
    color: '#666666'
  },

  default_text: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
  },

  favorite_container: {
    alignItems: 'center'
  },

  favorite_image: {
    width: null,
    height: null,
    flex: 1
  },
})

const mapStatetoProps = (state) => {
  return {
    favoritesFilm: state.favoritesFilm
  }
}
export default connect(mapStatetoProps)(FilmDetail)
