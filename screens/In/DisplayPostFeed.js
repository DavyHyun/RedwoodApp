
import { KeyboardAvoidingView, StyleSheet, Text, View, Animated, Dimensions, ImageBackground, Alert, Scrollview, TextInput, TouchableOpacity, Keyboard } from 'react-native'
import React, { useState, useEffect, useRef } from 'react';
//import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import { firebase } from "@react-native-firebase/auth";
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import DismissKeyBoard from '../../components/DissmisskeyBoard';
import PageBackButton from '../../components/PageBackButton';
import EachComment from '../../components/EachComment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const { width, height } = Dimensions.get('window')

const DisplayPostProfile = ({ route }) => {
    const userId = firebase.auth().currentUser.uid;
    const navigation = useNavigation();
    const { postId, postUserId, text, username, user, title, verse, verseText, messageInputRef } = route.params;
    const [commentEntry, setCommentEntry] = useState('');
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const subscriber = firestore()
            .collection('Posts')
            .doc(postUserId)
            .collection('userPosts')
            .doc(postId)
            .onSnapshot(doc => {
                setComments(parseComments(doc.data().comments));
            })

        return () => subscriber();
    }, []);

    useEffect(() => {
        if (messageInputRef && messageInputRef.current) {
            messageInputRef.current.focus();
        }
    }, []);

    const parseComments = (comments) => {
        let parsedComments = [];
        let key = 0;
        comments.forEach(comment => {
            let divIndexStart = comment.indexOf('|div|');
            let divIndexEnd = divIndexStart + 5;
            let commentUser = comment.slice(0, divIndexStart);
            let commentContent = comment.slice(divIndexEnd);
            let feed = { username: commentUser, comment: commentContent, key: key };
            key++;
            parsedComments.push(feed);
        });
        return parsedComments;
    }

    // back button
    const navBack = () => {
        navigation.goBack();
    }

    const commentSent = () => {
        let userComment = username + '|div|' + commentEntry;
        firestore().collection('Posts').doc(postUserId).collection('userPosts').doc(postId).update({
            comments: firestore.FieldValue.arrayUnion(userComment),
        })
        setCommentEntry('');
    }

    return (
        <KeyboardAwareScrollView behavior='padding' scrollEnabled={false} extraScrollHeight={-(height * 0.06)} style={styles.container}>
            <View style={styles.topBar}>

                <View style={styles.backButton}>
                    <PageBackButton onPress={navBack} />
                </View>

                <View style={styles.titleContainer}>
                    <Text adjustsFontSizeToFit style={styles.title} numberOfLines={1}>{title}</Text>
                </View>
                <View style={styles.userContainer}>
                    <Text adjustsFontSizeToFit style={styles.name} numberOfLines={1}>{user}</Text>
                </View>

            </View>
            <View style={styles.scrollContainer}>
                <KeyboardAwareScrollView
                    extraScrollHeight={-(height * 0.06)}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.verseContainer}>
                        <TextInput style={styles.verse} editable={false} value={verse} scrollEnabled={false} />
                    </View>
                    <View style={styles.verseTextContainer}>
                        <TextInput style={styles.verseText} editable={false} scrollEnabled={false} multiline value={"\"" + verseText.replace(/(\r\n|\n|\r)/gm, "") + "\""} />
                    </View>
                    <View style={styles.textContainer}>
                        <TextInput style={styles.text} editable={false} value={text} multiline scrollEnabled={false}/>
                    </View>
                    <View style={styles.commentsContainer}>
                        <FlatList
                            data={comments}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={item => item.key}
                            renderItem={({ item }) => <EachComment username={item.username} comment={item.comment} />}
                        />
                    </View>
                </KeyboardAwareScrollView>
            </View>
            <View style={styles.commentSection}>
                <View style={styles.commentEntryContainer}>
                    <TextInput
                        placeholder='Add a comment...'
                        style={styles.commentEntry}
                        placeholderTextColor='#C3A699'
                        value={commentEntry}
                        onChangeText={(text) => setCommentEntry(text)}
                        multiline
                        scrollEnabled
                        ref={messageInputRef}
                    />
                    <TouchableOpacity style={styles.sendCommentButtonContainer} onPress={() => commentSent()}>
                        <Feather name='send' color='#C3A699' size={23} style={styles.sendCommentButton} />
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}

export default DisplayPostProfile

const styles = StyleSheet.create({
    container: {
        width: width,
        paddingLeft: width * 0.13,
        paddingRight: width * 0.13,
        height: height,
        backgroundColor: '#ECDCD1',
    },

    scrollContainer: {
        maxHeight: height * 0.6,
        height: height * 0.6,
        flex: 1,
    },

    backButton: {
        marginLeft: width * -0.13,
        paddingLeft: width * 0.025,
        width: width * 0.13,
    },

    topBar: {
        height: height * 0.065,
        width: width,
        marginLeft: width * -0.13,
        paddingLeft: width * 0.13,
        backgroundColor: '#DCC6BB',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: height * 0.1,
        marginBottom: height * 0.02
    },

    titleContainer: {
        width: width * 0.5,
        height: height * 0.04,
        justifyContent: 'center',
    },

    commentSection: {
        alignItems: 'center',
    },

    commentEntry: {
        color: '#785444',
        fontSize: 17,
        width: width * 0.85,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },

    commentEntryContainer: {
        borderColor: '#C3A699',
        flexDirection: 'row',
        padding: height * 0.016,
        width: width,
        borderTopWidth: 1,
        alignItems: 'center',
    },

    sendCommentButtonContainer: {
        width: width * 0.06,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },

    sendCommentButton: {
        transform: [{ rotate: '45deg' }],
    },

    commentsContainer: {
        marginTop: height * 0.021,
    },

    userContainer: {
        width: width * 0.25,
        textAlign: 'right',
        justifyContent: 'center',
    },

    name: {
        fontFamily: 'Quicksand-Bold',
        fontSize: 15,
        color: '#785444',
        textAlign: 'right',
    },

    title: {
        fontFamily: 'Quicksand-Regular',
        fontWeight: 500,
        fontSize: 27,
        color: '#785444',
    },

    verseContainer: {
        height: height * 0.05,
        justifyContent: 'center',
    },

    verse: {
        fontFamily: 'Quicksand-Bold',
        fontSize: 20,
        color: '#A47C69',
    },

    verseTextContainer: {
    },

    quote: {
        fontFamily: 'Quicksand-Bold',
        fontSize: 19,
        color: '#505050',
    },

    verseText: {
        fontFamily: 'Quicksand-Regular',
        fontSize: 17,
        color: '#A47C69',
    },

    text: {
        fontFamily: 'Quicksand-Regular',
        fontSize: 17,
        color: '#785444',
    },

    textContainer: {
        marginTop: height * 0.025,
    },

    interactionContainer: {
        height: height * 0.03,
        flexDirection: 'row',
    },

    iteractionButtonContainer: {
        width: width * 0.085,
        height: height * 0.035,
        justifyContent: 'flex-end'

    },
})