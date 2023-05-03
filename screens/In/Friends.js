import { StyleSheet, Text, View, FlatList, Dimensions, TextInput, Alert } from 'react-native'
import React, {useState, useEffect} from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import firestore from '@react-native-firebase/firestore';
import { firebase } from "@react-native-firebase/auth";
import OnboardingScreen from '../Auth/OnboardingScreen';


friendsdata = [
  {
    id: '1',
    username: 'ckim'
  },
  {
    id: '2',
    username: 'jxhanara'
  },
]

// requestsdata = [
//   {
//     id: '1',
//     username: 'nicolejoe'
//   },
//   {
//     id: '2',
//     username: 'johnslee'
//   },
//   {
//     id: '3',
//     username: 'irisgkim'
//   },
// ]
const { width, height } = Dimensions.get('window')
const Friends = ({route}) => {

  const [username, setUsername] = useState('');
  const [requests, setRequests] = useState([]);
  const [user, setUser] = useState(null);
  const [requestData, setRequestData] = useState([]);
  const [friendData, setFriendsData] = useState([]);
  const [friends, setFriends] = useState([]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    console.log('useEffect run')
    setUserInfo();
    requestRender();
    friendsRender();
  }, [user])

  const setUserInfo = () => {
    const userId = firebase.auth().currentUser.uid;
    const userRef = firebase.firestore().collection('Users').doc(userId);
    const unsubscribe1 = userRef.onSnapshot((doc) => {
      if (doc.exists) {
        const { name, username } = doc.data();
        if(user === null) {
          setUser({ name, username });
        }     
      }
    });

    return () => unsubscribe1();
  }

  const requestRender = () => {
    const friendCollection = firestore().collection('FriendRequests');
    var userId = firebase.auth().currentUser.uid;
    const requestQuery = friendCollection.where('target', '==', userId).where('status', '==', '0');
    const unsubscribe = requestQuery.onSnapshot((querySnapshot) => {
      const requestArr = [];
      querySnapshot.forEach((doc) => {
        requestArr.push({
          username: doc.data().sourceUsername,
          id: doc.data().source,
          docID: doc.id
        })
      })
      setRequestData(requestArr);
    })
    return () => unsubscribe();
  }

  const friendsRender = () => {
    if (user != null) {
    const friendCollection = firestore().collection('Friends');
    const friend1Query = friendCollection.where('relationship', 'array-contains', user.username);
    const unsubscribe = friend1Query.onSnapshot((querySnapshot) => {
      const friendArr = [];
      const friendArr2 = [];
      querySnapshot.forEach((doc) => {
          relationshipArr = doc.data().relationship;
          if (relationshipArr[0] === user.username) {
            friendArr.push({username: relationshipArr[1], id: doc.id + "1"});
            friendArr2.push(relationshipArr[1]);
          } else {
            friendArr.push({username: relationshipArr[0], id: doc.id + "0"});
            friendArr2.push(relationshipArr[0]);
          }
      })
      setFriendsData(friendArr);
      setFriends(friendArr2);
    })
    return () => unsubscribe();
  } else {
    console.log('hi')
  }
  }

  const sendRequest = () => {
    if (friends.includes(username)) {
      Alert.alert('Already friends!');
      return;
    }
    var userId = firebase.auth().currentUser.uid;
    const postCollection = firestore().collection('Users')
    const postQuery = postCollection.where('username','==', username)
    const unsubscribe = postQuery.onSnapshot((querySnapshot) => {
      var id;
      querySnapshot.forEach((doc) => {
        id = doc.id
        })

        firestore().collection('FriendRequests').add({
          source: userId + '',
          sourceUsername: user.username+"",
          target: id+ '',
          targetUsername: username+ '',
          status: '0'
        })
      })
    }

    const accept = (item) => { 
      const userId = firebase.auth().currentUser.uid;
      const friendArray = [];
      friendArray.push(item.username);
      friendArray.push(user.username);
      firestore().collection('Friends').add({
        relationship: friendArray
      })
      firestore().collection('FriendRequests').doc(item.docID).update({
        status: '1',
      })
    }

    const reject = (item) => {
      // firestore().collection('Friends').doc(item.docID).delete().then(() => {
      //   console.log('deleted');
      // })
    }



  

  return (
    <View style={styles.container}>
      <View style ={styles.friendsContainer}>
        <Text style={styles.text}>My Friends</Text>
        <View style={{height: height * 0.2}}>
        <FlatList
          data={friendData}
          // keyExtractor={item => item.id}
          renderItem={({ item }) =>
            <Text style= {{fontFamily: 'Lato-Regular', }}>{item.username}</Text>
          }
          showsVerticalScrollIndicator={false}
        />
        </View>
      </View>

      <View style ={styles.friendsContainer}>
        <Text style={styles.text}>Friend Requests</Text>
        <View style={{height: height * 0.2}}>
        <FlatList
          data={requestData}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) =>
            <View style={{flexDirection: 'row'}}>
               <Text style= {{fontFamily: 'Lato-Regular', marginRight: '10%' }}>{item.username}</Text>
               <TouchableOpacity onPress={() => accept(item)}><Text style= {{fontFamily: 'Lato-Regular',marginRight: '5%' }}>accept</Text></TouchableOpacity>
               <TouchableOpacity onPress={() => reject(item)}><Text style= {{fontFamily: 'Lato-Regular', }}>reject</Text></TouchableOpacity>
            </View>
           
          }
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={styles.friendsContainer}>
        <Text style={styles.text}>Send Request</Text>
        <TextInput
              placeholder="enter username"
              value={username}
              onChangeText={text => { setUsername(text) }}
              // style={styles.input}
            />
          <TouchableOpacity onPress={sendRequest}>
            <Text>send</Text>
          </TouchableOpacity>
      </View>

    </View>
    </View>
  )
}

export default Friends

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'white',
      alignItems: 'center'
    },

    friendsContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },

    text: {
      fontFamily: 'Lato-Bold',
      fontSize: 20
    }

})