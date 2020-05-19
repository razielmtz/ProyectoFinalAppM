import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, FlatList, TextInput} from 'react-native';
import {Icon} from 'native-base'
import moment from "moment";
import Fire from "../Fire";

posts2 = [
    {
        id: "1",
        name: "Joe McKay",
        text:
            "Este es un post.",
        timestamp: 1584395010238,
        avatar: require("../assets/tempAvatar.jpg"),
        image: require("../assets/tempImage4.jpg"),
        comments: {
                data: [
                {
                    id: "", //id de publicacion
                    user_id: "Marco",
                    text:
                        "Este es un comentarioooo.",
                    timestamp: 1584395010239,
                    avatar: require("../assets/tempAvatar.jpg"),
                },
                {
                    id: "900",
                    user_id: "Eduardo",
                    text:
                        "Este es otro comentario.",
                    timestamp: 1569109273727,
                    avatar: require("../assets/defaultImage.png"),
                }
                ], 
            show: false
        }
    },
];

export default class CommentsScreen extends React.Component{

    constructor(props){
        super(props);
        this.state = ({
            post: {},
            // comments: []
        })
    }

    componentDidMount() {
        let post_id = this.props.navigation.getParam('post_id');
        console.log('THE received post is:  ', post_id); 
        this.loadPost(post_id);
    }

    loadPost = post_id => {

        let postData = {};

        var docRef = Fire.shared.firestore.collection("posts").doc(post_id);

        docRef.get().then(doc => {
            if (doc.exists) {
                postData = doc.data();
                console.log("Document data:", postData);

                Fire.shared.firestore
                        .collection("users")
                        .doc(postData.uid)
                        .get()
                        .then(doc => { 
                            postData['avatar'] = doc.data().avatar;
                            postData['name'] = doc.data().name;
                            this.setState({ 
                                post: postData
                            });
                        }); 
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    }

    renderComments = comment => {
        return(
            <View style={styles.commentItem}>
                <Image source={comment.avatar} style={styles.commentAvatar} />
                <View style={{ flex: 1}}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <View>
                                <Text style={styles.name}>{comment.user_id}</Text>
                            </View>
                        </View>
                        <Icon type = "Ionicons" name = "ios-more" style = {{fontSize: 24, color: "#73788B"}}/>
                    </View>
                    <Text style={styles.comment}>{comment.text}</Text>
                    <View style={styles.commentsUtilities}>
                        <Text style={styles.timestamp}>{moment(comment.timestamp).fromNow()}</Text>
                        <View style = {{flexDirection: "row"}}>
                            <TouchableOpacity>
                                <Icon type = "Ionicons" name = "ios-heart-empty" style = {{fontSize: 20, color: "#73788B", marginRight: 12}}/>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Icon type = "Ionicons" name = "ios-chatboxes" style = {{fontSize: 20, color: "#73788B"}}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    renderPost = post => {
        return (
            <View style={styles.feedItem}>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Image source={{uri: this.state.post.avatar}} style={styles.avatar} />
                            <View>
                                <Text style={styles.name}>{this.state.post.name}</Text>
                                <Text style={styles.timestamp}>{moment(this.state.post.timestamp).fromNow()}</Text>
                            </View>
                        </View>
                        <Icon type = "Ionicons" name = "ios-more" style = {{fontSize: 24, color: "#73788B"}}/>
                    </View>
                    <Text style={styles.post}>{this.state.post.text}</Text>
                    <Image source={{uri: this.state.post.image}} style={styles.postImage} resizeMode="cover" />
                    <View style={{ flexDirection: "row", justifyContent: "space-around", borderBottomWidth: StyleSheet.hairlineWidth, paddingBottom: 8 }}>
                        <TouchableOpacity>
                            <Icon type = "Ionicons" name = "ios-heart-empty" style = {{fontSize: 24, color: "#73788B", marginRight: 16}}/>
                        </TouchableOpacity>
                        <TouchableOpacity >
                            <Icon type = "Ionicons" name = "ios-chatboxes" style = {{fontSize: 24, color: "#73788B"}}/>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                    style={styles.commentsFeed}
                    data={comments}
                    renderItem={({ item }) => this.renderComments(item)}
                    keyExtractor={(item, index) => index}
                    showsVerticalScrollIndicator={false}
                    ></FlatList>
                    <View>
                        <TextInput
                            // autoFocus = {true}
                            multiline = {true}
                            numberOfLines = {2}
                            style = {{ flex: 1, textAlignVertical: "top", borderWidth: StyleSheet.hairlineWidth, borderRadius: 10, marginTop: 12, marginHorizontal: 12 }}
                            placeholder = "Escribe un comentariooo..."
                            // onChangeText = {text => this.setState({text})}
                            value = {this.state.text}
                        >
                        </TextInput>
                    </View>
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style = {styles.container}>
                <View style={styles.header}>
                <TouchableOpacity onPress = {() => this.props.navigation.goBack()} style = {styles.back}>
                        <Icon type = "Ionicons" name = "md-arrow-back" style = {{fontSize: 24, color: "#D8D9DB"}}/>
                    </TouchableOpacity>
                    <TouchableOpacity style = {styles.commentsRefresh}>
                        <Icon type = "Foundation" name = "refresh" style = {{fontSize: 24, color: "#D8D9DB"}}/>
                    </TouchableOpacity>
                </View>

                <FlatList
                    style={styles.feed}
                    data={posts2.sort((a, b) => {
                        return b.timestamp - a.timestamp;
                      })}
                    renderItem={({ item }) => this.renderPost(item)}
                    keyExtractor={(item, index) => index}
                    showsVerticalScrollIndicator={false}
                ></FlatList>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#D7F6B8"
    },
    header: {
        paddingTop: 20,
        paddingBottom: 40,
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
    back: {
        top: 20,
        position: "absolute",
        left: 24,
        width: 32,
        height: 32,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderRadius: 50,
        borderColor: "#D8D9DB"
    },
    commentsRefresh: {
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
    feed: {
        marginHorizontal: 12
    },
    commentsFeed: {
        marginHorizontal: 12,
        marginTop: 8
    },
    feedItem: {
        backgroundColor: "#FFF",
        borderRadius: 5,
        padding: 8,
        flexDirection: "row",
        marginVertical: 8
    },
    commentItem: {
        backgroundColor: "#F4F5F5",
        borderRadius: 10,
        padding: 8,
        flexDirection: "row",
        marginVertical: 4,
        borderColor: "#F0F0F0"
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 8
    },
    commentAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 4
    },
    name: {
        fontSize: 15,
        fontWeight: "500",
        color: "#454D65"
    },
    timestamp: {
        fontSize: 11,
        color: "#C4C6CE",
        marginTop: 4
    },
    post: {
        marginTop: 16,
        fontSize: 14,
        color: "#838899"
    },
    comment: {
        marginTop: 8,
        fontSize: 14,
        color: "#838899"
    },
    postImage: {
        width: undefined,
        height: 300,
        borderRadius: 5,
        marginVertical: 16
    }, 
    commentsUtilities: {
        flexDirection: "row",
        justifyContent: "space-between"
    }
});