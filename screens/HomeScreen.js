import React from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import {Icon} from 'native-base'
import moment from "moment";
import Fire from "../Fire";

// temporary data until we pull from Firebase
// posts = [
//     {
//         id: "1",
//         name: "Joe McKay",
//         text:
//             "Este es un post.",
//         timestamp: 1584395010238,
//         avatar: require("../assets/tempAvatar.jpg"),
//         image: require("../assets/tempImage1.jpg")
//     },
//     {
//         id: "2",
//         name: "Karyn Kim",
//         text:
//             "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//         timestamp: 1569109273726,
//         avatar: require("../assets/tempAvatar.jpg"),
//         image: require("../assets/tempImage2.jpg")
//     },
//     {
//         id: "3",
//         name: "Emerson Parsons",
//         text:
//             "Amet mattis vulputate enim nulla aliquet porttitor lacus luctus. Vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant.",
//         timestamp: 1569109273726,
//         avatar: require("../assets/tempAvatar.jpg"),
//         image: require("../assets/tempImage3.jpg")
//     },
//     {
//         id: "4",
//         name: "Kathie Malone",
//         text:
//             "At varius vel pharetra vel turpis nunc eget lorem. Lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor. Adipiscing tristique risus nec feugiat in fermentum.",
//         timestamp: 1569109273726,
//         avatar: require("../assets/tempAvatar.jpg"),
//         image: require("../assets/tempImage4.jpg")
//     }
// ];

export default class HomeScreen extends React.Component {

    constructor(props){
        super(props);
        this.state = ({
            posts: [],
        })
    }

    componentDidMount() { 
        const tempPosts = [];
    
        Fire.shared.firestore
            .collection("posts")
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
                            console.log(element);
                            this.setState({ 
                                posts: tempPosts
                            });
                        });
                });   
            });   
    }

    // componentDidMount() { 

    //     const tempPosts = []
    
    //     Fire.shared.firestore
    //         .collection("posts")
    //         .get()
    //         .then( snapshot => {
    //             snapshot.forEach(docE => {
    //                 tempPosts.push(docE.data())
    //             });

    //             this.setState({ 
    //                 posts: tempPosts
    //             });
    //         });
    // }

    renderPost2 = post => {
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
                    <View style={{ flexDirection: "row" }}>
                        <Icon type = "Ionicons" name = "ios-heart-empty" style = {{fontSize: 24, color: "#73788B", marginRight: 16}}/>
                        <Icon type = "Ionicons" name = "ios-chatboxes" style = {{fontSize: 24, color: "#73788B"}}/>
                    </View>
                </View>
            </View>
        );
    }

    // renderPost = post => {
    //     return (
    //         <View style={styles.feedItem}>
    //             <Image source={post.avatar} style={styles.avatar} />
    //             <View style={{ flex: 1 }}>
    //                 <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
    //                     <View>
    //                         <Text style={styles.name}>{post.name}</Text>
    //                         <Text style={styles.timestamp}>{moment(post.timestamp).fromNow()}</Text>
    //                     </View>

    //                     <Icon type = "Ionicons" name = "ios-more" style = {{fontSize: 24, color: "#73788B"}}/>
    //                 </View>
    //                 <Text style={styles.post}>{post.text}</Text>
    //                 <Image source={post.image} style={styles.postImage} resizeMode="cover" />
    //                 <View style={{ flexDirection: "row" }}>
    //                     <Icon type = "Ionicons" name = "ios-heart-empty" style = {{fontSize: 24, color: "#73788B", marginRight: 16}}/>
    //                     <Icon type = "Ionicons" name = "ios-chatboxes" style = {{fontSize: 24, color: "#73788B"}}/>
    //                 </View>
    //             </View>
    //         </View>
    //     );
    // };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Feed</Text>
                </View>

                <FlatList
                    style={styles.feed}
                    data={this.state.posts}
                    renderItem={({ item }) => this.renderPost2(item)}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                ></FlatList>
            </View>
        );
    }
}

// render() {
//     return (
//         <View style={styles.container}>
//             <View style={styles.header}>
//                 <Text style={styles.headerTitle}>Feed</Text>
//             </View>

//             <FlatList
//                 style={styles.feed}
//                 data={this.state.posts}
//                 renderItem={({ item}) => {
//                 return(
//                     <Text>
//                         {item.avatar}
//                     </Text>);
//                 }}
//                 keyExtractor={item => item.timestamp}
//                 showsVerticalScrollIndicator={false}
//             ></FlatList>
//         </View>
//     );
// }
// }

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
    }
});
