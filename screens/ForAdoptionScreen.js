import React from "react";
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from "react-native";
import {Icon} from 'native-base'
import moment from "moment";
import Fire from "../Fire";

export default class ForAdoptionScreen extends React.Component {

    constructor(props){
        super(props);
        this.state = ({
            posts: [],
            // comments: []
        })
    }

    componentDidMount() { 
        this.loadPosts();
    }

    loadPosts = () => {
        const tempPosts = [];
    
        Fire.shared.firestore
            .collection("adoption_posts")
            .get()
            .then( snapshot => {
                snapshot.forEach(docE => {
                    tempPosts.push(docE.data())
                });

                tempPosts.forEach(element => {
                    Fire.shared.firestore
                        .collection("users")
                        .doc(element.uid)
                        .get()
                        .then(doc => { 
                            element['avatar'] = doc.data().avatar;
                            element['name'] = doc.data().name;
                            this.setState({ 
                                posts: tempPosts
                            });
                        });               
                });
            }); 
    }

    renderPost = post => {
        return (
            <View style={styles.feedItem}>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Image source={{uri: post.avatar}} style={styles.avatar} />
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
                            <Image source={{uri: post.image}} style={styles.postImage} resizeMode="cover" />
                        </View>
                        <View style = {{width: "40%", paddingLeft: 16}}>
                            <Text style={styles.post}>Raza: {post.breed}</Text>
                            <Text style={styles.post}>Tamaño {post.size}</Text>
                            <Text style={styles.post}>Color: {post.color}</Text>
                            <Text style={styles.post}>Edad: {post.age}</Text>
                            <Text style={styles.post}>Ciudad: {post.city}</Text>
                            <Text style={styles.post}>Estado: {post.cState}</Text>
                            <Text style={styles.post}>Información adicional: {post.additionalInfo}</Text>
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
                    <TouchableOpacity onPress = {this.loadPosts} style = {styles.screenRefresh}>
                        <Icon type = "Foundation" name = "refresh" style = {{fontSize: 24, color: "#D8D9DB"}}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.postContainer}>
                    <TouchableOpacity onPress = {() => this.props.navigation.navigate("PostAdoption")}>
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
                    data={this.state.posts.sort((a, b) => {
                        return b.timestamp - a.timestamp;
                      })}
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
