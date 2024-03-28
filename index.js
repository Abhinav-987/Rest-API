const express = require('express')
const mongoose = require('mongoose')
const createError = require('http-errors')
const dotenv = require('dotenv').config()

const PORT = process.env.PORT || 80

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended :  true}))

mongoose.connect(process.env.MONGODB_URI, {
    dbName : process.env.DB_NAME,
    user : process.env.DB_USER,
    pass : process.env.DB_PASS
})
.then(() => {
    console.log('Mongodb connected ... ')
})
.catch(err => console.log(err.message))

const UserRoute = require("./routes/user.route")
app.use('/user', UserRoute)

app.use((req, res, next) => {
    next(createError(404, 'Not Found'))
})

//Error Handler
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error : {
            status : err.status || 500,
            message : err.message
        }
    })
})

app.get('/test', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
    console.log('server started on port ' + PORT + '.....')
})
