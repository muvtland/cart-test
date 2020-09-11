const express = require('express')
const router = express.Router()
const productsList = require('../products/products')
const redis = require('redis')
const client = redis.createClient()
const util = require('util')

const getAsync = util.promisify(client.get).bind(client)


router.get('/:uuid', async (req, res) => {
    try {
        const uuid = req.params.uuid
        const uuidExist = await getAsync(uuid)
        if (uuidExist) {
            return res.json(JSON.parse(uuidExist))
        } else {
            client.set(uuid, JSON.stringify(productsList))
        }
        res.json(productsList)
    } catch (e) {
        res.statusCode(400).send(e)
    }
})

router.post('/count', async (req, res) => {
    try {
        const {id, count, uuid} = req.body
        const uuidData = JSON.parse(await getAsync(uuid))
        if (uuidData) {
            uuidData.map(product => {
                if (product.id === id) {
                    product.count = count
                }
                return product
            })
            client.set(uuid, JSON.stringify(uuidData))
            res.json({message: 'ok'})
        } else {
            res.status(400).send({message: 'error'})
        }

    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/delete', async (req, res) => {
    try {
        const {id, uuid} = req.body
        const data = await getAsync(uuid)
        let uuidData = JSON.parse(data)

        if (uuidData) {
            uuidData = uuidData.filter(item => item.id !== id)
            client.set(uuid, JSON.stringify(uuidData))
            return res.json(uuidData)
        } else {
            res.status(400).send({message: 'error'})
        }
    } catch (e) {
        res.status(400).send(e)
    }
})


router.post('/clear', async (req, res) => {
    try {
        const uuid = req.body.uuid
        client.set(uuid, '[]', () => {
            res.json({message: 'cart cleared'})
        })
    } catch (e) {
        res.statusCode(400).send(e)
    }
})


module.exports = router