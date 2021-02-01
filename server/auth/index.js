const router = require('express').Router()
const User = require('../db/models/user')
const admin = require('../../firebase.config')
module.exports = router

router.post('/login', async (req, res, next) => {
  try {
    const {token} = req.body
    const decodedToken = await admin.auth().verifyIdToken(token)

    const uid = decodedToken.uid

    const user = await User.findOne({
      where: {
        uid
      }
    })
    res.json(user)
  } catch (err) {
    next(err)
  }
})

router.post('/signup', async (req, res, next) => {
  try {
    const {token, email, userName} = req.body

    const decodedToken = await admin.auth().verifyIdToken(token)
    const uid = decodedToken.uid

    const [user] = await User.findOrCreate({
      where: {
        uid,
        email,
        userName
      }
    })

    res.json(user)
  } catch (err) {
    next(err)
  }
})

router.post('/logout', (req, res) => {
  req.logout()
  req.session.destroy()
  res.redirect('/')
})

router.get('/me', (req, res) => {
  res.json(req.user)
})

router.use('/google', require('./google'))
