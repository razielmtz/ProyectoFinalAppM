import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, TextInput, ScrollView} from 'react-native';
import {Icon, Picker} from 'native-base'
import Fire from "../Fire";
import ImagePicker from 'react-native-image-picker';
import UserPermissions from '../utilities/UserPermissions'

// const firebase = require('firebase');
// require("firebase/firestore");

export default class PostAdoption extends React.Component {

    breeds = [{name: 'Chihuahua', key: '0'}, 
              {name: 'Bulldog', key: '1'}, 
              {name: 'Labrador', key: '2'}, 
              {name: 'Pastor Aleman', key: '3'}, 
              {name: 'Pug', key: '4'}
            ];

    sizes = [{name: 'Chico', key: '0'}, 
             {name: 'Mediano', key: '1'}, 
             {name: 'Grande', key: '2'}
            ];

    colors = [{name: 'Amarillo', key: '0'}, 
              {name: 'Blanco', key: '1'}, 
              {name: 'Negro', key: '2'}
            ];    

    ages = [{name: 'Menos de 1 año', key: '0'}, 
            {name: 'Entre 1 y 3 años', key: '1'}, 
            {name: 'Entre 3 y 5 años', key: '2'}, 
            {name: 'Entre 5 y 10 años', key: '3'}, 
            {name: 'Mas de 10 años', key: '4'}
           ];
    
    cities= [{name: 'CDMX', key: '0'}, 
             {name: 'Guadalajara', key: '1'}, 
             {name: 'Monterrey', key: '2'}, 
            //   {name: 'Pastor Aleman', key: '2'}, 
            //   {name: 'Pug', key: '3'}
             ];

    cStates = [{name: 'CDMX', key: '0'}, 
              {name: 'Jalisco', key: '1'}, 
              {name: 'Nuevo Leon', key: '2'}, 
            //   {name: 'Pastor Aleman', key: '2'}, 
            //   {name: 'Pug', key: '3'}
             ];

    state = {
        breed: "Chihuahua",
        size: "Chico",
        color: "Amarillo",
        age: "Menos de 1 año",
        city: "CDMX",
        cState: "CDMX",
        additionalInfo: "",
        image: null,
        user : {},
        telephone: "",
        email: ""
    };

    // onValueChange(value) {
    //     this.setState({
    //       raza: value
    //     });
    //   }

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

