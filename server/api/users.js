const router = require('express').Router()
module.exports = router

// copied from https://github.com/firebase/snippets-web/blob/d01cdd5bb99621cf790b30505f1a2a9fec744584/firestore/test.solution-geoqueries.js#L13-L29

const firebase = require('./FirebaseSvc')
// import 'firebase/firestore';

const geofire = require('geofire-common')

/**
 * @type firebase.firestore.Firestore
 */
var db

function addHash(done) {
  console.log('hey I am in addHash')
  // [START fs_geo_add_hash]
  // Compute the GeoHash for a lat/lng point
  const lat = 51.5074
  const lng = 0.1278
  const hash = geofire.geohashForLocation([lat, lng])

  // Add the hash and the lat/lng to the document. We will use the hash
  // for queries and the lat/lng for distance comparisons.
  const londonRef = db.collection('cities').doc('LON')
  londonRef
    .update({
      geohash: hash,
      lat: lat,
      lng: lng
    })
    .then(() => {
      // [START_EXCLUDE]
      done()
      // [END_EXCLUDE]
    })
  // [END fs_geo_add_hash]
}

function queryHashes(done) {
  // [START fs_geo_query_hashes]
  // Find cities within 50km of London
  const center = [51.5074, 0.1278]
  const radiusInM = 50 * 1000

  // Each item in 'bounds' represents a startAt/endAt pair. We have to issue
  // a separate query for each pair. There can be up to 9 pairs of bounds
  // depending on overlap, but in most cases there are 4.
  const bounds = geofire.geohashQueryBounds(center, radiusInM)
  const promises = []
  for (const b of bounds) {
    const q = db
      .collection('cities')
      .orderBy('geohash')
      .startAt(b[0])
      .endAt(b[1])

    promises.push(q.get())
  }

  // Collect all the query results together into a single list
  Promise.all(promises)
    .then(snapshots => {
      const matchingDocs = []

      for (const snap of snapshots) {
        for (const doc of snap.docs) {
          const lat = doc.get('lat')
          const lng = doc.get('lng')

          // We have to filter out a few false positives due to GeoHash
          // accuracy, but most will match
          const distanceInKm = geofire.distanceBetween([lat, lng], center)
          const distanceInM = distanceInKm * 1000
          if (distanceInM <= radiusInM) {
            matchingDocs.push(doc)
          }
        }
      }

      return matchingDocs
    })
    .then(matchingDocs => {
      // Process the matching documents
      // [START_EXCLUDE]
      done(matchingDocs)
      // [END_EXCLUDE]
    })

  // [END fs_geo_query_hashes]
}
router.put('/firestore', async (req, res, next) => {
  try {
    console.log('im in firestore put route')
    addHash(done)
    queryHashes(done)
  } catch (err) {
    console.log(err)
  }
})

// original file starts here
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'email']
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

// router.put('/:userId/location', async (req, res, next) => {
//   try {
//     const user = await User.findByPk(req.params.userId)
//     await user.update(req.body)
//     const updated = await User.findAll({where: {id: req.params.userId}})
//     res.json(updated[0])
//   } catch (err) {
//     next(err)
//   }
// })

// router.get('/:userId/nearby', async (req, res, next) => {
//   try {
//     const user = await User.findByPk(req.params.userId)
//     const users = await User.findAll({
//       where: {
//         updatedAt: {
//           [Op.gte]: Sequelize.literal("NOW() - (INTERVAL '10 MINUTE')")
//         },
//         $and: Sequelize.where(
//           Sequelize.fn(
//             'ST_DWithin',
//             Sequelize.col('location'),
//             Sequelize.fn(
//               'ST_SetSRID',
//               Sequelize.fn(
//                 'ST_MakePoint',
//                 user.location.coordinates[0],
//                 user.location.coordinates[1]
//               ),
//               4326
//             ),
//             0.032
//           ),
//           true
//         )
//       }
//     })
//     res.json(users)
//   } catch (err) {
//     next(err)
//   }
// })
