import firebase from "firebase";
const admin = require('firebase-admin');

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Others
// const firebaseConfig = {
//     apiKey: "AIzaSyAeMCeWGXbAbOcarxyb8axYInOpCb_QDBE",
//     authDomain: "clone-d3b4c.firebaseapp.com",
//     projectId: "clone-d3b4c",
//     storageBucket: "clone-d3b4c.appspot.com",
//     messagingSenderId: "790215742220",
//     appId: "1:790215742220:web:dd8c93416c9350f3e5ef29",
//     measurementId: "G-97PWER1T35"
//   };
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
  
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth_state = firebase.auth.Auth.Persistence.SESSION;
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export function getUserDetails() {
    return firebaseApp.auth().currentUser.toJSON();
}

export {db,auth,provider,auth_state};

/* DB Structure:
    emails: By ids. Each have subject: text, message:image with enc data, time: timestamp, from: Sender emailid, to reviecer emailid. 
    users: by ids: emails: all the mails of this user, sharedKeys: email-sharedkey.
*/

/*title={to}
                        subject={subject}
                        description={message}
                        time={new Date(timestamp?.seconds * 1000).toUTCString()}*/