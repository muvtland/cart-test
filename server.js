const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const routeCart = require('./routes/cart.routes')
const redis = require('redis')
const client = redis.createClient()


const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/api/cart', routeCart)

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}


const PORT = process.env.PORT || 5000

client.on("error", function(error) {
    console.error(error)
})

client.on('connect', (error) => {
    if (!error){
        console.log('connected to redis db')
        app.listen(PORT, () => console.log(`Server started to port ${PORT}`))
    }
})
