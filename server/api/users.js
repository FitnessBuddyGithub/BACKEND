const router = require('express').Router()
const {User} = require('../db/models')
const Sequelize = require('sequelize')
const {Op} = require('sequelize')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // attributes: {exclude: ['password']}
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})
router.get('/:id', async (req, res, next) => {
  try {
    const users = await User.findByPk(req.params.id)
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.put('/:userId/location', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId)
    await user.update(req.body)
    const updated = await User.findAll({where: {uid: req.params.userId}})
    res.json(updated[0])
  } catch (err) {
    next(err)
  }
})

router.get('/:userId/nearby', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId)
    const users = await User.findAll({
      where: {
        updatedAt: {
          [Op.gte]: Sequelize.literal("NOW() - (INTERVAL '10 MINUTE')")
        },
        $and: Sequelize.where(
          Sequelize.fn(
            'ST_DWithin',
            Sequelize.col('location'),
            Sequelize.fn(
              'ST_SetSRID',
              Sequelize.fn(
                'ST_MakePoint',
                user.location.coordinates[0],
                user.location.coordinates[1]
              ),
              0
            ),
            0.032
          ),
          true
        )
      }
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})
