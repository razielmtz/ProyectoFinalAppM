import React from "react";
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from "react-native";
import {Icon} from 'native-base'
import moment from "moment";
import Fire from "../Fire";
import { ThemeColors } from "react-navigation";

// temporary data until we pull from Firebase
posts = [
    {
        id: "1",
        name: "Joe McKay",
        text:
            "Este es un post.",
        timestamp: 1584395010238,
        avatar: require("../assets/tempAvatar.jpg"),
        image: require("../assets/tempImage1.jpg"),
        comments: {
                data: [
                {
                    id: "800",
                    user_id: "Joe McKay",
                    text:
                        "Este es un comentario.",
                    timestamp: 1584395010239,
                    avatar: require("../assets/tempAvatar.jpg"),
                },
                {
                    id: "900",
                    user_id: "Karyn Kim",
                    text:
                        "Este es otro comentario.",
                    timestamp: 1569109273727,
                    avatar: require("../assets/tempAvatar.jpg"),
                }
                ], 
            show: false
        }
    },
    {
        id: "2",
        name: "Karyn Kim",
        text:
            "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        timestamp: 1569109273726,
        avatar: require("../assets/tempAvatar.jpg"),
        image: require("../assets/tempImage2.jpg")
    }
];

comments = [
    {
        id: "800",
        user_id: "Eduardo",
        text:
            "Este es un comentarioooo.",
        timestamp: 1584395010239,
        avatar: require("../assets/tempAvatar2.jpg"),
    },
    {
        id: "900",
        user_id: "Marco",
        text:
            "Este es otro comentario.",
        timestamp: 1569109273727,
        avatar: require("../assets/tempAvatar.jpg"),
    }
]

export default class HomeScreen extends React.Component {

    constructor(props){
        super(props);
        this.state = ({
            posts: [],
            comments: [],
            likedPosts: []
        })
    }

    componentDidMount() { 
        this.loadPosts();
    }

    loadPosts = () => {
        const tempPosts = [];
        const likedPosts = [];
        const user_id = Fire.shared.uid;
    
        Fire.shared.firestore
            .collection("posts")
            .get()
            .then( snapshot => {
                snapshot.forEach(docE => {
                    let tempData= docE.data();
                    tempData.post_id = docE.id;
                    tempPosts.push(tempData);
                });

                tempPosts.forEach(element => {
                    Fire.shared.firestore
                        .collection("users")
                        .doc(element.uid)
                        .get()
                        .then(doc => { 
                            element['avatar'] = doc.data().avatar;
                            element['name'] = doc.data().name;
                            if(element.likes.includes(user_id)){
                                likedPosts.push(element.post_id);
                            }
                            this.setState({ 
                                posts: tempPosts,
                                likedPosts
                            });
                        });               
                });
            }); 
    }

    handleComments = (post) => {
        this.props.navigation.navigate("PostComments", {post_id: post.post_id});
    }

    handleLike = (post) => {

        const user_id = Fire.shared.uid;
        const tempLikedPosts = this.state.likedPosts;

        Fire.shared
                .handlePostLikes({
                             post,
                             user_id
                             })
                .then(ref => {
                    this.setState({textComment: ""});
                    this.props.navigation.goBack();
                    if(this.state.likedPosts.includes(post.post_id)){
                        const index = tempLikedPosts.indexOf(post.post_id);
                        if (index > -1) {
                            tempLikedPosts.splice(index, 1);
                        }
                    }else {
                        tempLikedPosts.push(post.post_id);
                    }
                    this.setState({likedPosts: tempLikedPosts});
                    // this.loadPosts();
                    console.log("Handled Like successfully");
                })
                .catch(error => {
                    alert(error);
                });

    }  

