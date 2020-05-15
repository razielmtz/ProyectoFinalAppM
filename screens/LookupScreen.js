import React from "react";
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from "react-native";
import {Icon} from 'native-base'
import moment from "moment";

// temporary data until we pull from Firebase
postsLookup = [
    {
        id: "1",
        name: "Raziel Martínez",
        text:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        timestamp: 1569109273726,
        avatar: require("../assets/raziel.jpeg"),
        image: require("../assets/bulldogPerdido.jpg"),
        raza: "Bulldog",
        tamano: "Mediano",
        color: "Café",
        edad: "Entre 3 y 5 años",
        ciudad: "Ciudad de México",
        estado: "Perdido",
        info: "Este perrito fue encontrado por el parque España, traía un collar azul."

    },
    {
        id: "2",
        name: "Karyn Kim",
        text:
            "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        timestamp: 1569109273726,
        avatar: require("../assets/tempAvatar.jpg"),
        image: require("../assets/labradorAdopcion.jpg"),
        raza: "Labrador",
        tamano: "Grande",
        color: "Miel",
        edad: "2 años",
        ciudad: "Ciudad de México",
        estado: "En adpoción",
        info: "Lamentablemente ya no podemos cuidar de él por lo que lo estamos dando en adopción."
    },
];

export default class LookupScreen extends React.Component {
    renderPost = post => {
        return (
            <View style={styles.feedItem}>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Image source={post.avatar} style={styles.avatar} />
                                <View>
                                    <Text style={styles.name}>{post.name}</Text>
                                    <Text style={styles.timestamp}>{moment(post.timestamp).fromNow()}</Text>
                                </View>
                            </View>
                        </View>
                        <Icon type = "Ionicons" name = "ios-more" style = {{fontSize: 24, color: "#73788B"}}/>
                    </View>
                    <View  style={{ flexDirection: "row", justifyContent: "space-between"}}>
                        <View style = {{width: "60%"}}>
                            <Image source={post.image} style={styles.postImage} resizeMode="cover" />
                        </View>
                        <View style = {{width: "40%", paddingLeft: 16}}>
                            <Text style={styles.post}>Raza: {post.raza}</Text>
                            <Text style={styles.post}>Tamaño {post.tamano}</Text>
                            <Text style={styles.post}>Color: {post.color}</Text>
                            <Text style={styles.post}>Edad: {post.edad}</Text>
                            <Text style={styles.post}>Ciudad: {post.ciudad}</Text>
                            <Text style={styles.post}>Estado: {post.estado}</Text>
                            <Text style={styles.post}>Información adicional: {post.info}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <Icon type = "Ionicons" name = "ios-heart-empty" style = {{fontSize: 24, color: "#73788B", marginRight: 16}}/>
                        <Icon type = "Ionicons" name = "ios-chatboxes" style = {{fontSize: 24, color: "#73788B"}}/>
                    </View>
                </View>
            </View>
        );
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Adoptar</Text>
                    <TouchableOpacity style = {styles.screenRefresh}>
                        <Icon type = "Foundation" name = "refresh" style = {{fontSize: 24, color: "#D8D9DB"}}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.postContainer}>
                    <TouchableOpacity>
                    <Icon 
                    type="Ionicons" 
                    name = "ios-add-circle"
                    style = {{
                            fontSize: 32, 
                            color: "#ccda46",
                            }}/>
                    </TouchableOpacity>
                </View>

                <FlatList
                    style={styles.feed}
                    data={postsLookup}
                    renderItem={({ item }) => this.renderPost(item)}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                ></FlatList>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#D7F6B8"
    },
    header: {
        paddingTop: 20,
        paddingBottom: 10,
        backgroundColor: "#FFF",
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#EBECF4",
        shadowColor: "#454D65",
        shadowOffset: { height: 5 },
        shadowRadius: 15,
        shadowOpacity: 0.2,
        zIndex: 10
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "500"
    },
    feed: {
        marginHorizontal: 16
    },
    feedItem: {
        backgroundColor: "#FFF",
        borderRadius: 5,
        padding: 8,
        flexDirection: "row",
        marginVertical: 8
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 16
    },
    name: {
        fontSize: 15,
        fontWeight: "500",
        color: "#454D65"
    },
    timestamp: {
        fontSize: 11,
        color: "#C4C6CE",
        marginTop: 2
    },
    post: {
        marginTop: 16,
        fontSize: 14,
        color: "#838899"
    },
    postImage: {
        width: undefined,
        height: 300,
        borderRadius: 5,
        marginVertical: 16
    },
    postContainer: {
        paddingTop: 3,
        paddingBottom: 3,
        backgroundColor: "#FFF",
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#EBECF4",
        shadowColor: "#454D65",
        shadowOffset: { height: 5 },
        shadowRadius: 15,
        shadowOpacity: 0.2,
        zIndex: 10, 
        flexDirection: "row"
    },
    screenRefresh: {
        top: 20,
        position: "absolute",
        right: 24,
        width: 32,
        height: 32,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderRadius: 50,
        borderColor: "#D8D9DB"
    }
});
