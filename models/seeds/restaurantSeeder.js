const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Restaurant = require('../restaurant')
const User = require('../user')

const db = require('../../config/mongoose')

const restaurantList = require('./restaurant').results
const SEED_USER = require('./users').users

db.once('open', () => {
  Promise.all(
    SEED_USER.map(user => {
      bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(user.password, salt))
        .then(hash => User.create({
          name: user.name,
          email: user.email,
          password: hash
        }))
        .then(user => {
          return Promise.all(Array.from({ length: 3 }, (_, i) => {
            const item = restaurantList[3 - i]
            item.userId = user._id
            restaurantList.splice(3 - i, 1)
            return Restaurant.create(item)
          }))
        })
    })
  )
    .then(() => {
      console.log('done')
      //process.exit()
    })
    .catch(err => console.log(err))
})