'use strict'

const db = require('../server/db')
const {User} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const users = await Promise.all([
    User.create({
      uid: 'a1',
      email: 'cody@email.com',
      userName: 'cody',
      password: '123456',
      location: {type: 'Point', coordinates: [99.807224, -76.9847225]}
    }),
    User.create({
      uid: 'a2',
      email: 'murphy@email.com',
      password: '123456',
      userName: 'murphy',
      location: {type: 'Point', coordinates: [39.807224, -76.9847224]}
    }),
    User.create({
      uid: 'a3',
      userName: 'mikyla',
      email: 'mikyla@email.com',
      password: '123456',
      location: {type: 'Point', coordinates: [-122.4, 37.77]}
    }),
    User.create({
      uid: 'a4',
      userName: 'tyler',
      email: 'tyler@email.com',
      password: '123456',
      location: {type: 'Point', coordinates: [-122.42, 37.8]}
    })
  ])

  console.log(`seeded ${users.length} users`)
  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
