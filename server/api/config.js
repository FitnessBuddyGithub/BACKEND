// import Firebase from 'firebase';
// var firebaseConfig = {
//   apiKey: "AIzaSyAor4JPitQgMqNW0ys87T-vOv6lYNUNkNg",
//   authDomain: "fitness-buddy-57f3f.firebaseapp.com",
//   databaseURL: "https://fitness-buddy-57f3f.firebaseio.com",
//   projectId: "fitness-buddy-57f3f",
//   storageBucket: "fitness-buddy-57f3f.appspot.com",
//   messagingSenderId: "225211913391",
//   appId: "1:225211913391:web:bd40fed691c2b4f3c6b05a",
//   measurementId: "G-JL9MLS3MGE"
// };
// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// firebase.analytics();
import firebase from 'firebase'

class FirebaseSDK {
  constructor() {
    if (!firebase.apps.length) {
      //avoid re-initializing
      firebase.initializeApp({
        apiKey: 'AIzaSyAor4JPitQgMqNW0ys87T-vOv6lYNUNkNg',
        authDomain: 'fitness-buddy-57f3f.firebaseapp.com',
        databaseURL: 'https://fitness-buddy-57f3f.firebaseio.com',
        projectId: 'fitness-buddy-57f3f',
        storageBucket: 'fitness-buddy-57f3f.appspot.com',
        messagingSenderId: '225211913391'
      })
    }
  }
  login = async (user, success_callback, failed_callback) => {
    await firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then(success_callback, failed_callback)
  }
}
const firebaseSDK = new FirebaseSDK()
export default firebaseSDK
