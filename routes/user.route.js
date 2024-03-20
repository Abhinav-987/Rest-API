const express = require('express')
const createError = require('http-errors')
const mongoose = require('mongoose')
const router = express.Router()

const User = require("../models/users.models")


router.get('/', async (req, res, next) => {
    try{
        const results = await User.find()
        res.send(results)
    }catch(error){
        console.log(error.message)
    }
})

// router.get('/mac', async (req, res, next) => {
//     const { mac } = req.query;
//     console.log("MAC Address:", mac); // Log MAC address
//     try {
//         const user = await User.findOne({ mac_add: mac });
//         if (user) {
//             res.status(200).send({ user_id: user.user_id });
//         } else {
//             console.log("User not found for MAC:", mac); // Log if user not found
//             res.status(404).send({ error: "User not found" });
//         }
//     } catch (error) {
//         console.log("Error:", error.message); // Log any errors
//         res.status(500).send({ error: "Internal Server Error" });
//     }
// });

router.post('/', async (req, res, next) => {
    try {
        const user = new User(req.body)
        const result = await user.save()
        console.log(user);
        console.log(result);
        res.send(result)
    }catch(error){
        console.log(error.message)
    }
})

//main logic
router.post('/func', async (req, res, next) => {
    const { sender_id, receiver_id } = req.body;
    console.log(req.body)
    try {
        if (!sender_id || !receiver_id) {
            return res.status(400).json({ error: 'Both sender_id and receiver_id are required' });
        }
        const sender = await User.findOne({ user_id: sender_id });
        const receiver = await User.findOne({ user_id: receiver_id });
        if (!sender || !receiver) {
            return res.status(404).json({ error: 'Sender or receiver user not found' });
        }
        sender.connection = sender.connection || [];
        receiver.connection = receiver.connection || [];
        //to enshure uniqueness of the id inserted
        // const senderConnectionSet = new Set(sender.connection);
        // const receiverConnectionSet = new Set(receiver.connection);

        // senderConnectionSet.add(receiver_id);
        // receiverConnectionSet.add(sender_id);

        // sender.connection = Array.from(senderConnectionSet);
        // receiver.connection = Array.from(receiverConnectionSet);

        sender.connection.push({ user_id: receiver_id, connected_at: new Date() });
        receiver.connection.push({ user_id: sender_id, connected_at: new Date() });
        await sender.save();
        await receiver.save();
        res.status(200).json({ message: 'Connection populated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:id', async (req, res, next) => {
    // res.send('Getting a single product')
    const id = req.params.id
    try {
        const result = await User.findById(id)
        if(!result){
            throw createError(404, 'User Does Not exist')
        }
        res.send(result)    
    }catch(error){
        console.log(error.message)
        if(error instanceof mongoose.CastError){
            next(createError(400, "Invalid User id"))
            return
        }
        next(error)
    }

    // console.log(id)
    // res.send(id)
})

router.patch('/:id', async (req, res, next) => {
    // res.send('Updating a single product')
    const id = req.params.id
    try {
        const updates = req.body
        const result = await User.findByIdAndUpdate(id, updates)
        res.send(result)
    } catch(error) {
        console.log(error.message)
    }
    // console.log(id)
    // res.send(id)
})

router.delete('/:id', async (req, res, next) => {
    // res.send('Deleting a single product')
    const id = req.params.id
    try {
        const result = await User.findByIdAndDelete(id)
        res.send(result)
    } catch(error) {
        console.log(error.message)
    }
    // console.log(id)
    // res.send(id)
})

module.exports = router