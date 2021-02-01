const firebase = require('firebase')

class FirebaseSvc {
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
  // login = async (user, success_callback, failed_callback) => {
  //   await firebase
  //     .auth()
  //     .signInWithEmailAndPassword(user.email, user.password)
  //     .then(success_callback, failed_callback);
  // };
  auth = () => firebase.auth()
  signInWithEmailAndPassword = (email, password) =>
    firebase.signInWithEmailAndPassword(email, password)
  signOut = () => firebase.signOut()
  get ref() {
    return firebase.database().ref('Messages')
  }

  parse = snapshot => {
    const {timestamp: numberStamp, text, user} = snapshot.val()
    const {key: id} = snapshot
    const {key: _id} = snapshot //needed for giftedchat
    const timestamp = new Date(numberStamp)

    const message = {
      id,
      _id,
      timestamp,
      text,
      user
    }
    return message
  }

  refOn = callback => {
    this.ref
      .limitToLast(20)
      .on('child_added', snapshot => callback(this.parse(snapshot)))
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP
  }

  // send the message to the Backend
  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const {text, user} = messages[i]
      const message = {
        text,
        user,
        createdAt: this.timestamp
      }
      this.ref.push(message)
    }
  }

  refOff() {
    this.ref.off()
  }
}
const firebaseSvc = new FirebaseSvc()
module.export = firebaseSvc
