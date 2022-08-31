const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// 載入 model
const Restaurant = require('../restaurant')
const User = require('../user')

const db = require('../../config/mongoose')

// 載入 json 檔案 
// 注意命名邏輯一致
const restaurantList = require('./restaurants').results
const userList = require('./users').results

// 觀摩 Howard 同學的寫法
db.once('open', () => {
  for (let i = 0; i < userList.length; i++) {
    bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(userList[i].password, salt))
      .then(hash => User.create({
        name: userList[i].name,
        email: userList[i].email,
        password: hash
      }))
      .then(user => {
        const userId = user._id
        // 取出 restaurants.json 中 restaurant id === userList.json 中 restaurant_needed 的資料
        let addRestaurants = restaurantList.filter(restaurant => {
          return userList[i].restaurant_needed.includes(restaurant.id)
        })
        return Promise.all(
          Array.from(addRestaurants, (value, index) => {
            value.userId = userId
            return Restaurant.create(value)
          })
        )
      })
      .then(() => {
        console.log('user & restaurant seeders loaded!')
        process.exit()
      })
      .catch(err => console.log(err))
  }
})