import FirebaseKeys from "./config";
import firebase from "firebase";
require("firebase/firestore")

class Fire {
    constructor() {
        firebase.initializeApp(FirebaseKeys);
    }

    addPost = async ({ text, localUri }) => {
        const remoteUri = await this.uploadPhotoAsync(localUri, `photos/${this.uid}/${Date.now()}`);

        return new Promise((res, rej) => {
            this.firestore
                .collection("posts")
                .add({
                    text,
                    uid: this.uid,
                    timestamp: this.timestamp,
                    image: remoteUri
                })
                .then(ref => {
                    res(ref);
                })
                .catch(error => {
                    rej(error);
                });
        });
    };

    addAdoptionPost = async ({ breed, size, color, age, city, cState, additionalInfo, telephone, email, localUri }) => {
        const remoteUri = await this.uploadPhotoAsync(localUri, `photos/${this.uid}/${Date.now()}`);

        return new Promise((res, rej) => {
            this.firestore
                .collection("adoption_posts")
                .add({
                    breed, size, color, age, city, cState, additionalInfo, telephone, email,
                    uid: this.uid,
                    timestamp: this.timestamp,
                    image: remoteUri
                })
                .then(ref => {
                    res(ref);
                })
                .catch(error => {
                    rej(error);
                });
        });
    };

    addPostComment = async ({ text, post_id, avatar, username }) => {


        const newComment = { 
                             text,
                             uid: this.uid,
                             timestamp: this.timestamp,
                             avatar,
                             username
                            };

        return new Promise((res, rej) => {
            
            this.firestore
                .collection("posts").doc(post_id)
                .update({
                    comments: firebase.firestore.FieldValue.arrayUnion(newComment)
                })
                .then(ref => {
                    res(ref);
                })
                .catch(error => {
                    rej(error);
                });
        });
    };

    addPostAdoptionComment = async ({ text, post_id, avatar, username }) => {
        const newComment = { 
                             text,
                             uid: this.uid,
                             timestamp: this.timestamp,
                             avatar,
                             username
                            };

        return new Promise((res, rej) => {
            
            this.firestore
                .collection("adoption_posts").doc(post_id)
                .update({
                    comments: firebase.firestore.FieldValue.arrayUnion(newComment)
                })
                .then(ref => {
                    res(ref);
                })
                .catch(error => {
                    rej(error);
                });
        });
    };

    handlePostLikes = async ({ post, user_id }) => {
        
        let post_likes;

        if(post.likes){
            post_likes = post.likes;
        } else {
            post_likes = [];
        }

        if(post_likes.includes(user_id)){

            const index = post_likes.indexOf(user_id);
            if (index > -1) {
                post_likes.splice(index, 1);
            }
            console.log("Eliminado ",post_likes)

        } else {
            post_likes.push(user_id);
            console.log("Agregado ", post_likes);
        }

        return new Promise((res, rej) => {
            
            this.firestore
                .collection("posts").doc(post.post_id)
                .update({
                    likes: post_likes
                })
                .then(ref => {
                    res(ref);
                })
                .catch(error => {
                    rej(error);
                });
        });
    };

    updateUser = async ({ user_id, name, information }) => {

        return new Promise((res, rej) => {
            
            this.firestore
                .collection("users").doc(user_id)
                .update({
                    name,
                    information
                })
                .then(ref => {
                    res(ref);
                })
                .catch(error => {
                    rej(error);
                });
        });
    };

    uploadPhotoAsync = async (uri, filename) => {
        return new Promise(async (res, rej) => {
            const response = await fetch(uri);
            const file = await response.blob();

            let upload = firebase
                .storage()
                .ref(filename)
                .put(file);

            upload.on(
                "state_changed",
                snapshot => {},
                err => {
                    rej(err);
                },
                async () => {
                    const url = await upload.snapshot.ref.getDownloadURL();
                    res(url);
                }
            );
        });
    };

    createUser = async user => {
        let remoteUri = null

        try {
            await firebase.auth().createUserWithEmailAndPassword(user.email, user.password)

            let db = this.firestore.collection("users").doc(this.uid)

            db.set({
                name: user.name,
                email: user.email,
                avatar: null
            })

            if(user.avatar) {
                remoteUri = await this.uploadPhotoAsync(user.avatar, `avatars/${this.uid}`)

                db.set({avatar: remoteUri}, {merge:true})
            }
        } catch (error) {
            alert("Los campos no han sido llenados correctamente ", error)
        }
    }

    signOut = () => {
        firebase.auth().signOut();
    }
    
    get firestore() {
        return firebase.firestore();
    }

    get uid() {
        return (firebase.auth().currentUser || {}).uid;
    }

    get timestamp() {
        return Date.now();
    }
}

Fire.shared = new Fire();
export default Fire;
