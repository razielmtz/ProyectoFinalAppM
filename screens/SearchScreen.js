import React from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {Icon} from 'native-base'

export default class SearchScreen extends React.Component {
    render () {
        return (
                <View style = {styles.container}>
                    <View style = {styles.header}>
                    <TouchableOpacity>
                        <Icon type = "Ionicons" name = "md-arrow-back" style = {{fontSize: 24, color: "#D8D9DB"}}/>
                    </TouchableOpacity>
                    </View>
                    <View style = {styles.form}>
                        <View style = {styles.inputContainer}>
                            <Text style = {styles.inputStyle}>Raza: </Text>
                            <TextInput  style = {styles.textInputStyle} placeholder = "Cualquiera"></TextInput>
                        </View>
                        <View style = {styles.inputContainer}>
                            <Text style = {styles.inputStyle}>Tamaño: </Text>
                            <TextInput  style = {styles.textInputStyle} placeholder = "Cualquiera"></TextInput>
                        </View>
                        <View style = {styles.inputContainer}>
                            <Text style = {styles.inputStyle}>Color: </Text>
                            <TextInput  style = {styles.textInputStyle} placeholder = "Cualquiera"></TextInput>
                        </View>
                        <View style = {styles.inputContainer}>
                            <Text style = {styles.inputStyle}>Edad: </Text>
                            <TextInput  style = {styles.textInputStyle} placeholder = "Cualquiera"></TextInput>
                        </View>
                        <View style = {styles.inputContainer}>
                            <Text style = {styles.inputStyle}>Ciudad: </Text>
                            <TextInput  style = {styles.textInputStyle} placeholder = "Cualquiera"></TextInput>
                        </View>
                        <View style = {styles.inputContainer}>
                            <Text style = {styles.inputStyle}>Estado: </Text>
                            <TextInput  style = {styles.textInputStyle} placeholder = "Cualquiera"></TextInput>
                        </View>

                        
                    </View>

                    
                    <TouchableOpacity style = {styles.button}>
                            <Text style = {{color: "#FFF", fontWeight: "700"}}>Buscar</Text>
                    </TouchableOpacity>

                </View>
                    
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
    form: {
        marginTop: 10,
        marginHorizontal: 30,
        width: "90%",
        alignItems: "center",
    },
    inputContainer: {
        flexDirection: "row",
        marginTop: 20,
        alignItems: "center",
        justifyContent: "center",
        height: 50
    },
    inputStyle: {
        width: "40%",
        fontSize: 16,
    },
    textInputStyle : {
        width: "50%",
        fontSize: 16,
        borderWidth: 1,
        borderRadius: 10
    },
    button: {
        marginHorizontal: 30,
        backgroundColor: "#fe9801",
        width: "40%",
        borderRadius: 50,
        marginTop: 20,
        height: 52,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center"
    }
});