        if(this.state.telephone != "" || this.state.email != ""){
            Fire.shared
            .addAdoptionPost({breed: this.state.breed,
                              size: this.state.size,
                              color: this.state.color,
                              age: this.state.age,
                              city: this.state.city,
                              cState: this.state.cState,
                              additionalInfo: this.state.additionalInfo.trim(), 
                              telephone: this.state.telephone.trim(),
                              email: this.state.email.trim(),
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
                               telephone: "",
                               email: "",
                               image: null
                            });
                this.props.navigation.goBack();
            })
            .catch(error => {
                alert(error);
            });
        } else {
            console.log("Telephone or email was not filled");
        }
        // console.log(this.state);
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
                        <Icon type = "Ionicons" name = "md-arrow-back" style = {{fontSize: 28, color: "#8E8E8E"}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {this.handlePost}>
                        <Text style = {{fontWeight: "700", fontSize: 17, color: "#8E8E8E"}}>
                            Publicar
                        </Text>
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
                            <View style = {styles.rowDivision}>
                                <Text style = {styles.textRequirement}>
                                    Raza
                                </Text>
                                <Picker
                                    note
                                    mode="dropdown"
                                    style={styles.pickerStyle}
                                    selectedValue={this.state.breed}
                                    onValueChange={(value) => {this.setState({breed: value})}}
                                    // onValueChange={this.onValueChange.bind(this)}
                                >
                                    {this.breeds.map((breed) => {
                                        return (
                                            <Picker.Item label= {breed.name} value= {breed.name} />
                                        )
                                    })}
                                </Picker>
                            </View>
                            <View style = {styles.rowDivision}>
                                <Text style = {styles.textRequirement}>
                                    Tamaño
                                </Text>
                                <Picker
                                    note
                                    mode="dropdown"
                                    style={styles.pickerStyle}
                                    selectedValue={this.state.size}
                                    onValueChange={(value) => {this.setState({size: value})}}
                                >
                                    {this.sizes.map((size) => {
                                        return (
                                            <Picker.Item label= {size.name} value= {size.name} />
                                        )
                                    })}
                                </Picker>
                            </View>
                        </View>
                        <View style = {styles.inputContainerRow}>
                            <View style = {styles.rowDivision}>
                                <Text style = {styles.textRequirement}>
                                    Color
                                </Text>
                                <Picker
                                    note
                                    mode="dropdown"
                                    style={styles.pickerStyle}
                                    selectedValue={this.state.color}
                                    onValueChange={(value) => {this.setState({color: value})}}
                                >
                                    {this.colors.map((color) => {
                                        return (
                                            <Picker.Item label= {color.name} value= {color.name} />
                                        )
                                    })}
                                </Picker>
                            </View>
                            <View style = {styles.rowDivision}>
                                <Text style = {styles.textRequirement}>
                                    Edad
                                </Text>
                                <Picker
                                    note
                                    mode="dropdown"
                                    style={styles.pickerStyle}
                                    selectedValue={this.state.age}
                                    onValueChange={(value) => {this.setState({age: value})}}
                                >
                                    {this.ages.map((age) => {
                                        return (
                                            <Picker.Item label= {age.name} value= {age.name} />
                                        )
                                    })}
                                </Picker>
                            </View>
                        </View>
                        <View style = {styles.inputContainerRow}>
                            <View style = {styles.rowDivision}>
                                <Text style = {styles.textRequirement}>
                                    Ciudad
                                </Text>
                                <Picker
                                    note
                                    mode="dropdown"
                                    style={styles.pickerStyle}
                                    selectedValue={this.state.city}
                                    onValueChange={(value) => {this.setState({city: value})}}
                                >
                                    {this.cities.map((city) => {
                                        return (
                                            <Picker.Item label= {city.name} value= {city.name} />
                                        )
                                    })}
                                </Picker>
                            </View>
                            <View style = {styles.rowDivision}>
                                <Text style = {styles.textRequirement}>
                                    Estado
                                </Text>
                                <Picker
                                    note
                                    mode="dropdown"
                                    style={styles.pickerStyle}
                                    selectedValue={this.state.cState}
                                    onValueChange={(value) => {this.setState({cState: value})}}
                                >
                                    {this.cStates.map((cState) => {
                                        return (
                                            <Picker.Item label= {cState.name} value= {cState.name} />
                                        )
                                    })}
                                </Picker>
                            </View>
                        </View>

                        <View style = {styles.inputContainerRow}>
                            <Text style = {styles.textRequirement}>
                                Teléfono de contacto
                            </Text>
                            <TextInput
                                autoFocus = {false}
                                multiline = {true}
                                numberOfLines = {1}
                                style = {styles.inputRequirement}
                                placeholder = "Teléfono del publicador"
                                onChangeText = {telephone => this.setState({telephone})}
                                value = {this.state.telephone}
                            >
                            </TextInput>
                        </View>
                        <View style = {styles.inputContainerRow}>
                            <Text style = {styles.textRequirement}>
                                E-mail de contacto
                            </Text>
                            <TextInput
                                autoFocus = {false}
                                multiline = {true}
                                numberOfLines = {1}
                                style = {styles.inputRequirement}
                                placeholder = "E-mail del publicador"
                                onChangeText = {email => this.setState({email})}
                                value = {this.state.email}
                            >
                            </TextInput>
                        </View>
                        <View style = {styles.inputContainerRow}>
                            <Text style = {styles.textRequirement}>
                                Información Adicional
                            </Text>
                            <TextInput
                                autoFocus = {false}
                                multiline = {true}
                                numberOfLines = {2}
                                style = {styles.inputRequirement}
                                placeholder = "¿Quieres agregar más información?"
                                onChangeText = {additionalInfo => this.setState({additionalInfo})}
                                value = {this.state.additionalInfo}
                            >
                            </TextInput>
                        </View>
                    </View>

                    <TouchableOpacity style = {styles.photo} onPress = {this.pickImage}>
                        <Icon type = "Ionicons" name = "md-camera" style = {{fontSize: 32, color: "#D8D9DB"}} />
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
        margin: 8,
        flexDirection: "row",
    },
    rowDivision: {
        flexDirection: "row",
        width: "50%",
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
    },
    textRequirement: {
        fontWeight: "600", 
        fontSize: 16, 
        color: "#8E8E8E", 
        width: "35%", 
        textAlignVertical: "center"
    },
    inputRequirement: {
        flex: 1, 
        textAlignVertical: "top", 
        borderWidth: StyleSheet.hairlineWidth, 
        borderRadius: 10, 
        width: "50%" 
    },
    pickerStyle: {
        width: "65%"
    }
});