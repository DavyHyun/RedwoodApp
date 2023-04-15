import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

FontAwesome.loadFont();


const PageBackButton = (props) => {
  return (
    <TouchableOpacity  onPress ={() => {props.onPress()}}>
        <FontAwesome name="angle-left" size={35} color="#5C4033"/>
    </TouchableOpacity>
  )
}

export default PageBackButton

const styles = StyleSheet.create({})