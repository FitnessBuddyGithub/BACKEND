var admin = require('firebase-admin')

var serviceAccount = require('./fitness-buddy-service-acct-key.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://fitness-buddy-57f3f.firebaseio.com'
})

module.exports = admin
