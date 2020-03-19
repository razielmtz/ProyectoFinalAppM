import React from "react";
import { View, Text, StyleSheet, Button, Image, TouchableOpacity } from "react-native";
import Fire from "../Fire";

export default class ProfileScreen extends React.Component {

    state = {
        user: {}
    };

    unsubscribe = null;

    componentDidMount() {
        const user = this.props.uid || Fire.shared.uid;

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
                        <Text style={styles.info}>Esta es mi información</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoTitle}>3</Text>
                        <Text style={styles.info}>Publicaciones</Text>
                    </View>
                </View>


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
        fontSize: 16,
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
        justifyContent: "center"
    }
});
