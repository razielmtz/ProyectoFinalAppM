import React from "react";
import { View, Text, StyleSheet, Button, Image, TouchableOpacity } from "react-native";
import Fire from "../Fire";

export default class ProfileScreen extends React.Component {

    state = {
        user: {},
        postsAmount: 0,
    };

    unsubscribe = null;

    componentDidMount() {
        const user = this.props.uid || Fire.shared.uid;

        this.unsubscribe = Fire.shared.firestore
            .collection("users")
            .doc(user)
            .onSnapshot(doc => {
                this.setState({ user: doc.data()});
            });
            
        this.countUserPosts();
    }

    componentWillUnmount() {
        this.unsubscribe();
    }
    
    handleEdit = () => {
        this.props.navigation.navigate("EditProfile", {name: this.state.user.name, information: this.state.information});
    }

    countUserPosts(){

        const user = this.props.uid || Fire.shared.uid;

        let size = 0;

        Fire.shared.firestore
            .collection('posts').
            where('uid', '==', user).
            get().
            then(snap => {
                size = snap.size // will return the collection size
                });

        Fire.shared.firestore
            .collection('adoption_posts').
            where('uid', '==', user).
            get().
            then(snap => {
                size += snap.size // will return the collection size
                this.setState({postsAmount: size});
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ marginTop: 64, alignItems: "center" }}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={
                                this.state.user.avatar
                                    ? { uri: this.state.user.avatar }
                                    : require("../assets/defaultImage.png")
                            }
                            style={styles.avatar}
                        />
                    </View>
                    <Text style={styles.name}>{this.state.user.name}</Text>
                </View>
                <View style={styles.infoUserContainer}>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoTitle}>Sobre mi</Text>
                        <Text style={styles.info}>{this.state.user.information}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoTitle}>{this.state.postsAmount}</Text>
                        <Text style={styles.info}>Publicaciones</Text>
                    </View>
                </View>


                <TouchableOpacity 
                        style = {styles.button} 
                        onPress = {() => 
                            this.handleEdit()
                        }>
                    <Text style = {{color: "#FFF", fontSize: 15, fontWeight: "700"}}>Editar Perfil</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                        style = {styles.button} 
                        onPress={() => {
                            Fire.shared.signOut();
                        }}>
                    <Text style = {{color: "#FFF", fontSize: 15, fontWeight: "700"}}>Cerrar sesión</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    profile: {
        marginTop: 64,
        alignItems: "center"
    },
    avatarContainer: {
        shadowColor: "#151734",
        shadowRadius: 30,
        shadowOpacity: 0.4
    },
    avatar: {
        width: 136,
        height: 136,
        borderRadius: 68
    },
    name: {
        marginTop: 24,
        fontSize: 20,
        fontWeight: "600"
    },
    infoUserContainer: {
        justifyContent: "space-between",
        margin: 32
    },
    infoContainer: {
        alignItems: "center",
    },
    infoTitle: {
        color: "#4F566D",
        fontSize: 18,
        fontWeight: "300"
    },
    info: {
        color: "#929292",
        fontSize: 15,
        fontWeight: "500",
        marginTop: 4
    },
    button: {
        marginHorizontal: 30,
        backgroundColor: "#fe9801",
        borderRadius: 50,
        height: 52,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 16
    }
});
