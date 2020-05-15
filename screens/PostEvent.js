import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, TextInput} from 'react-native';
import {Icon} from 'native-base'
import Fire from "../Fire";
import ImagePicker from 'react-native-image-picker';
import UserPermissions from '../utilities/UserPermissions'

const firebase = require('firebase');
require("firebase/firestore");

export default class PostEvent extends React.Component {

    state = {
        text: "",
        image: null,
        user : {}
    };

    unsubscribe = null;

    componentDidMount() {

        const user = this.props.uid || Fire.shared.uid;

        UserPermissions.requestCameraPermission();   

        this.unsubscribe = Fire.shared.firestore
            .collection("users")
            .doc(user)
            .onSnapshot(doc => {
                this.setState({ user: doc.data() });
            });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    handlePost = () => {
        Fire.shared
            .addPost({text: this.state.text.trim(), localUri: this.state.image})
            .then(ref => {
                this.setState({text: "", image: null});
                this.props.navigation.goBack();
            })
            .catch(error => {
                alert(error);
            });
    };

    pickImage = async () => {
        ImagePicker.launchImageLibrary({aspect: [4, 3], mediaType: 'photo'}, (response) => {
            // console.log('Response =', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
              } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
              } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
              } else {
                const source = { uri: response.uri };
                this.setState({
                    image: response.uri,
                });
            }
        });
    }

    render () {
        return (
            <SafeAreaView style = {styles.container}>
                <View style = {styles.header}>
                    <TouchableOpacity onPress = {() => this.props.navigation.goBack()}>
                        <Icon type = "Ionicons" name = "md-arrow-back" style = {{fontSize: 24, color: "#D8D9DB"}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {this.handlePost}>
                        <Text style = {{fontWeight: "500"}}>
                            Publicar
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style = {styles.inputContainer}>
                    <Image source = {
                                    this.state.user.avatar
                                        ? { uri: this.state.user.avatar }
                                        : require("../assets/defaultImage.png")
                            } 
                            style = {styles.avatar}></Image>
                    <TextInput
                        autoFocus = {true}
                        multiline = {true}
                        numberOfLines = {4}
                        style = {{ flex: 1, textAlignVertical: "top", borderWidth: StyleSheet.hairlineWidth, borderRadius: 10 }}
                        placeholder = "¿Te gustaría compartir algo?"
                        onChangeText = {text => this.setState({text})}
                        value = {this.state.text}
                    >
                    </TextInput>
                </View>

                <TouchableOpacity style = {styles.photo} onPress = {this.pickImage}>
                    <Icon type = "Ionicons" name = "md-camera" style = {{fontSize: 32, color: "#D8D9DB"}} />
                </TouchableOpacity>

                <View style ={{marginHorizontal: 32, marginTop: 32, height: 150}}> 
                    <Image source = {{uri: this.state.image}} style = {{width: "100%", height: "100%"}}></Image>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 32,
        paddingVertical: 32,
        borderBottomWidth: 1,
        borderBottomColor: "#D8D9DB"
    },
    inputContainer: {
        margin: 32,
        flexDirection: "row"
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 16
    },
    photo: {
        alignItems: "flex-end",
        marginHorizontal: 32
    }
});