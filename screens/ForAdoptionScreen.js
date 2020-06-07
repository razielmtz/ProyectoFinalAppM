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
            comments: []
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
                    let tempData= docE.data();
                    tempData.post_id = docE.id;
                    tempPosts.push(tempData)
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

    handleComments = (post) => {
        this.props.navigation.navigate("PostAdoptionComments", {post_id: post.post_id});
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
                            <View style = {styles.fieldContainer}>
                                <Text style={styles.field}>Raza: </Text>
                                <Text style={styles.fieldInfo}>{post.breed}</Text>
                            </View>
                            <View style = {styles.fieldContainer}>
                                <Text style={styles.field}>Tamaño: </Text>
                                <Text style={styles.fieldInfo}>{post.size}</Text>
                            </View>
                            <View style = {styles.fieldContainer}>
                                <Text style={styles.field}>Color: </Text>
                                <Text style={styles.fieldInfo}>{post.color}</Text>
                            </View>
                            <View style = {{flexDirection: "column", marginTop: 12}}>
                                <Text style={styles.field}>Edad: </Text>
                                <Text style={styles.fieldInfo}>{post.age}</Text>
                            </View>
                            <View style = {styles.fieldContainer}>
                                <Text style={styles.field}>Ciudad: </Text>
                                <Text style={styles.fieldInfo}>{post.city}</Text>
                            </View>
                            <View style = {styles.fieldContainer}>
                                <Text style={styles.field}>Estado: </Text>
                                <Text style={styles.fieldInfo}>{post.cState}</Text>
                            </View>
                            { post.telephone || post.email ?
                            <View style = {{flexDirection: "column", marginTop: 12}}>
                                <Text style={styles.contact}>Contacto </Text>
                                {post.telephone ? <Text style={styles.contactInfo}>55 2421 6509</Text> : <Text></Text>}
                                {post.email ? <Text style={styles.contactInfo}>unemail@gmail.com</Text> : <Text></Text>}
                            </View> : <View></View>}
                            {/* <Text style={styles.post}>Información adicional: {post.additionalInfo}</Text> */}
                        </View>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <Icon type = "Ionicons" name = "ios-heart-empty" style = {{fontSize: 24, color: "#73788B", marginRight: 16}}/>
                        <TouchableOpacity onPress = {() => this.handleComments(post)}>
                            <Icon type = "Ionicons" name = "ios-chatboxes" style = {{fontSize: 24, color: "#73788B"}}/>
                        </TouchableOpacity>
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
    fieldContainer: {
        marginTop: 12,
        flexDirection: "row"
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
    },
    contact: {
        marginTop: 12,
        fontSize: 15,
        color: "#73B8D8",
        fontWeight: "700"
    },
    contactInfo: {
        fontSize: 14,
        color: "#73B8D8",
    },
    field: {
        fontSize: 15,
        color: "#838899",
        fontWeight: "700"
    },
    fieldInfo: {
        fontSize: 15,
        color: "#838899",
    }
});
