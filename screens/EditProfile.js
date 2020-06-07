import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, TextInput, ScrollView} from 'react-native';
import {Icon, Picker} from 'native-base'
import Fire from "../Fire";
import ImagePicker from 'react-native-image-picker';
import UserPermissions from '../utilities/UserPermissions'

export default class PostAdoption extends React.Component {

    state = {
        name: "",
        information: "",
        image: null,
        user : {},
    };

    updateProfile = () => {

        const user = this.props.uid || Fire.shared.uid;

        Fire.shared
                .updateUser({
                             user_id: user,
                             name: this.state.name,
                             information: this.state.information
                             })
                .then(ref => {
                    this.props.navigation.goBack();
                })
                .catch(error => {
                    alert(error);
                });
    }

    unsubscribe = null;

    componentDidMount() {

        const user = this.props.uid || Fire.shared.uid;

        console.log("THE USER: ", user);

        this.unsubscribe = Fire.shared.firestore
            .collection("users")
            .doc(user)
            .onSnapshot(doc => {
                this.setState({ user: doc.data(),
                                information: doc.data().information || "Añadir información",
                                name: doc.data().name
                             });
            });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    handlePost = () => {
        Fire.shared
            .addAdoptionPost({breed: this.state.breed,
                              size: this.state.size,
                              color: this.state.color,
                              age: this.state.age,
                              city: this.state.city,
                              cState: this.state.cState,
                              additionalInfo: this.state.additionalInfo.trim(), 
                              localUri: this.state.image
                            })
            .then(ref => {
                this.setState({breed: "Chihuahua",
                               size: "Chico",
                               color: "Amarillo",
                               age: "Menos de 1 año",
                               city: "CDMX",
                               cState: "CDMX",
                               additionalInfo: "",
                               image: null
                            });
                this.props.navigation.goBack();
            })
            .catch(error => {
                alert(error);
            });
    };

    render () {
        return (
            <SafeAreaView style = {styles.container}>
                <View style = {styles.header}>
                    <TouchableOpacity onPress = {() => this.props.navigation.goBack()}>
                        <Icon type = "Ionicons" name = "md-arrow-back" style = {{fontSize: 28, color: "#8E8E8E"}}/>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <View style = {styles.inputContainer}>
                        <View style = {{flexDirection: "row", justifyContent: "center"}}>
                            <Image source = {
                                            this.state.user.avatar
                                                ? { uri: this.state.user.avatar }
                                                : require("../assets/defaultImage.png")
                                    } 
                                    style = {styles.avatar}></Image>
                        </View>

                        <View style = {styles.inputContainerRow}>
                            <Text style = {styles.textRequirement}>
                                Nombre
                            </Text>
                            <TextInput
                                autoFocus = {false}
                                multiline = {true}
                                numberOfLines = {1}
                                style = {styles.inputRequirement}
                                placeholder = "Nombre"
                                onChangeText = {name => this.setState({name})}
                                value = {this.state.name}
                            >
                            </TextInput>
                        </View>

                        <View style = {styles.inputContainerRow}>
                            <Text style = {styles.textRequirement}>
                                Información sobre mi
                            </Text>
                            <TextInput
                                autoFocus = {false}
                                multiline = {true}
                                numberOfLines = {1}
                                style = {styles.inputRequirement}
                                placeholder = "Información sobre mi"
                                onChangeText = {information => this.setState({information})}
                                value = {this.state.information}
                            >
                            </TextInput>
                        </View>
                    </View>

                    {/* <TouchableOpacity style = {styles.photo}>
                        <Icon type = "Ionicons" name = "md-camera" style = {{fontSize: 32, color: "#D8D9DB"}} />
                    </TouchableOpacity> */}

                    <TouchableOpacity 
                        style = {styles.button} 
                        onPress = {() => 
                            this.updateProfile()
                        }>
                        <Text style = {{color: "#FFF", fontSize: 15, fontWeight: "700"}}>Actualizar</Text>
                    </TouchableOpacity>

                    <View style ={{marginHorizontal: 32, marginTop: 32, height: 150}}> 
                        <Image source = {{uri: this.state.image}} style = {{width: "100%", height: "100%"}}></Image>
                    </View>
                </ScrollView>
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
        margin: 16,
        flexDirection: "column"
    },
    inputContainerRow: {
        marginTop: 32,
        flexDirection: "column",
        alignItems: "center"
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        marginRight: 16
    },
    photo: {
        alignItems: "center",
        marginHorizontal: 32
    },
    textRequirement: {
        fontWeight: "600", 
        fontSize: 20, 
        color: "#8E8E8E", 
        textAlignVertical: "center"
    },
    inputRequirement: {
        flex: 1, 
        textAlignVertical: "top", 
        borderWidth: 1, 
        borderRadius: 10, 
        width: "60%",
        fontSize: 17,
        marginTop: 8,
        borderColor: "#8E8E8E"
    },
    button: {
        marginHorizontal: "25%",
        backgroundColor: "#fe9801",
        borderRadius: 40,
        height: 48,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 16
    }
});