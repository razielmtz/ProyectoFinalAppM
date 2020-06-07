import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, FlatList, TextInput, ScrollView} from 'react-native';
import {Icon} from 'native-base'
import moment from "moment";
import Fire from "../Fire";

export default class CommentsScreen extends React.Component{

    constructor(props){
        super(props);
        this.state = ({
            post: {},
            textComment: "",
            user: {}
        })
    }

    componentDidMount() {
        
        this.loadPost();

        const user = this.props.uid || Fire.shared.uid;

        this.unsubscribe = Fire.shared.firestore
            .collection("users")
            .doc(user)
            .onSnapshot(doc => {
                this.setState({ user: doc.data() });
            });
    }

    loadPost = () => {

        let post_id = this.props.navigation.getParam('post_id');

        let postData = {};

        var docRef = Fire.shared.firestore.collection("adoption_posts").doc(post_id);

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

    handlePostComment = () => {

        let postid = this.props.navigation.getParam('post_id');

        if(this.state.text != ""){

            Fire.shared
                .addPostAdoptionComment({
                             text: this.state.textComment.trim(),
                             post_id: postid, 
                             avatar: this.state.user.avatar,
                             username: this.state.user.name,
                             })
                .then(ref => {
                    this.setState({textComment: ""});
                    // this.props.navigation.goBack();
                    this.loadPost();
                })
                .catch(error => {
                    alert(error);
                });
        } else {
            console.log("Blank text introduced");
        }
    }

    renderComments = comment => {
        return(
            <View style={styles.commentItem}>
                <Image source={this.state.user.avatar
                                        ? { uri: this.state.user.avatar }
                                        : require("../assets/defaultImage.png")} style={styles.commentAvatar} />
                <View style={{ flex: 1}}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <View>
                                <Text style={styles.name}>{comment.username}</Text>
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

    render() {
        return (
            <View style = {styles.container}>
                <View style={styles.header}>
                <TouchableOpacity onPress = {() => this.props.navigation.goBack()} style = {styles.back}>
                        <Icon type = "Ionicons" name = "md-arrow-back" style = {{fontSize: 24, color: "#D8D9DB"}}/>
                    </TouchableOpacity>
                    <TouchableOpacity style = {styles.commentsRefresh} onPress = {this.loadPost}>
                        <Icon type = "Foundation" name = "refresh" style = {{fontSize: 24, color: "#D8D9DB"}}/>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.feed} showsVerticalScrollIndicator = {false}>
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
                            <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
                                <View style = {{width: "60%"}}>
                                    <Image source={{uri: this.state.post.image}} style={styles.postImage} resizeMode="cover" />
                                </View>
                                <View style = {{width: "40%", paddingLeft: 16}}>
                                    <View style = {styles.fieldContainer}>
                                        <Text style={styles.field}>Raza: </Text>
                                        <Text style={styles.fieldInfo}>{this.state.post.breed}</Text>
                                    </View>
                                    <View style = {styles.fieldContainer}>
                                        <Text style={styles.field}>Tamaño: </Text>
                                        <Text style={styles.fieldInfo}>{this.state.post.size}</Text>
                                    </View>
                                    <View style = {styles.fieldContainer}>
                                        <Text style={styles.field}>Color: </Text>
                                        <Text style={styles.fieldInfo}>{this.state.post.color}</Text>
                                    </View>
                                    <View style = {{flexDirection: "column", marginTop: 12}}>
                                        <Text style={styles.field}>Edad: </Text>
                                        <Text style={styles.fieldInfo}>{this.state.post.age}</Text>
                                    </View>
                                    <View style = {styles.fieldContainer}>
                                        <Text style={styles.field}>Ciudad: </Text>
                                        <Text style={styles.fieldInfo}>{this.state.post.city}</Text>
                                    </View>
                                    <View style = {styles.fieldContainer}>
                                        <Text style={styles.field}>Estado: </Text>
                                        <Text style={styles.fieldInfo}>{this.state.post.cState}</Text>
                                    </View>
                                    { this.state.post.telephone || this.state.post.email ?
                                    <View style = {{flexDirection: "column", marginTop: 12}}>
                                        <Text style={styles.contact}>Contacto </Text>
                                        {this.state.post.telephone ? <Text style={styles.contactInfo}>55 2421 6509</Text> : <Text></Text>}
                                        {this.state.post.email ? <Text style={styles.contactInfo}>unemail@gmail.com</Text> : <Text></Text>}
                                    </View> : <View></View>}
                                    
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-around", borderBottomWidth: StyleSheet.hairlineWidth, paddingBottom: 8 }}>
                                { this.state.post.additionalInfo ?
                                <View>
                                    <View style = {styles.additionalContainer}>
                                        <Text style={styles.field}>Información adicional: </Text>
                                        <Text style={styles.fieldInfo}>{this.state.post.additionalInfo}</Text>
                                    </View> 
                                </View>: <View></View>}
                            </View>
                            <View style = {styles.newCommentContainer}>
                                <TextInput
                                    // autoFocus = {true}
                                    multiline = {true}
                                    numberOfLines = {1}
                                    style = {styles.inputComment}
                                    placeholder = "Escribe un comentario..."
                                    onChangeText = {textComment => this.setState({textComment})}
                                    value = {this.state.textComment}
                                >
                                </TextInput>
                                <TouchableOpacity style = {styles.addCommentIcon} onPress = {this.handlePostComment}>
                                    <Icon 
                                    type="Ionicons" 
                                    name = "md-send"
                                    style = {{
                                            fontSize: 30, 
                                            color: "#5AB978",
                                            }}/>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                            style={styles.commentsFeed}
                            data={this.state.post.comments}
                            renderItem={({ item }) => this.renderComments(item)}
                            keyExtractor={(item, index) => index}
                            showsVerticalScrollIndicator={true}
                            ></FlatList>
                        </View>
                    </View>
                </ScrollView>
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
    },
    newCommentContainer: {
        paddingTop: 8,
        flexDirection: "row",
        borderBottomWidth: StyleSheet.hairlineWidth, 
        paddingBottom: 8 
    },
    inputComment: {
        flex: 1, 
        textAlignVertical: "top", 
        borderWidth: 1, 
        borderRadius: 10, 
        borderColor: "#BABABA",
        // marginTop: 12, 
        marginHorizontal: 8,
        width: "90%"
    },
    addCommentIcon: {
        width: "10%",
        justifyContent: "flex-end",
        alignItems: "center"
    },
    fieldContainer: {
        marginTop: 12,
        flexDirection: "row"
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
    },
    additionalContainer: {
        alignItems: "center",
        flexDirection: "column"
    }
});