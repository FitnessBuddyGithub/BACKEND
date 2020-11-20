const router = require('express').Router()
const {User} = require('../db/models')
const Sequelize = require('sequelize')
const sequelize = new Sequelize('stackathon', 'yufanzhang', '882800bbZ', {
  host: 'localhost',
  dialect: 'postgres',
  logging: console.log,
  freezeTableName: true,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})
const {Op} = require('sequelize')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'email', 'location']
    })
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Max-Age', '1800')
    res.setHeader('Access-Control-Allow-Headers', 'content-type')
    res.setHeader(
      'Access-Control-Allow-Methods',
      'PUT, POST, GET, DELETE, PATCH, OPTIONS'
    )
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.get('/:userId/srid-check', async (req, res, next) => {
  try {
    query_result = await sequelize.query(
      `SELECT "id", ST_SRID(location) FROM "users"`
    )
    res.json(query_result)
  } catch (err) {
    next(err)
  }
})

router.put('/:userId/location', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId)
    await user.update(req.body)
    const updated = await User.findAll({where: {id: req.params.userId}})
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
