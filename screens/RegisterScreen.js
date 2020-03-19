import React from 'react';
import {
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity,
    StatusBar,
    Image
} from 'react-native';
import {Icon} from 'native-base'
import Fire from '../Fire'
import UserPermissions from '../utilities/UserPermissions'
import ImagePicker from 'react-native-image-picker';


export default class RegisterScreen extends React.Component {

    state = {
        user: {
            name: "",
            email: "",
            password: "",
            avatar: null
        },
        errorMessage: ""
    };

    handlePickAvatar = async () => {
        UserPermissions.requestCameraPermission();

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
                        user: { ...this.state.user, avatar: response.uri}
                    });
                }
        });
    };

    
    handleSignUp = () => {
        Fire.shared.createUser(this.state.user)
    };

    render() {
        return (
            
            <View style = {styles.container}>
                <StatusBar barStyle = "light-content"></StatusBar>

                <TouchableOpacity style = {styles.back} onPress = {() => this.props.navigation.goBack()}>
                    <Icon type="Ionicons" name="md-arrow-round-back" style = {{color: "#FFF"}}/>
                </TouchableOpacity>

                <View style = {{top: 25, alignItems: "center", width: "100%"}}>
                    <Text style = {styles.greeting}>{'Llena los campos\n para registrarte'}</Text>
                    <TouchableOpacity style = {styles.avatarPlaceholder} onPress = {this.handlePickAvatar}>
                        <Image source = {{uri: this.state.user.avatar}} style = {styles.avatar} />
                        <Icon type="Ionicons" name = "ios-add" style ={{color: "#FFF", marginTop: 6, marginLeft: 2}}/>
                    </TouchableOpacity>

                </View>   

                <View style = {styles.errorMessage}>
                    <Text style = {styles.error}>{this.state.errorMessage}</Text>
                </View>

                <View style = {styles.form}>
                    <View style = {styles.inputContainer}>
                        <TextInput 
                            style = {styles.input} 
                            autoCapitalize = "none" 
                            placeholder = "Nombre"
                            onChangeText = {name => this.setState({user: {...this.state.user, name}})}
                            value = {this.state.user.name}>
                        </TextInput>
                    </View>

                    <View style = {[styles.inputContainer, styles.marginTop]}>
                        <TextInput 
                            style = {styles.input} 
                            autoCapitalize = "none" 
                            placeholder = "Correo electrónico"
                            onChangeText = {email => this.setState({user: {...this.state.user, email}})}
                            value = {this.state.user.email}>
                        </TextInput>
                    </View>

                    <View style = {[styles.inputContainer, styles.marginTop]}>
                        <TextInput 
                            style = {styles.input} 
                            secureTextEntry 
                            autoCapitalize = "none"
                            placeholder = "Password"
                            onChangeText = {password => this.setState({user: {...this.state.user, password}})}
                            value = {this.state.user.password}
                            ></TextInput>
                    </View>
                </View>

                <TouchableOpacity style = {styles.button} onPress = {this.handleSignUp}>
                    <Text style = {{color: "#FFF", fontWeight: "700"}}>Crear cuenta</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style = {{alignSelf: "center", marginTop: 32}} 
                    onPress = {() => this.props.navigation.navigate("Login")}
                >
                    <Text style = {{color: "#414959", fontSize: 13}}>
                        ¿Ya tienes cuenta? <Text style = {{fontWeight: "700", color: "#eb8242"}}>Inicia sesión</Text>
                    </Text>
                </TouchableOpacity>

                
            </View>
        
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: "#ccda46"
    },
    greeting: {
        marginTop: 32,
        fontSize: 22,
        fontWeight: "400", 
        textAlign: "center",
        fontWeight: "700",
        color: "#284906"
    },
    errorMessage: {
        height: 72,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 30
    },
    error: {
        color: "#E9446A",
        fontSize: 13,
        fontWeight: "600",
        textAlign: "center"
    },
    form: {
        marginBottom: 48,
        marginHorizontal: 30,
        marginTop: -16
    },
    inputContainer: {
        borderWidth: 1,
        borderRadius: 50,
        backgroundColor: "#e4f2f0",
        borderColor: "#697c37"
    },
    inputTitle: {
        color: "#8A8F9E",
        fontSize: 10,
        textTransform: "uppercase"
    },
    input: {
        borderBottomColor: "#8A8F9E",
        height: 40,
        fontSize: 15,
        color: "#004445",
        marginHorizontal: 12
    },
    marginTop: {
        marginTop: 32
    },
    button: {
        marginHorizontal: 30,
        backgroundColor: "#fe9801",
        borderRadius: 50,
        height: 52,
        alignItems: "center",
        justifyContent: "center"
    },
    back: {
        position: "absolute",
        top: 35,
        left: 30,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "rgba(21, 22, 48, 0.1)",
        alignItems: "center",
        justifyContent: "center"
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        backgroundColor: "#E1E2E6",
        borderRadius: 50,
        marginTop: 24,
        justifyContent: "center",
        alignItems: "center"
    },
    avatar: {
        position: "absolute",
        width: 100,
        height: 100,
        borderRadius: 50,
    }
})