import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const SocialButton = (props) => {
  return (
    <TouchableOpacity style={
        {backgroundColor: props.buttonColor,
            width: '75%',
            padding: 10,
            borderRadius: 40,
            alignItems: 'center',
            marginBottom: '3%',
            borderColor: '#5B5B5B',
            // borderWidth: 1,
            flexDirection: 'row',
            justifyContent:'space-evenly'
        }
    }
    onPress ={() => {props.onPress()}}
    >

        <FontAwesome name={props.social} size={25} color="#505050"/>
        <Text style={
            {color: props.textColor,
            fontFamily: 'Lato-Regular',
            fontWeight:'500'
            }
        }>{props.text}</Text>
    </TouchableOpacity>
  )
}

export default SocialButton

const styles = StyleSheet.create({})