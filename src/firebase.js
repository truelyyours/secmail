import firebase from "firebase";

// Mine
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBlPJSImAlsz1tHDuFy4Wj5gmcG5MzYU8M",
    authDomain: "secmail-1797e.firebaseapp.com",
    databaseURL: "https://secmail-1797e-default-rtdb.firebaseio.com",
    projectId: "secmail-1797e",
    storageBucket: "secmail-1797e.appspot.com",
    messagingSenderId: "399113846440",
    appId: "1:399113846440:web:528e83fbd47ef7bc30cc9d",
    measurementId: "G-RV3LNRRNWR"
};
// admin.initializeApp(firebaseConfig);
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth_state = firebase.auth.Auth.Persistence.SESSION;
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebaseApp.storage();

export function getUserDetails() {
    return firebaseApp.auth().currentUser.toJSON();
}

export {db,auth,provider,auth_state, storage};

/* DB Structure:
    email-id's: to whom mail hase been sent or recieved.
        -> shared-key between current and this user
    mydata: the data of this user, pub and priv key
    inbox: the inbox of current user
        -> all => collection of all the mails current user recieved
    sent: the sentbox of current user
        -> sentsent => collection of all the mails the current user has sent
    */

// #TODO: Change this if you get time!!
/*title={to}
                        subject={subject}
                        description={message}
                        time={new Date(timestamp?.seconds * 1000).toUTCString()}*/