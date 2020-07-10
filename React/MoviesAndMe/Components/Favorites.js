import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { connect } from 'react-redux'
import FilmList from './FilmList'


class Favorites extends React.Component {

  render() {
    return (

      <FilmList
        films={this.props.favoritesFilm} // C'est bien le component Search qui récupère les films depuis l'API et on les transmet ici pour que le component FilmList les affiche
        navigation={this.props.navigation} // Ici on transmet les informations de navigation pour permettre au component FilmList de naviguer vers le détail d'un film
        favoriteList={true}/>
    )
  }
}

const mapStateToProps = state => {
  return {
    favoritesFilm: state.favoritesFilm
  }
}

const styles = StyleSheet.create({})

export default connect(mapStateToProps)(Favorites)
