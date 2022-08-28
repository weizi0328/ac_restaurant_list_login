const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')


// 新增一筆 restaurant 資料
router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res) => {
  const userId = req.user._id
  return Restaurant.create({ ...req.body, userId })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


// 瀏覽特定一筆 restaurant 資料 (detail page)
router.get('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurantData => res.render('detail', { restaurantData }))
    .catch(error => console.log(error))
})


// 修改特定一筆 restaurant 資料
router.get('/:id/edit', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurantData) => res.render('edit', { restaurantData }))
    .catch(error => console.log(error))
})

// 觀摩 Olly 同學的寫法
router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const body = req.body
  return Restaurant.findOne({ _id, userId })
    .then(restaurantData => {
      restaurantData.name = body.name
      restaurantData.name_en = body.name_en
      restaurantData.category = body.category
      restaurantData.image = body.image
      restaurantData.location = body.location
      restaurantData.phone = body.phone
      restaurantData.google_map = body.google_map
      restaurantData.rating = body.rating
      restaurantData.description = body.description
      return restaurantData.save()
    })
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(error => console.log(error))
})


// 刪除特定一筆 restaurant 資料
router.delete('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  return Restaurant.findOne({ _id, userId })
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router