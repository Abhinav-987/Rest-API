const express = require('express')
const mongoose = require('mongoose')
const createError = require('http-errors')

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended :  true}))

// mongoose.connect('mongodb+srv://cluster0.o0sa0pz.mongodb.net', {
//     dbName : 'My_Db',
//     user : "abhinavk0212",
//     pass : "iot12345"
// })
mongoose.connect('mongodb+srv://abhinavk0212:iot12345@cluster0.ez5zvgw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => {
    console.log('Mongodb connected ... ')
})
.catch(err => console.log(err.message))

// app.all('/test', (req, res) => {
//     console.log(req.query)
//     res.send(req.query)
// })
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

app.listen(3000, () => {
    console.log('server started on port 3000....')
})