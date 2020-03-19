import React from 'react';
import {
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity,
    Image,
    StatusBar,
    LayoutAnimation
} from 'react-native';
import {Icon} from 'native-base'
import * as firebase from 'firebase'

export default class LoginScreen extends React.Component {

    state = {
        email: "",
        password: "",
        errorMessage: ""
    };

    handleLogin = () => {
        const {email, password} = this.state;

        firebase.auth().signInWithEmailAndPassword(email, password).catch(error => this.setState({errorMessage: error.message}));
    };


    render() {
        return (
            <View style = {styles.container}>
                <StatusBar barStyle = "light-content"></StatusBar>
                <Text style = {styles.greeting}>
                    {'¡Binvenido a\n Ayuda Canina!'}
                </Text>
                <Icon type="FontAwesome" name = "paw" style = {{marginTop: 8,fontSize: 40, alignSelf: "center", color: "#284906"}}/>

                <View style = {styles.errorMessage}>
                    <Text style = {styles.error}>{this.state.errorMessage}</Text>
                </View>

                <View style = {styles.form}>
                    <View style = {styles.inputContainer}>
                        <TextInput 
                            style = {styles.input} 
                            autoCapitalize = "none" 
                            placeholder = "Correo electrónico"
                            onChangeText = {email => this.setState({email})}
                            value = {this.state.email}>
                        </TextInput>
                    </View>

                    <View style = {[styles.inputContainer, styles.marginTop]}>
                        <TextInput 
                            style = {styles.input} 
                            secureTextEntry 
                            placeholder = "Contraseña"
                            autoCapitalize = "none" 
                            onChangeText = {password => this.setState({password})}
                            value = {this.state.password}
                            ></TextInput>
                    </View>
                </View>

                <TouchableOpacity style = {styles.button} onPress = {this.handleLogin}>
                    <Text style = {{color: "#FFF", fontWeight: "700", fontSize: 15}}>Entrar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style = {{alignSelf: "center", marginTop: 32}} 
                    onPress = {() => this.props.navigation.navigate("Register")}>
                    <Text style = {{color: "#414959", fontSize: 14}}>
                        ¿Aún no tienes cuenta? <Text style = {{fontWeight: "700", color: "#eb8242"}}>Regístrate</Text>
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
        marginTop: 104,
        fontSize: 24,
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
        marginTop: 16,
        marginBottom: 48,
        marginHorizontal: 30,
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
    }
})