    renderComments = comment => {
        return(
            <View style={styles.feedItem}>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Image source={comment.avatar} style={styles.avatar} />
                            <View>
                                <Text style={styles.name}>{comment.user_id}</Text>
                                <Text style={styles.timestamp}>{moment(comment.timestamp).fromNow()}</Text>
                            </View>
                        </View>
                        <Icon type = "Ionicons" name = "ios-more" style = {{fontSize: 24, color: "#73788B"}}/>
                    </View>
                    <Text style={styles.post}>{comment.text}</Text>
                    <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity>
                            <Icon type = "Ionicons" name = "ios-heart-empty" style = {{fontSize: 24, color: "#73788B", marginRight: 16}}/>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Icon type = "Ionicons" name = "ios-chatboxes" style = {{fontSize: 24, color: "#73788B"}}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    renderPost = post => {
        console.log(post.likes);
        return (
            <View style={styles.feedItem}>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Image source={{uri: post.avatar}} style={styles.avatar} />
                            <View>
                                <Text style={styles.name}>{post.name}</Text>
                                <Text style={styles.timestamp}>{moment(post.timestamp).fromNow()}</Text>
                            </View>
                        </View>
                        <Icon type = "Ionicons" name = "ios-more" style = {{fontSize: 24, color: "#73788B"}}/>
                    </View>
                    <Text style={styles.post}>{post.text}</Text>
                    <Image source={{uri: post.image}} style={styles.postImage} resizeMode="cover" />
                    <View style={{ flexDirection: "row"}}>
                        <View style = {{flexDirection: "row", alignItems: "center", width: "50%"}}>
                            <View style = {{justifyContent: "center", alignItems: "flex-end", width: "50%"}}>
                                {this.state.likedPosts.includes(post.post_id) ? 
                                <TouchableOpacity onPress = {() => this.handleLike(post)}>
                                    <Icon type = "Ionicons" name = "ios-heart" style = {{fontSize: 24, color: "#DA5148", marginRight: 16}}/>
                                </TouchableOpacity> :
                                <TouchableOpacity onPress = {() => this.handleLike(post)}>
                                    <Icon type = "Ionicons" name = "ios-heart-empty" style = {{fontSize: 24, color: "#73788B", marginRight: 16}}/>
                                </TouchableOpacity>}
                            </View>
                            <View style = {{justifyContent: "center", alignItems: "flex-start", width: "50%"}}>
                                {(post.likes !== undefined) ?
                                    this.state.likedPosts.includes(post.post_id) ?
                                        post.likes.length > 1 ? 
                                            <Text style = {{fontSize: 17, fontWeight: "700"}}>Tú + {post.likes.length - 1}</Text>
                                            :<Text style = {{fontSize: 17, fontWeight: "700"}}>Te gusta</Text>
                                        :post.likes.length > 0 ? 
                                            <Text style = {{fontSize: 17, fontWeight: "700"}}>{post.likes.length}</Text>
                                            :<Text style = {{fontSize: 17, fontWeight: "700"}}></Text>
                                    :<Text style = {{fontSize: 17, fontWeight: "700"}}></Text> 
                                }
                            </View>
                        </View>
                        <View style = {{flexDirection: "row", justifyContent: "center", alignItems: "center", width: "50%"}}>
                            <TouchableOpacity onPress = {() => this.handleComments(post)}>
                                <Icon type = "Ionicons" name = "ios-chatboxes" style = {{fontSize: 24, color: "#73788B"}}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Eventos</Text>
                    <TouchableOpacity onPress = {this.loadPosts} style = {styles.screenRefresh}>
                        <Icon type = "Foundation" name = "refresh" style = {{fontSize: 24, color: "#D8D9DB"}}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.postContainer}>
                    <TouchableOpacity onPress = {() => this.props.navigation.navigate("PostEvent")}>
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
                    extraData={this.state}
                    data={this.state.posts.sort((a, b) => {
                        return b.timestamp - a.timestamp;
                      })}
                    renderItem={({ item }) => this.renderPost(item)}
                    keyExtractor={(item, index) => index}
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
        zIndex: 10, 
        flexDirection: "row"
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "500"
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
        marginRight: 8
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
    postImage: {
        width: undefined,
        height: 150,
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
    }
});
