const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// 載入 model
const Restaurant = require('../restaurant')
const User = require('../user')

const db = require('../../config/mongoose')

// 載入 json 檔案 ※注意命名邏輯一致
const restaurantList = require('./restaurants').results
const userList = require('./users').results

db.once('open', () => {
  Promise.all(
    userList.map(user => {
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